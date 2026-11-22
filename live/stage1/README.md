# Tamayuz Live feature rollout — draft only

## Implemented on this branch
- Additive Q&A tables and indexes with RLS enabled, no direct client grants.
- Edge actions for authenticated audience Q&A submission, upvoting, presenter moderation and toggle.
- Server-authoritative vote expiry, presenter start/reset, per-question timer configuration.
- Question editor, presenter and audience controls for the above.

## Not yet complete
- Ranking question editor/voting/results.
- Clickable-image question editor/voting/results.
- End-to-end tests, accessibility and Arabic/mobile QA.
- Concurrent-user load testing and migration rehearsal.

## Production deployment gate (do not skip)
1. Review staged Edge source against deployed function; do not overwrite unrelated production changes.
2. Validate SQL migration on a non-production database.
3. Exercise owner and participant authorization, duplicate votes, timer expiry, race conditions, XSS and limits.
4. Confirm existing choice/rating/text/wordcloud polls and Before/After flows remain unchanged.
5. Test at least 40 simultaneous audience clients and mobile viewport.
6. Run Live-specific CI and peer review.
7. Deploy only after all checks pass; verify /live/ and the Edge function and roll back if necessary.

No production changes are included in this pull request.
