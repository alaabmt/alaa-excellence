(() => {
  const html = document.documentElement;
  const isAr = (html.lang || '').toLowerCase().startsWith('ar');
  document.body.classList.add('quranic-reflection-page','quranic-reflection-shell');

  const main = document.querySelector('main.container');
  if (!main) return;

  const path = location.pathname;
  const isDhul = path.includes('reflection-dhul-qarnayn-building-capability.html');
  const isYusuf = path.includes('reflection-yusuf-building-tomorrow.html');
  const counterpart = isDhul
    ? (isAr ? '/en/reflection-dhul-qarnayn-building-capability.html' : '/reflection-dhul-qarnayn-building-capability.html')
    : (isAr ? '/en/reflection-yusuf-building-tomorrow.html' : '/reflection-yusuf-building-tomorrow.html');

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="reflection-topbar"><div class="container">
      <span>${isAr ? 'تأملات 10X في القرآن' : '10X Reflections from the Qur’an'}</span>
      <a href="${counterpart}" hreflang="${isAr ? 'en' : 'ar'}">${isAr ? 'English' : 'العربية'}</a>
    </div></div>
    <div class="reflection-brand-row">
      <a href="${isAr ? '/' : '/en/'}"><img src="/assets/images/file_0000000047188210ac6952e999d2eda7.png?v=20260910-logo4" alt="${isAr ? 'شعار التميّز 10X' : 'Tamayuz 10X logo'}"></a>
    </div>
    <nav class="reflection-nav"><div class="container">
      <a href="${isAr ? '/' : '/en/'}">${isAr ? 'الرئيسية' : 'Home'}</a>
      <a href="${isAr ? '/articles.html' : '/en/articles.html'}">${isAr ? 'حالات وتجارب 10X' : '10X Cases & Experiences'}</a>
      <a class="active" href="${isAr ? '/quranic-reflections.html' : '/en/quranic-reflections.html'}">${isAr ? 'تأملات قرآنية' : 'Qur’anic Reflections'}</a>
      <a href="${isAr ? '/research.html' : '/en/research.html'}">${isAr ? 'الأبحاث والمنشورات' : 'Research & Publications'}</a>
    </div></nav>`;
  document.body.insertBefore(header, main);

  const footer = document.createElement('footer');
  footer.className = 'reflection-footer';
  footer.innerHTML = `<div class="container"><strong><a href="${isAr ? '/' : '/en/'}">${isAr ? 'التميّز 10X | Tamayuz 10X' : 'Tamayuz 10X'}</a></strong><p>${isAr ? 'تأملات معاصرة تستلهم هدايات القرآن مع التمييز الواضح بين التفسير والتدبر والتطبيق المعاصر.' : 'Contemporary reflections inspired by the Qur’an, with a clear distinction between established tafsir, reflection, and modern application.'}</p></div>`;
  document.body.appendChild(footer);

  const method = main.querySelector('article > aside');
  if (method) method.setAttribute('role','note');

  // Social sharing policy: use a fresh, crawler-facing URL when one exists.
  // This avoids stale WhatsApp/Meta previews while the share page redirects readers to the canonical article.
  let shareUrl = location.href.split('#')[0];
  if (isDhul && isAr) shareUrl = `${location.origin}/share/dhul-qarnayn-capability-ar.html`;

  if (isDhul && isAr) {
    const article = main.querySelector('article');
    const share = document.createElement('div');
    share.className = 'reflection-share';
    share.setAttribute('dir','rtl');
    share.innerHTML = `<button type="button" class="reflection-share-button">مشاركة التأمل</button>`;
    article.appendChild(share);
    const btn = share.querySelector('button');
    btn.style.cssText='border:0;border-radius:999px;padding:.75rem 1.2rem;background:#102845;color:#fff;font:inherit;font-weight:700;cursor:pointer;margin:1.5rem 0';
    btn.addEventListener('click', async () => {
      const data = {title: document.title, text: 'ذو القرنين: حين لا يكون الحل أن تفعل عنهم، بل أن تبني القدرة معهم', url: shareUrl};
      if (navigator.share) {
        try { await navigator.share(data); return; } catch (e) { if (e && e.name === 'AbortError') return; }
      }
      location.href = `https://wa.me/?text=${encodeURIComponent(data.text + '\n' + shareUrl)}`;
    });
  }
})();
