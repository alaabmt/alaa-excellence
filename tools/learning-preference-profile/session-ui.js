(() => {
  'use strict';
  const API='https://lpp-api.alaatoinnovate.workers.dev';
  const SESSION_KEY='tamayuz10x-lpp-session';
  const SESSION_NAME_KEY='tamayuz10x-lpp-session-name';
  const LPP_KEY='tamayuz10x-lpp-v1';
  const params=new URLSearchParams(location.search);
  const incoming=(params.get('session')||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
  const mode=params.get('mode')||'';
  if(incoming) localStorage.setItem(SESSION_KEY,incoming);

  const tx=(en,ar)=>document.documentElement.lang==='ar'?ar:en;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const baseUrl=()=>`${location.origin}${location.pathname}`;
  const sessionUrl=c=>`${baseUrl()}?session=${encodeURIComponent(c)}`;
  const qrPrimary=u=>`https://quickchart.io/qr?size=260&margin=2&text=${encodeURIComponent(u)}`;
  const qrFallback=u=>`https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(u)}`;
  const activeSession=()=>incoming||localStorage.getItem(SESSION_KEY)||'';
  const ownsSession=c=>!!(c&&localStorage.getItem(`tamayuz10x-lpp-trainer-token-${c}`));

  function copyText(value,button){
    const done=()=>{const old=button.textContent;button.textContent=tx('Copied','تم النسخ');setTimeout(()=>button.textContent=old,1400);};
    if(navigator.clipboard&&window.isSecureContext) navigator.clipboard.writeText(value).then(done).catch(()=>window.prompt(tx('Copy this link','انسخ هذا الرابط'),value));
    else window.prompt(tx('Copy this link','انسخ هذا الرابط'),value);
  }

  function newSessionForm(){
    return `<div class="lpp-session-box" id="trainerCreateBox"><h3>${tx('Create a new trainer session','إنشاء جلسة تدريبية جديدة')}</h3><p class="lpp-help">${tx('Journey: create → share → participants complete → review results → adapt the session.','الرحلة: أنشئ ← شارك ← يكمل المشاركون ← راجع النتائج ← عدّل الجلسة.')}</p><label>${tx('Session name (optional)','اسم الجلسة (اختياري)')}<input id="sessionName" maxlength="80" placeholder="${tx('e.g., Leadership Workshop','مثال: ورشة القيادة')}"></label><button class="lpp-btn primary" id="createSessionBtn" type="button">${tx('Create live session','إنشاء جلسة مباشرة')}</button><div id="sessionCreated"></div></div>`;
  }

  function trainerResumeMarkup(compact=false){
    const c=activeSession();
    const name=localStorage.getItem(SESSION_NAME_KEY)||'';
    const u=sessionUrl(c);
    const q=qrPrimary(u);
    const dashboard=`trainer-dashboard.html?session=${encodeURIComponent(c)}`;
    const accountUrl=`/account/?lang=${document.documentElement.lang==='ar'?'ar':'en'}`;
    return `<section class="lpp-entry-hub ${compact?'lpp-entry-modal-card':''}" id="lppEntryHub">
      ${compact?`<button type="button" class="lpp-session-close" id="closeSessionPanel" aria-label="${tx('Close','إغلاق')}">×</button>`:''}
      <div class="lpp-entry-title"><span>${tx('Trainer session control','إدارة جلسة المدرب')}</span><h2>${tx('Your current session is ready','جلستك الحالية جاهزة')}</h2></div>
      <div class="lpp-session-banner"><b>${tx('Current session','الجلسة الحالية')}:</b> <span dir="ltr">${esc(c)}</span>${name?` <small>${esc(name)}</small>`:''}</div>
      <div class="lpp-section-block"><h3>${tx('How does this service help me as a trainer?','كيف تساعدني هذه الخدمة كمدرب؟')}</h3><p class="lpp-profile-sub">${tx('It converts completed participant assessments into a group-level picture you can use to adjust training design: how much explanation, practice, reflection, and application the group may need. It supports training decisions without exposing individual reports by default.','تحوّل الخدمة تقييمات المشاركين المكتملة إلى صورة جماعية يمكنك استخدامها لتعديل تصميم التدريب: مقدار الشرح والممارسة والتأمل والتطبيق الذي قد تحتاجه المجموعة. وهي تدعم القرار التدريبي دون كشف التقارير الفردية افتراضيًا.')}</p></div>
      <div class="lpp-section-block"><h3>${tx('What do I do now?','ماذا أفعل الآن؟')}</h3><p class="lpp-help"><strong>1.</strong> ${tx('Share the link or QR','شارك الرابط أو QR')} ← <strong>2.</strong> ${tx('Participants complete the assessment','يكمل المشاركون التقييم')} ← <strong>3.</strong> ${tx('Open the group dashboard','افتح لوحة المجموعة')} ← <strong>4.</strong> ${tx('Use the result to adapt the training','استخدم النتيجة لتعديل التدريب')}</p></div>
      <div class="lpp-session-created"><div class="lpp-session-details"><span>${tx('Session code','رمز الجلسة')}</span><strong dir="ltr">${esc(c)}</strong><label>${tx('Participant link','رابط المشاركين')}<input value="${esc(u)}" readonly></label><div class="lpp-actions"><button class="lpp-btn primary" id="copyActiveSession" type="button">${tx('Copy participant link','نسخ رابط المشاركين')}</button><a class="lpp-btn" href="${esc(q)}" target="_blank" rel="noopener">${tx('Show QR','عرض QR')}</a><a class="lpp-btn primary" href="${esc(dashboard)}">${tx('Open group dashboard','فتح لوحة المجموعة')}</a><a class="lpp-btn" href="${esc(u)}">${tx('Preview participant view','معاينة شاشة المشارك')}</a><a class="lpp-btn" href="${esc(accountUrl)}">${tx('Manage this session','إدارة هذه الجلسة')}</a></div><p class="lpp-help">${tx('“Manage this session” opens your account so you can return to this session later and follow its saved results.','«إدارة هذه الجلسة» تفتح حسابك لتتمكن من العودة إلى هذه الجلسة لاحقًا ومتابعة نتائجها المحفوظة.')}</p></div></div>
      <div class="lpp-section-block"><h3>${tx('What will the dashboard give me?','ماذا سأرى في لوحة المجموعة؟')}</h3><p class="lpp-profile-sub">${tx('Completed-participant count, group averages, preference distribution, a sample-size caution, and practical recommendations for balancing the training design.','عدد من أكملوا التقييم، ومتوسطات المجموعة، وتوزيع التفضيلات، وتنبيه على حجم العينة، وتوصيات عملية لموازنة تصميم التدريب.')}</p></div>
      <div class="lpp-actions"><button class="lpp-btn" id="createAnotherSession" type="button">${tx('Create another session','إنشاء جلسة جديدة')}</button></div>
      <div id="newTrainerSessionArea" class="hidden">${newSessionForm()}</div>
    </section>`;
  }

  function joinOnlyMarkup(compact=false){
    return `<section class="lpp-entry-hub ${compact?'lpp-entry-modal-card':''}" id="lppEntryHub">
      ${compact?`<button type="button" class="lpp-session-close" id="closeSessionPanel" aria-label="${tx('Close','إغلاق')}">×</button>`:''}
      <div class="lpp-entry-title"><span>${tx('Participant access','دخول المشارك')}</span><h2>${tx('Join with a session code','الانضمام برمز جلسة')}</h2></div>
      <p class="lpp-profile-sub">${tx('Enter the code your trainer gave you. After it is verified, you will go directly to the participant assessment for that group.','أدخل الرمز الذي أعطاك إياه المدرب. بعد التحقق منه ستنتقل مباشرة إلى تقييم المشارك المرتبط بهذه المجموعة.')}</p>
      <div class="lpp-session-box" id="joinSessionBox"><h3>${tx('Session code','رمز الجلسة')}</h3><div class="lpp-code-row"><input id="joinCode" maxlength="8" autocomplete="off" inputmode="text" autocapitalize="characters" placeholder="ABC123" aria-label="${tx('Session code','رمز الجلسة')}"><button class="lpp-btn primary" id="joinCodeBtn" type="button">${tx('Join session','انضم إلى الجلسة')}</button></div><p class="lpp-help">${tx('Use the letters and numbers exactly as provided by your trainer.','استخدم الحروف والأرقام كما أعطاك إياها المدرب.')}</p><div id="joinStatus"></div></div>
    </section>`;
  }

  function panelsMarkup(compact=false){
    const active=activeSession();
    if(compact&&mode==='join') return joinOnlyMarkup(true);
    if(compact&&mode==='trainer'&&ownsSession(active)) return trainerResumeMarkup(true);
    const ownActive=ownsSession(active);
    return `<section class="lpp-entry-hub ${compact?'lpp-entry-modal-card':''}" id="lppEntryHub">
      ${compact?`<button type="button" class="lpp-session-close" id="closeSessionPanel" aria-label="${tx('Close','إغلاق')}">×</button>`:''}
      <div class="lpp-entry-title"><span>${tx('Choose how you want to use the profile','اختر طريقة استخدام ملف تفضيلات التعلّم')}</span><h2>${tx('Individual, trainer session, or group code','فردي، جلسة للمدرّب، أو رمز للمجموعة')}</h2></div>
      ${active?`<div class="lpp-session-banner"><b>${ownActive?tx('Your active trainer session','جلسة المدرب النشطة'):tx('Group session','جلسة المجموعة')}:</b> <span dir="ltr">${esc(active)}</span></div>`:''}
      <div class="lpp-entry-grid">
        <article class="lpp-entry-card participant"><div class="lpp-entry-icon">1</div><h3>${tx('Participant','للمشارك')}</h3><p>${tx('Take the assessment and receive your personal learning preference report.','أكمل التقييم واحصل على تقريرك الشخصي لتفضيلات التعلّم.')}</p><button class="lpp-btn primary" id="entryIndividual">${tx('Start my assessment','ابدأ تقييمي')}</button></article>
        <article class="lpp-entry-card trainer"><div class="lpp-entry-icon">2</div><h3>${tx('Trainer / Facilitator','للمدرّب / الميسّر')}</h3><p>${ownActive?tx('Return to your active session, share it, and open the group dashboard.','ارجع إلى جلستك النشطة، وشاركها، وافتح لوحة نتائج المجموعة.'):tx('Create a live group session, share it with participants, then use the group dashboard to adapt your training.','أنشئ جلسة مباشرة، شاركها مع المشاركين، ثم استخدم لوحة المجموعة لتعديل تصميم التدريب.')}</p><button class="lpp-btn" id="entryTrainer">${ownActive?tx('Manage current session','إدارة الجلسة الحالية'):tx('Create a group session','أنشئ جلسة للمجموعة')}</button><button class="lpp-btn" id="trainerBenefitToggle" type="button" aria-expanded="false">${tx('What is the value of a group session?','ما فائدة جلسة المجموعة؟')}</button><div class="lpp-session-box hidden" id="trainerBenefitDetails"><h3>${tx('A group-level training decision aid','أداة تساعد المدرب على اتخاذ قرار تدريبي للمجموعة')}</h3><p class="lpp-profile-sub">${tx('Share one assessment with the group, then see aggregated learning-preference patterns that help you balance explanation, practice, reflection, and application. Individual participant reports remain personal by default.','شارك تقييمًا واحدًا مع المجموعة، ثم شاهد أنماط تفضيلات التعلم بصورة جماعية تساعدك على موازنة الشرح والممارسة والتأمل والتطبيق. تبقى تقارير المشاركين الفردية شخصية افتراضيًا.')}</p></div></article>
        <article class="lpp-entry-card join"><div class="lpp-entry-icon">3</div><h3>${tx('Join with a session code','الانضمام برمز جلسة')}</h3><p>${tx('Use the session code provided by your trainer to join the correct group.','استخدم رمز الجلسة الذي أعطاك إياه المدرب للانضمام إلى المجموعة الصحيحة.')}</p><button class="lpp-btn" id="entryJoin">${tx('Enter session code','أدخل رمز الجلسة')}</button></article>
      </div>
      <div class="lpp-session-box hidden" id="trainerCreateBox">${ownActive?`<h3>${tx('Current trainer session','جلسة المدرب الحالية')}</h3><p class="lpp-help">${tx('Use “Manage current session” to reopen the trainer control view.','استخدم «إدارة الجلسة الحالية» للعودة إلى شاشة إدارة المدرب.')}</p><a class="lpp-btn primary" href="?mode=trainer">${tx('Manage current session','إدارة الجلسة الحالية')}</a>`:`<h3>${tx('Create trainer session','إنشاء جلسة للمدرّب')}</h3><p class="lpp-help">${tx('Journey: create → share → participants complete → review results → adapt the session.','الرحلة: أنشئ ← شارك ← يكمل المشاركون ← راجع النتائج ← عدّل الجلسة.')}</p><label>${tx('Session name (optional)','اسم الجلسة (اختياري)')}<input id="sessionName" maxlength="80" placeholder="${tx('e.g., Leadership Workshop','مثال: ورشة القيادة')}"></label><button class="lpp-btn primary" id="createSessionBtn" type="button">${tx('Create live session','إنشاء جلسة مباشرة')}</button><div id="sessionCreated"></div>`}</div>
      <div class="lpp-session-box hidden" id="joinSessionBox"><h3>${tx('Join a group session','الانضمام إلى جلسة مجموعة')}</h3><div class="lpp-code-row"><input id="joinCode" maxlength="8" autocomplete="off" placeholder="ABC123"><button class="lpp-btn primary" id="joinCodeBtn" type="button">${tx('Join','انضم')}</button></div><p class="lpp-help">${tx('Letters and numbers only.','حروف وأرقام فقط.')}</p><div id="joinStatus"></div></div>
    </section>`;
  }

  async function linkTrainerSessionToAccount(c,u,name,trainerToken){
    try{
      const mod=await import('/assets/js/trainer-sessions-client.js');
      await mod.registerTrainerSession({sessionCode:c,sessionName:name,joinUrl:u,trainerToken});
      return true;
    }catch(e){
      console.warn('Trainer session account link failed',e);
      return false;
    }
  }

  function renderCreated(c,u,name,linked=false){
    const host=document.getElementById('sessionCreated'); if(!host) return;
    const q1=qrPrimary(u), q2=qrFallback(u);
    const dashboard=`trainer-dashboard.html?session=${encodeURIComponent(c)}`;
    const accountUrl=`/account/?lang=${document.documentElement.lang==='ar'?'ar':'en'}`;
    host.innerHTML=`<div class="lpp-section-block"><h3>${tx('Your trainer journey','رحلة المدرب في هذه الجلسة')}</h3><p class="lpp-help"><strong>1.</strong> ${tx('Create','أنشئ')} ← <strong>2.</strong> ${tx('Share','شارك')} ← <strong>3.</strong> ${tx('Participants complete','يكمل المشاركون')} ← <strong>4.</strong> ${tx('Review results','راجع النتائج')} ← <strong>5.</strong> ${tx('Adapt training','عدّل التدريب')}</p></div>
      <div class="lpp-session-banner"><b>${tx('Current step','الخطوة الحالية')}:</b> ${tx('Share the assessment with participants, then open the group dashboard as results arrive.','شارك التقييم مع المشاركين، ثم افتح لوحة المجموعة مع وصول النتائج.')}</div>
      <div class="lpp-section-block"><h3>${tx('Why this matters for the trainer','لماذا هذه الخدمة مهمة للمدرب؟')}</h3><p class="lpp-profile-sub">${tx('Instead of relying only on impressions, you receive a group-level learning-preference picture and practical recommendations you can use to balance your session design.','بدل الاعتماد على الانطباع وحده، تحصل على صورة جماعية لتفضيلات التعلم وتوصيات عملية تساعدك على موازنة تصميم الجلسة.')}</p></div>
      <div class="lpp-session-created"><div class="lpp-session-details"><span>${tx('Session code','رمز الجلسة')}</span><strong dir="ltr">${c}</strong>${name?`<small>${esc(name)}</small>`:''}<label>${tx('Participant link','رابط المشاركين')}<input value="${esc(u)}" readonly></label><div class="lpp-actions"><button class="lpp-btn" id="copySession" type="button">${tx('Copy link','نسخ الرابط')}</button><a class="lpp-btn primary" href="${esc(u)}">${tx('Open participant link','فتح رابط المشارك')}</a><a class="lpp-btn" id="openQr" href="${esc(q1)}" target="_blank" rel="noopener">${tx('Open QR','فتح QR')}</a><a class="lpp-btn primary" href="${esc(dashboard)}">${tx('Open group dashboard','فتح لوحة المجموعة')}</a><a class="lpp-btn" href="${esc(accountUrl)}">${tx('Manage this session','إدارة هذه الجلسة')}</a></div><p class="lpp-help">${linked?tx('This session is saved to your account and can be opened later from another device after sign-in.','تم حفظ هذه الجلسة في حسابك، ويمكنك فتحها لاحقًا من جهاز آخر بعد تسجيل الدخول.'):tx('The session is active on this device. Account linking could not be confirmed yet; keep this browser available until you verify it in My Account.','الجلسة تعمل على هذا الجهاز. لم يتأكد ربطها بالحساب بعد؛ أبقِ هذا المتصفح متاحًا حتى تتحقق منها في «حسابي».')}</p></div><div class="lpp-qr"><img id="sessionQrImage" src="${esc(q1)}" data-fallback="${esc(q2)}" alt="QR code"><span>${tx('Participants can scan this QR code with their phone camera.','يمكن للمشاركين مسح رمز QR بكاميرا الهاتف.')}</span><small id="qrStatus"></small></div></div>
      <div class="lpp-section-block"><h3>${tx('What does the trainer gain?','ماذا يستفيد المدرب؟')}</h3><p class="lpp-profile-sub">${tx('The dashboard turns completed assessments into a training decision: group averages, preference distribution, sample-size caution, interpretation, and practical recommendations for balancing practice, reflection, conceptual understanding, and application.','تحوّل اللوحة التقييمات المكتملة إلى قرار تدريبي: متوسطات المجموعة، توزيع التفضيلات، تنبيه على حجم العينة، تفسير للنتائج، وتوصيات عملية لموازنة الممارسة والتأمل والفهم المفاهيمي والتطبيق.')}</p></div>`;
    document.getElementById('copySession').onclick=e=>copyText(u,e.currentTarget);
    const img=document.getElementById('sessionQrImage');
    img.addEventListener('error',()=>{const fb=img.dataset.fallback;if(fb&&img.src!==fb){img.src=fb;document.getElementById('openQr').href=fb;}else document.getElementById('qrStatus').textContent=tx('QR image could not load. Use the link or code.','تعذر تحميل QR. استخدم الرابط أو الرمز.');});
  }

  async function createLiveSession(){
    const btn=document.getElementById('createSessionBtn'); const host=document.getElementById('sessionCreated');
    const name=(document.getElementById('sessionName').value||'').trim();
    if(!btn||!host)return;
    btn.disabled=true; btn.textContent=tx('Creating…','جارٍ الإنشاء...'); host.innerHTML='';
    try{
      const r=await fetch(`${API}/api/lpp/sessions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});
      const d=await r.json(); if(!r.ok||!d.ok) throw new Error(d.error||'Create failed');
      const c=d.session.code, u=d.session.join_url||d.session.participant_url||sessionUrl(c);
      localStorage.setItem(SESSION_KEY,c); localStorage.setItem(SESSION_NAME_KEY,name);
      localStorage.setItem(`tamayuz10x-lpp-trainer-token-${c}`,d.trainer_token);
      const linked=await linkTrainerSessionToAccount(c,u,name,d.trainer_token);
      renderCreated(c,u,name,linked);
    }catch(e){
      host.innerHTML=`<p class="lpp-session-error">${tx('The live group session could not be created. Please try again.','تعذر إنشاء جلسة المجموعة المباشرة. يرجى المحاولة مرة أخرى.')}</p>`;
    }finally{btn.disabled=false;btn.textContent=tx('Create live session','إنشاء جلسة مباشرة');}
  }

  async function validateIncomingSession(){
    if(!incoming) return;
    try{
      const r=await fetch(`${API}/api/lpp/sessions/${encodeURIComponent(incoming)}`); const d=await r.json();
      if(!r.ok||!d.ok||d.session?.closed_at||d.session?.closed) throw new Error('invalid');
      localStorage.setItem(SESSION_KEY,incoming);
      if(d.session?.name) localStorage.setItem(SESSION_NAME_KEY,d.session.name);
    }catch(e){
      localStorage.removeItem(SESSION_KEY);
      const banner=document.createElement('div');banner.className='lpp-session-error';banner.textContent=tx('This group session is unavailable or has been closed.','جلسة المجموعة هذه غير متاحة أو تم إغلاقها.');
      document.querySelector('#lppApp .lpp-hero')?.before(banner);
    }
  }

  async function joinSession(){
    const c=(document.getElementById('joinCode').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
    const status=document.getElementById('joinStatus');
    if(c.length<4){alert(tx('Please enter a valid session code.','يرجى إدخال رمز جلسة صحيح.'));return;}
    status.textContent=tx('Checking session…','جارٍ التحقق من الجلسة...');
    try{
      const r=await fetch(`${API}/api/lpp/sessions/${encodeURIComponent(c)}`); const d=await r.json();
      if(!r.ok||!d.ok||d.session?.closed_at||d.session?.closed) throw new Error('not-found');
      localStorage.setItem(SESSION_KEY,c); if(d.session?.name)localStorage.setItem(SESSION_NAME_KEY,d.session.name); location.href=sessionUrl(c);
    }catch(e){status.innerHTML=`<p class="lpp-session-error">${tx('This session could not be verified. Check the code and try again.','تعذر التحقق من هذه الجلسة. راجع الرمز وحاول مرة أخرى.')}</p>`;}
  }

  function wire(){
    if(!document.getElementById('lppEntryHub')) return;
    document.getElementById('entryIndividual')?.addEventListener('click',()=>{document.getElementById('lppSessionOverlay')?.remove();document.getElementById('startBtn')?.click();});
    document.getElementById('entryTrainer')?.addEventListener('click',()=>{document.getElementById('trainerCreateBox')?.classList.remove('hidden');document.getElementById('joinSessionBox')?.classList.add('hidden');});
    document.getElementById('trainerBenefitToggle')?.addEventListener('click',e=>{const d=document.getElementById('trainerBenefitDetails');if(!d)return;const opening=d.classList.contains('hidden');d.classList.toggle('hidden');e.currentTarget.setAttribute('aria-expanded',opening?'true':'false');});
    document.getElementById('entryJoin')?.addEventListener('click',()=>{document.getElementById('joinSessionBox')?.classList.remove('hidden');document.getElementById('trainerCreateBox')?.classList.add('hidden');});
    document.getElementById('createSessionBtn')?.addEventListener('click',createLiveSession);
    document.getElementById('joinCodeBtn')?.addEventListener('click',joinSession);
    document.getElementById('copyActiveSession')?.addEventListener('click',e=>copyText(sessionUrl(activeSession()),e.currentTarget));
    document.getElementById('createAnotherSession')?.addEventListener('click',()=>{document.getElementById('newTrainerSessionArea')?.classList.remove('hidden');document.getElementById('createAnotherSession')?.classList.add('hidden');});
    document.getElementById('closeSessionPanel')?.addEventListener('click',()=>document.getElementById('lppSessionOverlay')?.remove());
  }

  function showModeOverlay(){
    if(!mode||document.getElementById('lppSessionOverlay')) return;
    const overlay=document.createElement('div');overlay.id='lppSessionOverlay';overlay.className='lpp-session-overlay';overlay.innerHTML=panelsMarkup(true);document.body.appendChild(overlay);wire();
    if(mode==='trainer'&&!ownsSession(activeSession())) document.getElementById('entryTrainer')?.click();
  }
  function injectStartHub(){if(mode||incoming)return;const hero=document.querySelector('#lppApp .lpp-hero');if(!hero||document.getElementById('lppEntryHub'))return;hero.insertAdjacentHTML('beforebegin',panelsMarkup(false));wire();}
  function injectSessionBanner(){if(!incoming)return;const hero=document.querySelector('#lppApp .lpp-hero');if(!hero||document.getElementById('activeSessionBanner'))return;const name=localStorage.getItem(SESSION_NAME_KEY)||'';hero.insertAdjacentHTML('beforebegin',`<div class="lpp-session-banner" id="activeSessionBanner"><b>${tx('Group session','جلسة المجموعة')}:</b> <span dir="ltr">${esc(incoming)}</span>${name?` <small>${esc(name)}</small>`:''}</div>`);}
  function injectSessionIntoResults(){const c=incoming||localStorage.getItem(SESSION_KEY)||'';if(!c)return;const head=document.querySelector('#lppApp .lpp-results-head');if(!head||document.getElementById('resultSessionBadge'))return;head.insertAdjacentHTML('afterend',`<div class="lpp-result-session" id="resultSessionBadge"><b>${tx('Group session code','رمز جلسة المجموعة')}</b><span dir="ltr">${esc(c)}</span><small id="cloudSubmitStatus"></small></div>`);submitCompletedResult(c);}

  function calcForSubmit(state){
    const D=window.LPP_DATA,raw={A:0,R:0,T:0,P:0},facets={};
    (D?.items||[]).forEach(i=>{const v=Number((state.responses||{})[i.item_id]||0);raw[i.construct_code]+=v;facets[i.facet_code]=(facets[i.facet_code]||0)+v;});
    const scores={};Object.keys(raw).forEach(k=>scores[k]=Math.round(raw[k]/64*100));
    const facetPct={};Object.keys(facets).forEach(k=>facetPct[k]=Math.round(facets[k]/16*100));
    return {scores,facets:facetPct};
  }

  async function submitCompletedResult(c){
    let state={};try{state=JSON.parse(localStorage.getItem(LPP_KEY)||'{}');}catch(e){}
    if(!state.completedAt||!state.responses||Object.keys(state.responses).length<64)return;
    const marker=`tamayuz10x-lpp-submitted-${c}-${state.completedAt}`;if(localStorage.getItem(marker))return;
    const participantKey=`tamayuz10x-lpp-participant-${c}`;let pid=localStorage.getItem(participantKey);if(!pid){pid=(crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`);localStorage.setItem(participantKey,pid);}
    const x=calcForSubmit(state);const started=state.startedAt?new Date(state.startedAt).toISOString():null;const completed=new Date(state.completedAt).toISOString();
    const payload={participant_id:pid,language:state.lang==='en'?'en':'ar',started_at:started,completed_at:completed,duration_seconds:state.startedAt?Math.max(0,Math.round((state.completedAt-state.startedAt)/1000)):null,responses:state.responses,scores:x.scores,facets:x.facets};
    const status=document.getElementById('cloudSubmitStatus');if(status)status.textContent=tx(' · Sending to group…',' · جارٍ إرسال النتيجة للمجموعة...');
    try{const r=await fetch(`${API}/api/lpp/sessions/${encodeURIComponent(c)}/responses`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok||!d.ok)throw new Error();localStorage.setItem(marker,'1');if(status)status.textContent=tx(' · Added to group',' · أضيفت إلى المجموعة');}catch(e){if(status)status.textContent=tx(' · Group sync pending',' · مزامنة المجموعة معلّقة');}
  }

  const app=document.getElementById('lppApp');if(app){const observer=new MutationObserver(()=>{injectStartHub();injectSessionBanner();injectSessionIntoResults();});observer.observe(app,{childList:true,subtree:true});}
  validateIncomingSession();showModeOverlay();injectStartHub();injectSessionBanner();injectSessionIntoResults();
})();