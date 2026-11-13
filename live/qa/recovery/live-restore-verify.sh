#!/usr/bin/env bash
# Tamayuz Live — restore a protected backup into an ISOLATED local PostgreSQL and verify it.
# Never connects to Supabase and refuses any non-loopback target. Creates one new database,
# restores, re-applies the Live SQL functions from this repository, verifies relationships,
# access controls and backend functions, compares the content fingerprint with the manifest
# and reports recovery time. Prints counts and hashes only, never row content.
#
#   docker run -d --name live-restore -e POSTGRES_PASSWORD=local-only -p 127.0.0.1:55432:5432 postgres:17
#   export PGHOST=127.0.0.1 PGPORT=55432 PGUSER=postgres PGPASSWORD=local-only
#   export LIVE_BACKUP_PASSPHRASE_FILE=/secure/path
#   live/qa/recovery/live-restore-verify.sh /secure/dir/tamayuz-live-<stamp>.manifest.json
set -Eeuo pipefail
umask 077
MANIFEST="${1:?usage: live-restore-verify.sh <manifest.json>}"
: "${PGHOST:?}" "${PGUSER:?}" "${LIVE_BACKUP_PASSPHRASE_FILE:?}"
case "$PGHOST" in 127.0.0.1|localhost|/*) ;; *) echo "REFUSING: restore target must be a local isolated PostgreSQL" >&2; exit 91 ;; esac
HERE="$(cd "$(dirname "$0")" && pwd)"; REPO="$(cd "$HERE/../../.." && pwd)"
DIR="$(cd "$(dirname "$MANIFEST")" && pwd)"
field() { python3 -c 'import json,sys;d=json.load(open(sys.argv[1]));v=d
for k in sys.argv[2].split("."): v=v[k]
print(v)' "$MANIFEST" "$1"; }
ENC="$DIR/$(field encrypted_file)"
test -s "$ENC" || { echo "Encrypted backup not found next to the manifest" >&2; exit 92; }
[ "$(sha256sum "$ENC" | cut -d' ' -f1)" = "$(field encrypted_sha256)" ] || { echo "Encrypted file does not match the manifest SHA-256" >&2; exit 93; }
TARGET="tamayuz_live_restore_$(date -u +%Y%m%d%H%M%S)"
PLAIN="$(mktemp)"; trap 'rm -f "$PLAIN"' EXIT
START_NS="$(date +%s%N)"
gpg --batch --yes --quiet --decrypt --passphrase-file "$LIVE_BACKUP_PASSPHRASE_FILE" --output "$PLAIN" "$ENC"
createdb "$TARGET"
export PGDATABASE="$TARGET"
# Platform objects the Live tables depend on (Supabase provides these in production).
psql -X -q -v ON_ERROR_STOP=1 <<'SQL'
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role NOLOGIN BYPASSRLS; END IF;
END $$;
-- Other Supabase platform roles that production grants may name; harmless placeholders here.
DO $$ DECLARE r text; BEGIN
  FOREACH r IN ARRAY ARRAY['supabase_admin','dashboard_user','authenticator','supabase_auth_admin','supabase_storage_admin'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname=r) THEN EXECUTE format('CREATE ROLE %I NOLOGIN', r); END IF;
  END LOOP;
END $$;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY);
SQL
pg_restore --exit-on-error --no-owner --section=pre-data -d "$TARGET" "$PLAIN"
pg_restore --exit-on-error --no-owner --section=data -d "$TARGET" "$PLAIN"
# Stand-in identity rows so the owner allowlist foreign key can be re-created.
psql -X -q -v ON_ERROR_STOP=1 -c "INSERT INTO auth.users(id) SELECT user_id FROM public.live_owner_accounts"
pg_restore --exit-on-error --no-owner --section=post-data -d "$TARGET" "$PLAIN"
psql -X -q -v ON_ERROR_STOP=1 -c "GRANT USAGE ON SCHEMA public TO service_role; GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role; GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;"
psql -X -q -v ON_ERROR_STOP=1 -f "$REPO/live/backend/sql/live_atomic_operations.sql" 2>/dev/null
psql -X -q -v ON_ERROR_STOP=1 -f "$REPO/live/backend/sql/live_hot_path.sql"
RESTORED_NS="$(date +%s%N)"
VERIFY_LOG="$(psql -X -qAt -v ON_ERROR_STOP=1 -f "$HERE/verify-restored.sql" 2>&1)" || true
echo "$VERIFY_LOG" | grep -q TAMAYUZ_LIVE_RESTORE_VERIFIED || { echo "RESTORE VERIFICATION FAILED:" >&2; echo "$VERIFY_LOG" | grep -E "ERROR" | head -5 >&2; exit 95; }
GOT="$(psql -X -qAt -v ON_ERROR_STOP=1 -f "$HERE/fingerprint-live.sql" | grep '|')"
WANT_FP="$(field content_fingerprint_md5)"
[ "${GOT%%|*}" = "$WANT_FP" ] || { echo "RESTORE MISMATCH: restored content fingerprint differs from the manifest" >&2; exit 94; }
END_NS="$(date +%s%N)"
REPORT="$DIR/$(basename "$MANIFEST" .manifest.json).restore-report.json"
cat > "$REPORT" <<JSON
{
  "assessment": "TAMAYUZ_LIVE_BACKUP_RESTORE_VERIFIED",
  "backup_source": "$(field source)",
  "backup_created_at_utc": "$(field created_at_utc)",
  "restored_at_utc": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "target": "isolated local PostgreSQL $(psql -X -qAt -c 'SHOW server_version' | cut -d' ' -f1), database $TARGET",
  "encrypted_sha256": "$(field encrypted_sha256)",
  "content_fingerprint_matches_manifest": true,
  "restored_row_counts": "$(echo "$GOT" | cut -d'|' -f2- )",
  "verified": "relationships, vote uniqueness, row level security, anon/authenticated privileges, owner allowlist linkage, seven Live SQL functions, audience view / vote / tally on restored data (rolled back)",
  "restore_ms": $(( (RESTORED_NS-START_NS)/1000000 )),
  "restore_plus_verification_ms": $(( (END_NS-START_NS)/1000000 )),
  "production_writes": 0,
  "not_covered": "Supabase Auth sign-in, Edge Function deployment and DNS/Pages; see event-day runbook"
}
JSON
cat "$REPORT"
echo "Restored database '$TARGET' is disposable: dropdb $TARGET"
