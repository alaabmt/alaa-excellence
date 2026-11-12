-- Fail the recovery drill for missing rows, broken links, missing policy,
-- missing functions, or synthetic data leakage via unprivileged roles.
DO $verify$
BEGIN
 IF (SELECT count(*) FROM public.live_presentations)<>1
 OR (SELECT count(*) FROM public.live_questions)<>9
 OR (SELECT count(*) FROM public.live_sessions)<>2
 OR (SELECT count(*) FROM public.live_participants)<>4
 OR (SELECT count(*) FROM public.live_votes)<>2
 OR (SELECT count(*) FROM public.live_interaction_events)<>5
 OR (SELECT count(*) FROM public.live_owner_accounts)<>1 THEN
    RAISE EXCEPTION 'Restored synthetic row counts are wrong';
 END IF;
 IF EXISTS (SELECT 1 FROM public.live_votes v
   LEFT JOIN public.live_sessions s ON v.session_id=s.id
   LEFT JOIN public.live_questions q ON v.question_id=q.id AND s.presentation_id=q.presentation_id
   LEFT JOIN public.live_participants p ON v.participant_id=p.id AND p.session_id=s.id
   WHERE s.id IS NULL OR q.id IS NULL OR p.id IS NULL) THEN
    RAISE EXCEPTION 'Restored votes have broken relational references';
 END IF;
 IF EXISTS (SELECT 1 FROM public.live_sessions s
   LEFT JOIN public.live_questions q ON s.active_question_id=q.id AND s.presentation_id=q.presentation_id
   WHERE s.active_question_id IS NOT NULL AND q.id IS NULL) THEN
    RAISE EXCEPTION 'Restored active question inconsistent with presentation';
 END IF;
 IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
   WHERE n.nspname='public' AND c.relname LIKE 'live_%' AND c.relkind='r'
   AND NOT c.relrowsecurity) THEN
    RAISE EXCEPTION 'Restored Live table missing RLS';
 END IF;
 IF has_table_privilege('anon','public.live_votes','SELECT')
    OR has_table_privilege('authenticated','public.live_votes','SELECT')
    OR has_table_privilege('anon','public.live_questions','SELECT') THEN
    RAISE EXCEPTION 'Restored private tables exposed to visitor roles';
 END IF;
 IF (SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
     WHERE n.nspname='public' AND p.proname IN
       ('live_register_participant','live_reset_session','live_reorder_questions')
       AND p.prosecdef=false)<>3 THEN
    RAISE EXCEPTION 'Live RPC definitions missing or unexpectedly SECURITY DEFINER';
 END IF;
 IF (SELECT count(*) FROM public.live_questions
     WHERE correct_answer='A' AND prompt LIKE 'Synthetic question %')<>9 THEN
    RAISE EXCEPTION 'Synthetic correct answers/questions not restored';
 END IF;
END;
$verify$;

-- A duplicate vote must fail at the database boundary.
DO $dup$
BEGIN
 BEGIN
  INSERT INTO public.live_votes(session_id,question_id,participant_id,answer)
    VALUES('30000000-0000-4000-8000-000000000001',
           '20000000-0000-4000-8000-000000000001',
           '40000000-0000-4000-8000-000000000001','B');
  RAISE EXCEPTION 'Duplicate vote unexpectedly accepted';
 EXCEPTION WHEN unique_violation THEN NULL;
 END;
END;
$dup$;

-- Invalid participant references must be rejected by the real PostgreSQL FK.
DO $fk$
BEGIN
 BEGIN
  INSERT INTO public.live_votes(session_id,question_id,participant_id,answer)
    VALUES('30000000-0000-4000-8000-000000000001',
           '20000000-0000-4000-8000-000000000001',
           '80000000-0000-4000-8000-000000000099','B');
  RAISE EXCEPTION 'Broken foreign key unexpectedly accepted';
 EXCEPTION WHEN foreign_key_violation THEN NULL;
 END;
END;
$fk$;

-- Exercise all restored Live RPCs, then ROLLBACK to guarantee full recovery
-- state remains identical to the snapshot. No production database is involved.
BEGIN;
SELECT public.live_register_participant('DRILL001',repeat('f',64));
SELECT public.live_reorder_questions(
  '10000000-0000-4000-8000-000000000001',
  ARRAY(SELECT id FROM public.live_questions ORDER BY position DESC)
);
SELECT id,state,revision FROM public.live_reset_session('30000000-0000-4000-8000-000000000001');
DO $rpc$
BEGIN
 IF EXISTS (SELECT 1 FROM public.live_votes WHERE session_id='30000000-0000-4000-8000-000000000001')
    OR (SELECT state FROM public.live_sessions WHERE id='30000000-0000-4000-8000-000000000001') <> 'waiting' THEN
   RAISE EXCEPTION 'Restored live_reset_session failed';
 END IF;
END;
$rpc$;
ROLLBACK;
