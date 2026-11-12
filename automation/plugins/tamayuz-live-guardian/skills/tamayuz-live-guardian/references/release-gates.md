# Tamayuz Live release gates

## Gate A — before code changes

- Current `main` and deployed function compared; current session activity checked read-only where available.
- Scope stated and incident reproducible; test fixture and rollback defined.
- User consent covers the requested edit. Approval for preparing a patch does not imply production deployment.

## Gate B — PR review

- Scoped diff, no credentials, non-destructive tests.
- Syntax/CI (live security, navigation, workspace, ended-state) pass; unrelated QA failures explained and not waived silently.
- Presenter owner, audience and direct-link regressions evaluated.
- RLS/authorization reviewed when backend touched.

## Gate C — production

- Explicit approval or pre-approved release policy for production merge/deploy.
- GitHub Pages and Supabase deployments assessed separately; confirm versions.
- Production smoke test is scoped, lightweight, monitored and uses no real attendees' records.
- End-to-end validation on device if feasible; otherwise flag as unverified.

## Gate D — closeout

- Verify real data unchanged (original questions, sessions, votes), with explicit comparison when access exists.
- Record exact PR, commit, workflow run, deployed function version, outcome, limitation and rollback.
- No permanent background monitoring unless a separately configured scheduled workflow is confirmed active.
