(() => {
  if (window.__tenxMobileSocialShareLoaded) return;
  window.__tenxMobileSocialShareLoaded = true;

  const isMobileLike = () => {
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    return coarse || narrow || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent || '');
  };

  const pageUrl = () => document.querySelector('link[rel="canonical"]')?.href || window.location.href.split('#')[0];
  const pageTitle = () => document.querySelector('meta[property="og:title"]')?.content || document.querySelector('h1')?.textContent?.trim() || document.title;
  const pageDescription = () => document.querySelector('meta[property="og:description"]')?.content || document.querySelector('meta[name="description"]')?.content || '';

  const sharePayload = () => {
    const title = pageTitle();
    const url = pageUrl();
    const description = pageDescription();
    const text = description ? `${title}\n\n${description}` : title;
    return { title, text, url };
  };

  async function nativeShare(fallbackUrl) {
    if (!navigator.share || !isMobileLike()) {
      window.location.href = fallbackUrl;
      return;
    }
    try {
      await navigator.share(sharePayload());
    } catch (error) {
      if (error && error.name === 'AbortError') return;
      window.location.href = fallbackUrl;
    }
  }

  function openWhatsAppApp(fallbackUrl) {
    const { title, url } = sharePayload();
    const message = encodeURIComponent(`${title}\n${url}`);
    const appUrl = `whatsapp://send?text=${message}`;
    let hidden = false;
    const onVisibility = () => {
      if (document.hidden) hidden = true;
    };
    document.addEventListener('visibilitychange', onVisibility, { once: true });
    window.location.href = appUrl;
    window.setTimeout(() => {
      if (!hidden && document.visibilityState === 'visible') window.location.href = fallbackUrl;
    }, 1400);
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a.tenx-share-btn');
    if (!link || !isMobileLike()) return;
    const href = link.href || '';

    if (href.includes('linkedin.com/sharing/share-offsite') || href.includes('facebook.com/sharer/sharer.php')) {
      if (!navigator.share) return;
      event.preventDefault();
      event.stopPropagation();
      nativeShare(href);
      return;
    }

    if (href.includes('api.whatsapp.com/send')) {
      event.preventDefault();
      event.stopPropagation();
      openWhatsAppApp(href);
    }
  }, true);
})();
