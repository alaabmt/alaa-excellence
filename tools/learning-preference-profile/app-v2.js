(() => {
  'use strict';
  const D = window.LPP_DATA;

  D.constructs.A.ar = 'التَّعَلُّم بالمُمارَسَة';
  D.constructs.A.shortAr = 'المُمارَسَة';
  D.constructs.R.ar = 'التَّأَمُّل والمُراجَعَة';
  D.constructs.R.shortAr = 'التَّأَمُّل';
  D.constructs.T.ar = 'التَّحليل المَفاهيمي';
  D.constructs.T.shortAr = 'الفَهْم';
  D.constructs.P.ar = 'التَّطبيق العَمَلي';
  D.constructs.P.shortAr = 'التَّطبيق';

  D.combinations.AR.ar = 'مزيج المُمارَسَة والتَّأَمُّل';
  D.combinations.AT.ar = 'مزيج المُمارَسَة والتَّحليل';
  D.combinations.AP.ar = 'مزيج المُمارَسَة والتَّطبيق';
  D.combinations.RT.ar = 'مزيج التَّأَمُّل والتَّحليل';
  D.combinations.RP.ar = 'مزيج التَّأَمُّل والتَّطبيق';
  D.combinations.TP.ar = 'مزيج التَّحليل والتَّطبيق';

  const root = document.getElementById('lppApp');
  const langBtn = document.getElementById('langBtn');
  const STORAGE = 'tamayuz10x-lpp-v1';
  const ORDER = ['A','R','T','P'];
  let state = loadState();

  function defaultState(){ return { lang:'ar', screen:'start', current:0, responses:{}, startedAt:null, completedAt:null }; }
  function loadState(){ try { return Object.assign(defaultState(), JSON.parse(localStorage.getItem(STORAGE) || '{}')); } catch(e){ return defaultState(); } }
  function save(){ localStorage.setItem(STORAGE, JSON.stringify(state)); }
  function t(en, ar){ return state.lang === 'ar' ? ar : en; }
  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function applyLang(){ document.documentElement.lang = state.lang; document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr'; langBtn.textContent = state.lang === 'ar' ? 'English' : 'العربية'; document.title = t('Learning Preference Profile | Tamayuz 10X','ملف تفضيلات التعلّم | التميّز 10X'); }
  function pairKey(a,b){ return [a,b].sort((x,y)=>ORDER.indexOf(x)-ORDER.indexOf(y)).join(''); }
  function answeredCount(){ return Object.keys(state.responses).filter(k => state.responses[k] !== null && state.responses[k] !== undefined).length; }
  function start(){ state.screen='question'; state.startedAt = state.startedAt || Date.now(); if(answeredCount()===64) state.current=63; save(); render(); }
  function reset(){ if(!confirm(t('Retake the assessment and clear your saved answers?','هل تريد إعادة التقييم ومسح إجاباتك المحفوظة؟'))) return; const lang=state.lang; state=defaultState(); state.lang=lang; save(); render(); }

  const participant = {
    A:{
      helpsEn:'You may learn quickly when you can participate, try, experiment, and adjust as you go.',
      helpsAr:'قد تتعلّم بسرعة عندما تتاح لك فرصة المشاركة والتجربة والمحاولة والتكيّف أثناء التعلّم.',
      watchEn:'If overused, you may move to the next action before extracting the lesson from what happened.',
      watchAr:'إذا أفرطت في الاعتماد عليه، فقد تنتقل إلى الخطوة التالية قبل أن تستخلص ما تعلّمته من التجربة.',
      nextEn:'After an activity, pause for two minutes and write: What happened? What did I learn? What will I change?',
      nextAr:'بعد أي نشاط، توقّف دقيقتين واكتب: ماذا حدث؟ ماذا تعلّمت؟ وما الذي سأغيّره في المحاولة التالية؟',
      exampleEn:'Useful when learning a new system, practising a skill, joining a simulation, or starting a prototype.',
      exampleAr:'يفيدك عند تعلّم نظام جديد، أو ممارسة مهارة، أو المشاركة في محاكاة، أو بدء نموذج أولي.'
    },
    R:{
      helpsEn:'You may learn well when you have time to observe, review, compare viewpoints, and think before concluding.',
      helpsAr:'قد تتعلّم بصورة أفضل عندما يتاح لك وقت للملاحظة والمراجعة ومقارنة وجهات النظر والتفكير قبل الاستنتاج.',
      watchEn:'If overused, reflection can delay trying, deciding, or testing an idea.',
      watchAr:'إذا أفرطت في الاعتماد عليه، فقد يطول التفكير على حساب التجربة أو اتخاذ القرار أو اختبار الفكرة.',
      nextEn:'Set a clear reflection deadline, then test one small action rather than continuing to analyse indefinitely.',
      nextAr:'حدّد وقتًا واضحًا للتفكير، ثم انتقل إلى تجربة عملية صغيرة بدل الاستمرار في التحليل دون نهاية.',
      exampleEn:'Useful after a project, case discussion, feedback session, difficult decision, or unfamiliar experience.',
      exampleAr:'يفيدك بعد مشروع، أو مناقشة حالة، أو جلسة تغذية راجعة، أو قرار صعب، أو تجربة غير مألوفة.'
    },
    T:{
      helpsEn:'You may learn well when the logic is clear and you can understand principles, evidence, relationships, and assumptions.',
      helpsAr:'قد تتعلّم بصورة أفضل عندما يكون المنطق واضحًا وتفهم المبادئ والأدلة والعلاقات والافتراضات وراء الموضوع.',
      watchEn:'If overused, you may wait for a complete explanation before engaging with an imperfect real situation.',
      watchAr:'إذا أفرطت في الاعتماد عليه، فقد تنتظر تفسيرًا مكتملًا قبل التعامل مع موقف واقعي غير مثالي.',
      nextEn:'Choose one principle and test it in a real case before trying to perfect the whole model.',
      nextAr:'اختر مبدأً واحدًا واختبره في حالة واقعية قبل محاولة إكمال النموذج أو التفسير بالكامل.',
      exampleEn:'Useful with complex topics, policies, research, frameworks, root-cause analysis, and evidence-based decisions.',
      exampleAr:'يفيدك في الموضوعات المعقدة والسياسات والبحوث والأطر وتحليل الأسباب الجذرية والقرارات المبنية على الأدلة.'
    },
    P:{
      helpsEn:'You may learn well when you can see how an idea works in practice and what useful result it can produce.',
      helpsAr:'قد تتعلّم بصورة أفضل عندما ترى كيف تُستخدم الفكرة عمليًا وما النتيجة المفيدة التي يمكن أن تحققها.',
      watchEn:'If overused, you may dismiss useful ideas too early when their immediate application is not obvious.',
      watchAr:'إذا أفرطت في الاعتماد عليه، فقد تستبعد فكرة مفيدة مبكرًا إذا لم يظهر تطبيقها المباشر فورًا.',
      nextEn:'Before asking only “How can I use this?”, also ask “What principle might make this useful in other situations?”',
      nextAr:'قبل أن تسأل فقط «كيف أستخدم هذا؟»، اسأل أيضًا «ما المبدأ الذي قد يجعل هذه الفكرة مفيدة في مواقف أخرى؟».',
      exampleEn:'Useful in workplace improvement, implementation planning, solving operational problems, and applying new methods.',
      exampleAr:'يفيدك في تحسين العمل والتخطيط للتنفيذ وحل المشكلات التشغيلية وتطبيق الأساليب الجديدة.'
    }
  };

  const trainer = {
    A:{
      needsEn:'Opportunities to participate early, experiment, respond, and learn through direct involvement.',
      needsAr:'فرصًا للمشاركة المبكرة والتجريب والاستجابة والتعلّم من خلال الانخراط المباشر.',
      engageEn:'Use simulations, short experiments, demonstrations with participation, role-play, and rapid prototypes.',
      engageAr:'استخدم المحاكاة والتجارب القصيرة والعروض التشاركية ولعب الأدوار والنماذج الأولية السريعة.',
      avoidEn:'Long passive explanation before any opportunity to act.',
      avoidAr:'الإطالة في الشرح السلبي قبل إتاحة أي فرصة للممارسة.',
      coachEn:'What could you try now, on a small scale, to learn more?',
      coachAr:'ما التجربة الصغيرة التي يمكنك تنفيذها الآن لتتعلّم أكثر؟'
    },
    R:{
      needsEn:'Time to observe, process information, compare perspectives, and review experience before responding.',
      needsAr:'وقتًا للملاحظة ومعالجة المعلومات ومقارنة وجهات النظر ومراجعة الخبرة قبل الاستجابة.',
      engageEn:'Use observation periods, debriefs, learning journals, paired reflection, case review, and silent thinking time.',
      engageAr:'استخدم فترات الملاحظة واستخلاص الدروس ومذكرات التعلّم والتأمل الثنائي ومراجعة الحالات ووقت التفكير الصامت.',
      avoidEn:'Forcing an immediate public response before adequate processing time.',
      avoidAr:'إجبار المشارك على استجابة علنية فورية قبل منحه وقتًا كافيًا للتفكير.',
      coachEn:'What did you notice, and what changed your interpretation?',
      coachAr:'ما الذي لاحظته؟ وما الذي غيّر تفسيرك للموقف؟'
    },
    T:{
      needsEn:'Clear structure, principles, reasoning, evidence, definitions, and links between ideas.',
      needsAr:'بنية واضحة ومبادئ واستدلالًا وأدلة وتعريفات وروابط بين الأفكار.',
      engageEn:'Use models, concept maps, evidence comparison, structured explanations, root-cause analysis, and assumption testing.',
      engageAr:'استخدم النماذج وخرائط المفاهيم ومقارنة الأدلة والشرح المنظّم وتحليل الأسباب الجذرية وفحص الافتراضات.',
      avoidEn:'Presenting disconnected activities without explaining why they matter or how they fit together.',
      avoidAr:'تقديم أنشطة متفرقة دون توضيح سبب أهميتها أو كيفية ترابطها.',
      coachEn:'What principle or evidence best explains what is happening here?',
      coachAr:'ما المبدأ أو الدليل الذي يفسّر ما يحدث هنا بصورة أفضل؟'
    },
    P:{
      needsEn:'Visible relevance, practical examples, realistic constraints, and a clear route from learning to use.',
      needsAr:'صلة واضحة بالواقع وأمثلة عملية وقيودًا واقعية ومسارًا واضحًا من التعلّم إلى الاستخدام.',
      engageEn:'Use real cases, implementation plans, job aids, problem-solving tasks, transfer exercises, and practical feedback.',
      engageAr:'استخدم الحالات الواقعية وخطط التنفيذ وأدوات العمل ومهام حل المشكلات وتمارين نقل التعلّم والتغذية الراجعة العملية.',
      avoidEn:'Theory that remains abstract without showing where or when it can be applied.',
      avoidAr:'النظرية التي تبقى مجرّدة دون توضيح أين وكيف يمكن تطبيقها.',
      coachEn:'Where could you use this, and what would success look like in practice?',
      coachAr:'أين يمكنك استخدام هذا؟ وكيف سيبدو النجاح عمليًا؟'
    }
  };

  const develop={
    A:{en:'Deliberately enter a learning task earlier: try a small experiment, participate, or prototype before you have every detail.',ar:'ادخل في مهمة التعلّم مبكرًا بصورة مقصودة: جرّب تجربة صغيرة أو شارك أو أنشئ نموذجًا أوليًا قبل اكتمال كل التفاصيل.'},
    R:{en:'Build in a pause after experience: review what happened, compare perspectives, and note what you would change next time.',ar:'خصص وقفة بعد الخبرة: راجع ما حدث، وقارن وجهات النظر، وسجل ما الذي ستغيّره في المرة القادمة.'},
    T:{en:'Ask for the underlying principle: organize the information, test the logic, and separate evidence from assumption.',ar:'ابحث عن الفكرة أو المبدأ الأساسي: نظّم المعلومات، واختبر المنطق، وميّز بين الدليل والافتراض.'},
    P:{en:'Translate learning into use: choose one real situation, test the idea, and decide what practical change follows.',ar:'حوّل التعلّم إلى استخدام: اختر موقفًا واقعيًا، واختبر الفكرة، وحدد التغيير العملي الذي يترتب عليها.'}
  };

  const facetNames={
    AF1:['Direct engagement','المشاركة المباشرة'],AF2:['Novelty & challenge','التجارب الجديدة والتحدّي'],AF3:['Exploration & adaptability','الاستكشاف والتكيّف'],AF4:['Participation & spontaneity','المشاركة والمبادرة'],
    RF1:['Deliberation & processing','التأنّي والتفكير'],RF2:['Alternatives & judgment','مقارنة البدائل واتخاذ القرار'],RF3:['Perspective & observation','تعدد وجهات النظر والملاحظة'],RF4:['Review & learning from experience','مراجعة الخبرة والتعلّم منها'],
    TF1:['Principles & conceptual connections','المبادئ والروابط بين الأفكار'],TF2:['Structure & coherence','البنية والاتساق'],TF3:['Evidence & critical analysis','الأدلة والتحليل النقدي'],TF4:['Reasoning, abstraction & assumptions','الاستدلال والمبادئ والافتراضات'],
    PF1:['Application & action','التطبيق والفعل'],PF2:['Effectiveness & testing','اختبار الفاعلية'],PF3:['Adaptation, feasibility & improvement','التكيّف العملي والتحسين'],PF4:['Relevance & transfer','الارتباط بالواقع ونقل التعلّم']
  };

  function renderStart(){
    const n=answeredCount();
    root.innerHTML = `<div class="lpp-hero"><section class="lpp-panel"><span class="lpp-eyebrow">${t('Your Learning Preference Profile','ملف تفضيلات تعلّمك')}</span><h1>${t('How do you prefer to learn?','كيف تُفَضِّل أن تَتَعَلَّم؟')}</h1><p>${t('Explore how you typically approach learning, training, and developing a new skill. You will receive a four-part profile rather than a fixed learning “type”.','اكتشف كيف تتعامل عادةً مع التعلّم والتدريب واكتساب مهارة جديدة. ستحصل على ملف من أربعة أبعاد بدلًا من تصنيفك في «نمط» ثابت.')}</p><div class="lpp-feature-list"><div class="lpp-feature"><i>64</i><div><strong>${t('Behavior-focused statements','عبارة تركز على السلوك')}</strong><br><span>${t('Answer based on what is typically like you.','أجب وفق ما يصفك عادةً.')}</span></div></div><div class="lpp-feature"><i>0–4</i><div><strong>${t('Five-point response scale','مقياس خماسي للإجابة')}</strong><br><span>${t('From “not at all like me” to “very much like me”.','من «لا تشبهني إطلاقًا» إلى «تشبهني بدرجة كبيرة جدًا».')}</span></div></div><div class="lpp-feature"><i>4</i><div><strong>${t('Four learning approaches','أربعة أساليب للتعلّم')}</strong><br><span>${t('Action, reflection, conceptual analysis, and practical application.','الممارسة، والتأمل، والتحليل المفاهيمي، والتطبيق العملي.')}</span></div></div></div><div class="lpp-actions"><button class="lpp-btn primary" id="startBtn">${n ? t('Continue assessment','متابعة التقييم') : t('Start assessment','ابدأ التقييم')}</button>${n ? `<button class="lpp-btn" id="resetBtn">${t('Start again','البدء من جديد')}</button>` : ''}</div><p class="lpp-disclaimer">${t('Pilot version: the questionnaire is content-reviewed but not yet psychometrically validated. Results are intended for reflection and development, not diagnosis or selection decisions.','نسخة تجريبية: خضع الاستبيان لمراجعة المحتوى، لكنه لم يثبت بعد سيكومتريًا. النتائج مخصصة للتأمل والتطوير، وليست للتشخيص أو قرارات الاختيار.')}</p></section><aside class="lpp-panel"><span class="lpp-eyebrow">${t('Learning cycle','دَوْرَة التَّعَلُّم')}</span><h2>${t('Do → Reflect → Understand → Apply','مارِس ← تَأَمَّل ← اِفْهَم ← طَبِّق')}</h2><p>${t('The profile is designed to show where you naturally place more emphasis and where you may benefit from deliberately stretching your approach.','صُمم الملف ليُظهر أين تضع تركيزك بصورة طبيعية، وأين قد تستفيد من توسيع أسلوبك بصورة مقصودة.')}</p><div class="lpp-cycle">${ORDER.map(k=>`<div class="code-${k}"><strong>${esc(state.lang==='ar'?D.constructs[k].shortAr:D.constructs[k].shortEn)}</strong><span>${esc(state.lang==='ar'?D.constructs[k].ar:D.constructs[k].en)}</span></div>`).join('')}</div></aside></div>`;
    document.getElementById('startBtn').onclick=start; if(document.getElementById('resetBtn')) document.getElementById('resetBtn').onclick=reset;
  }

  function renderQuestion(){
    const item=D.items[state.current], count=answeredCount(), pct=Math.round((count/64)*100), selected=state.responses[item.item_id];
    root.innerHTML=`<div class="lpp-app"><div class="lpp-progress-wrap"><div class="lpp-progress-meta"><span>${t(`Question ${state.current+1} of 64`,`السؤال ${state.current+1} من 64`)}</span><span>${t(`${count} answered`,`تمت الإجابة عن ${count}`)}</span></div><div class="lpp-progress"><span style="width:${pct}%"></span></div></div><section class="lpp-panel lpp-question-card"><div class="lpp-question-number">${t('Think about how you typically learn.','فكّر في الطريقة التي تتعلّم بها عادةً.')}</div><h1 class="lpp-question">${esc(state.lang==='ar'?item.arabic_item:item.english_item)}</h1><div class="lpp-options" role="radiogroup">${D.scale.map(o=>`<button class="lpp-option ${selected===o.value?'selected':''}" data-value="${o.value}" role="radio" aria-checked="${selected===o.value}"><span class="lpp-score">${o.value}</span><span>${esc(state.lang==='ar'?o.ar:o.en)}</span></button>`).join('')}</div><div class="lpp-message" id="answerMsg">${t('Please select a response before continuing.','يرجى اختيار إجابة قبل المتابعة.')}</div><div class="lpp-nav"><button class="lpp-btn" id="prevBtn" ${state.current===0?'disabled':''}>${t('Previous','السابق')}</button><button class="lpp-btn primary" id="nextBtn">${state.current===63?t('View my profile','عرض ملفي'):t('Next','التالي')}</button></div></section></div>`;
    root.querySelectorAll('.lpp-option').forEach(btn=>btn.onclick=()=>{state.responses[item.item_id]=Number(btn.dataset.value); save(); renderQuestion();});
    document.getElementById('prevBtn').onclick=()=>{ if(state.current>0){state.current--;save();renderQuestion();} };
    document.getElementById('nextBtn').onclick=()=>{ if(state.responses[item.item_id]===undefined){document.getElementById('answerMsg').style.display='block';return;} if(state.current<63){state.current++;save();renderQuestion();return;} if(answeredCount()<64){const first=D.items.findIndex(i=>state.responses[i.item_id]===undefined); state.current=first; save(); renderQuestion(); return;} state.screen='results'; state.completedAt=Date.now(); save(); render(); };
  }

  function calculate(){ const raw={A:0,R:0,T:0,P:0}, facets={}; D.items.forEach(i=>{ const v=Number(state.responses[i.item_id]||0); raw[i.construct_code]+=v; facets[i.facet_code]=(facets[i.facet_code]||0)+v; }); const percent={}; ORDER.forEach(k=>percent[k]=Math.round(raw[k]/64*100)); const sorted=ORDER.map(k=>({code:k,score:percent[k]})).sort((a,b)=>b.score-a.score||ORDER.indexOf(a.code)-ORDER.indexOf(b.code)); return {raw,percent,facets,sorted}; }
  function interpretation(calc){ const {sorted,percent}=calc, top=sorted[0], second=sorted[1], spread=Math.max(...Object.values(percent))-Math.min(...Object.values(percent)), gap=top.score-second.score; if(spread<=10) return {type:'balanced',title:t('Relatively Balanced Learning Profile','مَلَفّ تَعَلُّم مُتَوازِن نِسبيًّا'),subtitle:t('Your four learning preferences are close together. Small score differences should not be treated as major differences in how you learn.','تفضيلاتك الأربعة متقاربة. لذلك لا ينبغي اعتبار الفروق الصغيرة بين النسب فروقًا كبيرة في طريقة تعلّمك.')}; if(gap>=10) return {type:'clear',title:t(`Clear preference for ${D.constructs[top.code].en}`,`تَفْضيل واضِح لِـ ${D.constructs[top.code].ar}`),subtitle:t('This is a current preference, not a fixed identity. The other approaches remain available to you.','هذا تفضيل حالي وليس هوية ثابتة، وتبقى الأساليب الأخرى جزءًا من قدرتك على التعلّم.')}; const key=pairKey(top.code,second.code), combo=D.combinations[key]; if(gap>=5) return {type:'lead-secondary',title:t(`${D.constructs[top.code].en} with strong ${D.constructs[second.code].en} tendencies`,`${D.constructs[top.code].ar} مع ميل قوي نحو ${D.constructs[second.code].ar}`),subtitle:t('Two approaches stand out in your profile, with one slightly ahead of the other.','يبرز في ملفك أسلوبان بصورة واضحة، مع تقدّم بسيط لأحدهما على الآخر.')}; return {type:'blend',title:t(combo?combo.en:'Blended Learning Profile',combo?combo.ar:'مَلَفّ تَعَلُّم مُدْمَج'),subtitle:t('Your two leading preferences are very close. It is more useful to read them as a blend than to force one label.','أقوى تفضيلين لديك متقاربان جدًا، ومن الأنسب قراءتهما كمزيج بدل فرض تصنيف واحد.')}; }

  function participantCards(c){ return ORDER.map(k=>{const p=participant[k]; return `<article class="lpp-guidance-card code-${k}"><h3>${esc(state.lang==='ar'?D.constructs[k].ar:D.constructs[k].en)} <span>${c.percent[k]}%</span></h3><div class="lpp-guidance-block"><strong>${t('How this may help','كيف قد يساعدك')}</strong><p>${esc(state.lang==='ar'?p.helpsAr:p.helpsEn)}</p></div><div class="lpp-guidance-block"><strong>${t('When overused','عندما تعتمد عليه أكثر من اللازم')}</strong><p>${esc(state.lang==='ar'?p.watchAr:p.watchEn)}</p></div><div class="lpp-guidance-block"><strong>${t('A practical next step','خطوة عملية مقترحة')}</strong><p>${esc(state.lang==='ar'?p.nextAr:p.nextEn)}</p></div><div class="lpp-guidance-block"><strong>${t('Where it may show up','أين قد يظهر هذا التفضيل')}</strong><p>${esc(state.lang==='ar'?p.exampleAr:p.exampleEn)}</p></div></article>`}).join(''); }

  function trainerReport(c){
    const high=c.sorted[0], low=c.sorted[c.sorted.length-1];
    return `<section class="lpp-trainer-report hidden" id="trainerReport"><div class="lpp-trainer-head"><div><span class="lpp-eyebrow">${t('Trainer / Facilitator View','تَقْرير المُدَرِّب / المُيَسِّر')}</span><h2>${t('How to support this learner','كيف تدعم هذا المُتَعَلِّم')}</h2><p>${t('Use this as a conversation and design guide, not as a prescription or a reason to teach only in the participant’s strongest mode.','استخدم هذا التقرير كدليل للحوار وتصميم التعلّم، وليس كوصفة ثابتة أو سبب لتدريس المشارك فقط وفق تفضيله الأعلى.')}</p></div><button class="lpp-btn" id="closeTrainer">${t('Back to participant report','العودة لتقرير المشارك')}</button></div><div class="lpp-trainer-summary"><div><strong>${t('Most prominent current preference','أبرز تفضيل حالي')}</strong><span>${esc(state.lang==='ar'?D.constructs[high.code].ar:D.constructs[high.code].en)} — ${high.score}%</span></div><div><strong>${t('Useful stretch area','مجال مفيد للتوسّع')}</strong><span>${esc(state.lang==='ar'?D.constructs[low.code].ar:D.constructs[low.code].en)} — ${low.score}%</span></div></div><h3 class="lpp-section-title">${t('Facilitation guidance by learning approach','إرشادات التيسير حسب أسلوب التعلّم')}</h3><div class="lpp-trainer-grid">${c.sorted.map(s=>{const g=trainer[s.code];return `<article class="lpp-trainer-card code-${s.code}"><h4>${esc(state.lang==='ar'?D.constructs[s.code].ar:D.constructs[s.code].en)} <span>${s.score}%</span></h4><p><strong>${t('Learner may benefit from:','قد يستفيد المتعلّم من:')}</strong> ${esc(state.lang==='ar'?g.needsAr:g.needsEn)}</p><p><strong>${t('Use:','استخدم:')}</strong> ${esc(state.lang==='ar'?g.engageAr:g.engageEn)}</p><p><strong>${t('Avoid over-relying on:','تجنّب الإفراط في:')}</strong> ${esc(state.lang==='ar'?g.avoidAr:g.avoidEn)}</p><p><strong>${t('Coaching question:','سؤال حواري:')}</strong> ${esc(state.lang==='ar'?g.coachAr:g.coachEn)}</p></article>`}).join('')}</div><div class="lpp-trainer-design"><h3>${t('Recommended learning-session mix','مزيج مقترح لتصميم جلسة التعلّم')}</h3><p>${t('Even when one preference leads, design across the whole cycle: include an experience or activity, time to reflect, a clear explanation or model, and an opportunity to apply learning to a real situation.','حتى عندما يتقدّم تفضيل واحد، صمّم الجلسة عبر دورة التعلّم كاملة: نشاط أو خبرة، ثم وقت للتأمل والمراجعة، ثم شرح أو نموذج واضح، ثم فرصة لتطبيق التعلّم في موقف واقعي.')}</p><div class="lpp-cycle-result">${ORDER.map(k=>`<div class="code-${k}"><strong>${esc(state.lang==='ar'?D.constructs[k].shortAr:D.constructs[k].shortEn)}</strong><span>${t('Include intentionally','أدرجه بصورة مقصودة')}</span></div>`).join('')}</div></div><div class="lpp-trainer-boundary"><strong>${t('Important boundary','حَدّ مُهِم')}</strong><p>${t('Do not use this report to label, grade, select, exclude, or infer ability. Scores describe current self-reported preferences and the interpretation rules remain provisional until pilot validation.','لا تستخدم هذا التقرير للتصنيف أو التقييم أو الاختيار أو الاستبعاد أو استنتاج القدرة. الدرجات تصف تفضيلات حالية يقررها المشارك عن نفسه، وما زالت قواعد التفسير مؤقتة إلى حين التحقق منها بعد الدراسة التجريبية.')}</p></div><div class="lpp-actions"><button class="lpp-btn primary" id="printTrainer">${t('Print trainer report','طباعة تقرير المدرّب')}</button></div></section>`;
  }

  function renderResults(){
    const c=calculate(), profile=interpretation(c), low=c.sorted[c.sorted.length-1], high=c.sorted[0];
    const completionMinutes=state.startedAt&&state.completedAt?Math.max(1,Math.round((state.completedAt-state.startedAt)/60000)):null;
    root.innerHTML=`<div class="lpp-app"><section class="lpp-panel" id="participantReport"><div class="lpp-results-head"><div><span class="lpp-eyebrow">${t('Your Learning Preference Profile','ملف تفضيلات تعلّمك')}</span><h1 class="lpp-profile-title">${esc(profile.title)}</h1><p class="lpp-profile-sub">${esc(profile.subtitle)}</p></div><div><strong>${t('Profile complete','اكتمل الملف')}</strong>${completionMinutes?`<br><span style="color:var(--muted);font-size:.85rem">${t(`About ${completionMinutes} min`,`نحو ${completionMinutes} دقيقة`)}</span>`:''}</div></div><div class="lpp-score-grid">${c.sorted.map(s=>`<div class="lpp-score-row code-${s.code}"><div class="lpp-score-name"><strong>${esc(state.lang==='ar'?D.constructs[s.code].ar:D.constructs[s.code].en)}</strong><span>${esc(state.lang==='ar'?D.constructs[s.code].blurbAr:D.constructs[s.code].blurbEn)}</span></div><div class="lpp-bar"><span style="width:${s.score}%"></span></div><div class="lpp-score-value">${s.score}%</div></div>`).join('')}</div><div class="lpp-grid-2"><div class="lpp-insight"><h3>${t('What your strongest preference may bring','ما الذي قد يضيفه تفضيلك الأقوى')}</h3><p>${esc(t(`Your strongest current emphasis is ${D.constructs[high.code].en}. This can be a useful resource when the learning situation calls for it.`, `أقوى تركيز حالي لديك هو ${D.constructs[high.code].ar}. ويمكن أن يكون نقطة قوة مهمّة عندما يتطلب موقف التعلّم هذا الأسلوب.`))}</p></div><div class="lpp-insight"><h3>${t('A development stretch','مساحة للتطوير')}</h3><p>${esc(state.lang==='ar'?develop[low.code].ar:develop[low.code].en)}</p></div></div><div class="lpp-facet-wrap"><h2>${t('What this means for you','ماذا تعني هذه النتيجة لك؟')}</h2><p class="lpp-profile-sub">${t('Read each score as a preference, not a grade. A high score can be useful, but relying on one approach too heavily can also create blind spots.','اقرأ كل نسبة كتفضيل لا كدرجة نجاح. يمكن أن يكون التفضيل المرتفع مفيدًا، لكن الاعتماد المفرط على أسلوب واحد قد يخلق نقاطًا عمياء أيضًا.')}</p><div class="lpp-guidance-grid">${participantCards(c)}</div></div><div class="lpp-next-learning"><h2>${t('Your next learning experiment','تجربتك القادمة في التعلّم')}</h2><p>${t('In your next course, project, book, or new skill, deliberately add one step from your least-used approach. The goal is not to change who you are; it is to become more flexible across the whole learning cycle.','في دورتك أو مشروعك أو كتابك أو مهارتك الجديدة القادمة، أضف بصورة مقصودة خطوة واحدة من الأسلوب الذي تستخدمه بدرجة أقل. الهدف ليس تغيير شخصيتك، بل زيادة مرونتك عبر دورة التعلّم كاملة.')}</p></div><div class="lpp-facet-wrap"><h2>${t('Your learning cycle','دَوْرَة تَعَلُّمِك')}</h2><div class="lpp-cycle-result">${ORDER.map(k=>`<div class="code-${k}"><strong>${esc(state.lang==='ar'?D.constructs[k].shortAr:D.constructs[k].shortEn)}</strong><span>${c.percent[k]}%</span></div>`).join('')}</div></div><div class="lpp-facet-wrap"><h2>${t('Detailed facet profile','تَفاصيل الجَوانِب الفَرْعِيَّة')}</h2><p class="lpp-profile-sub">${t('Each facet contains four items and is shown as a percentage of its maximum score. Use this detail for reflection rather than ranking yourself.','يتكون كل جانب فرعي من أربعة بنود، ويُعرض كنسبة من الدرجة القصوى. استخدم هذه التفاصيل للتأمل لا لترتيب نفسك.')}</p><div class="lpp-facet-grid">${ORDER.map(k=>{const codes=Object.keys(c.facets).filter(f=>f[0]===k).sort();return `<div class="lpp-facet-card code-${k}"><h4>${esc(state.lang==='ar'?D.constructs[k].ar:D.constructs[k].en)}</h4>${codes.map(f=>{const p=Math.round(c.facets[f]/16*100),nm=facetNames[f];return `<div class="lpp-mini-row"><div><span>${esc(state.lang==='ar'?nm[1]:nm[0])}</span><div class="lpp-mini-bar"><span style="width:${p}%"></span></div></div><strong>${p}%</strong></div>`}).join('')}</div>`}).join('')}</div></div><div class="lpp-actions"><button class="lpp-btn primary" id="printBtn">${t('Print / save participant report','طباعة / حفظ تقرير المشارك')}</button><button class="lpp-btn trainer-btn" id="trainerBtn">${t('Open trainer report','فتح تقرير المدرّب')}</button><button class="lpp-btn" id="reviewBtn">${t('Review answers','مراجعة الإجابات')}</button><button class="lpp-btn" id="retakeBtn">${t('Retake','إعادة التقييم')}</button></div><p class="lpp-note">${t('Interpretation thresholds are provisional and will be reviewed after pilot data. This profile describes current preferences, not ability, intelligence, personality, or a fixed learning type.','حدود التفسير مؤقتة وستراجع بعد جمع بيانات التجربة. يصف هذا الملف تفضيلات حالية، وليس القدرة أو الذكاء أو الشخصية أو نمط تعلّم ثابتًا.')}</p></section>${trainerReport(c)}</div>`;
    document.getElementById('printBtn').onclick=()=>window.print();
    document.getElementById('reviewBtn').onclick=()=>{state.screen='question';state.current=0;save();render();};
    document.getElementById('retakeBtn').onclick=reset;
    document.getElementById('trainerBtn').onclick=()=>{document.getElementById('participantReport').classList.add('hidden');document.getElementById('trainerReport').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});};
    document.getElementById('closeTrainer').onclick=()=>{document.getElementById('trainerReport').classList.add('hidden');document.getElementById('participantReport').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});};
    document.getElementById('printTrainer').onclick=()=>window.print();
  }

  function render(){ applyLang(); if(state.screen==='question') renderQuestion(); else if(state.screen==='results' && answeredCount()===64) renderResults(); else {state.screen='start';renderStart();} }
  langBtn.onclick=()=>{state.lang=state.lang==='ar'?'en':'ar';save();render();};
  render();
})();