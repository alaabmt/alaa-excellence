// Isolated Live resilience test in real Chromium. Every backend request is intercepted;
// nothing reaches the production Edge Function. Covers: region-pinned endpoint, automatic
// fallback, recovery from a failed first load, lightweight revision polls, identity kept
// across tabs, error backoff, Arabic RTL and 320px layout.
// LIVE_HTML=<file> serves another copy of the page (used to reproduce defects on old code).
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { chromium } from "playwright";

const root=resolve("."),port=8176,base="http://127.0.0.1:"+port;
const override=process.env.LIVE_HTML?resolve(process.env.LIVE_HTML):"";
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,base).pathname);
  let file=resolve(root,"."+(pathname.endsWith("/")?pathname+"index.html":pathname));
  if(!file.startsWith(root+"/"))throw Error("invalid path");
  if(override&&pathname==="/live/")file=override;
  const mime={".html":"text/html",".js":"text/javascript",".css":"text/css"};
  res.setHeader("Content-Type",mime[extname(file)]||"application/octet-stream");
  res.end(await readFile(file));
 }catch{res.statusCode=404;res.end("Not found")}
});
await new Promise(ok=>server.listen(port,"127.0.0.1",ok));
const EDGE=/^https:\/\/dqrsjhcfmpjhcxvtxosy\.supabase\.co\/functions\/v1\/tamayuz-live(\?.*)?$/;
const code="ABCDEF1234",sid="11111111-1111-4111-8111-111111111111",qid="22222222-2222-4222-8222-222222222222";
const question={id:qid,prompt:"Synthetic clinical case: what should be done?",kind:"choice",options:["Treatment A","Treatment B"],position:0};
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type,authorization,apikey","Access-Control-Allow-Methods":"POST,OPTIONS"};
let browser;
async function scenario(name,{viewport={width:390,height:800},lang="en"}={},run){
 const context=await browser.newContext({viewport});
 const world={joined:0,tokens:new Set(),voted:new Set(),revision:1,state:"open",reveal:false,
  requests:[],failPinned:false,failAll:0,supportsRev:true,errors:[],controls:[],pState:"waiting",pActive:null};
 await context.addInitScript(l=>{try{localStorage.setItem("live-lang",l)}catch(_){}} ,lang);
 await context.route("**/assets/js/assessment-auth-client.js",route=>route.fulfill({contentType:"text/javascript",
  body:"export async function createAuthClient(){return {auth:{getSession:async()=>({data:{session:null},error:null})}}}"}));
 await context.route("**/cdnjs.cloudflare.com/**",route=>route.fulfill({contentType:"text/javascript",body:""}));
 await context.route(EDGE,route=>{
  const req=route.request();
  if(req.method()==="OPTIONS")return route.fulfill({status:204,headers:cors});
  const pinned=new URL(req.url()).searchParams.get("forceFunctionRegion")||"";
  const b=req.postDataJSON();
  world.requests.push({action:b.action,pinned,rev:b.rev,at:Date.now()});
  const send=(value,status=200)=>route.fulfill({status,headers:cors,contentType:"application/json",body:JSON.stringify(value)});
  if(world.failAll>0){world.failAll--;return route.abort("internetdisconnected")}
  // Alternate between a non-JSON gateway page and a platform JSON error without an application "error" field.
  if(world.failPinned&&pinned)return world.requests.length%2?route.fulfill({status:503,headers:cors,contentType:"text/plain",body:"regional gateway unavailable"})
   :route.fulfill({status:500,headers:cors,contentType:"application/json",body:JSON.stringify({code:"BOOT_ERROR",message:"Function failed to start"})});
  const session={id:sid,code,state:world.state,active_question_id:qid,show_results:false,reveal_correct_answer:world.reveal,revision:world.revision};
  if(b.action==="join"){const token=(++world.joined).toString(16).padStart(48,"a");world.tokens.add(token);return send({participant_token:token,session_id:sid})}
  if(b.action==="view"){
   if(world.supportsRev&&Number.isSafeInteger(b.rev)&&b.rev===world.revision)return send({unchanged:true,session});
   const valid=world.tokens.has(b.participant_token);
   return send({session,voted:valid&&world.voted.has(b.participant_token),participant_valid:valid,
    questions:[world.reveal?{...question,correct_answer:"Treatment A",answer_justification:"Synthetic explanation after reveal"}:question],aggregate:[],count:null});
  }
  if(b.action==="vote"){if(!world.tokens.has(b.participant_token))return send({error:"Invalid participant"},403);world.voted.add(b.participant_token);return send({accepted:true})}
  if(b.action==="track_interaction")return send({accepted:true});
  if(b.action==="present"||b.action==="control"){
   if(b.action==="control"){world.controls.push(b);world.pState=b.state;if(b.question_id)world.pActive=b.question_id;world.revision++}
   return send({session:{id:sid,code,state:world.pState,active_question_id:world.pActive,show_results:false,reveal_correct_answer:false,revision:world.revision},
    questions:[question,{...question,id:"33333333-3333-4333-8333-333333333333",position:1,prompt:"Second synthetic case"}],aggregate:[],count:0});
  }
  return send({error:"Unknown action"},400);
 });
 const page=await context.newPage();page.on("pageerror",e=>world.errors.push(e.message));
 try{await run({context,page,world});assert.deepEqual(world.errors,[],name+": unexpected script errors");console.log("ok - "+name)}
 finally{await context.close()}
}
const views=w=>w.requests.filter(r=>r.action==="view");
try{
 browser=await chromium.launch({headless:true});

 await scenario("requests run in the pinned database region; light polls carry the known revision",{},async({page,world})=>{
  await page.goto(base+"/live/?code="+code);
  await page.locator(".option").first().waitFor({timeout:15000});
  await page.waitForTimeout(13000);
  assert(world.requests.length>0&&world.requests.every(r=>r.pinned==="ap-south-1"),"all healthy requests must use the pinned region");
  const v=views(world);
  assert(v.length>=4&&v.length<=8,"about one poll per 3s expected, saw "+v.length+" in 13s");
  assert.equal(v[0].rev,undefined,"first poll must be a full snapshot");
  assert(v.slice(1).some(r=>r.rev===1),"later polls must send the rendered revision");
  assert.equal(world.joined,1,"exactly one registration");
  // A presenter change (new revision) must still reach the screen.
  world.revision=2;world.reveal=true;
  await page.getByText("Synthetic explanation after reveal").waitFor({timeout:12000});
 });

 await scenario("voting survives the lightweight polls and is confirmed",{},async({page,world})=>{
  await page.goto(base+"/live/?code="+code);
  await page.locator(".option").first().click();
  await page.getByText("Your answer was received.").first().waitFor({timeout:10000});
  await page.waitForTimeout(7000);
  assert.equal(await page.locator(".option").count(),0,"voting form must not reappear after a confirmed vote");
  assert.equal(world.voted.size,1);
 });

 await scenario("falls back to default routing when the pinned region fails",{},async({page,world})=>{
  world.failPinned=true;
  await page.goto(base+"/live/?code="+code);
  await page.locator(".option").first().waitFor({timeout:20000});
  await page.locator(".option").first().click();
  await page.getByText("Your answer was received.").first().waitFor({timeout:10000});
  assert(world.requests.some(r=>!r.pinned),"fallback requests must use the unpinned endpoint");
  assert.equal(world.voted.size,1,"vote must be accepted through the fallback");
 });

 await scenario("recovers by itself after the first load fails (poor connectivity)",{},async({page,world})=>{
  world.failAll=3;
  await page.goto(base+"/live/?code="+code);
  await page.locator("#audience-retry").waitFor({timeout:15000});
  // Connectivity returns; no manual reload is performed.
  await page.locator(".option").first().waitFor({timeout:40000});
  assert.equal(await page.locator("#audience-retry").count(),0,"Retry panel must be replaced by the poll");
  assert.equal(await page.locator("#notice.error").count(),0,"stale error notice must be cleared");
 });

 await scenario("mid-session outage: keeps the form, backs off, then clears the warning",{},async({page,world})=>{
  await page.goto(base+"/live/?code="+code);
  await page.locator(".option").first().waitFor({timeout:15000});
  world.failAll=1000;
  await page.locator("#notice.error").waitFor({timeout:20000});
  const before=world.requests.length;await page.waitForTimeout(12000);
  const during=world.requests.length-before;
  assert(during<=8,"failing polls must back off, saw "+during+" requests in 12s");
  world.failAll=0;
  await page.waitForFunction(()=>!document.querySelector("#notice.error"),null,{timeout:40000});
  assert(await page.locator(".option").count()>=2,"voting form must still be available");
  assert.equal(world.joined,1,"an outage must not create a second registration");
 });

 await scenario("a second tab reuses the same participant instead of taking a new seat",{},async({context,page,world})=>{
  await page.goto(base+"/live/?code="+code);
  await page.locator(".option").first().click();
  await page.getByText("Your answer was received.").first().waitFor({timeout:10000});
  const second=await context.newPage();
  await second.goto(base+"/live/?code="+code);
  await second.getByText("Your answer was received.").first().waitFor({timeout:15000});
  assert.equal(world.joined,1,"rescanning the QR code must not register a second participant");
 });

 await scenario("backend without revision support still works (deploy-order safety)",{},async({page,world})=>{
  world.supportsRev=false;
  await page.goto(base+"/live/?code="+code);
  await page.locator(".option").first().waitFor({timeout:15000});
  world.revision=2;world.state="closed";
  await page.getByText("Voting is not open.").waitFor({timeout:12000});
 });

 await scenario("Arabic RTL audience at 320px has no horizontal overflow",{viewport:{width:320,height:720},lang:"ar"},async({page})=>{
  await page.goto(base+"/live/?code="+code);
  await page.locator(".option").first().waitFor({timeout:15000});
  assert.equal(await page.evaluate(()=>document.documentElement.dir),"rtl");
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,"320px RTL overflow");
  await page.locator(".option").first().click();
  await page.getByText("تم استلام إجابتك.").first().waitFor({timeout:10000});
 });

 await scenario("presenter can open voting on the first question of a fresh session",{viewport:{width:1440,height:900}},async({page,world})=>{
  await page.goto(base+"/live/?session="+sid+"#presenter="+"b".repeat(48));
  await page.locator("#open").waitFor({timeout:15000});
  await page.locator("#open").click();
  await page.waitForFunction(()=>document.getElementById("status")?.textContent==="Voting open",null,{timeout:10000});
  assert.equal(world.controls.length,1);
  assert.equal(world.controls[0].question_id,qid,"opening a fresh session must activate the question shown as selected");
  await page.locator("#question-view .clinical-counter").waitFor({timeout:10000});
 });

 console.log("Tamayuz Live resilience browser QA passed (mocked backend, real Chromium)");
}finally{
 if(browser)await browser.close();
 await new Promise(ok=>server.close(ok));
}
