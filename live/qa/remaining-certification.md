# Tamayuz Live — remaining release evidence (2026-11-13)

**Decision: NO-GO for 600-person conference certification** until each required P0 has actual independent evidence. A passed synthetic, small-load or source-based test cannot be relabeled as a 600-browser production test. Only Tamayuz Live is in scope; no changes to global Auth, other sites, CPHQ, shared projects or billing.

## Owner authentication

Current backend \`tamayuz-live\` validates a real Supabase user JWT through \`auth.getUser\` and requires that user's ID in \`live_owner_accounts\`. **One** owner is allowlisted. Negative tests and presenter-positive tests have passed. A real owner JWT has not been provided to this testing environment; administrative database access is **not** an owner browser session.

**Read-only user-executable test:** Visit \`https://tamayuz10x.com/live/qa/owner-auth-check.html\` on the same browser where you sign in to the existing site. Click **Run authenticated read-only checks**. The browser validates positive owner_status, list, list_sessions, presentation_workspace and review_results; also rejects an invalid JWT and anonymous access. Copy the result only if sharing with an approved verifier; the report deliberately omits tokens, user IDs, join codes, titles and question data. Its metadata still needs independent SHA/Edge version verification. Do not paste access tokens into CI or chat, create test identities in shared Auth, or alter the owner allowlist for testing.

## Capacity

- Last verified real-backend three-person rehearsal: 28 requests, 3 unique votes, p95 2088 ms. Green functional test is not a load certificate.
- A recent backend v23 aggregated log sample (168 POSTs, 149 200s, 0 429, 0 5xx) recorded p50 782 ms, p95 ~2475 ms, p99 ~3542 ms for successful executions; this is an observation from provider execution-time logs, not an agreed event SLO.
- Limited 10-client/60-second real-backend test is a **bounded diagnostic** only; its results must be read from its own immutable Actions artifact after the PR run. It cannot certify 600 actual simultaneous browsers.
- Full P0 requires authorized separate capacity environment, named abort owner, provider quota, cost ceiling, actual 600 concurrently connected browser contexts for >=15 minutes, realistic polling/voting/reconnect and agreed latency/vote thresholds. At current 2-second polling, 600 clients may generate ~270,000 polls in 15 minutes; do not run this on the real event or unapproved Free project.

## Production disaster recovery

- The isolated PostgreSQL 17 synthetic database-loss/restore exercise passed: https://github.com/alaabmt/alaa-excellence/actions/runs/43306128962 ; synthetic RTO was 278 ms on a tiny fixture, not an outage measurement.
- Live relies on GitHub Pages, the \`tamayuz-live\` Edge Function and eight \`public.live_*\` tables. The shared Auth account and identity linkage are dependencies. No GitHub rollback restores deleted votes.
- The Supabase organization is on Free; **automatic daily backups and PITR are not included**. Supabase recommends creating secure manual logical backups using its CLI: https://supabase.com/docs/guides/platform/backups
- No genuine current production database backup with an independently verified SHA-256 has been retrieved; no full restore into a separate authenticated project was completed. **Recovery P0 remains NOT VERIFIED**.
- Required evidence: a fresh encrypted private Live-only backup, protected off-site retention and restoration keys, complete RLS/functions/auth linkage and service integration in isolated infrastructure, actual measured RTO/RPO, explicit retention and loss tolerance, owner-verified recovery and independent artifact link. Never commit production dump, hashes of bearer credentials, owner email, join codes or answers to a public repository; never restore to the live production database for testing.
- The provider limits mean an isolated production-like project may require a subscription/budget/explicit user consent. Do not open paid resources by default. A whole-DB backup contains out-of-scope data; restrict Live-only exports and preserve ownership/restore dependencies separately.

## Operational readiness

- \`.github/workflows/tamayuz-live-monitor.yml\` checks the public page and Live API every 15 minutes and creates a deduplicated GitHub incident issue on sustained failures; a 2026-11-12 test issue and GitHub email receipt were confirmed. This proves issue→inbox **transport**, not human acknowledgement or response SLA.
- Primary tracked issue assignee: \`alaabmt\`. **Backup on-call and event-host escalation contacts NOT VERIFIED.**
- Long-term monitor uptime, scheduled-run continuity, vote-specific and presenter-specific SLOs, and live per-action p95 alert rules **NOT VERIFIED**. A read-only owner_status probe is not a functional vote health probe. GitHub Actions cron may run late.
- Free Supabase logs have limited retention and are not independent continuous history. Do not claim 99.9% SLO until a defined window and valid measurements exist.
- Alert test: https://github.com/alaabmt/alaa-excellence/issues/205 (closed after Gmail delivery).
- Full freeze window, incident communications plan, human acknowledgment test, fallback presenter plan and named secondary owner must be agreed before formal GO.

## Test data safety

The real-backend functional rehearsal used temporary presentations; afterward the original production totals were restored to 1 presentation, 9 questions, 2 sessions, 4 participants and 2 votes. Any additional bounded test must create **one uniquely titled disposable fixture**, with no active real session; cleanup deletes only that exact synthetic title/ID after evidence is saved, then verifies original counts. No global auth or shared database modifications.

**Certification rule:** P0 missing/failed = NO-GO; no invented metrics, backdated approvals or waiver of critical gates. The review must record current main SHA, Edge version, proof time, artifact and independent verifier.
