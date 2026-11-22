# Live-only current-backend rehearsal — controlled, disposable data

The test runner uses the actual deployed `tamayuz-live` Supabase Edge API, **not mocks**. Owner access is **negative tested** only; an authenticated owner-positive journey needs a separately authorized owner token/session. It verifies a disposable presenter-controlled poll, anonymous joins, votes, result aggregation, answer reveal, and session closure.

**Preparation:** The authorized operator records main SHA, Edge version and all Live row counts, confirms there is no active event, then inserts exactly one identifiable synthetic presentation, one choice question and one synthetic waiting session using Live-only SQL. The test code derives a temporary presenter token and code from its pull-request head SHA. Do not use actual owner credentials, participant data or live question text.

**Run:** Create an in-scope PR touching `tests/tamayuz-live-real-backend-rehearsal.mjs`. Its workflow invokes the external production Edge API with synthetic session only. Tests must stop on unexpected responses. This is low-volume functional rehearsal, **not** concurrency or capacity testing.

**Cleanup:** After the test, authorized operator explicitly deletes ONLY the synthetic presentation by exact test title/UUID (cascading synthetic session/question/votes/participants). Verify original counts and real sessions are unaltered. Failed tests do not justify deleting any other data. The workflow itself has no Supabase service credentials and cannot perform cleanup. Do not re-run old PR jobs after fixture cleanup.

**Assurance:** Passing this test proves observed presenter and audience server journeys for a small synthetic audience on a particular deployed Edge version. It does not prove owner-positive login, physical device usability, backup restoration, monitoring alert receipt, or 600 real concurrent clients. Conference readiness cannot be certified by this alone.
