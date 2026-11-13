// Tamayuz Live capacity harness for an ISOLATED stack only. It refuses any endpoint that is
// not loopback, so it cannot be pointed at production by mistake.
// Each virtual attendee behaves like live/index.html: one join, jittered polling at the
// page's own cadence with lightweight revision polls, one vote per opened question after a
// human-like think time, occasional refresh/disconnect, and the same error backoff.
// One presenter client opens, closes and reveals questions and reads the tally.
// Honest scope: these are logical HTTP clients, not browser windows; real browsers are
// exercised separately by tests/tamayuz-live-isolated-browser-rehearsal.mjs.
import assert from "node:assert/strict";
import {execFile} from "node:child_process";
import {readFileSync,writeFileSync} from "node:fs";
import {setTimeout as sleep} from "node:timers/promises";

const ENDPOINT=process.env.LIVE_LOAD_ENDPOINT||"";
const target=new URL(ENDPOINT);
assert(target.protocol==="http:"&&["127.0.0.1","localhost"].includes(target.hostname),
 "REFUSING: the load harness only targets a loopback isolated stack");
const CODE=process.env.LIVE_LOAD_CODE||"LOADTEST01";
const SESSION_ID=process.env.LIVE_LOAD_SESSION||"c3000000-0000-4000-8000-000000000001";
const PRESENTER=process.env.LIVE_LOAD_PRESENTER||"1a".repeat(24);
const STAGES=(process.env.LIVE_LOAD_STAGES||"10,50,150,300,600").split(",").map(Number);
const STAGE_S=Number(process.env.LIVE_LOAD_STAGE_SECONDS||60);
const HOLD_S=Number(process.env.LIVE_LOAD_HOLD_SECONDS||900);
const VOTE_WINDOW_S=Number(process.env.LIVE_LOAD_VOTE_WINDOW_SECONDS||40);
const REVEAL_S=Number(process.env.LIVE_LOAD_REVEAL_SECONDS||8);
const FAULT_AT_S=Number(process.env.LIVE_LOAD_FAULT_AT_SECONDS||0);   // seconds into the hold; 0 = none
const FAULT_CMD=process.env.LIVE_LOAD_FAULT_CMD||"";
const LEGACY_CLIENT=process.env.LIVE_LOAD_LEGACY_CLIENT==="1";        // 2s fixed polls, no revision
const P95_LIMIT_MS=Number(process.env.LIVE_LOAD_P95_LIMIT_MS||1000);
const REPORT=process.env.LIVE_LOAD_REPORT||"";
const LABEL=process.env.LIVE_LOAD_LABEL||"isolated";
// Follow the real page's cadence so the test cannot drift from what attendees run.
const page=readFileSync(new URL("../live/index.html",import.meta.url),"utf8");
const constant=(name,fallback)=>{const m=new RegExp(name+"=(\\d+)").exec(page);return m?Number(m[1]):fallback};
const POLL_MS=LEGACY_CLIENT?2000:constant("AUDIENCE_POLL_MS",3000);
const FULL_EVERY=constant("FULL_VIEW_EVERY",5),BACKOFF_MAX=constant("POLL_BACKOFF_MAX_MS",15000);
const TARGET=STAGES.at(-1);

const metrics=[];            // {a:action,s:status,ms,t}
let inflight=0,maxInflight=0;
const t0=performance.now(),now=()=>performance.now()-t0;
async function api(action,body){
 const started=performance.now();inflight++;maxInflight=Math.max(maxInflight,inflight);
 let status=0;
 try{
  const r=await fetch(ENDPOINT,{method:"POST",headers:{"content-type":"application/json"},
   body:JSON.stringify({action,...body}),signal:AbortSignal.timeout(12000)});
  status=r.status;const text=await r.text();let v;
  try{v=JSON.parse(text)}catch{status=status||599;throw Object.assign(Error("non-JSON response"),{status})}
  if(!r.ok)throw Object.assign(Error(v.error||"Request failed"),{status});
  return v;
 }catch(e){if(e.status===undefined)e.status=0;throw e}
 finally{inflight--;metrics.push({a:action,s:status,ms:performance.now()-started,t:now()})}
}
const pct=(values,p)=>{if(!values.length)return null;const a=Float64Array.from(values).sort();return Math.round(a[Math.min(a.length-1,Math.ceil(a.length*p)-1)])};
const summary=values=>({n:values.length,p50:pct(values,.5),p95:pct(values,.95),p99:pct(values,.99),max:values.length?Math.round(Math.max(...values)):null});

