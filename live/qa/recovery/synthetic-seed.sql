-- Fixed fake identifiers, codes, answer text, hashes, user and content.
-- Only synthetic examples: the counts approximate the observed Live topology.
INSERT INTO auth.users(id) VALUES('90000000-0000-4000-8000-000000000001');
INSERT INTO public.live_owner_accounts(user_id) VALUES('90000000-0000-4000-8000-000000000001');
INSERT INTO public.live_config(id,admin_token_hash) VALUES(true,repeat('a',64));
INSERT INTO public.live_presentations(id,title,locale,owner_token_hash)
VALUES('10000000-0000-4000-8000-000000000001','DISPOSABLE RESTORE EXERCISE','en',repeat('b',64));
INSERT INTO public.live_questions(id,presentation_id,position,prompt,kind,options,correct_answer,answer_justification)
SELECT ('20000000-0000-4000-8000-' || lpad(n::text,12,'0'))::uuid,
       '10000000-0000-4000-8000-000000000001'::uuid,
       n-1,'Synthetic question '||n,'choice','["A","B","C","D"]'::jsonb,'A','Synthetic explanation'
FROM generate_series(1,9) AS n;
INSERT INTO public.live_sessions(id,presentation_id,join_code,presenter_token_hash,
  active_question_id,state,label)
VALUES
('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','DRILL001',repeat('c',64),
'20000000-0000-4000-8000-000000000001','closed','Synthetic closed session'),
('30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','DRILL002',repeat('d',64),
'20000000-0000-4000-8000-000000000002','waiting','Synthetic waiting session');
INSERT INTO public.live_participants(id,session_id,token_hash)
SELECT ('40000000-0000-4000-8000-' || lpad(n::text,12,'0'))::uuid,
       CASE WHEN n<=2 THEN '30000000-0000-4000-8000-000000000001'::uuid
            ELSE '30000000-0000-4000-8000-000000000002'::uuid END,
       lpad(n::text,64,'0')
FROM generate_series(1,4) n;
INSERT INTO public.live_votes(id,session_id,question_id,participant_id,answer)
VALUES
('50000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001',
'20000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001','A'),
('50000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000001',
'20000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000002','B');
INSERT INTO public.live_interaction_events(session_id,question_id,participant_id,event_type)
SELECT '30000000-0000-4000-8000-000000000001',
       '20000000-0000-4000-8000-000000000001',
       ('40000000-0000-4000-8000-' || lpad((1+(n%2))::text,12,'0'))::uuid,
       CASE WHEN n%2=0 THEN 'question_view' ELSE 'answer_click' END
FROM generate_series(1,5) n;
