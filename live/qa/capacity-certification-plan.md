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
