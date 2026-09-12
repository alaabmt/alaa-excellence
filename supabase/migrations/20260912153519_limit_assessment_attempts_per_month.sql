-- Enforce a maximum of two new attempts per user, per assessment, per UTC calendar month.
-- Existing in-progress attempts are resumed by the application and do not create a new row.

create index if not exists assessment_attempts_user_key_created_idx
  on public.assessment_attempts (user_id, assessment_key, created_at);

create or replace function public.enforce_assessment_monthly_attempt_limit()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  month_start timestamptz;
  month_end timestamptz;
  attempt_count integer;
  lock_key bigint;
begin
  -- Service/admin maintenance with no authenticated user context is not rate-limited.
  if auth.uid() is null then
    return new;
  end if;

  -- The production application currently exposes only these two assessments.
  if new.assessment_key not in ('learning-preference-profile', 'work-approach-assessment') then
    return new;
  end if;

  -- Do not allow browser-supplied timestamps to backdate a new attempt into another month.
  new.created_at := now();
  new.started_at := now();
  new.updated_at := now();

  month_start := (date_trunc('month', timezone('UTC', now())) at time zone 'UTC');
  month_end := ((date_trunc('month', timezone('UTC', now())) + interval '1 month') at time zone 'UTC');

  -- Serialize concurrent creates for the same user/assessment/month so parallel requests
  -- cannot both pass the count check and exceed the limit.
  lock_key := hashtextextended(
    new.user_id::text || '|' || new.assessment_key || '|' ||
    to_char(month_start at time zone 'UTC', 'YYYY-MM'),
    0
  );
  perform pg_advisory_xact_lock(lock_key);

  select count(*)
    into attempt_count
    from public.assessment_attempts
   where user_id = new.user_id
     and assessment_key = new.assessment_key
     and created_at >= month_start
     and created_at < month_end;

  if attempt_count >= 2 then
    raise exception using
      errcode = 'P0001',
      message = 'monthly_attempt_limit_reached';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_assessment_monthly_attempt_limit on public.assessment_attempts;

create trigger enforce_assessment_monthly_attempt_limit
before insert on public.assessment_attempts
for each row
execute function public.enforce_assessment_monthly_attempt_limit();
