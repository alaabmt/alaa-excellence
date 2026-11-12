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
