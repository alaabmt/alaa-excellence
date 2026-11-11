# Tamayuz 10X Live — personal conference polling specification
Status: PROPOSAL / REVIEW REQUIRED. Date: 2026-11-11. Branch: feature/tamayuz-live-spec-20261111.

## Purpose and scope
A private, reusable, topic-agnostic conference interaction tool for the site owner, not an editorial 10X content workflow. Target 100–500 concurrent participants. Personal/discreet branding, anonymous audience access, invitation-only presenter access, Arabic RTL and English LTR. No production deployment or schema changes are authorized by this document.

## Read-only repository and provider audit
- Repository: alaabmt/alaa-excellence, main; CNAME tamayuz10x.com; root index.html is a static Arabic RTL page; assets/js/site-engagement.js provides shared site behavior.
- AGENTS.md and 10X_Agent_AI_Master_Operating_Manual_AR.md require the security charter and specialist skill for auth/Supabase work. security/CYBERSECURITY_GUARDIAN_AGENT.md requires a reviewed PR and approval before changes to auth, RLS, production or Cloudflare.
- live/index.html not found on main at audit; supabase/config.toml not found at root; directory supabase/migrations exists (contents not enumerated). Repository code-search for 'live' and 'supabase' returned no indexed matches; NOT proof of absence.
- Connected Supabase projects: tamayuz10x-auth (active) and NA7N (inactive). The active project's public schema already includes profiles, assessments, trainer sessions and CPHQ tables; RLS is enabled on the tables returned by the read-only listing. No changes were made.
- Audit limitations: repository full tree, current workflow deployment, Cloudflare rules, provider billing/quotas, live CSP/headers, auth provider configuration, existing schema policies and concurrent-connection quotas NOT VERIFIED. A full guardian script scan and browser testing are pending.
- Disposition: REVIEW. No confirmed exploitable vulnerability from this limited audit. Do not infer site security from RLS-enabled flags.

## Product UX and routes
- /live/ : discreet landing / join by code, with AR/EN toggle.
- /live/join/?code=... : mobile audience view; no account or personal details required. Language selected independently of question language; provide fallback for untranslated prompts.
- /live/admin/ : owner-only dashboard to create, edit, duplicate, archive and export reusable presentation templates.
- /live/present/?session=... : authenticated presenter full-screen mode; QR code, join count, open/close question, hide/reveal aggregate results, advance, pause and end session.
- /live/results/?session=... : authenticated reports; never expose raw responses through a public URL.
- Admin and presenter routes are public static shells, NOT access control. All data and actions must be authorized server-side. Do not add public links to the editorial main navigation initially.
- Invite team presenters by verified account identity; scope role to selected sessions, expire invitations and allow revocation. Owner alone may manage global templates and team membership.
- QR contains HTTPS join URL plus short, random, non-sequential session code; the code grants only participant access, never admin/presenter rights. Show human-readable code as fallback.

## MVP question types
Single/multiple-choice poll, 1–5 rating, word cloud, moderated open-text. Later: quiz/scoring, ranking and Q&A. Presenter may suppress results until reveal; session and question state authoritative on server. Reuse templates but create new session IDs and separate responses for every conference. Duplicate templates without copying respondent data.

## Architecture
GitHub Pages static frontend (HTML/CSS/ES modules, pinned dependencies and CSP-compatible asset loading) -> HTTPS Supabase Edge Functions for validated join, vote, admin operations and aggregation -> Postgres for authoritative state and response constraints -> Supabase Realtime for compact aggregate and question-state broadcasts to authorized channels. Use snapshot fetch on reconnect and monotonically increasing version/sequence to avoid stale updates. Avoid fanout of individual vote records to 500 clients. Server enforces question-open window and idempotent vote semantics; frontend optimistic UI is not authoritative.
Prefer a separate Supabase project for Live to isolate anonymous audience traffic, permissions, quotas and data retention from the active tamayuz10x-auth assessment project. Project creation, pricing and exact quotas require owner approval. Do not reuse active project merely because it exists.

## Logical data model (draft, not executed)
presentations(id, owner_id, title, default_locale, status, created_at)
questions(id, presentation_id, position, type, localized_prompt, settings, created_at)
options(id, question_id, position, localized_label)
sessions(id, presentation_id, join_code_hash, status, active_question_id, results_visible, version, created_at, ended_at)
presenter_access(id, session_id, user_id, role, expires_at, revoked_at)
participants(id, session_id, token_hash, created_at, last_seen_at)
responses(id, session_id, question_id, participant_id, option_id, rating, text_response, created_at, updated_at)
session_events(id, session_id, actor_id, event_type, version, created_at)
Audit every table, key and FK before migration. Add uniqueness per (session_id, question_id, participant_id) for single-response types; for multi-select use a normalized selection table with bounded selections and atomic replace. Avoid storing IP addresses in response tables; document operational abuse telemetry and retention separately.

