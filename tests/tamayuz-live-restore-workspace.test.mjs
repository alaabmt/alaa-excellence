import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";

const html=readFileSync("live/index.html","utf8");
const app=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes("function restoreOwnerView()"));
assert.ok(app,"Expected Tamayuz app script");
const start=app.indexOf('const ownerViewStorageKey=');
const end=app.indexOf("let lang=",start);
assert.ok(start>0&&end>start);
const helpers=app.slice(start,end);
const pid="85c26285-8dd4-43c7-b8bd-66e00f9659a4";
const session="8887402e-d6a9-4b1f-9910-5ccbb590d8a6";
function harness(search="",shared=new Map()){
 const location={pathname:"/live/",search};
 const history={urls:[],replaceState(_state,_name,url){history.urls.push(url);location.search=url.includes("?")?"?"+url.split("?")[1]:""}};
 const storage={
  getItem:key=>shared.get(key)||null,
  setItem:(key,value)=>shared.set(key,String(value)),
  removeItem:key=>shared.delete(key)
 };
 const context=vm.createContext({URLSearchParams,Date,Number,sessionStorage:storage,history,location});
 vm.runInContext("const params=new URLSearchParams(location.search);\n"+helpers,context);
 return {context,location,history,storage,shared,call:expr=>vm.runInContext(expr,context)};
}
test("Tamayuz Live inline JavaScript parses",()=>{
 execFileSync(process.execPath,["--check","--input-type=commonjs"],{input:app,stdio:["pipe","pipe","pipe"]});
});
test("Manage presentation and analytics tab return after a browser mode reload to /live/",()=>{
 const shared=new Map(),first=harness("?admin=1&presentation="+pid,shared);
 first.call('rememberOwnerView("manage","'+pid+'","analytics","'+session+'")');
 const second=harness("",shared);
 assert.equal(second.call("restoreOwnerView()"),true);
 assert.equal(second.call('params.get("admin")'),"1");
 assert.equal(second.call('params.get("presentation")'),pid);
 assert.equal(second.call('params.get("tab")'),"analytics");
 assert.equal(second.call('params.get("report_session")'),session);
 assert.match(second.history.urls[0],/\?admin=1&presentation=/);
});
test("Manage active Live sessions tab also survives reload",()=>{
 const shared=new Map(),first=harness("",shared);
 first.call('rememberOwnerView("manage","'+pid+'","sessions")');
 const second=harness("",shared);
 assert.equal(second.call("restoreOwnerView()"),true);
 assert.equal(second.call('params.get("tab")'),"sessions");
});
test("Explicit public joining link overrides remembered dashboard/management",()=>{
 const shared=new Map(),previous=harness("",shared);
 previous.call('rememberOwnerView("manage","'+pid+'","questions")');
 const audience=harness("?code=BF0F113B01",shared);
 assert.equal(audience.call("restoreOwnerView()"),false);
 assert.equal(audience.call('params.get("admin")'),null);
 assert.equal(audience.call('params.get("code")'),"BF0F113B01");
 const dashboard=harness("?admin=1",shared);
 assert.equal(dashboard.call("restoreOwnerView()"),false);
 assert.equal(dashboard.call('params.get("presentation")'),null);
});
test("Home forgets prior management route and restores only when intentionally saved",()=>{
 const shared=new Map(),ctx=harness("",shared);
 ctx.call('rememberOwnerView("manage","'+pid+'","questions")');
 ctx.call("clearOwnerView()");
 assert.equal(harness("",shared).call("restoreOwnerView()"),false);
 const home=app.slice(app.indexOf("function home(){"),app.indexOf("async function publicSessions()"));
 assert.match(home,/function home\(\)\{\s*stop\(\);clearOwnerView\(\)/);
});
test("Expired, malformed and invalid presentation route entries are ignored",()=>{
 const shared=new Map();
 shared.set("tamayuz-live-owner-view-v1",JSON.stringify({mode:"manage",presentation:"not-a-uuid",tab:"analytics",saved_at:Date.now()}));
 let ctx=harness("",shared);assert.equal(ctx.call("restoreOwnerView()"),false);assert.equal(shared.size,0);
 shared.set("tamayuz-live-owner-view-v1",JSON.stringify({mode:"manage",presentation:pid,tab:"analytics",saved_at:Date.now()-48*3600*1000}));
 ctx=harness("",shared);assert.equal(ctx.call("restoreOwnerView()"),false);assert.equal(shared.size,0);
});
test("Private management remains owner-verified, no auth tokens stored in route",()=>{
 const manage=app.slice(app.indexOf("async function manage(pid)"),app.indexOf("function qr(code)"));
 assert.match(manage,/await requireLiveOwner\(\)/);
 assert.match(manage,/rememberOwnerView\("manage",pid/);
 assert.match(manage,/rememberOwnerView\("manage",pid,name/);
 const dashboard=app.slice(app.indexOf("async function dashboard()"),app.indexOf("async function manage(pid)"));
 assert.match(dashboard,/await requireLiveOwner\(\)/);
 assert.match(dashboard,/rememberOwnerView\("dashboard"\)/);
 const shared=new Map(),ctx=harness("",shared);
 ctx.call('rememberOwnerView("manage","'+pid+'","analytics","'+session+'")');
 const value=[...shared.values()][0];
 assert.doesNotMatch(value,/access_token|password|presenter_token|admin_token/);
});
