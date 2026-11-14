# Tamayuz Live — feature acceptance test plan (not yet executed)

Scope: Q&A, timer, ranking, image-click. Existing polls, CMI presentations and production data must remain unchanged until approved rollout.

**Capacity scope decision (2026-11-14):** The owner has explicitly opted out of the 600-participant capacity target and further 600-client rehearsals. Do not initiate or require a 600-client test for this feature release. Existing 600-client CI results are historical diagnostics, not a release gate. Preserve functional, authorization, regression and small-session validation; do not claim 600-person certification.

## Preconditions
- Deploy migration and Edge function **only to an isolated staging environment**.
- Publish matching branch frontend on a staging URL; do not point it at production.
- Prepare owner/presenter and two separate audience browser sessions.

## Test cases
1. **Authorization**: unauthenticated add/update question, timer controls and Q&A moderation must return 403. Invalid participant token cannot vote, submit Q&A or upvote.
2. **Question creation**: create a ranking question with four distinct choices; edit and reorder choices before voting. Reject duplicate choices and fewer than two choices.
3. **Ranking audience**: reorder four choices using up/down, submit; ensure duplicate submission is not counted twice; display weighted average position for each choice to presenter and audience.
4. **Image-click**: require an uploaded image; tap left, center and right at desktop and mobile widths; stored coordinates must stay normalized 0..1; results show visible dots over the original image. Reject malformed and out-of-range coordinates.
5. **Timer**: configure 15, 30, 60, 90, 120 seconds; start and reset; audience countdown follows server deadline; server rejects votes after expiry, even if the client clock is wrong.
6. **Q&A**: enable/disable; submit, upvote/unvote, moderate; ensure the audience sees no private presenter controls; verify Q&A stays hidden when disabled.
7. **Existing features**: multiple-choice, rating, open-text, word cloud, Before/After, correct-answer reveal, explanation default/override, media upload and presenter widescreen all behave as before.
8. **Accessibility**: keyboard ranking controls, visible focus, RTL Arabic, screen reader labels, reduced viewport 360px.
9. **Small-session verification only**: validate with a few test browsers and use the owner's previously successful ~40-person real-world session as observational evidence, not as a new required load test. Check no duplicate votes or cross-session leakage. **Do not run 600-client capacity tests.**
10. **Rollback**: confirm ability to restore previous frontend and Edge function without losing existing sessions or production data.

## Gate
Release for owner-led website testing requires functional/security/regression checks, deployment verification and rollback readiness. Do not require 600-person capacity rehearsal or a paid Supabase branch. The owner prefers testing on the existing website; any production schema or Edge deployment must be explicitly scoped, backed up and sequenced safely. Do not infer conference GO from successful technical checks.
