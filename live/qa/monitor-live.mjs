// Live-only read-only production monitor. Node 24+, zero dependencies.
// The public API "owner_status" action does not create sessions or participants.
import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {setTimeout as delay} from "node:timers/promises";

const BASE="https://tamayuz10x.com/live/";
const EDGE="https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/tamayuz-live";
// The page pins the function to the region next to the database; monitor the same route.
const PINNED_REGION="ap-south-1";
const EDGE_PINNED=EDGE+"?forceFunctionRegion="+PINNED_REGION;
// Alert thresholds for the read-only database-path probe (one database round trip).
// Measured 2026-11-13 from US runners through the pinned route: p50 ~330 ms, p95 ~500 ms.
const DB_PROBE_WARN_MS=1500,DB_PROBE_FAIL_MS=3000;
const REPO="alaabmt/alaa-excellence";
const TITLE="[Tamayuz Live] Production health incident";
const DRILL_TITLE="[Tamayuz Live][TEST] Alert routing verification";
const githubToken=process.env.GITHUB_TOKEN||"";
const repoEnv=process.env.GITHUB_REPOSITORY||REPO;
const drill=process.argv.includes("--alert-drill");
const out=process.env.GITHUB_STEP_SUMMARY||"";
assert.equal(repoEnv,REPO,"Monitor must run only in the authorized Live repository");

