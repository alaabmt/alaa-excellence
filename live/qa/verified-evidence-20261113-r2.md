# Tamayuz Live — conference evidence register, revision 2

**Checked 2026-11-13 03:10–05:15 UTC. Overall conference readiness: NO-GO.** Five critical gates have no production evidence. This register supersedes `verified-evidence-20261113.md` for the gates it lists. It is a factual ledger, not a certificate.

**Versions.** Published page: byte-identical to `live/index.html` at main `2e34f5a20ee797ea96000bb207d3903a15bc531a` (compared 03:50 UTC). Edge Function: version 23 is the last recorded value; **it could not be rechecked in this work** because no Supabase access was available. Work under test: pull request #211, head `b37ed36e3f336f87949c7ca2577ed81659fad6d0` (not merged, backend not deployed).

## What was measured

### Latency root cause (production, read-only probes, no data written)

| Probe (from a US host, 20–30 sequential requests each) | Result |
|---|---|
| Request with no database call | p50 46–54 ms |
| One database round trip, default routing (function ran in us-east-2) | p50 382–889 ms, p95 934–1,280 ms across two series |
| Same request with the function forced to each of 16 regions | Database cost lowest in `ap-south-1` (about 46 ms); 130–1,100 ms elsewhere |
| One database round trip through `forceFunctionRegion=ap-south-1` | p50 334 ms, p95 505 ms (about 286 ms of this is the US-to-India network leg) |

Conclusion: the function runs where the caller is, the database answers fastest from `ap-south-1`, and Edge version 23 makes 3–4 sequential round trips per audience poll and vote. That the database is hosted in `ap-south-1` is inferred from these timings, not read from the dashboard.

### Isolated stack, full profile — run https://github.com/alaabmt/alaa-excellence/actions/runs/43367003603

Environment: one GitHub runner with PostgreSQL 17, PostgREST 12.2.3 and the Edge Function source on Deno 2.9.6; synthetic data; no secrets; no production contact. Artifact `tamayuz-live-isolated-capacity-evidence`, SHA-256 `625985ee7dbd578ec7c55b5e4da00d4ad4c7d863d039acca9acbba109bab6a8a`. Clients are logical HTTP clients that follow the page's polling rules, plus 13 real Chromium browsers.

| Measure | Result |
|---|---|
| Ramp | 10 → 50 → 150 → 300 → 600, 60 s per step |
| Hold | 600 clients for 900 s; minimum connected during hold 600; 600 unique registrations |
| Load during hold | 189,451 requests, 211 requests/s average, 256 peak; at most 15 requests in flight |
| Poll latency in hold (p50/p95/p99/max) | 0 / 3 / 4 / 71 ms |
| Vote latency in hold (p50/p95/p99/max) | 3 / 4 / 6 / 66 ms |
| Polls answered without a database call | 67.3% |
| Steady-state errors, throttling (429), server errors | 0, 0, 0 |
| Questions cycled | 23 (17 fully inside the hold); every tally matched the clients' accepted votes |
| Vote coverage in hold | 100% of connected clients voted on each of the 17 questions |
| Votes stored | 11,456; 0 duplicates; 0 cross-session or invalid-option votes; no session above 600 registrations |
| Votes refused after "close voting" | 65 (expected: late taps) |
| Forced Edge process crash at 600 s into the hold | 424 failed requests; errors ended 2.1 s later; all 600 clients polling again within 8 s; no vote lost or duplicated |
| Database | at most 2 active queries, 10 connections of 100, 0 lock waiters |
| Simulated refreshes / signal losses | 825 / 387, no extra registrations |

These latencies reflect a database on the same machine. They show that the code and data model hold 600 clients with correct totals. They do **not** show production latency, Supabase quotas, or shared-platform limits.

### Before and after, same run (50 clients, 100 ms added to every database round trip)

| Code | Poll p50 / p95 / p99 | Vote p50 / p95 | Join p95 |
|---|---|---|---|
| Baseline source of version 23 with 2 s polling | 411 / 414 / 418 ms | 410 / 414 ms | 238 ms |
| Pull request #211 source with page polling | 1 / 105 / 105 ms | 104 / 105 ms | 108 ms |

### Other results in the same run

