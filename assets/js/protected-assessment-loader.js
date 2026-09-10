import { currentSession } from './assessment-auth-client.js';

function message(lang, key) {
  const ar = {
    loading: 'جارٍ فتح التقييم الآمن…',
    failed: 'تعذر فتح التقييم الآن. حاول مرة أخرى.'
  };
  const en = {
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

function assessmentKey(asset) {
  return asset === 'lpp' ? 'learning-preference-profile' : 'work-approach-assessment';
}

async function ensureAttempt(client, asset) {
  const key = assessmentKey(asset);
  const storageKey = `tamayuz10x-attempt:${key}`;
  const existing = sessionStorage.getItem(storageKey);
  if (existing) return existing;
  const { data, error } = await client.functions.invoke('assessment-attempts', {
    body: { assessment_key: key }
  });
  if (error || !data?.attempt?.id) throw error || new Error('ATTEMPT_CREATE_FAILED');
  sessionStorage.setItem(storageKey, data.attempt.id);
  return data.attempt.id;
}

export async function loadProtectedAssessment(asset, options = {}) {
  const cfg = window.TAMAYUZ_AUTH_CONFIG || {};
  const lang = options.lang || (document.documentElement.lang === 'ar' ? 'ar' : 'en');
  try {
    renderStatus(message(lang, 'loading'), lang);
    const { client, session } = await currentSession();
    if (!session) {
      const next = encodeURIComponent(location.pathname + location.search + location.hash);
      location.replace(`${cfg.loginPath || '/account/login.html'}?lang=${lang}&next=${next}`);
      return;
    }

    if (options.requireWorkConsent && sessionStorage.getItem('tamayuz10x-work-consent') !== 'accepted') {
      location.replace(lang === 'ar' ? '/tools/work-approach-assessment/consent-ar.html' : '/tools/work-approach-assessment/consent-en.html');
      return;
    }

    await ensureAttempt(client, asset);
    const { data: html, error } = await client.functions.invoke('assessment-content', {
      body: { asset },
      responseType: 'text'
    });
    if (error || typeof html !== 'string') throw error || new Error('CONTENT_UNAVAILABLE');
    document.open();
    document.write(html);
    document.close();
  } catch (error) {
    console.error('Protected assessment loader failed:', error);
    renderStatus(message(lang, 'failed'), lang);
  }
}
