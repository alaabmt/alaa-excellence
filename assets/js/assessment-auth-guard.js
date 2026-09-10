import { authConfigured, currentSession } from './assessment-auth-client.js';

const cfg = window.TAMAYUZ_AUTH_CONFIG || {};
const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';

function failClosed(message) {
  document.documentElement.classList.remove('auth-pending');
  document.body.innerHTML = `
    <main style="max-width:760px;margin:10vh auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.7">
      <h1>${lang === 'ar' ? 'الوصول إلى التقييم غير متاح مؤقتًا' : 'Assessment access is temporarily unavailable'}</h1>
      <p>${message}</p>
      <p><a href="/personality.html">${lang === 'ar' ? 'العودة إلى مختبر اكتشاف الذات' : 'Return to the Self-Discovery Lab'}</a></p>
    </main>`;
}

(async () => {
  try {
    if (!authConfigured()) {
      failClosed(lang === 'ar'
        ? 'لم يكتمل ربط نظام تسجيل الدخول بعد. لن يتم فتح التقييم قبل تفعيل المصادقة الآمنة.'
        : 'Secure sign-in has not been connected yet. The assessment will remain closed until authentication is activated.');
      return;
    }

    const { session } = await currentSession();
    if (!session) {
      const next = encodeURIComponent(location.pathname + location.search + location.hash);
      location.replace(`${cfg.loginPath || '/account/login.html'}?next=${next}&lang=${lang}`);
      return;
    }

    document.documentElement.classList.remove('auth-pending');
    window.dispatchEvent(new CustomEvent('tamayuz:authenticated', { detail: { user: session.user } }));
  } catch (error) {
    console.error('Assessment auth guard failed:', error);
    failClosed(lang === 'ar'
      ? 'تعذر التحقق من تسجيل الدخول. أعد المحاولة لاحقًا.'
      : 'We could not verify your sign-in. Please try again later.');
  }
})();
