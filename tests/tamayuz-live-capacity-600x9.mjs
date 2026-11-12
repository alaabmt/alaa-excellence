// Tamayuz Live capacity diagnostic. Dedicated temporary session only.
import fs from 'node:fs';
import {performance} from 'node:perf_hooks';

const ENDPOINT='https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/tamayuz-live';
const CODE=process.env.TEST_JOIN_CODE||'';
const SID=process.env.TEST_SESSION_ID||'';
const MAX_CALLS=28500;
const started=Date.now();
let calls=0, stopped=false;
const metrics={};
const summary={name:'Tamayuz Live 600 by 9',status:'STARTED',questions:[],stages:[],errors:[],startedAt:new Date().toISOString()};
function persist(){
 summary.requests=calls;
 summary.elapsedSeconds=Math.round((Date.now()-started)/100)/10;
 summary.metrics={};
 for(const [k,v] of Object.entries(metrics)){
  const lat=[...v.latencies].sort((a,b)=>a-b);
  summary.metrics[k]={total:v.total,errors:v.errors,statuses:v.statuses,p95Ms:lat[Math.min(lat.length-1,Math.max(0,Math.ceil(lat.length*0.95)-1))]||0};
 }
 fs.writeFileSync('capacity-results.json',JSON.stringify(summary,null,2));
}
function stop(msg){stopped=true;summary.errors.push(String(msg).slice(0,250));throw Error(msg);}
if(process.env.EXPLICIT_PRODUCTION_LOAD_TEST!=='YES'||!/^[A-F0-9]{10}$/.test(CODE)||!/^[0-9a-f-]{36}$/.test(SID))stop('Safety stop: exact temporary session required.');
async function call(action,payload={}){
 if(stopped||calls>=MAX_CALLS||Date.now()-started>900000)stop('Safety stop: budget or duration exceeded.');
 calls++;
 const m=metrics[action]||=( {total:0,errors:0,statuses:{},latencies:[]} );
 const begin=performance.now();let status=0,data={};
 try{
  const r=await fetch(ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},
   body:JSON.stringify({action,...payload}),signal:AbortSignal.timeout(15000)});
  status=r.status;data=await r.json();
 }catch(e){data={error:'timeout_or_network_failure'};}
 const ms=Math.round(performance.now()-begin);
 m.total++;m.latencies.push(ms);m.statuses[status]=(m.statuses[status]||0)+1;
 const ok=status===200&&!data.error;
 if(!ok){
  m.errors++;
  if(summary.errors.length<20)summary.errors.push(action+' HTTP '+status+' '+String(data.error||'unknown').slice(0,90));
  if([0,429,500,502,503,504].includes(status)&&m.errors>=3)stopped=true;
 }
 return {ok,status,data,ms};
}
async function batch(items,limit,fn){
 let next=0;const issues=[];
 await Promise.all(Array.from({length:Math.min(items.length,limit)},async()=>{
  while(next<items.length&&!stopped){
   const i=next++;
   try{await fn(items[i],i);}catch(e){if(issues.length<5)issues.push(String(e));stopped=true;}
  }
 }));
 if(issues.length||stopped)stop('Batch stopped: '+issues.slice(0,2).join(' | '));
}
function selectAnswer(q,i,k){
 if(q.kind==='choice'&&Array.isArray(q.options)&&q.options.length)return q.options[(i+k)%q.options.length];
 if(q.kind==='rating')return String((i%5)+1);
 return 'TEST RESPONSE '+i+' question '+k;
}
async function run(){
 const presenter=await call('present',{session_id:SID});
 if(!presenter.ok||presenter.data.session?.id!==SID||presenter.data.questions?.length!==9)stop('Session or nine questions mismatch.');
 const questions=[...presenter.data.questions].sort((a,b)=>a.position-b.position);
 const people=[];
 for(const n of [5,45,50,150,250,100]){
  const chunk=[];
  await batch(Array.from({length:n},(_,i)=>i),35,async()=>{
   const r=await call('join',{code:CODE});
   if(!r.ok||r.data.session_id!==SID||!/^[0-9a-f]{48}$/.test(r.data.participant_token||''))throw Error('Join unsuccessful');
   chunk.push(r.data.participant_token);
  });
  people.push(...chunk);
  summary.stages.push({registered:people.length,requests:calls});
  persist();await new Promise(resolve=>setTimeout(resolve,1200));
 }
 if(people.length!==600)stop('600 joins not achieved.');
 for(let qi=0;qi<questions.length;qi++){
  const q=questions[qi];
  const activated=await call('control',{session_id:SID,state:'open',question_id:q.id,results_action:'hide',answer_action:'hide'});
  if(!activated.ok||activated.data.session?.active_question_id!==q.id)stop('Question activation unsuccessful.');
  let votes=0;
  await batch(people,45,async(token,index)=>{
   const pre=await call('view',{code:CODE,participant_token:token});
   if(!pre.ok||pre.data.questions?.[0]?.id!==q.id)throw Error('Question view mismatch');
   const seen=await call('track_interaction',{code:CODE,participant_token:token,question_id:q.id,event_type:'question_view'});
   if(!seen.ok||seen.data.accepted!==true)throw Error('Question tracking unsuccessful');
   const click=await call('track_interaction',{code:CODE,participant_token:token,question_id:q.id,event_type:'answer_click'});
   if(!click.ok||click.data.accepted!==true)throw Error('Click tracking unsuccessful');
   const voted=await call('vote',{code:CODE,participant_token:token,answer:selectAnswer(q,index,qi)});
   if(!voted.ok||voted.data.accepted!==true||voted.data.duplicate)throw Error('Vote rejected/duplicate');
   const after=await call('view',{code:CODE,participant_token:token});
   if(!after.ok||after.data.voted!==true)throw Error('Vote not confirmed');
   votes++;
  });
  const timings=[];let snapshot=null;
  for(let j=0;j<3;j++){
   const r=await call('present',{session_id:SID});
   if(!r.ok)stop('Presenter failed');
   snapshot=r.data;timings.push(r.ms);await new Promise(resolve=>setTimeout(resolve,250));
  }
  const aggregate=(snapshot.aggregate||[]).reduce((a,v)=>a+Number(v.votes||0),0);
  const rec={number:qi+1,accepted:votes,presenterCount:snapshot.count,aggregate,
   resultsP95Ms:timings.sort((a,b)=>a-b)[Math.ceil(timings.length*0.95)-1],requests:calls};
  rec.passed=votes===600&&snapshot.count===600&&aggregate===600;
  summary.questions.push(rec);persist();
  console.log('COMPLETED_QUESTION',qi+1,'votes',votes,'presenterCount',snapshot.count);
  if(!rec.passed)stop('Presenter result mismatch on question '+(qi+1));
 }
 summary.status='PASS';
}
try{await run();}catch(e){summary.status='FAIL';if(!summary.errors.length)summary.errors.push(String(e));}
finally{
 try{if(!stopped)await call('control',{session_id:SID,state:'ended'});}catch(e){}
 persist();
 console.log('SUMMARY',JSON.stringify({status:summary.status,requests:calls,questions:summary.questions,errors:summary.errors.slice(0,4)}));
 if(summary.status!=='PASS')process.exitCode=1;
}