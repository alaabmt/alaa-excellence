# Tamayuz Live — deploying the single-round-trip backend (Edge version 24 candidate)

**Status on 2026-11-13: NOT DEPLOYED.** Production still runs Edge Function version 23. The page changes in the same pull request are already compatible with version 23. This deployment needs an operator with access to the Supabase project `tamayuz10x-auth` (`dqrsjhcfmpjhcxvtxosy`). It changes only the `tamayuz-live` Edge Function and adds four `live_*` SQL functions. It does not touch tables, data, Auth, CPHQ or billing.

## Why it is safe to deploy in this order

1. **SQL first.** `live/backend/sql/live_hot_path.sql` only creates functions (`CREATE OR REPLACE FUNCTION`, `REVOKE`, `GRANT`). Version 23 does not call them, so nothing changes yet.
2. **Edge Function second.** The new `live/backend/index.ts` calls those functions. If they are missing it falls back to the old queries by itself (tested in CI on a database without the SQL).
3. **Page already live.** The page works with both versions (tested in real Chromium with and without revision support).

## Steps

| # | Action | Check |
|---|---|---|
| 1 | Confirm no real session is open. Record row counts of the eight `live_*` tables. | Counts saved |
| 2 | Take a protected backup: `live/qa/recovery/live-backup.sh` (see `recovery/README.md`). | Manifest written |
| 3 | Run `live/backend/sql/live_hot_path.sql` in the SQL editor. | `SELECT proname FROM pg_proc WHERE proname IN ('live_audience_view','live_cast_vote','live_vote_aggregate','live_track_interaction');` returns 4 rows |
| 4 | Confirm privileges: `SELECT has_function_privilege('anon','public.live_cast_vote(text,text,text)','EXECUTE');` | `false` (same for `authenticated`) |
| 5 | Note the current function version (23). Deploy `live/backend/index.ts` as `tamayuz-live` with JWT verification setting unchanged. | New version ACTIVE |
| 6 | Read-only probe: `curl -s -X POST -H 'content-type: application/json' -d '{"action":"view","code":"monitor-no-such-session"}' '<function URL>?forceFunctionRegion=ap-south-1'` | HTTP 404 `{"error":"Session not found"}` |
| 7 | Run the GitHub workflow "Tamayuz Live 15-Minute Health and Alert Route" manually. | HEALTHY, `db_path_pinned` under 1500 ms |
| 8 | Create one disposable presentation and session, run `tamayuz-live-real-backend-rehearsal`, then delete only that presentation. | Rehearsal green; row counts equal step 1 |

## Rollback (no data is touched in any step)

- **Edge Function:** redeploy the previous source (`git show <previous main SHA>:live/backend/index.ts`, also frozen at `tests/tamayuz-live-isolated-baseline-index.ts`). Version 23 behaviour returns at once. The SQL functions can stay; nothing calls them.
- **SQL (optional):** `DROP FUNCTION public.live_audience_view(text,text), public.live_cast_vote(text,text,text), public.live_vote_aggregate(uuid,uuid), public.live_track_interaction(text,text,uuid,text);` The new Edge Function then uses the old queries automatically.
- **Page:** revert the pull request merge commit on `main`; GitHub Pages republishes the previous page in about one minute.

## Expected effect (measured, not promised)

Production measurements on 2026-11-13 with read-only probes: a request without a database call takes about 50 ms; one database round trip takes about 50 ms when the function runs in `ap-south-1` and 350–900 ms from US regions. Version 23 needs 3–4 round trips for each audience poll and vote; the new function needs one, and most polls need none. Real production numbers after deployment must be measured with the bounded 10-client diagnostic before any claim is recorded.
