-- Tamayuz Live hot-path SQL tests. Run ONLY on a disposable database that was loaded with
-- live/qa/recovery/schema.sql + live_atomic_operations.sql + live_hot_path.sql.
-- Every statement is rolled back; synthetic identifiers only.
\set ON_ERROR_STOP 1
BEGIN;
INSERT INTO public.live_presentations(id,title,locale,owner_token_hash)
VALUES('a1000000-0000-4000-8000-000000000001','HOT PATH TEST','en',repeat('e',64));
INSERT INTO public.live_questions(id,presentation_id,position,prompt,kind,options,correct_answer,answer_justification,answer_effect) VALUES
('a2000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000001',0,'Choice?','choice','["A","B"]','A','Because','Effect'),
('a2000000-0000-4000-8000-000000000002','a1000000-0000-4000-8000-000000000001',1,'Rate','rating','[]',NULL,NULL,NULL),
('a2000000-0000-4000-8000-000000000003','a1000000-0000-4000-8000-000000000001',2,'Say','text','[]',NULL,NULL,NULL);
-- A question of ANOTHER presentation must never be served through this session.
INSERT INTO public.live_presentations(id,title,locale,owner_token_hash)
VALUES('a1000000-0000-4000-8000-000000000002','OTHER','en',repeat('f',64));
INSERT INTO public.live_questions(id,presentation_id,position,prompt,kind,options)
VALUES('a2000000-0000-4000-8000-000000000009','a1000000-0000-4000-8000-000000000002',0,'Foreign','choice','["X","Y"]');
INSERT INTO public.live_sessions(id,presentation_id,join_code,presenter_token_hash,state)
VALUES('a3000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000001','HOTPATH001',repeat('1',64),'waiting');

SET LOCAL ROLE service_role;
DO $$
DECLARE v jsonb; r text; sid uuid := 'a3000000-0000-4000-8000-000000000001';
  q1 uuid := 'a2000000-0000-4000-8000-000000000001'; h1 text := repeat('a',64); h2 text := repeat('b',64);
