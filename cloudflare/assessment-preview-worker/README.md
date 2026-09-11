# Secure temporary assessment preview

This worker provides a password-protected, noindex, no-store preview of the current assessment-auth feature before it is merged to `main`.

## Security model
- Preview path: `/__preview-10x-auth-7c4e2d91/`
- All preview pages and assets require the preview cookie.
- The cookie is HttpOnly, Secure, SameSite=Strict and expires after 4 hours.
- The preview password is stored only as a Cloudflare Worker secret named `PREVIEW_PASSWORD`; never commit the value.
- The worker sends `X-Robots-Tag: noindex, nofollow, noarchive` and disables caching.
- Assessment question content is still delivered by the authenticated Supabase `assessment-content` function; the preview does not make the protected bank public.
- The worker is pinned to feature commit `2f41ee431a39e37ea74b3efa7bdae94d8fc31571` so the test target is stable.

## Cloudflare deployment
1. Create a separate Worker named `tamayuz10x-assessment-preview` using `src/index.js`.
2. Add encrypted secret `PREVIEW_PASSWORD` with a strong value known only to the tester.
3. Add the custom-domain route:
   `tamayuz10x.com/__preview-10x-auth-7c4e2d91/*`
4. Do not attach the Worker to the site root or any other route.
5. Open:
   `https://tamayuz10x.com/__preview-10x-auth-7c4e2d91/account/register.html?lang=ar`
6. Remove the route and Worker after final acceptance testing.

## Important
Do not send the preview password in chat or commit it to GitHub. The live `main` branch remains unchanged until the final quality gate is passed.
