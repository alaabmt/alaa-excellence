import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const html=readFileSync("live/index.html","utf8");
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
const js=scripts.find(s=>s.includes("async function audiencePage(force=false)"));
assert.ok(js,"Tamayuz Live application script should exist");
function bodyOf(begin,end){const a=js.indexOf(begin),b=js.indexOf(end,a+begin.length);assert.ok(a>=0&&b>a);return js.slice(a,b)}

test("Tamayuz frontend inline JavaScript parses",()=>{
 execFileSync(process.execPath,["--check","--input-type=commonjs"],{input:js,stdio:["pipe","pipe","pipe"]});
});
test("Home stops timers before clearing the session code",()=>{
 const home=bodyOf("function home(){","async function publicSessions()");
 assert.match(home,/function home\(\)\{\s*stop\(\)/);
 assert.match(home,/params\.delete\(key\)/);
 assert.match(home,/history\.replaceState\(null,"",location\.pathname\)/);
});
test("Leaving an audience page invalidates pending join/view callbacks",()=>{
 const block=bodyOf("async function audiencePage(force=false)","function render(){");
 assert.match(js,/function stop\(\)\{navigationEpoch\+\+/);
 assert.match(block,/const requestEpoch=navigationEpoch/);
 assert.match(block,/if\(requestEpoch!==navigationEpoch\|\|params\.get\("code"\)!==code\)return/);
 assert.match(block,/if\(!code\)return/);
});
test("Missing or ended codes display a terminal message without fake network errors",()=>{
 const block=bodyOf("async function audiencePage(force=false)","function render(){");
 assert.match(block,/e\.message==="Session ended"\|\|e\.message==="Session not found"/);
 assert.match(block,/Session not found\./);
 assert.match(block,/Check the joining code/);
 assert.match(block,/stop\(\)/);
});
test("Leaving presenter or public session list discards pending updates",()=>{
 assert.match(bodyOf("async function presenterPage()","let audienceBusy="),/if\(requestEpoch!==navigationEpoch\|\|!params\.get\("session"\)\)return/);
 assert.match(bodyOf("async function publicSessions()","function parsePrivateLink"),/requestEpoch!==navigationEpoch/);
});
