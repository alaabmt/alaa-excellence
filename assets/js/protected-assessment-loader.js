import { currentSession } from './assessment-auth-client.js';
import { listAssessmentAttempts, startAssessmentAttempt } from './assessment-attempts-client.js';

const LPP_STATE_KEY = 'tamayuz10x-lpp-v1';
const LPP_OWNER_KEY = 'tamayuz10x-lpp-owner-v1';
const LPP_ARCHIVE_PREFIX = 'tamayuz10x-lpp-state-v2:';
const WORK_OWNER_KEY = 'tamayuz10x-work-owner-v1';
const WORK_ARCHIVE_PREFIX = 'tamayuz10x-work-state-v1:';

function message(lang, key) {
  const ar = { loading: 'جارٍ فتح التقييم الآمن…', failed: 'تعذر فتح التقييم الآن. حاول مرة أخرى.', monthlyLimit: 'لقد وصلت إلى الحد الشهري لهذا التقييم: محاولتان في الشهر. يمكنك بدء محاولة جديدة مع بداية الشهر القادم، وتبقى نتائجك وتقاريرك السابقة متاحة في حسابك.' };
  const en = { loading: 'Opening the secure assessment…', failed: 'The assessment could not be opened. Please try again.', monthlyLimit: 'You have reached this assessment’s monthly limit of two attempts. You can start a new attempt at the beginning of next month, and your previous results and reports remain available in your account.' };
  return (lang === 'ar' ? ar : en)[key];
}
function renderStatus(text, lang) { document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.body.innerHTML=`<main style="max-width:720px;margin:10vh auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.8;text-align:${lang==='ar'?'right':'left'}"><p>${text}</p></main>`; }
function assessmentKeyFor(asset){return asset==='lpp'?'learning-preference-profile':'work-approach-assessment';}
function isReportUpgradeRequest(){try{return new URLSearchParams(location.search).get('reportUpgrade')==='1';}catch(_){return false;}}
function readJson(key){try{return JSON.parse(localStorage.getItem(key)||'null');}catch(_){return null;}}
function writeJson(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch(_){}}
function timestamp(value){if(typeof value==='number'&&Number.isFinite(value))return value;const parsed=Date.parse(String(value||''));return Number.isFinite(parsed)?parsed:NaN;}
function lppArchiveKey(owner){return `${LPP_ARCHIVE_PREFIX}${owner.userId}:${owner.attemptId}`;}
function lppStateCouldBelongToAttempt(state,attempt){if(!state||typeof state!=='object')return false;const attemptStarted=timestamp(attempt?.startedAt);if(!Number.isFinite(attemptStarted))return false;const stateStarted=timestamp(state.startedAt),stateCompleted=timestamp(state.completedAt),tolerance=120000;if(Number.isFinite(stateStarted)&&stateStarted<attemptStarted-tolerance)return false;if(Number.isFinite(stateCompleted)&&stateCompleted<attemptStarted-tolerance)return false;const answered=Object.values(state.responses||{}).filter(v=>v!==null&&v!==undefined).length;if(state.screen==='results'||state.completedAt)return Number.isFinite(stateCompleted)&&stateCompleted>=attemptStarted-tolerance;if(answered>0)return Number.isFinite(stateStarted)&&stateStarted>=attemptStarted-tolerance;return true;}
function prepareLppLocalState(userId,attempt,lang){const targetOwner={userId,attemptId:attempt.id},currentOwner=readJson(LPP_OWNER_KEY),currentState=readJson(LPP_STATE_KEY);if(currentOwner?.userId&&currentOwner?.attemptId&&currentState)writeJson(lppArchiveKey(currentOwner),currentState);if(currentOwner?.userId===userId&&currentOwner?.attemptId===attempt.id)return;let nextState=readJson(lppArchiveKey(targetOwner));if(!nextState&&!currentOwner&&lppStateCouldBelongToAttempt(currentState,attempt))nextState=currentState;if(!nextState)nextState={lang:lang==='en'?'en':'ar',screen:'start',current:0,responses:{},startedAt:null,completedAt:null};writeJson(LPP_STATE_KEY,nextState);writeJson(LPP_OWNER_KEY,targetOwner);writeJson(lppArchiveKey(targetOwner),nextState);}
function collectWorkLocalState(){const snapshot={};try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key||!key.startsWith('wpf_v17_'))continue;snapshot[key]=localStorage.getItem(key);}}catch(_){}return snapshot;}
function clearWorkLocalState(){try{const keys=[];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith('wpf_v17_'))keys.push(key);}keys.forEach(key=>localStorage.removeItem(key));}catch(_){}}
function prepareWorkLocalState(userId){const currentOwner=readJson(WORK_OWNER_KEY);if(currentOwner?.userId)writeJson(`${WORK_ARCHIVE_PREFIX}${currentOwner.userId}`,collectWorkLocalState());if(currentOwner?.userId===userId)return;clearWorkLocalState();const archived=readJson(`${WORK_ARCHIVE_PREFIX}${userId}`)||{};try{Object.entries(archived).forEach(([key,value])=>{if(key.startsWith('wpf_v17_')&&typeof value==='string')localStorage.setItem(key,value);});}catch(_){}writeJson(WORK_OWNER_KEY,{userId});}
async function ensureAttempt(asset){const assessmentKey=assessmentKeyFor(asset),storageKey=`tamayuz10x-current-attempt:${assessmentKey}`,reportUpgrade=isReportUpgradeRequest();try{const existing=JSON.parse(sessionStorage.getItem(storageKey)||'null');if(existing?.id&&existing?.assessmentKey===assessmentKey){if(!existing?.completed)return existing;if(reportUpgrade)return existing;}}catch(_){}if(reportUpgrade)throw new Error('REPORT_UPGRADE_ATTEMPT_MISSING');try{const listed=await listAssessmentAttempts(assessmentKey),inProgress=(listed?.attempts||[]).find(row=>row?.id&&row?.status==='in_progress');if(inProgress){const attempt={id:inProgress.id,assessmentKey,startedAt:inProgress.started_at||new Date().toISOString(),completed:false};sessionStorage.setItem(storageKey,JSON.stringify(attempt));return attempt;}}catch(error){console.warn('Could not check for an existing assessment attempt:',error);}const data=await startAssessmentAttempt(assessmentKey),attempt={id:data?.attempt?.id,assessmentKey,startedAt:data?.attempt?.started_at||new Date().toISOString(),completed:false};if(!attempt.id)throw new Error('ATTEMPT_ID_MISSING');sessionStorage.setItem(storageKey,JSON.stringify(attempt));return attempt;}

