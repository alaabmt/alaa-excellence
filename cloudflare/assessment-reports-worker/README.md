# Tamayuz 10X Assessment Reports — Cloudflare R2

This Worker is the private storage boundary for generated assessment PDF reports.

## Rules
- Bucket: `tamayuz10x-assessment-reports`
- Keep the bucket private.
- Do not enable a public `r2.dev` URL for participant reports.
- Never commit Cloudflare API tokens, R2 credentials, or `REPORTS_INTERNAL_KEY`.
- Only trusted server-side code (Supabase Edge Functions) should call this Worker.
- Browser clients must never receive the Worker internal secret.

## Activation
1. Create the R2 bucket named `tamayuz10x-assessment-reports`.
2. Deploy this Worker from this directory.
3. Store a strong secret as `REPORTS_INTERNAL_KEY` using Cloudflare's secret mechanism.
4. Store the same value only as a Supabase server-side secret, never in browser configuration.
5. Configure the Supabase report API to call the Worker for private PUT/GET/DELETE operations.

The Worker accepts PDF content only and caps direct uploads at 15 MiB when a Content-Length header is present. Production QA must verify size enforcement for streamed requests as part of the report-generation path.
