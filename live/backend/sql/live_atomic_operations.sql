-- Tamayuz Live: atomic database operations; invoke only through owner-checked Edge Function.
-- SECURITY INVOKER and explicit EXECUTE grants prevent direct audience access.
CREATE OR REPLACE FUNCTION public.live_reset_session(p_session_id uuid)
RETURNS TABLE(id uuid, state text, revision bigint)
LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $$
DECLARE v_revision bigint;
BEGIN
  SELECT s.revision INTO v_revision
  FROM public.live_sessions s WHERE s.id = p_session_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found' USING ERRCODE = 'P0002';
  END IF;
  DELETE FROM public.live_interaction_events WHERE session_id = p_session_id;
  DELETE FROM public.live_votes WHERE session_id = p_session_id;
  DELETE FROM public.live_participants WHERE session_id = p_session_id;
  RETURN QUERY
    UPDATE public.live_sessions s
    SET state = 'waiting', active_question_id = NULL, show_results = false,
        reveal_correct_answer = false, question_results_visibility = '{}'::jsonb,
        revision = v_revision + 1
    WHERE s.id = p_session_id
    RETURNING s.id, s.state, s.revision;
END;
$$;
REVOKE ALL ON FUNCTION public.live_reset_session(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.live_reset_session(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.live_reorder_questions(p_presentation_id uuid, p_ids uuid[])
RETURNS boolean
LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $$
DECLARE v_count integer; v_base integer;
BEGIN
  IF p_ids IS NULL OR cardinality(p_ids) NOT BETWEEN 1 AND 100
     OR EXISTS (SELECT 1 FROM unnest(p_ids) AS x(id) WHERE x.id IS NULL)
     OR (SELECT count(DISTINCT id) FROM unnest(p_ids) AS x(id)) <> cardinality(p_ids) THEN
    RAISE EXCEPTION 'Invalid question order' USING ERRCODE = '22023';
  END IF;
  -- Lock the parent so concurrent reorders and FK inserts cannot interleave.
  PERFORM 1 FROM public.live_presentations WHERE id = p_presentation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Presentation not found' USING ERRCODE = 'P0002';
  END IF;
  SELECT count(*),coalesce(max(position),0)+1000 INTO v_count,v_base
    FROM public.live_questions WHERE presentation_id = p_presentation_id;
  IF v_count <> cardinality(p_ids) OR EXISTS (
    SELECT 1 FROM unnest(p_ids) AS x(id)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.live_questions q
      WHERE q.id = x.id AND q.presentation_id = p_presentation_id
    )
  ) THEN
    RAISE EXCEPTION 'Question list changed' USING ERRCODE = '40001';
  END IF;
  -- Two phases, one PostgreSQL transaction; constraint-safe and fully rollbackable.
  UPDATE public.live_questions SET position = position + v_base
    WHERE presentation_id = p_presentation_id;
  UPDATE public.live_questions q SET position = (ordered.ord - 1)::integer
    FROM unnest(p_ids) WITH ORDINALITY AS ordered(id,ord)
    WHERE q.id = ordered.id AND q.presentation_id = p_presentation_id;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.live_reorder_questions(uuid,uuid[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.live_reorder_questions(uuid,uuid[]) TO service_role;

CREATE OR REPLACE FUNCTION public.live_register_participant(p_code text, p_token_hash text)
RETURNS uuid
LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $$
DECLARE v_session_id uuid; v_state text; v_count integer;
BEGIN
  IF p_token_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Invalid token hash' USING ERRCODE = '22023';
  END IF;
  SELECT s.id,s.state INTO v_session_id,v_state
    FROM public.live_sessions s WHERE s.join_code = p_code FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found' USING ERRCODE = 'P0002';
  END IF;
  IF v_state = 'ended' THEN
    RAISE EXCEPTION 'Session ended' USING ERRCODE = 'P0001';
  END IF;
  SELECT count(*) INTO v_count FROM public.live_participants WHERE session_id = v_session_id;
  IF v_count >= 600 THEN
    RAISE EXCEPTION 'Session capacity reached' USING ERRCODE = 'P0001';
  END IF;
  INSERT INTO public.live_participants(session_id,token_hash)
    VALUES(v_session_id,p_token_hash);
  RETURN v_session_id;
END;
$$;
REVOKE ALL ON FUNCTION public.live_register_participant(text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.live_register_participant(text,text) TO service_role;

-- Cover foreign keys highlighted by Supabase database advisor.
CREATE INDEX IF NOT EXISTS live_interaction_events_question_idx
  ON public.live_interaction_events(question_id);
CREATE INDEX IF NOT EXISTS live_sessions_active_question_idx
  ON public.live_sessions(active_question_id);
CREATE INDEX IF NOT EXISTS live_sessions_presentation_idx
  ON public.live_sessions(presentation_id);
CREATE INDEX IF NOT EXISTS live_votes_participant_idx
  ON public.live_votes(participant_id);
CREATE INDEX IF NOT EXISTS live_votes_question_idx
  ON public.live_votes(question_id);
