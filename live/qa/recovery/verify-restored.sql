-- Generic verification of a RESTORED Live database (no fixed row counts, no content output).
-- Run only on a disposable restore target. All functional calls are rolled back.
\set ON_ERROR_STOP 1
DO $verify$
DECLARE missing text;
BEGIN
 SELECT string_agg(x, ', ') INTO missing FROM unnest(ARRAY['live_config','live_presentations','live_questions',
   'live_sessions','live_participants','live_votes','live_interaction_events','live_owner_accounts']) x
   WHERE to_regclass('public.'||x) IS NULL;
 IF missing IS NOT NULL THEN RAISE EXCEPTION 'Missing Live tables: %', missing; END IF;
 IF EXISTS (SELECT 1 FROM public.live_votes v
   LEFT JOIN public.live_sessions s ON v.session_id=s.id
   LEFT JOIN public.live_questions q ON v.question_id=q.id AND s.presentation_id=q.presentation_id
   LEFT JOIN public.live_participants p ON v.participant_id=p.id AND p.session_id=s.id
   WHERE s.id IS NULL OR q.id IS NULL OR p.id IS NULL) THEN
   RAISE EXCEPTION 'Restored votes have broken session/question/participant relationships';
 END IF;
 IF EXISTS (SELECT 1 FROM public.live_votes GROUP BY session_id,question_id,participant_id HAVING count(*)>1) THEN
   RAISE EXCEPTION 'Duplicate votes after restore';
 END IF;
 IF EXISTS (SELECT 1 FROM public.live_sessions s LEFT JOIN public.live_questions q
   ON s.active_question_id=q.id AND s.presentation_id=q.presentation_id
   WHERE s.active_question_id IS NOT NULL AND q.id IS NULL) THEN
   RAISE EXCEPTION 'Active question inconsistent with its presentation';
 END IF;
 IF EXISTS (SELECT 1 FROM public.live_questions q LEFT JOIN public.live_presentations p ON p.id=q.presentation_id WHERE p.id IS NULL)
 OR EXISTS (SELECT 1 FROM public.live_sessions s LEFT JOIN public.live_presentations p ON p.id=s.presentation_id WHERE p.id IS NULL)
 OR EXISTS (SELECT 1 FROM public.live_participants x LEFT JOIN public.live_sessions s ON s.id=x.session_id WHERE s.id IS NULL) THEN
   RAISE EXCEPTION 'Orphaned questions, sessions or participants';
 END IF;
 -- Access controls: RLS on every Live table, no table privilege for anon/authenticated.
 IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
   WHERE n.nspname='public' AND c.relname LIKE 'live\_%' AND c.relkind='r' AND NOT c.relrowsecurity) THEN
   RAISE EXCEPTION 'A restored Live table is missing row level security';
 END IF;
 IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid, unnest(ARRAY['anon','authenticated']) r,
   unnest(ARRAY['SELECT','INSERT','UPDATE','DELETE']) priv
   WHERE n.nspname='public' AND c.relname LIKE 'live\_%' AND c.relkind='r' AND has_table_privilege(r, c.oid, priv)) THEN
   RAISE EXCEPTION 'anon/authenticated hold a table privilege on a restored Live table';
 END IF;
 IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename LIKE 'live\_%' AND roles && ARRAY['anon','authenticated','public']::name[]) THEN
   RAISE EXCEPTION 'Unexpected permissive policy for anon/authenticated on a Live table';
 END IF;
 -- Functions present, service_role-only.
 IF EXISTS (SELECT 1 FROM unnest(ARRAY['live_reset_session','live_reorder_questions','live_register_participant',
   'live_audience_view','live_cast_vote','live_vote_aggregate','live_track_interaction']) f
   WHERE NOT EXISTS (SELECT 1 FROM pg_proc p WHERE p.pronamespace='public'::regnamespace AND p.proname=f)) THEN
   RAISE EXCEPTION 'A Live SQL function is missing';
 END IF;
 IF EXISTS (SELECT 1 FROM pg_proc p, unnest(ARRAY['anon','authenticated']) r
   WHERE p.pronamespace='public'::regnamespace AND p.proname LIKE 'live\_%' AND has_function_privilege(r, p.oid, 'EXECUTE')) THEN
   RAISE EXCEPTION 'anon/authenticated can execute a Live function';
 END IF;
 -- Owner allowlist linkage survived.
 IF EXISTS (SELECT 1 FROM public.live_owner_accounts o LEFT JOIN auth.users u ON u.id=o.user_id WHERE u.id IS NULL) THEN
   RAISE EXCEPTION 'Owner allowlist row without its auth user';
 END IF;
