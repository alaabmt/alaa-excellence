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
const videoUrl=(value:unknown)=>{const v=safe(value,500);if(!v)return "";try{const u=new URL(v);if(u.protocol!=="https:")return "";const h=u.hostname.toLowerCase();let id="";if(h==="youtu.be")id=u.pathname.slice(1);else if(["youtube.com","www.youtube.com","www.youtube-nocookie.com"].includes(h))id=u.pathname==="/watch"?u.searchParams.get("v")||"":u.pathname.startsWith("/embed/")?u.pathname.slice(7):"";if(id.length===11&&[...id].every(c=>"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-".includes(c)))return "https://www.youtube-nocookie.com/embed/"+id;const parts=u.pathname.split("/").filter(Boolean);if(["vimeo.com","www.vimeo.com"].includes(h)&&parts.length===1&&parts[0].length>=6&&parts[0].length<=12&&[...parts[0]].every(c=>"0123456789".includes(c)))return "https://player.vimeo.com/video/"+parts[0];if(h==="player.vimeo.com"&&parts.length===2&&parts[0]==="video"&&[...parts[1]].every(c=>"0123456789".includes(c)))return "https://player.vimeo.com/video/"+parts[1];return ""}catch{return ""}};
const mediaRows=async(rows:any[])=>Promise.all(rows.map(async(x:any)=>{if(x.media_type!=="image"||!x.media_path)return {...x,media_url:x.media_type==="video"?x.media_video_url:null};const {data}=await db.storage.from("tamayuz-live-question-images").createSignedUrl(x.media_path,3600);return {...x,media_url:data?.signedUrl||null}}));
async function state(s:any,results=false){const {data:prefs}=await db.from("live_presentations").select("default_show_explanation_on_reveal").eq("id",s.presentation_id).maybeSingle();const {data:q}=await db.from("live_questions").select("id,prompt,kind,options,position,correct_answer,answer_justification,answer_effect,show_explanation_on_reveal,media_type,media_path,media_video_url,timer_seconds").eq("presentation_id",s.presentation_id).order("position");let aggregate:any[]=[];let count=0;if(results&&s.active_question_id){const map=new Map<string,number>();for(let offset=0;offset<60000;offset+=1000){const {data:v,error}=await db.from(s.before_after_mode==="after"&&s.before_after_question_id===s.active_question_id?"live_after_votes":"live_votes").select("answer").eq("session_id",s.id).eq("question_id",s.active_question_id).order("id").range(offset,offset+999);if(error)throw error;for(const x of v||[]){count++;map.set(x.answer,(map.get(x.answer)||0)+1)}if(!v||v.length<1000)break;}aggregate=[...map].map(([answer,votes])=>({answer,votes}));}return {session:{id:s.id,code:s.join_code,state:s.state,active_question_id:s.active_question_id,show_results:s.show_results,reveal_correct_answer:s.reveal_correct_answer,revision:s.revision,before_after_question_id:s.before_after_question_id,before_after_mode:s.before_after_mode,qna_enabled:!!s.qna_enabled,vote_deadline_at:s.vote_deadline_at||null,server_now:new Date().toISOString()},questions:await mediaRows((q||[]).map((x:any)=>({...x,reveal_override:x.show_explanation_on_reveal,show_explanation_on_reveal:x.show_explanation_on_reveal??(prefs?.default_show_explanation_on_reveal!==false)}))),aggregate,count}}
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
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const {data,error}=await db.from("live_presentations").select("id,title,locale,created_at,default_show_explanation_on_reveal").order("created_at",{ascending:false}).limit(100);
   if(error)return reply({error:"Could not list presentations"},500);
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
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const {data,error}=await db.from("live_sessions").select("id,join_code,state,presentation_id,created_at,label").order("created_at",{ascending:false}).limit(100);
   return error?reply({error:"Could not list sessions"},500):reply({sessions:data||[]});
  }
  if(action==="set_reveal_defaults"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const pid=safe(b.presentation_id,40);
   if(typeof b.default_show_explanation_on_reveal!=="boolean")return reply({error:"Invalid default"},400);
   const {data:p,error}=await db.from("live_presentations").update({default_show_explanation_on_reveal:b.default_show_explanation_on_reveal}).eq("id",pid).select("id").maybeSingle();
   if(error||!p)return reply({error:"Could not save presentation default"},400);
   if(b.apply_all===true){const {error:bulkError}=await db.from("live_questions").update({show_explanation_on_reveal:b.default_show_explanation_on_reveal}).eq("presentation_id",pid);if(bulkError)return reply({error:"Default saved but bulk update failed"},500);}
   return reply({saved:true,applied_to_all:b.apply_all===true});
  }
  if(action==="upload_question_image"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const pid=safe(b.presentation_id,40),mime=safe(b.mime,40),raw=safe(b.base64,4200000);
   if(pid.length!==36||!["image/jpeg","image/png","image/webp"].includes(mime)||raw.length>4194304||raw.length<100)return reply({error:"Invalid image"},400);
   const {data:p}=await db.from("live_presentations").select("id").eq("id",pid).maybeSingle();if(!p)return reply({error:"Presentation not found"},404);
   let bytes:Uint8Array;try{bytes=Uint8Array.from(atob(raw),c=>c.charCodeAt(0))}catch{return reply({error:"Invalid image data"},400)}
   if(bytes.length>3145728)return reply({error:"Image exceeds 3 MB"},413);
   const valid=mime==="image/png"?bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71:mime==="image/jpeg"?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:String.fromCharCode(...bytes.slice(0,4))==="RIFF"&&String.fromCharCode(...bytes.slice(8,12))==="WEBP";if(!valid)return reply({error:"Image type mismatch"},400);
   const ext=mime==="image/png"?"png":mime==="image/jpeg"?"jpg":"webp",path="questions/"+pid+"/"+random(16)+"."+ext;
   const {error}=await db.storage.from("tamayuz-live-question-images").upload(path,bytes,{contentType:mime,upsert:false});if(error)return reply({error:"Image upload failed"},500);
   return reply({media_path:path});
  }
  if(action==="add_question"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   
   const pid=safe(b.presentation_id,40),prompt=safe(b.prompt,6000),kind=["choice","rating","text"].includes(b.kind)?b.kind:"choice";
   const options=kind==="text"&&Array.isArray(b.options)&&b.options.length===1&&b.options[0]==="__wordcloud__"?["__wordcloud__"]:kind==="choice"&&Array.isArray(b.options)?b.options.slice(0,8).map((x:any)=>safe(x,120)).filter(Boolean):[];
   if(!prompt||(kind==="choice"&&(options.length<2||new Set(options).size!==options.length)))return reply({error:"Question or options invalid"},400);
   const correctAnswer=kind==="choice"?safe(b.correct_answer,120):"";
   if(correctAnswer&&!options.includes(correctAnswer))return reply({error:"Correct answer must match an option"},400);
   if(b.media_type==="image"&&!safe(b.media_path,220).startsWith("questions/"+pid+"/"))return reply({error:"Invalid image reference"},400);
   if(b.media_type==="video"&&!videoUrl(b.media_video_url))return reply({error:"Valid YouTube or Vimeo URL required"},400);
   if(b.timer_seconds!=null&&(!Number.isInteger(Number(b.timer_seconds))||Number(b.timer_seconds)<10||Number(b.timer_seconds)>600))return reply({error:"Timer must be 10–600 seconds"},400);
   const {data:existing}=await db.from("live_questions").select("position").eq("presentation_id",pid).order("position",{ascending:false}).limit(1);
   const {data,error}=await db.from("live_questions").insert({presentation_id:pid,prompt,kind,options,correct_answer:correctAnswer||null,answer_justification:safe(b.answer_justification,6000),answer_effect:safe(b.answer_effect,6000),show_explanation_on_reveal:typeof b.show_explanation_on_reveal==="boolean"?b.show_explanation_on_reveal:null,media_type:b.media_type==="image"?"image":b.media_type==="video"?"video":null,media_path:b.media_type==="image"?safe(b.media_path,220):null,media_video_url:b.media_type==="video"?videoUrl(b.media_video_url):null,timer_seconds:b.timer_seconds==null?null:Number(b.timer_seconds),position:(existing?.[0]?.position??-1)+1}).select("id").single();
   return error?reply({error:"Cannot add question"},400):reply({question:data});
  }
  if(action==="list_questions"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const pid=safe(b.presentation_id,40);
   const {data,error}=await db.from("live_questions").select("id,prompt,kind,options,position,correct_answer,answer_justification,answer_effect,show_explanation_on_reveal,media_type,media_path,media_video_url,timer_seconds").eq("presentation_id",pid).order("position");
   const {data:prefs}=await db.from("live_presentations").select("default_show_explanation_on_reveal").eq("id",pid).maybeSingle();return error?reply({error:"Cannot list questions"},400):reply({questions:await mediaRows((data||[]).map((x:any)=>({...x,reveal_override:x.show_explanation_on_reveal,show_explanation_on_reveal:x.show_explanation_on_reveal??(prefs?.default_show_explanation_on_reveal!==false)}))),default_show_explanation_on_reveal:prefs?.default_show_explanation_on_reveal!==false});
  }
  if(action==="update_question"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const id=safe(b.question_id,40),pid=safe(b.presentation_id,40),prompt=safe(b.prompt,6000);
   if(!prompt)return reply({error:"Question cannot be empty"},400);
   const {data:old}=await db.from("live_questions").select("id,kind,options,correct_answer").eq("id",id).eq("presentation_id",pid).maybeSingle();
   if(!old)return reply({error:"Question not found"},404);
   const patch:any={prompt};if(b.timer_seconds!==undefined){if(b.timer_seconds!==null&&(!Number.isInteger(Number(b.timer_seconds))||Number(b.timer_seconds)<10||Number(b.timer_seconds)>600))return reply({error:"Timer must be 10–600 seconds"},400);patch.timer_seconds=b.timer_seconds===null?null:Number(b.timer_seconds)}
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
   if(b.media_type!==undefined){if(b.media_type!==null&&!["image","video"].includes(b.media_type))return reply({error:"Invalid media type"},400);const path=safe(b.media_path,220),link=videoUrl(b.media_video_url);if(b.media_type==="image"&&!path.startsWith("questions/"+pid+"/"))return reply({error:"Invalid image reference"},400);if(b.media_type==="video"&&!link)return reply({error:"Valid YouTube or Vimeo URL required"},400);patch.media_type=b.media_type;patch.media_path=b.media_type==="image"?path:null;patch.media_video_url=b.media_type==="video"?link:null;}
   if(b.answer_justification!==undefined)patch.answer_justification=safe(b.answer_justification,6000);
   if(b.answer_effect!==undefined)patch.answer_effect=safe(b.answer_effect,6000);
   if(b.show_explanation_on_reveal!==undefined){if(b.show_explanation_on_reveal!==null&&typeof b.show_explanation_on_reveal!=="boolean")return reply({error:"Invalid reveal preference"},400);patch.show_explanation_on_reveal=b.show_explanation_on_reveal;}
   const {data,error}=await db.from("live_questions").update(patch).eq("id",id).eq("presentation_id",pid).select("id").maybeSingle();
   return error?reply({error:"Cannot update question"},400):!data?reply({error:"Question not found"},404):reply({question:data});
  }
  if(action==="reorder_questions"){
   if(!(await owner(req)))return reply({error:"Owner authorization required"},403);
   const pid=safe(b.presentation_id,40),ids=b.question_ids;
   if(!Array.isArray(ids)||ids.length<1||ids.length>100||ids.some((x:any)=>typeof x!=="string")||new Set(ids).size!==ids.length)return reply({error:"Invalid question order"},400);
   // One database transaction: either all question positions change or none do.
   const {error}=await db.rpc("live_reorder_questions",{p_presentation_id:pid,p_ids:ids});
   if(error)return reply({error:"Question list has changed or reorder failed. Refresh and retry."},409);
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
   // RPC owns a transaction and locks the session before deleting any rows.
   const {data:rows,error}=await db.rpc("live_reset_session",{p_session_id:id});
   if(error)return reply({error:"Reset failed; no partial reset was committed."},409);
   const updated=rows?.[0];
   if(!updated)return reply({error:"Session not found"},404);
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
   const {data,error}=await db.from("live_sessions").update({state:next,active_question_id:active,show_results:effectiveVisible,reveal_correct_answer:answerRevealed,question_results_visibility:visibility,vote_deadline_at:active!==s.active_question_id||next!=="open"?null:s.vote_deadline_at,revision:s.revision+1,before_after_mode:active===s.before_after_question_id?s.before_after_mode:"before"}).eq("id",id).eq("revision",s.revision).select("*").maybeSingle();
   return error||!data?reply({error:"Concurrent update; retry after refresh"},409):reply(await state(data,true));
  }
  if(action==="before_after"){
   const id=safe(b.session_id,40),token=safe(b.presenter_token,128);
   if(!(await sessionByToken(id,token))&&!(await owner(req)))return reply({error:"Presenter authorization required"},403);
   const {data:s}=await db.from("live_sessions").select("*").eq("id",id).maybeSingle();
   if(!s)return reply({error:"Session not found"},404);
   if(s.state==="ended")return reply({error:"Session ended"},409);
   const operation=safe(b.operation,20);
   if(operation==="compare"){
    const qid=s.before_after_question_id;if(!qid)return reply({error:"No before-and-after poll selected"},409);
    const {data:q}=await db.from("live_questions").select("id,prompt,kind,correct_answer").eq("id",qid).eq("presentation_id",s.presentation_id).maybeSingle();
    if(!q||q.kind!=="choice"||!q.correct_answer)return reply({error:"A multiple-choice question with a correct answer is required"},400);
    const tally=async(table:string)=>{let total=0,correct=0;for(let offset=0;offset<60000;offset+=1000){const {data,error}=await db.from(table).select("answer").eq("session_id",id).eq("question_id",qid).order("id").range(offset,offset+999);if(error)throw error;for(const v of data||[]){total++;if(v.answer===q.correct_answer)correct++}if(!data||data.length<1000)break;}return {total,correct,percent:total?Math.round(correct*1000/total)/10:null}};
    return reply({question:q.prompt,before:await tally("live_votes"),after:await tally("live_after_votes")});
   }
   if(!["before","after"].includes(operation))return reply({error:"Invalid operation"},400);
   const qid=operation==="before"?safe(b.question_id,40):s.before_after_question_id;
   const {data:q}=await db.from("live_questions").select("id,kind,correct_answer").eq("id",qid).eq("presentation_id",s.presentation_id).maybeSingle();
   if(!q||q.kind!=="choice"||!q.correct_answer)return reply({error:"Choose a multiple-choice question with a correct answer"},400);
   const {data:updated,error}=await db.from("live_sessions").update({before_after_question_id:qid,before_after_mode:operation,active_question_id:qid,state:"open",show_results:false,reveal_correct_answer:false,revision:s.revision+1}).eq("id",id).eq("revision",s.revision).select("*").maybeSingle();
   return error||!updated?reply({error:"Concurrent update; refresh and retry"},409):reply(await state(updated,true));
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
    let voted=false,participant_valid=false;
    if(/^[a-f0-9]{48}$/.test(token)){
     const {data:p}=await db.from("live_participants").select("id").eq("session_id",s.id).eq("token_hash",await hash(token)).maybeSingle();
     participant_valid=!!p;
     if(p&&s.active_question_id){const {data:vote}=await db.from(s.before_after_mode==="after"&&s.before_after_question_id===s.active_question_id?"live_after_votes":"live_votes").select("id").eq("session_id",s.id).eq("question_id",s.active_question_id).eq("participant_id",p.id).limit(1).maybeSingle();voted=!!vote;}
    }
    const snapshot=await state(s,false);
    const questions=snapshot.questions.filter((q:any)=>q.id===s.active_question_id).map((q:any)=>{
     if(s.reveal_correct_answer)return q;
     const {correct_answer,answer_justification,answer_effect,...safeQuestion}=q;
     return safeQuestion;
    });
    return reply({session:snapshot.session,voted,participant_valid,questions,aggregate:[],count:null});
   }
   if(s.state==="ended")return reply({error:"Session ended"},409);
   // The database locks the session row and checks capacity in one transaction.
   const token=random();
   const {data:registered,error}=await db.rpc("live_register_participant",{p_code:code,p_token_hash:await hash(token)});
   if(error?.message?.includes("capacity"))return reply({error:"Session capacity reached"},429);
   if(error?.message?.includes("ended"))return reply({error:"Session ended"},409);
   if(error)return reply({error:"Cannot join"},500);
   return reply({participant_token:token,session_id:registered});
  }
  if(action==="timer_start"||action==="timer_reset"){
   const id=safe(b.session_id,40),token=safe(b.presenter_token,128);
   if(!(await sessionByToken(id,token))&&!(await owner(req)))return reply({error:"Presenter authorization required"},403);
   const {data:s}=await db.from("live_sessions").select("*").eq("id",id).maybeSingle();
   if(!s||s.state==="ended")return reply({error:"Session unavailable"},409);
   let deadline:null|string=null;
   if(action==="timer_start"){
    if(s.state!=="open"||!s.active_question_id)return reply({error:"Open voting before starting timer"},409);
    const {data:q}=await db.from("live_questions").select("timer_seconds").eq("id",s.active_question_id).eq("presentation_id",s.presentation_id).maybeSingle();
    const seconds=Number(q?.timer_seconds);if(!Number.isInteger(seconds)||seconds<10||seconds>600)return reply({error:"No valid timer configured for this question"},400);
    deadline=new Date(Date.now()+seconds*1000).toISOString();
   }
   const {data:updated,error}=await db.from("live_sessions").update({vote_deadline_at:deadline,revision:s.revision+1}).eq("id",id).eq("revision",s.revision).select("*").maybeSingle();
   return error||!updated?reply({error:"Concurrent change; retry"},409):reply({session:(await state(updated)).session});
  }
  if(action==="qna_presenter_list"){
   const id=safe(b.session_id,40),token=safe(b.presenter_token,128);
   if(!(await sessionByToken(id,token))&&!(await owner(req)))return reply({error:"Presenter authorization required"},403);
   const {data:questions,error}=await db.from("live_audience_questions").select("id,body,status,created_at").eq("session_id",id).order("created_at",{ascending:false}).limit(100);
   if(error)return reply({error:"Could not load Q&A"},500);
   const ids=(questions||[]).map((q:any)=>q.id);
   const {data:votes}=ids.length?await db.from("live_audience_question_upvotes").select("question_id").in("question_id",ids).limit(10000):{data:[]};
   const counts=new Map<string,number>();for(const v of votes||[])counts.set(v.question_id,(counts.get(v.question_id)||0)+1);
   return reply({questions:(questions||[]).map((q:any)=>({...q,upvotes:counts.get(q.id)||0})).sort((a:any,b:any)=>b.upvotes-a.upvotes||a.created_at.localeCompare(b.created_at))});
  }
  if(action==="qna_toggle"||action==="qna_moderate"){
   const id=safe(b.session_id,40),token=safe(b.presenter_token,128);
   if(!(await sessionByToken(id,token))&&!(await owner(req)))return reply({error:"Presenter authorization required"},403);
   const {data:s}=await db.from("live_sessions").select("id,state").eq("id",id).maybeSingle();if(!s||s.state==="ended")return reply({error:"Session unavailable"},409);
   if(action==="qna_toggle"){
    if(typeof b.enabled!=="boolean")return reply({error:"Invalid toggle"},400);
    const {error}=await db.from("live_sessions").update({qna_enabled:b.enabled}).eq("id",id);return error?reply({error:"Unable to update Q&A"},500):reply({enabled:b.enabled});
   }
   const qid=safe(b.question_id,40),status=safe(b.status,20);
   if(!["open","answered","hidden"].includes(status))return reply({error:"Invalid status"},400);
   const {data,error}=await db.from("live_audience_questions").update({status}).eq("id",qid).eq("session_id",id).select("id").maybeSingle();
   return error||!data?reply({error:"Question not found"},404):reply({updated:true});
  }
  if(["qna_list","qna_submit","qna_upvote"].includes(action)){
   const code=safe(b.code,20).toUpperCase(),token=safe(b.participant_token,128);
   if(!/^[a-f0-9]{48}$/.test(token))return reply({error:"Invalid participant"},403);
   const {data:s}=await db.from("live_sessions").select("id,state,qna_enabled").eq("join_code",code).maybeSingle();
   if(!s||s.state==="ended"||!s.qna_enabled)return reply({error:"Q&A unavailable"},409);
   const {data:p}=await db.from("live_participants").select("id").eq("session_id",s.id).eq("token_hash",await hash(token)).maybeSingle();if(!p)return reply({error:"Invalid participant"},403);
   if(action==="qna_submit"){
    const body=safe(b.body,500).trim();if(!body||body.length>500||/[<>]/.test(body)||/https?:\\/\\/|www\\./i.test(body))return reply({error:"Enter a question without links or markup"},400);
    const {count}=await db.from("live_audience_questions").select("id",{count:"exact",head:true}).eq("session_id",s.id).eq("participant_id",p.id);
    if((count||0)>=3)return reply({error:"Maximum three questions per participant"},429);
    const {error}=await db.from("live_audience_questions").insert({session_id:s.id,participant_id:p.id,body});return error?reply({error:"Question not accepted"},409):reply({submitted:true});
   }
   if(action==="qna_upvote"){
    const qid=safe(b.question_id,40);
    const {data:q}=await db.from("live_audience_questions").select("id").eq("id",qid).eq("session_id",s.id).eq("status","open").maybeSingle();if(!q)return reply({error:"Question unavailable"},404);
    if(b.upvote===false){const {error}=await db.from("live_audience_question_upvotes").delete().eq("question_id",qid).eq("participant_id",p.id);return error?reply({error:"Could not remove upvote"},500):reply({upvoted:false});}
    const {error}=await db.from("live_audience_question_upvotes").insert({question_id:qid,participant_id:p.id});
    return error&&error.code!=="23505"?reply({error:"Could not upvote"},409):reply({upvoted:true});
   }
   const {data:questions,error}=await db.from("live_audience_questions").select("id,body,status,created_at").eq("session_id",s.id).neq("status","hidden").order("created_at",{ascending:false}).limit(100);
   if(error)return reply({error:"Could not load Q&A"},500);
   const ids=(questions||[]).map((q:any)=>q.id);
   const {data:votes}=ids.length?await db.from("live_audience_question_upvotes").select("question_id,participant_id").in("question_id",ids).limit(10000):{data:[]};
   const totals=new Map<string,number>(),mine=new Set<string>();for(const v of votes||[]){totals.set(v.question_id,(totals.get(v.question_id)||0)+1);if(v.participant_id===p.id)mine.add(v.question_id)}
   return reply({questions:(questions||[]).map((q:any)=>({...q,upvotes:totals.get(q.id)||0,mine:mine.has(q.id)})).sort((a:any,b:any)=>b.upvotes-a.upvotes||a.created_at.localeCompare(b.created_at))});
  }
  if(action==="vote"){
   const code=safe(b.code,20).toUpperCase();const token=safe(b.participant_token,128);
   if(!/^[a-f0-9]{48}$/.test(token))return reply({error:"Invalid participant"},403);
   const {data:s}=await db.from("live_sessions").select("*").eq("join_code",code).maybeSingle();
   if(!s||s.state!=="open"||!s.active_question_id)return reply({error:"Voting closed"},409);
   if(s.vote_deadline_at&&Date.now()>=Date.parse(s.vote_deadline_at))return reply({error:"Voting timer expired"},409);
   const {data:p}=await db.from("live_participants").select("id").eq("session_id",s.id).eq("token_hash",await hash(token)).maybeSingle();if(!p)return reply({error:"Invalid participant"},403);
   const {data:q}=await db.from("live_questions").select("*").eq("id",s.active_question_id).single();if(!q)return reply({error:"Question missing"},404);
   const wordcloud=q.kind==="text"&&Array.isArray(q.options)&&q.options.includes("__wordcloud__");
   const answer=wordcloud?safe(b.answer,60).trim():safe(b.answer,400);
   if(wordcloud&&(typeof b.answer!=="string"||b.answer.trim().length>60||answer.includes("<")||answer.includes(">")||answer.toLowerCase().includes("http")||answer.toLowerCase().includes("www.")))return reply({error:"Please enter one short phrase without links or markup"},400);
   if(!answer||q.kind==="choice"&&!(q.options||[]).includes(answer)||q.kind==="rating"&&!["1","2","3","4","5"].includes(answer))return reply({error:"Invalid answer"},400);
   const {error}=await db.from(s.before_after_mode==="after"&&s.before_after_question_id===q.id?"live_after_votes":"live_votes").insert({session_id:s.id,question_id:q.id,participant_id:p.id,answer});
   if(error?.code==="23505")return reply({accepted:true,duplicate:true});
   if(error)return reply({error:"Vote not accepted"},409);
   return reply({accepted:true});
  }
  return reply({error:"Unknown action"},400);
 }catch(_){return reply({error:"Invalid request"},400)}
});