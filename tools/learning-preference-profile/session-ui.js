(() => {
  'use strict';
  const SESSION_KEY='tamayuz10x-lpp-session';
  const SESSION_NAME_KEY='tamayuz10x-lpp-session-name';
  const params=new URLSearchParams(location.search);
  const incoming=(params.get('session')||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
  const mode=params.get('mode')||'';
  if(incoming) localStorage.setItem(SESSION_KEY,incoming);

  const tx=(en,ar)=>document.documentElement.lang==='ar'?ar:en;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeCode=()=>{
    const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out='';
    try{
      if(window.crypto && crypto.getRandomValues){
        const a=new Uint32Array(6); crypto.getRandomValues(a); a.forEach(n=>out+=chars[n%chars.length]);
      }
    }catch(e){}
    while(out.length<6) out+=chars[Math.floor(Math.random()*chars.length)];
    return out.slice(0,6);
  };
  const baseUrl=()=>`${location.origin}${location.pathname}`;
  const sessionUrl=c=>`${baseUrl()}?session=${encodeURIComponent(c)}`;
  const qrPrimary=u=>`https://quickchart.io/qr?size=260&margin=2&text=${encodeURIComponent(u)}`;
  const qrFallback=u=>`https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(u)}`;

  function copyText(value,button){
    const done=()=>{const old=button.textContent;button.textContent=tx('Copied','تم النسخ');setTimeout(()=>button.textContent=old,1400);};
    if(navigator.clipboard && window.isSecureContext){navigator.clipboard.writeText(value).then(done).catch(()=>window.prompt(tx('Copy this link','انسخ هذا الرابط'),value));}
    else window.prompt(tx('Copy this link','انسخ هذا الرابط'),value);
  }

  function panelsMarkup(compact=false){
    const active=incoming||localStorage.getItem(SESSION_KEY)||'';
    return `<section class="lpp-entry-hub ${compact?'lpp-entry-modal-card':''}" id="lppEntryHub">
      ${compact?`<button type="button" class="lpp-session-close" id="closeSessionPanel" aria-label="${tx('Close','إغلاق')}">×</button>`:''}
      <div class="lpp-entry-title"><span>${tx('Choose how you want to use the profile','اختر طريقة استخدام ملف تفضيلات التعلّم')}</span><h2>${tx('Individual, trainer session, or group code','فردي، جلسة للمدرّب، أو رمز للمجموعة')}</h2></div>
      ${active?`<div class="lpp-session-banner"><b>${tx('Group session','جلسة المجموعة')}:</b> <span dir="ltr">${esc(active)}</span> · ${tx('This browser is linked to this session code.','هذا المتصفح مرتبط برمز الجلسة هذا.')}</div>`:''}
      <div class="lpp-entry-grid">
        <article class="lpp-entry-card participant"><div class="lpp-entry-icon">1</div><h3>${tx('Participant','للمشارك')}</h3><p>${tx('Take the assessment and receive your personal learning preference report.','أكمل التقييم واحصل على تقريرك الشخصي لتفضيلات التعلّم.')}</p><button class="lpp-btn primary" id="entryIndividual">${tx('Start my assessment','ابدأ تقييمي')}</button></article>
        <article class="lpp-entry-card trainer"><div class="lpp-entry-icon">2</div><h3>${tx('Trainer / Facilitator','للمدرّب / الميسّر')}</h3><p>${tx('Create a group session and share a code, link, or QR code.','أنشئ جلسة للمجموعة وشارك الرمز أو الرابط أو رمز QR.')}</p><button class="lpp-btn" id="entryTrainer">${tx('Create a group session','أنشئ جلسة للمجموعة')}</button></article>
        <article class="lpp-entry-card join"><div class="lpp-entry-icon">3</div><h3>${tx('I have a group code','لدي رمز مجموعة')}</h3><p>${tx('Enter the code provided by your trainer.','أدخل الرمز الذي أرسله المدرب.')}</p><button class="lpp-btn" id="entryJoin">${tx('Enter group code','أدخل رمز المجموعة')}</button></article>
      </div>
      <div class="lpp-session-box hidden" id="trainerCreateBox">
        <h3>${tx('Create trainer session','إنشاء جلسة للمدرّب')}</h3>
        <label>${tx('Session name (optional)','اسم الجلسة (اختياري)')}<input id="sessionName" maxlength="80" placeholder="${tx('e.g., Leadership Workshop','مثال: ورشة القيادة')}"></label>
        <button class="lpp-btn primary" id="createSessionBtn" type="button">${tx('Generate code, link and QR','إنشاء الرمز والرابط وQR')}</button>
        <div id="sessionCreated"></div>
      </div>
      <div class="lpp-session-box hidden" id="joinSessionBox">
        <h3>${tx('Join a group session','الانضمام إلى جلسة مجموعة')}</h3><div class="lpp-code-row"><input id="joinCode" maxlength="8" autocomplete="off" placeholder="ABC123"><button class="lpp-btn primary" id="joinCodeBtn" type="button">${tx('Join','انضم')}</button></div>
        <p class="lpp-help">${tx('Letters and numbers only.','حروف وأرقام فقط.')}</p>
      </div>
    </section>`;
  }

  function renderCreated(c,u,name){
    const host=document.getElementById('sessionCreated'); if(!host) return;
    const q1=qrPrimary(u), q2=qrFallback(u);
    host.innerHTML=`<div class="lpp-session-created"><div class="lpp-session-details"><span>${tx('Session code','رمز الجلسة')}</span><strong dir="ltr">${c}</strong>${name?`<small>${esc(name)}</small>`:''}<label>${tx('Participant link','رابط المشاركين')}<input value="${esc(u)}" readonly id="sessionLink"></label><div class="lpp-actions"><button class="lpp-btn" id="copySession" type="button">${tx('Copy link','نسخ الرابط')}</button><a class="lpp-btn primary" href="${esc(u)}">${tx('Open participant link','فتح رابط المشارك')}</a><a class="lpp-btn" id="openQr" href="${esc(q1)}" target="_blank" rel="noopener">${tx('Open QR','فتح QR')}</a></div></div><div class="lpp-qr"><img id="sessionQrImage" src="${esc(q1)}" data-fallback="${esc(q2)}" alt="QR code"><span>${tx('Participants can scan this QR code with their phone camera.','يمكن للمشاركين مسح رمز QR بكاميرا الهاتف.')}</span><small id="qrStatus"></small></div></div>`;
    document.getElementById('copySession').onclick=e=>copyText(u,e.currentTarget);
    const img=document.getElementById('sessionQrImage');
    img.addEventListener('error',()=>{
      const fallback=img.dataset.fallback;
      if(fallback && img.src!==fallback){img.src=fallback;document.getElementById('openQr').href=fallback;}
      else document.getElementById('qrStatus').textContent=tx('QR image could not load. The session code and participant link still work.','تعذر تحميل صورة QR. ما يزال رمز الجلسة ورابط المشاركين يعملان.');
    },{once:false});
  }

  function wire(){
    const hub=document.getElementById('lppEntryHub'); if(!hub) return;
    const indiv=document.getElementById('entryIndividual');
    if(indiv) indiv.onclick=()=>{document.getElementById('lppSessionOverlay')?.remove();document.getElementById('startBtn')?.click();};
    document.getElementById('entryTrainer').onclick=()=>{document.getElementById('trainerCreateBox').classList.remove('hidden');document.getElementById('joinSessionBox').classList.add('hidden');};
    document.getElementById('entryJoin').onclick=()=>{document.getElementById('joinSessionBox').classList.remove('hidden');document.getElementById('trainerCreateBox').classList.add('hidden');};
    document.getElementById('createSessionBtn').onclick=()=>{
      try{
        const c=safeCode(), u=sessionUrl(c), name=(document.getElementById('sessionName').value||'').trim();
        localStorage.setItem(SESSION_KEY,c); localStorage.setItem(SESSION_NAME_KEY,name);
        renderCreated(c,u,name);
      }catch(e){
        const host=document.getElementById('sessionCreated');
        if(host) host.innerHTML=`<p class="lpp-session-error">${tx('Could not create the session in this browser. Please reload the page and try again.','تعذر إنشاء الجلسة في هذا المتصفح. أعد تحميل الصفحة وحاول مرة أخرى.')}</p>`;
      }
    };
    document.getElementById('joinCodeBtn').onclick=()=>{
      const c=(document.getElementById('joinCode').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
      if(c.length<4){alert(tx('Please enter a valid group code.','يرجى إدخال رمز مجموعة صحيح.'));return;}
      location.href=sessionUrl(c);
    };
    document.getElementById('closeSessionPanel')?.addEventListener('click',()=>document.getElementById('lppSessionOverlay')?.remove());
  }

  function showModeOverlay(){
    if(!mode || document.getElementById('lppSessionOverlay')) return;
    const overlay=document.createElement('div'); overlay.id='lppSessionOverlay'; overlay.className='lpp-session-overlay'; overlay.innerHTML=panelsMarkup(true); document.body.appendChild(overlay); wire();
    if(mode==='trainer') document.getElementById('entryTrainer')?.click();
    if(mode==='join') document.getElementById('entryJoin')?.click();
  }

  function injectStartHub(){
    if(mode) return;
    const hero=document.querySelector('#lppApp .lpp-hero');
    if(!hero || document.getElementById('lppEntryHub')) return;
    hero.insertAdjacentHTML('beforebegin',panelsMarkup(false)); wire();
  }

  function injectSessionIntoResults(){
    const c=incoming||localStorage.getItem(SESSION_KEY)||''; if(!c) return;
    const head=document.querySelector('#lppApp .lpp-results-head');
    if(!head || document.getElementById('resultSessionBadge')) return;
    head.insertAdjacentHTML('afterend',`<div class="lpp-result-session" id="resultSessionBadge"><b>${tx('Group session code','رمز جلسة المجموعة')}</b><span dir="ltr">${esc(c)}</span></div>`);
  }

  const app=document.getElementById('lppApp');
  if(app){const observer=new MutationObserver(()=>{injectStartHub();injectSessionIntoResults();});observer.observe(app,{childList:true,subtree:true});}
  showModeOverlay(); injectStartHub(); injectSessionIntoResults();
})();