export async function loadProtectedAssessment(asset, options = {}) {
  const cfg=window.TAMAYUZ_AUTH_CONFIG||{},lang=options.lang||(document.documentElement.lang==='ar'?'ar':'en');
  try {
    renderStatus(message(lang,'loading'),lang);
    const {session}=await currentSession();
    if(!session){const next=encodeURIComponent(location.pathname+location.search+location.hash);location.replace(`${cfg.loginPath||'/account/login.html'}?lang=${lang}&next=${next}`);return;}
    if(options.requireWorkConsent&&sessionStorage.getItem('tamayuz10x-work-consent')!=='accepted'){
      const consentPath=lang==='ar'?'/tools/work-approach-assessment/consent-ar.html':'/tools/work-approach-assessment/consent-en.html';
      location.replace(`${consentPath}${location.search||''}`);
      return;
    }
    const attempt=await ensureAttempt(asset);if(asset==='lpp')prepareLppLocalState(session.user.id,attempt,lang);else prepareWorkLocalState(session.user.id);
    if(!cfg.protectedContentEndpoint)throw new Error('CONTENT_ENDPOINT_NOT_CONFIGURED');
    const url=new URL(cfg.protectedContentEndpoint,location.origin);url.searchParams.set('asset',asset);
    const response=await fetch(url,{method:'GET',mode:'cors',credentials:'same-origin',headers:{Authorization:`Bearer ${session.access_token}`}});
    if(response.status===401){const next=encodeURIComponent(location.pathname+location.search+location.hash);location.replace(`${cfg.loginPath||'/account/login.html'}?lang=${lang}&next=${next}`);return;}
    if(!response.ok)throw new Error(`CONTENT_${response.status}`);const html=await response.text();document.open();document.write(html);document.close();
  } catch(error) { console.error('Protected assessment loader failed:',error);const key=error?.code==='MONTHLY_ATTEMPT_LIMIT_REACHED'?'monthlyLimit':'failed';renderStatus(message(lang,key),lang); }
}
