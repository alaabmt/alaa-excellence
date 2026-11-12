// Tamayuz Live: bounded low-impact production capacity smoke, NOT 600 certification.
// Requires one pre-created disposable waiting session specific to PR head SHA.
// Hard cap 10 logical HTTP clients / 60 sec / <= 5 polling req/s (2-sec interval).
// Fails closed on unexpected session or 5xx. No real attendee data accessed.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {writeFileSync} from "node:fs";
import {setTimeout as sleep} from "node:timers/promises";
const sha=process.env.CAPACITY_TEST_SHA||"";
assert.match(sha,/^[0-9a-f]{40}$/,"Test must be bound to exact PR SHA");
assert.equal(process.env.GITHUB_REPOSITORY,"alaabmt/alaa-excellence","Repository scope violation");
const ENDPOINT="https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/tamayuz-live";
const CODE="C"+sha.slice(0,9).toUpperCase();
const TITLE="TAMAYUZ-LIVE-CAPACITY-SMOKE-"+sha.slice(0,12);
const PRESENTER=createHash("sha256").update("tamayuz-live-capacity-presenter:"+sha).digest("hex").slice(0,48);
const CLIENTS=10,TEST_MS=60000,POLL_MS=2000;
const metrics=[],phaseCounts={};
let startedAt=new Date().toISOString(),maxInflight=0,inflight=0,sessionId=null;
let unexpectedErrors=0,totalPolls=0,acceptedVotes=0,finished=false;
function percentile(items,p){const a=items.slice().sort((x,y)=>x-y);return a.length?a[Math.ceil(a.length*p)-1]:null}
async function api(action,body={},expected=200){
 const t=performance.now();inflight++;maxInflight=Math.max(maxInflight,inflight);
 try{
  const response=await fetch(ENDPOINT,{method:"POST",cache:"no-store",redirect:"error",
   signal:AbortSignal.timeout(10000),headers:{"content-type":"application/json"},
   body:JSON.stringify({action,...body})});
  const elapsed=Math.round(performance.now()-t),txt=await response.text();
  let data;try{data=JSON.parse(txt)}catch{throw Error("API response was not JSON")}
  const entry={action,http_status:response.status,ms:elapsed};
  metrics.push(entry);phaseCounts[action]=(phaseCounts[action]||0)+1;
  if(response.status>=500)throw Error("Server returned "+response.status+" during "+action);
  if(response.status!==expected)throw Error(action+" unexpected HTTP "+response.status+" (expected "+expected+")");
  return data;
 }finally{inflight--}
}
async function batch(items,maximum,callback){
 const results=[];
 for(let start=0;start<items.length;start+=maximum){
  const slice=await Promise.all(items.slice(start,start+maximum).map(callback));
  results.push(...slice);
 }
 return results;
}
try{
 const initial=await api("present",{session_id:"00000000-0000-4000-8000-000000000001",presenter_token:PRESENTER},403);
 assert.equal(initial.error,"Presenter authorization required");
 // Join once per unique user, with controlled ramp. This never joins real sessions.
 const tokens=await batch(Array.from({length:CLIENTS},(_,i)=>i),2,async()=>{
  const r=await api("join",{code:CODE});
  sessionId??=r.session_id;
  assert.equal(r.session_id,sessionId);
  assert.match(r.participant_token,/^[a-f0-9]{48}$/);
  return r.participant_token;
 });
 assert.equal(new Set(tokens).size,CLIENTS);
 const state=await api("present",{session_id:sessionId,presenter_token:PRESENTER});
 assert.equal(state.session.state,"waiting");
 assert.equal(state.questions.length,1,"Fixture must have exactly one question");
 const qid=state.questions[0].id;
 await api("control",{session_id:sessionId,presenter_token:PRESENTER,state:"open",question_id:qid});
 const started=performance.now();let completedRounds=0,peakSlow=0;
 while(performance.now()-started<TEST_MS){
  const roundStart=performance.now();
  const views=await Promise.allSettled(tokens.map(tok=>api("view",{code:CODE,participant_token:tok})));
  totalPolls+=CLIENTS;completedRounds++;
  const errors=views.filter(x=>x.status==="rejected");
  if(errors.length){
   unexpectedErrors+=errors.length;
   throw Error("Aborting polling after "+errors.length+" request failures");
  }
  for(const v of views){
   assert.equal(v.value.session.state,"open");
   assert.equal(v.value.questions.length,1);
  }
  const recent=metrics.slice(-CLIENTS).map(x=>x.ms);
  if(percentile(recent,.95)>4500)peakSlow++;else peakSlow=0;
  if(peakSlow>=2)throw Error("Aborting: repeated >4.5s p95 poll rounds");
  const remaining=POLL_MS-(performance.now()-roundStart);
  if(remaining>0)await sleep(remaining);
 }
 const answers=tokens.map((_,i)=>i%2?"B":"A");
 await batch(tokens.map((token,i)=>({token,i})),2,async({token,i})=>{
  const result=await api("vote",{code:CODE,participant_token:token,answer:answers[i]});
  assert.equal(result.accepted,true,"Vote must be acknowledged");
  assert.equal(result.duplicate,undefined,"First vote must not be duplicate");
  acceptedVotes++;
 });
 const presenter=await api("present",{session_id:sessionId,presenter_token:PRESENTER});
 assert.equal(presenter.count,CLIENTS);
 const tally=Object.fromEntries(presenter.aggregate.map(x=>[x.answer,x.votes]));
 assert.equal(tally.A,CLIENTS/2);assert.equal(tally.B,CLIENTS/2);
 const reconnected=await api("view",{code:CODE,participant_token:tokens[0]});
 assert.equal(reconnected.voted,true,"Reconnect must preserve voter status");
 await api("control",{session_id:sessionId,presenter_token:PRESENTER,state:"ended"});
 const pollTimes=metrics.filter(x=>x.action==="view").map(x=>x.ms);
 const voteTimes=metrics.filter(x=>x.action==="vote").map(x=>x.ms);
 const statuses=Object.fromEntries([...new Set(metrics.map(x=>x.http_status))].map(s=>[s,metrics.filter(x=>x.http_status===s).length]));
 const report={
  assessment:"TEN_LOGICAL_CLIENT_LIVE_BACKEND_SMOKE_COMPLETED",
  site:"https://tamayuz10x.com/live/",api_version:"deployed production Edge (verify externally)",
  started_at_utc:startedAt,completed_at_utc:new Date().toISOString(),source_sha:sha,
  workload:"10 independent logical HTTP clients; 2-second poll intent; 60-second minimum",
  requested_conference_capacity:600,certifies_600_simultaneous_browsers:false,
  independent_clients:CLIENTS,measured_max_inflight_requests:maxInflight,
  poll_rounds:completedRounds,poll_requests:totalPolls,accepted_unique_votes:acceptedVotes,
  total_api_requests:metrics.length,status_counts:statuses,
  poll_latency_ms:{p50:percentile(pollTimes,.5),p95:percentile(pollTimes,.95),p99:percentile(pollTimes,.99)},
  vote_latency_ms:{p50:percentile(voteTimes,.5),p95:percentile(voteTimes,.95),p99:percentile(voteTimes,.99)},
  vote_success_rate:acceptedVotes/CLIENTS,
  vote_count_reconciled:true,all_poll_rounds_valid:true,
  passed_functional_smoke:unexpectedErrors===0,
  candidate_1sec_poll_p95_met:percentile(pollTimes,.95)<=1000,
  recovery_or_large_load_inferred:false,
  original_data_modified:false,
  cleanup_requirement:"DELETE ONLY the exact disposable presentation via approved Live-only SQL",
  declared_confidence:"Measured small synthetic test only; NO-GO for 600 concurrent browser certification"
 };
 finished=true;
 console.log(JSON.stringify(report,null,2));
 if(process.env.TEST_REPORT_PATH)writeFileSync(process.env.TEST_REPORT_PATH,JSON.stringify(report,null,2)+"\n");
}catch(e){
 const msg=String(e.message||e).slice(0,220);
 console.error("BOUNDARY STOP (no real attendee data affected): "+msg);
 console.error("If a disposable fixture was seeded, delete only the exact test presentation title after verifying the session is not real");
 process.exitCode=1;
}finally{
 if(!finished)console.log(JSON.stringify({assessment:"SMOKE_INCOMPLETE",source_sha:sha,production_600_certified:false,api_requests:metrics.length,participants_joined:phaseCounts.join||0},null,2));
}
