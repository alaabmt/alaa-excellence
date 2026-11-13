// Static guarantees for the latency/capacity work. Behaviour is covered by
// tests/tamayuz-live-hot-path.sql (real PostgreSQL), tests/tamayuz-live-resilience-browser.mjs
// (real Chromium) and the isolated capacity workflow.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const backend=read("live/backend/index.ts"),sql=read("live/backend/sql/live_hot_path.sql"),app=read("live/index.html");
const monitor=read("live/qa/monitor-live.mjs"),workflow=read(".github/workflows/tamayuz-live-isolated-capacity.yml");

test("audience actions use one database round trip with a legacy fallback",()=>{
  for(const fn of ["live_audience_view","live_cast_vote","live_vote_aggregate","live_track_interaction"])
    assert.match(backend,new RegExp('db\\.rpc\\("'+fn+'"'));
  assert.match(backend,/const rpcMissing=\(e:any\)=>e\?\.code==="PGRST202"\|\|e\?\.code==="42883"/);
  assert.equal((backend.match(/hotPath=false/g)||[]).length,4,"each hot-path call must be able to fall back");
  // Legacy queries remain for deploy-order safety.
  assert.match(backend,/db\.from\("live_votes"\)\.insert\(\{session_id:s\.id,question_id:q\.id,participant_id:p\.id,answer\}\)/);
});
test("the revision shortcut can only return the public session snapshot",()=>{
  assert.match(backend,/return reply\(\{unchanged:true,session:cached\.session\}\)/);
  assert.match(backend,/Date\.now\(\)-cached\.at<VIEW_TTL_MS&&cached\.session\.revision===known/);
  assert.match(backend,/const VIEW_TTL_MS=1000,VIEW_CACHE_MAX=200/);
  // Presenter changes and resets drop cached snapshots in the isolate that handled them.
  assert.equal((backend.match(/viewCache\.delete\(data\.join_code\)/g)||[]).length,2);
  assert.match(backend,/viewCache\.clear\(\)/);
});
test("hot-path SQL keeps the security model and vote integrity",()=>{
  const names=["live_audience_view(text,text)","live_cast_vote(text,text,text)","live_vote_aggregate(uuid,uuid)","live_track_interaction(text,text,uuid,text)"];
  for(const n of names){
    assert(sql.includes("REVOKE ALL ON FUNCTION public."+n+" FROM PUBLIC, anon, authenticated;"),n);
    assert(sql.includes("GRANT EXECUTE ON FUNCTION public."+n+" TO service_role;"),n);
  }
  assert.equal((sql.match(/SECURITY INVOKER SET search_path = ''/g)||[]).length,4);
  assert.doesNotMatch(sql,/SECURITY DEFINER/);
  assert.match(sql,/WHERE s\.join_code = p_code FOR SHARE/);
  assert.match(sql,/ON CONFLICT \(session_id, question_id, participant_id\) DO NOTHING/);
  assert.match(sql,/CASE WHEN s\.reveal_correct_answer THEN jsonb_build_object\(\s*'correct_answer'/);
  assert.doesNotMatch(sql,/presenter_token_hash|owner_token_hash/);
  const statements=sql.replace(/--.*$/gm,"");
  assert.doesNotMatch(statements,/\b(DROP|TRUNCATE|DELETE|ALTER)\b/i,"additive migration only");
});
test("page pins the database region, falls back, and never auto-repeats non-idempotent actions",()=>{
  assert.match(app,/const PINNED_ENDPOINT=ENDPOINT\+"\?forceFunctionRegion=ap-south-1"/);
  const safe=/const RETRY_SAFE=new Set\(\[([^\]]+)\]\)/.exec(app)[1];
  for(const action of ["join","control","create","new_session","add_question","reset_session_votes","delete_session","delete_presentation","reactivate_session","track_interaction"])
    assert(!safe.includes('"'+action+'"'),action+" must not be retried automatically");
  assert.match(app,/if\(!out\)out=await attempt\(ENDPOINT,12000\)/);
});
test("polling is jittered, backs off, pauses hidden audience tabs and never uses a fixed interval",()=>{
  assert.match(app,/startPolling\(audiencePage,AUDIENCE_POLL_MS,true\)/);
  assert.match(app,/startPolling\(presenterPage,PRESENTER_POLL_MS,false\)/);
  assert.doesNotMatch(app,/setInterval\((audiencePage|presenterPage)/);
  assert.match(app,/const AUDIENCE_POLL_MS=3000,PRESENTER_POLL_MS=1500,POLL_BACKOFF_MAX_MS=15000,FULL_VIEW_EVERY=5/);
  assert.match(app,/\(0\.75\+Math\.random\(\)\*0\.5\)/);
  assert.match(app,/if\(!\(pauseWhenHidden&&document\.hidden\)\)/);
});
test("capacity tools refuse production and the isolated workflow holds no secrets",()=>{
  const run=spawnSync(process.execPath,[new URL("../tests/tamayuz-live-load.mjs",import.meta.url).pathname],{encoding:"utf8",timeout:60000,
    env:{...process.env,LIVE_LOAD_ENDPOINT:"https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/tamayuz-live"}});
  assert.notEqual(run.status,0,"the load harness must refuse a production endpoint");
  assert.match(run.stderr,/REFUSING/);
  const rehearsal=read("tests/tamayuz-live-isolated-browser-rehearsal.mjs");
  assert.match(rehearsal,/assert\(edgeUrl\.protocol==="http:"&&\["127\.0\.0\.1","localhost"\]\.includes\(edgeUrl\.hostname\),"REFUSING/);
  assert.match(rehearsal,/c\.route\("\*\*\/\*supabase\.co\/\*\*",r=>\{escapes\.push/);
  assert.doesNotMatch(workflow,/\$\{\{\s*secrets\./);
  assert.doesNotMatch(workflow,/supabase\.co/);
  assert.match(workflow,/permissions:\n  contents: read\n/);
});
test("monitor probes the attendee route and the database path without writing data",()=>{
  assert.match(monitor,/action:"view",code:"monitor-no-such-session"/);
  assert.match(monitor,/forceFunctionRegion=/);
  assert.doesNotMatch(monitor,/action:"(join|vote|control|create|new_session)"/);
});
