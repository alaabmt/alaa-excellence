(() => {
  'use strict';
  const API='https://lpp-api.alaatoinnovate.workers.dev';
  const qs=new URLSearchParams(location.search);
  const code=(qs.get('session')||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
  const root=document.getElementById('dashboardRoot');
  let lang='ar';
  const tx=(en,ar)=>lang==='ar'?ar:en;
  const names={
    A:{en:'Learning by doing',ar:'التعلّم بالممارسة'},
    R:{en:'Reflection and review',ar:'التأمل والمراجعة'},
    T:{en:'Conceptual analysis',ar:'التحليل المفاهيمي'},
    P:{en:'Practical application',ar:'التطبيق العملي'}
  };
  const cls=k=>`code-${k}`;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const localToken=()=>localStorage.getItem(`tamayuz10x-lpp-trainer-token-${code}`)||'';

  function renderError(msg){
    root.innerHTML=`<h1>${tx('Group dashboard','لوحة المجموعة')}</h1><div class="lpp-session-error">${esc(msg)}</div><p>${tx('If this is an older session, open it from the browser where it was created. New sessions are saved under My Account.','إذا كانت هذه جلسة قديمة، افتحها من المتصفح الذي أُنشئت فيه. الجلسات الجديدة تُحفظ في «حسابي».')}</p>`;
  }

  async function accountDashboard(){
    try{
      const mod=await import('/assets/js/trainer-sessions-client.js');
      const r=await mod.getTrainerDashboard(code);
      return r?.dashboard||null;
    }catch(e){
      return null;
    }
  }

  async function legacyDashboard(){
    const t=localToken();
    if(!t)return null;
    try{
      const r=await fetch(`${API}/api/lpp/sessions/${encodeURIComponent(code)}/dashboard`,{headers:{Authorization:`Bearer ${t}`}});
      const d=await r.json();
      return r.ok&&d.ok?d:null;
    }catch(e){return null;}
  }

  async function load(){
    if(!code){renderError(tx('Missing session code.','رمز الجلسة غير موجود.'));return;}
    root.innerHTML=`<h1>${tx('Loading trainer dashboard…','جارٍ تحميل لوحة المدرب...')}</h1>`;
    const d=await accountDashboard()||await legacyDashboard();
    if(!d){renderError(tx('The group dashboard could not be reached.','تعذر الوصول إلى لوحة المجموعة.'));return;}
    render(d);
  }

  function sampleMessage(n){
    if(n<5)return `<div class="lpp-session-error"><strong>${tx('Very small sample','عينة صغيرة جدًا')}:</strong> ${tx('Use these results only as an early signal. Do not treat them as representative of the whole group.','استخدم النتائج كمؤشر أولي فقط، ولا تتعامل معها بوصفها ممثلة للمجموعة كلها.')}</div>`;
    if(n<10)return `<div class="lpp-session-banner"><strong>${tx('Interpret with caution','فسّر بحذر')}:</strong> ${tx('The group picture is becoming useful, but it can still shift as more participants complete the assessment.','بدأت صورة المجموعة تصبح مفيدة، لكنها قد تتغير مع اكتمال مشاركين إضافيين.')}</div>`;
    return `<div class="lpp-session-banner"><strong>${tx('Group picture','صورة المجموعة')}:</strong> ${tx('The completed-response base is now more useful for session design. Keep interpreting it as a preference profile, not a fixed label.','أصبح عدد الاستجابات المكتملة أكثر فائدة لتصميم الجلسة. استمر في تفسيرها كتفضيلات تعلم، لا كتصنيف ثابت.')}</div>`;
  }

  function diversity(dist,n){
    const vals=['A','R','T','P','balanced'].map(k=>Number(dist?.[k]||0));
    const total=vals.reduce((a,b)=>a+b,0)||n||0;
    if(!total)return {key:'none',label:tx('Not enough data','بيانات غير كافية'),note:tx('More completed assessments are needed.','نحتاج إلى تقييمات مكتملة إضافية.')};
    const share=Math.max(...vals)/total;
    if(share>=0.7)return {key:'concentrated',label:tx('More concentrated group','مجموعة أكثر تقاربًا'),note:tx('One leading profile is relatively common. Keep variety in the session so other preferences are not excluded.','يوجد ملف بارز أكثر شيوعًا نسبيًا. حافظ على تنوع أساليب الجلسة حتى لا تُستبعد التفضيلات الأخرى.')};
    if(share<=0.4)return {key:'diverse',label:tx('Highly diverse group','مجموعة عالية التنوع'),note:tx('Preferences are distributed across the group. Use mixed methods and varied activity formats.','التفضيلات موزعة داخل المجموعة. استخدم أساليب متعددة وصيغ أنشطة متنوعة.')};
    return {key:'moderate',label:tx('Moderately diverse group','مجموعة متوسطة التنوع'),note:tx('There is a visible tendency, but the group still contains meaningful variation.','يوجد اتجاه ظاهر، مع بقاء اختلافات مهمة داخل المجموعة.')};
  }

  function recommendations(avg,dist,n){
    const entries=['A','R','T','P'].map(k=>[k,Number(avg?.[k]||0)]).sort((a,b)=>b[1]-a[1]);
    const high=entries[0]?.[0],low=entries.at(-1)?.[0];
    const rec=[];
    if(high==='A')rec.push(tx('Use short explanations followed quickly by exercises, demonstrations, or live practice.','اجعل الشرح قصيرًا، ثم انتقل سريعًا إلى تمرين أو تجربة أو ممارسة مباشرة.'));
    if(high==='R')rec.push(tx('Build in short pauses for reflection, review, note-taking, and debriefing after activities.','أضف توقفات قصيرة للتأمل والمراجعة وتدوين الملاحظات واستخلاص التعلم بعد الأنشطة.'));
    if(high==='T')rec.push(tx('Make frameworks, logic, models, and conceptual links explicit before asking for application.','وضّح الأطر والمنطق والنماذج والروابط المفاهيمية قبل الانتقال إلى التطبيق.'));
    if(high==='P')rec.push(tx('Connect each concept to a realistic case, decision, tool, or workplace application.','اربط كل مفهوم بحالة واقعية أو قرار أو أداة أو تطبيق في بيئة العمل.'));
    if(low)rec.push(tx(`Do not neglect ${names[low].en}; deliberately include at least one activity that serves it.`,`لا تهمل «${names[low].ar}»؛ أضف عمدًا نشاطًا واحدًا على الأقل يخدم هذا البعد.`));
    const d=diversity(dist,n);
    if(d.key==='diverse')rec.push(tx('Use mixed small groups and rotate activity formats instead of relying on one teaching method.','استخدم مجموعات صغيرة متنوعة وبدّل صيغ الأنشطة بدل الاعتماد على أسلوب تدريبي واحد.'));
    if(d.key==='concentrated')rec.push(tx('Do not let the dominant preference become the only teaching method; retain at least one activity for each of the other learning needs.','لا تجعل التفضيل الغالب هو أسلوب التدريب الوحيد؛ احتفظ بنشاط واحد على الأقل يخدم احتياجات التعلم الأخرى.'));
    return rec;
  }

  function render(d){
    const avg=d.averages||{},dist=d.distribution||{},n=d.participant_count??d.completed_participants??0;
    const scoreCards=['A','R','T','P'].map(k=>`<div class="trainer-score ${cls(k)}"><span>${esc(names[k][lang])}</span><b>${Number(avg[k]||0).toFixed(1)}%</b></div>`).join('');
    const hasDistribution=Object.keys(dist).length>0;
    const dv=diversity(dist,n);
    const recs=recommendations(avg,dist,n);
    const sorted=['A','R','T','P'].map(k=>[k,Number(avg[k]||0)]).sort((a,b)=>b[1]-a[1]);
    const top=sorted[0]?.[0],bottom=sorted.at(-1)?.[0];
    root.innerHTML=`
      <div class="lpp-results-head"><div><span class="lpp-eyebrow">${tx('Trainer Group Dashboard','لوحة المدرب للمجموعة')}</span><h1 class="lpp-profile-title">${esc(d.session?.name||tx('Learning Preference Group','مجموعة تفضيلات التعلّم'))}</h1><p class="lpp-profile-sub">${tx(`Session ${code} · ${n} completed participants`,`الجلسة ${code} · ${n} مشاركًا أكملوا التقييم`)}</p></div><button class="lpp-btn" id="refreshDash">${tx('Refresh','تحديث')}</button></div>
      ${sampleMessage(n)}
      <div class="lpp-section-block"><h2>${tx('1. Group picture','1. صورة المجموعة')}</h2><div class="trainer-summary">${scoreCards}</div></div>
      ${hasDistribution?`<div class="lpp-section-block"><h2>${tx('2. Leading-profile distribution','2. توزيع الملفات البارزة')}</h2><div class="lpp-meaning-grid">${['A','R','T','P'].map(k=>`<article class="lpp-meaning-card ${cls(k)}"><div class="lpp-card-head"><h3>${esc(names[k][lang])}</h3><strong>${dist[k]||0}</strong></div></article>`).join('')}<article class="lpp-meaning-card"><div class="lpp-card-head"><h3>${tx('Relatively balanced','متوازن نسبيًا')}</h3><strong>${dist.balanced||0}</strong></div></article></div><div class="lpp-session-banner"><strong>${esc(dv.label)}</strong> — ${esc(dv.note)}</div></div>`:''}
      <div class="lpp-section-block"><h2>${tx('3. What do the results mean?','3. ماذا تعني النتائج؟')}</h2><p class="lpp-profile-sub">${top?tx(`The strongest group tendency is toward ${names[top].en}. The lowest relative score is ${names[bottom].en}. This is a design signal, not a judgement of ability.`,`أقوى اتجاه في المجموعة هو «${names[top].ar}»، بينما يظهر «${names[bottom].ar}» بأقل متوسط نسبي. هذه إشارة لتصميم التدريب، وليست حكمًا على قدرات المشاركين.`):tx('More results are needed for interpretation.','نحتاج إلى نتائج إضافية للتفسير.')}</p></div>
      <div class="lpp-section-block"><h2>${tx('4. What should I change in my training?','4. ماذا أغيّر في تدريبي؟')}</h2><div class="lpp-meaning-grid">${recs.map((r,i)=>`<article class="lpp-meaning-card"><div class="lpp-card-head"><strong>${i+1}</strong></div><p>${esc(r)}</p></article>`).join('')}</div></div>
      <div class="lpp-section-block"><h2>${tx('5. How to use this responsibly','5. كيف تستخدمها بمسؤولية؟')}</h2><p class="lpp-profile-sub">${tx('Use group-level patterns to balance the learning experience. Do not label the whole group with one fixed type, and do not infer individual capability from a preference score. Individual reports remain personal by default.','استخدم الأنماط الجماعية لموازنة تجربة التعلم. لا تصنّف المجموعة كلها في نمط ثابت، ولا تستنتج قدرة الفرد من درجة تفضيل. تبقى التقارير الفردية شخصية افتراضيًا.')}</p></div>`;
    document.getElementById('refreshDash').onclick=load;
  }

  document.getElementById('dashLang').onclick=()=>{lang=lang==='ar'?'en':'ar';document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.getElementById('dashLang').textContent=lang==='ar'?'English':'العربية';load();};
  load();
})();