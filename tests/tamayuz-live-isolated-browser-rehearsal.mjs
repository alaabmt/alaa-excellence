// Full conference rehearsal in REAL Chromium against the REAL Edge Function source and a real
// PostgreSQL, on an ISOLATED loopback stack (never production). The published page is served
// unchanged except for its backend address. Presenter and audience are driven through the UI:
// QR/deep-link join, English and Arabic (RTL), desktop and phone-sized viewports, voting by
// tapping, close, reveal, refresh, offline/online recovery and tally reconciliation.
// Honest scope: browser emulation on a CI runner; not physical iOS/Android devices.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { writeFileSync } from "node:fs";
import { resolve, extname } from "node:path";
import { chromium, devices } from "playwright";

const EDGE=process.env.LIVE_LOAD_ENDPOINT||"";
const edgeUrl=new URL(EDGE);
assert(edgeUrl.protocol==="http:"&&["127.0.0.1","localhost"].includes(edgeUrl.hostname),"REFUSING: rehearsal only targets a loopback isolated stack");
const CODE=process.env.LIVE_BROWSER_CODE||"BRWSIDLE01";
const SESSION=process.env.LIVE_BROWSER_SESSION||"c3000000-0000-4000-8000-000000000002";
const PRESENTER=process.env.LIVE_BROWSER_PRESENTER||"2b".repeat(24);
const AUDIENCE=Number(process.env.LIVE_BROWSER_AUDIENCE||12);
const REPORT=process.env.LIVE_BROWSER_REPORT||"",LABEL=process.env.LIVE_BROWSER_LABEL||"idle";
const PROD="https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/tamayuz-live";
const root=resolve("."),port=Number(process.env.LIVE_BROWSER_PORT||8178),base="http://127.0.0.1:"+port;
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,base).pathname);
  const file=resolve(root,"."+(pathname.endsWith("/")?pathname+"index.html":pathname));
  if(!file.startsWith(root+"/"))throw Error("invalid path");
  const mime={".html":"text/html",".js":"text/javascript",".css":"text/css"};
  res.setHeader("Content-Type",mime[extname(file)]||"application/octet-stream");
  let body=await readFile(file);
  if(pathname==="/live/"){
   const html=body.toString("utf8");
   assert.equal(html.split('"'+PROD+'"').length,2,"the page must reference the backend address exactly once");
   body=html.replace('"'+PROD+'"','"'+EDGE+'"');   // the only modification
  }
  res.end(body);
 }catch{res.statusCode=404;res.end("Not found")}
});
await new Promise(ok=>server.listen(port,"127.0.0.1",ok));
const timings={join_to_form_ms:[],tap_to_confirmation_ms:[],open_to_form_ms:[],reveal_to_visible_ms:[]};
const result={assessment:"TAMAYUZ_LIVE_ISOLATED_BROWSER_REHEARSAL",label:LABEL,browser:"Chromium (Playwright), emulated viewports",
 physical_devices:false,production_backend:false,git_sha:process.env.GITHUB_SHA||null,started_at_utc:new Date().toISOString(),audience_browsers:AUDIENCE,steps:[]};
