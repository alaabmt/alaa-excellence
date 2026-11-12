---
name: tamayuz-live-security
description: Audit or repair Tamayuz Live presenter/owner authorization, QR audience permissions, bearer tokens, Supabase RLS, hidden correct answers, private analytics, CI/CD secrets and incident response.
---

# Tamayuz Live security

Also follow `security/CYBERSECURITY_GUARDIAN_AGENT.md`, `security/skills/cybersecurity-guardian/SKILL.md` and the repo's `AGENTS.md`. Security reviews default to read-only.

## Trust boundaries

- The public QR or join code is **not** a presenter credential. A browser hiding buttons proves nothing.
- Owner authentication uses the site's authenticated Supabase account and server-side verified membership; do not trust a username, localStorage entry, URL `?admin=1`, client-supplied role, or user-editable metadata as proof.
- A presenter token is a sensitive session-scoped bearer secret. Verify it on the backend per privileged request, never expose it to the public join link, logs, source, screenshot or projection.
- Require verified owner/presenter authorization for changing questions, opening/closing votes, revealing answers, presenting unpublished answer keys, ending/reactivating sessions. Owner-only results and question-management endpoints need owner checks.
- Public `view` must remove answer keys/justifications until legitimately revealed, if relevant, and must not expose private analytics.

## Review checklist

1. Locate all function actions; map required caller role and check enforcement in the **deployed** function, not only UI.
2. Inspect RLS/grants and `service_role` boundaries for exposed tables and views.
3. Test anonymous requests receive 403 for privileged actions, authorized presenter/owner requests still succeed and audience voting remains possible.
4. Protect rate limits and session-code enumeration; consider brute-force, malicious answer content, CSRF/CORS, replay and leaked presenter links.
5. Check GitHub Actions permissions, secret exposure, log redaction, token revocation and least privilege.
6. Never test with real credentials in a public PR or write their values to logs.
7. Report severity with evidence and scope; request explicit authorization before remediation that changes production auth or user data.
