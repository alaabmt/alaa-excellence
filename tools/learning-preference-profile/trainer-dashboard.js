(() => {
  'use strict';
  const API='https://api.tamayuz10x.com';
  const qs=new URLSearchParams(location.search);
  const code=(qs.get('session')||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
  const root=document.getElementById('dashboardRoot');
  let lang='ar';
  const tx=(en,ar)=>lang==='ar'?ar:en;
  const names={A:{en:'Action Engagement',ar:'التَّعَلُّم بالمُمارَسَة'},R:{en:'Reflective Processing',ar:'التَّأَمُّل والمُراجَعَة'},T:{en:'Conceptual Analysis',ar:'التَّحليل المَفاهيمي'},P:{en:'Practical Application',ar:'التَّطبيق العَمَلي'}};
  const cls=k=>`code-${k}`;
  function token(){return localStorage.getItem(`tamayuz10x-lpp-trainer-token-${code}`)||'';}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function renderError(msg){root.innerHTML=`<h1>${tx('Group dashboard','لوحة المجموعة')}</h1><div class="lpp-session-error">${esc(msg)}</div><p>${tx('Open this dashboard from the trainer session creation screen in the same browser.','افتح هذه اللوحة من شاشة إنشاء جلسة المدرّب في المتصفح نفسه.')}</p>`;}
  async function load(){
    if(!code){renderError(tx('Missing session code.','رمز الجلسة غير موجود.'));return;}
    const t=token();
    if(!t){renderError(tx('Trainer access token is not available in this browser.','رمز وصول المدرّب غير متاح في هذا المتصفح.'));return;}
    root.innerHTML=`<h1>${tx('Loading group dashboard…','جارٍ تحميل لوحة المجموعة...')}</h1>`;
    try{
      const r=await fetch(`${API}/api/lpp/sessions/${encodeURIComponent(code)}/dashboard`,{headers:{Authorization:`Bearer ${t}`}});
      const d=await r.json();
      if(!r.ok||!d.ok) throw new Error(d.error||'Dashboard error');
      render(d);
    }catch(e){renderError(tx('The Cloudflare backend is not connected yet, or the dashboard could not be reached.','خدمة Cloudflare الخلفية غير متصلة بعد، أو تعذر الوصول إلى لوحة المجموعة.'));}
  }
  function render(d){
    const avg=d.averages||{}; const dist=d.distribution||{}; const n=d.participant_count||0;
    const scoreCards=['A','R','T','P'].map(k=>`<div class="trainer-score ${cls(k)}"><span>${esc(names[k][lang])}</span><b>${Number(avg[k]||0).toFixed(1)}%</b></div>`).join('');
    root.innerHTML=`
      <div class="lpp-results-head"><div><span class="lpp-eyebrow">${tx('Trainer Group Dashboard','لوحة المدرّب للمجموعة')}</span><h1 class="lpp-profile-title">${esc(d.session?.name||tx('Learning Preference Group','مجموعة تفضيلات التعلّم'))}</h1><p class="lpp-profile-sub">${tx(`Session ${code} · ${n} completed participants`,`الجلسة ${code} · ${n} مشاركًا أكملوا التقييم`)}</p></div><button class="lpp-btn" id="refreshDash">${tx('Refresh','تحديث')}</button></div>
      <div class="trainer-summary">${scoreCards}</div>
      <div class="lpp-section-block"><h2>${tx('Leading-profile distribution','توزيع الملفات البارزة')}</h2><div class="lpp-meaning-grid">
        <article class="lpp-meaning-card code-A"><div class="lpp-card-head"><h3>${esc(names.A[lang])}</h3><strong>${dist.A||0}</strong></div></article>
        <article class="lpp-meaning-card code-R"><div class="lpp-card-head"><h3>${esc(names.R[lang])}</h3><strong>${dist.R||0}</strong></div></article>
        <article class="lpp-meaning-card code-T"><div class="lpp-card-head"><h3>${esc(names.T[lang])}</h3><strong>${dist.T||0}</strong></div></article>
        <article class="lpp-meaning-card code-P"><div class="lpp-card-head"><h3>${esc(names.P[lang])}</h3><strong>${dist.P||0}</strong></div></article>
        <article class="lpp-meaning-card"><div class="lpp-card-head"><h3>${tx('Relatively balanced','متوازن نسبيًا')}</h3><strong>${dist.balanced||0}</strong></div></article>
      </div></div>
      <div class="lpp-section-block"><h2>${tx('How to use this view','كيف تستخدم هذه اللوحة؟')}</h2><p class="lpp-profile-sub">${tx('Use the averages and distribution to balance the session across practice, reflection, conceptual understanding, and application. Do not label the whole group with one fixed type.','استخدم المتوسطات والتوزيع لموازنة الجلسة بين الممارسة والتأمل والفهم المفاهيمي والتطبيق. لا تصنّف المجموعة كلها في نمط ثابت واحد.')}</p></div>`;
    document.getElementById('refreshDash').onclick=load;
  }
  document.getElementById('dashLang').onclick=()=>{lang=lang==='ar'?'en':'ar';document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.getElementById('dashLang').textContent=lang==='ar'?'English':'العربية';load();};
  load();
})();
