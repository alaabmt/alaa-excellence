# Tamayuz Live — current conference P0 evidence register

> **Superseded for current status by `verified-evidence-20261113-r2.md` (same day, later revision).**

**Checked 2026-11-13 UTC; site-specific, no blanket assurance.** Project `tamayuz10x-auth`; published SHA `7da8df10b63010611eb43e6fb9e0d35ce514d576` at read-only GitHub ref inspection; active Live Edge version `23`. This register is a factual evidence ledger, not an issued production certificate, independent penetration test, owner approval or a substitute for live event operations.

**Overall conference readiness: NO-GO (P0 gaps).** Do not classify a successful synthetic backup, small-load HTTP test or public browser smoke as equivalent to a separately approved and evidenced 600-concurrent-browser rehearsal or a genuine production backup recovery.

## What has actually been verified

| P0 gate | Evidence and interpretation | Current decision |
| --- | --- | --- |
| Deployment provenance | GitHub Pages deploy: https://github.com/alaabmt/alaa-excellence/actions/runs/43312911659 ; Live Edge Function 23 ACTIVE during 2026-11-13 inspection | PASS for inspected versions |
| Owner authorization | Real API **negative** owner/auth checks and positive presenter-token checks passed in https://github.com/alaabmt/alaa-excellence/actions/runs/43308670851 . A true authenticated *owner* session has **not** passed an independently witnessed check. The safe self-check page is deployed: https://tamayuz10x.com/live/qa/owner-auth-check.html . Never request or export the owner's access JWT. | NOT VERIFIED (owner-positive) |
| Critical journeys | Real deployed API test: three temporary participants, 3 accepted unique votes, 28 HTTP requests, presenter transitions and results; https://github.com/alaabmt/alaa-excellence/actions/runs/43308670851 . Does not cover real owner-positive full-browser workflow or physical iOS/Android devices. | PARTIAL / NOT VERIFIED overall |
| Conference capacity | **Real** deployed API test: 10 independent logical HTTP clients (not 10 browser windows), 60s minimum, 270 polls, 296 requests, all 10 legitimate votes accepted, 0 server 5xx, p95 poll 2853ms, p95 vote 2906ms. https://github.com/alaabmt/alaa-excellence/actions/runs/43311268519 . The proposed 1000ms p95 target **was missed at ten clients**. This is a measured concern, not an inference of guaranteed 600-person failure. No 600 concurrent browser soak was authorized or run. | NOT VERIFIED; investigate latency before full scale |
| Monitoring and alert delivery | First post-merge monitor/issue transport passed: https://github.com/alaabmt/alaa-excellence/actions/runs/43308951489 . Test issue https://github.com/alaabmt/alaa-excellence/issues/205 was created, read back, email delivery observed, then closed. Scheduled-run history also shows a successful schedule-triggered monitor at https://github.com/alaabmt/alaa-excellence/actions/runs/43348844649 (created 2026-11-13 01:59 UTC). **Consistent 15-minute execution, sustained on-call acknowledgment and failover are not proven**; GitHub cron can be delayed. A separate hourly ChatGPT read-only stale-monitor watch has been created, but its future execution and alert delivery are not yet evidenced. | PARTIAL / NOT VERIFIED fully |
| Recovery | Isolated PostgreSQL 17 **synthetic** pg_dump, loss and restore passed; source/target fingerprints matched, temporary RTO 278ms: https://github.com/alaabmt/alaa-excellence/actions/runs/43306128962 . No actual production backup was restored into an independently isolated stack, so production RTO/RPO and Pages/Edge rollback remain unverified. Supabase Free backup guidance: https://supabase.com/docs/guides/platform/backups | NOT VERIFIED (production restore) |
| Vote data integrity | Live-only SQL on 2026-11-13: zero orphaned votes, mismatched question votes, duplicate vote tuples or leftover synthetic presentations; original data counts 1 presentation, 9 questions, 2 sessions, 4 participants, 2 votes, 5 events. Ten-client tally reconciled 10 of 10. | PASS for checked invariants, not all concurrency scenarios |
| Abuse resistance | Presenter/owner negative authorization, duplicate vote and ended/closed session refusal exercised; comprehensive adversarial and rate-limit validation is not attested by this run. | PARTIAL / NOT VERIFIED fully |

## Required next evidence — no unapproved side effects

**Owner:** The account holder signs into the existing Tamayuz website on their own device, opens `/live/qa/owner-auth-check.html`, runs the read-only owner-positive check and shares only sanitized output with an independent verifier. This cannot be done with database administration privileges, an unauthenticated CI runner, or an invented token.

**Capacity:** Use an approved separate production-like environment, explicit cost ceiling and abort owner, then real browser contexts with realistic polling, vote bursts and 15-minute sustained 600-client load. Capture actual provider quotas, 429/5xx, p50/p95/p99, concurrent clients, accepted-vote denominator and precise backend SHA/version. Current 10-client p95 warrants diagnosis and geographically representative testing first. Never run an unapproved 600-user production stress test.

**Recovery:** Provision a genuinely isolated restore destination and an encrypted recent **Live-only** production backup via a secure operator-controlled channel (Supabase recommends a CLI logical dump for Free-tier projects). Verify sensitive-value retention, RLS/functions, identity integration, application functionality, restore evidence, RTO/RPO and approved retention. Do not export tokens, private join codes or question content in CI logs or public GitHub artifacts. Do not alter production tables as part of a restore demonstration.

**Operations:** Confirm actual scheduled monitor cadence, second on-call contact, a human-acknowledged alert, functional-vote monitoring and documented failover. This is distinct from the already demonstrated GitHub issue/email transport.

## Scope and decision

Allowed write paths: `live/**`, `tests/tamayuz-live-*` and `.github/workflows/tamayuz-live-*`. Only the existing Live Edge Function and `live_*` DB objects are eligible for separate authorized Supabase changes. All other site components are OUT OF SCOPE; no action.

The Guardian may change **NO-GO** to **CONDITIONAL GO** or **GO** only on genuine matched evidence for all P0 gates and an accountable event owner approval. Do not waive missing P0 proof.
