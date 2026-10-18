// Browser behavior uses synthetic fixtures; live API/auth checks are separate.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root=resolve('.'), port=8173, base=`http://127.0.0.1:${port}`;
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,base).pathname);
  const path=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
  if(!path.startsWith(root+'/'))throw Error();
  const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp'};
  res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(await readFile(path));
 }catch{res.statusCode=404;res.end('Not found')}
});
await new Promise(r=>server.listen(port,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
await mkdir('test-results/cphq',{recursive:true});
const reports=[];
try{
 for(const [name,width,height]of [['desktop',1440,1000],['mobile',390,844],['small-mobile',320,720]]){
  const context=await browser.newContext({viewport:{width,height}});
  let records=[],pending=null,serial=0,submitCalls=0;
  const errors=[];
  await context.route('**/assets/js/assessment-auth-client.js',route=>route.fulfill({contentType:'text/javascript',body:`
    const listeners=[];
    const read=()=>JSON.parse(localStorage.getItem('qa-session')||'null');
    export const authConfigured=()=>true;
    export const safeNext=raw=>raw&&raw.startsWith('/')&&!raw.startsWith('//')?raw:'/personality.html';
    export async function createAuthClient(){return {auth:{
      getSession:async()=>({data:{session:read()},error:null}),
      onAuthStateChange:fn=>{listeners.push(fn);return{data:{subscription:{unsubscribe(){}}}}},
      signInWithPassword:async({email,password})=>{if(password!=='qa-valid-password')return{error:{message:'Invalid login'}};
        const session={user:{id:'qa-user',email},access_token:'qa-not-a-real-token'};localStorage.setItem('qa-session',JSON.stringify(session));listeners.forEach(f=>f('SIGNED_IN',session));return{data:{session},error:null}},
      signOut:async()=>{localStorage.removeItem('qa-session');listeners.forEach(f=>f('SIGNED_OUT',null));return{error:null}}
    }}};
  `}));
  await context.route('https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/cphq-*',async route=>{
    const req=route.request(),isGuest=req.url().endsWith('cphq-guest');
    const headers={'Access-Control-Allow-Origin':base,'Access-Control-Allow-Headers':'authorization,content-type','Access-Control-Allow-Methods':'POST,OPTIONS'};
    const respond=(body,status=200)=>route.fulfill({status,contentType:'application/json',headers,body:JSON.stringify(body)});
    if(req.method()==='OPTIONS')return route.fulfill({status:204,headers});
    const data=req.postDataJSON(),cap=isGuest?5:20,remaining=cap-records.length;
    if(data.action==='status')return respond({limit:cap,remaining,delivered:records.length,answered:records.filter(x=>x.done).length,domains:Array.from({length:7},(_,i)=>({domain:i+1,available:7,published:7}))});
    if(data.action==='next'){
      if(pending)return respond({...pending,remaining});
      if(remaining<=0)return respond({error:'daily_limit',remaining:0},429);
      pending={id:++serial,domain:data.domain,task:'Synthetic test task',question:'Which action best supports the synthetic test scenario?',options:['Test option A','Test option B','Test option C','Test option D']};
      records.push({id:pending.id,done:false});return respond({...pending,remaining:remaining-1});
    }
    if(data.action==='submit'){
      submitCalls++;assert(pending&&pending.id===data.question_id);records.find(x=>x.id===pending.id).done=true;pending=null;
      return respond({correct_index:0,is_correct:data.selected_index===0,rationales:['Synthetic explanation A','Synthetic explanation B','Synthetic explanation C','Synthetic explanation D'],lesson:'Synthetic learning point',remaining:cap-records.length});
    }
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const overflow=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${name}: horizontal overflow at ${page.url()}`);
  await page.goto(base+'/cphq.html');await page.getByRole('link',{name:'Open the free learning center'}).click();
  await page.waitForURL('**/cphq-free.html');await overflow();
  assert.equal(await page.locator('table tbody tr').count(),7);
  await page.waitForFunction(()=>document.querySelector('#bank-availability').textContent.startsWith('49 practice questions'));
  assert.deepEqual(await page.locator('[data-domain-count]').allTextContents(),Array(7).fill('7'));
  await page.screenshot({path:`test-results/cphq/${name}-landing.png`,fullPage:true});
  await page.getByRole('link',{name:'Start guest practice'}).click();
  await page.waitForFunction(()=>document.querySelector('#progress').textContent.includes('5 of 5'));
  await page.locator('#next').click();await page.locator('legend').waitFor();
  assert.equal(await page.locator('#feedback').textContent(),'');assert(await page.locator('#next').isDisabled());assert(await page.locator('#domain').isDisabled());
  await overflow();await page.reload();await page.locator('legend').waitFor();assert.equal(records.length,1);
  for(let i=0;i<5;i++){
   if(i){await page.locator('.continue-button').click();await page.locator('legend').waitFor();}
   await page.locator('input[name="answer"]').first().check();await page.getByRole('button',{name:'Submit answer',exact:true}).click();
   await page.getByRole('heading',{name:'Key learning'}).waitFor();assert.equal(await page.locator('.explain').count(),4);await overflow();
  }
  assert.equal(submitCalls,5);assert.equal(records.length,5);assert(await page.locator('.continue-button').isDisabled());
  await page.screenshot({path:`test-results/cphq/${name}-feedback.png`,fullPage:true});
  await page.locator('#next').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('allowance is complete'));
  await page.reload();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('allowance is complete'));
  await page.goto(base+'/cphq-registered.html');await page.getByText('Sign in with your existing account', {exact:false}).waitFor();
  assert(await page.locator('#learning').isHidden());
  await page.getByRole('link',{name:'Sign in',exact:true}).click();await page.waitForURL('**/account/login.html?**');await overflow();
  assert(new URL(await page.locator('#registerLink').getAttribute('href'),base).searchParams.get('next')==='/cphq-registered.html');
  await page.locator('#email').fill('qa@tests.invalid');await page.locator('#password').fill('invalid-password');await page.locator('#submit').click();
  await page.getByText('Sign-in failed.',{exact:false}).waitFor();
  records=[];pending=null;
  await page.locator('#password').fill('qa-valid-password');await page.locator('#submit').click();
  await page.waitForURL('**/cphq-registered.html');await page.waitForFunction(()=>document.querySelector('#progress').textContent.includes('20 of 20'));
  await page.locator('#next').click();await page.locator('legend').waitFor();
  await page.locator('input[name="answer"]').nth(1).check();await page.getByRole('button',{name:'Submit answer',exact:true}).click();
  await page.getByRole('heading',{name:'Review the correct answer'}).waitFor();assert.equal(await page.locator('.explain').count(),4);
  await page.locator('#signout').click();await page.getByText('Sign in with your existing account',{exact:false}).waitFor();assert(await page.locator('#learning').isHidden());assert.equal(await page.locator('#question').textContent(),'');
  assert.deepEqual(errors,[],name+' runtime errors');reports.push({viewport:name,passed:true});console.log(name+': PASS (landing, five guest questions, quota, reload, sign-in return, registered answer, sign-out, no overflow)');await context.close();
 }
}finally{await browser.close();await new Promise(r=>server.close(r));}
console.log('CPHQ browser suite: PASS');
