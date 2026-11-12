# Issue triage / incident playbook

## Incident input

- Role: audience / presenter / owner / Widescreen.
- Safe URL: path + nonsecret route type; never paste owner session JWT, URL fragments or presenter token into issue logs.
- Expected / actual: exact UI state, status text, what user clicked, whether browser Desktop Site or refresh was involved.
- Environment: Android/desktop, browser, language (Arabic/English), approximate timestamp and location (dev/staging/prod).
- Impact: a single user vs active conference; any affected votes.

## Diagnostic routing

| Symptom | First checks |
| --- | --- |
| Desktop Site toggle returns Home | URL router, `sessionStorage` restoration, explicit Home, auth session and page reload, stale AJAX epoch |
| `Session not found` / `Session ended` | DB session state and join code, `join`/`view` semantics, terminal UI vs retry loop |
| Unable to control voting | owner JWT/owner membership, presenter token, 403/401 vs 409, Edge Function version |
| Presenter sees incorrect totals | votes unique key, active question id, aggregate query, presenter display refresh |
| Audience not updating | 2-second polling, page visibility, Edge Function availability, quota, stale session, network |
| GitHub Pages looks old | PR merged? GitHub Pages deployment successful? browser cache? assets? |
| Backend code differs | GitHub backend file vs Supabase deployed function version; deploy separately after approval |

## Response contract

State: confirmed cause / possible cause / unknown. Provide the smallest safe fix and tests. Identify actions actually taken (repo branch, PR, deployed function, DB changes). Don't claim completion unless verified. If production event is active, prefer non-mutating diagnosis first and explicit user approval before any live changes.
