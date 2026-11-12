# Tamayuz Live — deployment and conference operations

## Architecture (verified 2026-11-12)
- Frontend: https://tamayuz10x.com/live/ (GitHub Pages, `live/index.html`).
- Backend: Supabase project `tamayuz10x-auth`, Edge Function `tamayuz-live` (`live/backend/index.ts`).
- Live data: `live_*` tables in the existing project. RLS blocks direct anonymous/authenticated Data API access. The function uses a protected service-role client. The frontend is public; do not place secrets in it.
- GitHub Pages and Supabase Edge Functions deploy **independently**. Check both versions after each release.

## Roles and access
1. **Owner:** Sign into the website using an existing Supabase Auth account listed in `live_owner_accounts`. Open **Manage my presentations**. The server checks the JWT and membership before giving access. The `?admin=1` URL is a route only; it never grants authorization.
2. **Presenter:** The owner creates a session and privately sends its presenter link (the fragment contains a bearer token). Open **Presenter mode** and paste that full private link. It is **not** a public session directory.
3. **Audience:** Open the public QR link or type the join code. No account is needed. The join code is not a presenter credential.

Do not project, log, screenshot or share private presenter-link fragments or a signed-in owner access token. Presenter tokens are session-scoped but cannot be individually revoked; ending the session and creating a new one is the safe replacement procedure.

## Conference procedure
1. Sign into **My presentations**, create/choose an existing presentation and manage the questions.
2. Create a session; copy the **private presenter** link to a trusted host.
3. Show only the **public** join code/QR link on the presentation screen.
4. Select a question, open voting, close voting, then reveal the correct answer and explanation when appropriate.
5. Presenters can display aggregates; public participants see their question and (after deliberate reveal) the correct answer and explanation. The public API does **not** serve vote aggregates.
6. End the session when finished. Reactivation preserves historical answers.
7. **Reset session** permanently deletes that session's votes, participants and interaction events; its question list remains. This is a deliberately destructive owner-only action requiring on-screen confirmation. The operation is now transactional at the database layer; browsers with invalidated participant tokens renew their registration on subsequent polling.
8. Sessions belonging to the same presentation keep their responses separate.

## Data and concurrency safeguards
- Owner-only actions (list, manage, analytics, rename, delete, reset and question edits) are checked on the server.
- Presenter-only actions (control, present, reactivate) require a verified owner session or the private presenter token; join codes cannot authorize them.
- The database enforces one vote per participant/question and transactionally serializes participant joins to enforce the **600 registrations per session** cap.
- The 600 cap is **not** a guarantee of 600 simultaneously polling devices. Avoid unapproved production load tests.
- A human can obtain multiple browser identities. There is still **no CAPTCHA or network-based abuse throttling**; rate limiting should be designed and tested before untrusted/high-profile public events.
- Question reordering and session vote resets run as single database transactions through restricted `service_role` RPCs. Source SQL is under `live/backend/sql/live_atomic_operations.sql`.
- The service-role key must never be included in frontend code, public links, logs or public GitHub issues.

## Regression checks
Run `node --test tests/tamayuz-live-*.test.mjs` and `python3 scripts/audit_unified_navigation.py`; `.github/workflows/tamayuz-live-full-regression.yml` runs them on relevant PRs and `main` pushes. This is not a substitute for end-to-end browser tests.

Verify on an **isolated** session and on a real Android device where possible:
- owner sign-in/expired sign-in, dashboard Manage tabs, refresh, Android Desktop Site toggle, Home;
- presenter private link, open/close, reveal/hide, next question, widescreen and reactivate;
- audience QR/deep link, join and one vote, waiting/closed/ended/invalid codes, reconnect after reset;
- hidden answer keys before reveal, correct answer and explanation after reveal, unauthorized 403 for private calls;
- 320px mobile, RTL/LTR, keyboard focus, projector visibility and browser Back;
- production SHA, Pages deployment, deployed Edge Function version, database counts before and after.

**Not yet verified**: a physical Android browser, real QR scan, sustained concurrent browser polling, provider quota capacity, full live POST smoke tests and anti-abuse controls. Do not treat automated static tests as proof of these conditions.

## Rollback
- Revert the GitHub Pages release/merge to restore the previous UI.
- Redeploy the previous verified Edge Function version if function behavior regresses.
- **Do not drop data or overwrite votes to roll back.** Keep read-only copies of exact pre-release counts. The new SQL functions are additive; rolling back code does not require dropping the functions or indexes.
