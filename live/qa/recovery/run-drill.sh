#!/usr/bin/env bash
# Disposable local PostgreSQL 17 recovery rehearsal only; no Supabase secrets.
set -Eeuo pipefail
test -n "$PGHOST" && test -n "$PGUSER" && test -n "$PGPASSWORD"
test "$PGHOST" = "127.0.0.1" && test "$PGUSER" = "postgres" || {
  echo "REFUSING: recovery drill requires local isolated postgres" >&2
  exit 91
}
test -n "$OUT_DIR" && test -n "$WORKSPACE"
cd "$WORKSPACE"
mkdir -p "$OUT_DIR"
SOURCE=tamayuz_live_drill_source
TARGET=tamayuz_live_drill_restored
S=live/qa/recovery
pg_isready -h "$PGHOST" -U "$PGUSER" -t 10 >/dev/null
psql -X -v ON_ERROR_STOP=1 -d postgres -qAt -c \
  'CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN;'
createdb "$SOURCE"
psql -X -v ON_ERROR_STOP=1 -d "$SOURCE" -q -f "$S/schema.sql"
psql -X -v ON_ERROR_STOP=1 -d "$SOURCE" -q -f live/backend/sql/live_atomic_operations.sql
psql -X -v ON_ERROR_STOP=1 -d "$SOURCE" -q -f "$S/synthetic-seed.sql"
psql -X -v ON_ERROR_STOP=1 -d "$SOURCE" -q -f "$S/verify.sql" > "$OUT_DIR/source-checks.log"
BEFORE="$(psql -X -v ON_ERROR_STOP=1 -d "$SOURCE" -qAt -f "$S/fingerprint.sql")"
[[ "$BEFORE" =~ ^[0-9a-f]{32}$ ]] || exit 92
pg_dump -Fc --no-owner -n public -n auth -d "$SOURCE" -f "$OUT_DIR/synthetic-live.dump"
test -s "$OUT_DIR/synthetic-live.dump"
pg_restore -l "$OUT_DIR/synthetic-live.dump" > "$OUT_DIR/manifest.txt"
# Destroy ONLY the fake source database on the ephemeral CI service.
dropdb "$SOURCE"
if psql -X -d "$SOURCE" -qAt -c "SELECT 1" >/dev/null 2>&1; then
  echo "Fake database was not destroyed" >&2; exit 93
fi
RESTORE_START="$(date +%s%N)"
createdb "$TARGET"
pg_restore --exit-on-error --no-owner -d "$TARGET" "$OUT_DIR/synthetic-live.dump"
psql -X -v ON_ERROR_STOP=1 -d "$TARGET" -q -f "$S/verify.sql" > "$OUT_DIR/restored-checks.log"
AFTER="$(psql -X -v ON_ERROR_STOP=1 -d "$TARGET" -qAt -f "$S/fingerprint.sql")"
test "$BEFORE" = "$AFTER" || { echo "Restored data differs from snapshot" >&2; exit 94; }
RTO_MS="$(( ($(date +%s%N)-RESTORE_START)/1000000 ))"
SHA="$(sha256sum "$OUT_DIR/synthetic-live.dump" | cut -d ' ' -f1)"
SIZE="$(stat -c%s "$OUT_DIR/synthetic-live.dump")"
NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
cat > "$OUT_DIR/report.json" <<JSON
{
  "assessment": "SYNTHETIC_POSTGRESQL_RESTORE_PASS",
  "production_backup_restore_proven": false,
  "environment": "Disposable PostgreSQL 17 in GitHub Actions",
  "production_writes": 0,
  "dataset": "Synthetic only; no real users, tokens, session codes or questions",
  "source_loss": "Original disposable database intentionally dropped",
  "recovery": "Restore PostgreSQL custom-format dump to new disposable database",
  "timestamp_utc": "$NOW",
  "git_sha": "$GITHUB_SHA",
  "dump_sha256": "$SHA",
  "dump_bytes": $SIZE,
  "synthetic_restore_rto_ms": $RTO_MS,
  "synthetic_snapshot_md5": "$BEFORE",
  "synthetic_rpo": "0 recorded mutations between snapshot and simulated loss",
  "verification": "Schema, exact counts, fingerprint, FKs, unique votes, RLS, role privileges, owner mapping and three Live RPCs passed",
  "production_recovery_gate": "NOT_VERIFIED",
  "reason": "A real production backup was not restored to a separate operating Supabase environment."
}
JSON
cat "$OUT_DIR/report.json"
