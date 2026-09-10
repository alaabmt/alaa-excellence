# Tamayuz 10X Assessment Authentication

## Objective
Require an authenticated registered account before a visitor can use either assessment:
- Learning Style Profile
- Work Approach Assessment

## Important security boundary
The public website is currently hosted on GitHub Pages. GitHub Pages serves repository files publicly and cannot enforce server-side authentication for individual paths. A JavaScript redirect alone is a user-experience gate, not a security boundary, because a technically capable visitor can still request public HTML/JS/data files directly.

Therefore the production design must use both layers:

1. **Account authentication** through Supabase Auth.
2. **Server-side/edge authorization** for protected assessment content and result APIs, so unauthenticated requests cannot receive the protected assessment application or its private question/result resources.

Do not merge this branch as the final security solution until layer 2 is operational.

## Account model
Recommended registration fields:
- full name
- username
- email
- password
- verified email

Passwords are never stored in this repository or application code. Supabase Auth handles password hashing, reset flows, sessions and email verification.

## Recommended Supabase tables
### profiles
- id uuid primary key references auth.users(id)
- username text unique not null
- full_name text
- created_at timestamptz default now()

### assessment_attempts
- id uuid primary key
- user_id uuid references auth.users(id)
- assessment_key text not null
- started_at timestamptz
- completed_at timestamptz
- status text
- result_json jsonb

Enable Row Level Security. A signed-in user may read only their own profile and attempts. Administrative access must use a server-side service role, never a browser key.

## Current branch scaffold
This branch adds:
- `/account/login.html`
- `/account/register.html`
- `/assets/js/auth-config.js`
- `/assets/js/assessment-auth-client.js`
- `/assets/js/assessment-auth-guard.js`
- sign-in guards on both assessment landing pages

The config intentionally contains no Supabase project values yet.

## Production activation sequence
1. Provision/connect the Supabase project.
2. Enable email/password authentication and email verification.
3. Create `profiles` and `assessment_attempts` with RLS policies.
4. Add the public Supabase project URL and anon/publishable key to `auth-config.js`.
5. Put the protected assessment application and private question/result endpoints behind an edge/server authorization layer.
6. Apply authentication checks to all direct assessment routes, including consent, participant, trainer and report routes.
7. Test registration, verification, login, logout, password reset, session expiry, direct-URL access and mobile behavior.
8. Only then merge and deploy.

## Security rules
- Never commit a Supabase service-role key, database password or SMTP credential.
- Public browser keys are not authorization; RLS and server checks are authorization.
- Every result write must derive `user_id` from the authenticated session, never from a browser-supplied user ID.
- Rate-limit registration/login and assessment submission endpoints.
- Add privacy wording describing what account and assessment data are stored and for how long.
