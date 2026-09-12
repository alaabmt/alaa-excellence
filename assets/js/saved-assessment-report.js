import { currentSession } from './assessment-auth-client.js';
import { uploadAssessmentReport, listAssessmentReports, fetchAssessmentReport } from './assessment-reports-client.js';
const params=new URLSearchParams(location.search),lang=params.get('lang')==='en'?'en':'ar';
const tx=(ar,en)=>lang==='ar'?ar:en;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
const status=document.getElementById('status'),download=document.getElementById('download'),retry=document.getElementById('retry');
const account=document.getElementById('account');account.textContent=tx('حسابي','My account');account.href+='?lang='+lang;
download.textContent=tx('تنزيل PDF','Download PDF');retry.textContent=tx('إعادة المحاولة','Retry');document.getElementById('previewLabel').textContent=tx('معاينة ملف PDF المحفوظ','Preview saved PDF');
const definitions={
A:{ar:'الممارسة',en:'Action',color:'#be6538',arText:'التعلّم من خلال التجربة والمشاركة المباشرة.',enText:'Learning through experience and direct participation.',arDo:'اختر تجربة صغيرة وآمنة، ثم دوّن ما تعلمته منها.',enDo:'Choose a small, safe experiment, then record what you learned.'},
R:{ar:'التأمل والمراجعة',en:'Reflection',color:'#397ba4',arText:'التوقف لمراجعة الخبرة ومقارنة وجهات النظر.',enText:'Pausing to review experience and compare perspectives.',arDo:'بعد نشاط التعلّم، اسأل: ماذا حدث؟ وما الذي سأغيّره في المرة القادمة؟',enDo:'After learning, ask: what happened, and what would I change next time?'},
T:{ar:'التحليل المفاهيمي',en:'Conceptual analysis',color:'#7a619f',arText:'فهم المبادئ وتنظيم المعلومات وفحص الأدلة.',enText:'Understanding principles, organizing information and examining evidence.',arDo:'لخّص الفكرة في نموذج بسيط، وميّز بين الدليل والافتراض.',enDo:'Summarize the idea in a simple model and separate evidence from assumptions.'},
P:{ar:'التطبيق العملي',en:'Practical application',color:'#287e71',arText:'تحويل الأفكار إلى استخدام واقعي واختبار فائدتها.',enText:'Turning ideas into real-world use and testing their value.',arDo:'حدد موقفًا واقعيًا تطبّق فيه فكرة واحدة، وراجع أثرها بعد أسبوع.',enDo:'Choose a real situation for applying one idea, then review its effect after a week.'}
};
function render(attempt){
 const p=attempt.result_json?.scores?.percent;
 if(!p||!['A','R','T','P'].every(k=>typeof p[k]==='number'&&Number.isFinite(p[k])&&p[k]>=0&&p[k]<=100))throw Error('SAVED_SCORES_UNAVAILABLE');
 const order=['A','R','T','P'],rank=[...order].sort((a,b)=>p[b]-p[a]),spread=p[rank[0]]-p[rank[3]];
 const date=new Date(attempt.result_json.completedAt||attempt.completed_at).toLocaleDateString(lang==='ar'?'ar-AE':'en-GB');
 const head='<div class="brand">'+tx('التميّز 10X','Tamayuz 10X')+'</div>';
 const foot=n=>'<div class="footer"><span>'+tx('للتأمل والتطوير · نسخة تجريبية','Reflection and development · Pilot version')+'</span><span>'+n+' / 2</span></div>';
 document.getElementById('report').innerHTML=`<section class="sheet">${head}<div class="eyebrow">${tx('بصمتك في التعلّم','LEARNING STYLE PROFILE')}</div><h1>${tx('تقرير نتيجتك المحفوظة','Your saved learning profile')}</h1><p class="muted">${tx('تاريخ إكمال التقييم','Assessment completed')}: ${esc(date)}</p><h2>${tx('تفضيلاتك الأربعة','Your four learning preferences')}</h2><div class="scores">${order.map(k=>{const d=definitions[k];return `<article class="score" style="--accent:${d.color}"><h3>${tx(d.ar,d.en)}</h3><strong>${p[k]}%</strong><p class="muted">${tx(d.arText,d.enText)}</p><div class="bar"><span style="width:${p[k]}%"></span></div></article>`;}).join('')}</div><h2>${tx('كيف تقرأ نتيجتك؟','How to read your result')}</h2><p>${tx('تمثل النسب درجتك في كل تفضيل مقارنة بالدرجة القصوى لذلك التفضيل. ليست درجات نجاح، ولا نسبًا مئوية مقارنة بأشخاص آخرين، ولا يلزم أن يكون مجموعها 100%.','Each percentage is your score relative to the maximum for that preference. These are not pass marks or percentiles, and they do not need to add up to 100%.')}</p><p>${spread<=10?tx('تفضيلاتك الأربعة متقاربة نسبيًا. لا تبالغ في تفسير الفروق الصغيرة بينها.','Your four preferences are relatively close. Avoid overinterpreting small differences.'):tx('أعلى نسبة محفوظة لديك هي في '+definitions[rank[0]].ar+'. اقرأها كتفضيل حالي، وليس قدرة ثابتة أو حكمًا على شخصيتك.','Your highest saved percentage is in '+definitions[rank[0]].en+'. Read this as a current preference, not a fixed ability or personality judgment.')}</p><div class="note">${tx('أُعيد إنشاء هذا التقرير من الدرجات الإجمالية المحفوظة. لم تُحفظ إجابات البنود لهذه المحاولة؛ لذلك لا يمكن استعادة عدد الإجابات المرتفعة أو تفاصيل الجوانب الفرعية منها.','This report was rebuilt from saved aggregate scores. Item responses were not saved for this attempt, so strong-response counts and detailed facets cannot be recovered from it.')}</div>${foot(1)}</section><section class="sheet">${head}<div class="eyebrow">${tx('من الوعي إلى التطبيق','FROM INSIGHT TO ACTION')}</div><h1>${tx('خطة لتوسيع طرق تعلّمك','Broaden how you learn')}</h1><p>${tx('استخدم التفضيلات الأربعة معًا بحسب الموقف. انخفاض إحدى النسب لا يعني ضعفًا، والهدف ليس جعل جميع النسب متساوية.','Use all four preferences as the situation requires. A lower percentage is not a weakness, and the goal is not to make all four equal.')}</p>${order.map(k=>{const d=definitions[k];return `<article class="guidance" style="--accent:${d.color}"><h3>${tx(d.ar,d.en)}</h3><p>${tx(d.arDo,d.enDo)}</p></article>`;}).join('')}<h2>${tx('تجربة هذا الأسبوع','An experiment for this week')}</h2><p>${tx('اختر مهارة واحدة: جرّبها، ثم تأمل ما حدث، وافهم المبدأ وراءها، وطبّق ما تعلمته في موقف جديد. دوّن ما ساعدك وما ستعدّله.','Choose one skill: try it, reflect on what happened, understand the principle, and apply it in a new situation. Note what helped and what you will adjust.')}</p><div class="note">${tx('هذه أداة تطويرية تجريبية، ولم يثبت بعد صدقها وثباتها سيكومتريًا. لا تستخدم النتيجة للتشخيص أو التوظيف أو الاستبعاد أو تقييم الذكاء والقدرة.','This is a pilot development tool and is not yet psychometrically validated. Do not use it for diagnosis, hiring, exclusion, or judgments of intelligence or ability.')}</div>${foot(2)}</section>`;
}
async function script(src,ready){if(ready())return;await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>ready()?resolve():reject(Error('PDF_LIBRARY_UNAVAILABLE'));s.onerror=()=>{s.remove();reject(Error('PDF_LIBRARY_LOAD_FAILED'));};document.head.append(s);});}
async function makePdf(){
 await Promise.all([script('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',()=>window.html2canvas),script('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',()=>window.jspdf?.jsPDF)]);
 await document.fonts.ready;
 const pdf=new window.jspdf.jsPDF({unit:'pt',format:'a4',compress:true});
 const pages=[...document.querySelectorAll('.sheet')];
 for(let i=0;i<pages.length;i++){
  const page=pages[i];const canvas=await window.html2canvas(page,{backgroundColor:'#ffffff',scale:1.5,useCORS:true,logging:false,windowWidth:1100,scrollX:0,scrollY:0});
  if(canvas.width<700||canvas.height<1000)throw Error('PDF_CAPTURE_INVALID');
  if(i)pdf.addPage();const h=canvas.height*595.28/canvas.width;
  if(h>842.9)throw Error('PDF_PAGE_OVERFLOW');
  pdf.addImage(canvas.toDataURL('image/jpeg',.94),'JPEG',0,0,595.28,h);
 }
 const blob=pdf.output('blob');if(blob.size<15000)throw Error('PDF_EMPTY');return blob;
}
let objectUrl;
async function run(){
 retry.hidden=true;status.textContent=tx('جارٍ تحميل التقرير…','Loading report…');
 try{
  const {client,session}=await currentSession();
  if(!session){const next=location.pathname+location.search;location.replace((window.TAMAYUZ_AUTH_CONFIG?.loginPath||'/account/login.html')+'?lang='+lang+'&next='+encodeURIComponent(next));return;}
  const id=params.get('attempt');if(!/^[0-9a-f-]{36}$/i.test(id||''))throw Error('ATTEMPT_REQUIRED');
  const {data:attempt,error}=await client.from('assessment_attempts').select('id,assessment_key,status,completed_at,result_json').eq('id',id).eq('user_id',session.user.id).maybeSingle();
  if(error||!attempt||attempt.status!=='completed'||attempt.assessment_key!=='learning-preference-profile')throw Error('REPORT_UNAVAILABLE');
  render(attempt);status.textContent=tx('جارٍ تجهيز ملف PDF وحفظه في حسابك…','Preparing PDF and saving it to your account…');
  const fileName='learning-preference-profile-saved-v1-'+lang+'.pdf';
  const existing=await listAssessmentReports();const ready=existing.reports?.find(r=>r.attempt_id===id&&r.status==='ready'&&r.file_name===fileName);
  let blob;
  if(ready)blob=await fetchAssessmentReport(ready.id);else{const created=await makePdf();await uploadAssessmentReport(id,created,fileName);const verified=await listAssessmentReports();const saved=verified.reports?.find(r=>r.attempt_id===id&&r.status==='ready'&&r.file_name===fileName);if(!saved)throw Error('REPORT_SAVE_NOT_VERIFIED');blob=await fetchAssessmentReport(saved.id);if(blob.size!==created.size)throw Error('REPORT_DOWNLOAD_MISMATCH');}
  if(blob.type!=='application/pdf'||blob.size<15000)throw Error('REPORT_INVALID');
  if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(blob);download.href=objectUrl;download.download=fileName;download.hidden=false;
  document.getElementById('pdfPreview').src=objectUrl;document.getElementById('previewBox').hidden=false;
  status.textContent=tx('تم حفظ التقرير والتحقق من تنزيله. يمكنك فتحه من حسابي في أي وقت.','Report saved and download verified. You can reopen it from My account at any time.');
 }catch(error){console.error('Saved report failed:',error);status.textContent=tx('تعذر تجهيز التقرير الآن. اضغط إعادة المحاولة.','Could not prepare the report. Please retry.');retry.hidden=false;}
}
retry.onclick=run;run();