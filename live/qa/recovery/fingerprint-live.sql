-- Order-independent content fingerprint and row counts of the eight Live tables only.
-- Output is one line: md5|presentations|questions|sessions|participants|votes|events|owners|config
-- Read-only. The md5 covers every column, so it changes if any restored value differs.
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SELECT concat_ws('|',
  md5(concat_ws('||',
    (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_presentations t),
    (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_questions t),
    (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_sessions t),
    (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_participants t),
    (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_votes t),
    (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_interaction_events t),
    (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY user_id) FROM public.live_owner_accounts t),
    (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_config t))),
  (SELECT count(*) FROM public.live_presentations),(SELECT count(*) FROM public.live_questions),
  (SELECT count(*) FROM public.live_sessions),(SELECT count(*) FROM public.live_participants),
  (SELECT count(*) FROM public.live_votes),(SELECT count(*) FROM public.live_interaction_events),
  (SELECT count(*) FROM public.live_owner_accounts),(SELECT count(*) FROM public.live_config));
COMMIT;