async function http(url,init={}){
  const start=performance.now();
  const response=await fetch(url,{...init,signal:AbortSignal.timeout(12000),redirect:"error",cache:"no-store"});
  const body=(await response.text()).slice(0,300000);
  return {status:response.status,body,ms:Math.round(performance.now()-start),region:response.headers.get("x-sb-edge-region")||""};
}
async function probe(){
  const result={time_utc:new Date().toISOString(),frontend:null,api:null,ok:false};
  const problems=[],warnings=[];
  try{
    const r=await http(BASE);
    result.frontend={http_status:r.status,duration_ms:r.ms};
    if(r.status!==200||!r.body.includes('id="app"')||!r.body.includes('TAMAYUZ')){
      problems.push("Published Live frontend missing or invalid");
    }
  }catch(e){problems.push("Published frontend: "+e.name)}
  try{
    const r=await http(EDGE,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"owner_status"})});
    result.api={http_status:r.status,duration_ms:r.ms};
    const v=JSON.parse(r.body);
    if(r.status!==200||v.owner!==false||v.reason!=="missing_login_token"){
      problems.push("Live backend authorization probe did not return its expected safe response");
    }
  }catch(e){problems.push("Live backend: "+e.name)}
  // Database-path probe: an audience poll for a join code that cannot exist (lowercase is never
  // issued). Read-only: it creates no participant, vote or event. It exercises function ->
  // database -> response on the same pinned route attendees use. A healthy answer is HTTP 404
  // "Session not found"; from the hot-path Edge version onward a database failure answers 500.
  const post=body=>({method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
  for(const [name,url] of [["db_path_pinned",EDGE_PINNED],["db_path_default",EDGE]]){
    try{
      const r=await http(url,post({action:"view",code:"monitor-no-such-session"}));
      result[name]={http_status:r.status,duration_ms:r.ms,edge_region:r.region};
      const v=JSON.parse(r.body);
      if(r.status!==404||v.error!=="Session not found")problems.push("Live audience database path ("+name+") returned an unexpected response: HTTP "+r.status);
      else if(name==="db_path_pinned"){
        if(r.region&&!r.region.startsWith(PINNED_REGION))warnings.push("Pinned route executed in "+r.region+" instead of "+PINNED_REGION);
        if(r.ms>=DB_PROBE_FAIL_MS)problems.push("Live audience database path is too slow: "+r.ms+" ms (limit "+DB_PROBE_FAIL_MS+" ms)");
        else if(r.ms>=DB_PROBE_WARN_MS)warnings.push("Live audience database path slow: "+r.ms+" ms");
      }
    }catch(e){
      // The default route is a fallback; only the route attendees use is alert-worthy on its own.
      (name==="db_path_pinned"?problems:warnings).push("Live audience database path ("+name+"): "+e.name);
    }
  }
  result.ok=problems.length===0;result.problems=problems;result.warnings=warnings;
  return result;
}
async function api(method,path,payload){
  assert(githubToken,"Missing GitHub issue-routing token");
  const r=await fetch("https://api.github.com/repos/"+REPO+path,{
    method,signal:AbortSignal.timeout(12000),
    headers:{authorization:"Bearer "+githubToken,accept:"application/vnd.github+json",
      "content-type":"application/json","x-github-api-version":"2022-11-28",
      "user-agent":"tamayuz-live-readonly-monitor"},
    ...(payload?{body:JSON.stringify(payload)}:{})
  });
  if(!r.ok)throw Error("GitHub issue transport failed: "+r.status);
  return r.json();
}
async function findOpen(title){
  const issues=await api("GET","/issues?state=open&per_page=100");
  return issues.find(i=>!i.pull_request&&i.title===title)||null;
}
async function sendIssue(title,description){
  let issue=await findOpen(title);
  if(issue)return {url:issue.html_url,created:false,number:issue.number};
  issue=await api("POST","/issues",{title,body:description,assignees:["alaabmt"]});
  const proof=await api("GET","/issues/"+issue.number);
  assert.equal(proof.title,title,"Alert transport must confirm persisted issue");
  assert.equal(proof.state,"open");
  return {url:proof.html_url,created:true,number:issue.number};
}
async function closeIssue(number,body){
  await api("POST","/issues/"+number+"/comments",{body});
  const issue=await api("PATCH","/issues/"+number,{state:"closed",state_reason:"completed"});
  assert.equal(issue.state,"closed");
}
function report(rows,route){
  const doc={site:BASE,edge:EDGE,event:drill?"alert_route_test":"production_read_only_monitor",
    checks:rows,route:route||null,credential_free_probes:true,
    human_email_or_acknowledgment_verified:false,conference_certification:false};
  console.log(JSON.stringify(doc,null,2));
  if(out){
    writeFileSync(out,
      "\n### Tamayuz Live — "+(drill?"issue-routing drill":"read-only production monitor")+
      "\n"+(rows.at(-1)?.ok?"**HEALTHY**":"**CHECK FAILED**")+
      "\n\n"+JSON.stringify(doc,null,2).replace(/\n/g,"\n")+"\n",
      {flag:"a"});
  }
}
if(drill){
  // Synthetically exercise the SAME persisted-issue delivery path, not a real outage.
  const result=await probe();
  const issue=await sendIssue(DRILL_TITLE,
    "**TEST ONLY — no outage.** This issue is a synthetic notification-route exercise for Tamayuz Live. "+
    "Created by the monitoring workflow; successful GitHub API read-back proves tracker delivery, "+
    "but recipient email or acknowledgment must be confirmed independently.\n"+
    "Workflow: https://github.com/"+REPO+"/actions/runs/"+process.env.GITHUB_RUN_ID);
  report([result],issue);
  // Leave test issue open so the recipient has time to see/acknowledge notification;
  // verify human receipt separately and close after verification.
}else{
  const results=[await probe()];
  if(!results[0].ok){
    await delay(4000);
    results.push(await probe());
  }
  const failing=results.some(r=>!r.ok)&&!results.at(-1).ok;
  let route=null;
  if(failing){
    route=await sendIssue(TITLE,
      "**Tamayuz Live read-only monitoring has failed twice.**\n"+
      "Last check (UTC): "+results.at(-1).time_utc+"\n"+
      "Frontend/API probe details: "+JSON.stringify(results)+"\n"+
      "Workflow: https://github.com/"+REPO+"/actions/runs/"+process.env.GITHUB_RUN_ID+
      "\nNo join/vote/data write is generated by the monitor. Investigate and escalate to the event owner.");
  }else if(githubToken){
    const old=await findOpen(TITLE);
    if(old)await closeIssue(old.number,
      "Automated Live frontend/API recovery observed at "+results.at(-1).time_utc+
      ". Close only after checking for active conference impact.");
  }
  report(results,route);
  if(failing)process.exitCode=1;
}
