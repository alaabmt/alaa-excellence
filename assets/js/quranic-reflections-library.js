(() => {
  const path = window.location.pathname.replace(/\/+$/, '');
  const isArabic = (document.documentElement.lang || '').toLowerCase().startsWith('ar');
  const isArticles = path === '/articles.html' || path === '/en/articles.html';
  if (!isArticles || document.querySelector('.quranic-reflections-entry')) return;

  const library = document.querySelector('.articles-library');
  if (!library) return;

  const style = document.createElement('style');
  style.textContent = `
    .quranic-reflections-entry{margin:0 0 28px;padding:26px 28px;border:1px solid #d8e2ec;border-radius:22px;background:linear-gradient(135deg,#f8fbfd 0%,#fff 100%);box-shadow:0 12px 32px rgba(11,49,85,.06)}
    .quranic-reflections-entry .qre-kicker{display:inline-block;margin-bottom:8px;color:#9b7436;font-size:.82rem;font-weight:900;letter-spacing:.02em}
    .quranic-reflections-entry h2{margin:0 0 10px;color:#0b2b4b;font-size:clamp(1.55rem,3vw,2.15rem);line-height:1.45}
    .quranic-reflections-entry p{margin:0;color:#596b7d;line-height:1.9;max-width:920px}
    .quranic-reflections-entry .qre-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
    .quranic-reflections-entry a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;border-radius:999px;font-weight:850;text-decoration:none}
    .quranic-reflections-entry .qre-primary{background:#0b3155;color:#fff}
    .quranic-reflections-entry .qre-secondary{border:1px solid #c8d5e1;background:#fff;color:#0b3155}
    @media(max-width:640px){.quranic-reflections-entry{padding:22px 18px;border-radius:18px}.quranic-reflections-entry .qre-actions{display:grid;grid-template-columns:1fr}.quranic-reflections-entry a{width:100%}}
  `;
  document.head.appendChild(style);

  const box = document.createElement('section');
  box.className = 'quranic-reflections-entry';
  box.setAttribute('aria-label', isArabic ? 'تأملات قرآنية' : 'Quranic Reflections');
  box.innerHTML = isArabic ? `
    <span class="qre-kicker">سلسلة جديدة</span>
    <h2>تأملات قرآنية في التميّز</h2>
    <p>تأملات تدبرية معاصرة تنطلق من المعاني التي قررها أهل التفسير، ثم تستلهم منها أسئلة في القيادة والتحول وبناء القدرات، مع استخدام عدسة 10X دون فرض المصطلحات الإدارية الحديثة على النص القرآني.</p>
    <div class="qre-actions">
      <a class="qre-primary" href="/quranic-reflections.html">استكشف التأملات القرآنية ←</a>
      <a class="qre-secondary" href="/reflection-yusuf-building-tomorrow.html">يوسف عليه السلام: حين يُبنى الغد في زمن السعة</a>
    </div>` : `
    <span class="qre-kicker">New series</span>
    <h2>Qur’anic Reflections on Excellence</h2>
    <p>Contemporary reflections grounded in established tafsir, drawing leadership, transformation and capability-building questions from Qur’anic scenes while using the 10X lens without imposing modern management concepts on the text.</p>
    <div class="qre-actions">
      <a class="qre-primary" href="/en/quranic-reflections.html">Explore Qur’anic Reflections →</a>
      <a class="qre-secondary" href="/en/reflection-yusuf-building-tomorrow.html">Yusuf: Building Tomorrow in Times of Abundance</a>
    </div>`;

  library.insertBefore(box, library.firstChild);
})();