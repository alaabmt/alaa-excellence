-- Run in a transaction. Every fixture, user and attempt is rolled back.
begin;
create temporary table cphq_test_result(check_name text, passed boolean);
do $$
declare guest text := encode(extensions.gen_random_bytes(32),'hex');
 learner uuid := gen_random_uuid(); q jsonb; a jsonb; replay jsonb; first_id bigint; n integer;
begin
 insert into auth.users(id,email,raw_user_meta_data) values(learner,'cphqtest@tests.invalid','{"username":"cphq_tx_test"}');
 perform set_config('request.jwt.claims',jsonb_build_object('sub',learner,'role','authenticated','is_anonymous',false)::text,true);
 assert (public.cphq_guest_submit(guest,1,0)->>'error')='question_not_delivered','unissued answer leaked';
 assert (public.cphq_guest_next(guest,null)->>'error')='invalid_domain','null domain';
 assert (public.cphq_guest_submit(guest,1,null)->>'error')='invalid_choice','null answer';
 for i in 1..5 loop
   q:=public.cphq_guest_next(guest,1);
   assert q ? 'question' and not q ?| array['correct_index','rationales','lesson'],'question delivery leaked answer';
   assert (q->>'remaining')::int=5-i,'guest count';
   replay:=public.cphq_guest_next(guest,7);
   assert q->>'id'=replay->>'id','next did not resume pending';
   if i=1 then first_id:=(q->>'id')::bigint; end if;
   a:=public.cphq_guest_submit(guest,(q->>'id')::bigint,0);
   assert a ? 'correct_index' and jsonb_array_length(a->'rationales')=4 and length(a->>'lesson')>0,'missing explanations';
   replay:=public.cphq_guest_submit(guest,(q->>'id')::bigint,0);
   assert replay->>'replayed'='true' and replay->>'remaining'=a->>'remaining','retry not idempotent';
   assert (public.cphq_guest_submit(guest,(q->>'id')::bigint,1)->>'error')='already_answered','answer changed';
 end loop;
 assert (public.cphq_guest_next(guest,2)->>'error')='daily_limit','sixth guest question delivered';
 assert (public.cphq_guest_submit(repeat('b',64),first_id,0)->>'error')='question_not_delivered','cross-guest submission';
 select count(*) into n from public.cphq_attempts where guest_token_hash=guest;
 assert n=5,'duplicate guest attempts';
 insert into cphq_test_result values('Guest five/day; pending resume; duplicate, null and unissued rejection; explanations',true);
 -- Rollover uses the same UTC date expression as the live quota.
 update public.cphq_attempts set created_at=created_at-interval '1 day' where guest_token_hash=guest;
 assert (public.cphq_guest_next(guest,1)->>'remaining')::int=4,'UTC rollover';
 insert into cphq_test_result values('UTC rollover resets allowance',true);
 -- Test-only content visible only inside this transaction, never committed.
 insert into public.cphq_questions(domain_number,task_label,stem,choices,correct_index,rationales,lesson,status)
 select 7,'QA fixture','Synthetic test item '||i,'["A","B","C","D"]',0,'["a","b","c","d"]','QA only','published' from generate_series(1,21)i;
 insert into public.cphq_entitlements(user_id,tier) values(learner,'premium');
 for i in 1..20 loop
   q:=public.cphq_next_registered(7);
   assert q ? 'question' and not q ?| array['correct_index','rationales','lesson'],'registered question leak';
   assert (q->>'remaining')::int=20-i,'registered count';
   a:=public.cphq_submit_registered((q->>'id')::bigint,0);
   assert a ? 'correct_index','registered submission';
   replay:=public.cphq_submit_registered((q->>'id')::bigint,0);
   assert replay->>'replayed'='true','registered retry';
 end loop;
 assert (public.cphq_next_registered(7)->>'error')='daily_limit','21st registered question delivered';
 select count(*) into n from public.cphq_attempts where user_id=learner;
 assert n=20,'duplicate registered attempts';
 insert into cphq_test_result values('Registered 20/day, no premium bypass, idempotent submissions',true);
 perform set_config('request.jwt.claims','{"role":"authenticated","is_anonymous":true,"sub":"00000000-0000-0000-0000-000000000001"}',true);
 assert (public.cphq_next_registered(1)->>'error')='login_required','anonymous sign-in bypass';
 perform set_config('request.jwt.claims','{}',true);
 assert (public.cphq_next_registered(1)->>'error')='login_required','missing auth bypass';
 assert not has_table_privilege('anon','public.cphq_questions','SELECT'),'anon bank access';
 assert not has_table_privilege('authenticated','public.cphq_questions','SELECT'),'learner bank access';
 assert not has_function_privilege('anon','public.cphq_next_registered(integer)','EXECUTE'),'anon registered RPC';
 assert not has_function_privilege('authenticated','public.cphq_guest_next(text,integer)','EXECUTE'),'guest RPC bypass';
 insert into cphq_test_result values('Unauthenticated/anonymous denial and private bank grants',true);
end $$;
select * from cphq_test_result;
rollback;