// question id -> bookkeeping for tally reconciliation
const book=new Map();
const entry=q=>{if(!book.has(q))book.set(q,{eligible:new Set(),accepted:new Map(),confirmed:0,unknown:0,late:0,refused:{}});return book.get(q)};
const counters={joins:0,rejoins:0,refreshes:0,disconnects:0,duplicates:0,vote_retries:0,unchanged_views:0};
let clientsStopped=false;

class Attendee{
 constructor(i){this.i=i;this.token="";this.rev=null;this.polls=0;this.failures=0;this.lastOk=-1;this.voted=new Set();this.pending=false;this.full=true;this.started=false}
 delay(){
  if(LEGACY_CLIENT)return POLL_MS;
  return Math.round(Math.min(POLL_MS*2**Math.min(this.failures,4),BACKOFF_MAX)*(0.75+Math.random()*0.5));
 }
 async run(){
  this.started=true;
  while(!clientsStopped){
   try{
    if(!this.token){const j=await api("join",{code:CODE});this.token=j.participant_token;counters.joins++;this.full=true}
    // Rare human behaviour: page refresh (same stored identity) or a short loss of signal.
    const roll=Math.random();
    if(roll<0.004){this.rev=null;this.full=true;counters.refreshes++}
    else if(roll<0.006){counters.disconnects++;await sleep(4000+Math.random()*8000);this.full=true}
    await this.poll();this.failures=0;
   }catch(e){this.failures++;this.full=true}
   await sleep(this.delay());
  }
 }
 async poll(){
  const light=!LEGACY_CLIENT&&!this.full&&this.rev!==null&&(++this.polls%FULL_EVERY!==0);
  const v=await api("view",light?{code:CODE,participant_token:this.token,rev:this.rev}:{code:CODE,participant_token:this.token});
  this.lastOk=now();
  if(v.unchanged){counters.unchanged_views++;return}
  this.full=false;
  if(v.participant_valid===false){this.token="";this.rev=null;counters.rejoins++;return}
  this.rev=v.session.revision;
  const q=v.questions[0];
  if(!q||v.session.state!=="open")return;
  const e=entry(q.id);e.eligible.add(this.i);
  if(v.voted&&!this.voted.has(q.id)){
   // The server holds our vote although the response never arrived (transient failure).
   this.voted.add(q.id);
   if(!e.accepted.has(this.i)){e.accepted.set(this.i,q.options[this.i%q.options.length]);e.confirmed++}
   return;
  }
  if(!this.voted.has(q.id)&&!this.pending){
   this.pending=true;
   setTimeout(()=>this.vote(q),1000+Math.random()*9000);   // reading and deciding
  }
 }
 async vote(q){
  const e=entry(q.id),answer=q.options[this.i%q.options.length];
  try{
   const r=await api("vote",{code:CODE,participant_token:this.token,answer});
   if(r.accepted){this.voted.add(q.id);if(r.duplicate)counters.duplicates++;if(!e.accepted.has(this.i))e.accepted.set(this.i,answer)}
  }catch(err){
   if(err.status===409)e.late++;                       // voting closed while deciding
   else if(err.status===0||err.status>=500){e.unknown++;counters.vote_retries++}   // outcome unknown; next poll decides
   else e.refused[err.message]=(e.refused[err.message]||0)+1;
   this.full=true;
  }finally{this.pending=false}
 }
}

