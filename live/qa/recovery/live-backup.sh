#!/usr/bin/env bash
# Tamayuz Live — protected Live-only production backup. OPERATOR-RUN ONLY (never in CI).
# Read-only on the source: pg_dump and one read-only fingerprint query. It never writes to,
# resets or alters the production database. Only the eight public.live_* tables are exported;
# CPHQ, Auth users and every other object are left out. The plain dump is encrypted at once
# and removed. Nothing sensitive is printed.
#
#   export LIVE_DB_URL='postgresql://...'            # from Supabase dashboard > Connect (keep private)
#   export LIVE_BACKUP_PASSPHRASE_FILE=/secure/path  # a file holding a long random passphrase
#   live/qa/recovery/live-backup.sh /secure/output/dir
set -Eeuo pipefail
umask 077
PROJECT_REF="dqrsjhcfmpjhcxvtxosy"
OUT_DIR="${1:?usage: live-backup.sh <private output directory>}"
: "${LIVE_DB_URL:?Set LIVE_DB_URL (never paste it into chat, CI or a repository)}"
: "${LIVE_BACKUP_PASSPHRASE_FILE:?Set LIVE_BACKUP_PASSPHRASE_FILE}"
test -s "$LIVE_BACKUP_PASSPHRASE_FILE" || { echo "Passphrase file is empty" >&2; exit 2; }
[ "$(wc -c < "$LIVE_BACKUP_PASSPHRASE_FILE")" -ge 24 ] || { echo "Passphrase must be at least 24 characters" >&2; exit 2; }
case "$LIVE_DB_URL" in
  *"$PROJECT_REF"*) SOURCE_KIND="production" ;;
  *@127.0.0.1:*|*@localhost:*)
    [ "${LIVE_BACKUP_REHEARSAL:-}" = "loopback-synthetic" ] || { echo "REFUSING: loopback source needs LIVE_BACKUP_REHEARSAL=loopback-synthetic" >&2; exit 3; }
    SOURCE_KIND="synthetic-rehearsal" ;;
  *) echo "REFUSING: connection string is not the Tamayuz Live project ($PROJECT_REF)" >&2; exit 3 ;;
esac
HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$OUT_DIR"; cd "$OUT_DIR"
for tool in pg_dump psql gpg sha256sum; do command -v "$tool" >/dev/null || { echo "Missing tool: $tool" >&2; exit 4; }; done
SERVER_MAJOR="$(psql "$LIVE_DB_URL" -X -qAt -c 'SHOW server_version_num' | cut -c1-2)"
CLIENT_MAJOR="$(pg_dump --version | grep -oE '[0-9]+' | head -1)"
[ "$CLIENT_MAJOR" -ge "$SERVER_MAJOR" ] || { echo "pg_dump $CLIENT_MAJOR is older than the server ($SERVER_MAJOR); install a matching client" >&2; exit 5; }
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
NAME="tamayuz-live-$STAMP"
PLAIN="$(mktemp "$OUT_DIR/.plain.XXXXXX")"
trap 'rm -f "$PLAIN"' EXIT
START_NS="$(date +%s%N)"
BEFORE="$(psql "$LIVE_DB_URL" -X -qAt -v ON_ERROR_STOP=1 -f "$HERE/fingerprint-live.sql" | grep '|')"
# Schema + data + grants + RLS flags of the Live tables only, from one consistent snapshot.
pg_dump "$LIVE_DB_URL" --format=custom --no-owner --table='public.live_*' --file="$PLAIN"
AFTER="$(psql "$LIVE_DB_URL" -X -qAt -v ON_ERROR_STOP=1 -f "$HERE/fingerprint-live.sql" | grep '|')"
CONSISTENT=true; [ "$BEFORE" = "$AFTER" ] || CONSISTENT=false
gpg --batch --yes --quiet --symmetric --cipher-algo AES256 --s2k-digest-algo SHA512 --s2k-count 65011712 \
    --passphrase-file "$LIVE_BACKUP_PASSPHRASE_FILE" --output "$NAME.dump.gpg" "$PLAIN"
if command -v shred >/dev/null; then shred -u "$PLAIN"; else rm -f "$PLAIN"; fi
trap - EXIT
IFS='|' read -r FP C_PRES C_Q C_SES C_PART C_VOTES C_EV C_OWN C_CFG <<< "$AFTER"
cat > "$NAME.manifest.json" <<JSON
{
  "kind": "tamayuz-live-protected-backup",
  "source": "$SOURCE_KIND",
  "project_ref": "$PROJECT_REF",
  "created_at_utc": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "server_major": $SERVER_MAJOR,
  "scope": "public.live_* tables only (schema, data, grants, row level security flags)",
  "encrypted_file": "$NAME.dump.gpg",
  "encrypted_sha256": "$(sha256sum "$NAME.dump.gpg" | cut -d' ' -f1)",
  "encrypted_bytes": $(stat -c%s "$NAME.dump.gpg" 2>/dev/null || stat -f%z "$NAME.dump.gpg"),
  "encryption": "GnuPG symmetric AES-256; passphrase held separately by the operator",
  "content_fingerprint_md5": "$FP",
  "source_unchanged_during_backup": $CONSISTENT,
  "row_counts": {"presentations": $C_PRES, "questions": $C_Q, "sessions": $C_SES, "participants": $C_PART,
                 "votes": $C_VOTES, "interaction_events": $C_EV, "owner_accounts": $C_OWN, "config": $C_CFG},
  "backup_duration_ms": $(( ($(date +%s%N)-START_NS)/1000000 )),
  "production_writes": 0
}
JSON
echo "Backup written: $OUT_DIR/$NAME.dump.gpg"
echo "Manifest:       $OUT_DIR/$NAME.manifest.json (counts and hashes only; keep it with the backup)"
echo "Next: store both files off this machine, keep the passphrase elsewhere, then run live-restore-verify.sh."
[ "$CONSISTENT" = true ] || echo "NOTE: data changed while the backup ran (a session was active). The backup is still one consistent snapshot; restore verification compares against the manifest, so rerun when no session is active."
