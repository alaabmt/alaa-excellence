# Secure temporary assessment preview

This worker provides a password-protected, noindex, no-store preview of the current assessment-auth feature before it is merged to `main`.

## Security model
- Preview path: `/__preview-10x-auth-7c4e2d91/`
- All preview pages and assets require the preview cookie.
- The cookie is HttpOnly, Secure, SameSite=Strict and expires after 4 hours.
- The preview password is stored only as a Cloudflare Worker secret named `PREVIEW_PASSWORD`; never commit the value.
- The worker sends `X-Robots-Tag: noindex, nofollow, noarchive` and disables caching.
- Assessment question content is still delivered by the authenticated Supabase `assessment-content` function; the preview does not make the protected bank public.
- The worker is pinned to feature commit `163e7a5e49e54ecad8ca03afb2cc055442145e65`, which includes the registration-form fix.

## Cloudflare deployment
1. Create a separate Worker named `tamayuz10x-auth-preview` using `src/index.js`.
2. Add encrypted secret `PREVIEW_PASSWORD` with a strong value known only to the tester.
3. Add the custom-domain route exactly as:
   `tamayuz10x.com/__preview-10x-auth-7c4e2d91/*`
4. Do **not** use `tamayuz10x.com/*`; the Worker intentionally returns `Not found` outside the preview prefix and a site-wide route would intercept normal production pages.
5. Open:
   `https://tamayuz10x.com/__preview-10x-auth-7c4e2d91/account/register.html?lang=ar`
6. Remove the route and Worker after final acceptance testing.

## Important
Do not send the preview password in chat or commit it to GitHub. The live `main` branch remains unchanged until the final quality gate is passed.