const attendees=Array.from({length:TARGET},(_,i)=>new Attendee(i));
const timeline=[],dbSamples=[],cycles=[],events=[];
let stageTarget=0,holdStart=null,holdEnd=null,faultAt=null,presenterStop=false;
// "Connected" = polled successfully within the last 20 s (covers the simulated signal losses).
const connected=()=>{const t=now();return attendees.filter(a=>a.lastOk>=0&&t-a.lastOk<=20000).length};

async function control(body){
 for(let attempt=0;;attempt++){
  try{return await api("control",{session_id:SESSION_ID,presenter_token:PRESENTER,...body})}
  catch(e){if(attempt>=5)throw e;await sleep(700)}
 }
}
async function presenterPolling(){
 while(!presenterStop){try{await api("present",{session_id:SESSION_ID,presenter_token:PRESENTER})}catch{}await sleep(1500)}
}
async function presenterCycles(questions,until){
 let index=0;
 while(now()<until()&&index<questions.length){
  const q=questions[index++],opened=now(),target=stageTarget,connectedAtOpen=connected();
  await control({state:"open",question_id:q.id});
  await sleep(VOTE_WINDOW_S*1000);
  await control({state:"closed",question_id:q.id});
  await sleep(1500);                                   // let responses already in flight arrive
  let shown=null;
  for(let i=0;i<5&&!shown;i++){try{shown=await api("present",{session_id:SESSION_ID,presenter_token:PRESENTER})}catch{await sleep(700)}}
  const e=entry(q.id),expected={};
  for(const a of e.accepted.values())expected[a]=(expected[a]||0)+1;
  const server=Object.fromEntries((shown?.aggregate||[]).map(x=>[x.answer,x.votes]));
  const serverCount=shown?.count??null,known=e.accepted.size;
  // Exact match unless some vote outcomes are unknown to the client (lost responses).
  const reconciled=serverCount!==null&&serverCount>=known&&serverCount<=known+e.unknown&&
   Object.keys({...expected,...server}).every(k=>(server[k]||0)>=(expected[k]||0))&&
   (e.unknown>0||JSON.stringify(Object.entries(server).sort())===JSON.stringify(Object.entries(expected).sort()));
  await control({state:"closed",question_id:q.id,results_action:"show",answer_action:"show"});
  await sleep(REVEAL_S*1000);
  cycles.push({question:index,opened_s:Math.round(opened/1000),stage_target:target,connected_at_open:connectedAtOpen,
   eligible:e.eligible.size,accepted_by_clients:known,confirmed_after_lost_response:e.confirmed,
   unknown_outcomes:e.unknown,late_after_close:e.late,refused:e.refused,server_count:serverCount,reconciled,
   in_hold:holdStart!==null&&opened>=holdStart&&opened+VOTE_WINDOW_S*1000<=(holdEnd??Infinity)});
 }
}
function sampleDb(){
 if(!process.env.PGHOST)return;
 execFile("psql",["-X","-qAt","-c",
  "SELECT count(*) FILTER (WHERE state='active'),count(*),(SELECT setting FROM pg_settings WHERE name='max_connections'),(SELECT count(*) FROM pg_locks WHERE NOT granted) FROM pg_stat_activity WHERE datname=current_database()"],
  {timeout:4000},(err,out)=>{if(err)return;const [active,total,max,waiting]=out.trim().split("|").map(Number);dbSamples.push({t:Math.round(now()/1000),active,total,max,waiting})});
}

const state=await api("present",{session_id:SESSION_ID,presenter_token:PRESENTER});
assert.equal(state.session.state,"waiting","fixture session must start in waiting state");
const questions=state.questions;
assert(questions.length>=3,"fixture needs questions");
const startedAt=new Date().toISOString();
const totalMs=((STAGES.length-1)*STAGE_S+HOLD_S)*1000;
presenterPolling();
const cyclePromise=presenterCycles(questions,()=>totalMs-(VOTE_WINDOW_S+REVEAL_S+3)*1000);
let windowStart=0;
const ticker=setInterval(()=>{
 const t=now(),recent=metrics.filter(m=>m.t>=windowStart),views=recent.filter(m=>m.a==="view");
 timeline.push({t:Math.round(t/1000),target:stageTarget,connected:connected(),
  rps:Math.round(recent.length/((t-windowStart)/1000)),view_p95:pct(views.map(m=>m.ms),.95),
  errors:recent.filter(m=>m.s===0||m.s>=500).length,inflight});
 windowStart=t;sampleDb();
},10000);

