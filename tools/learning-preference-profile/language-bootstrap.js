(() => {
  'use strict';
  const STORAGE = 'tamayuz10x-lpp-v1';
  const params = new URLSearchParams(location.search);
  const explicit = params.get('lang');
  const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  const resolved = explicit === 'ar' || explicit === 'en' ? explicit : (/^ar\b/i.test(browserLang) ? 'ar' : 'en');

  document.documentElement.lang = resolved;
  document.documentElement.dir = resolved === 'ar' ? 'rtl' : 'ltr';
  window.TAMAYUZ_ASSESSMENT_LANG = resolved;

  try {
    const current = JSON.parse(localStorage.getItem(STORAGE) || '{}');
    current.lang = resolved;
    localStorage.setItem(STORAGE, JSON.stringify(current));
  } catch (e) {
    localStorage.setItem(STORAGE, JSON.stringify({lang: resolved}));
  }
})();