## Security controls and threat model
Threats: vote flooding, duplicate votes, code guessing, session takeover, cross-session access, admin role escalation, public results leakage, XSS in audience text, realtime channel leakage, cost exhaustion, service outages.
- Owner/presenter use Supabase Auth with verified email and MFA where supported; enforce per-session role server-side. Authorization based on trusted membership rows or controlled app metadata, not editable user metadata.
- Audience gets short-lived, signed, scoped participant credentials from an Edge Function after session-code validation. No elevated API secrets in browser. RLS on every exposed table; default-deny policies; no anonymous direct SELECT on responses or admin data. Keep privileged functions in restricted schemas and review EXECUTE grants.
- Server-side input schema validation, text length limits, HTML escaping, profanity/PII moderation before projection, rate limiting per session/device/network with privacy-conscious telemetry, bot protection when needed.
- One vote per browser credential is a best-effort measure, NOT one vote per person; refresh/device switching may permit additional votes. Explain limitations to owner.
- Separate invitation and audience codes; rotate/expire codes, revoke presenter grants, protect exports, encrypt in transit, maintain backups and configurable deletion policy. Avoid unnecessary personal data.
- Realtime authorization and channel scoping must be tested; presenter receives aggregates, audience receives only allowed question state. Raw vote events never broadcast to the audience.
- Security review gates: RLS policy tests for anon/authenticated/owner/invited/revoked users; function authorization and rate-limit tests; CSP and dependency review; no secrets; audit logs; backup/restore test. Production auth/RLS/Cloudflare changes require explicit approval per repository charter.

## Capacity and resilience acceptance criteria (targets, not verified claims)
- Load-test 100, 250 and 500 connected audience clients with a synchronized voting burst; verify exactly one accepted answer per participant credential per question and no cross-session mixing.
- Target 95% of accepted votes reflected in presenter aggregate within 3 seconds under a 500-vote burst; tune based on tested plan and network. Verify count parity between DB and chart after burst.
- Reconnect restores current question and latest aggregate without double-counting; idempotent retries after timeouts.
- Mobile widths 320/375/390 px; desktop projector 1080p; AR RTL and EN LTR, keyboard accessibility, large tap targets and contrast checks; QR readability from conference seating distance.
- Failure handling: clear audience submission acknowledgement, retry only with same idempotency key, presenter fallback refresh and downloadable offline QR slide. Do not promise offline voting.

## Delivery phases and checkpoints
1. Approve architecture, provider project isolation, privacy/retention and cost envelope. Record owner and reviewer decisions.
2. Create separate backend project (if approved), migrations, least-privilege policies, Edge Functions and test fixtures in a feature branch; run security advisors and authorization tests.
3. Build bilingual static UI, template editor and session controls; QR code and audience join; test no-login flow.
4. Implement atomic vote processing, server aggregation and realtime broadcast; test reconnection and concurrency.
5. Add moderated open text, invitations/revocation, reports and CSV export.
6. Independent guardian review, load tests, mobile/RTL/LTR, accessibility, deployment preview and rollback plan; approve PR.
7. Controlled deployment; verify live paths, vote/aggregate correctness, billing alarms, observability and incident response before conference use.

## Decisions required before implementation
A. Separate Supabase project (recommended) versus explicitly approved isolated schema in existing project.
B. Authorized team invitation identities and presenter capabilities; owner MFA policy.
C. Response retention period, open-text moderation policy and whether audience sees results.
D. Service plan, expected maximum concurrent events, monthly cost ceiling and load-test budget.
E. Public launch URL and whether to keep Live out of site navigation and search indexing (recommended; robots/noindex is not security).

## References
Repository: AGENTS.md; 10X_Agent_AI_Master_Operating_Manual_AR.md; security/CYBERSECURITY_GUARDIAN_AGENT.md; security/skills/cybersecurity-guardian/SKILL.md; index.html; CNAME; assets/js/site-engagement.js.
Supabase: https://supabase.com/docs/guides/realtime/benchmarks ; https://supabase.com/docs/guides/api/securing-your-api ; https://supabase.com/docs/guides/functions ; https://supabase.com/docs/guides/auth .
