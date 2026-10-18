# Free CPHQ practice API

Project: `dqrsjhcfmpjhcxvtxosy` (`tamayuz10x-auth`).

- Guest: `/functions/v1/cphq-guest`, with a cryptographically random 64-character hex `guest_token` in the request body.
- Registered: `/functions/v1/cphq-practice`, with `Authorization: Bearer <learner access token>`.
- The registered function validates the token through Supabase Auth `/auth/v1/user` on each request. Gateway `verify_jwt` is disabled because authentication is performed in the handler; this supports current signing keys and CORS preflight. Missing, invalid and anonymous-user sessions are rejected.
- No service-role credential is sent to the browser. The guest function uses the Edge runtime service-role secret solely to call restricted RPCs. Registered calls use the authenticated user's JWT and the runtime anon key.

## Requests

All use POST JSON. Guest requests also include `guest_token`.

| Body | Behavior |
|---|---|
| `{ "action": "status" }` | Returns remaining allowance, delivered/answered counts, per-domain availability and UTC reset time. No question content. |
| `{ "action": "next", "domain": 1 }` | Atomically reserves one published question, or resumes the pending delivery. Returns stem/options only. |
| `{ "action": "submit", "question_id": 1, "selected_index": 2 }` | Requires today's matching delivery, records the first answer, then returns answer index, four rationales and lesson. |

Domain is an integer 1–7 and choice an integer 0–3. Nulls, booleans, numeric strings, oversized requests and invalid IDs are rejected. Error responses do not expose database internals. Responses use `Cache-Control: no-store`.

## Allowance and retry contract

- Guest: five new deliveries per browser token per UTC day.
- Registered: 20 new deliveries per account per UTC day, regardless of old entitlement rows.
- No premium bypass or checkout is enabled.
- One pending question per identity/day. Changing domains or refreshing resumes it, without using another place.
- Allowance is consumed on delivery, not submission; otherwise repeated `next` calls could enumerate the bank without consuming quota.
- Once a question has been delivered, its answer can be submitted even when remaining allowance is zero.
- Identical retries return the saved result with `replayed: true`. A changed answer is rejected. Database locks and unique indexes prevent simultaneous requests from duplicating deliveries/attempts.
- Questions cannot repeat for one identity on the same UTC day. Today's pending question expires at the next UTC day; trying to submit an expired delivery is rejected.
- Availability is read from the database. The initial 13-item bank was tested in full; the 20-question boundary was initially tested with rolled-back fixtures. At final verification the bank had grown independently to 154 published items. Landing counts now refresh from the status API; the original 13-item exhaustion scenario is historical test evidence, not the current inventory.

## CORS and preview testing

The exact origins `https://tamayuz10x.com` and `https://www.tamayuz10x.com` are allowed. Additional preview origins can be listed, comma-separated, in the Edge secret `CPHQ_ALLOWED_ORIGINS`; no wildcard is used. OPTIONS permits authorization, apikey, content-type and x-client-info. Origin checks are defense in depth, not identity verification.

## Database boundary

`public.cphq_questions`, `public.cphq_attempts` and guest identities have RLS and no direct anon/authenticated table grants. Core functions live in the non-exposed `cphq_private` schema with no public schema/function privileges. Public registered wrappers deliberately use `SECURITY DEFINER`, a locked empty search path, and `auth.uid()`/anonymous-user checks. Each operation scopes to that user. Guest wrappers are service-role-only. The Supabase advisor warns about these intentional authenticated wrappers; no table read grant should be added to silence that warning.

Applied migration: `20261017204226_cphq_free_protected_delivery.sql`. It updates an existing CPHQ schema and assumes the prior project migrations are present. It contains no question content. The 13 approved IDs (1–13) were published by a guarded data update and verified separately; do not populate a seed file with the bank.

## Limits of protection

Guest identity is browser-held and is not proof of a unique person. Clearing storage or using another browser can obtain another guest allowance. No CAPTCHA/device identification is claimed. Registered quotas are tied to a verified account. Feedback necessarily becomes visible to a learner after submission.

The legacy `cphq.html` embedded the 13 questions and keys in earlier Git commits. Removing them from the current branch does not erase Git history or cached copies; treat those starter items as previously public. New private content must be maintained only in the database. Rewriting repository history is outside this release.

## Verification commands

- `node --test tests/cphq-edge.test.mjs`
- Run `tests/cphq-database.sql` against the project through the management SQL API (transaction rolls back all fixtures).
- `node tests/cphq-browser.mjs` with Playwright installed (synthetic content/auth transport fixtures).
- `tests/cphq-live.mjs` requires a dedicated QA session file and output paths; it exercises real APIs and logs assertions only. Never use an existing learner account or commit QA credentials. Clean up QA attempts, identity and session after the run.

Existing Tamayuz login, registration, password reset and account services remain in use. CPHQ return links carry `next=/cphq-registered.html` through sign-in and registration.
