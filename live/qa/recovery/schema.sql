-- Disposable PostgreSQL 17 model, based on read-only inspection of the
-- actual public.live_* schema on 2026-11-13. SYNTHETIC ONLY.
-- This is NOT a production pg_dump, nor a restoration of a Supabase backup.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY);
CREATE TABLE public.live_config (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  admin_token_hash text NOT NULL
);
CREATE TABLE public.live_presentations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK(length(title) BETWEEN 1 AND 180),
  locale text NOT NULL DEFAULT 'en' CHECK(locale IN ('en','ar')),
  owner_token_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.live_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id uuid NOT NULL REFERENCES public.live_presentations(id) ON DELETE CASCADE,
  position integer NOT NULL CHECK(position >= 0),
  prompt text NOT NULL CHECK(length(prompt) BETWEEN 1 AND 6000),
  kind text NOT NULL DEFAULT 'choice' CHECK(kind IN ('choice','rating','text')),
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer text,
  answer_justification text,
  answer_effect text,
  UNIQUE(presentation_id,position)
);
CREATE TABLE public.live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id uuid NOT NULL REFERENCES public.live_presentations(id) ON DELETE CASCADE,
  join_code text NOT NULL UNIQUE CHECK(length(join_code) BETWEEN 6 AND 12),
  presenter_token_hash text NOT NULL,
  active_question_id uuid REFERENCES public.live_questions(id) ON DELETE SET NULL,
  state text NOT NULL DEFAULT 'waiting' CHECK(state IN ('waiting','open','closed','ended')),
  show_results boolean NOT NULL DEFAULT false,
  revision bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  question_results_visibility jsonb NOT NULL DEFAULT '{}'::jsonb,
  reveal_correct_answer boolean NOT NULL DEFAULT false,
  label text
);
CREATE TABLE public.live_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.live_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.live_questions(id) ON DELETE CASCADE,
  participant_id uuid NOT NULL REFERENCES public.live_participants(id) ON DELETE CASCADE,
  answer text NOT NULL CHECK(length(answer) BETWEEN 1 AND 400),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id,question_id,participant_id)
);
CREATE TABLE public.live_interaction_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.live_questions(id) ON DELETE SET NULL,
  participant_id uuid REFERENCES public.live_participants(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK(event_type IN ('question_view','answer_click','join_link_open')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.live_owner_accounts (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX live_questions_presentation_idx ON public.live_questions(presentation_id,position);
CREATE INDEX live_sessions_presentation_idx ON public.live_sessions(presentation_id);
CREATE INDEX live_sessions_active_question_idx ON public.live_sessions(active_question_id);
CREATE INDEX live_participants_session_idx ON public.live_participants(session_id);
CREATE INDEX live_votes_aggregate_idx ON public.live_votes(session_id,question_id,answer);
CREATE INDEX live_votes_participant_idx ON public.live_votes(participant_id);
CREATE INDEX live_votes_question_idx ON public.live_votes(question_id);
CREATE INDEX live_interaction_events_session_time_idx ON public.live_interaction_events(session_id,created_at);
CREATE INDEX live_interaction_events_participant_idx ON public.live_interaction_events(participant_id,question_id,event_type);
CREATE INDEX live_interaction_events_question_idx ON public.live_interaction_events(question_id);
ALTER TABLE public.live_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_interaction_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_owner_accounts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.live_config,public.live_presentations,public.live_questions,
  public.live_sessions,public.live_participants,public.live_votes,
  public.live_interaction_events,public.live_owner_accounts FROM PUBLIC,anon,authenticated;
-- Load actual Live-only RPC definitions from live/backend/sql/live_atomic_operations.sql
-- AFTER this schema. No CPHQ, third-party tables, or real credentials are loaded.
