// Isolated synthetic Live UX test. No requests reach the production Edge Function.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { chromium } from "playwright";

const root=resolve("."),port=8174,base="http://127.0.0.1:"+port;
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,base).pathname);
  const file=resolve(root,"."+(pathname.endsWith("/")?pathname+"index.html":pathname));
  if(!file.startsWith(root+"/"))throw Error("invalid path");
  const mime={".html":"text/html",".js":"text/javascript",".css":"text/css"};
  res.setHeader("Content-Type",mime[extname(file)]||"application/octet-stream");
  res.end(await readFile(file));
 }catch{res.statusCode=404;res.end("Not found")}
});
await new Promise(ok=>server.listen(port,"127.0.0.1",ok));
let browser;
try{
 browser=await chromium.launch({headless:true});
 const code="ABCDEF1234",sid="11111111-1111-4111-8111-111111111111",qid="22222222-2222-4222-8222-222222222222";
 const question={id:qid,prompt:"Synthetic clinical case: what should be done?",kind:"choice",options:["Treatment A","Treatment B"],position:0};
 for(const viewport of [{width:1440,height:900},{width:320,height:720}]){
  const context=await browser.newContext({viewport});
  let joined=0,token="",voted=false,reveal=false,sessionListCalls=0;
  const pageErrors=[];
  await context.route("**/assets/js/assessment-auth-client.js",route=>route.fulfill({
   contentType:"text/javascript",
   body:"export async function createAuthClient(){return {auth:{getSession:async()=>({data:{session:null},error:null})}}}"
  }));
  await context.route("https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/tamayuz-live",route=>{
   const req=route.request(),headers={
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Headers":"content-type,authorization,apikey",
    "Access-Control-Allow-Methods":"POST,OPTIONS"
   };
   const send=(value,status=200)=>route.fulfill({status,headers,contentType:"application/json",body:JSON.stringify(value)});
   if(req.method()==="OPTIONS")return route.fulfill({status:204,headers});
   const b=req.postDataJSON();
   if(b.action==="list"||b.action==="list_sessions"){sessionListCalls++;return send({error:"Owner authorization required"},403)}
   if(b.action==="join"){
    joined++;token=joined.toString(16).padStart(48,"a");
    return send({participant_token:token,session_id:sid});
   }
   if(b.action==="view"){
    const valid=b.participant_token===token;
    return send({
     session:{id:sid,code,state:"open",active_question_id:qid,show_results:reveal,reveal_correct_answer:reveal,revision:1},
     voted:valid&&voted,participant_valid:valid,
     questions:[reveal?{...question,correct_answer:"Treatment A",answer_justification:"Synthetic explanation after reveal",answer_effect:"Synthetic learning effect"}:question],
     aggregate:[],count:null
    });
   }
   if(b.action==="vote"){
    if(b.participant_token!==token)return send({error:"Invalid participant"},403);
    voted=true;return send({accepted:true});
   }
   if(b.action==="present"){
    return send({
     session:{id:sid,code,state:"open",active_question_id:qid,show_results:true,reveal_correct_answer:false,revision:1},
     questions:[{...question,correct_answer:"Treatment A",answer_justification:"Synthetic explanation"}],
     aggregate:[],count:0
    });
   }
   return send({error:"Unknown action"},400);
  });
  const page=await context.newPage();page.on("pageerror",e=>pageErrors.push(e.message));
  await page.goto(base+"/live/");
  await page.locator("#presenter-mode").click();
  await page.locator("#presenter-link").waitFor();
  assert.equal(sessionListCalls,0,"Presenter entry must not enumerate session codes");
  await page.goto(base+"/live/?presenter_mode=1");
  await page.locator("#presenter-link").waitFor();
  assert.equal(sessionListCalls,0,"Presenter deep-link must stay private");

  await page.goto(base+"/live/?code="+code);
  await page.locator(".option").first().waitFor({timeout:15000});
  assert.equal(await page.locator(".answer-explanation").count(),0,"Hidden answer must not leak");
  await page.locator(".option").first().click();
  await page.getByText("Your answer was received.").first().waitFor({timeout:10000});
  reveal=true;
  await page.getByText("Synthetic explanation after reveal").waitFor({timeout:12000});
  assert.equal(await page.locator(".answer-explanation").count(),1,"Revealed explanation must be visible");

  // Model an owner Reset: old participant token and old local vote flags are invalid.
  const oldToken=token;
  token="";voted=false;reveal=false;
  await page.locator(".option").first().waitFor({timeout:15000});
  assert(joined>=2,"Audience must rejoin after reset");
  const fresh=await page.evaluate(key=>sessionStorage.getItem(key),"live-participant-"+code);
  assert(fresh&&fresh!==oldToken,"Reset must replace invalidated participant registration");
  await page.locator(".option").first().click();
  await page.getByText("Your answer was received.").first().waitFor();
  if(viewport.width===320){
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,"320px audience overflow");
  }

  await page.goto(base+"/live/?session="+sid+"#presenter="+("b".repeat(48)));
  await page.locator("#stage-widescreen").waitFor({timeout:15000});
  await page.locator("#stage-widescreen").click();
  assert(await page.locator("#presenter-root").evaluate(el=>el.classList.contains("widescreen")),"Widescreen toggle works");
  assert.deepEqual(pageErrors,[],"Unexpected browser script errors");
  await context.close();
 }
 console.log("Tamayuz Live synthetic browser QA passed (desktop, 320px, presenter, audience, reveal, reset)");
}finally{
 if(browser)await browser.close();
 await new Promise(ok=>server.close(ok));
}
