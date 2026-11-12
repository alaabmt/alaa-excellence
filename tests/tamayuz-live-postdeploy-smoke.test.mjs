import test from "node:test";
import assert from "node:assert/strict";
import {randomUUID,randomBytes} from "node:crypto";

const url="https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/tamayuz-live";
const nonexistentSession=randomUUID();
const nonexistentCode=randomBytes(5).toString("hex").toUpperCase();
async function request(action, fields={}) {
 const res=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action,...fields}),signal:AbortSignal.timeout(13000)});
 const payload=await res.json();
 return {status:res.status,payload};
}

test("Unauthenticated users cannot change, reopen, or read a presenter session",async()=>{
 for(const action of ["control","reactivate_session","present"]){
  const result=await request(action,{session_id:nonexistentSession,state:"open"});
  assert.equal(result.status,403,action+" must reject unauthenticated callers");
 }
});
test("Confidential owner reports and questions reject unauthenticated access",async()=>{
 const probes=[
  ["review_results",{session_id:nonexistentSession}],
  ["list_questions",{presentation_id:nonexistentSession}],
  ["presentation_workspace",{presentation_id:nonexistentSession}],
  ["session_analytics",{session_id:nonexistentSession,presentation_id:nonexistentSession}]
 ];
 for(const [action,fields] of probes){
  const result=await request(action,fields);
  assert.equal(result.status,403,action+" must reject unauthenticated callers");
 }
});
test("Public user identity status remains available without login",async()=>{
 const result=await request("owner_status");
 assert.equal(result.status,200);
 assert.equal(result.payload.owner,false);
});
test("Public audience lookup is allowed through the function, not owner-locked",async()=>{
 for(const action of ["join","view"]) {
  const result=await request(action,{code:nonexistentCode});
  assert.equal(result.status,404,action+" should look up the public code, not demand an owner login");
 }
});
test("Invalid participant cannot submit a vote",async()=>{
 const result=await request("vote",{code:nonexistentCode,participant_token:"invalid"});
 assert.equal(result.status,403);
});


test("Authorized private presenter can operate only temporary test session; audience can vote",async()=>{
 const sessionId="d63ad24f-8128-435a-8971-bcba3112f419";
 const questionId="c6f922b0-30a9-4fb8-943f-ef4f4316e016";
 const code="F3BC885A1A";
 const presenter_token="c".repeat(48);
 const before=await request("present",{session_id:sessionId,presenter_token});
 assert.equal(before.status,200);
 assert.equal(before.payload.session?.id,sessionId);
 assert.equal(before.payload.questions?.length,1);
 const opened=await request("control",{session_id:sessionId,presenter_token,state:"open",question_id:questionId});
 assert.equal(opened.status,200);
 assert.equal(opened.payload.session?.state,"open");
 const joined=await request("join",{code});
 assert.equal(joined.status,200);
 const participant_token=joined.payload.participant_token;
 assert.match(participant_token,/^[a-f0-9]{48}$/);
 const viewed=await request("view",{code,participant_token});
 assert.equal(viewed.status,200);
 assert.equal(viewed.payload.questions?.[0]?.id,questionId);
 const voted=await request("vote",{code,participant_token,answer:"A"});
 assert.equal(voted.status,200);
 assert.equal(voted.payload.accepted,true);
 const tally=await request("present",{session_id:sessionId,presenter_token});
 assert.equal(tally.status,200);
 assert.equal(tally.payload.count,1);
 const ended=await request("control",{session_id:sessionId,presenter_token,state:"ended"});
 assert.equal(ended.status,200);
 assert.equal(ended.payload.session?.state,"ended");
 const reopened=await request("reactivate_session",{session_id:sessionId,presenter_token});
 assert.equal(reopened.status,200);
 assert.equal(reopened.payload.session?.state,"open");
});