END
$verify$;
-- Backend functionality on the restored data, as the Edge Function role, rolled back.
BEGIN;
SET LOCAL ROLE service_role;
DO $functional$
DECLARE s record; v jsonb; token text := repeat('7',64); r text; n integer := 0;
BEGIN
 -- Every restored session must be readable through the audience path without leaking keys.
 FOR s IN SELECT * FROM public.live_sessions LOOP
   v := public.live_audience_view(s.join_code, NULL);
   IF v IS NULL OR (v->'session'->>'id')::uuid <> s.id OR (v->'session'->>'state') <> s.state THEN
     RAISE EXCEPTION 'Audience view of a restored session is wrong';
   END IF;
   IF NOT s.reveal_correct_answer AND jsonb_array_length(v->'questions')=1 AND (v->'questions'->0) ? 'correct_answer' THEN
     RAISE EXCEPTION 'Answer key exposed before reveal on restored data';
   END IF;
   IF s.active_question_id IS NOT NULL THEN
     IF (public.live_vote_aggregate(s.id, s.active_question_id)->>'count')::bigint <>
        (SELECT count(*) FROM public.live_votes WHERE session_id=s.id AND question_id=s.active_question_id) THEN
       RAISE EXCEPTION 'Tally of a restored session does not match its votes';
     END IF;
   END IF;
   n := n + 1;
 END LOOP;
 -- A full join -> vote -> duplicate -> tally cycle on one restored presentation (rolled back).
 SELECT ses.* INTO s FROM public.live_sessions ses
   WHERE EXISTS (SELECT 1 FROM public.live_questions q WHERE q.presentation_id=ses.presentation_id AND q.kind='choice'
                 AND jsonb_array_length(q.options)>=2)
     AND (SELECT count(*) FROM public.live_participants p WHERE p.session_id=ses.id) < 600 LIMIT 1;
 IF FOUND THEN
   UPDATE public.live_sessions SET state='open', revision=revision+1,
     active_question_id=(SELECT q.id FROM public.live_questions q WHERE q.presentation_id=s.presentation_id AND q.kind='choice' ORDER BY q.position LIMIT 1)
     WHERE id=s.id RETURNING * INTO s;
   PERFORM public.live_register_participant(s.join_code, token);
   SELECT public.live_cast_vote(s.join_code, token, (SELECT q.options->>0 FROM public.live_questions q WHERE q.id=s.active_question_id)) INTO r;
   IF r <> 'accepted' THEN RAISE EXCEPTION 'Vote on restored data returned %', r; END IF;
   SELECT public.live_cast_vote(s.join_code, token, (SELECT q.options->>1 FROM public.live_questions q WHERE q.id=s.active_question_id)) INTO r;
   IF r <> 'duplicate' THEN RAISE EXCEPTION 'Second vote on restored data returned %', r; END IF;
   IF NOT (public.live_audience_view(s.join_code, token)->>'voted')::boolean THEN RAISE EXCEPTION 'Voted flag wrong on restored data'; END IF;
 END IF;
 RAISE NOTICE 'functional_sessions_checked=%', n;
END
$functional$;
ROLLBACK;
SELECT 'TAMAYUZ_LIVE_RESTORE_VERIFIED' AS result;
