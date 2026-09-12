import { getWorkParticipantInvite } from './work-coach-sessions-client.js';

const params=new URLSearchParams(location.search);
const coachToken=(params.get('coachSession')||'').trim();
const lang=document.documentElement.lang==='en'?'en':'ar';
let invite=null;

function hashDigits(value){
  let h=2166136261>>>0;
  for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619);}
  return String((h>>>0)%100000).padStart(5,'0');
}
function attemptId(){
  try{return JSON.parse(sessionStorage.getItem('tamayuz10x-current-attempt:work-approach-assessment')||'null')?.id||'';}catch(_){return '';}
}
function internalCode(){return `AL${hashDigits(coachToken||attemptId()||location.pathname)}`;}
function tx(en,ar){return lang==='ar'?ar:en;}

async function loadInvite(){
  if(!coachToken)return;
  try{const data=await getWorkParticipantInvite(coachToken);invite=data?.session||null;}catch(e){invite={invalid:true};console.warn('Work coach invite unavailable',e);}
}
function hideField(input){const field=input?.closest('.field');if(field)field.style.display='none';}
function applyProfile(){
  const code=document.getElementById('code'),code2=document.getElementById('code2'),occasion=document.getElementById('occasion');
  if(!code||!code2||!occasion)return;
  const value=internalCode();
  code.value=value;code2.value=value;occasion.value='first';
  hideField(code);hideField(code2);hideField(occasion);
  const hero=document.querySelector('#app .hero');
  if(hero&&!document.getElementById('workAccessContext')){
    const box=document.createElement('div');box.id='workAccessContext';box.className='notice';
    box.style.margin='0 0 18px';
    if(coachToken){
      box.innerHTML=invite?.invalid
        ? `<strong>${tx('This coaching link is unavailable.','رابط الكوتشنغ غير متاح.')}</strong>`
        : `<strong>${tx('Coaching assessment','تقييم عبر الكوتش')}</strong><br>${tx('Your result will be available to you and to the coach who created this private assessment link.','ستظهر نتيجتك لك، كما ستتاح للكوتش الذي أنشأ رابط التقييم الخاص بك.')}${invite?.participant_label?`<br><small>${tx('Session','الجلسة')}: ${String(invite.participant_label).replace(/[&<>"']/g,'')}</small>`:''}`;
    }else{
      box.innerHTML=`<strong>${tx('Individual assessment','تقييم فردي')}</strong><br>${tx('No participant code is required. Your signed-in account identifies this assessment attempt.','لا تحتاج إلى رمز مشارك. حسابك المسجل يحدد محاولة التقييم تلقائيًا.')}`;
    }
    hero.before(box);
  }
  const start=document.getElementById('startBtn');
  if(invite?.invalid&&start){start.disabled=true;}
}
function scrubVisibleInternalCode(){
  document.querySelectorAll('.report-head .section-kicker').forEach(el=>{
    if(/^AL\d{5}\s*·/i.test((el.textContent||'').trim())) el.textContent=coachToken?tx('Coaching assessment','تقييم عبر الكوتش'):tx('Individual assessment','تقييم فردي');
  });
}
function apply(){applyProfile();scrubVisibleInternalCode();}
await loadInvite();
const root=document.getElementById('app');
if(root){new MutationObserver(apply).observe(root,{childList:true,subtree:true});}
apply();
