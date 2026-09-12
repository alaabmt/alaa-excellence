# Tamayuz 10X Assessment Authentication and Report Storage

## Objective
Require an authenticated registered account before a visitor can use either assessment, then preserve each completed result and its generated PDF report under that user's account.

Protected assessments:
- Learning Style Profile
- Work Approach Assessment

## Approved participant flow
Create account with email + password → verify email → sign in → return to the same intended assessment → accept participation information → complete assessment → save result → generate/store PDF → view from My Account → optionally email report to the verified email address.

## Security boundary
The public website is hosted on GitHub Pages. GitHub Pages cannot protect individual repository files server-side. Therefore assessment content, result writes, and private reports must not rely on a browser redirect alone.

Production uses separate responsibilities:
1. **Supabase Auth** for email/password authentication, verification, sessions and password reset.
2. **Supabase PostgreSQL + RLS** for profiles, assessment attempts, result metadata and report metadata.
3. **Supabase Edge Functions** for authenticated result/report operations.
4. **Cloudflare R2** for private PDF object storage.
5. **Cloudflare Worker** as a private service boundary between Supabase and the R2 bucket.
6. **GitHub** stores application code only. Generated participant PDFs must never be committed to GitHub.

## Account model
Registration fields:
- full name
- username (profile/display identifier only)
- email
- password
- verified email

Sign-in identifier is **email + password**. Passwords are never stored in this repository or application code.

## Supabase tables
### profiles
Own-profile access only through RLS.

### assessment_attempts
Stores authenticated user's assessment history and sanitized result JSON. Own-row access only through RLS.

### assessment_reports
Stores metadata only, not PDF bytes:
- id
- attempt_id
- user_id
- r2_object_key
- file_name
- mime_type
- byte_size
- sha256
- status
- created_at / updated_at
- last_emailed_at

Authenticated users may select only their own report metadata. Browser clients do not receive write access to report metadata or R2 objects.

## Cloudflare R2 design
Bucket name reserved in code: `tamayuz10x-assessment-reports`.

The bucket must remain private. Do not enable an `r2.dev` public URL and do not expose permanent public object URLs.

Repository worker scaffold:
- `cloudflare/assessment-reports-worker/wrangler.toml`
- `cloudflare/assessment-reports-worker/src/index.js`

The Worker binds the private bucket as `REPORTS_BUCKET`. It accepts only internal authenticated calls using a secret stored in Cloudflare as `REPORTS_INTERNAL_KEY`; the secret value must never be committed to GitHub.

Object keys should be generated server-side and must not trust a browser-supplied user id. Recommended form:
`reports/<authenticated-user-id>/<attempt-id>/<report-id>.pdf`

## Report delivery model
1. Assessment completion is authenticated and tied to an `assessment_attempts` row.
2. Server-side code creates a report record and a private R2 object key.
3. PDF bytes are stored in R2 through the private Worker boundary.
4. Supabase stores only report metadata and the R2 key.
5. When a user opens a report from My Account, authorization is checked against `user_id` before the PDF is streamed.
6. Email delivery sends the report only to the verified account email unless a later product decision explicitly changes that rule.

## Current implementation status — 10 Sep 2026
Completed in development:
- `assessment_reports` metadata table in Supabase with RLS.
- Authenticated users can read only their own report metadata.
- No browser write grant for report metadata.
- Cloudflare Worker source and R2 binding configuration added to the feature branch.
- Supabase Security Advisor rerun after the report-storage migration: no security findings.

Not yet activated:
- The actual R2 bucket and Worker deployment in the owner's Cloudflare account.
- Cloudflare Worker internal secret and matching Supabase server-side secret.
- PDF generation/upload/download endpoint wiring.
- Production email delivery.

The Cloudflare account is not connected to the current execution environment, so activation requires an owner-side Cloudflare action or a connected Cloudflare integration. No Cloudflare secret should be pasted into chat or committed to GitHub.

## Non-negotiable security rules
- Never commit a Supabase service-role key, database password, SMTP credential, Cloudflare API token, R2 access key, or Worker internal secret.
- Keep R2 private; no permanent public report URLs.
- Derive `user_id` from the authenticated session, never from browser input.
- Report object keys are server-generated.
- Result/report endpoints must verify authentication and ownership.
- Rate-limit sensitive endpoints.
- Add retention/privacy wording before production launch.
- Historical assessment content already present in public Git history is a separate exposure issue; current-route protection does not erase historical copies.

## Production activation sequence
1. Create the private R2 bucket `tamayuz10x-assessment-reports`.
2. Deploy the Worker with the R2 binding and set `REPORTS_INTERNAL_KEY` as a Cloudflare secret.
3. Add the matching internal secret and Worker URL to Supabase Edge Function secrets.
4. Wire report generation/upload/download and email delivery through authenticated server-side functions.
5. Test signup, email verification, same-page return, login/logout/reset, direct URL denial, completion persistence, report creation, report ownership checks, email delivery, mobile and desktop.
6. Run security/QA/CI gates.
7. Merge only after all gates pass, then deploy and verify public URLs according to the project's publication protocol.
