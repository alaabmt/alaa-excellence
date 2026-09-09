(() => {
  'use strict';
  const preferred = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  const lang = /^ar(?:-|$)/i.test(preferred) ? 'ar' : 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Learning Preference Profile stores its interface language in the assessment state.
  // On a fresh page load, use the browser's preferred language as the default so the
  // assessment and consent screen always start in the same language.
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