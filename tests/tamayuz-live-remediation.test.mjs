import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const backend=readFileSync("live/backend/index.ts","utf8");
const frontend=readFileSync("live/index.html","utf8");
const sql=readFileSync("live/backend/sql/live_atomic_operations.sql","utf8");
const audit=readFileSync("scripts/audit_unified_navigation.py","utf8");
const block=(a,b)=>{const start=backend.indexOf(a),end=backend.indexOf(b,start+a.length);assert.ok(start>=0&&end>start,a);return backend.slice(start,end)};
const app=[...frontend.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(v=>v.includes("function audiencePage("));
assert.ok(app,"Live app inline script should exist");

test("frontend inline app JavaScript parses",()=>{new vm.Script(app)});
test("anonymous visitors cannot enumerate presentation titles or session join codes",()=>{
  for(const body of [block('if(action==="list"){','if(action==="review_results")'),block('if(action==="list_sessions"){','if(action==="add_question")')]){
    assert.match(body,/await owner\(req\)/);
    assert.match(body,/Owner authorization required/);
  }
  assert.match(frontend,/\$\("presenter-mode"\)\.onclick=presenterAccess/);
  assert.match(frontend,/else if\(params\.get\("presenter_mode"\)\).*?presenterAccess\(\)/);
});
test("presentation changes and session reset are one database transaction",()=>{
  assert.match(block('if(action==="reorder_questions")','if(action==="presentation_workspace")'),/db\.rpc\("live_reorder_questions"/);
  assert.match(block('if(action==="reset_session_votes")','if(action==="new_session")'),/db\.rpc\("live_reset_session"/);
  assert.match(sql,/FOR UPDATE/g);
  assert.match(sql,/DELETE FROM public\.live_votes/);
  assert.match(sql,/CREATE OR REPLACE FUNCTION public\.live_reorder_questions/);
  assert.match(sql,/REVOKE ALL ON FUNCTION public\.live_reset_session\(uuid\) FROM PUBLIC, anon, authenticated/);
});
test("concurrent joins use serialized 600-seat registration",()=>{
  assert.match(block('if(action==="view"||action==="join")','if(action==="vote")'),/db\.rpc\("live_register_participant"/);
  assert.match(sql,/IF v_count >= 600 THEN/);
  assert.match(sql,/WHERE s\.join_code = p_code FOR UPDATE/);
  assert.match(sql,/GRANT EXECUTE ON FUNCTION public\.live_register_participant\(text,text\) TO service_role/);
});
test("answer keys remain hidden until the presenter reveals them",()=>{
  const viewing=block('if(action==="view"||action==="join")','if(action==="vote")');
  assert.match(viewing,/if\(s\.reveal_correct_answer\)return q/);
  assert.match(viewing,/const \{correct_answer,answer_justification,answer_effect,\.\.\.safeQuestion\}=q/);
  const code=app.slice(app.indexOf("function audienceExplanation("),app.indexOf("function styleAudience()"));
  const render=(v,q)=>vm.runInNewContext(code+"\naudienceExplanation(v,q)",{v,q,t:en=>en,esc:x=>String(x)});
  const q={correct_answer:"A",answer_justification:"Because A",answer_effect:"Effect"};
  assert.equal(render({session:{reveal_correct_answer:false}},q),"");
  assert.match(render({session:{reveal_correct_answer:true}},q),/Because A/);
  assert.match(app,/\(reveal\?audienceExplanation\(v,q\):""\)/);
});
test("audience renews a stale participant after a vote reset",()=>{
  assert.match(app,/if\(v\.participant_valid===false\)/);
  assert.match(app,/sessionStorage\.removeItem\("live-participant-"\+code\)/);
  assert.match(app,/k\.startsWith\("live-voted-"\+s\.id\+"-"\)/);
});
test("standalone Live app retains its own Home control in site-health audit",()=>{
  assert.match(audit,/standalone_apps = \{"live\/index\.html"/);
  assert.match(frontend,/id="home-link"/);
});
