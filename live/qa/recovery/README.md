# Tamayuz Live — isolated PostgreSQL recovery rehearsal

This automated exercise uses **a real PostgreSQL 17 server and PostgreSQL pg_dump / pg_restore binaries**, but **ONLY fabricated data**. It simulates a loss by removing the disposable *source database*, restores a PostgreSQL custom-format archive into a *new disposable database*, checks integrity and measures restore time. It never connects to Supabase, never touches production votes and does not use real session codes, user data, presenter tokens, passwords, question text or medical content.

The Live-only schema model matches the table/column/constraint shapes read from the live PostgreSQL catalog on 2026-11-13. It does **not** implement an automatic production snapshot, prove a genuine backup is available, or prove full Supabase Auth / Edge failover. The Live-only RPC SQL is taken directly from live/backend/sql/live_atomic_operations.sql and exercised against the restored database with ROLLBACK. Existing RLS and vote-uniqueness checks are asserted. Synthetic role and owner data are fabricated.

**How to run:** On pull requests that touch these files, on main changes to this drill, or by selecting GitHub Actions → “Tamayuz Live Isolated PostgreSQL Recovery Drill” → Run workflow. No recurring monitoring, paid project, new Supabase branch or production load is created.

**Expected successful result:** The GitHub Actions artifact includes report.json, pg_restore manifest and verification logs. Its RTO applies only to a tiny fixture on a GitHub Actions runner; the RPO is zero because there are no changes between the snapshot and the simulated loss. It is not a production recovery claim.

**The production recovery P0 gate stays NOT VERIFIED** until a genuine recent production backup can be restored and independently checked in a separated infrastructure environment with real auth/Edge integration and agreed production RTO/RPO. Do not use this synthetic backup as an operational recovery medium.

**Safety:** The executable rejects any database host other than loopback; commands target only tamayuz_live_drill_source and tamayuz_live_drill_restored inside the ephemeral PostgreSQL container. Changes to shared site sections, CPHQ and unrelated SQL are prohibited.