const step=name=>{result.steps.push(name);console.log("ok - "+name)};
let browser;
try{
 browser=await chromium.launch({headless:true});
 const escapes=[];
 async function context(options,lang){
  const c=await browser.newContext(options);
  await c.addInitScript(l=>{try{localStorage.setItem("live-lang",l)}catch(_){}} ,lang);
  await c.route("**/assets/js/assessment-auth-client.js",r=>r.fulfill({contentType:"text/javascript",
   body:"export async function createAuthClient(){return {auth:{getSession:async()=>({data:{session:null},error:null})}}}"}));
  // Nothing in this rehearsal may reach the production backend.
  await c.route("**/*supabase.co/**",r=>{escapes.push(r.request().url());return r.abort()});
  return c;
 }
 // ---- presenter (desktop, private presenter link) ----
 const pc=await context({viewport:{width:1440,height:900}},"en");
 const presenter=await pc.newPage();const errors=[];presenter.on("pageerror",e=>errors.push("presenter: "+e.message));
 await presenter.goto(base+"/live/?session="+SESSION+"#presenter="+PRESENTER);
 await presenter.locator("#presenter-root").waitFor({timeout:20000});
 await presenter.waitForFunction(()=>!!document.getElementById("audience-link")?.getAttribute("href"),null,{timeout:20000});
 const joinHref=await presenter.locator("#audience-link").getAttribute("href");
 assert(joinHref&&joinHref.includes("code="+CODE),"presenter screen must show the public join link");
 step("presenter opens the private link and sees the join code/link");
 // ---- audience: mixed phones/desktop, English/Arabic ----
 const profiles=[
  {name:"phone-en",options:{...devices["Pixel 7"]},lang:"en"},
  {name:"phone-ar",options:{...devices["iPhone 13"],defaultBrowserType:undefined},lang:"ar"},
  {name:"small-ar",options:{viewport:{width:320,height:640},isMobile:true,hasTouch:true},lang:"ar"},
  {name:"desktop-en",options:{viewport:{width:1280,height:800}},lang:"en"}];
 const audience=[];
 for(let i=0;i<AUDIENCE;i++){
  const profile=profiles[i%profiles.length];
  const {defaultBrowserType,...options}=profile.options;
  const c=await context(options,profile.lang),p=await c.newPage();
  p.on("pageerror",e=>errors.push(profile.name+": "+e.message));
  audience.push({c,p,profile,i});
 }
 const joinPath=new URL(joinHref,base).search;   // the same link the QR code encodes
 await Promise.all(audience.map(a=>a.p.goto(base+"/live/"+joinPath)));
 await Promise.all(audience.map(a=>a.p.locator("#audience-root").waitFor({timeout:20000})));
 await Promise.all(audience.map(a=>a.p.getByText(a.profile.lang==="ar"?"بانتظار مقدم العرض...":"Waiting for the presenter...").waitFor({timeout:20000})));
 for(const a of audience.filter(a=>a.profile.lang==="ar"))assert.equal(await a.p.evaluate(()=>document.documentElement.dir),"rtl","Arabic must render RTL");
 step(AUDIENCE+" audience browsers joined through the public link (EN + AR/RTL, phone + desktop)");
 async function openVoting(){
  const t=Date.now();
  await presenter.locator("#open").click();
  await Promise.all(audience.map(async a=>{await a.p.locator(".option").first().waitFor({timeout:20000});timings.open_to_form_ms.push(Date.now()-t)}));
 }
 async function everyoneVotes(){
  await Promise.all(audience.map(async a=>{
   const options=a.p.locator(".option"),count=await options.count();assert(count>=2);
   const t=Date.now();
   await options.nth(a.i%count).click();
   await a.p.locator("p.success").first().waitFor({timeout:20000});
   timings.tap_to_confirmation_ms.push(Date.now()-t);
  }));
 }
 const shownTotal=async()=>presenter.evaluate(()=>{const s=document.getElementById("status");return s?s.textContent:""});
 // ---- question 1 ----
 const firstId=await presenter.locator("#question").inputValue();
 assert.match(firstId,/^[a-f0-9-]{36}$/,"presenter selector must list the questions");
 await openVoting();
 step("presenter opened voting; the question reached every audience browser");
 for(const a of audience){
  assert.equal(await a.p.locator(".answer-explanation").count(),0,"answer must stay hidden before reveal");
  assert.equal(await a.p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,a.profile.name+" horizontal overflow");
 }
 step("no answer key before reveal and no horizontal overflow on any viewport");
 await everyoneVotes();
 step("every audience browser voted by tapping an option and saw the confirmation");
 // Refresh keeps identity and the confirmed vote.
 await audience[0].p.reload();
 await audience[0].p.locator("p.success").first().waitFor({timeout:20000});
 assert.equal(await audience[0].p.locator(".option").count(),0,"a refreshed browser must not be able to vote twice");
 step("refresh keeps the participant identity and the recorded vote");
 // New tab in the same browser (rescanned QR) keeps identity too.
 const again=await audience[1].c.newPage();
 await again.goto(base+"/live/"+joinPath);
 await again.locator("p.success").first().waitFor({timeout:20000});
 await again.close();
 step("rescanning the join link in the same browser does not create a second voter");
 await presenter.locator("#close").click();
 await presenter.waitForFunction(n=>{const r=document.getElementById("results");return r&&r.textContent&&r.textContent.includes(String(n))},AUDIENCE,{timeout:20000});
 step("presenter closed voting and the displayed tally includes all "+AUDIENCE+" votes");
 const t=Date.now();
 await presenter.locator("#answer-reveal").click();
 await Promise.all(audience.map(async a=>{await a.p.locator(".answer-explanation").first().waitFor({timeout:20000});timings.reveal_to_visible_ms.push(Date.now()-t)}));
 step("presenter revealed the answer; explanation appeared on every audience browser");
 // ---- question 2 with a connectivity loss on two phones ----
 await presenter.locator("#next").click();
 await presenter.waitForFunction(id=>document.querySelector("#question")?.value&&document.querySelector("#question").value!==id,firstId,{timeout:20000});
 const offline=audience.slice(2,4);
 await Promise.all(offline.map(a=>a.c.setOffline(true)));
 await openVoting().catch(()=>{});      // offline phones cannot see it yet
 await new Promise(r=>setTimeout(r,9000));
 await Promise.all(offline.map(a=>a.c.setOffline(false)));
 await Promise.all(offline.map(a=>a.p.locator(".option").first().waitFor({timeout:45000})));
 for(const a of offline)await a.p.waitForFunction(()=>!document.querySelector("#notice.error"),null,{timeout:45000});
 step("phones that lost connectivity recovered by themselves and received the open question");
 await everyoneVotes();
 await presenter.locator("#close").click();
 await presenter.waitForFunction(n=>{const r=document.getElementById("results");return r&&r.textContent&&r.textContent.includes(String(n))},AUDIENCE,{timeout:20000});
 step("second question: all "+AUDIENCE+" votes counted after the connectivity loss");
 // ---- end session ----
 presenter.once("dialog",d=>d.accept());
 await presenter.locator("#end").click();
 await Promise.all(audience.map(a=>a.p.getByText(a.profile.lang==="ar"?"انتهت هذه الجلسة.":"This session has ended.").first().waitFor({timeout:30000})));
 step("presenter ended the session; every audience browser showed the ended state");
 assert.deepEqual(errors,[],"unexpected browser script errors");
 assert.deepEqual(escapes,[],"no request may reach supabase.co during the isolated rehearsal");
 result.passed=true;
}catch(e){result.passed=false;result.error=String(e.message||e).slice(0,600);console.error("REHEARSAL FAILED: "+result.error);process.exitCode=1}
finally{
 const pct=(a,p)=>{a=[...a].sort((x,y)=>x-y);return a.length?a[Math.min(a.length-1,Math.ceil(a.length*p)-1)]:null};
 result.timings_ms=Object.fromEntries(Object.entries(timings).map(([k,v])=>[k,{n:v.length,p50:pct(v,.5),p95:pct(v,.95),max:v.length?Math.max(...v):null}]));
 result.completed_at_utc=new Date().toISOString();
 console.log(JSON.stringify(result,null,2));
 if(REPORT)writeFileSync(REPORT,JSON.stringify(result,null,2)+"\n");
 if(browser)await browser.close();
 await new Promise(ok=>server.close(ok));
}
