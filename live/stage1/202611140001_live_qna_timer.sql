-- Tamayuz Live stage 1: additive schema. NOT APPLIED TO PRODUCTION.
alter table public.live_sessions
  add column if not exists qna_enabled boolean not null default false,
  add column if not exists vote_deadline_at timestamptz;
-- Extend the existing Live question kind constraint for the two new types.
-- This migration is staged only; inspect the existing constraint definition
-- in an isolated database before applying it.
alter table public.live_questions
  drop constraint if exists live_questions_kind_check;
alter table public.live_questions
  add constraint live_questions_kind_check
  check (kind in ('choice','rating','text','ranking','image_click'));

alter table public.live_questions
  add column if not exists timer_seconds integer
  check (timer_seconds is null or timer_seconds between 10 and 600);

create table if not exists public.live_audience_questions (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references public.live_sessions(id) on delete cascade,
 participant_id uuid not null references public.live_participants(id) on delete cascade,
 body text not null check (char_length(body) between 1 and 500),
 status text not null default 'open' check (status in ('open','answered','hidden')),
 created_at timestamptz not null default now()
);
create index if not exists live_audience_questions_session_idx
 on public.live_audience_questions(session_id,status,created_at desc);

create table if not exists public.live_audience_question_upvotes (
 question_id uuid not null references public.live_audience_questions(id) on delete cascade,
 participant_id uuid not null references public.live_participants(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(question_id,participant_id)
);
create index if not exists live_audience_upvotes_participant_idx
 on public.live_audience_question_upvotes(participant_id);

alter table public.live_audience_questions enable row level security;
alter table public.live_audience_question_upvotes enable row level security;
revoke all on public.live_audience_questions from anon, authenticated;
revoke all on public.live_audience_question_upvotes from anon, authenticated;
-- Only the existing service-role-backed Edge Function may access these tables.
