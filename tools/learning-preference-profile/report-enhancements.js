(() => {
  'use strict';
  const D = window.LPP_DATA;
  const STORAGE = 'tamayuz10x-lpp-v1';
  const ORDER = ['A','R','T','P'];

  const participant = {
    A:{
      en:{helps:'You tend to learn well when you can participate, experiment, and get direct experience early.',over:'If overused, you may move into action before you have enough information or reflection.',try:'Before your next learning task, choose one small experiment, then pause and review what happened.'},
      ar:{helps:'تميل إلى الاستفادة عندما تستطيع المشاركة والتجريب وخوض الخبرة بصورة مباشرة.',over:'إذا اعتمدت على هذا الأسلوب وحده، فقد تنتقل إلى الفعل قبل جمع معلومات كافية أو التوقف للمراجعة.',try:'في تعلّمك القادم، نفّذ تجربة صغيرة ثم توقّف قليلًا لمراجعة ما حدث وما تعلّمته.'}
    },
    R:{
      en:{helps:'You tend to learn well when you have time to observe, review, compare perspectives, and think before concluding.',over:'If overused, reflection can delay experimentation or decision-making.',try:'Give yourself a short review period, then convert one reflection into a specific next action.'},
      ar:{helps:'تميل إلى الاستفادة عندما يتاح لك وقت للملاحظة والمراجعة ومقارنة وجهات النظر والتفكير قبل الاستنتاج.',over:'إذا زاد الاعتماد على التأمل وحده، فقد يتأخر الانتقال إلى التجربة أو اتخاذ القرار.',try:'خصّص وقتًا قصيرًا للمراجعة، ثم حوّل إحدى ملاحظاتك إلى خطوة عملية محددة.'}
    },
    T:{
      en:{helps:'You tend to learn well when ideas are logically structured and supported by principles, evidence, and clear explanations.',over:'If overused, analysis can become detached from direct experience or practical use.',try:'After understanding the logic, test the idea in one concrete example or real situation.'},
      ar:{helps:'تميل إلى الاستفادة عندما تكون الأفكار منظمة منطقيًا ومدعومة بالمبادئ والأدلة والتفسيرات الواضحة.',over:'إذا زاد الاعتماد على التحليل وحده، فقد يبتعد التعلّم عن الخبرة المباشرة أو الاستخدام الواقعي.',try:'بعد فهم الفكرة ومنطقها، اختبرها في مثال محدد أو موقف واقعي.'}
    },
    P:{
      en:{helps:'You tend to learn well when you can connect ideas with a real need, test usefulness, and work within practical constraints.',over:'If overused, immediate usefulness may overshadow deeper reflection or conceptual understanding.',try:'Before applying a method, ask what principle supports it and what you will learn from the result.'},
      ar:{helps:'تميل إلى الاستفادة عندما ترتبط الأفكار بحاجة واقعية ويمكن اختبار فائدتها والعمل ضمن ظروف حقيقية.',over:'إذا زاد التركيز على الفائدة المباشرة، فقد يقل الاهتمام بالتأمل الأعمق أو فهم المبدأ وراء الفكرة.',try:'قبل تطبيق أي أسلوب، اسأل عن المبدأ الذي يستند إليه وما الذي ستتعلّمه من نتيجة التطبيق.'}
    }
  };

  const trainer = {
    A:{
      en:{need:'Early participation, simulation, practice, experimentation, variety.',do:'Use demonstrations followed quickly by practice, short challenges, prototypes, role-play, and active choices.',avoid:'Long passive input before any opportunity to participate.'},
      ar:{need:'المشاركة المبكرة، والمحاكاة، والممارسة، والتجريب، والتنوع.',do:'استخدم شرحًا قصيرًا يتبعه تطبيق سريع، وتحديات قصيرة، ونماذج أولية، وتمارين عملية وخيارات للمشاركة.',avoid:'الإطالة في الشرح دون إتاحة فرصة للمشاركة أو التجريب.'}
    },
    R:{
      en:{need:'Time to observe, process, review, compare views, and prepare a response.',do:'Build in pauses, written reflection, observation, debriefs, and time before asking for conclusions.',avoid:'Forcing immediate answers or treating quiet processing as disengagement.'},
      ar:{need:'وقت للملاحظة والتفكير والمراجعة ومقارنة وجهات النظر والاستعداد للإجابة.',do:'أضف فترات توقف قصيرة، وتأملًا كتابيًا، ومراجعة بعد النشاط، ووقتًا قبل طلب الاستنتاجات.',avoid:'إجبار المشارك على إجابة فورية أو اعتبار الهدوء وعدم الاستجابة السريعة ضعفًا في المشاركة.'}
    },
    T:{
      en:{need:'Clear structure, rationale, principles, evidence, and coherent explanation.',do:'Explain why, show the model or logic, distinguish evidence from assumption, and connect examples to general principles.',avoid:'Presenting activities without explaining the reasoning or learning purpose.'},
      ar:{need:'بنية واضحة، ومنطق مفسّر، ومبادئ وأدلة وتفسير مترابط.',do:'اشرح لماذا، واعرض النموذج أو المنطق، وميّز بين الدليل والافتراض، واربط الأمثلة بالمبادئ العامة.',avoid:'تقديم أنشطة كثيرة دون توضيح المنطق أو الغرض التعلمي وراءها.'}
    },
    P:{
      en:{need:'Relevance, realistic problems, practical constraints, transfer, and usable next steps.',do:'Use real cases, implementation planning, realistic constraints, job aids, and explicit transfer questions.',avoid:'Keeping learning abstract without showing where or how it can be used.'},
      ar:{need:'الارتباط بالواقع، ومشكلات حقيقية، وقيود عملية، وخطوات قابلة للتطبيق.',do:'استخدم حالات واقعية، وخطط تطبيق، وقيودًا مشابهة لبيئة العمل، وأسئلة واضحة حول أين وكيف سيُستخدم التعلّم.',avoid:'إبقاء التعلّم نظريًا دون توضيح أين وكيف يمكن تطبيقه.'}
    }
  };

  function state(){
    try{return JSON.parse(localStorage.getItem(STORAGE)||'{}');}catch(e){return {};}
  }
  function lang(){ return document.documentElement.lang === 'ar' ? 'ar' : 'en'; }
  function tx(en,ar){ return lang()==='ar'?ar:en; }
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function calc(){
    const s=state(), raw={A:0,R:0,T:0,P:0};
    (D.items||[]).forEach(i=>raw[i.construct_code]+=Number((s.responses||{})[i.item_id]||0));
    const percent={}; ORDER.forEach(k=>percent[k]=Math.round(raw[k]/64*100));
    const sorted=ORDER.map(code=>({code,score:percent[code]})).sort((a,b)=>b.score-a.score||ORDER.indexOf(a.code)-ORDER.indexOf(b.code));
    return {raw,percent,sorted};
  }
  function name(k){ return lang()==='ar'?D.constructs[k].ar:D.constructs[k].en; }
  function shortName(k){ return lang()==='ar'?D.constructs[k].shortAr:D.constructs[k].shortEn; }

  function cleanVisibleArabic(){
    if(lang()!=='ar') return;
    const replacements={
      'المشاركة والعفوية':'المشاركة والمبادرة',
      'الجِدّة والتحدي':'التجارب الجديدة والتحدّي',
      'التأنّي والمعالجة':'التأنّي والتفكير',
      'البدائل والحكم':'مقارنة البدائل واتخاذ القرار',
      'الفاعلية والاختبار':'اختبار الفاعلية',
      'التكييف والجدوى والتحسين':'التكيّف العملي والتحسين',
      'الصلة ونقل التعلّم':'الارتباط بالواقع ونقل التعلّم'
    };
    document.querySelectorAll('#lppApp *').forEach(el=>{
      if(el.children.length===0){ let v=el.textContent; Object.entries(replacements).forEach(([a,b])=>{if(v.includes(a))v=v.split(a).join(b);}); if(v!==el.textContent)el.textContent=v; }
    });
  }

  function participantSection(c){
    const high=c.sorted[0], low=c.sorted[c.sorted.length-1], spread=high.score-low.score, gap=high.score-c.sorted[1].score;
    const balanceNote = spread<=10
      ? tx('The four scores are close. Small percentage differences should not be treated as large differences in capability or potential.','درجاتك الأربع متقاربة؛ لذلك لا ينبغي تفسير الفروق الصغيرة في النِّسَب على أنها فروق كبيرة في القدرة أو الإمكانات.')
      : tx(`Your highest and lowest scores differ by ${spread} percentage points. Read this as a difference in current emphasis, not ability.`,`الفارق بين أعلى وأقل درجة لديك هو ${spread} نقطة مئوية. اقرأ هذا باعتباره اختلافًا في التركيز الحالي، لا اختلافًا في القدرة.`);
    const cards=ORDER.map(k=>{
      const x=participant[k][lang()];
      return `<article class="lpp-meaning-card code-${k}"><div class="lpp-card-head"><h3>${esc(name(k))}</h3><strong>${c.percent[k]}%</strong></div><p><b>${tx('When this may help','متى قد يفيدك')}:</b> ${esc(x.helps)}</p><p><b>${tx('Watch for overuse','انتبه عند الإفراط')}:</b> ${esc(x.over)}</p><p class="lpp-action-tip"><b>${tx('Try next','جرّب في المرة القادمة')}:</b> ${esc(x.try)}</p></article>`;
    }).join('');
    return `<div class="lpp-enhanced participant-enhanced">
      <section class="lpp-section-block"><h2>${tx('What do these results mean for you?','ماذا تعني هذه النتائج لك؟')}</h2><p class="lpp-profile-sub">${esc(balanceNote)} ${gap<5?esc(tx('Your two leading preferences are especially close, so reading them together is more useful than forcing one label.','أقوى تفضيلين لديك متقاربان جدًا؛ لذلك من الأنسب قراءتهما معًا بدل فرض تصنيف واحد.')):''}</p><div class="lpp-meaning-grid">${cards}</div></section>
      <section class="lpp-section-block lpp-next-plan"><h2>${tx('Your next learning plan','خُطَّتُك في التَّعَلُّم القادِم')}</h2><p>${tx(`Use your strongest preference (${name(high.code)}) as an entry point, but deliberately add one step from your least-emphasized preference (${name(low.code)}).`,`ابدأ من تفضيلك الأقوى (${name(high.code)})، ثم أضف بصورة مقصودة خطوة من التفضيل الأقل تركيزًا لديك (${name(low.code)}).`)}</p><div class="lpp-four-step"><div><b>${tx('1. Do','١. مارِس')}</b><span>${tx('Try, participate, or experience something directly.','جرّب أو شارك أو اخض خبرة مباشرة.')}</span></div><div><b>${tx('2. Reflect','٢. تَأَمَّل')}</b><span>${tx('Pause and review what happened and what you noticed.','توقّف وراجع ما حدث وما الذي لاحظته.')}</span></div><div><b>${tx('3. Understand','٣. اِفْهَم')}</b><span>${tx('Identify the principle, logic, or evidence behind it.','حدّد المبدأ أو المنطق أو الدليل وراء ما تعلّمته.')}</span></div><div><b>${tx('4. Apply','٤. طَبِّق')}</b><span>${tx('Use it in a real situation and decide what to adjust.','استخدمه في موقف واقعي وحدد ما الذي يحتاج إلى تعديل.')}</span></div></div></section>
      <section class="lpp-section-block"><h2>${tx('Examples in real learning situations','أمثلة في مواقف تعلُّم واقعية')}</h2><div class="lpp-example-grid"><div><b>${tx('Training session','في دورة تدريبية')}</b><span>${tx('Participate in the activity, note what happened, understand the model, then choose one workplace application.','شارك في النشاط، ودوّن ما حدث، وافهم النموذج، ثم اختر تطبيقًا واحدًا في العمل.')}</span></div><div><b>${tx('Reading or self-study','عند القراءة أو التعلُّم الذاتي')}</b><span>${tx('Connect the idea to something you know, pause to summarize it, test the reasoning, then use it in an example.','اربط الفكرة بما تعرفه، ولخّصها بعد التأمل فيها، واختبر منطقها، ثم استخدمها في مثال.')}</span></div><div><b>${tx('Learning a skill','عند تعلُّم مهارة')}</b><span>${tx('Try a small step, review feedback, understand why it worked, and repeat it under a realistic constraint.','جرّب خطوة صغيرة، وراجع التغذية الراجعة، وافهم لماذا نجحت، ثم أعد تطبيقها ضمن ظرف واقعي.')}</span></div></div></section>
    </div>`;
  }

  function trainerReport(c){
    const high=c.sorted[0], second=c.sorted[1], low=c.sorted[c.sorted.length-1];
    const guidance=c.sorted.map(s=>{
      const g=trainer[s.code][lang()];
      return `<article class="trainer-card code-${s.code}"><div class="lpp-card-head"><h3>${esc(name(s.code))}</h3><strong>${s.score}%</strong></div><p><b>${tx('Likely learning needs','احتياجات تعلُّم محتملة')}:</b> ${esc(g.need)}</p><p><b>${tx('Facilitation approaches','أساليب تدريب مناسبة')}:</b> ${esc(g.do)}</p><p><b>${tx('Avoid assuming','تجنّب')}:</b> ${esc(g.avoid)}</p></article>`;
    }).join('');
    const q={
      A:{en:'What could you learn by trying a small version of this now?',ar:'ما الذي يمكن أن تتعلّمه إذا جرّبت نسخة صغيرة من هذا الآن؟'},
      R:{en:'What did you notice, and what would you do differently next time?',ar:'ما الذي لاحظته؟ وما الذي ستفعله بصورة مختلفة في المرة القادمة؟'},
      T:{en:'What principle or evidence best explains what happened?',ar:'ما المبدأ أو الدليل الذي يفسّر ما حدث بصورة أفضل؟'},
      P:{en:'Where will you use this, and what practical change will you make?',ar:'أين ستستخدم هذا التعلّم؟ وما التغيير العملي الذي ستقوم به؟'}
    };
    return `<section class="lpp-panel trainer-report hidden" id="trainerReport">
      <div class="lpp-results-head"><div><span class="lpp-eyebrow">${tx('Trainer / Facilitator Report','تقرير المُدَرِّب / المُيَسِّر')}</span><h1 class="lpp-profile-title">${tx('How to support this learner','كيف تدعم هذا المُتَعَلِّم؟')}</h1><p class="lpp-profile-sub">${tx(`The profile shows strongest current emphasis on ${name(high.code)}, followed by ${name(second.code)}. The least-emphasized area is ${name(low.code)}. Use this as a facilitation guide, not a learner label.`,`يُظهر الملف أن أقوى تركيز حالي هو ${name(high.code)}، يليه ${name(second.code)}، بينما يقل التركيز نسبيًا على ${name(low.code)}. استخدم هذه النتيجة كدليل للتيسير، لا كتصنيف ثابت للمشارك.`)}</p></div><button class="lpp-btn" id="closeTrainer">${tx('Back to participant report','العودة إلى تقرير المشارك')}</button></div>
      <div class="trainer-summary">${c.sorted.map(s=>`<div class="trainer-score code-${s.code}"><span>${esc(shortName(s.code))}</span><b>${s.score}%</b></div>`).join('')}</div>
      <div class="lpp-section-block"><h2>${tx('Individual facilitation guidance','إرشادات تدريبية فردية')}</h2><div class="trainer-grid">${guidance}</div></div>
      <div class="lpp-section-block"><h2>${tx('Recommended session design','تصميم جلسة مقترح')}</h2><p class="lpp-profile-sub">${tx('Do not teach only to the highest score. A stronger design gives the learner access to all four parts of the learning cycle.','لا تصمّم التدريب اعتمادًا على أعلى درجة فقط. التصميم الأقوى يتيح للمشارك المرور بالأجزاء الأربعة لدورة التعلّم.')}</p><div class="lpp-four-step trainer-cycle"><div><b>${tx('Experience','المُمارَسَة')}</b><span>${tx('Start with a case, task, demonstration, or small experiment.','ابدأ بحالة أو مهمة أو عرض عملي أو تجربة صغيرة.')}</span></div><div><b>${tx('Reflection','التَّأَمُّل')}</b><span>${tx('Pause for observation, notes, comparison of perspectives, and debrief.','أتح وقتًا للملاحظة وتسجيل الملاحظات ومقارنة وجهات النظر والمراجعة.')}</span></div><div><b>${tx('Understanding','الفَهْم')}</b><span>${tx('Explain the model, principle, logic, and relevant evidence.','وضّح النموذج والمبدأ والمنطق والأدلة ذات الصلة.')}</span></div><div><b>${tx('Application','التَّطبيق')}</b><span>${tx('End with a realistic problem, transfer plan, and next action.','اختم بمشكلة واقعية وخطة لنقل التعلّم وخطوة عملية تالية.')}</span></div></div></div>
      <div class="lpp-grid-2 lpp-section-block"><div class="lpp-insight"><h3>${tx('Coaching questions','أسئلة للحوار والتوجيه')}</h3><ul class="lpp-list"><li>${esc(lang()==='ar'?q[high.code].ar:q[high.code].en)}</li><li>${esc(lang()==='ar'?q[second.code].ar:q[second.code].en)}</li><li>${esc(lang()==='ar'?q[low.code].ar:q[low.code].en)}</li></ul></div><div class="lpp-insight"><h3>${tx('What the trainer should not do','ما الذي ينبغي ألّا يفعله المدرب؟')}</h3><ul class="lpp-list"><li>${tx('Do not assign a fixed “type” or assume the learner cannot use other approaches.','لا تُصنِّف المشارك في «نمط» ثابت ولا تفترض أنه لا يستطيع استخدام الأساليب الأخرى.')}</li><li>${tx('Do not use the profile for selection, exclusion, grading, or judgments about intelligence or ability.','لا تستخدم الملف للاختيار أو الاستبعاد أو الدرجات أو الحكم على الذكاء أو القدرة.')}</li><li>${tx('Do not interpret small percentage gaps as meaningful differences until pilot validation provides evidence.','لا تعتبر الفروق الصغيرة بين النِّسَب فروقًا جوهرية قبل أن تدعمها بيانات المرحلة التجريبية.')}</li></ul></div></div>
      <div class="lpp-section-block trainer-cohort-note"><h2>${tx('About group / cohort use','حول استخدام النتائج للمجموعة')}</h2><p>${tx('This report is for one participant. A true cohort report should aggregate anonymous participant data and show group distributions before making group-level facilitation recommendations.','هذا التقرير مخصص لمشارك واحد. أما تقرير المجموعة الحقيقي فيجب أن يجمع بيانات المشاركين بصورة مجهولة ويعرض توزيع النتائج على مستوى المجموعة قبل تقديم توصيات تدريبية جماعية.')}</p></div>
      <div class="lpp-actions"><button class="lpp-btn primary" id="printTrainer">${tx('Print / save trainer report','طباعة / حفظ تقرير المدرب')}</button><button class="lpp-btn" id="closeTrainer2">${tx('Back to participant report','العودة إلى تقرير المشارك')}</button></div>
      <p class="lpp-note">${tx('Pilot interpretation only. The LPP is a reflective development tool and is not yet psychometrically validated.','تفسير تجريبي فقط. ملف تفضيلات التعلّم أداة للتأمل والتطوير، ولم يثبت بعد سيكومتريًا.')}</p>
    </section>`;
  }

  function enhance(){
    cleanVisibleArabic();
    const results=document.querySelector('#lppApp .lpp-results-head');
    if(!results) return;
    const participantPanel=results.closest('.lpp-panel');
    if(!participantPanel || participantPanel.dataset.enhanced==='1') return;
    const c=calc();
    const actions=participantPanel.querySelector('.lpp-actions');
    if(actions) actions.insertAdjacentHTML('beforebegin',participantSection(c));
    if(actions){
      const trainerBtn=document.createElement('button'); trainerBtn.className='lpp-btn trainer-btn'; trainerBtn.id='trainerBtn'; trainerBtn.textContent=tx('Trainer / Facilitator Report','تقرير المُدَرِّب / المُيَسِّر'); actions.prepend(trainerBtn);
    }
    participantPanel.parentElement.insertAdjacentHTML('beforeend',trainerReport(c));
    const trainerPanel=document.getElementById('trainerReport');
    const showTrainer=()=>{participantPanel.classList.add('hidden');trainerPanel.classList.remove('hidden');trainerPanel.scrollIntoView({behavior:'smooth',block:'start'});};
    const closeTrainer=()=>{trainerPanel.classList.add('hidden');participantPanel.classList.remove('hidden');participantPanel.scrollIntoView({behavior:'smooth',block:'start'});};
    const tb=document.getElementById('trainerBtn'); if(tb)tb.onclick=showTrainer;
    ['closeTrainer','closeTrainer2'].forEach(id=>{const b=document.getElementById(id);if(b)b.onclick=closeTrainer;});
    const pt=document.getElementById('printTrainer'); if(pt)pt.onclick=()=>window.print();
    participantPanel.dataset.enhanced='1';
  }

  const observer=new MutationObserver(()=>enhance());
  observer.observe(document.getElementById('lppApp'),{childList:true,subtree:true});
  enhance();
})();