for(let s=0;s<STAGES.length;s++){
 const last=s===STAGES.length-1,from=stageTarget;stageTarget=STAGES[s];
 const stageMs=(last?HOLD_S:STAGE_S)*1000,rampMs=Math.min(20000,stageMs/3),stageStart=now();
 events.push({t:Math.round(stageStart/1000),event:"stage",target:stageTarget});
 const fresh=attendees.slice(from,stageTarget);
 fresh.forEach((a,k)=>setTimeout(()=>a.run(),Math.round(rampMs*k/Math.max(1,fresh.length))));
 if(last){
  await sleep(rampMs+12000);                           // everyone joined and polled at least once
  holdStart=now();holdEnd=holdStart+HOLD_S*1000;
  events.push({t:Math.round(holdStart/1000),event:"hold_start",connected:connected()});
  if(FAULT_AT_S>0&&FAULT_CMD){
   setTimeout(()=>{faultAt=now();events.push({t:Math.round(faultAt/1000),event:"fault_injected"});
    execFile("bash",["-c",FAULT_CMD],()=>{})},FAULT_AT_S*1000);
  }
  await sleep(HOLD_S*1000);
  events.push({t:Math.round(now()/1000),event:"hold_end",connected:connected()});
 }else await sleep(stageMs);
}
await cyclePromise;
clientsStopped=true;presenterStop=true;clearInterval(ticker);
await sleep(1500);
try{await control({state:"ended"})}catch{}

