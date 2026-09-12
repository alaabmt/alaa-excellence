import { currentSession } from './assessment-auth-client.js';
import { listAssessmentReports } from './assessment-reports-client.js';
import { recoverSavedLearningPreferenceReport } from './account-report-recovery.js';
import './account-trainer-sessions.js';

async function run(){
  try{
    const lang=new URLSearchParams(location.search).get('lang')==='en'?'en':'ar';
    const {client,session}=await currentSession();
    if(!session)return;
    const [{data:attempts,error},reportData]=await Promise.all([
      client.from('assessment_attempts').select('id,assessment_key,status,started_at,completed_at,result_json').order('started_at',{ascending:false}).limit(50),
      listAssessmentReports().catch(()=>({reports:[]}))
    ]);
    if(error||!attempts?.length)return;
    const reportsByAttempt=new Map();
    for(const report of (reportData?.reports||[])){
      if(report?.status!=='ready'||!report?.attempt_id)continue;
      const prev=reportsByAttempt.get(report.attempt_id);
      if(!prev||String(report.file_name||'').includes('-visual-v3-'))reportsByAttempt.set(report.attempt_id,report);
    }
    const created=await recoverSavedLearningPreferenceReport(attempts,reportsByAttempt,{lang});
    if(created)location.reload();
  }catch(error){
    console.error('Automatic coloured report recovery failed:',error);
  }
}

if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',()=>setTimeout(run,500),{once:true});
else setTimeout(run,500);
