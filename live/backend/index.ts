import { createClient } from "npm:@supabase/supabase-js@2.57.0";
const url=Deno.env.get("SUPABASE_URL")!,key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const db=createClient(url,key,{auth:{persistSession:false}});
const headers={"content-type":"application/json","access-control-allow-origin":"*","access-control-allow-headers":"content-type, authorization, apikey","access-control-allow-methods":"POST, OPTIONS","cache-control":"no-store"};
const reply=(v:unknown,status=200)=>new Response(JSON.stringify(v),{status,headers});
const random=(bytes=24)=>Array.from(crypto.getRandomValues(new Uint8Array(bytes))).map(x=>x.toString(16).padStart(2,"0")).join("");
const hash=async(v:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v)))).map(x=>x.toString(16).padStart(2,"0")).join("");
const safe=(s:unknown,n=500)=>typeof s==="string"?s.trim().slice(0,n):"";
async function owner(k:string){if(!/^[a-f0-9]{64}$/.test(k))return false;const {data}=await db.from("live_config").select("id").eq("admin_token_hash",await hash(k)).maybeSingle();return !!data}
async function sessionByToken(id:string,token:string){if(!/^[a-f0-9]{48}$/.test(token))return null;const {data}=await db.from("live_sessions").select("*").eq("id",id).eq("presenter_token_hash",await hash(token)).maybeSingle();return data}
async function state(s:any,results=false){const {data:q}=await db.from("live_questions").select("id,prompt,kind,options,position").eq("presentation_id",s.presentation_id).order("position");let aggregate:any[]=[];let count=0;if(results&&s.active_question_id){const {data:v}=await db.from("live_votes").select("answer").eq("session_id",s.id).eq("question_id",s.active_question_id);count=v?.length||0;const map=new Map<string,number>();for(const x of v||[])map.set(x.answer,(map.get(x.answer)||0)+1);aggregate=[...map].map(([answer,votes])=>({answer,votes}));}return {session:{id:s.id,code:s.join_code,state:s.state,active_question_id:s.active_question_id,show_results:s.show_results,revision:s.revision},questions:q||[],aggregate,count}}
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response(null,{headers});
 if(req.method!=="POST")return reply({error:"Method not allowed"},405);
 try{
  const b=await req.json();const action=safe(b.action,40);const k=safe(b.key,128);
  if(action==="create"){
   
   const title=safe(b.title,180);if(!title)return reply({error:"Title required"},400);
   const token=random();const {data,error}=await db.from("live_presentations").insert({title,locale:b.locale==="ar"?"ar":"en",owner_token_hash:await hash(token)}).select("id,title,locale").single();
   return error?reply({error:"Could not create presentation"},500):reply({presentation:data});
  }
  if(action==="list"){
   
   const {data}=await db.from("live_presentations").select("id,title,locale,created_at").order("created_at",{ascending:false}).limit(100);
   return reply({presentations:data||[]});
  }
  if(action==="add_question"){
   if(!await owner(k))return reply({error:"Unauthorized"},403);
   const pid=safe(b.presentation_id,40),prompt=safe(b.prompt,500),kind=["choice","rating","text"].includes(b.kind)?b.kind:"choice";
   const options=kind==="choice"&&Array.isArray(b.options)?b.options.slice(0,8).map((x:any)=>safe(x,120)).filter(Boolean):[];
   if(!prompt||(kind==="choice"&&options.length<2))return reply({error:"Question or options invalid"},400);
   const {data:existing}=await db.from("live_questions").select("position").eq("presentation_id",pid).order("position",{ascending:false}).limit(1);
   const {data,error}=await db.from("live_questions").insert({presentation_id:pid,prompt,kind,options,position:(existing?.[0]?.position??-1)+1}).select("id").single();
   return error?reply({error:"Cannot add question"},400):reply({question:data});
  }
  if(action==="new_session"){
   if(!await owner(k))return reply({error:"Unauthorized"},403);
   const pid=safe(b.presentation_id,40);const token=random();
   for(let i=0;i<4;i++){const code=random(5).toUpperCase();const {data,error}=await db.from("live_sessions").insert({presentation_id:pid,join_code:code,presenter_token_hash:await hash(token)}).select("id,join_code").single();if(!error)return reply({session:data,presenter_token:token});}
   return reply({error:"Cannot start session"},400);
  }
  if(action==="control"){
   const id=safe(b.session_id,40),token=safe(b.presenter_token,128);
   
   const {data:s}=await db.from("live_sessions").select("*").eq("id",id).single();if(!s)return reply({error:"Not found"},404);
   const next=safe(b.state,20);if(!["waiting","open","closed","ended"].includes(next))return reply({error:"Invalid state"},400);
   let active=s.active_question_id;if(b.question_id){const {data:q}=await db.from("live_questions").select("id").eq("id",b.question_id).eq("presentation_id",s.presentation_id).maybeSingle();if(!q)return reply({error:"Invalid question"},400);active=q.id;}
   const {data,error}=await db.from("live_sessions").update({state:next,active_question_id:active,show_results:!!b.show_results,revision:s.revision+1}).eq("id",id).eq("revision",s.revision).select("*").maybeSingle();
   return error||!data?reply({error:"Concurrent update; retry after refresh"},409):reply(await state(data,true));
  }
  if(action==="present"){
   const id=safe(b.session_id,40),token=safe(b.presenter_token,128);
   const s=await sessionByToken(id,token);
   
   const {data:current}=s?{data:s}:await db.from("live_sessions").select("*").eq("id",id).maybeSingle();
   return current?reply(await state(current,true)):reply({error:"Not found"},404);
  }
  if(action==="view"||action==="join"){
   const code=safe(b.code,20).toUpperCase();const {data:s}=await db.from("live_sessions").select("*").eq("join_code",code).maybeSingle();
   if(!s)return reply({error:"Session not found"},404);
   if(action==="view"){const snapshot=await state(s,s.show_results);return reply({session:snapshot.session,questions:snapshot.questions.filter((q:any)=>q.id===s.active_question_id),aggregate:s.show_results?snapshot.aggregate:[],count:s.show_results?snapshot.count:null});}
   if(s.state==="ended")return reply({error:"Session ended"},409);
   const token=random();const {count}=await db.from("live_participants").select("id",{count:"exact",head:true}).eq("session_id",s.id);
   if((count||0)>=600)return reply({error:"Session capacity reached"},429);
   const {error}=await db.from("live_participants").insert({session_id:s.id,token_hash:await hash(token)});
   return error?reply({error:"Cannot join"},500):reply({participant_token:token,session_id:s.id});
  }
  if(action==="vote"){
   const code=safe(b.code,20).toUpperCase();const token=safe(b.participant_token,128);
   if(!/^[a-f0-9]{48}$/.test(token))return reply({error:"Invalid participant"},403);
   const {data:s}=await db.from("live_sessions").select("*").eq("join_code",code).maybeSingle();
   if(!s||s.state!=="open"||!s.active_question_id)return reply({error:"Voting closed"},409);
   const {data:p}=await db.from("live_participants").select("id").eq("session_id",s.id).eq("token_hash",await hash(token)).maybeSingle();if(!p)return reply({error:"Invalid participant"},403);
   const {data:q}=await db.from("live_questions").select("*").eq("id",s.active_question_id).single();if(!q)return reply({error:"Question missing"},404);
   const answer=safe(b.answer,400);
   if(!answer||q.kind==="choice"&&!(q.options||[]).includes(answer)||q.kind==="rating"&&!["1","2","3","4","5"].includes(answer))return reply({error:"Invalid answer"},400);
   const {error}=await db.from("live_votes").insert({session_id:s.id,question_id:q.id,participant_id:p.id,answer});
   if(error?.code==="23505")return reply({accepted:true,duplicate:true});
   return error?reply({error:"Vote not accepted"},409):reply({accepted:true});
  }
  return reply({error:"Unknown action"},400);
 }catch(_){return reply({error:"Invalid request"},400)}
});