BEGIN
  -- Unknown session -> NULL (Edge maps to 404).
  ASSERT public.live_audience_view('NOPE000000', h1) IS NULL, 'unknown code must be NULL';
  -- Waiting, not joined.
  v := public.live_audience_view('HOTPATH001', h1);
  ASSERT (v->'session'->>'state') = 'waiting' AND (v->>'participant_valid')::boolean = false
     AND (v->>'voted')::boolean = false AND jsonb_array_length(v->'questions') = 0, 'waiting snapshot';
  ASSERT (v->'session') ?& array['id','code','state','active_question_id','show_results','reveal_correct_answer','revision'], 'session keys';
  ASSERT NOT (v->'session') ? 'presenter_token_hash', 'presenter hash must never be exposed';
  ASSERT public.live_register_participant('HOTPATH001', h1) = sid, 'join';
  -- Voting refused while not open.
  ASSERT public.live_cast_vote('HOTPATH001', h1, 'A') = 'closed', 'vote before open';
  UPDATE public.live_sessions SET state='open', active_question_id=q1, revision=revision+1 WHERE id=sid;
  v := public.live_audience_view('HOTPATH001', h1);
  ASSERT (v->>'participant_valid')::boolean AND NOT (v->>'voted')::boolean, 'joined, not voted';
  ASSERT jsonb_array_length(v->'questions') = 1 AND (v->'questions'->0->>'id')::uuid = q1, 'active question';
  -- Answer key hidden until reveal.
  ASSERT NOT (v->'questions'->0) ?| array['correct_answer','answer_justification','answer_effect'], 'answer key leaked before reveal';
  ASSERT v::text NOT LIKE '%Because%', 'justification leaked before reveal';
  -- Token of nobody / NULL token.
  ASSERT NOT (public.live_audience_view('HOTPATH001', NULL)->>'participant_valid')::boolean, 'null token';
  ASSERT public.live_cast_vote('HOTPATH001', h2, 'A') = 'invalid_participant', 'unknown participant';
  ASSERT public.live_cast_vote('HOTPATH001', h1, 'Z') = 'invalid_answer', 'option not offered';
  ASSERT public.live_cast_vote('HOTPATH001', h1, '') = 'invalid_answer', 'empty answer';
  ASSERT public.live_cast_vote('HOTPATH001', h1, 'A') = 'accepted', 'first vote';
  ASSERT public.live_cast_vote('HOTPATH001', h1, 'B') = 'duplicate', 'second vote must not change the first';
  ASSERT (SELECT answer FROM public.live_votes WHERE session_id=sid AND question_id=q1) = 'A', 'first answer preserved';
  ASSERT (public.live_audience_view('HOTPATH001', h1)->>'voted')::boolean, 'voted flag';
  -- Aggregate.
  PERFORM public.live_register_participant('HOTPATH001', h2);
  ASSERT public.live_cast_vote('HOTPATH001', h2, 'B') = 'accepted', 'second participant';
  v := public.live_vote_aggregate(sid, q1);
  ASSERT (v->>'count')::int = 2 AND v->'aggregate' = '[{"answer":"A","votes":1},{"answer":"B","votes":1}]'::jsonb, 'aggregate '||v::text;
  ASSERT (public.live_vote_aggregate(sid, 'a2000000-0000-4000-8000-000000000002')->>'count')::int = 0, 'empty aggregate';
  -- Reveal adds the key.
  UPDATE public.live_sessions SET reveal_correct_answer=true, revision=revision+1 WHERE id=sid;
  v := public.live_audience_view('HOTPATH001', h1);
  ASSERT (v->'questions'->0->>'correct_answer') = 'A' AND (v->'questions'->0->>'answer_justification') = 'Because', 'reveal';
  -- Rating and text validation.
  UPDATE public.live_sessions SET active_question_id='a2000000-0000-4000-8000-000000000002', reveal_correct_answer=false WHERE id=sid;
  ASSERT NOT (public.live_audience_view('HOTPATH001', h1)->>'voted')::boolean, 'voted flag is per question';
  ASSERT public.live_cast_vote('HOTPATH001', h1, '6') = 'invalid_answer', 'rating range';
  ASSERT public.live_cast_vote('HOTPATH001', h1, '5') = 'accepted', 'rating';
  UPDATE public.live_sessions SET active_question_id='a2000000-0000-4000-8000-000000000003' WHERE id=sid;
  ASSERT public.live_cast_vote('HOTPATH001', h1, repeat('x',401)) = 'invalid_answer', 'text length';
  ASSERT public.live_cast_vote('HOTPATH001', h1, 'free text') = 'accepted', 'text';
  -- Foreign question is not served and closed/ended sessions refuse votes.
  UPDATE public.live_sessions SET active_question_id='a2000000-0000-4000-8000-000000000009' WHERE id=sid;
  ASSERT jsonb_array_length(public.live_audience_view('HOTPATH001', h1)->'questions') = 0, 'foreign question served';
  UPDATE public.live_sessions SET active_question_id=q1, state='closed' WHERE id=sid;
  ASSERT public.live_cast_vote('HOTPATH001', h2, 'A') = 'closed', 'closed';
  -- Interaction tracking rules.
  ASSERT public.live_track_interaction('HOTPATH001', h1, q1, 'question_view') = 'accepted', 'track';
  ASSERT public.live_track_interaction('HOTPATH001', h1, q1, 'join_link_open') = 'ignored', 'event type allowlist';
  ASSERT public.live_track_interaction('HOTPATH001', repeat('9',64), q1, 'question_view') = 'invalid_participant', 'track participant';
  ASSERT public.live_track_interaction('HOTPATH001', h1, 'a2000000-0000-4000-8000-000000000002', 'question_view') = 'ignored', 'inactive question';
  FOR i IN 1..10 LOOP PERFORM public.live_track_interaction('HOTPATH001', h1, q1, 'answer_click'); END LOOP;
  ASSERT (SELECT count(*) FROM public.live_interaction_events WHERE session_id=sid AND event_type='answer_click') = 8, 'cap of 8';
  UPDATE public.live_sessions SET state='ended' WHERE id=sid;
  ASSERT public.live_cast_vote('HOTPATH001', h1, 'A') = 'closed', 'ended';
  ASSERT public.live_track_interaction('HOTPATH001', h1, q1, 'question_view') = 'ignored', 'ended track';
  -- Reset invalidates the participant.
  PERFORM public.live_reset_session(sid);
  ASSERT NOT (public.live_audience_view('HOTPATH001', h1)->>'participant_valid')::boolean, 'reset invalidates';
END $$;
RESET ROLE;

-- anon / authenticated must not be able to execute any hot-path function.
DO $$
DECLARE fn text; role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon','authenticated'] LOOP
    FOREACH fn IN ARRAY ARRAY['public.live_audience_view(text,text)','public.live_cast_vote(text,text,text)',
                              'public.live_vote_aggregate(uuid,uuid)','public.live_track_interaction(text,text,uuid,text)'] LOOP
      ASSERT NOT has_function_privilege(role_name, fn, 'EXECUTE'), role_name||' can execute '||fn;
    END LOOP;
  END LOOP;
  ASSERT (SELECT bool_and(NOT prosecdef AND proconfig @> ARRAY['search_path=""'])
          FROM pg_proc WHERE pronamespace='public'::regnamespace
            AND proname IN ('live_audience_view','live_cast_vote','live_vote_aggregate','live_track_interaction')),
         'functions must be SECURITY INVOKER with empty search_path';
END $$;
ROLLBACK;
SELECT 'TAMAYUZ_LIVE_HOT_PATH_SQL_PASS' AS result;
