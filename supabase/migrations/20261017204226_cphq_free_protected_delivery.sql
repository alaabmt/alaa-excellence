-- Free CPHQ release. No question content or credentials belong in this file.
-- Apply as a single transaction through the management API.
create schema if not exists cphq_private;
revoke all on schema cphq_private from public, anon, authenticated;

alter table public.cphq_attempts add column if not exists practice_day date
  generated always as ((created_at at time zone 'UTC')::date) stored;
alter table public.cphq_attempts add constraint cphq_one_identity
  check ((user_id is not null)::integer + (guest_token_hash is not null)::integer = 1);
create unique index cphq_user_question_day on public.cphq_attempts(user_id, practice_day, question_id) where user_id is not null;
create unique index cphq_guest_question_day on public.cphq_attempts(guest_token_hash, practice_day, question_id) where guest_token_hash is not null;
create unique index cphq_user_pending_day on public.cphq_attempts(user_id, practice_day) where user_id is not null and selected_index is null;
create unique index cphq_guest_pending_day on public.cphq_attempts(guest_token_hash, practice_day) where guest_token_hash is not null and selected_index is null;
create index if not exists cphq_published_domain on public.cphq_questions(domain_number,id) where status='published';
create index if not exists cphq_attempt_question on public.cphq_attempts(question_id);
alter table public.cphq_questions enable row level security;
alter table public.cphq_attempts enable row level security;
alter table public.cphq_guest_identity enable row level security;
revoke all on public.cphq_questions,public.cphq_attempts,public.cphq_guest_identity,public.cphq_entitlements from anon,authenticated;

create or replace function cphq_private.identity_ok(p_user uuid,p_digest text) returns boolean
language sql immutable set search_path='' as $$
 select (p_user is not null and p_digest is null) or
 (p_user is null and p_digest is not null and p_digest ~ '^[0-9a-f]{64}$');
$$;

create or replace function cphq_private.next_question(p_user uuid,p_digest text,p_domain integer) returns jsonb
language plpgsql set search_path='' as $$
declare q public.cphq_questions%rowtype; a public.cphq_attempts%rowtype;
 n integer; cap integer := case when p_user is null then 5 else 20 end;
 today date := (now() at time zone 'UTC')::date;
begin
 if not cphq_private.identity_ok(p_user,p_digest) then return jsonb_build_object('error','invalid_identity'); end if;
 if p_domain is null or p_domain not between 1 and 7 then return jsonb_build_object('error','invalid_domain'); end if;
 perform pg_advisory_xact_lock(hashtextextended(coalesce(p_user::text,p_digest),0));
 select count(*) into n from public.cphq_attempts where practice_day=today
 and (user_id=p_user or guest_token_hash=p_digest);
 -- Resume the one pending delivery, even if the browser changes domains or reloads.
 select * into a from public.cphq_attempts where practice_day=today and selected_index is null
 and (user_id=p_user or guest_token_hash=p_digest) limit 1;
 if found then
   select * into q from public.cphq_questions where id=a.question_id and status='published';
   if not found then return jsonb_build_object('error','question_unavailable'); end if;
 else
   if n>=cap then return jsonb_build_object('error','daily_limit','remaining',0); end if;
   select * into q from public.cphq_questions x where domain_number=p_domain and status='published'
   and not exists(select 1 from public.cphq_attempts y where y.question_id=x.id and y.practice_day=today and (y.user_id=p_user or y.guest_token_hash=p_digest))
   order by random() limit 1;
   if not found then return jsonb_build_object('error','domain_completed_today','remaining',cap-n); end if;
   insert into public.cphq_attempts(user_id,guest_token_hash,question_id) values(p_user,p_digest,q.id) returning * into a;
   n:=n+1;
 end if;
 return jsonb_build_object('id',q.id,'attempt_id',a.id,'domain',q.domain_number,'task',q.task_label,
 'question',q.stem,'options',q.choices,'remaining',greatest(cap-n,0),'limit',cap,'reset_at',(today+1)::timestamp at time zone 'UTC');
end $$;

create or replace function cphq_private.submit_answer(p_user uuid,p_digest text,p_question_id bigint,p_selected_index integer) returns jsonb
language plpgsql set search_path='' as $$
declare q public.cphq_questions%rowtype; a public.cphq_attempts%rowtype; n integer; replay boolean;
 cap integer := case when p_user is null then 5 else 20 end; today date := (now() at time zone 'UTC')::date;
