# Tamayuz Live — project and operations guide

> Maintained as part of Tamayuz 10X. This document describes the current design and operational safeguards; verify deployed versions and live session state before each change. The old one-day MVP setup instructions were obsolete.

## Architecture

- **Site:** https://tamayuz10x.com/live/ — static HTML/JavaScript in `live/index.html`, hosted via GitHub Pages from `alaabmt/alaa-excellence`.
- **Backend:** Supabase Edge Function `tamayuz-live`, source in `live/backend/index.ts`. It runs in the **existing** Supabase `tamayuz10x-auth` project, not a separate project.
- **Data:** `live_presentations`, `live_questions`, `live_sessions`, `live_participants`, `live_votes`, `live_interaction_events`. Verify RLS/grants before schema changes.
- **Current observed backend:** `tamayuz-live` function version 21 was ACTIVE on 12 Nov 2026. This is a historical observation, not a pinned version. The function supports public join/vote/view and internal per-action authorization; `verify_jwt=false` at the gateway allows anonymous audience requests. Never interpret that setting as permission to run presenter actions anonymously.
- **Frontend state:** query-parameter routing, owner login through shared Supabase Auth client, and browser `sessionStorage` for some navigation and participant/presenter state.
- **Performance design:** audience state polled approximately every 2 seconds, presenter results approximately every 1.5 seconds as recently inspected. These intervals and quotas may change.

## Roles and access

1. **Owner:** signs in through the **website account** with username/email and password. Backend verifies the Supabase Auth user and owner-account membership; `?admin=1` is a route marker, not an authentication credential.
2. **Presenter:** uses a private high-entropy presenter token embedded in a private session link; it is a bearer credential. Never share it on the projected screen or in the public QR. Rotate access by using a new session if necessary and review revocation needs.
3. **Audience:** uses public join code/QR (`/live/?code=...`) without a login. A randomly issued participant token identifies browser participation. This is not a guarantee of one response per *human* across multiple devices/browser contexts.

Privileged `control`, `present`, and `reactivate_session` must verify owner or private presenter authorization at the Edge Function. Owner-only reports and question-management APIs must verify owner. Public audience routes must never receive unrevealed correct answers or private report data.

## Conference workflow

1. Sign in to the website and open Tamayuz Live → **Manage my presentations**.
2. Open **CMI** or another presentation and manage its questions; configure answer choices and correct answers as needed.
3. Create a **fresh session** for a new lecture rather than resetting votes on a session whose historical results should be preserved.
4. Show the public QR/join code; keep the private presenter link separate. Use presenter controls to select a question and **Open voting**, then close/reveal results as desired.
5. Use **Widescreen View** for a projector when controlling from one device. Do not assume it is the same as a physically separate projector window.
6. Check the final responses and analytics. End the session when done. Opening an ended session link should show a terminal state, not repeatedly retry a supposed network failure.

## Current operational constraints

- The application caps registered participants per session in code (recently 600), **not** a verified capacity for 600 continuously polling screens.
- In a controlled production run with 600 registered participants, the existing nine-question CMI format produced 5,400 verified votes; **sustained 600-screen polling and 600 simultaneous votes were not proven**. Do not use those figures as a load guarantee.
- Public code possession can enable spam joins; there is no guarantee of one vote per person and rate-limiting/anti-abuse provisions need separate review.
- RLS, Edge Function permissions, secrets and token handling require explicit audit after any backend change. Do not commit user or presenter secrets.
- No WebSocket service is implemented by this guardian plugin; the site's live-update strategy is a separate engineering decision.
- The guardian plugin is **instructions only** and does not install monitoring, cron jobs, or automatic production deployments.

## Where to find maintenance guidance

- Local engineering policy: `live/AGENTS.md` (plus root `AGENTS.md`).
- Private plugin source: `automation/plugins/tamayuz-live-guardian/`; its five skills cover guardian, frontend, backend, security and testing.
- Existing smoke/regression tests: `tests/tamayuz-live-*.test.mjs`; workflows in `.github/workflows/`.
- Security policy: `security/CYBERSECURITY_GUARDIAN_AGENT.md` and `security/skills/cybersecurity-guardian/SKILL.md`.

## Before release

- Check actual GitHub Pages deployment and Supabase Edge Function deployed version **separately**.
- Test owner login, private presenter, public audience, all session states, refresh, Home and Android Desktop Site toggle (physical device if possible).
- Ensure original presentation/question/session/vote counts are unchanged. Use an isolated temporary presentation for active end-to-end tests and delete only those temporary IDs.
- Obtain approval for production changes or load tests; record PR, workflow run, deployed function version, residual risks and rollback path.

## Rollback principles

- Frontend-only change: revert the specific GitHub commit and verify Pages deployment.
- Backend change: redeploy the previously known-good `tamayuz-live` function version/source with the same verification settings, and confirm votes/permissions.
- Never drop `live_*` tables or delete real participant data as a quick rollback.
