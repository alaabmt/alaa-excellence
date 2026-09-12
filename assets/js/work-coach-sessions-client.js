import { currentSession } from './assessment-auth-client.js';

function cfg(){return window.TAMAYUZ_AUTH_CONFIG||{};}
async function request(path='',options={}){
  const {session}=await currentSession();
  if(!session) throw new Error('AUTH_REQUIRED');
  const endpoint=cfg().workCoachSessionsEndpoint;
  if(!endpoint) throw new Error('WORK_COACH_ENDPOINT_NOT_CONFIGURED');
  const r=await fetch(`${endpoint}${path}`,{
    method:options.method||'GET',
    mode:'cors',
    credentials:'same-origin',
    headers:{Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json',...(options.headers||{})},
    body:options.body?JSON.stringify(options.body):undefined
  });
  const data=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(data?.error||`HTTP_${r.status}`);
  return data;
}
export function createWorkCoachSession({participantLabel='',language='ar'}={}){
  return request('',{method:'POST',body:{action:'create',participant_label:participantLabel,language}});
}
export function listWorkCoachSessions(){return request('');}
export function getWorkCoachSession(id){return request(`?id=${encodeURIComponent(id)}`);}
export function getWorkParticipantInvite(token){return request(`?token=${encodeURIComponent(token)}&participant=1`);}
export function completeWorkCoachSession(token,attemptId){return request('',{method:'POST',body:{action:'complete',token,attempt_id:attemptId}});}
export function archiveWorkCoachSession(id){return request('',{method:'PATCH',body:{id,status:'archived'}});}
