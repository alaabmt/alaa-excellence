(() => {
  'use strict';
  const API='https://api.tamayuz10x.com';
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

  function copyText(value,button){
    const done=()=>{const old=button.textContent;button.textContent=tx('Copied','تم النسخ');setTimeout(()=>button.textContent=old,1400);};
    if(navigator.clipboard&&window.isSecureContext) navigator.clipboard.writeText(value).then(done).catch(()=>window.prompt(tx('Copy this link','انسخ هذا الرابط'),value));
    else window.prompt(tx('Copy this link','انسخ هذا الرابط'),value);
  }

  function panelsMarkup(compact=false){
    const active=incoming||localStorage.getItem(SESSION_KEY)||'';
    return `<section class="lpp-entry-hub ${compact?'lpp-entry-modal-card':''}" id="lppEntryHub">
      ${compact?`<button type="button" class="lpp-session-close" id="closeSessionPanel" aria-label="${tx('Close','إغلاق')}">×</button>`:''}
      <div class="lpp-entry-title"><span>${tx('Choose how you want to use the profile','اختر طريقة استخدام ملف تفضيلات التعلّم')}</span><h2>${tx('Individual, trainer session, or group code','فردي، جلسة للمدرّب، أو رمز للمجموعة')}</h2></div>
      ${active?`<div class="lpp-session-banner"><b>${tx('Group session','جلسة المجموعة')}:</b> <span dir="ltr">${esc(active)}</span></div>`:''}
      <div class="lpp-entry-grid">
        <article class="lpp-entry-card participant"><div class="lpp-entry-icon">1</div><h3>${tx('Participant','للمشارك')}</h3><p>${tx('Take the assessment and receive your personal learning preference report.','أكمل التقييم واحصل على تقريرك الشخصي لتفضيلات التعلّم.')}</p><button class="lpp-btn primary" id="entryIndividual">${tx('Start my assessment','ابدأ تقييمي')}</button></article>
        <article class="lpp-entry-card trainer"><div class="lpp-entry-icon">2</div><h3>${tx('Trainer / Facilitator','للمدرّب / الميسّر')}</h3><p>${tx('Create a live group session with a code, link, QR, and group dashboard.','أنشئ جلسة مجموعة مباشرة مع رمز ورابط وQR ولوحة نتائج للمجموعة.')}</p><button class="lpp-btn" id="entryTrainer">${tx('Create a group session','أنشئ جلسة للمجموعة')}</button></article>
        <article class="lpp-entry-card join"><div class="lpp-entry-icon">3</div><h3>${tx('I have a group code','لدي رمز مجموعة')}</h3><p>${tx('Enter the code provided by your trainer.','أدخل الرمز الذي أرسله المدرب.')}</p><button class="lpp-btn" id="entryJoin">${tx('Enter group code','أدخل رمز المجموعة')}</button></article>
      </div>
      <div class="lpp-session-box hidden" id="trainerCreateBox"><h3>${tx('Create trainer session','إنشاء جلسة للمدرّب')}</h3><label>${tx('Session name (optional)','اسم الجلسة (اختياري)')}<input id="sessionName" maxlength="80" placeholder="${tx('e.g., Leadership Workshop','مثال: ورشة القيادة')}"></label><button class="lpp-btn primary" id="createSessionBtn" type="button">${tx('Create live session','إنشاء جلسة مباشرة')}</button><div id="sessionCreated"></div></div>
      <div class="lpp-session-box hidden" id="joinSessionBox"><h3>${tx('Join a group session','الانضمام إلى جلسة مجموعة')}</h3><div class="lpp-code-row"><input id="joinCode" maxlength="8" autocomplete="off" placeholder="ABC123"><button class="lpp-btn primary" id="joinCodeBtn" type="button">${tx('Join','انضم')}</button></div><p class="lpp-help">${tx('Letters and numbers only.','حروف وأرقام فقط.')}</p><div id="joinStatus"></div></div>
    </section>`;
  }

  function renderCreated(c,u,name,live=true){
    const host=document.getElementById('sessionCreated'); if(!host) return;
    const q1=qrPrimary(u), q2=qrFallback(u);
    const dashboard=`trainer-dashboard.html?session=${encodeURIComponent(c)}`;
    host.innerHTML=`${live?'':'<p class="lpp-session-error">'+tx('Cloudflare is not connected yet. This temporary code will not collect group results across devices.','Cloudflare غير متصل بعد. هذا الرمز مؤقت ولن يجمع نتائج المجموعة بين الأجهزة.')+'</p>'}<div class="lpp-session-created"><div class="lpp-session-details"><span>${tx('Session code','رمز الجلسة')}</span><strong dir="ltr">${c}</strong>${name?`<small>${esc(name)}</small>`:''}<label>${tx('Participant link','رابط المشاركين')}<input value="${esc(u)}" readonly></label><div class="lpp-actions"><button class="lpp-btn" id="copySession" type="button">${tx('Copy link','نسخ الرابط')}</button><a class="lpp-btn primary" href="${esc(u)}">${tx('Open participant link','فتح رابط المشارك')}</a><a class="lpp-btn" id="openQr" href="${esc(q1)}" target="_blank" rel="noopener">${tx('Open QR','فتح QR')}</a>${live?`<a class="lpp-btn" href="${esc(dashboard)}">${tx('Open group dashboard','فتح لوحة المجموعة')}</a>`:''}</div></div><div class="lpp-qr"><img id="sessionQrImage" src="${esc(q1)}" data-fallback="${esc(q2)}" alt="QR code"><span>${tx('Participants can scan this QR code with their phone camera.','يمكن للمشاركين مسح رمز QR بكاميرا الهاتف.')}</span><small id="qrStatus"></small></div></div>`;
    document.getElementById('copySession').onclick=e=>copyText(u,e.currentTarget);
    const img=document.getElementById('sessionQrImage');
    img.addEventListener('error',()=>{const fb=img.dataset.fallback;if(fb&&img.src!==fb){img.src=fb;document.getElementById('openQr').href=fb;}else document.getElementById('qrStatus').textContent=tx('QR image could not load. Use the link or code.','تعذر تحميل QR. استخدم الرابط أو الرمز.');});
  }

  async function createLiveSession(){
    const btn=document.getElementById('createSessionBtn'); const host=document.getElementById('sessionCreated');
    const name=(document.getElementById('sessionName').value||'').trim();
    btn.disabled=true; btn.textContent=tx('Creating…','جارٍ الإنشاء...'); host.innerHTML='';
    try{
      const r=await fetch(`${API}/api/lpp/sessions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});
      const d=await r.json(); if(!r.ok||!d.ok) throw new Error(d.error||'Create failed');
      const c=d.session.code, u=d.session.participant_url||sessionUrl(c);
      localStorage.setItem(SESSION_KEY,c); localStorage.setItem(SESSION_NAME_KEY,name);
      localStorage.setItem(`tamayuz10x-lpp-trainer-token-${c}`,d.trainer_token);
      renderCreated(c,u,name,true);
    }catch(e){
      host.innerHTML=`<p class="lpp-session-error">${tx('The live Cloudflare session could not be created yet. The backend still needs to be deployed/connected.','تعذر إنشاء الجلسة المباشرة على Cloudflare حتى الآن. ما زالت الخدمة الخلفية تحتاج إلى النشر/الربط.')}</p>`;
    }finally{btn.disabled=false;btn.textContent=tx('Create live session','إنشاء جلسة مباشرة');}
  }

  async function joinSession(){
    const c=(document.getElementById('joinCode').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
    const status=document.getElementById('joinStatus');
    if(c.length<4){alert(tx('Please enter a valid group code.','يرجى إدخال رمز مجموعة صحيح.'));return;}
    status.textContent=tx('Checking session…','جارٍ التحقق من الجلسة...');
    try{
      const r=await fetch(`${API}/api/lpp/sessions/${encodeURIComponent(c)}`); const d=await r.json();
      if(!r.ok||!d.ok) throw new Error('not-found');
      localStorage.setItem(SESSION_KEY,c); location.href=sessionUrl(c);
    }catch(e){status.innerHTML=`<p class="lpp-session-error">${tx('This session could not be verified. Check the code or Cloudflare connection.','تعذر التحقق من هذه الجلسة. راجع الرمز أو اتصال Cloudflare.')}</p>`;}
  }

  function wire(){
    if(!document.getElementById('lppEntryHub')) return;
    document.getElementById('entryIndividual')?.addEventListener('click',()=>{document.getElementById('lppSessionOverlay')?.remove();document.getElementById('startBtn')?.click();});
    document.getElementById('entryTrainer').onclick=()=>{document.getElementById('trainerCreateBox').classList.remove('hidden');document.getElementById('joinSessionBox').classList.add('hidden');};
    document.getElementById('entryJoin').onclick=()=>{document.getElementById('joinSessionBox').classList.remove('hidden');document.getElementById('trainerCreateBox').classList.add('hidden');};
    document.getElementById('createSessionBtn').onclick=createLiveSession;
    document.getElementById('joinCodeBtn').onclick=joinSession;
    document.getElementById('closeSessionPanel')?.addEventListener('click',()=>document.getElementById('lppSessionOverlay')?.remove());
  }

  function showModeOverlay(){
    if(!mode||document.getElementById('lppSessionOverlay')) return;
    const overlay=document.createElement('div');overlay.id='lppSessionOverlay';overlay.className='lpp-session-overlay';overlay.innerHTML=panelsMarkup(true);document.body.appendChild(overlay);wire();
    if(mode==='trainer') document.getElementById('entryTrainer')?.click();
    if(mode==='join') document.getElementById('entryJoin')?.click();
  }
  function injectStartHub(){if(mode)return;const hero=document.querySelector('#lppApp .lpp-hero');if(!hero||document.getElementById('lppEntryHub'))return;hero.insertAdjacentHTML('beforebegin',panelsMarkup(false));wire();}
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
    try{const r=await fetch(`${API}/api/lpp/sessions/${encodeURIComponent(c)}/responses`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok||!d.ok)throw new Error();localStorage.setItem(marker,'1');if(status)status.textContent=tx(' · Added to group',' · أضيفت إلى المجموعة');}catch(e){if(status)status.textContent=tx(' · Group sync pending',' · مزامنة المجموعة غير متاحة');}
  }

  const app=document.getElementById('lppApp');if(app){const observer=new MutationObserver(()=>{injectStartHub();injectSessionIntoResults();});observer.observe(app,{childList:true,subtree:true});}
  showModeOverlay();injectStartHub();injectSessionIntoResults();
})();