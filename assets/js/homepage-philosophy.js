(() => {
  if (window.__tenxHomepageEnhancementLoaded) return;
  window.__tenxHomepageEnhancementLoaded = true;

  const path = window.location.pathname.replace(/\/+$/, '');
  const isHomepage = !path || path === '/en' || /\/index\.html$/i.test(path);
  if (!isHomepage) return;

  // Homepage philosophy copy is maintained directly in index.html / en/index.html.
  // Do not replace it at runtime; this preserves bilingual parity and progressive enhancement.

  if (!window.__tenxHomepageLatestCaseLoaded) {
    const script = document.createElement('script');
    script.src = '/assets/js/homepage-latest-case.js?v=20260913-latestcase1';
    script.defer = true;
    document.head.appendChild(script);
  }
})();
