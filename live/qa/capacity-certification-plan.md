# Conference capacity: evidence before certification

**Current safe evidence:** 3-person real deployed-Edge rehearsal passed functional checks, but recorded 2,088 ms p95 across 28 API calls. That is not the candidate 1,000 ms p95 objective at conference load. The new script is intentionally limited to **10 logical HTTP clients** for one minute; independent HTTP clients are **not** 10 real browser windows, and the result is not a 600-person capacity certificate.

Run only when no real session is open, on a disposable presentation and session created specifically for the PR's head SHA. The workflow exits on any unexpected HTTP error, excessive latency or broken tally and reports measured p50/p95/p99. It will not be used for a real conference session. When the job completes, delete ONLY the exact test-created presentation by title, which cascades the test question, session, participants and votes. Reverify original data counts.

## Why no 600-person production test now

A 600-client browser test polling every two seconds produces approximately **300 requests per second**, or **270,000 polling requests in 15 minutes**, before join, voting, retries and reconnect bursts. The current organization is Free and does not have a verified isolated production-like test backend, quota headroom, load budget, or named abort owner. Running that against real users or an unproven resource envelope could exhaust quotas or disrupt the service. The 600-concurrent-browser P0 gate therefore remains **NOT VERIFIED**.

## Safe test plan once isolated staging is ready

1. Install a separate staging backend whose auth and Live schema match the production Edge version and whose costs, quotas and data are isolated. Do not create a paid project without prior cost agreement.
2. Record environment hostname, independent approval, abort owner, cost ceiling, permitted test window and all quotas. Never run against the production project ID.
3. Instrument actual browser clients with one join each, realistic polling cadence (verify current JS), questions with one unique vote per client, presenter transitions, reconnects and bursts.
4. Ramp 10 → 50 → 150 → 300 → 600 with explicit stop conditions for sustained 429/5xx, vote loss, high p95, quota depletion, or any unintended production impact.
5. At full scale maintain at least 600 **simultaneous browser contexts** for 15 minutes. Report min/average/max actual connected clients, per-action latency p50/p95/p99, 429/5xx counts, vote acknowledgment, 600 unique registered participants, result reconciliation, Supabase resource saturation, provider quota and replica behavior where relevant.
6. Have a second verifier inspect immutable test logs and the correct deployed SHA/Edge version. Never extrapolate from the small smoke to claim GO.

**Current decision: NO-GO for 600 simultaneous browsers.** The small smoke measures only its declared test envelope; never infer full-scale readiness.

## Update 2026-11-13 — root cause, isolated capacity rig and the quota arithmetic

**Root cause of the missed 1,000 ms target (measured with read-only probes on production):** a request that makes no database call returns in about 50 ms; each database round trip adds about 50 ms when the Edge Function runs in `ap-south-1` and 350–900 ms when it runs in a US region. The function runs in the region nearest each caller, CI runners are in the US, and Edge version 23 makes 3–4 sequential round trips for each audience poll and vote. The page now asks for execution in `ap-south-1` (with automatic fallback); the backend source now needs one round trip (most polls: none) but **is not deployed yet** (`deploy-hot-path.md`).

**Isolated capacity rig:** `.github/workflows/tamayuz-live-isolated-capacity.yml` builds PostgreSQL 17 + PostgREST + the Edge Function source on Deno on one CI runner and runs `tests/tamayuz-live-load.mjs`: 10 → 50 → 150 → 300 → 600 logical clients that follow the page's own polling rules, a 15-minute hold at 600, one presenter cycling questions, a forced Edge process crash during the hold, per-question tally reconciliation and a real-Chromium rehearsal on the same backend. It uses no secrets and refuses non-loopback targets. **It is not the production project:** provider quotas, network distance, shared-tenant limits and real phones are outside it. A pass there removes "the code cannot do it" as a reason for failure; it does not certify the conference.

**Quota arithmetic that still blocks a 600-person production session on the current plan:**

| Item | Value | Source |
|---|---|---|
| Audience poll cadence | about 1 request per 3 s per attendee (was 2 s) | `AUDIENCE_POLL_MS` in `live/index.html` |
| 600 attendees, one hour | about 720,000 Edge Function invocations (about 1,080,000 before the change) | 600 × 3600 ÷ 3 |
| Free plan allowance | 500,000 invocations per **month** | Supabase Edge Functions pricing page, read 2026-11-13 |
| Pro plan allowance | 2,000,000 per month, then $2 per million | same page |

One 600-person hour uses more than the whole monthly Free allowance. The pricing page does not say what happens to a Free project above its allowance, so it must be treated as a risk of restriction during the event. Hidden tabs do not poll, so real usage should be lower, but that is not a basis for certification. **A plan change is a billing decision for the account owner; it has not been made or requested by this work.**

**What a production-like 600 test still needs (unchanged, now more specific):** a separate Supabase project on a plan with enough invocations and compute (or written approval to use the production project in an agreed window), the deployed backend version under test, a load source in the audience's region, 600 real browser contexts (the harness and rehearsal scripts take the endpoint as a parameter but currently accept loopback only by design), a cost ceiling and an abort owner.
