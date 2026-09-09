(() => {
  'use strict';
  const D = window.LPP_DATA;
  const root = document.getElementById('lppApp');
  const langBtn = document.getElementById('langBtn');
  const STORAGE = 'tamayuz10x-lpp-v1';
  const ORDER = ['A','R','T','P'];
  let state = loadState();

  function defaultState(){ return { lang:'ar', screen:'start', current:0, responses:{}, startedAt:null, completedAt:null }; }
  function loadState(){
    try { return Object.assign(defaultState(), JSON.parse(localStorage.getItem(STORAGE) || '{}')); }
    catch(e){ return defaultState(); }
  }
  function save(){ localStorage.setItem(STORAGE, JSON.stringify(state)); }
  function t(en, ar){ return state.lang === 'ar' ? ar : en; }
  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function applyLang(){
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    langBtn.textContent = state.lang === 'ar' ? 'English' : 'العربية';
    document.title = t('Learning Preference Profile | Tamayuz 10X','ملف تفضيلات التعلّم | التميّز 10X');
  }
  function pairKey(a,b){ return [a,b].sort((x,y)=>ORDER.indexOf(x)-ORDER.indexOf(y)).join(''); }
  function answeredCount(){ return Object.keys(state.responses).filter(k => state.responses[k] !== null && state.responses[k] !== undefined).length; }

  function start(){
    state.screen='question';
    state.startedAt = state.startedAt || Date.now();
    if(answeredCount()===64){ state.current=63; }
    save(); render();
  }
  function reset(){
    if(!confirm(t('Retake the assessment and clear your saved answers?','هل تريد إعادة التقييم ومسح إجاباتك المحفوظة؟'))) return;
    const lang=state.lang; state=defaultState(); state.lang=lang; save(); render();
  }

  function renderStart(){
    const n=answeredCount();
    root.innerHTML = `
      <div class="lpp-hero">
        <section class="lpp-panel">
          <span class="lpp-eyebrow">${t('Your Learning Preference Profile','ملف تفضيلات تعلّمك')}</span>
          <h1>${t('How do you prefer to learn?','كيف تفضّل أن تتعلّم؟')}</h1>
          <p>${t('Explore how you typically approach learning, training, and developing a new skill. You will receive a four-part profile rather than a fixed learning “type”.','اكتشف كيف تتعامل عادةً مع التعلّم والتدريب واكتساب مهارة جديدة. ستحصل على ملف من أربعة أبعاد بدلًا من تصنيفك في «نمط» ثابت.')}</p>
          <div class="lpp-feature-list">
            <div class="lpp-feature"><i>64</i><div><strong>${t('Behavior-focused statements','عبارة تركز على السلوك')}</strong><br><span>${t('Answer based on what is typically like you.','أجب وفق ما يصفك عادةً.')}</span></div></div>
            <div class="lpp-feature"><i>0–4</i><div><strong>${t('Five-point response scale','مقياس خماسي للإجابة')}</strong><br><span>${t('From “not at all like me” to “very much like me”.','من «لا تشبهني إطلاقًا» إلى «تشبهني بدرجة كبيرة جدًا».')}</span></div></div>
            <div class="lpp-feature"><i>4</i><div><strong>${t('Four learning approaches','أربعة أساليب للتعلّم')}</strong><br><span>${t('Action, reflection, conceptual analysis, and practical application.','الممارسة، والتأمل، والتحليل المفاهيمي، والتطبيق العملي.')}</span></div></div>
          </div>
          <div class="lpp-actions">
            <button class="lpp-btn primary" id="startBtn">${n ? t('Continue assessment','متابعة التقييم') : t('Start assessment','ابدأ التقييم')}</button>
            ${n ? `<button class="lpp-btn" id="resetBtn">${t('Start again','البدء من جديد')}</button>` : ''}
          </div>
          <p class="lpp-disclaimer">${t('Pilot version: the questionnaire is content-reviewed but not yet psychometrically validated. Results are intended for reflection and development, not diagnosis or selection decisions.','نسخة تجريبية: خضع الاستبيان لمراجعة المحتوى، لكنه لم يثبت بعد سيكومتريًا. النتائج مخصصة للتأمل والتطوير، وليست للتشخيص أو قرارات الاختيار.')}</p>
        </section>
        <aside class="lpp-panel">
          <span class="lpp-eyebrow">${t('Learning cycle','دورة التعلّم')}</span>
          <h2>${t('Do → Reflect → Understand → Apply','مارس ← تأمل ← افهم ← طبّق')}</h2>
          <p>${t('The profile is designed to show where you naturally place more emphasis and where you may benefit from deliberately stretching your approach.','صُمم الملف ليُظهر أين تضع تركيزك بصورة طبيعية، وأين قد تستفيد من توسيع أسلوبك بصورة مقصودة.')}</p>
          <div class="lpp-cycle">
            <div><strong>${t('Do','مارس')}</strong><span>${t('Action Engagement','الانخراط بالممارسة')}</span></div>
            <div><strong>${t('Reflect','تأمل')}</strong><span>${t('Reflective Processing','المعالجة التأملية')}</span></div>
            <div><strong>${t('Understand','افهم')}</strong><span>${t('Conceptual Analysis','التحليل المفاهيمي')}</span></div>
            <div><strong>${t('Apply','طبّق')}</strong><span>${t('Practical Application','التطبيق العملي')}</span></div>
          </div>
        </aside>
      </div>`;
    document.getElementById('startBtn').onclick=start;
    if(document.getElementById('resetBtn')) document.getElementById('resetBtn').onclick=reset;
  }

  function renderQuestion(){
    const item=D.items[state.current], count=answeredCount(), pct=Math.round((count/64)*100), selected=state.responses[item.item_id];
    root.innerHTML=`<div class="lpp-app">
      <div class="lpp-progress-wrap">
        <div class="lpp-progress-meta"><span>${t(`Question ${state.current+1} of 64`,`السؤال ${state.current+1} من 64`)}</span><span>${t(`${count} answered`,`تمت الإجابة عن ${count}`)}</span></div>
        <div class="lpp-progress"><span style="width:${pct}%"></span></div>
      </div>
      <section class="lpp-panel lpp-question-card">
        <div class="lpp-question-number">${t('Think about how you typically learn.','فكّر في الطريقة التي تتعلّم بها عادةً.')}</div>
        <h1 class="lpp-question">${esc(state.lang==='ar'?item.arabic_item:item.english_item)}</h1>
        <div class="lpp-options" role="radiogroup" aria-label="${t('Response options','خيارات الإجابة')}">
          ${D.scale.map(o=>`<button class="lpp-option ${selected===o.value?'selected':''}" data-value="${o.value}" role="radio" aria-checked="${selected===o.value}"><span class="lpp-score">${o.value}</span><span>${esc(state.lang==='ar'?o.ar:o.en)}</span></button>`).join('')}
        </div>
        <div class="lpp-message" id="answerMsg">${t('Please select a response before continuing.','يرجى اختيار إجابة قبل المتابعة.')}</div>
        <div class="lpp-nav">
          <button class="lpp-btn" id="prevBtn" ${state.current===0?'disabled':''}>${t('Previous','السابق')}</button>
          <button class="lpp-btn primary" id="nextBtn">${state.current===63?t('View my profile','عرض ملفي'):t('Next','التالي')}</button>
        </div>
      </section>
    </div>`;
    root.querySelectorAll('.lpp-option').forEach(btn=>btn.onclick=()=>{
      state.responses[item.item_id]=Number(btn.dataset.value); save(); renderQuestion();
    });
    document.getElementById('prevBtn').onclick=()=>{ if(state.current>0){state.current--;save();renderQuestion();} };
    document.getElementById('nextBtn').onclick=()=>{
      if(state.responses[item.item_id]===undefined){document.getElementById('answerMsg').style.display='block';return;}
      if(state.current<63){state.current++;save();renderQuestion();return;}
      if(answeredCount()<64){
        const first=D.items.findIndex(i=>state.responses[i.item_id]===undefined); state.current=first; save(); renderQuestion();
        setTimeout(()=>{const m=document.getElementById('answerMsg'); if(m){m.textContent=t('Please complete the unanswered item.','يرجى إكمال البند غير المجاب عنه.');m.style.display='block';}},30); return;
      }
      state.screen='results'; state.completedAt=Date.now(); save(); render();
    };
  }

  function calculate(){
    const raw={A:0,R:0,T:0,P:0}, facets={};
    D.items.forEach(i=>{ const v=Number(state.responses[i.item_id]||0); raw[i.construct_code]+=v; facets[i.facet_code]=(facets[i.facet_code]||0)+v; });
    const percent={}; ORDER.forEach(k=>percent[k]=Math.round(raw[k]/64*100));
    const sorted=ORDER.map(k=>({code:k,score:percent[k]})).sort((a,b)=>b.score-a.score||ORDER.indexOf(a.code)-ORDER.indexOf(b.code));
    return {raw,percent,facets,sorted};
  }
  function interpretation(calc){
    const {sorted,percent}=calc, top=sorted[0], second=sorted[1], spread=Math.max(...Object.values(percent))-Math.min(...Object.values(percent)), gap=top.score-second.score;
    if(spread<=10) return {type:'balanced', title:t('Relatively Balanced Learning Profile','ملف تعلّم متوازن نسبيًا'), subtitle:t('Your four learning preferences are close together. You appear able to draw on different parts of the learning cycle without one approach strongly dominating.','تفضيلاتك الأربعة متقاربة. ويبدو أنك قادر على الاستفادة من أجزاء مختلفة من دورة التعلّم دون هيمنة قوية لأسلوب واحد.')};
    if(gap>=10) return {type:'clear', title:t(`Clear preference for ${D.constructs[top.code].en}`,`تفضيل واضح لـ ${D.constructs[top.code].ar}`), subtitle:t(`Your profile places noticeably more emphasis on ${D.constructs[top.code].en.toLowerCase()}. Treat this as a current preference, not a fixed identity.`,`يضع ملفك تركيزًا أوضح على ${D.constructs[top.code].ar}. تعامل مع ذلك كتفضيل حالي لا كهوية ثابتة.`)};
    const key=pairKey(top.code,second.code), combo=D.combinations[key];
    if(gap>=5) return {type:'lead-secondary', title:t(`${D.constructs[top.code].en} with strong ${D.constructs[second.code].en} tendencies`,`${D.constructs[top.code].ar} مع نزعة قوية نحو ${D.constructs[second.code].ar}`), subtitle:t(`Your leading preference is supported by a strong secondary approach. Together they resemble an ${combo?combo.en:'integrated learning'} pattern.`,`يدعم تفضيلك الأول أسلوب ثانٍ قوي. ويشكّلان معًا نمطًا قريبًا من «${combo?combo.ar:'تعلّم متكامل'}».`)};
    return {type:'blend', title:t(combo?combo.en:'Blended Learning Profile',combo?combo.ar:'ملف تعلّم مدمج'), subtitle:t(`Your two strongest preferences are very close: ${D.constructs[top.code].en} and ${D.constructs[second.code].en}. It is more useful to read them as a blend than to force a single label.`,`أقوى تفضيلين لديك متقاربان جدًا: ${D.constructs[top.code].ar} و${D.constructs[second.code].ar}. من الأنسب قراءتهما كمزيج بدل فرض تصنيف واحد.`)};
  }
  const develop={
    A:{en:'Deliberately enter a learning task earlier: try a small experiment, participate, or prototype before you have every detail.',ar:'ادخل في مهمة التعلّم مبكرًا بصورة مقصودة: جرّب تجربة صغيرة أو شارك أو أنشئ نموذجًا أوليًا قبل اكتمال كل التفاصيل.'},
    R:{en:'Build in a pause after experience: review what happened, compare perspectives, and note what you would change next time.',ar:'خصص وقفة بعد الخبرة: راجع ما حدث، وقارن وجهات النظر، وسجل ما الذي ستغيّره في المرة القادمة.'},
    T:{en:'Ask for the underlying principle: organize the information, test the logic, and separate evidence from assumption.',ar:'ابحث عن المبدأ الكامن: نظم المعلومات، واختبر المنطق، وميّز بين الدليل والافتراض.'},
    P:{en:'Translate learning into use: choose one real situation, test the idea, and decide what practical change follows.',ar:'حوّل التعلّم إلى استخدام: اختر موقفًا واقعيًا، واختبر الفكرة، وحدد التغيير العملي الذي يترتب عليها.'}
  };
  const facetNames={
    AF1:['Direct engagement','المشاركة المباشرة'],AF2:['Novelty & challenge','الجِدّة والتحدي'],AF3:['Exploration & adaptability','الاستكشاف والتكيّف'],AF4:['Participation & spontaneity','المشاركة والتلقائية'],
    RF1:['Deliberation & processing','التأنّي والمعالجة'],RF2:['Alternatives & judgment','البدائل والحكم'],RF3:['Perspective & observation','تعدد المنظورات والملاحظة'],RF4:['Review & learning from experience','مراجعة الخبرة والتعلّم منها'],
    TF1:['Principles & conceptual connections','المبادئ والروابط المفاهيمية'],TF2:['Structure & coherence','البنية والاتساق'],TF3:['Evidence & critical analysis','الأدلة والتحليل النقدي'],TF4:['Reasoning, abstraction & assumptions','الاستدلال والتجريد والافتراضات'],
    PF1:['Application & action','التطبيق والفعل'],PF2:['Effectiveness & testing','الفاعلية والاختبار'],PF3:['Adaptation, feasibility & improvement','التكييف والجدوى والتحسين'],PF4:['Relevance & transfer','الصلة ونقل التعلّم']
  };

  function renderResults(){
    const c=calculate(), profile=interpretation(c), low=c.sorted[c.sorted.length-1], high=c.sorted[0];
    const completionMinutes=state.startedAt&&state.completedAt?Math.max(1,Math.round((state.completedAt-state.startedAt)/60000)):null;
    root.innerHTML=`<div class="lpp-app">
      <section class="lpp-panel">
        <div class="lpp-results-head"><div><span class="lpp-eyebrow">${t('Your Learning Preference Profile','ملف تفضيلات تعلّمك')}</span><h1 class="lpp-profile-title">${esc(profile.title)}</h1><p class="lpp-profile-sub">${esc(profile.subtitle)}</p></div><div><strong>${t('Profile complete','اكتمل الملف')}</strong>${completionMinutes?`<br><span style="color:var(--muted);font-size:.85rem">${t(`About ${completionMinutes} min`,`نحو ${completionMinutes} دقيقة`)}</span>`:''}</div></div>
        <div class="lpp-score-grid">${c.sorted.map(s=>`<div class="lpp-score-row"><div class="lpp-score-name"><strong>${esc(state.lang==='ar'?D.constructs[s.code].ar:D.constructs[s.code].en)}</strong><span>${esc(state.lang==='ar'?D.constructs[s.code].blurbAr:D.constructs[s.code].blurbEn)}</span></div><div class="lpp-bar"><span style="width:${s.score}%"></span></div><div class="lpp-score-value">${s.score}%</div></div>`).join('')}</div>
        <div class="lpp-grid-2">
          <div class="lpp-insight"><h3>${t('What your strongest preference may bring','ما الذي قد يضيفه تفضيلك الأقوى')}</h3><p>${esc(t(`Your strongest current emphasis is ${D.constructs[high.code].en}. This can be a useful resource when the learning situation calls for it.`, `أقوى تركيز حالي لديك هو ${D.constructs[high.code].ar}. ويمكن أن يكون موردًا مهمًا عندما يتطلب موقف التعلّم هذا الأسلوب.`))}</p></div>
          <div class="lpp-insight"><h3>${t('A development stretch','مساحة للتطوير')}</h3><p>${esc(state.lang==='ar'?develop[low.code].ar:develop[low.code].en)}</p></div>
        </div>
        <div class="lpp-facet-wrap"><h2>${t('Your learning cycle','دورة تعلّمك')}</h2><div class="lpp-cycle-result">${ORDER.map(k=>`<div><strong>${esc(state.lang==='ar'?D.constructs[k].shortAr:D.constructs[k].shortEn)}</strong><span>${c.percent[k]}%</span></div>`).join('')}</div></div>
        <div class="lpp-facet-wrap"><h2>${t('Detailed facet profile','تفاصيل الجوانب الفرعية')}</h2><p class="lpp-profile-sub">${t('Each facet contains four items and is shown as a percentage of its maximum score. Use this detail for reflection rather than ranking yourself.','يتكون كل جانب فرعي من أربعة بنود، ويعرض كنسبة من الدرجة القصوى. استخدم هذه التفاصيل للتأمل لا لترتيب نفسك.')}</p><div class="lpp-facet-grid">${ORDER.map(k=>{const codes=Object.keys(c.facets).filter(f=>f[0]===k).sort();return `<div class="lpp-facet-card"><h4>${esc(state.lang==='ar'?D.constructs[k].ar:D.constructs[k].en)}</h4>${codes.map(f=>{const p=Math.round(c.facets[f]/16*100);const nm=facetNames[f];return `<div class="lpp-mini-row"><div><span>${esc(state.lang==='ar'?nm[1]:nm[0])}</span><div class="lpp-mini-bar"><span style="width:${p}%"></span></div></div><strong>${p}%</strong></div>`}).join('')}</div>`}).join('')}</div></div>
        <div class="lpp-actions"><button class="lpp-btn primary" id="printBtn">${t('Print / save report','طباعة / حفظ التقرير')}</button><button class="lpp-btn" id="reviewBtn">${t('Review answers','مراجعة الإجابات')}</button><button class="lpp-btn" id="retakeBtn">${t('Retake','إعادة التقييم')}</button></div>
        <p class="lpp-note">${t('Interpretation thresholds are provisional and will be reviewed after pilot data. This profile describes current preferences, not ability, intelligence, personality, or a fixed learning type.','حدود التفسير مؤقتة وستراجع بعد جمع بيانات التجربة. يصف هذا الملف تفضيلات حالية، وليس القدرة أو الذكاء أو الشخصية أو نمط تعلم ثابتًا.')}</p>
      </section></div>`;
    document.getElementById('printBtn').onclick=()=>window.print();
    document.getElementById('reviewBtn').onclick=()=>{state.screen='question';state.current=0;save();render();};
    document.getElementById('retakeBtn').onclick=reset;
  }

  function render(){ applyLang(); if(state.screen==='question') renderQuestion(); else if(state.screen==='results' && answeredCount()===64) renderResults(); else {state.screen='start';renderStart();} }
  langBtn.onclick=()=>{state.lang=state.lang==='ar'?'en':'ar';save();render();};
  render();
})();