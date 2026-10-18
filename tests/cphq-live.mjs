// Requires a dedicated QA learner session (never an existing learner's credentials).
// Logs only assertions and metadata, never questions, answers, passwords or tokens.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {randomBytes,createHash} from 'node:crypto';
const url='https://dqrsjhcfmpjhcxvtxosy.supabase.co';
const key='sb_publishable_7nFtuefzXknxLJyonReR-A_7IsnbJDP';
const session=JSON.parse(readFileSync(process.env.CPHQ_QA_SESSION_FILE));
const guest=randomBytes(32).toString('hex');
writeFileSync(process.env.CPHQ_QA_GUEST_FILE,JSON.stringify({token:guest,digest:createHash('sha256').update(guest).digest('hex')}),{mode:0o600});
const checks=[];
function pass(s){checks.push(s);console.log('PASS',s)}
async function call(mode,body,extra={}){
 const response=await fetch(`${url}/functions/v1/cphq-${mode==='guest'?'guest':'practice'}`,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://tamayuz10x.com',...(mode==='registered'?{Authorization:'Bearer '+session.access_token}:{}),...extra},body:JSON.stringify({...body,...(mode==='guest'?{guest_token:guest}:{})}),signal:AbortSignal.timeout(25000)});
 return {code:response.status,headers:response.headers,value:await response.json()};
}
let r=await call('guest',{action:'submit',question_id:1,selected_index:0});assert.equal(r.code,409);assert.equal(r.value.error,'question_not_delivered');pass('Unissued guest submission rejected');
r=await call('guest',{action:'submit',question_id:1,selected_index:null});assert.equal(r.code,400);pass('Null choice rejected at HTTP boundary');
r=await call('registered',{action:'status'},{Authorization:'Bearer invalid'});assert.equal(r.code,401);pass('Invalid JWT rejected');
r=await call('registered',{action:'status'});assert.equal(r.code,200);assert.equal(r.value.limit,20);pass('Real signed-in learner accepted');
for(const origin of ['https://tamayuz10x.com','https://www.tamayuz10x.com']){
 const res=await fetch(url+'/functions/v1/cphq-practice',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'authorization,content-type,x-client-info'}});
 assert.equal(res.status,204);assert.equal(res.headers.get('access-control-allow-origin'),origin);
}pass('Production and www CORS preflights');
r=await call('guest',{action:'status'},{Origin:'https://untrusted.invalid'});assert.equal(r.code,403);pass('Unknown origin refused');
const qset=await Promise.all(Array.from({length:8},()=>call('guest',{action:'next',domain:1})));
assert(qset.every(x=>x.code===200));assert.equal(new Set(qset.map(x=>x.value.id)).size,1);pass('Eight concurrent next requests reserve one question');
const q=qset[0].value;
assert(!('correct_index'in q||'rationales'in q||'lesson'in q));
const answers=await Promise.all(Array.from({length:8},()=>call('guest',{action:'submit',question_id:q.id,selected_index:0})));
assert(answers.every(x=>x.code===200&&x.value.rationales.length===4&&x.value.lesson));
assert.equal(answers.filter(x=>x.value.replayed===false).length,1);pass('Eight concurrent submissions record one answer; explanations after submission');
for(let i=1;i<5;i++){
 const next=await call('guest',{action:'next',domain:1});assert.equal(next.code,200);assert.equal(next.value.remaining,4-i);
 const a=await call('guest',{action:'submit',question_id:next.value.id,selected_index:0});assert.equal(a.code,200);
}
r=await call('guest',{action:'next',domain:2});assert.equal(r.code,429);assert.equal(r.value.remaining,0);
r=await call('guest',{action:'status'});assert.equal(r.value.delivered,5);assert.equal(r.value.answered,5);pass('Live guest five/day cap and persisted counts');
// Test public data and RPC boundaries with both anonymous and learner credentials.
for(const auth of [null,session.access_token]){
 const headers={apikey:key,...(auth?{Authorization:'Bearer '+auth}:{})};
 const bank=await fetch(url+'/rest/v1/cphq_questions?select=id,correct_index',{headers});assert([401,403].includes(bank.status));
 const rpc=await fetch(url+'/rest/v1/rpc/cphq_guest_next',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({p_digest:'a'.repeat(64),p_domain:1})});assert([401,403,404].includes(rpc.status));
}pass('Anonymous and learner REST access to bank and guest RPC denied');
let delivered=0;
const initial=(await call('registered',{action:'status'})).value;
const domains=initial.domains.map(d=>({...d}));
const target=Math.min(20,domains.reduce((n,d)=>n+d.available,0));
while(delivered<target){
 for(const domain of domains){
  if(!domain.available||delivered>=target)continue;
  const next=await call('registered',{action:'next',domain:domain.domain});assert.equal(next.code,200);assert(next.value.id);
  assert(!('correct_index'in next.value||'rationales'in next.value||'lesson'in next.value));
  const a=await call('registered',{action:'submit',question_id:next.value.id,selected_index:0});assert.equal(a.code,200);assert.equal(a.value.rationales.length,4);assert(a.value.lesson);
  delivered++;domain.available--;
 }
}
r=await call('registered',{action:'status'});assert.equal(r.value.delivered,target);assert.equal(r.value.answered,target);assert.equal(r.value.remaining,20-target);
if(target===20){r=await call('registered',{action:'next',domain:1});assert.equal(r.code,429);assert.equal(r.value.error,'daily_limit');pass('Live registered 20-question limit and 21st request blocked');}
else for(const domain of domains){const empty=await call('registered',{action:'next',domain:domain.domain});assert.equal(empty.value.error,'domain_completed_today');}
pass('Published questions across seven domains: safe delivery, explanations and persisted allowance');
writeFileSync(process.env.CPHQ_QA_RESULT_FILE,JSON.stringify({checks,passed:checks.length,registeredDelivered:delivered},null,2));
