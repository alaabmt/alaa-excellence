-- Tamayuz Live: single-round-trip audience hot path (additive; safe to apply before or
-- after the Edge Function that uses it). Measured 2026-11-13: each Edge->database round
-- trip costs roughly 350-900 ms when the function executes far from the database, and the
-- previous audience poll needed 3-4 sequential round trips. These functions collapse each
-- audience action into ONE round trip without changing who may do what.
--
-- Security model is unchanged: SECURITY INVOKER, empty search_path, EXECUTE only for
-- service_role (the Edge Function). anon/authenticated cannot call them, and RLS on the
-- live_* tables still blocks direct Data API access.
-- Rollback: the Edge Function falls back to the legacy queries when these functions are
-- absent, so `DROP FUNCTION` of the four functions below is a complete, data-free rollback.

-- Audience poll: session snapshot + participant validity + own-vote flag + active question.
-- The answer key, justification and effect are added ONLY after the presenter reveals them.
CREATE OR REPLACE FUNCTION public.live_audience_view(p_code text, p_token_hash text)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'session', jsonb_build_object(
      'id', s.id, 'code', s.join_code, 'state', s.state,
      'active_question_id', s.active_question_id, 'show_results', s.show_results,
      'reveal_correct_answer', s.reveal_correct_answer, 'revision', s.revision),
    'participant_valid', p.id IS NOT NULL,
    'voted', p.id IS NOT NULL AND s.active_question_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.live_votes v
      WHERE v.session_id = s.id AND v.question_id = s.active_question_id
        AND v.participant_id = p.id),
    'questions', CASE WHEN q.id IS NULL THEN '[]'::jsonb ELSE jsonb_build_array(
      jsonb_build_object('id', q.id, 'prompt', q.prompt, 'kind', q.kind,
                         'options', q.options, 'position', q.position)
      || CASE WHEN s.reveal_correct_answer THEN jsonb_build_object(
           'correct_answer', q.correct_answer,
           'answer_justification', q.answer_justification,
           'answer_effect', q.answer_effect)
         ELSE '{}'::jsonb END) END)
  FROM public.live_sessions s
  LEFT JOIN public.live_participants p
    ON p_token_hash IS NOT NULL AND p.token_hash = p_token_hash AND p.session_id = s.id
  LEFT JOIN public.live_questions q
    ON q.id = s.active_question_id AND q.presentation_id = s.presentation_id
  WHERE s.join_code = p_code
$$;
REVOKE ALL ON FUNCTION public.live_audience_view(text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.live_audience_view(text,text) TO service_role;

-- Vote: validates session state, participant and answer and inserts in one transaction.
-- FOR SHARE on the session row makes "close voting" a hard boundary: a vote either commits
-- before the presenter's state change or sees the new state and is refused.
-- One vote per participant/question stays enforced by the existing unique constraint.
CREATE OR REPLACE FUNCTION public.live_cast_vote(p_code text, p_token_hash text, p_answer text)
RETURNS text
LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $$
DECLARE
  v_session_id uuid; v_state text; v_question_id uuid;
  v_participant_id uuid; v_kind text; v_options jsonb; v_rows integer;
BEGIN
  SELECT s.id, s.state, s.active_question_id INTO v_session_id, v_state, v_question_id
    FROM public.live_sessions s WHERE s.join_code = p_code FOR SHARE;
  IF NOT FOUND OR v_state <> 'open' OR v_question_id IS NULL THEN
    RETURN 'closed';
  END IF;
  SELECT p.id INTO v_participant_id FROM public.live_participants p
    WHERE p.token_hash = p_token_hash AND p.session_id = v_session_id;
  IF NOT FOUND THEN
    RETURN 'invalid_participant';
  END IF;
  SELECT q.kind, q.options INTO v_kind, v_options
    FROM public.live_questions q WHERE q.id = v_question_id;
  IF NOT FOUND THEN
    RETURN 'question_missing';
  END IF;
  IF p_answer IS NULL OR length(p_answer) NOT BETWEEN 1 AND 400
     OR (v_kind = 'choice' AND NOT (jsonb_typeof(v_options) = 'array' AND v_options ? p_answer))
     OR (v_kind = 'rating' AND p_answer NOT IN ('1','2','3','4','5')) THEN
    RETURN 'invalid_answer';
  END IF;
  INSERT INTO public.live_votes(session_id, question_id, participant_id, answer)
    VALUES (v_session_id, v_question_id, v_participant_id, p_answer)
    ON CONFLICT (session_id, question_id, participant_id) DO NOTHING;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN CASE WHEN v_rows = 1 THEN 'accepted' ELSE 'duplicate' END;
END;
$$;
REVOKE ALL ON FUNCTION public.live_cast_vote(text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.live_cast_vote(text,text,text) TO service_role;

-- Presenter tally: grouped in the database instead of downloading every vote row per poll.
CREATE OR REPLACE FUNCTION public.live_vote_aggregate(p_session_id uuid, p_question_id uuid)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'count', coalesce(sum(t.votes), 0)::bigint,
    'aggregate', coalesce(jsonb_agg(jsonb_build_object('answer', t.answer, 'votes', t.votes)
                                    ORDER BY t.answer), '[]'::jsonb))
  FROM (
    SELECT v.answer, count(*)::bigint AS votes FROM public.live_votes v
    WHERE v.session_id = p_session_id AND v.question_id = p_question_id
    GROUP BY v.answer
  ) t
$$;
REVOKE ALL ON FUNCTION public.live_vote_aggregate(uuid,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.live_vote_aggregate(uuid,uuid) TO service_role;

-- Interaction analytics event: same rules as before (active question only, known
-- participant, at most 8 events per participant/question/type), in one round trip.
CREATE OR REPLACE FUNCTION public.live_track_interaction(
  p_code text, p_token_hash text, p_question_id uuid, p_event_type text)
RETURNS text
LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $$
DECLARE v_session_id uuid; v_state text; v_active uuid; v_participant_id uuid; v_count integer;
BEGIN
  IF p_event_type NOT IN ('question_view','answer_click') THEN
    RETURN 'ignored';
  END IF;
  SELECT s.id, s.state, s.active_question_id INTO v_session_id, v_state, v_active
    FROM public.live_sessions s WHERE s.join_code = p_code;
  IF NOT FOUND OR v_state = 'ended' OR v_active IS DISTINCT FROM p_question_id THEN
    RETURN 'ignored';
  END IF;
  SELECT p.id INTO v_participant_id FROM public.live_participants p
    WHERE p.token_hash = p_token_hash AND p.session_id = v_session_id;
  IF NOT FOUND THEN
    RETURN 'invalid_participant';
  END IF;
  SELECT count(*) INTO v_count FROM public.live_interaction_events e
    WHERE e.participant_id = v_participant_id AND e.question_id = p_question_id
      AND e.event_type = p_event_type;
  IF v_count >= 8 THEN
    RETURN 'ignored';
  END IF;
  INSERT INTO public.live_interaction_events(session_id, question_id, participant_id, event_type)
    VALUES (v_session_id, p_question_id, v_participant_id, p_event_type);
  RETURN 'accepted';
END;
$$;
REVOKE ALL ON FUNCTION public.live_track_interaction(text,text,uuid,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.live_track_interaction(text,text,uuid,text) TO service_role;
