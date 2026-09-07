(() => {
  if (window.__tenxMobileSocialShareLoaded) return;
  window.__tenxMobileSocialShareLoaded = true;

  const SHARE_REVISION = '20260907-social5';

  const isMobileLike = () => {
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    return coarse || narrow || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent || '');
  };

  const canonicalUrl = () => document.querySelector('link[rel="canonical"]')?.href || window.location.href.split('#')[0].split('?')[0];
  const pageTitle = () => document.querySelector('meta[property="og:title"]')?.content || document.querySelector('h1')?.textContent?.trim() || document.title;
  const pageDescription = () => document.querySelector('meta[property="og:description"]')?.content || document.querySelector('meta[name="description"]')?.content || '';

  function freshUrl(platform) {
    const base = canonicalUrl();
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}share=${encodeURIComponent(platform)}-${SHARE_REVISION}`;
  }

  function sharePayload(platform) {
    const title = pageTitle();
    const url = freshUrl(platform);
    const description = pageDescription();
    const text = description ? `${title}\n\n${description}` : title;
    return { title, text, url };
  }

  async function nativeShare(platform, fallbackUrl) {
    if (!navigator.share || !isMobileLike()) {
      window.location.href = fallbackUrl;
      return;
    }
    try {
      await navigator.share(sharePayload(platform));
    } catch (error) {
      if (error && error.name === 'AbortError') return;
      window.location.href = fallbackUrl;
    }
  }

  function openWhatsAppApp(fallbackUrl) {
    const title = pageTitle();
    const url = freshUrl('whatsapp');
    const message = encodeURIComponent(`${title}\n\n${url}`);
    const appUrl = `whatsapp://send?text=${message}`;
    let hidden = false;
    const onVisibility = () => { if (document.hidden) hidden = true; };
    document.addEventListener('visibilitychange', onVisibility, { once: true });
    window.location.href = appUrl;
    window.setTimeout(() => {
      if (!hidden && document.visibilityState === 'visible') window.location.href = fallbackUrl;
    }, 1600);
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a.tenx-share-btn');
    if (!link || !isMobileLike()) return;
    const href = link.href || '';

    if (href.includes('linkedin.com/sharing/share-offsite')) {
      if (!navigator.share) return;
      event.preventDefault();
      event.stopPropagation();
      nativeShare('linkedin', href);
      return;
    }

    if (href.includes('facebook.com/sharer/sharer.php')) {
      event.preventDefault();
      event.stopPropagation();
      const fallback = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(freshUrl('facebook'))}`;
      if (navigator.share) nativeShare('facebook', fallback);
      else window.location.href = fallback;
      return;
    }

    if (href.includes('api.whatsapp.com/send')) {
      event.preventDefault();
      event.stopPropagation();
      const title = pageTitle();
      const url = freshUrl('whatsapp');
      const fallback = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n\n${url}`)}`;
      openWhatsAppApp(fallback);
    }
  }, true);

  // The homepage philosophy is maintained as a separate layer so it can evolve
  // without duplicating or disturbing the eight-pillar model that follows it.
  const cleanPath = window.location.pathname.replace(/\/+$/, '');
  if (!cleanPath || /\/index\.html$/i.test(cleanPath)) {
    const script = document.createElement('script');
    script.src = 'assets/js/homepage-philosophy.js?v=20260907-philosophy1';
    script.defer = true;
    document.head.appendChild(script);
  }
})();
