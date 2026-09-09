# Tamayuz 10X — LPP Cloudflare backend

This Worker + D1 backend powers live trainer sessions for the Learning Preference Profile.

## What it provides

- Create a trainer session with a server-generated code and private trainer token.
- Participant join validation.
- Anonymous cross-device submission of completed 64-item responses.
- Group-level averages and leading-profile distribution.
- Trainer dashboard authentication without storing the raw trainer token in D1.

No participant name or email is required. Raw item responses are stored because they are needed for later pilot psychometric analysis; the front end uses an anonymous browser-generated participant ID.

## One-time Cloudflare setup

From this directory:

1. `npm install`
2. `npx wrangler login`
3. `npx wrangler d1 create tamayuz10x-lpp`
4. Copy the returned D1 database ID into `wrangler.jsonc` in place of `REPLACE_WITH_D1_DATABASE_ID`.
5. `npx wrangler d1 migrations apply tamayuz10x-lpp --remote`
6. `npx wrangler deploy`
7. In Cloudflare, add the custom domain `api.tamayuz10x.com` to the Worker.

The public website is already wired to `https://api.tamayuz10x.com`.

## API

- `GET /health`
- `POST /api/lpp/sessions`
- `GET /api/lpp/sessions/:code`
- `POST /api/lpp/sessions/:code/responses`
- `GET /api/lpp/sessions/:code/dashboard` with `Authorization: Bearer <trainer_token>`

Allowed browser origins are restricted in `src/index.js` to the Tamayuz 10X site and the GitHub Pages fallback domain.
