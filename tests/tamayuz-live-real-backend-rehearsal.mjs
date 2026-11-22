// Live-only REAL deployed Edge API rehearsal against a pre-created, disposable
// "TAMAYUZ-LIVE-REHEARSAL" fixture, never against real sessions.
// This script does not create a presentation, reset production, or know owner credentials.
// The fixture is seeded and cleaned up separately via approved Live-only SQL.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {writeFileSync} from "node:fs";

const ENDPOINT="https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/tamayuz-live";
const sha=process.env.REHEARSAL_HEAD_SHA||"";
assert.match(sha,/^[0-9a-f]{40}$/,"Expected authorized test commit SHA");
const code="T"+sha.slice(0,9).toUpperCase();
const presenter=createHash("sha256").update("tamayuz-live-disposable-presenter:"+sha).digest("hex").slice(0,48);
const title="TAMAYUZ-LIVE-REHEARSAL-"+sha.slice(0,12);
const samples=[];
const start=new Date().toISOString();
let sessionId=null,questionId=null;
function fail(message){throw Error("Real backend rehearsal: "+message)}
async function request(action,args={},expected=200){
  const t=performance.now();
  const r=await fetch(ENDPOINT,{method:"POST",redirect:"error",signal:AbortSignal.timeout(13000),
    headers:{"content-type":"application/json"},
    body:JSON.stringify({action,...args})});
  const text=await r.text();
  const duration_ms=Math.round(performance.now()-t);
  let data;try{data=JSON.parse(text)}catch{fail(action+" returned non-JSON "+r.status)}
  samples.push({action,status:r.status,duration_ms});
  if(r.status!==expected)fail(action+" expected HTTP "+expected+" but got "+r.status+"; "+String(data.error||"unknown"));
  return data;
}
try{
  const missing=await request("owner_status",{},200);
  assert.equal(missing.owner,false);
  await request("list",{},403);
  await request("control",{session_id:"00000000-0000-4000-8000-000000000001",state:"open"},403);
  await request("vote",{code,participant_token:"bad-token",answer:"A"},403);
  const noToken=await request("present",{session_id:"00000000-0000-4000-8000-000000000001"},403);
  assert.equal(noToken.error,"Presenter authorization required");

  const join=await request("join",{code});
  sessionId=join.session_id;
  assert.match(sessionId,/^[a-f0-9-]{36}$/i);
  const tokens=[join.participant_token];
  assert.match(tokens[0],/^[a-f0-9]{48}$/);
  for(let i=0;i<2;i++){
    const another=await request("join",{code});
    assert.equal(another.session_id,sessionId);
    tokens.push(another.participant_token);
  }
  assert.equal(new Set(tokens).size,3,"Unique participants");
  const waiting=await request("view",{code,participant_token:tokens[0]});
  assert.equal(waiting.session.state,"waiting");
  const presenterState=await request("present",{session_id:sessionId,presenter_token:presenter});
  questionId=presenterState.questions[0]?.id;
  assert.match(questionId,/^[a-f0-9-]{36}$/i);
  await request("control",{session_id:sessionId,presenter_token:presenter,state:"open",question_id:questionId});
  const before=await request("view",{code,participant_token:tokens[0]});
  assert.equal(before.session.state,"open");
  assert.equal(before.questions[0].id,questionId);
  assert.equal(Object.hasOwn(before.questions[0],"correct_answer"),false,"Answer key hidden");
  const event=await request("track_interaction",{code,participant_token:tokens[0],event_type:"question_view",question_id:questionId});
  assert.equal(event.accepted,true);
  const answers=["A","B","A"];
  for(let i=0;i<3;i++){
    const result=await request("vote",{code,participant_token:tokens[i],answer:answers[i]});
    assert.equal(result.accepted,true);
    assert.equal(result.duplicate,undefined);
  }
  const dup=await request("vote",{code,participant_token:tokens[0],answer:"A"});
  assert.equal(dup.accepted,true);
  assert.equal(dup.duplicate,true);
  const after=await request("view",{code,participant_token:tokens[0]});
  assert.equal(after.voted,true);
  assert.equal(after.count,null,"No audience aggregate disclosure");
  assert.deepEqual(after.aggregate,[]);
  const tally=await request("present",{session_id:sessionId,presenter_token:presenter});
  assert.equal(tally.count,3);
  const totals=Object.fromEntries(tally.aggregate.map(x=>[x.answer,x.votes]));
  assert.equal(totals.A,2);
  assert.equal(totals.B,1);
  await request("control",{session_id:sessionId,presenter_token:presenter,state:"open",results_action:"show"});
  const hidden=await request("view",{code,participant_token:tokens[1]});
  assert.equal(Object.hasOwn(hidden.questions[0],"correct_answer"),false);
  await request("control",{session_id:sessionId,presenter_token:presenter,state:"open",answer_action:"show"});
  const revealed=await request("view",{code,participant_token:tokens[1]});
  assert.equal(revealed.questions[0].correct_answer,"A");
  await request("control",{session_id:sessionId,presenter_token:presenter,state:"closed"});
  await request("vote",{code,participant_token:tokens[2],answer:"B"},409);
  await request("control",{session_id:sessionId,presenter_token:presenter,state:"ended"});
  await request("join",{code},409);
  const last=await request("present",{session_id:sessionId,presenter_token:presenter});
  assert.equal(last.session.state,"ended");
  assert.equal(last.count,3);
  const data=samples.map(x=>x.duration_ms).sort((a,b)=>a-b);
  const p95=data[Math.ceil(data.length*0.95)-1];
  const report={
    assessment:"REAL_DEPLOYED_BACKEND_SYNTHETIC_CONFERENCE_PATH_PASS",
    production_service:ENDPOINT,source_sha:sha,
    started_utc:start,completed_utc:new Date().toISOString(),
    test_fixture:title,real_conference_records_touched:false,
    registered_test_participants:3,accepted_unique_votes:3,request_count:samples.length,
    response_p95_ms:p95,max_ms:data.at(-1),
    tests:["owner & presenter negative authorization","presenter token positive authorization",
      "join three participants","view waiting and open","interaction event",
      "cast and deduplicate votes","preserve ballot secrecy",
      "presenter vote tally","controlled reveal",
      "closed-session vote rejection","ended-session join rejection"],
    owner_positive_login_verified:false,production_capacity_600_verified:false,
    frontend_cross_device_real_backend_verified:false,
    conference_gate:"PARTIAL_P0_EVIDENCE_ONLY",
    cleanup:"EXTERNAL APPROVED SQL MUST DELETE ONLY THIS TEST FIXTURE"
  };
  console.log(JSON.stringify(report,null,2));
  if(process.env.REHEARSAL_REPORT_PATH)writeFileSync(process.env.REHEARSAL_REPORT_PATH,JSON.stringify(report,null,2));
}catch(e){
  console.error("Real Edge rehearsal failed: "+String(e.message).slice(0,220));
  console.error("Test-created session may need isolated cleanup for fixture prefix TAMAYUZ-LIVE-REHEARSAL");
  process.exitCode=1;
}
