-- Synthetic fixture for the ISOLATED Tamayuz Live stack only (disposable CI PostgreSQL).
-- Never run against the production project. No real titles, codes, tokens or answers.
-- Presenter tokens are fixed public test strings; they are worthless outside this stack.
INSERT INTO public.live_presentations(id,title,locale,owner_token_hash)
VALUES('c1000000-0000-4000-8000-000000000001','ISOLATED CAPACITY FIXTURE','en',repeat('e',64));
INSERT INTO public.live_questions(id,presentation_id,position,prompt,kind,options,correct_answer,answer_justification,answer_effect)
SELECT ('c2000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,'c1000000-0000-4000-8000-000000000001',n-1,
       'Synthetic clinical case '||n||': '||repeat('A 54-year-old patient presents with synthetic findings. ',12)||'What is the next step?',
       'choice','["Option A","Option B","Option C","Option D"]'::jsonb,'Option A',
       'Synthetic justification '||n,'Synthetic effect '||n
FROM generate_series(1,40) n;
INSERT INTO public.live_sessions(id,presentation_id,join_code,presenter_token_hash,state,label) VALUES
('c3000000-0000-4000-8000-000000000001','c1000000-0000-4000-8000-000000000001','LOADTEST01',
  encode(sha256(repeat('1a',24)::bytea),'hex'),'waiting','600-client load'),
('c3000000-0000-4000-8000-000000000002','c1000000-0000-4000-8000-000000000001','BRWSIDLE01',
  encode(sha256(repeat('2b',24)::bytea),'hex'),'waiting','browser rehearsal, idle backend'),
('c3000000-0000-4000-8000-000000000003','c1000000-0000-4000-8000-000000000001','BRWSLOAD01',
  encode(sha256(repeat('3c',24)::bytea),'hex'),'waiting','browser rehearsal during 600-client load'),
('c3000000-0000-4000-8000-000000000004','c1000000-0000-4000-8000-000000000001','LEGACY0001',
  encode(sha256(repeat('4d',24)::bytea),'hex'),'waiting','before/after comparison'),
('c3000000-0000-4000-8000-000000000005','c1000000-0000-4000-8000-000000000001','COMPARE001',
  encode(sha256(repeat('5e',24)::bytea),'hex'),'waiting','before/after comparison, new code');
