---
name: tamayuz-live-backend
description: Diagnose Tamayuz Live Supabase Edge Function, live_ Postgres tables, audience join/vote/view, presenter actions, results accuracy, quotas, concurrency and database performance issues.
---

# Tamayuz Live backend and Supabase

Backend: `tamayuz-live` Edge Function, repository source `live/backend/index.ts`, existing Supabase project `tamayuz10x-auth` (not a separate project). Live tables: `live_presentations`, `live_questions`, `live_sessions`, `live_participants`, `live_votes`, `live_interaction_events`. Confirm actual schema, version and policies before work.

## Investigation

1. Read the installed Supabase guidance and current provider docs before modifying Supabase. Check deployed function version/config and compare with GitHub `main` (merging GitHub does not deploy the function).
2. Use read-only SQL, logs and metrics first; identify action, status code, affected session, query, timestamp, p50/p95 latency and exact failure path.
3. Check `join` and `view` remain available to public users; `vote` requires a valid participant token and respects session/question state and uniqueness. `control`, `present` and session reactivation require owner or private presenter authorization; owner analytics and hidden answers require verified owner permissions.
4. Protect one vote per participant/question at database level; preserve historical answers and the presentation's nine questions. Ensure retries are idempotent where possible.
5. Examine RLS and service-role access; never put a secret/service-role key in frontend or repository.
6. Distinguish registered-participant cap from 600 simultaneously polling browsers. The audience has used ~2-second polling and presenter ~1.5-second polling; measure the current version, do not assume these intervals remain fixed.

## Performance safety

- Past organized 600-participant x 9-question production test (5,400 votes) did not establish 600 simultaneous continuous polling screens. Do not generalize mock throughput to live concurrency.
- Do not run production load tests, generate 600 browser requests/sec, deploy Edge Functions, modify quota-impacting polling intervals, or write/delete live data without explicit approval and safeguards.
- For temporary test sessions, document identifiers, isolate them from real CMI data, keep per-call caps and remove only specifically identified test records after verification.
- Validate changed function with a staging/safe test session, unauthorized 403, normal join/view/vote, presenter token, owner account, and database tally.
