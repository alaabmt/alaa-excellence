// Live safety check: these requests are read-only, unauthorized, or use an impossible code.
// No real join, vote, session creation, token or personal data is accessed.
import assert from "node:assert/strict";
const endpoint="https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/tamayuz-live";
const cases=[
 ["owner_status",{},200,body=>body.owner===false],
 ["list",{},403,body=>body.error==="Owner authorization required"],
 ["list_sessions",{},403,body=>body.error==="Owner authorization required"],
 ["list_questions",{presentation_id:"11111111-1111-4111-8111-111111111111"},403,body=>body.error==="Owner authorization required"],
 ["reset_session_votes",{session_id:"11111111-1111-4111-8111-111111111111"},403,body=>body.error==="Owner authorization required"],
 ["reorder_questions",{presentation_id:"11111111-1111-4111-8111-111111111111",question_ids:[]},403,body=>body.error==="Owner authorization required"],
 ["control",{session_id:"11111111-1111-4111-8111-111111111111",state:"open"},403,body=>body.error==="Presenter authorization required"],
 ["present",{session_id:"11111111-1111-4111-8111-111111111111"},403,body=>body.error==="Presenter authorization required"],
 ["view",{code:"NO_SUCH_CODE_2026"},404,body=>body.error==="Session not found"]
];
for(const [action,args,expected,valid] of cases){
 const response=await fetch(endpoint,{
  method:"POST",headers:{"content-type":"application/json"},
  signal:AbortSignal.timeout(12000),body:JSON.stringify({action,...args})
 });
 const body=await response.json();
 assert.equal(response.status,expected,action+": unexpected HTTP status");
 assert(valid(body),action+": unexpected response body");
 console.log(action+": "+response.status+" expected");
}
console.log("Tamayuz Live live read-only authorization smoke: PASS");
