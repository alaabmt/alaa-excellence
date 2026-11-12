# Tamayuz Live — scoped engineering instructions

This file applies to `live/` including `live/index.html`, `live/backend/index.ts` and `live/README.md`. Follow the repository root `AGENTS.md` too, with its cybersecurity rules when relevant.

## Purpose and sources of truth

- Maintain the *existing* Tamayuz Live conference application; do not rebuild it or change unrelated Tamayuz 10X pages.
- Consult `automation/plugins/tamayuz-live-guardian/skills/tamayuz-live-guardian/SKILL.md`, its specialist skills, and `live/README.md` for project-specific triage.
- GitHub source and deployed GitHub Pages/Supabase are separate; inspect both before changing anything. Supabase Edge Function code does **not** deploy merely by merging `live/backend/index.ts` into GitHub.

## User journeys that must remain working

- Website-account login → owner dashboard → Manage Presentations → Questions / Live sessions / Analytics.
- Same-tab reload and Android Desktop Site toggle preserve the selected owner workspace where browser storage is retained, without bypassing server-side authorization.
- Private presenter link → select question, open/close voting, reveal correct answer, Widescreen View, end/reactivate session.
- Public QR/join code → anonymous audience participant → one recorded vote per participant/question. No public presenter permissions.
- Clear waiting/closed/ended/nonexistent-session messages; Home stops stale polling and clears saved owner navigation intentionally.
- Arabic RTL and English LTR, mobile narrow screens and desktop/projector readability.

## Change control

1. Read existing code/tests before proposing a fix. Distinguish proven facts from hypotheses.
2. Begin read-only: logs, database state, GitHub actions, deployment status. Redact session secrets and participant information.
3. Isolate edits on a short-lived branch and PR, with narrowly scoped tests; preserve the original CMI nine questions, sessions and all user data.
4. Run relevant `tests/tamayuz-live-*.test.mjs` and manual/automated role-specific checks. Mock tests never prove live capacity; a desktop emulator never proves a physical Android device.
5. Obtain explicit approval before production app merges, Supabase deployment, destructive data changes, production load tests or quota-affecting modifications.
6. Verify GitHub Pages and Supabase deployments **separately**, and report observed results and limitations. Preserve rollback procedures.
7. Never expose Supabase service-role credentials, owner account JWTs, or private presenter tokens in pages, tests, commits, screenshots or logs.

## Security

Read `security/CYBERSECURITY_GUARDIAN_AGENT.md` and `security/skills/cybersecurity-guardian/SKILL.md` whenever touching auth, tokens, RLS, GitHub Actions permissions, or sensitive data. A public session code is never authorization for presenter controls. Test server-side permission checks; hiding a button is insufficient.

## Plugin behavior

Tamayuz Live Guardian is a **skill-only private ChatGPT plugin**, not a background daemon. Its source is kept in `automation/plugins/tamayuz-live-guardian/`. External tools require connected authorized integrations; automatic monitoring requires separate scheduling and alert configuration.
