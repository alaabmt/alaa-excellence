import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const page=readFileSync("live/qa/owner-auth-check.html","utf8");
const smoke=readFileSync("tests/tamayuz-live-bounded-capacity-smoke.mjs","utf8");
const policy=readFileSync("live/qa/capacity-certification-plan.md","utf8");
test("Owner check uses the website's real Supabase session and cannot mint an owner token",()=>{
  assert.match(page,/assessment-auth-client\.js/);
  assert.match(page,/getSession\(\)/);
  assert.match(page,/owner_status",token/);
  assert.match(page,/request\("list",token\)/);
  assert.match(page,/request\("list_sessions",token\)/);
  assert.match(page,/request\("review_results",token/);
  assert.match(page,/request\("list","tamayuz-live-intentionally-invalid-token"\)/);
  assert.match(page,/production_write_operations:0/);
  assert.match(page,/secrets_or_identifiers_exported:false/);
  assert.doesNotMatch(page,/(?:request|api)\("(?:create|new_session|vote|control|delete_session|reset_session_votes|update_question|rename_session)",/);
});
test("Owner check never claims independent verification before real user execution",()=>{
  assert.match(page,/verified_by_independent_reviewer:false/);
  assert.match(page,/Not yet tested\. NO-GO remains/);
});
test("Production capacity probe is hard-capped and never certifies a 600-client load",()=>{
  assert.match(smoke,/const CLIENTS=10,TEST_MS=60000,POLL_MS=2000/);
  assert.match(smoke,/requested_conference_capacity:600,certifies_600_simultaneous_browsers:false/);
  assert.match(smoke,/Aborting polling/);
  assert.match(smoke,/4\.5s p95/);
  assert.match(smoke,/Test must be bound to exact PR SHA/);
  assert.match(smoke,/Repository scope violation/);
  assert.match(policy,/NO-GO/);
  assert.match(policy,/NOT VERIFIED/);
});
