(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const explicit = params.get('lang');
  const preferred = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  const browserLang = /^ar(?:-|$)/i.test(preferred) ? 'ar' : 'en';
  const lang = explicit === 'ar' || explicit === 'en' ? explicit : browserLang;

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  if (location.pathname.includes('/tools/learning-preference-profile/')) {
    const key = 'tamayuz10x-lpp-v1';
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      saved.lang = lang;
      localStorage.setItem(key, JSON.stringify(saved));
    } catch (_) {
      localStorage.setItem(key, JSON.stringify({lang}));
    }
  }

  window.T10X_DEFAULT_LANG = lang;
})();