// ---------- evaluation ----------
const inFault=t=>faultAt!==null&&t>=faultAt-1000&&t<=faultAt+45000;
const hold=metrics.filter(m=>m.t>=holdStart&&m.t<=holdEnd);
const steady=hold.filter(m=>!inFault(m.t));
const failed=m=>m.s===0||m.s>=500;
const by=(list,action)=>list.filter(m=>m.a===action&&!failed(m)).map(m=>m.ms);
const statusCounts={};for(const m of metrics){const k=m.a+":"+m.s;statusCounts[k]=(statusCounts[k]||0)+1}
const holdLine=timeline.filter(x=>x.t*1000>=holdStart+10000&&x.t*1000<=holdEnd);
const steadyLine=holdLine.filter(x=>!inFault(x.t*1000-5000)&&!inFault(x.t*1000));
const minConnected=steadyLine.length?Math.min(...steadyLine.map(x=>x.connected)):null;
let recovery=null;
if(faultAt!==null){
 const errorsAfter=metrics.filter(m=>m.t>=faultAt&&failed(m));
 const lastError=errorsAfter.length?Math.max(...errorsAfter.filter(m=>m.t<=faultAt+120000).map(m=>m.t)):faultAt;
 const back=timeline.find(x=>x.t*1000>lastError&&x.connected>=TARGET);
 recovery={fault_at_s:Math.round(faultAt/1000),failed_requests:errorsAfter.filter(m=>m.t<=faultAt+120000).length,
  last_error_after_fault_ms:Math.round(lastError-faultAt),
  all_clients_polling_again_after_ms:back?Math.round(back.t*1000-faultAt):null};
}
const holdCycles=cycles.filter(c=>c.in_hold&&!(faultAt!==null&&c.opened_s*1000<=faultAt+45000&&(c.opened_s+VOTE_WINDOW_S)*1000>=faultAt-1000));
const coverage=holdCycles.length?Math.min(...holdCycles.map(c=>c.accepted_by_clients/Math.max(1,c.connected_at_open))):null;
const uniqueTokens=new Set(attendees.map(a=>a.token).filter(Boolean)).size;
const steadyErrorRate=steady.length?steady.filter(failed).length/steady.length:null;
const viewHold=summary(by(steady,"view")),voteHold=summary(by(steady,"vote"));
const checks={
 reached_target_clients:attendees.every(a=>a.started&&a.token)&&uniqueTokens===TARGET,
 held_target_for_full_duration:minConnected!==null&&minConnected>=Math.floor(TARGET*0.99),
 every_question_tally_reconciled:cycles.length>0&&cycles.every(c=>c.reconciled),
 legitimate_participants_could_vote:coverage!==null&&coverage>=0.99,
 steady_state_error_rate_below_0_1_percent:steadyErrorRate!==null&&steadyErrorRate<0.001,
 view_p95_within_limit:viewHold.p95!==null&&viewHold.p95<=P95_LIMIT_MS,
 vote_p95_within_limit:voteHold.p95!==null&&voteHold.p95<=P95_LIMIT_MS,
 recovered_after_fault:faultAt===null?null:(recovery.all_clients_polling_again_after_ms!==null&&recovery.all_clients_polling_again_after_ms<=90000)
};
const report={
 assessment:"TAMAYUZ_LIVE_ISOLATED_CAPACITY_TEST",label:LABEL,
 environment:"Isolated disposable stack on one CI runner: PostgreSQL + PostgREST + Edge Function source on Deno. NOT the production Supabase project; provider quotas, network distance and shared-tenant limits are NOT exercised.",
 client_type:"logical HTTP clients mirroring live/index.html polling; not browser windows",
 certifies_production_600:false,git_sha:process.env.GITHUB_SHA||null,started_at_utc:startedAt,completed_at_utc:new Date().toISOString(),
 profile:{stages:STAGES,stage_seconds:STAGE_S,hold_seconds:HOLD_S,poll_ms:POLL_MS,full_view_every:LEGACY_CLIENT?1:FULL_EVERY,vote_window_s:VOTE_WINDOW_S,legacy_client:LEGACY_CLIENT},
 target_clients:TARGET,unique_participants_registered:uniqueTokens,min_connected_clients_during_hold:minConnected,
 measured_max_inflight_requests:maxInflight,total_requests:metrics.length,
 hold:{requests:hold.length,throughput_rps:Math.round(hold.length/HOLD_S),steady_state_error_rate:steadyErrorRate,
  view_ms:viewHold,vote_ms:voteHold,join_ms:summary(by(metrics,"join")),present_ms:summary(by(steady,"present")),control_ms:summary(by(metrics,"control")),
  unchanged_share_of_all_views:metrics.filter(m=>m.a==="view").length?Math.round(1000*counters.unchanged_views/metrics.filter(m=>m.a==="view").length)/1000:null},
 overall:{view_ms:summary(by(metrics,"view")),vote_ms:summary(by(metrics,"vote"))},
 status_counts:statusCounts,behaviour:counters,vote_coverage_min_in_hold:coverage,
 question_cycles:cycles,fault_recovery:recovery,events,timeline,
 database:{samples:dbSamples.length,max_active:dbSamples.length?Math.max(...dbSamples.map(x=>x.active)):null,
  max_connections_used:dbSamples.length?Math.max(...dbSamples.map(x=>x.total)):null,
  max_connections_setting:dbSamples[0]?.max??null,max_lock_waiters:dbSamples.length?Math.max(...dbSamples.map(x=>x.waiting)):null},
 checks,passed:Object.values(checks).every(v=>v===true||v===null)
};
if(REPORT)writeFileSync(REPORT,JSON.stringify(report,null,2)+"\n");
const {timeline:_t,question_cycles:_q,...brief}=report;
console.log(JSON.stringify({...brief,question_cycles:cycles.length,cycles_in_hold:holdCycles.length},null,2));
if(!report.passed){console.error("ISOLATED CAPACITY TEST FAILED: "+Object.entries(checks).filter(([,v])=>v===false).map(([k])=>k).join(", "));process.exitCode=1}
