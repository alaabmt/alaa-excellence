# CPHQ free release

Implemented on `feature/cphq-learning-center`:

- A shared free landing page linked from both Capacity Building language editions.
- Guest and registered practice with original approved questions served by Supabase.
- Five guest / 20 registered new questions per UTC day; one pending delivery; idempotent answer submission.
- Existing Tamayuz account sign-in, registration and password-reset links.
- Explanations only after submission, secure database access, CORS, strict request validation and concurrency protection.
- Seven-domain mapping and transparent starter-bank limitations.
- Automated database, Edge request, live API and browser/mobile tests.

No payments, premium checkout, unlimited access or full mock exam are included in this phase.

This task published and reviewed the original 13-question set. Subsequent external additions brought the live bank to 154 published questions at final verification. On 18 October 2026, Alaa confirmed that editorial review of those additional 141 items is complete. All 154 published items are editorially reviewed; the additional review is owner-confirmed rather than independently repeated by this agent. The landing page uses live availability counts. A larger item count alone does not establish a representative exam simulation. Keep question content out of public repositories, including seeds, test fixtures and generated JavaScript.

See `cphq-api-integration.md`, `cphq-blueprint-review.md` and `cphq-release-report.md` for the exact contract, coverage and verification results. The initial release was merged separately as PR #65. The owner authorized publication of the latest live-availability updates on 18 October 2026. The release preserves the subsequent mobile-navigation fix from main and proceeds through pull-request checks and GitHub Pages verification. Database publication and Edge Function updates were applied under the user's authorization.
