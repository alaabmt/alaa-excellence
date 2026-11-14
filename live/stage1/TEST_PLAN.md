# Tamayuz Live — feature acceptance test plan (not yet executed)

Scope: Q&A, timer, ranking, image-click. Existing polls, CMI presentations and production data must remain unchanged until approved rollout.

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
9. **Concurrency**: at least 40 simultaneous participants voting and submitting Q&A; check no duplicates, timeouts, 429/5xx spikes or cross-session leakage.
10. **Rollback**: confirm ability to restore previous frontend and Edge function without losing existing sessions or production data.

## Gate
Do not mark ready for user acceptance testing until staging is deployed, the cases above pass, and a peer review approves the PR. Do not infer conference GO from successful technical checks.
