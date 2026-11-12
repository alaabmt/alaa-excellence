---
name: tamayuz-live-testing
description: Plan and execute safe Tamayuz Live regression tests, GitHub Actions diagnostics, mobile/desktop QA, staging exercises, load-test boundaries, deployment verification and rollback.
---

# Tamayuz Live testing and release control

Use existing `tests/tamayuz-live-*.test.mjs` and `.github/workflows/` rather than duplicating tests. Review `skills/tamayuz-live-guardian/references/release-gates.md`.

## Required test matrix

- Source/static: JavaScript/TypeScript syntax, focused unit tests, changes limited to intended paths.
- Owner: authenticated dashboard, Manage questions, switching Questions/Live sessions/Analytics, mobile/Desktop Site toggle, reload, Home, permissions on expired login.
- Presenter: private presenter link, `present`, open/close/next, correct-answer reveal, Widescreen View, ended and reactivated sessions.
- Audience: no account, QR and join code, `join`, `view`, exactly one vote/participant/question, waiting/closed/ended/missing codes and reconnection.
- Security: anonymous cannot control, reactivate or read protected results, valid owner/presenter may act.
- Data: before/after question counts, votes, sessions and participant totals; no effect on real presentations.
- Deployment: compare `main` SHA, GitHub Pages successful deployment, deployed Supabase Edge Function version and live smoke checks. They are distinct rollout paths.

## CI and test honesty

- Capture exact run URL, conclusion and failing step. Existing unrelated site QA failures must not be silently called a pass or misattributed to the current PR.
- Static tests do not prove physical Android browser behavior; server-side mock tests do not prove production capacity.
- Prefer isolated read-only or tiny temporary test sessions; test cleanup must target only explicitly created IDs, then verify original data remains intact.
- Production polling/load and quota-cost tests require a separate approved window, rate limits, abort thresholds, and rollback plan. Don't schedule or run them autonomously.
- Finish with pass/fail/not-verified matrix, release decision, rollback instructions, and links to evidence. Do not mark production fixed until deployed and smoke-tested.
