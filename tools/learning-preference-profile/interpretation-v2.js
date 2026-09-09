(() => {
  'use strict';

  const D = window.LPP_DATA;
  if (!D) return;

  const STORAGE = 'tamayuz10x-lpp-v1';
  const ORDER = ['A','R','T','P'];

  const constructCopy = {
    A: {
      ar: {
        helps: 'قد يفيدك هذا التفضيل عندما تحتاج إلى التعلّم من خلال المشاركة والتجريب والخبرة المباشرة.',
        over: 'إذا اعتمدت عليه وحده فقد تنتقل إلى الفعل قبل أن تمنح المراجعة أو الأدلة وقتًا كافيًا.',
        stretch: 'استخدمه أكثر عندما تكون المهمة جديدة أو عملية: ابدأ بتجربة صغيرة بدل الانتظار حتى تتضح كل التفاصيل.'
      },
      en: {
        helps: 'This preference may help when learning benefits from participation, experimentation, and direct experience.',
        over: 'If used alone, you may move into action before giving reflection or evidence enough time.',
        stretch: 'Use it more when the task is new or hands-on: start with a small experiment rather than waiting for every detail.'
      }
    },
    R: {
      ar: {
        helps: 'قد يفيدك هذا التفضيل عندما يكون من المهم التوقف، والمراجعة، ومقارنة وجهات النظر قبل الاستنتاج.',
        over: 'إذا زاد الاعتماد عليه فقد تطول المراجعة ويتأخر الانتقال إلى التجربة أو القرار.',
        stretch: 'استخدمه أكثر في المواقف المعقدة أو عالية المخاطر: توقّف واسأل ماذا لاحظت، وما الذي قد تكون أغفلته، وما وجهة النظر الأخرى.'
      },
      en: {
        helps: 'This preference may help when it is important to pause, review, and compare perspectives before concluding.',
        over: 'If overused, review can delay experimentation or decisions.',
        stretch: 'Use it more in complex or high-stakes situations: pause and ask what you noticed, what you may have missed, and what other perspective matters.'
      }
    },
    T: {
      ar: {
        helps: 'قد يفيدك هذا التفضيل عندما تحتاج إلى فهم المبدأ والمنطق والأدلة والروابط بين الأفكار.',
        over: 'إذا زاد الاعتماد عليه فقد يصبح التحليل منفصلًا عن الخبرة المباشرة أو الاستخدام العملي.',
        stretch: 'استخدمه أكثر عندما تكون المعلومات معقدة أو متعارضة: حدّد المبدأ، وافحص الدليل، وميّز بين ما هو مدعوم وما هو مجرد افتراض.'
      },
      en: {
        helps: 'This preference may help when you need to understand principles, logic, evidence, and connections between ideas.',
        over: 'If overused, analysis can become detached from direct experience or practical use.',
        stretch: 'Use it more when information is complex or conflicting: identify the principle, test the evidence, and separate support from assumption.'
      }
    },
    P: {
      ar: {
        helps: 'قد يفيدك هذا التفضيل عندما تحتاج إلى تحويل التعلّم إلى استخدام واقعي وخطوة قابلة للتنفيذ.',
        over: 'إذا زاد التركيز على الفائدة المباشرة فقد يقل الاهتمام بالتأمل أو فهم المبدأ وراء الطريقة.',
        stretch: 'استخدمه أكثر عندما يكون المطلوب نقل التعلّم إلى الواقع: اختر موقفًا حقيقيًا، وجرّب الفكرة، وحدد ما الذي ستغيّره عمليًا.'
      },
      en: {
        helps: 'This preference may help when learning needs to become a realistic use or concrete next step.',
        over: 'If immediate usefulness dominates, reflection or understanding the underlying principle may receive less attention.',
        stretch: 'Use it more when learning needs to transfer into practice: choose a real situation, test the idea, and decide what you will change.'
      }
    }
  };

  const facetMeta = {
    AF1:['Direct engagement','المشاركة المباشرة','جرّب أن تدخل في المهمة بنفسك بدل الاكتفاء بالشرح.'],
    AF2:['Novelty & challenge','التجارب الجديدة والتحدّي','اختر أحيانًا مهمة جديدة أو تحديًا غير مألوف يوسّع خبرتك.'],
    AF3:['Exploration & adaptability','الاستكشاف والتكيّف','اترك مساحة لتجربة بديل وتعديل أسلوبك عندما تتغير الظروف.'],
    AF4:['Participation & initiative','المشاركة والمبادرة','بادر بالمشاركة مبكرًا عندما يتيح موقف التعلّم ذلك.'],
    RF1:['Deliberation & processing','التأنّي والتفكير','امنح نفسك وقفة قصيرة لمعالجة المعلومات قبل الاستجابة.'],
    RF2:['Alternatives & judgment','مقارنة البدائل واتخاذ القرار','قارن بين بديلين أو أكثر قبل اختيار مسار العمل.'],
    RF3:['Perspectives & observation','تعدد وجهات النظر والملاحظة','اسأل عن منظور آخر وراقب كيف يفهم الآخرون الموقف قبل الحسم.'],
    RF4:['Review & learning from experience','مراجعة الخبرة والتعلّم منها','بعد التجربة دوّن ما نجح وما الذي ستغيّره في المرة القادمة.'],
    TF1:['Principles & connections','المبادئ والروابط بين الأفكار','ابحث عن المبدأ الذي يربط المعلومات ببعضها.'],
    TF2:['Structure & coherence','البنية والاتساق','نظّم الأفكار في تسلسل واضح وتحقق من اتساقها.'],
    TF3:['Evidence & critical analysis','الأدلة والتحليل النقدي','قبل قبول الاستنتاج اسأل: ما الدليل الذي يدعمه؟'],
    TF4:['Reasoning, principles & assumptions','الاستدلال والمبادئ والافتراضات','ميّز بين الاستدلال المدعوم والافتراض غير المفحوص.'],
    PF1:['Application & action','التطبيق والفعل','حوّل الفكرة إلى خطوة عملية محددة يمكن تجربتها.'],
    PF2:['Effectiveness & testing','اختبار الفاعلية','اختبر الطريقة ثم راقب ما إذا كانت حققت النتيجة المطلوبة.'],
    PF3:['Practical adaptation & improvement','التكيّف العملي والتحسين','عدّل الطريقة لتناسب القيود الواقعية ثم حسّنها بناءً على النتيجة.'],
    PF4:['Relevance & transfer','الارتباط بالواقع ونقل التعلّم','حدّد أين ستستخدم ما تعلمته في موقف حقيقي آخر.']
  };

  const pairCopy = {
    AP:{ar:'يظهر في إجاباتك ميل إلى الدخول في الخبرة ثم البحث سريعًا عن كيفية استخدامها عمليًا.',en:'Your responses suggest a tendency to enter the experience and then move quickly toward practical use.'},
    AR:{ar:'يظهر في إجاباتك ميل إلى خوض الخبرة ثم التوقف لمراجعتها واستخلاص ما حدث.',en:'Your responses suggest a tendency to enter the experience and then pause to review what happened.'},
    AT:{ar:'يظهر في إجاباتك ميل إلى الجمع بين التجربة المباشرة والبحث عن المبدأ أو المنطق الذي يفسرها.',en:'Your responses suggest a tendency to combine direct experience with seeking the principle or logic behind it.'},
    RP:{ar:'يظهر في إجاباتك ميل إلى التفكير في الخبرة ثم تحويل ما استخلصته إلى استخدام عملي.',en:'Your responses suggest a tendency to reflect on experience and then turn what you learned into practical use.'},
    RT:{ar:'يظهر في إجاباتك ميل إلى التوقف للمراجعة ثم تنظيم ما لاحظته في تفسير منطقي ومترابط.',en:'Your responses suggest a tendency to review carefully and then organize what you noticed into a coherent explanation.'},
    TP:{ar:'يظهر في إجاباتك ميل إلى فهم المنطق والمبدأ ثم اختبار فائدتهما في الواقع.',en:'Your responses suggest a tendency to understand the logic and principle and then test their usefulness in practice.'}
  };

  function state(){
    try { return JSON.parse(localStorage.getItem(STORAGE) || '{}'); }
    catch { return {}; }
  }

  function lang(){ return document.documentElement.lang === 'ar' ? 'ar' : 'en'; }
  function tx(en, ar){ return lang() === 'ar' ? ar : en; }
  function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function cName(k){ return lang()==='ar' ? D.constructs[k].ar : D.constructs[k].en; }
  function cShort(k){ return lang()==='ar' ? D.constructs[k].shortAr : D.constructs[k].shortEn; }
  function pairKey(a,b){ return [a,b].sort((x,y)=>ORDER.indexOf(x)-ORDER.indexOf(y)).join(''); }

  function calculate(){
    const s=state(), responses=s.responses||{};
    const raw={A:0,R:0,T:0,P:0}, strong={A:0,R:0,T:0,P:0};
    const facetRaw={}, facetStrong={}, facetN={};
    (D.items||[]).forEach(item=>{
      const v=Number(responses[item.item_id]);
      if(!Number.isFinite(v)) return;
      raw[item.construct_code]+=v;
      if(v>=3) strong[item.construct_code]+=1;
      facetRaw[item.facet_code]=(facetRaw[item.facet_code]||0)+v;
      facetStrong[item.facet_code]=(facetStrong[item.facet_code]||0)+(v>=3?1:0);
      facetN[item.facet_code]=(facetN[item.facet_code]||0)+1;
    });
    const percent={}; ORDER.forEach(k=>percent[k]=raw[k]/64*100);
    const sorted=ORDER.map(code=>({code,raw:raw[code],score:percent[code],strong:strong[code]})).sort((a,b)=>b.raw-a.raw||ORDER.indexOf(a.code)-ORDER.indexOf(b.code));
    const facetSorted=Object.keys(facetRaw).map(code=>({code,raw:facetRaw[code],strong:facetStrong[code]||0,n:facetN[code]||4})).sort((a,b)=>b.raw-a.raw||a.code.localeCompare(b.code));
    return {raw,strong,percent,sorted,facetRaw,facetStrong,facetN,facetSorted};
  }

  function roleLabel(code, c){
    const rank=c.sorted.findIndex(x=>x.code===code);
    const top=c.sorted[0], second=c.sorted[1], last=c.sorted[c.sorted.length-1];
    if(rank===0) return tx('Most evident in your responses','الأكثر ظهورًا في إجاباتك');
    if(rank===1 && Math.abs(top.raw-second.raw)<=3) return tx('Very close to your leading preference','قريب جدًا من التفضيل الأعلى');
    if(code===last.code) return tx('Less evident relative to your other preferences','أقل ظهورًا نسبيًا في ملفك');
    return tx('Part of your current profile','جزء من ملفك الحالي');
  }

  function dots(n,total,code){
    let out='';
    for(let i=0;i<total;i++) out+=`<i class="${i<n?'on':''} code-${code}" aria-hidden="true"></i>`;
    return out;
  }

  function profileSynthesis(c){
    const top=c.sorted[0], second=c.sorted[1], low=c.sorted[c.sorted.length-1];
    const key=pairKey(top.code,second.code);
    const close=Math.abs(top.raw-second.raw)<=3;
    const opening=close
      ? tx(`Your two most evident preferences are close: ${cName(top.code)} and ${cName(second.code)}.`, `أكثر تفضيلين ظهورًا لديك متقاربان: ${cName(top.code)} و${cName(second.code)}.`)
      : tx(`${cName(top.code)} is the most evident preference in your current responses, followed by ${cName(second.code)}.`, `${cName(top.code)} هو الأكثر ظهورًا في إجاباتك الحالية، يليه ${cName(second.code)}.`);
    const pattern=(pairCopy[key]||{})[lang()]||'';
    const lowText=tx(
      `${cName(low.code)} is less evident relative to your other preferences. This is not a weakness or a negative result; it may simply be an approach you use less automatically.`,
      `${cName(low.code)} أقل ظهورًا نسبيًا مقارنة بتفضيلاتك الأخرى. هذا ليس ضعفًا ولا نتيجة سلبية؛ بل قد يكون أسلوبًا تستخدمه بصورة أقل تلقائية.`
    );
    return `${opening} ${pattern} ${lowText}`;
  }

  function readingGuide(){
    return `<section class="lpp-v2-guide">
      <div class="lpp-v2-guide-icon">?</div>
      <div><h2>${tx('How to read your result','كيف تقرأ نتيجتك؟')}</h2>
      <p>${tx(
        'There is no pass mark and no ideal number to reach. The count shown for each preference is the number of its 16 statements that you rated “mostly like me” or “very much like me” (3 or 4). All five response levels are still used internally to calculate your profile.',
        'لا توجد هنا درجة نجاح أو رسوب، ولا يوجد رقم مثالي يجب أن تصل إليه. العدد الظاهر لكل تفضيل هو عدد العبارات من أصل 16 التي أجبت عنها بـ«تشبهني بدرجة كبيرة» أو «تشبهني بدرجة كبيرة جدًا» (3 أو 4). وتظل جميع مستويات الإجابة الخمسة مستخدمة داخليًا في حساب ملفك.'
      )}</p>
      <p><strong>${tx('A lower count is not bad.','العدد الأقل ليس شيئًا سلبيًا.')}</strong> ${tx(
        'It means the related behaviours appeared less often or less strongly in your current responses. It becomes a development opportunity only when the learning situation would benefit from using that approach more deliberately.',
        'هو يعني أن السلوكيات المرتبطة بهذا التفضيل ظهرت بصورة أقل أو أقل قوة في إجاباتك الحالية. ويصبح فرصة للتطوير فقط عندما يكون موقف التعلّم يحتاج إلى استخدام هذا الأسلوب بصورة أكثر قصدًا.'
      )}</p></div>
    </section>`;
  }

  function constructCards(c){
    return `<section class="lpp-v2-section"><h2>${tx('Your four learning preferences','تفضيلاتك الأربعة في التعلّم')}</h2>
      <p class="lpp-v2-muted">${tx('Read the four together. The purpose is to understand your current emphasis, not to rank your ability.','اقرأ التفضيلات الأربعة معًا. الهدف هو فهم تركيزك الحالي، لا ترتيب قدراتك.')}</p>
      <div class="lpp-v2-construct-grid">${c.sorted.map(s=>{
        const copy=constructCopy[s.code][lang()];
        return `<article class="lpp-v2-construct code-${s.code}">
          <div class="lpp-v2-card-head"><div><span class="lpp-v2-role">${esc(roleLabel(s.code,c))}</span><h3>${esc(cName(s.code))}</h3></div><div class="lpp-v2-count"><b>${s.strong}</b><span>${tx('of 16','من 16')}</span></div></div>
          <div class="lpp-v2-dots">${dots(s.strong,16,s.code)}</div>
          <p class="lpp-v2-count-note">${tx(`${s.strong} of 16 statements described you mostly or very strongly.`, `${s.strong} من أصل 16 عبارة وصفتك بدرجة كبيرة أو كبيرة جدًا.`)}</p>
          <p><b>${tx('When this may help','متى قد يفيدك؟')}</b> ${esc(copy.helps)}</p>
          <p><b>${tx('Watch for overuse','انتبه عند الإفراط')}</b> ${esc(copy.over)}</p>
        </article>`;
      }).join('')}</div>
    </section>`;
  }

  function personalizedInsight(c){
    const low=c.sorted[c.sorted.length-1];
    const highs=c.facetSorted.slice(0,2);
    const lows=c.facetSorted.slice(-2).reverse();
    const facetName=f=>lang()==='ar'?facetMeta[f.code][1]:facetMeta[f.code][0];
    const lowAction=lang()==='ar'?facetMeta[lows[0].code][2]:'';
    return `<section class="lpp-v2-section lpp-v2-personal">
      <h2>${tx('What your combination may mean','ماذا تقول تركيبتك أنت؟')}</h2>
      <p class="lpp-v2-lead">${esc(profileSynthesis(c))}</p>
      <div class="lpp-v2-insight-grid">
        <article><h3>${tx('What stands out in your answers','ما الذي يبرز في إجاباتك؟')}</h3><p>${tx(
          `Two of your most evident facets are ${facetName(highs[0])} and ${facetName(highs[1])}.`,
          `من أكثر الجوانب الفرعية ظهورًا لديك: «${facetName(highs[0])}» و«${facetName(highs[1])}».`
        )}</p><p>${tx(
          `Two less-evident facets are ${facetName(lows[0])} and ${facetName(lows[1])}. This does not make them deficits; it shows where you may be less likely to act automatically.`,
          `ومن الجوانب الأقل ظهورًا نسبيًا: «${facetName(lows[0])}» و«${facetName(lows[1])}». لا يعني ذلك وجود نقص، بل يوضح أين قد تكون أقل ميلًا إلى استخدام السلوك تلقائيًا.`
        )}</p></article>
        <article><h3>${tx('When should you deliberately stretch?','متى يستحق أن توسّع أسلوبك؟')}</h3><p>${esc(constructCopy[low.code][lang()].stretch)}</p>${lang()==='ar'?`<p class="lpp-v2-try"><b>جرّب أيضًا:</b> ${esc(lowAction)}</p>`:''}</article>
      </div>
    </section>`;
  }

  function cyclePlan(){
    return `<section class="lpp-v2-section"><h2>${tx('Use the whole learning cycle when the situation needs it','استخدم دورة التعلّم كاملة عندما يحتاج الموقف')}</h2>
      <div class="lpp-v2-cycle">
        <div class="code-A"><b>${tx('Do','مارِس')}</b><span>${tx('Enter the experience or try a small step.','ادخل في الخبرة أو جرّب خطوة صغيرة.')}</span></div>
        <div class="code-R"><b>${tx('Reflect','تَأَمَّل')}</b><span>${tx('Pause, review, and consider another perspective.','توقّف وراجع وانظر إلى منظور آخر.')}</span></div>
        <div class="code-T"><b>${tx('Understand','اِفْهَم')}</b><span>${tx('Identify the principle, logic, evidence, and assumptions.','حدّد المبدأ والمنطق والدليل والافتراضات.')}</span></div>
        <div class="code-P"><b>${tx('Apply','طَبِّق')}</b><span>${tx('Use the learning in a real situation and adjust.','استخدم التعلّم في موقف واقعي ثم عدّل.')}</span></div>
      </div>
      <p class="lpp-v2-muted">${tx('The goal is not to make all four scores identical. The goal is to be able to call on each approach when it improves learning or decision quality.','الهدف ليس أن تجعل التفضيلات الأربعة متساوية، بل أن تستطيع استدعاء كل أسلوب عندما يحسّن التعلّم أو جودة القرار.')}</p>
    </section>`;
  }

  function facetDetails(c){
    return `<section class="lpp-v2-section"><h2>${tx('Detailed facets','تفاصيل الجوانب الفرعية')}</h2>
      <p class="lpp-v2-muted">${tx('Each facet has four statements. The count shows how many you rated 3 or 4. Use these details to notice patterns, not to judge yourself.','يتكون كل جانب فرعي من أربع عبارات. العدد يوضح كم عبارة أجبت عنها بـ3 أو 4. استخدم التفاصيل لملاحظة الأنماط، لا للحكم على نفسك.')}</p>
      <div class="lpp-v2-facet-grid">${ORDER.map(k=>{
        const codes=Object.keys(c.facetRaw).filter(f=>f[0]===k).sort();
        return `<article class="lpp-v2-facet-card code-${k}"><h3>${esc(cName(k))}</h3>${codes.map(f=>{
          const meta=facetMeta[f]; const n=c.facetStrong[f]||0;
          return `<div class="lpp-v2-facet-row"><div><span>${esc(lang()==='ar'?meta[1]:meta[0])}</span><div class="lpp-v2-facet-dots">${dots(n,4,k)}</div></div><strong>${n}/4</strong></div>`;
        }).join('')}</article>`;
      }).join('')}</div>
    </section>`;
  }

  function enhanceStart(){
    const hero=document.querySelector('#lppApp .lpp-hero');
    if(!hero || document.getElementById('lppV2StartNote')) return;
    const first=hero.querySelector('.lpp-panel');
    if(!first) return;
    const note=document.createElement('div');
    note.id='lppV2StartNote'; note.className='lpp-v2-start-note';
    note.innerHTML=`<b>${tx('Before you begin','قبل أن تبدأ')}</b><span>${tx('There are no right or wrong answers and no target score. Answer according to what is typically like you; the result describes current learning preferences, not ability.','لا توجد إجابات صحيحة أو خاطئة ولا درجة مستهدفة. أجب وفق ما يصفك عادةً؛ فالنتيجة تصف تفضيلات تعلم حالية، لا القدرة.')}</span>`;
    const actions=first.querySelector('.lpp-actions');
    if(actions) first.insertBefore(note,actions); else first.appendChild(note);
  }

  function enhanceParticipant(){
    const head=document.querySelector('#lppApp .lpp-results-head');
    if(!head) return;
    const panel=head.closest('.lpp-panel');
    if(!panel || panel.classList.contains('trainer-report') || panel.dataset.v2==='1') return;
    const c=calculate();
    if(c.sorted.every(x=>x.raw===0)) return;
    panel.dataset.v2='1'; panel.classList.add('lpp-v2-report');

    const oldSub=head.querySelector('.lpp-profile-sub');
    if(oldSub) oldSub.textContent=tx('This report explains how your current preferences appear together and how to use them flexibly.','هذا التقرير يشرح كيف تظهر تفضيلاتك الحالية معًا، وكيف تستخدمها بمرونة بحسب الموقف.');

    const html=`<div class="lpp-v2-content" id="lppV2Content">${readingGuide()}${constructCards(c)}${personalizedInsight(c)}${cyclePlan()}${facetDetails(c)}</div>`;
    head.insertAdjacentHTML('afterend',html);

    const note=panel.querySelector('.lpp-note');
    if(note) note.textContent=tx(
      'Pilot interpretation only. Counts are descriptive, not normative cut-offs. This profile describes current learning preferences, not ability, intelligence, personality, or a fixed learning type.',
      'تفسير تجريبي فقط. الأعداد وصفية وليست حدودًا معيارية للحكم على المستوى. يصف هذا الملف تفضيلات تعلم حالية، وليس القدرة أو الذكاء أو الشخصية أو نمط تعلم ثابتًا.'
    );
  }

  function enhanceTrainer(){
    const report=document.getElementById('trainerReport');
    if(!report || report.dataset.v2==='1') return;
    const c=calculate(); report.dataset.v2='1'; report.classList.add('trainer-v2-counts');
    ORDER.forEach(k=>{
      report.querySelectorAll(`.code-${k} .lpp-card-head strong,.trainer-score.code-${k} b`).forEach(el=>el.textContent=`${c.strong[k]}/16`);
    });
    const summary=report.querySelector('.trainer-summary');
    if(summary){
      summary.insertAdjacentHTML('beforebegin',`<p class="lpp-v2-trainer-note">${tx('Counts show how many of the 16 statements in each preference were rated 3 or 4. A lower count is not a weakness; use it only as a clue about what the learner may use less automatically.','تعرض الأعداد كم عبارة من أصل 16 أجاب عنها المشارك بـ3 أو 4. العدد الأقل ليس ضعفًا؛ استخدمه فقط كمؤشر على الأساليب التي قد يستخدمها المتعلم بصورة أقل تلقائية.')}</p>`);
    }
  }

  const root=document.getElementById('lppApp');
  if(!root) return;
  const observer=new MutationObserver(()=>{enhanceStart();enhanceParticipant();enhanceTrainer();});
  observer.observe(root,{childList:true,subtree:true});
  enhanceStart(); enhanceParticipant(); enhanceTrainer();
})();
