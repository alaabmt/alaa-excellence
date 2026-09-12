import { createSavedLearningPreferenceReportPdf } from './saved-lpp-report.js';
import { uploadAssessmentReport } from './assessment-reports-client.js';

function hasVisualV3(report){
  return String(report?.file_name||'').includes('-visual-v3-');
}

function hasSavedScores(attempt){
  const p=attempt?.result_json?.scores?.percent;
  return ['A','R','T','P'].every(k=>Number.isFinite(Number(p?.[k])));
}

function statusNode(attemptId,lang){
  const row=document.querySelector(`[data-attempt-id="${attemptId}"]`);
  if(!row)return null;
  let note=row.querySelector(`[data-saved-report-recovery="${attemptId}"]`);
  if(!note){
    note=document.createElement('span');
    note.className='recovery-status';
    note.dataset.savedReportRecovery=attemptId;
    row.appendChild(note);
  }
  note.textContent=lang==='ar'?'جارٍ إنشاء التقرير الملوّن من نتيجتك المحفوظة…':'Creating the coloured report from your saved result…';
  return note;
}

export async function recoverSavedLearningPreferenceReport(attempts,reportsByAttempt,options={}){
  const lang=options.lang==='en'?'en':'ar';
  const candidate=(attempts||[]).find(a=>
    a?.assessment_key==='learning-preference-profile'&&
    a?.status==='completed'&&
    hasSavedScores(a)&&
    !hasVisualV3(reportsByAttempt?.get?.(a.id))
  );
  if(!candidate)return false;

  const key=`tamayuz10x-saved-lpp-report:${candidate.id}`;
  const now=Date.now();
  try{
    const previous=JSON.parse(sessionStorage.getItem(key)||'null');
    if(previous?.state==='running'&&now-Number(previous?.at||0)<60000)return false;
    if(previous?.state==='failed'&&now-Number(previous?.at||0)<15000)return false;
  }catch(_){}

  const note=statusNode(candidate.id,lang);
  sessionStorage.setItem(key,JSON.stringify({state:'running',at:now}));
  try{
    const reportLang=candidate.result_json?.language==='en'?'en':'ar';
    const pdf=await createSavedLearningPreferenceReportPdf(candidate.result_json,{lang:reportLang});
    const fileName=`learning-preference-profile-visual-v3-${reportLang}.pdf`;
    await uploadAssessmentReport(candidate.id,pdf,fileName);
    sessionStorage.removeItem(key);
    if(note)note.textContent=lang==='ar'?'تم إنشاء التقرير الملوّن. جارٍ تحديث الحساب…':'Coloured report created. Refreshing your account…';
    return true;
  }catch(error){
    console.error('Saved-result coloured report recovery failed:',error);
    sessionStorage.setItem(key,JSON.stringify({state:'failed',at:Date.now(),error:String(error?.message||error)}));
    if(note)note.textContent=lang==='ar'?'تعذر إنشاء التقرير الملوّن تلقائيًا الآن.':'The coloured report could not be created automatically right now.';
    return false;
  }
}
