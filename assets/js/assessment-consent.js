(() => {
  'use strict';
  const path = location.pathname;
  if (!path.includes('/tools/')) return;
  const isAr = document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl' || /\/ar\.html$/i.test(path);
  const key = 'tamayuz10x-assessment-consent-v1';
  if (sessionStorage.getItem(key) === 'accepted') return;

  const style = document.createElement('style');
  style.textContent = `
    .t10x-consent{position:fixed;inset:0;z-index:2147483647;background:rgba(15,23,42,.62);display:grid;place-items:center;padding:18px;font-family:inherit}
    .t10x-consent-card{width:min(520px,100%);background:#fff;color:#172033;border-radius:18px;padding:24px;box-shadow:0 24px 70px rgba(0,0,0,.25);text-align:start}
    .t10x-consent-card h2{margin:0 0 10px;font-size:1.35rem}.t10x-consent-card p{margin:0 0 16px;line-height:1.75;color:#475569}
    .t10x-consent-check{display:flex;gap:10px;align-items:flex-start;line-height:1.55;margin:12px 0 18px}.t10x-consent-check input{margin-top:5px;width:18px;height:18px;flex:0 0 auto}
    .t10x-consent-actions{display:flex;gap:10px;flex-wrap:wrap}.t10x-consent-actions button{border:0;border-radius:10px;padding:11px 18px;font:inherit;font-weight:700;cursor:pointer}
    #t10xConsentStart{background:#173f67;color:#fff}#t10xConsentStart:disabled{opacity:.45;cursor:not-allowed}#t10xConsentDecline{background:#eef2f6;color:#334155}
    .t10x-consent-links{font-size:.82rem;margin-top:14px!important}.t10x-consent-links a{color:#173f67;text-decoration:underline}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 't10x-consent';
  overlay.dir = isAr ? 'rtl' : 'ltr';
  overlay.innerHTML = isAr ? `
    <section class="t10x-consent-card" role="dialog" aria-modal="true" aria-labelledby="t10xConsentTitle">
      <h2 id="t10xConsentTitle">قبل أن تبدأ</h2>
      <p>هذا التقييم مخصص للتأمل والتطوير، وليس اختبارًا للقدرة أو تشخيصًا. قد نستخدم إجاباتك ونتائجك، دون طلب اسمك، لتحسين الأداة والجودة وإجراء التحليلات المرتبطة بتطويرها.</p>
      <label class="t10x-consent-check"><input id="t10xConsentBox" type="checkbox"><span>قرأت المعلومات أعلاه وأوافق على المشاركة واستخدام بياناتي لهذه الأغراض.</span></label>
      <div class="t10x-consent-actions"><button id="t10xConsentStart" disabled>أوافق وأبدأ</button><button id="t10xConsentDecline">لا أوافق</button></div>
      <p class="t10x-consent-links"><a href="/privacy-data-use.html" target="_blank" rel="noopener">سياسة الخصوصية واستخدام البيانات</a> · <a href="/terms-of-use.html" target="_blank" rel="noopener">شروط الاستخدام</a></p>
    </section>` : `
    <section class="t10x-consent-card" role="dialog" aria-modal="true" aria-labelledby="t10xConsentTitle">
      <h2 id="t10xConsentTitle">Before you begin</h2>
      <p>This assessment is for reflection and development, not ability testing or diagnosis. Your responses and results may be used, without requiring your name, for quality improvement, tool development, and related analysis.</p>
      <label class="t10x-consent-check"><input id="t10xConsentBox" type="checkbox"><span>I have read the information above and agree to participate and to the use of my data for these purposes.</span></label>
      <div class="t10x-consent-actions"><button id="t10xConsentStart" disabled>Agree &amp; Start</button><button id="t10xConsentDecline">I do not agree</button></div>
      <p class="t10x-consent-links"><a href="/privacy-data-use.html" target="_blank" rel="noopener">Privacy &amp; Data Use</a> · <a href="/terms-of-use.html" target="_blank" rel="noopener">Terms of Use</a></p>
    </section>`;
  document.body.appendChild(overlay);
  const box = document.getElementById('t10xConsentBox');
  const start = document.getElementById('t10xConsentStart');
  box.addEventListener('change', () => { start.disabled = !box.checked; });
  start.addEventListener('click', () => { sessionStorage.setItem(key, 'accepted'); overlay.remove(); });
  document.getElementById('t10xConsentDecline').addEventListener('click', () => { location.href = '/personality.html'; });
})();