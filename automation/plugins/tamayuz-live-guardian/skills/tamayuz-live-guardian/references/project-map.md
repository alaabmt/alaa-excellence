# Tamayuz Live project map (verify before acting)

- Website: `https://tamayuz10x.com/live/` — GitHub Pages static SPA.
- GitHub: `alaabmt/alaa-excellence` — root `AGENTS.md` applies; `live/AGENTS.md` adds local engineering rules.
- Frontend: `live/index.html`.
- Backend in GitHub: `live/backend/index.ts`.
- Deployed backend: `tamayuz-live` Supabase Edge Function in **existing** `tamayuz10x-auth` project. Source/deployed version may differ.
- Data tables: `live_presentations`, `live_questions`, `live_sessions`, `live_participants`, `live_votes`, `live_interaction_events`.
- Shared login: site Supabase Auth client and owner-account authorization. Frontend `?admin=1` is routing only, not proof of identity.
- Presenter: private presenter link containing session and token. Public audience: `?code=...` QR link, no account. Do not log or expose token fragments.
- Existing CI/regression: `tests/tamayuz-live-security.test.mjs`, `tamayuz-live-ended-state.test.mjs`, `tamayuz-live-navigation.test.mjs`, `tamayuz-live-restore-workspace.test.mjs` and workflows.
- Historic incident patterns: unauthenticated control endpoints; misleading 409/404 connection error; stale polling after Home; Android Desktop Site toggle losing Manage workspace.
- Historical load results: 600 organized participants, 9 questions, 5,400 votes succeeded; **not** proof of 600 continuous audience screens polling simultaneously. No performance or quota guarantee.
- Historical baseline: `CMI` presentation with nine questions and two original sessions. Always recheck current values; never assume past session states are current.

This reference describes context, not a runtime contract. Read current source, deployment and data before change.
