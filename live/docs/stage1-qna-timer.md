# Tamayuz Live — Stage 1 implementation contract

Related: #229. **Design only, not deployed.**

## Audience Q&A

- Presenter enables/disables Q&A separately from polling; disabled by default.
- Session participant submits a plain-text question (1–500 characters); no links or HTML. Limit submissions and rate of requests.
- Session participants can upvote or undo their vote once per question. Unique (question_id, participant_id) constraint.
- Presenter can mark answered or hide; board shows counts, never participant identities.
- Additive private tables `live_audience_questions` (id, session_id, participant_id, body, status, created_at) and `live_audience_question_upvotes` (question_id, participant_id, created_at). Enable RLS without browser-facing policies.
- Authorized Edge Function actions: `qna_list`, `qna_submit`, `qna_upvote`, `qna_moderate`, `qna_toggle`. Verify session ownership and participant token hashes on every action; prevent cross-session upvotes.

## Countdown timer

- Per-question setting: Off by default; 15/30/45/60/90/120 seconds or custom 10–600 seconds.
- Presenter starts or resets. Store deadline server-side in session and reject votes after expiry in the existing `vote` action.
- Presenter and audience see small synchronized timer; reconnect restores deadline.
- Reset timer on question change and Before/After transition. Preserve existing voting when timer is Off.

## Release gates

- Existing CMI questions, votes, explanations, sessions and reports unchanged.
- Test authorization, RLS, duplicate votes, 40+ simultaneous participants, mobile layout, reconnect and timer expiry.
- Pass Live-specific CI and practice session before merge/deploy.
- Never infer conference GO from technical checks.
