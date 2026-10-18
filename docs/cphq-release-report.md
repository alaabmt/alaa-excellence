# Tamayuz 10X CPHQ free release verification

Original implementation tested at `c5523b931dc0e0aecc9e40cbdcad79458ca65c7d`. The current development code, including live availability and the preserved mobile fix, is `06cb180bb7df5c0504bcf2b516beedaadcc4a1bf`. Verification ran on 17 October 2026 UTC (18 October UAE); final QA cleanup verified on 18 October 2026.

**Publication authorization (18 October 2026 UAE):** Alaa confirmed that editorial review of the additional 141 questions is complete and instructed publication. Together with the original 13 reviewed items, all 154 published items have completed editorial review. The additional review is owner-confirmed; this agent did not independently repeat it.

**Release state before this publication:** the original tested implementation was subsequently merged outside this work as [PR #65](https://github.com/alaabmt/alaa-excellence/pull/65) on 17 October 2026 at 21:08 UTC. Main then received a mobile-navigation fix. This continuation preserves that fix and keeps the new live-availability update on `feature/cphq-learning-center`; no additional merge or public deployment was performed by this agent. The authorized question publication, database hardening and two Edge Function updates are applied to `dqrsjhcfmpjhcxvtxosy`.

## Completed

- Published exactly the approved original question IDs 1–13, using a guarded `review` → `published` update. Initial separate verification returned 13 published and zero review questions. On continuation, all 13 original IDs remained published; the total had grown independently to 154. No added item was changed or removed.
- Replaced the client-side bank in `cphq.html` with navigation to the free center. Current HTML/JavaScript contains no question-bank data or answer keys.
- Connected both Capacity Building editions, the free landing page, guest practice and registered practice.
- Reused existing Tamayuz authentication and return links. No payments, checkout or premium bypass.
- Added shared practice UI, readable mobile layouts, keyboard controls, pending-question recovery and clear availability/error messages.
- Made delivery atomic and quota-consuming: five new guest questions or 20 registered questions per UTC day, one pending question, no duplicate daily question, safe retries.
- Required a matching delivered question before returning an answer; blocked changed answers, malformed choices, direct bank reads and unauthorized guest RPC calls.
- Reviewed the original 13 questions and explanations against the seven-domain outline; the owner confirmed completion of editorial review for the additional 141 on 18 October 2026. See `cphq-blueprint-review.md` for ID/task mapping and evidence limits.

## Verification evidence

[Original successful GitHub Actions run](https://github.com/alaabmt/alaa-excellence/actions/runs/39068595467)

[Final code: successful browser, mobile-navigation and Edge checks](https://github.com/alaabmt/alaa-excellence/actions/runs/39093352104)

[Six desktop/mobile screenshots](https://github.com/alaabmt/alaa-excellence/actions/runs/39068595467/artifacts/12114157773)

| Layer | Verified result |
|---|---|
| Database publication | Exactly 13 approved items published; four options, four explanations and a learning point on each |
| Database quota/security tests | Guest fifth/sixth boundary, registered twentieth/twenty-first boundary, UTC rollover, no premium bypass, null validation, unissued/cross-guest denial, idempotency and grants passed |
| Live password authentication | Dedicated QA account signed in through the real Supabase Auth password endpoint; returned identity matched |
| Live API | Original run: 11 groups passed, including all 13 original items. Expanded-bank rerun: 12 groups passed, including 20 actual registered deliveries and rejection of request 21, plus the live five-guest cap |
| Concurrency | Eight simultaneous next calls reserved one question; eight simultaneous submissions created one answer |
| CORS/auth | Production and www preflight passed; unknown origin and invalid JWT rejected |
| Direct API access | Both anon and authenticated users denied question-table reads and service-only guest RPCs |
| Edge request tests | Nine tests passed locally and in CI |
| Browser journey | Passed at 1440×1000, 390×844 and 320×720; landing → guest → five answers → limit → reload, sign-in failure/success return, registered answer and sign-out |
| Browser layout/runtime | No horizontal overflow or uncaught JavaScript errors in tested flows; six screenshots retained in Actions |
| Existing auth | `scripts/validate_assessment_auth.py` passed |
| Repository checks | Changed-file whitespace and CPHQ internal links passed |
| Cleanup | QA session signed out; disposable QA account/profile/identity, sessions and attempts removed; final check returned 0 QA users, 0 QA attempts, 13 original approved items published and 154 total published |

Browser tests use synthetic question and auth-transport fixtures. Real authentication and real question delivery were tested separately through HTTP; these are not a claim that an email-confirmation journey was completed in a real inbox. The registered 20-question boundary initially used transaction-only fixtures because the production bank then had only 13 items; all fixtures rolled back. After the bank expanded, a dedicated real QA account also completed 20 published questions across the domains and the 21st request returned HTTP 429. This technical check is not an editorial review of all 154 items.

## Remaining release considerations

1. **Content review complete:** the owner confirmed editorial review of the additional 141 items on 18 October 2026. All 154 published items are therefore editorially reviewed, with the original 13 independently mapped in this repository and the additional review owner-confirmed. Current domain counts at inspection were 64 / 34 / 4 / 29 / 18 / 3 / 2. This uneven coverage does not constitute a representative full mock exam or readiness assessment; the website uses live counts.
2. **Guest identity:** five/day is enforced per random browser token. Clearing storage or changing browsers can obtain another allowance. No CAPTCHA or unique-person claim is made. Account quotas persist across devices.
3. **Historical exposure:** earlier Git commits contained this starter bank and its keys. Current files are cleaned, but history/caches have not been rewritten. Treat these 13 items as previously public; keep all future private content out of repository history.
4. **Email verification:** existing registration/password-reset services are preserved; actual inbox delivery and clicking a confirmation link were not exercised. No email was sent during testing.
5. **Auth setting:** Supabase reports leaked-password protection disabled. This existing project-wide setting was not changed. [Supabase password-security guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
6. **Intentional advisor findings:** no direct table policies on private CPHQ tables, and authenticated `SECURITY DEFINER` RPC wrappers, are deliberate. Wrappers validate identity and scope access; private tables have no frontend grants. [Advisor explanation](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
7. **Publication:** the original release was merged separately as PR #65. The owner has now authorized publication of the latest live-availability changes. The publication pull request must pass checks before merge, followed by a successful GitHub Pages run for the latest main commit and a public-page smoke test. Deployment evidence belongs in the publication handover; this pre-merge report does not claim a deployment before it occurs.

## Key changed files

- `cphq-free.html`, `cphq.html`, `cphq-guest.html`, `cphq-registered.html`
- `assets/js/cphq-practice.js`, `assets/css/cphq.css`, `assets/js/cphq-share.js`, `assets/js/cphq-availability.js`
- `training.html`, `en/training.html`, `account/login.html`
- `supabase/functions/_shared/cphq.ts`, `supabase/functions/cphq-guest/`, `supabase/functions/cphq-practice/`
- `supabase/migrations/20261017204226_cphq_free_protected_delivery.sql`
- `tests/cphq-database.sql`, `tests/cphq-edge.test.mjs`, `tests/cphq-live.mjs`, `tests/cphq-browser.mjs`
- `.github/workflows/cphq-free-qa.yml`
- `docs/cphq-api-integration.md`, `docs/cphq-blueprint-review.md`, `docs/cphq-roadmap.md`
