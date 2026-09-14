(() => {
  const html = document.documentElement;
  const isAr = (html.lang || '').toLowerCase().startsWith('ar');
  document.body.classList.add('quranic-reflection-page','quranic-reflection-shell');

  const main = document.querySelector('main.container');
  if (!main) return;

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="reflection-topbar"><div class="container">
      <span>${isAr ? 'تأملات 10X في القرآن' : '10X Reflections from the Qur’an'}</span>
      <a href="${isAr ? '/en/reflection-yusuf-building-tomorrow.html' : '/reflection-yusuf-building-tomorrow.html'}" hreflang="${isAr ? 'en' : 'ar'}">${isAr ? 'English' : 'العربية'}</a>
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
})();