begin
 if not cphq_private.identity_ok(p_user,p_digest) then return jsonb_build_object('error','invalid_identity'); end if;
 if p_selected_index is null or p_selected_index not between 0 and 3 or p_question_id is null then return jsonb_build_object('error','invalid_choice'); end if;
 perform pg_advisory_xact_lock(hashtextextended(coalesce(p_user::text,p_digest),0));
 select * into a from public.cphq_attempts where question_id=p_question_id and practice_day=today
 and (user_id=p_user or guest_token_hash=p_digest) for update;
 if not found then return jsonb_build_object('error','question_not_delivered'); end if;
 if a.selected_index is not null and a.selected_index<>p_selected_index then return jsonb_build_object('error','already_answered'); end if;
 select * into q from public.cphq_questions where id=p_question_id and status='published';
 if not found then return jsonb_build_object('error','question_unavailable'); end if;
 replay:=a.selected_index is not null;
 if not replay then update public.cphq_attempts set selected_index=p_selected_index where id=a.id; end if;
 select count(*) into n from public.cphq_attempts where practice_day=today and (user_id=p_user or guest_token_hash=p_digest);
 return jsonb_build_object('correct_index',q.correct_index,'rationales',q.rationales,'lesson',q.lesson,
 'is_correct',q.correct_index=p_selected_index,'selected_index',p_selected_index,'remaining',greatest(cap-n,0),'replayed',replay);
end $$;

create or replace function cphq_private.practice_status(p_user uuid,p_digest text) returns jsonb
language plpgsql set search_path='' as $$
declare n integer; answered integer; cap integer := case when p_user is null then 5 else 20 end;
 today date := (now() at time zone 'UTC')::date; domains jsonb;
begin
 if not cphq_private.identity_ok(p_user,p_digest) then return jsonb_build_object('error','invalid_identity'); end if;
 select count(*),count(selected_index) into n,answered from public.cphq_attempts where practice_day=today and (user_id=p_user or guest_token_hash=p_digest);
 select jsonb_agg(t order by domain) into domains from (
 select d as domain,count(q.id) as published,count(q.id) filter(where a.id is null) as available
 from generate_series(1,7) d left join public.cphq_questions q on q.domain_number=d and q.status='published'
 left join public.cphq_attempts a on a.question_id=q.id and a.practice_day=today and (a.user_id=p_user or a.guest_token_hash=p_digest)
 group by d) t;
 return jsonb_build_object('limit',cap,'remaining',greatest(cap-n,0),'delivered',n,'answered',answered,'domains',domains,'reset_at',(today+1)::timestamp at time zone 'UTC');
end $$;

-- The existing public RPC signatures remain compatible. Only these checked wrappers
-- can enter the private implementation. Anonymous Supabase users are not registered learners.
create or replace function public.cphq_next_registered(p_domain integer) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then return jsonb_build_object('error','login_required'); end if;
 return cphq_private.next_question(auth.uid(),null,p_domain);
end $$;
create or replace function public.cphq_submit_registered(p_question_id bigint,p_selected_index integer) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then return jsonb_build_object('error','login_required'); end if;
 return cphq_private.submit_answer(auth.uid(),null,p_question_id,p_selected_index);
end $$;
create or replace function public.cphq_status_registered() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then return jsonb_build_object('error','login_required'); end if;
 return cphq_private.practice_status(auth.uid(),null);
end $$;
create or replace function public.cphq_guest_next(p_digest text,p_domain integer) returns jsonb language sql security definer set search_path='' as $$ select cphq_private.next_question(null,p_digest,p_domain) $$;
create or replace function public.cphq_guest_submit(p_digest text,p_question_id bigint,p_selected_index integer) returns jsonb language sql security definer set search_path='' as $$ select cphq_private.submit_answer(null,p_digest,p_question_id,p_selected_index) $$;
create or replace function public.cphq_guest_status(p_digest text) returns jsonb language sql security definer set search_path='' as $$ select cphq_private.practice_status(null,p_digest) $$;
create or replace function public.cphq_daily_count() returns bigint language sql security definer set search_path='' as $$
 select count(*) from public.cphq_attempts where user_id=auth.uid() and practice_day=(now() at time zone 'UTC')::date
$$;
revoke all on all functions in schema cphq_private from public,anon,authenticated;
revoke all on function public.cphq_guest_next(text,integer),public.cphq_guest_submit(text,bigint,integer),public.cphq_guest_status(text) from public,anon,authenticated;
grant execute on function public.cphq_guest_next(text,integer),public.cphq_guest_submit(text,bigint,integer),public.cphq_guest_status(text) to service_role;
revoke all on function public.cphq_daily_count(),public.cphq_next_registered(integer),public.cphq_submit_registered(bigint,integer),public.cphq_status_registered() from public,anon;
grant execute on function public.cphq_daily_count(),public.cphq_next_registered(integer),public.cphq_submit_registered(bigint,integer),public.cphq_status_registered() to authenticated;
