(() => {
  if (window.__tenxHomepageLatestCaseLoaded) return;
  window.__tenxHomepageLatestCaseLoaded = true;

  const lang = (document.documentElement.lang || '').toLowerCase();
  const isArabic = lang === 'ar' || lang.startsWith('ar-');
  const cleanPath = window.location.pathname.replace(/\/+$/, '');
  const isHomepage = !cleanPath || cleanPath === '/en' || /\/index\.html$/i.test(cleanPath);
  if (!isHomepage) return;

  const fallback = isArabic ? {
    source: '/articles.html',
    headingKicker: 'من حالات وتجارب 10X',
    heading: 'أحدث حالة تميّز 10X',
    tag: 'حالة 10X · رواندا',
    href: '/case-rwanda-blood-on-demand-aerial-logistics.html',
    title: 'عندما لا يعود موقع المستشفى هو الذي يحدد سرعة وصول الدم: كيف أعادت رواندا تصميم الإمداد الصحي؟',
    summary: 'ماذا يتغير عندما يصبح بالإمكان استدعاء منتج دم حرج من شبكة أوسع بدل تخزينه احتياطيًا في كل موقع؟ تكشف رواندا كيف ارتبط الإمداد الجوي عند الطلب بوصول أسرع وهدر أقل، مع حدود واضحة لما تثبته الأدلة.',
    cta: 'اكتشف كيف تغيّرت معادلة المخزون والزمن ←',
    image: '/assets/previews/case-rwanda-blood-on-demand-aerial-logistics-ar.png?v=20260912-preview6',
    imageAlt: 'معاينة أحدث حالة تميّز 10X'
  } : {
    source: '/en/articles.html',
    headingKicker: 'From 10X Cases & Experiences',
    heading: 'Latest Tamayuz 10X Case',
    tag: '10X Case · Rwanda',
    href: '/en/case-rwanda-blood-on-demand-aerial-logistics.html',
    title: "When Hospital Location No Longer Determines How Fast Blood Arrives: Rwanda's Supply Redesign",
    summary: 'What changes when a critical blood product can be called from a wider network instead of being held in reserve at every site? Rwanda shows how on-demand aerial supply was associated with faster access and less expiry, while the evidence still has clear limits.',
    cta: 'See how the inventory-time equation changed →',
    image: '/assets/previews/case-rwanda-blood-on-demand-aerial-logistics-en.png?v=20260912-preview6',
    imageAlt: 'Latest Tamayuz 10X case preview'
  };

  function findTargetSection() {
    return Array.from(document.querySelectorAll('main > section.soft.section')).find((section) => {
      const heading = section.querySelector('.section-heading h2');
      const text = heading?.textContent?.trim();
      return text === 'فكرة اليوم' || text === 'Idea of the Day' || section.hasAttribute('data-latest-case');
    });
  }

  function render(section, data) {
    if (!section || !data?.href) return;
    section.setAttribute('data-latest-case', '');
    section.innerHTML = `
      <div class="container">
        <div class="section-heading">
          <span>${data.headingKicker}</span>
          <h2>${data.heading}</h2>
        </div>
        <article class="featured-article">
          <div>
            <span class="tag">${data.tag}</span>
            <h3><a href="${data.href}">${data.title}</a></h3>
            <p><a href="${data.href}">${data.summary}</a></p>
            <a href="${data.href}">${data.cta}</a>
          </div>
          <div class="quote" style="padding:0;overflow:hidden;background:#fff">
            <a href="${data.href}" style="display:block" aria-label="${data.imageAlt}">
              <img src="${data.image}" alt="${data.imageAlt}" width="1200" height="630" loading="lazy" decoding="async" style="display:block;width:100%;height:auto;aspect-ratio:1200/630;object-fit:cover">
            </a>
          </div>
        </article>
      </div>`;
  }

  const target = findTargetSection();
  if (!target) return;
  render(target, fallback);

  fetch(fallback.source, { cache: 'no-store' })
    .then((response) => response.ok ? response.text() : Promise.reject(new Error('latest-case-source')))
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const card = doc.querySelector('.article-card[data-category~="case"]');
      if (!card) return;
      const title = card.querySelector('h3 a');
      const summary = card.querySelector('p a');
      const cta = card.querySelector('.article-action');
      const tag = card.querySelector('.article-meta .tag');
      const image = card.querySelector('.article-preview img');
      const href = title?.getAttribute('href') || card.dataset.href;
      if (!href || !title) return;

      render(target, {
        ...fallback,
        tag: tag?.textContent?.trim() || fallback.tag,
        href,
        title: title.textContent.trim(),
        summary: summary?.textContent?.trim() || fallback.summary,
        cta: cta?.textContent?.trim() || fallback.cta,
        image: image?.getAttribute('src') || fallback.image
      });
    })
    .catch(() => {});
})();
