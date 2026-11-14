#!/usr/bin/env node
// Offline Tamayuz Live Stage 1 smoke checks. No network, credentials or production data.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const html=fs.readFileSync('live/index.html','utf8');
const edge=fs.readFileSync('live/stage1/tamayuz-live.edge.ts','utf8');
const sql=fs.readFileSync('live/stage1/202611140001_live_qna_timer.sql','utf8');
const script=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
assert(script.length>1000,'missing inline JS');
new vm.Script(script,{filename:'live/index.html'});
for(const id of ['stage1-start-timer','stage1-reset-timer','stage1-qna-enabled','stage1-qna-submit','rank-submit','click-submit'])assert(html.includes(id), 'missing UI '+id);
for(const action of ['timer_start','timer_reset','qna_toggle','qna_submit','qna_upvote','qna_presenter_list','qna_moderate'])assert(edge.includes('action==="'+action+'"')||edge.includes('action==="'+action+'"||'), 'missing action '+action);
for(const kind of ['ranking','image_click']){assert(html.includes('value="'+kind+'"'),'missing editor '+kind);assert(edge.includes('q.kind==="'+kind+'"'),'missing vote validation '+kind);}
assert(edge.includes('Date.now()>=Date.parse(s.vote_deadline_at)'),'timer expiry must be server-authoritative');
assert(sql.includes('enable row level security'),'Q&A RLS missing');
assert(sql.includes('revoke all on public.live_audience_questions from anon, authenticated'),'Q&A direct access not revoked');
assert(!/https?:\/\/[^\s]+/.test(''),'offline only');
console.log('PASS: Tamayuz Live stage 1 source integrity and frontend syntax (offline; not E2E)');