- **Deploy-order safety:** new Edge source on a database without the new SQL functions: 40 clients, all tallies matched, 0 errors (it used the old queries).
- **Real Chromium rehearsal (12 audience browsers + presenter; English and Arabic RTL; phone, 320 px and desktop viewports):** 12 of 12 steps passed twice, once on an idle backend and once during the 600-client hold. Tap-to-confirmation p95 150 ms idle, 180 ms under load. A newly opened question reached every browser within 3.9 s (bounded by the 3 s polling). Covered: join by public link, voting by tap, no answer key before reveal, refresh, second tab, two phones offline for 9 s then recovering, close, reveal, end.
- **SQL tests** on PostgreSQL 17: passed (answer key hidden before reveal, one vote per participant, privileges, rollback).

### Defects reproduced on the published page and fixed in pull request #211

1. After a failed first load the attendee stayed on the Retry panel although the connection had returned.
2. The "Connection interrupted" warning did not clear after recovery.
3. A second tab or a rescanned QR code created a new participant (a second seat and a second voter).
4. "Open voting" on a fresh session opened with no active question.
5. The presenter screen showed no join link when the QR library did not load.

### Rollback and recovery tooling

- **Page rollback rehearsal (local, nothing pushed):** squash-merge of the pull request followed by `git revert` produced a tree identical to main `2e34f5a20ee797ea96000bb207d3903a15bc531a`.
- **Backup and restore scripts** (`recovery/live-backup.sh`, `recovery/live-restore-verify.sh`): rehearsed on synthetic local data (600 participants, 294 votes): encrypted backup, modified file rejected, non-local restore target refused, restore plus verification about 0.5 s, content fingerprint matched. **Not run on production.**

### Monitoring

- The 15-minute schedule started **1 run in about 7 hours** (expected about 28): https://github.com/alaabmt/alaa-excellence/actions/runs/43348844649 is the only scheduled run since 2026-11-12 21:18 UTC.
- The extended monitor (database-path probe on the attendee route) ran read-only at 03:41 UTC: healthy, 452 ms pinned, 921 ms default routing.

## Gate table

| Gate | Decision | Evidence | Environment | Remaining risk | Independent verifier |
|---|---|---|---|---|---|
| Deployment provenance | **NOT VERIFIED** | Page matches main `2e34f5a` | Production page only | Edge version not rechecked | None |
| Owner authorization (positive) | **NOT VERIFIED** | Self-check page extended and tested with a mocked session only | — | No genuine owner login observed | Required, none |
| Critical journeys | **NOT VERIFIED** for production; PASS on isolated stack | Run 43367003603, browser rehearsal twice | Isolated CI, emulated browsers | Owner dashboard journey and physical phones untested | None |
| Conference capacity | **NOT VERIFIED** for production; PASS on isolated stack | Run 43367003603, 600 clients for 900 s | Isolated CI, logical clients | Supabase quotas and compute, network distance, backend not deployed, Free plan allowance below one event hour | None |
| Monitoring and alert delivery | **FAIL** (schedule) / NOT VERIFIED (acknowledgement) | 1 scheduled run in about 7 hours | Production | No human acknowledgement, no backup on-call | None |
| Recovery | **NOT VERIFIED** | Tooling rehearsed on synthetic data; page rollback rehearsed | Local | No production backup exists or was restored; Edge rollback not rehearsed | None |
| Vote data integrity | PASS on isolated stack at 600 clients; production invariants last checked in revision 1 | Run 43367003603 database checks | Isolated CI | Production not rechecked in this work | None |
| Abuse resistance | **NOT VERIFIED** | Code review only | — | No rate limiting: anyone with the public join code can script 600 joins and fill the session | None |
| Physical devices (secondary) | NOT VERIFIED | — | — | No iPhone or Android device tested | — |
| Accessibility, privacy, independent security (secondary) | NOT VERIFIED | — | — | — | — |

## Exact next actions

1. **Account owner:** connect Supabase access or run `deploy-hot-path.md`; then repeat the 10-client production diagnostic to get real after-deployment latency.
2. **Account owner:** sign in, open `/live/qa/owner-auth-check.html`, run it, and give the output to an independent verifier.
3. **Account owner:** decide the Supabase plan for the event month (see `capacity-certification-plan.md`), and approve a production-like 600-browser test with a cost ceiling and an abort owner.
4. **Operator:** run `live-backup.sh` and `live-restore-verify.sh` against production and file the restore report.
5. **Event owner:** fill the people table in `event-day-runbook.md`, acknowledge one test alert, and test on one iPhone and one Android phone.
6. **Decision needed:** how to limit scripted joins without blocking a shared conference Wi-Fi address.

**Decision rule applied:** any critical gate without evidence means NO-GO. Green CI on an isolated stack is not a conference GO.
