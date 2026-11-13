# Tamayuz Live — isolated PostgreSQL recovery rehearsal

This automated exercise uses **a real PostgreSQL 17 server and PostgreSQL pg_dump / pg_restore binaries**, but **ONLY fabricated data**. It simulates a loss by removing the disposable *source database*, restores a PostgreSQL custom-format archive into a *new disposable database*, checks integrity and measures restore time. It never connects to Supabase, never touches production votes and does not use real session codes, user data, presenter tokens, passwords, question text or medical content.

The Live-only schema model matches the table/column/constraint shapes read from the live PostgreSQL catalog on 2026-11-13. It does **not** implement an automatic production snapshot, prove a genuine backup is available, or prove full Supabase Auth / Edge failover. The Live-only RPC SQL is taken directly from live/backend/sql/live_atomic_operations.sql and exercised against the restored database with ROLLBACK. Existing RLS and vote-uniqueness checks are asserted. Synthetic role and owner data are fabricated.

**How to run:** On pull requests that touch these files, on main changes to this drill, or by selecting GitHub Actions → “Tamayuz Live Isolated PostgreSQL Recovery Drill” → Run workflow. No recurring monitoring, paid project, new Supabase branch or production load is created.

**Expected successful result:** The GitHub Actions artifact includes report.json, pg_restore manifest and verification logs. Its RTO applies only to a tiny fixture on a GitHub Actions runner; the RPO is zero because there are no changes between the snapshot and the simulated loss. It is not a production recovery claim.

**The production recovery P0 gate stays NOT VERIFIED** until a genuine recent production backup can be restored and independently checked in a separated infrastructure environment with real auth/Edge integration and agreed production RTO/RPO. Do not use this synthetic backup as an operational recovery medium.

**Safety:** The executable rejects any database host other than loopback; commands target only tamayuz_live_drill_source and tamayuz_live_drill_restored inside the ephemeral PostgreSQL container. Changes to shared site sections, CPHQ and unrelated SQL are prohibited.

## Protected production backup and isolated restore (operator-run)

The synthetic drill above does not prove production recovery. Two scripts close that gap **when an authorized operator runs them**; they are never run in CI and need no repository secret.

1. `live-backup.sh <private dir>` — read-only on production. Exports only the eight `public.live_*` tables (schema, data, grants, row level security) with `pg_dump`, encrypts the file at once with GnuPG AES-256, deletes the plain dump and writes a manifest with SHA-256, row counts and a content fingerprint. It refuses any connection string that is not the Tamayuz Live project.
2. `live-restore-verify.sh <manifest.json>` — restores into a **local isolated PostgreSQL** (refuses any other host), re-applies the Live SQL functions from this repository, then checks relationships, vote uniqueness, row level security, privileges, owner allowlist linkage and the audience view / vote / tally functions on the restored data (rolled back). It compares the restored content fingerprint with the manifest and reports restore time.

Requirements: PostgreSQL client tools at least as new as the server (17), `gpg`, and a passphrase file of at least 24 characters kept apart from the backup. Keep the encrypted file and manifest off the laptop (for example in a private cloud drive); never commit them.

**Evidence on 2026-11-13:** both scripts were rehearsed end to end on synthetic local data (600 participants, 294 votes): backup, encryption, tamper detection (modified file rejected), restore, verification and fingerprint match; restore plus verification took about 0.5 s. **They have not yet been run against production**, because no operator database credential was available to this work. The production recovery gate stays NOT VERIFIED until the operator runs both scripts and files the restore report. What the restore does not cover: Supabase Auth sign-in, Edge Function deployment and DNS/Pages.
