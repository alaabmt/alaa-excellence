import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const backend=readFileSync("live/backend/index.ts","utf8");
const frontend=readFileSync("live/index.html","utf8");
function action(name) {
 const marker='if(action==="'+name+'"){';
 const start=backend.indexOf(marker);
 assert.notEqual(start,-1,"missing "+name);
 const rest=backend.slice(start+marker.length);
 const next=rest.search(/\n\s*(?:if\(action===|if\(\[)/);
 return next<0?rest:rest.slice(0,next);
}
test("critical state changes verify the caller",()=>{
 for(const name of ["control","reactivate_session"]) {
  const body=action(name);
  assert.match(body,/sessionByToken\(id,token\)/);
  assert.match(body,/await owner\(req\)/);
  assert.match(body,/return reply\(\{error:"Presenter authorization required"\},403\)/);
 }
});
test("presenter result access is private",()=>{
 const body=action("present");
 assert.match(body,/sessionByToken\(id,token\)/);
 assert.match(body,/await owner\(req\)/);
 assert.match(body,/Presenter authorization required/);
});
test("question keys and analytics require the owner",()=>{
 for(const name of ["review_results","list_questions","presentation_workspace","session_analytics"]){
  assert.match(action(name),/if\(!\(await owner\(req\)\)\)return reply\(\{error:"Owner authorization required"\},403\)/);
 }
});
test("owner sessions reach the presenter via authenticated request",()=>{
 assert.match(frontend,/const v=await api\("present",\{session_id:params\.get\("session"\)/);
 assert.doesNotMatch(frontend,/Public controls enabled: anyone can manage this session/);
});
test("audience voting and viewing still exist",()=>{
 assert.match(backend,/if\(action==="view"\|\|action==="join"\)/);
 assert.match(backend,/if\(action==="vote"\)/);
});
