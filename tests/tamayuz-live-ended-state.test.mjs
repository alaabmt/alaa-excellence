import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";

const html=readFileSync("live/index.html","utf8");
const scripts=[...html.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/g)].map(x=>x[1]).filter(Boolean);
test("inline application JavaScript passes syntax check",()=>{
 const app=scripts.find(s=>s.includes("async function audiencePage"));
 assert.ok(app,"audience code missing");
 execFileSync(process.execPath,["--check","--input-type=commonjs"],{input:app,stdio:["pipe","pipe","pipe"]});
});
test("ended sessions are not confused with a broken internet connection",()=>{
 const anchor=html.indexOf("async function audiencePage(force=false)");
 const end=html.indexOf("function render(){",anchor);
 const audience=html.slice(anchor,end);
 assert.ok(anchor>0 && end>anchor);
 assert.match(audience,/if\(e\.message==="Session ended"\)/);
 assert.match(audience,/stop\(\);/);
 assert.match(audience,/This session has ended\./);
 assert.match(audience,/Return to Tamayuz Live/);
 assert.match(audience,/if\(s\.state==="ended"\)/);
});
