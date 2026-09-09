(() => {
  'use strict';
  const SESSION_KEY='tamayuz10x-lpp-session';
  const params=new URLSearchParams(location.search);
  const incoming=(params.get('session')||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
  const mode=params.get('mode')||'';
  if(incoming) localStorage.setItem(SESSION_KEY,incoming);

  const tx=(en,ar)=>document.documentElement.lang==='ar'?ar:en;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const code=()=>{
    const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out='';
    crypto.getRandomValues(new Uint32Array(6)).forEach(n=>out+=chars[n%chars.length]);
    return out;
  };
  const baseUrl=()=>`${location.origin}${location.pathname}`;
  const sessionUrl=c=>`${baseUrl()}?session=${encodeURIComponent(c)}`;
  const qrUrl=u=>`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(u)}`;

  function copyText(value,button){
    navigator.clipboard?.writeText(value).then(()=>{
      const old=button.textContent; button.textContent=tx('Copied','تم النسخ'); setTimeout(()=>button.textContent=old,1400);
    }).catch(()=>prompt(tx('Copy this link','انسخ هذا الرابط'),value));
  }

  function entryMarkup(){
    const active=incoming||localStorage.getItem(SESSION_KEY)||'';
    return `<section class="lpp-entry-hub" id="lppEntryHub">
      <div class="lpp-entry-title"><span>${tx('Choose how you want to use the profile','اختر طريقة استخدام ملف تفضيلات التعلّم')}</span><h2>${tx('Individual, trainer session, or group code','فردي، جلسة للمدرّب، أو رمز للمجموعة')}</h2></div>
      ${active?`<div class="lpp-session-banner"><b>${tx('Group session','جلسة المجموعة')}:</b> <span dir="ltr">${esc(active)}</span> · ${tx('Your assessment will keep this session code in this browser.','سيحتفظ التقييم برمز الجلسة في هذا المتصفح.')}</div>`:''}
      <div class="lpp-entry-grid">
        <article class="lpp-entry-card participant"><div class="lpp-entry-icon">1</div><h3>${tx('Participant','للمشارك')}</h3><p>${tx('Take the assessment and receive your personal learning preference report.','أكمل التقييم واحصل على تقريرك الشخصي لتفضيلات التعلّم.')}</p><button class="lpp-btn primary" id="entryIndividual">${tx('Start my assessment','ابدأ تقييمي')}</button></article>
        <article class="lpp-entry-card trainer"><div class="lpp-entry-icon">2</div><h3>${tx('Trainer / Facilitator','للمدرّب / الميسّر')}</h3><p>${tx('Create a group session, then share a code, link, or QR code with participants.','أنشئ جلسة للمجموعة ثم شارك الرمز أو الرابط أو رمز QR مع المشاركين.')}</p><button class="lpp-btn" id="entryTrainer">${tx('Create a group session','أنشئ جلسة للمجموعة')}</button></article>
        <article class="lpp-entry-card join"><div class="lpp-entry-icon">3</div><h3>${tx('I have a group code','لدي رمز مجموعة')}</h3><p>${tx('Enter the code provided by your trainer to join the same session.','أدخل الرمز الذي أرسله المدرب للانضمام إلى الجلسة نفسها.')}</p><button class="lpp-btn" id="entryJoin">${tx('Enter group code','أدخل رمز المجموعة')}</button></article>
      </div>
      <div class="lpp-session-box hidden" id="trainerCreateBox">
        <h3>${tx('Create trainer session','إنشاء جلسة للمدرّب')}</h3><label>${tx('Session name (optional)','اسم الجلسة (اختياري)')}<input id="sessionName" maxlength="80" placeholder="${tx('e.g., Leadership Workshop','مثال: ورشة القيادة')}"></label>
        <button class="lpp-btn primary" id="createSessionBtn">${tx('Generate code, link and QR','إنشاء الرمز والرابط وQR')}</button>
        <div id="sessionCreated"></div>
      </div>
      <div class="lpp-session-box hidden" id="joinSessionBox">
        <h3>${tx('Join a group session','الانضمام إلى جلسة مجموعة')}</h3><div class="lpp-code-row"><input id="joinCode" maxlength="8" autocomplete="off" placeholder="ABC123"><button class="lpp-btn primary" id="joinCodeBtn">${tx('Join','انضم')}</button></div>
        <p class="lpp-help">${tx('Letters and numbers only.','حروف وأرقام فقط.')}</p>
      </div>
    </section>`;
  }

  function wire(){
    const hub=document.getElementById('lppEntryHub'); if(!hub) return;
    const indiv=document.getElementById('entryIndividual');
    indiv.onclick=()=>document.getElementById('startBtn')?.click();
    document.getElementById('entryTrainer').onclick=()=>{
      document.getElementById('trainerCreateBox').classList.toggle('hidden');
      document.getElementById('joinSessionBox').classList.add('hidden');
    };
    document.getElementById('entryJoin').onclick=()=>{
      document.getElementById('joinSessionBox').classList.toggle('hidden');
      document.getElementById('trainerCreateBox').classList.add('hidden');
    };
    document.getElementById('createSessionBtn').onclick=()=>{
      const c=code(), u=sessionUrl(c), name=document.getElementById('sessionName').value.trim();
      localStorage.setItem(SESSION_KEY,c);
      localStorage.setItem('tamayuz10x-lpp-session-name',name);
      document.getElementById('sessionCreated').innerHTML=`<div class="lpp-session-created"><div class="lpp-session-details"><span>${tx('Session code','رمز الجلسة')}</span><strong dir="ltr">${c}</strong>${name?`<small>${esc(name)}</small>`:''}<label>${tx('Participant link','رابط المشاركين')}<input value="${esc(u)}" readonly id="sessionLink"></label><div class="lpp-actions"><button class="lpp-btn" id="copySession">${tx('Copy link','نسخ الرابط')}</button><a class="lpp-btn primary" href="${esc(u)}">${tx('Open participant link','فتح رابط المشارك')}</a></div></div><div class="lpp-qr"><img src="${qrUrl(u)}" alt="QR code"><span>${tx('Participants can scan this QR code with their phone camera.','يمكن للمشاركين مسح رمز QR بكاميرا الهاتف.')}</span></div></div>`;
      document.getElementById('copySession').onclick=e=>copyText(u,e.currentTarget);
    };
    document.getElementById('joinCodeBtn').onclick=()=>{
      const c=(document.getElementById('joinCode').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
      if(c.length<4){alert(tx('Please enter a valid group code.','يرجى إدخال رمز مجموعة صحيح.'));return;}
      location.href=sessionUrl(c);
    };
    if(mode==='trainer') document.getElementById('entryTrainer').click();
    if(mode==='join') document.getElementById('entryJoin').click();
  }

  function injectStartHub(){
    const hero=document.querySelector('#lppApp .lpp-hero');
    if(!hero || document.getElementById('lppEntryHub')) return;
    hero.insertAdjacentHTML('beforebegin',entryMarkup());
    wire();
  }

  function injectSessionIntoResults(){
    const c=incoming||localStorage.getItem(SESSION_KEY)||'';
    if(!c) return;
    const head=document.querySelector('#lppApp .lpp-results-head');
    if(!head || document.getElementById('resultSessionBadge')) return;
    head.insertAdjacentHTML('afterend',`<div class="lpp-result-session" id="resultSessionBadge"><b>${tx('Group session code','رمز جلسة المجموعة')}</b><span dir="ltr">${esc(c)}</span></div>`);
  }

  const observer=new MutationObserver(()=>{injectStartHub();injectSessionIntoResults();});
  observer.observe(document.getElementById('lppApp'),{childList:true,subtree:true});
  injectStartHub(); injectSessionIntoResults();
})();