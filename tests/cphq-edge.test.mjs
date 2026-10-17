import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from '../supabase/functions/_shared/cphq.ts';
const config = { SUPABASE_URL: 'https://example.test', SUPABASE_ANON_KEY: 'public-test-key', SUPABASE_SERVICE_ROLE_KEY: 'server-test-key', CPHQ_ALLOWED_ORIGINS: 'http://localhost:8000' };
const env = k => config[k];
const token = 'a'.repeat(64);
const req = (body, options = {}) => new Request('https://example.test/functions/v1/cphq', { method: 'POST', headers: { Origin: 'https://tamayuz10x.com', 'Content-Type': 'application/json', ...options.headers }, body: JSON.stringify(body), ...options });
const fake = async (url, options) => new Response(JSON.stringify(url.includes('/auth/') ? { id: 'learner-id' } : { remaining: 4 }));
test('CORS preflight accepts production, www and explicit preview; refuses unknown origins', async () => {
 const handler = createHandler('guest', env, fake);
 for (const origin of ['https://tamayuz10x.com','https://www.tamayuz10x.com','http://localhost:8000']) {
  const r = await handler(new Request('https://example.test', {method:'OPTIONS',headers:{Origin:origin}}));
  assert.equal(r.status,204); assert.equal(r.headers.get('access-control-allow-origin'),origin);
  assert.match(r.headers.get('access-control-allow-headers'),/x-client-info/);
 }
 const r=await handler(new Request('https://example.test',{method:'OPTIONS',headers:{Origin:'https://evil.test'}}));
 assert.equal(r.status,403); assert.equal(r.headers.get('access-control-allow-origin'),null);
});
test('rejects invalid method, JSON, action and large requests', async () => {
 const h=createHandler('guest',env,fake);
 assert.equal((await h(new Request('https://example.test'))).status,405);
 for(const body of ['{','null','[]','"text"']) assert.equal((await h(new Request('https://example.test',{method:'POST',body}))).status,400);
 assert.equal((await h(req({action:'export'}))).status,400);
 assert.equal((await h(req({padding:'x'.repeat(5000)}))).status,413);
});
test('strict numeric validation: null, booleans and strings cannot become choices',async()=>{
 const h=createHandler('guest',env,fake);
 for(const value of [null,false,'0',-1,4,0.2]) assert.equal((await h(req({action:'submit',question_id:1,selected_index:value,guest_token:token}))).status,400);
 for(const value of [null,false,'1',0,8,1.2]) assert.equal((await h(req({action:'next',domain:value,guest_token:token}))).status,400);
});
test('guest token is validated, hashed and never forwarded in plaintext',async()=>{
 let received;
 const h=createHandler('guest',env,async(url,options)=>{received=JSON.parse(options.body);return fake(url,options)});
 assert.equal((await h(req({action:'status',guest_token:'bad'}))).status,400);
 const response=await h(req({action:'status',guest_token:token}));
 assert.equal(response.status,200);assert.match(received.p_digest,/^[a-f0-9]{64}$/);assert.notEqual(received.p_digest,token);
 assert.equal(response.headers.get('cache-control'),'no-store');
});
test('registered mode validates the user at auth server before any RPC',async()=>{
 let calls=0;
 const h=createHandler('registered',env,async()=>{calls++;return new Response('{}',{status:401})});
 assert.equal((await h(req({action:'status'}))).status,401);
 assert.equal((await h(req({action:'status'},{headers:{Authorization:'Bearer fake'}}))).status,401);
 assert.equal(calls,1);
});
test('anonymous users cannot claim registered allowance',async()=>{
 const h=createHandler('registered',env,async()=>new Response(JSON.stringify({id:'id',is_anonymous:true})));
 assert.equal((await h(req({action:'status'},{headers:{Authorization:'Bearer anonymous'}}))).status,401);
});
test('valid user JWT reaches registered RPC; server key does not',async()=>{
 let received;
 const h=createHandler('registered',env,async(url,options)=>{if(url.includes('/rpc/')) received={url,options};return fake(url,options)});
 assert.equal((await h(req({action:'next',domain:1},{headers:{Authorization:'Bearer valid'}}))).status,200);
 assert.match(received.url,/cphq_next_registered$/);assert.equal(received.options.headers.Authorization,'Bearer valid');
 assert.equal(received.options.headers.apikey,'public-test-key');
});
test('quota maps to 429, unissued submissions to 409; database errors are sanitized',async()=>{
 for(const [error,status] of [['daily_limit',429],['question_not_delivered',409],['already_answered',409]]) {
  const h=createHandler('guest',env,async()=>new Response(JSON.stringify({error})));
  assert.equal((await h(req({action:'status',guest_token:token}))).status,status);
 }
 const h=createHandler('guest',env,async()=>new Response('sensitive database details',{status:500}));
 const r=await h(req({action:'status',guest_token:token}));assert.equal(r.status,503);assert.doesNotMatch(await r.text(),/sensitive/);
});
test('network failures and missing configuration fail closed',async()=>{
 const h=createHandler('guest',env,async()=>{throw Error('private detail')});
 assert.equal((await h(req({action:'status',guest_token:token}))).status,503);
 assert.equal((await createHandler('guest',()=>'',fake)(req({action:'status',guest_token:token}))).status,503);
});
