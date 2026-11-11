# Tamayuz Live — one-day conference quick start (MVP)

## Current deployment
Static site: /live/ on tamayuz10x.com after merging the feature branch and successful GitHub Pages deployment.
Backend: existing Supabase project tamayuz10x-auth; Edge Function tamayuz-live. All six live_* tables have RLS enabled and no public access policies. This is a separate data namespace within the existing project, **not** a separate Supabase project.

## Owner access (no username/password)
The owner receives a private one-time setup URL separately; the secret is NEVER committed to GitHub. The page stores the key in **sessionStorage** and removes it from the URL fragment. Bookmarking the URL after the fragment is removed will not preserve access; save the original private setup URL securely outside the repository. Never share the owner link with the team. Anyone possessing it has full Live administration rights.

## Run a conference
1. Open the owner URL on a private device.
2. Create a presentation (any topic, Arabic or English).
3. Manage presentation; add multiple-choice questions (2–8 options), 1–5 rating or open-text.
4. Create live session. This creates a unique 10-character join code and a separate high-entropy presenter token.
5. Click **Copy private presenter link** to share with trusted assistants. It is a bearer credential: anyone holding it can operate that session; currently it cannot be individually revoked, so treat it as a temporary shared key. To remove team access, end the session and start a new session.
6. Show QR and join code on projector. Audience visits /live/?code=... and joins anonymously.
7. Select question, open voting, close voting, reveal results, then end session. Presenter results refresh automatically every 2 seconds; audience question state every 5 seconds.
8. New session on the same presentation keeps responses separate. No registration required for audience.

## Security and operational limitations — MUST READ
- This is a lightweight beta for personal use, NOT a hardened production event platform.
- Presenter access is invitation by private link, **not** per-person identity or granular revocation. The owner key is a bearer secret. Keep both private.
- Anonymous participation cannot guarantee one vote per human. A browser session receives a random participant token; new browser sessions can create additional identities.
- There is a basic 600-participant per-session limit, but no IP-based anti-abuse throttling or CAPTCHA. An attacker who learns the public code may cause denial of service or vote manipulation.
- The backend currently uses short-interval polling, not Supabase Realtime push. It is near-live for presenter charts, but 500-client load and plan limits are NOT verified.
- External QR generator script is pinned to qrcodejs 1.0.0 on cdnjs; conference devices need internet connectivity. The join link/code is always shown as fallback.
- Open-text answers are displayed as escaped text, but there is no moderator approval before display. Avoid using open-text in sensitive conferences until moderation is implemented.
- No CSV/Excel export or dedicated analytics history UI yet. Responses are stored in Postgres for later authorized export.
- No deletion/retention scheduler yet; establish policy and remove records when no longer needed.
- No full browser, network, 500-user load, quota, Cloudflare or end-to-end Edge Function POST verification has been completed. Treat readiness as **NOT VERIFIED** until tests pass.
- Avoid sending personally identifiable or sensitive information in audience answers.

## Test checklist before a real event
- Open owner dashboard, create test presentation with choice, rating and text questions.
- Open presenter link in second browser, audience join in incognito/mobile; verify separate tokens.
- Vote, close, reveal; compare presenter aggregate with SQL counts; verify duplicate votes do not increment.
- Test 320px mobile, Arabic RTL, English LTR, QR scanning, page refresh and reconnect.
- Load-test 100, 250 and 500 concurrent participants with an approved test window; check Edge Function logs, database and provider quotas. Target p95 presenter update <3s after accepted vote.
- Confirm admin token never appears in repo, network analytics, referrer or screen recording. Do not put private presenter link on projector.
- Run cybersecurity guardian, review provider security advisors, test recovery/rollback, confirm live Pages deployment.
- Obtain explicit acceptance of residual risk before use with a live audience.

## Rollback
Revert the static /live/ deployment and disable the tamayuz-live Edge Function; do not drop tables without backed-up retention review. No existing assessment tables are modified by this module.
