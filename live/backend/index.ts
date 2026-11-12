import { createClient } from "npm:@supabase/supabase-js@2.57.0";
const url=Deno.env.get("SUPABASE_URL")!,key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const db=createClient(url,key,{auth:{persistSession:false}});
const headers={"content-type":"application/json","access-control-allow-origin":"*","access-control-allow-headers":"content-type, authorization, apikey","access-control-allow-methods":"POST, OPTIONS","cache-control":"no-store"};
const reply=(v:unknown,status=200)=>new Response(JSON.stringify(v),{status,headers});
const random=(bytes=24)=>Array.from(crypto.getRandomValues(new Uint8Array(bytes))).map(x=>x.toString(16).padStart(2,"0")).join("");
const hash=async(v:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v)))).map(x=>x.toString(16).padStart(2,"0")).join("");
const safe=(s:unknown,n=500)=>typeof s==="string"?s.trim().slice(0,n):"";
async function owner(req:Request){const match=/^Bearer\s+(.+)$/i.exec(req.headers.get("authorization")||"");if(!match)return false;const {data,error}=await db.auth.getUser(match[1]);if(error||!data.user)return false;const {data:allowed}=await db.from("live_owner_accounts").select("user_id").eq("user_id",data.user.id).maybeSingle();return !!allowed}
async function sessionByToken(id:string,token:string){if(!/^[a-f0-9]{48}$/.test(token))return null;const {data}=await db.from("live_sessions").select("*").eq("id",id).eq("presenter_token_hash",await hash(token)).maybeSingle();return data}
async function state(s:any,results=false){const {data:q}=await db.from("live_questions").select("id,prompt,kind,options,position,correct_answer,answer_justification,answer_effect").eq("presentation_id",s.presentation_id).order("position");let aggregate:any[]=[];let count=0;if(results&&s.active_question_id){const map=new Map<string,number>();for(let offset=0;offset<60000;offset+=1000){const {data:v,error}=await db.from("live_votes").select("answer").eq("session_id",s.id).eq("question_id",s.active_question_id).order("id").range(offset,offset+999);if(error)throw error;for(const x of v||[]){count++;map.set(x.answer,(map.get(x.answer)||0)+1)}if(!v||v.length<1000)break;}aggregate=[...map].map(([answer,votes])=>({answer,votes}));}return {session:{id:s.id,code:s.join_code,state:s.state,active_question_id:s.active_question_id,show_results:s.show_results,reveal_correct_answer:s.reveal_correct_answer,revision:s.revision},questions:q||[],aggregate,count}}
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response(null,{headers});
 if(req.method!=="POST")return reply({error:"Method not allowed"},405);
 try{
  const b=await req.json();const action=safe(b.action,40);const k=safe(b.key,128);
  if(action==="owner_status"){const auth=req.headers.get("authorization")||"";const match=/^Bearer\s+(.+)$/i.exec(auth);if(!match)return reply({owner:false,reason:"missing_login_token"});const {data,error}=await db.auth.getUser(match[1]);if(error||!data.user)return reply({owner:false,reason:"login_token_invalid"});const {data:allowed,error:lookupError}=await db.from("live_owner_accounts").select("user_id").eq("user_id",data.user.id).maybeSingle();return reply({owner:!!allowed,reason:lookupError?"owner_check_failed":allowed?"authorized":"account_not_on_owner_list"});}
  if(action==="create"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   
   const title=safe(b.title,180);if(!title)return reply({error:"Title required"},400);
   const token=random();const {data,error}=await db.from("live_presentations").insert({title,locale:b.locale==="ar"?"ar":"en",owner_token_hash:await hash(token)}).select("id,title,locale").single();
   return error?reply({error:"Could not create presentation"},500):reply({presentation:data});
  }
  if(action==="list"){
   
   const {data}=await db.from("live_presentations").select("id,title,locale,created_at").order("created_at",{ascending:false}).limit(100);
   return reply({presentations:data||[]});
  }
  if(action==="review_results"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const id=safe(b.session_id,40);
   const {data:s}=await db.from("live_sessions").select("id,presentation_id,join_code").eq("id",id).maybeSingle();
   if(!s)return reply({error:"Session not found"},404);
   const {data:questions,error:qe}=await db.from("live_questions").select("id,prompt,kind,options,position").eq("presentation_id",s.presentation_id).order("position");
   if(qe)return reply({error:"Could not load questions"},500);
   const {data:votes,error:ve}=await db.from("live_votes").select("question_id,answer").eq("session_id",id).limit(10000);
   if(ve)return reply({error:"Could not load votes"},500);
   const summary=(questions||[]).map(q=>{const rows=(votes||[]).filter(v=>v.question_id===q.id);const counts=new Map<string,number>();for(const v of rows)counts.set(v.answer,(counts.get(v.answer)||0)+1);const labels=q.kind==="choice"?(q.options||[]):q.kind==="rating"?["1","2","3","4","5"]:[...counts.keys()];return {id:q.id,prompt:q.prompt,position:q.position,kind:q.kind,total:rows.length,answers:labels.map((label:string)=>({label,votes:counts.get(label)||0}))}});
   return reply({code:s.join_code,questions:summary});
  }
  if(["rename_presentation","delete_presentation","rename_session","delete_session"].includes(action)){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const id=safe(b.presentation_id||b.session_id,40);
   if(!/^[a-f0-9-]{36}$/.test(id))return reply({error:"Invalid ID"},400);
   if(action==="rename_presentation"){
    const title=safe(b.title,140);
    if(!title)return reply({error:"Presentation title is required"},400);
    const {data,error}=await db.from("live_presentations").update({title}).eq("id",id).select("id,title").maybeSingle();
    return error||!data?reply({error:"Could not rename presentation"},400):reply({presentation:data});
   }
   if(action==="rename_session"){
    const label=safe(b.label,100);
    if(!label)return reply({error:"Session name is required"},400);
    const {data,error}=await db.from("live_sessions").update({label}).eq("id",id).select("id,label").maybeSingle();
    return error||!data?reply({error:"Could not rename session"},400):reply({session:data});
   }
   if(action==="delete_session"){
    const {data,error}=await db.from("live_sessions").delete().eq("id",id).select("id").maybeSingle();
    return error||!data?reply({error:"Could not delete session"},400):reply({deleted:true});
   }
   const {data,error}=await db.from("live_presentations").delete().eq("id",id).select("id").maybeSingle();
   return error||!data?reply({error:"Could not delete presentation"},400):reply({deleted:true});
  }
  if(action==="list_sessions"){
   const {data,error}=await db.from("live_sessions").select("id,join_code,state,presentation_id,created_at,label").order("created_at",{ascending:false}).limit(100);
   return error?reply({error:"Could not list sessions"},500):reply({sessions:data||[]});
  }
  if(action==="add_question"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   
   const pid=safe(b.presentation_id,40),prompt=safe(b.prompt,6000),kind=["choice","rating","text"].includes(b.kind)?b.kind:"choice";
   const options=kind==="choice"&&Array.isArray(b.options)?b.options.slice(0,8).map((x:any)=>safe(x,120)).filter(Boolean):[];
   if(!prompt||(kind==="choice"&&options.length<2))return reply({error:"Question or options invalid"},400);
   const {data:existing}=await db.from("live_questions").select("position").eq("presentation_id",pid).order("position",{ascending:false}).limit(1);
   const {data,error}=await db.from("live_questions").insert({presentation_id:pid,prompt,kind,options,position:(existing?.[0]?.position??-1)+1}).select("id").single();
   return error?reply({error:"Cannot add question"},400):reply({question:data});
  }
  if(action==="list_questions"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const pid=safe(b.presentation_id,40);
   const {data,error}=await db.from("live_questions").select("id,prompt,kind,options,position,correct_answer,answer_justification,answer_effect").eq("presentation_id",pid).order("position");
   return error?reply({error:"Cannot list questions"},400):reply({questions:data||[]});
  }
  if(action==="update_question"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const id=safe(b.question_id,40),pid=safe(b.presentation_id,40),prompt=safe(b.prompt,6000);
   if(!prompt)return reply({error:"Question cannot be empty"},400);
   const {data:old}=await db.from("live_questions").select("id,kind,options,correct_answer").eq("id",id).eq("presentation_id",pid).maybeSingle();
   if(!old)return reply({error:"Question not found"},404);
   const patch:any={prompt};
   if(b.options!==undefined){
    if(old.kind!=="choice"||!Array.isArray(b.options))return reply({error:"Options not supported for this question"},400);
    const options=b.options.slice(0,8).map((x:any)=>safe(x,400)).filter(Boolean);
    if(options.length<2||new Set(options).size!==options.length)return reply({error:"At least two distinct options required"},400);
    const {count,error:voteError}=await db.from("live_votes").select("id",{count:"exact",head:true}).eq("question_id",id);
    if(voteError)return reply({error:"Cannot check existing votes"},500);
    if((count||0)>0&&JSON.stringify(options)!==JSON.stringify(old.options||[]))return reply({error:"Options cannot change after votes have been recorded"},409);
    patch.options=options;
   }
   if(b.correct_answer!==undefined){
    const answer=safe(b.correct_answer,400);
    if(answer&&!(patch.options||old.options||[]).includes(answer))return reply({error:"Correct answer must match an option"},400);
    patch.correct_answer=answer||null;
   }else if(patch.options&&old.correct_answer&&!patch.options.includes(old.correct_answer))return reply({error:"Select a correct answer from the updated options"},400);
   if(b.answer_justification!==undefined)patch.answer_justification=safe(b.answer_justification,6000);
   if(b.answer_effect!==undefined)patch.answer_effect=safe(b.answer_effect,6000);
   const {data,error}=await db.from("live_questions").update(patch).eq("id",id).eq("presentation_id",pid).select("id").maybeSingle();
   return error?reply({error:"Cannot update question"},400):!data?reply({error:"Question not found"},404):reply({question:data});
  }
  if(action==="reorder_questions"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const pid=safe(b.presentation_id,40),ids=b.question_ids;
   if(!Array.isArray(ids)||ids.length<1||ids.length>100||ids.some((x:any)=>typeof x!=="string")||new Set(ids).size!==ids.length)return reply({error:"Invalid question order"},400);
   const {data:existing,error:readError}=await db.from("live_questions").select("id,position").eq("presentation_id",pid);
   if(readError||!existing||existing.length!==ids.length||existing.some((x:any)=>!ids.includes(x.id)))return reply({error:"Question list has changed. Refresh and retry."},409);
   // Temporary unique-free positions avoid collisions with old positions during reordering.
   const tempBase=Math.max(10000,...existing.map((x:any)=>x.position+1000));
   for(let i=0;i<ids.length;i++){const {error}=await db.from("live_questions").update({position:tempBase+i}).eq("id",ids[i]).eq("presentation_id",pid);if(error)return reply({error:"Could not reorder questions"},500);}
   for(let i=0;i<ids.length;i++){const {error}=await db.from("live_questions").update({position:i}).eq("id",ids[i]).eq("presentation_id",pid);if(error)return reply({error:"Could not finalize question order"},500);}
   return reply({reordered:true});
  }
  if(action==="presentation_workspace"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const pid=safe(b.presentation_id,40);
   const {data:p}=await db.from("live_presentations").select("id,title,locale").eq("id",pid).maybeSingle();
   if(!p)return reply({error:"Presentation not found"},404);
   const {data:sessions,error}=await db.from("live_sessions").select("id,join_code,state,created_at,active_question_id,show_results,label").eq("presentation_id",pid).order("created_at",{ascending:false}).limit(50);
   if(error)return reply({error:"Could not load sessions"},500);
   return reply({presentation:p,sessions:sessions||[]});
  }
  if(action==="track_interaction"){
   const code=safe(b.code,20).toUpperCase(),token=safe(b.participant_token,128),event=safe(b.event_type,30),qid=safe(b.question_id,40);
   if(!["question_view","answer_click"].includes(event)||!/^[a-f0-9]{48}$/.test(token))return reply({error:"Invalid interaction"},400);
   const {data:s}=await db.from("live_sessions").select("id,active_question_id,state").eq("join_code",code).maybeSingle();
   if(!s||s.state==="ended"||s.active_question_id!==qid)return reply({accepted:false});
   const {data:p}=await db.from("live_participants").select("id").eq("session_id",s.id).eq("token_hash",await hash(token)).maybeSingle();
   if(!p)return reply({error:"Invalid participant"},403);
   const {count}=await db.from("live_interaction_events").select("id",{count:"exact",head:true}).eq("participant_id",p.id).eq("question_id",qid).eq("event_type",event);
   if((count||0)>=8)return reply({accepted:false});
   const {error}=await db.from("live_interaction_events").insert({session_id:s.id,question_id:qid,participant_id:p.id,event_type:event});
   return error?reply({accepted:false}):reply({accepted:true});
  }
  if(action==="session_analytics"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const pid=safe(b.presentation_id,40),sid=safe(b.session_id,40);
   const {data:s}=await db.from("live_sessions").select("id,join_code,presentation_id,state,created_at").eq("id",sid).eq("presentation_id",pid).maybeSingle();
   if(!s)return reply({error:"Session not found"},404);
   const {data:questions}=await db.from("live_questions").select("id,prompt,position,kind,options,correct_answer").eq("presentation_id",pid).order("position");
   const counts=new Map<string,Map<string,number>>(),voters=new Map<string,Set<string>>();let total=0,correctVotes=0,gradedVotes=0;
   for(let offset=0;offset<100000;offset+=1000){
    const {data:v,error}=await db.from("live_votes").select("question_id,answer,participant_id,created_at").eq("session_id",sid).order("id").range(offset,offset+999);
    if(error)return reply({error:"Could not load votes"},500);
    for(const row of v||[]){
     total++;if(!counts.has(row.question_id))counts.set(row.question_id,new Map());const m=counts.get(row.question_id)!;m.set(row.answer,(m.get(row.answer)||0)+1);
     if(!voters.has(row.question_id))voters.set(row.question_id,new Set());if(row.participant_id)voters.get(row.question_id)!.add(row.participant_id);
    }
    if(!v||v.length<1000)break;
   }
   const {count:participants}=await db.from("live_participants").select("id",{count:"exact",head:true}).eq("session_id",sid);
   const events:any[]=[];
   for(let offset=0;offset<50000;offset+=1000){
    const {data:batch,error}=await db.from("live_interaction_events").select("event_type,question_id,participant_id,created_at").eq("session_id",sid).order("id").range(offset,offset+999);
    if(error)break;
    events.push(...(batch||[]));if(!batch||batch.length<1000)break;
   }
   const views=events.filter(e=>e.event_type==="question_view"),clicks=events.filter(e=>e.event_type==="answer_click");
   const uniqueViews=new Set(views.map(e=>e.participant_id+":"+e.question_id));
   const times:number[]=[];const firstView=new Map<string,number>();
   for(const e of views){const key=e.participant_id+":"+e.question_id,ms=Date.parse(e.created_at);if(!firstView.has(key)||ms<firstView.get(key)!)firstView.set(key,ms);}
   // Only count timing for future votes with a recorded question view.
   for(let offset=0;offset<100000;offset+=1000){
    const {data:v,error}=await db.from("live_votes").select("question_id,participant_id,created_at").eq("session_id",sid).order("id").range(offset,offset+999);
    if(error)break;
    for(const row of v||[]){const key=row.participant_id+":"+row.question_id,view=firstView.get(key),duration=view===undefined?NaN:(Date.parse(row.created_at)-view)/1000;if(Number.isFinite(duration)&&duration>=0&&duration<=3600)times.push(duration);}
    if(!v||v.length<1000)break;
   }
   const rows=(questions||[]).map((q:any)=>{
    const m=counts.get(q.id)||new Map<string,number>(),n=[...m.values()].reduce((a:number,b:number)=>a+b,0);
    const answer=typeof q.correct_answer==="string"?q.correct_answer:"",hasKey=!!answer&&q.kind==="choice"&&(q.options||[]).includes(answer);
    const right=hasKey?(m.get(answer)||0):null;if(hasKey){correctVotes+=right!;gradedVotes+=n;}
    return {id:q.id,position:q.position,prompt:q.prompt,kind:q.kind,total:n,respondents:voters.get(q.id)?.size||0,correct_votes:right,accuracy:hasKey&&n>0?Math.round(100*right!/n):null,answers:(q.kind==="choice"?q.options:q.kind==="rating"?["1","2","3","4","5"]:[...m.keys()]).map((label:string)=>({label,votes:m.get(label)||0}))};
   });
   return reply({session:s,participants:participants||0,total_votes:total,graded_votes:gradedVotes,correct_votes:correctVotes,overall_accuracy:gradedVotes?Math.round(100*correctVotes/gradedVotes):null,question_views:views.length,unique_question_views:uniqueViews.size,answer_clicks:clicks.length,average_response_seconds:times.length?Math.round(times.reduce((a,b)=>a+b,0)/times.length*10)/10:null,timed_responses:times.length,tracking_started:true,questions:rows});
  }
  if(action==="reset_session_votes"){
   const id=safe(b.session_id,40),key=safe(b.key,128);
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const {data:s}=await db.from("live_sessions").select("id,revision").eq("id",id).maybeSingle();
   if(!s)return reply({error:"Session not found"},404);
   // Clear interactions first, then votes and participant registrations.
   for(const table of ["live_interaction_events","live_votes","live_participants"]){
    const {error}=await db.from(table).delete().eq("session_id",id);
    if(error)return reply({error:"Could not reset "+table},500);
   }
   const {data:updated,error}=await db.from("live_sessions").update({state:"waiting",active_question_id:null,show_results:false,reveal_correct_answer:false,question_results_visibility:{},revision:s.revision+1}).eq("id",id).eq("revision",s.revision).select("id,state,revision").maybeSingle();
   if(error||!updated)return reply({error:"Could not finalize reset; refresh and retry"},409);
   return reply({reset:true,session:updated});
  }
  if(action==="new_session"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   
   const pid=safe(b.presentation_id,40);const token=random();
   for(let i=0;i<4;i++){const code=random(5).toUpperCase();const {data,error}=await db.from("live_sessions").insert({presentation_id:pid,join_code:code,presenter_token_hash:await hash(token)}).select("id,join_code").single();if(!error)return reply({session:data,presenter_token:token});}
   return reply({error:"Cannot start session"},400);
  }
  if(action==="reactivate_session"){
   const id=safe(b.session_id,40),token=safe(b.presenter_token,128),key=safe(b.key,128);
   // Require owner login or the private presenter token.
   const presenterSession=await sessionByToken(id,token);
   if(!presenterSession&&!(await owner(req)))return reply({error:"Presenter authorization required"},403);
   const authorized=presenterSession||((await db.from("live_sessions").select("*").eq("id",id).maybeSingle()).data);
   if(!authorized)return reply({error:"Session not found"},404);
   if(authorized.state!=="ended")return reply({error:"Only ended sessions can be reactivated"},409);
   const {data,error}=await db.from("live_sessions").update({state:"open",show_results:false,reveal_correct_answer:false,revision:authorized.revision+1}).eq("id",id).eq("revision",authorized.revision).eq("state","ended").select("*").maybeSingle();
   return error||!data?reply({error:"Concurrent update; refresh and retry"},409):reply(await state(data,true));
  }
  if(action==="control"){
   const id=safe(b.session_id,40),token=safe(b.presenter_token,128);
   if(!(await sessionByToken(id,token))&&!(await owner(req)))return reply({error:"Presenter authorization required"},403);
   const {data:s}=await db.from("live_sessions").select("*").eq("id",id).single();if(!s)return reply({error:"Not found"},404);
   const next=safe(b.state,20);if(!["waiting","open","closed","ended"].includes(next))return reply({error:"Invalid state"},400);
   let active=s.active_question_id;if(b.question_id){const {data:q}=await db.from("live_questions").select("id").eq("id",b.question_id).eq("presentation_id",s.presentation_id).maybeSingle();if(!q)return reply({error:"Invalid question"},400);active=q.id;}
   let visibility={...(s.question_results_visibility||{})};if(b.results_action==="show")visibility={__default:true};else if(b.results_action==="hide")visibility={__default:false};else if(Object.keys(visibility).length===0)visibility={__default:!!s.show_results};const visible=visibility[active]===undefined?visibility.__default===true:visibility[active]===true;
   const answerRevealed=b.answer_action==="show"?true:b.answer_action==="hide"?false:(active===s.active_question_id?!!s.reveal_correct_answer:false);
   if(active!==s.active_question_id){visibility={__default:false};}
   const effectiveVisible=active!==s.active_question_id?false:(b.answer_action==="show"?true:b.answer_action==="hide"?false:visible);
   const {data,error}=await db.from("live_sessions").update({state:next,active_question_id:active,show_results:effectiveVisible,reveal_correct_answer:answerRevealed,question_results_visibility:visibility,revision:s.revision+1}).eq("id",id).eq("revision",s.revision).select("*").maybeSingle();
   return error||!data?reply({error:"Concurrent update; retry after refresh"},409):reply(await state(data,true));
  }
  if(action==="present"){
   const id=safe(b.session_id,40),token=safe(b.presenter_token,128);
   const s=await sessionByToken(id,token);
   if(!s&&!(await owner(req)))return reply({error:"Presenter authorization required"},403);
   const {data:current}=s?{data:s}:await db.from("live_sessions").select("*").eq("id",id).maybeSingle();
   return current?reply(await state(current,true)):reply({error:"Not found"},404);
  }
  if(action==="view"||action==="join"){
   const code=safe(b.code,20).toUpperCase();const {data:s}=await db.from("live_sessions").select("*").eq("join_code",code).maybeSingle();
   if(!s)return reply({error:"Session not found"},404);
   if(action==="view"){
    const token=safe(b.participant_token,128);
    let voted=false;
    if(s.active_question_id&&/^[a-f0-9]{48}$/.test(token)){
     const {data:p}=await db.from("live_participants").select("id").eq("session_id",s.id).eq("token_hash",await hash(token)).maybeSingle();
     if(p){const {data:vote}=await db.from("live_votes").select("id").eq("session_id",s.id).eq("question_id",s.active_question_id).eq("participant_id",p.id).limit(1).maybeSingle();voted=!!vote;}
    }
    const snapshot=await state(s,false);
    return reply({session:snapshot.session,voted,questions:snapshot.questions.filter((q:any)=>q.id===s.active_question_id).map(({correct_answer,answer_justification,answer_effect,...safeQuestion}:any)=>safeQuestion),aggregate:[],count:null});
   }
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
   if(error)return reply({error:"Vote not accepted"},409);
   return reply({accepted:true});
  }
  return reply({error:"Unknown action"},400);
 }catch(_){return reply({error:"Invalid request"},400)}
});