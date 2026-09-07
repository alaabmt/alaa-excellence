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

  async function nativeShare(platform, fallbackUrl) {
    if (!navigator.share || !isMobileLike()) {
      window.location.href = fallbackUrl;
      return;
    }

    const title = pageTitle();
    const url = pageUrl();
    const description = pageDescription();
    const text = description ? `${title}\n\n${description}` : title;

    try {
      await navigator.share({ title, text, url });
    } catch (error) {
      // If the user cancels the Android/iOS share sheet, do nothing.
      if (error && error.name === 'AbortError') return;
      // If native sharing is unavailable at runtime, fall back to the platform web composer.
      window.location.href = fallbackUrl;
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a.tenx-share-btn[href*="linkedin.com/sharing/share-offsite"]');
    if (!link) return;
    if (!isMobileLike() || !navigator.share) return;

    event.preventDefault();
    event.stopPropagation();
    nativeShare('linkedin', link.href);
  }, true);
})();
