SELECT md5(concat_ws('||',
  (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_presentations t),
  (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_questions t),
  (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_sessions t),
  (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_participants t),
  (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_votes t),
  (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_interaction_events t),
  (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY user_id) FROM public.live_owner_accounts t),
  (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM public.live_config t),
  (SELECT string_agg(to_jsonb(t)::text, ';' ORDER BY id) FROM auth.users t)
)) AS synthetic_snapshot_fingerprint;
