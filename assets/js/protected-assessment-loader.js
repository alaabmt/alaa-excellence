import { currentSession } from './assessment-auth-client.js';

function message(lang, key) {
  const ar = {
    login: 'يجب تسجيل الدخول قبل فتح التقييم.',
    consent: 'يجب الموافقة على معلومات المشاركة قبل بدء التقييم.',
    loading: 'جارٍ فتح التقييم الآمن…',
    failed: 'تعذر فتح التقييم الآن. حاول مرة أخرى.'
  };
  const en = {
    login: 'You must sign in before opening the assessment.',
    consent: 'Please accept the participation information before starting the assessment.',
    loading: 'Opening the secure assessment…',
    failed: 'The assessment could not be opened. Please try again.'
  };
  return (lang === 'ar' ? ar : en)[key];
}

function renderStatus(text, lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.innerHTML = `<main style="max-width:720px;margin:10vh auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.8;text-align:${lang === 'ar' ? 'right' : 'left'}"><p>${text}</p></main>`;
}

export async function loadProtectedAssessment(asset, options = {}) {
  const cfg = window.TAMAYUZ_AUTH_CONFIG || {};
  const lang = options.lang || (document.documentElement.lang === 'ar' ? 'ar' : 'en');
  try {
    renderStatus(message(lang, 'loading'), lang);
    const { session } = await currentSession();
    if (!session) {
      const next = encodeURIComponent(location.pathname + location.search + location.hash);
      location.replace(`${cfg.loginPath || '/account/login.html'}?lang=${lang}&next=${next}`);
      return;
    }

    if (options.requireWorkConsent && sessionStorage.getItem('tamayuz10x-work-consent') !== 'accepted') {
      location.replace(lang === 'ar' ? '/tools/work-approach-assessment/consent-ar.html' : '/tools/work-approach-assessment/consent-en.html');
      return;
    }

    if (!cfg.protectedContentEndpoint) throw new Error('CONTENT_ENDPOINT_NOT_CONFIGURED');
    const url = new URL(cfg.protectedContentEndpoint);
    url.searchParams.set('asset', asset);
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    if (response.status === 401) {
      const next = encodeURIComponent(location.pathname + location.search + location.hash);
      location.replace(`${cfg.loginPath || '/account/login.html'}?lang=${lang}&next=${next}`);
      return;
    }
    if (!response.ok) throw new Error(`CONTENT_${response.status}`);
    const html = await response.text();
    document.open();
    document.write(html);
    document.close();
  } catch (error) {
    console.error('Protected assessment loader failed:', error);
    renderStatus(message(lang, 'failed'), lang);
  }
}
