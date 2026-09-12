const PREFIX = '/__preview-10x-auth-7c4e2d91';
const SOURCE = 'https://raw.githubusercontent.com/alaabmt/alaa-excellence/c88b9acc1fee0a408402c98702bacf6f05efc8da';
const CONTENT_ENDPOINT = 'https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/assessment-content';

function noStore(headers = {}) {
  const h = new Headers(headers);
  h.set('cache-control', 'private, no-store, max-age=0');
  h.set('pragma', 'no-cache');
  h.set('x-robots-tag', 'noindex, nofollow, noarchive');
  h.set('x-frame-options', 'DENY');
  h.set('referrer-policy', 'no-referrer');
  h.set('x-content-type-options', 'nosniff');
  return h;
}

function cookieValue(req, name) {
  const raw = req.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return '';
}

async function tokenFor(secret) {
  const bytes = new TextEncoder().encode(`tamayuz10x-preview:${secret}`);
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('');
}

function same(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function loginPage(next = `${PREFIX}/account/register.html?lang=ar`) {
  const safeNext = next.startsWith(PREFIX) ? next : `${PREFIX}/account/register.html?lang=ar`;
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>معاينة آمنة | التميّز 10X</title><style>body{margin:0;background:#f5f7fa;font-family:system-ui,-apple-system,sans-serif;color:#0b2545}.wrap{width:min(520px,calc(100% - 32px));margin:10vh auto}.card{background:#fff;border:1px solid #dfe6ee;border-radius:20px;padding:28px}label{display:block;font-weight:700;margin:16px 0 7px}input,button{width:100%;box-sizing:border-box;padding:13px;border-radius:11px;font:inherit}input{border:1px solid #cfd9e4}button{border:0;background:#0b2545;color:#fff;font-weight:800;margin-top:16px}.muted{color:#64748b;line-height:1.8}</style></head><body><main class="wrap"><section class="card"><h1>المعاينة الآمنة</h1><p class="muted">هذه نسخة مؤقتة وغير مفهرسة لاختبار التسجيل والتقييم قبل النشر العام.</p><form method="post" action="${PREFIX}/_login"><input type="hidden" name="next" value="${safeNext.replace(/"/g, '&quot;')}"><label for="password">كلمة مرور المعاينة</label><input id="password" name="password" type="password" autocomplete="current-password" required><button type="submit">دخول المعاينة</button></form></section></main></body></html>`;
}

function contentType(path) {
  if (path.endsWith('.html') || path.endsWith('/')) return 'text/html; charset=utf-8';
  if (path.endsWith('.js') || path.endsWith('.mjs')) return 'application/javascript; charset=utf-8';
  if (path.endsWith('.css')) return 'text/css; charset=utf-8';
  if (path.endsWith('.json')) return 'application/json; charset=utf-8';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.ico')) return 'image/x-icon';
  return 'application/octet-stream';
}

function allowedPath(path) {
  const clean = path.replace(/^\/+/, '');
  if (!clean || clean.includes('..') || clean.includes('\\')) return false;
  return clean === 'index.html' || clean === 'personality.html' || clean.startsWith('en/') || clean.startsWith('account/') || clean.startsWith('assets/') || clean.startsWith('tools/');
}

function rewriteText(text, path) {
  let out = text;
  if (path.endsWith('assets/js/auth-config.js')) {
    out = out
      .replace("protectedContentEndpoint: 'https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/assessment-content'", `protectedContentEndpoint: '${PREFIX}/_api/assessment-content'`)
      .replace("loginPath: '/account/login.html'", `loginPath: '${PREFIX}/account/login.html'`)
      .replace("registerPath: '/account/register.html'", `registerPath: '${PREFIX}/account/register.html'`)
      .replace("accountPath: '/account/'", `accountPath: '${PREFIX}/account/'`)
      .replace("'/tools/learning-preference-profile/'", `'${PREFIX}/tools/learning-preference-profile/'`)
      .replace("'/tools/work-approach-assessment/'", `'${PREFIX}/tools/work-approach-assessment/'`);
  }
  if (path.endsWith('assets/js/assessment-auth-client.js')) {
    out = out.replace("const fallback = '/personality.html';", `const fallback = '${PREFIX}/personality.html';`);
  }
  if (path.endsWith('.html') || path.endsWith('.js') || path.endsWith('.mjs')) {
    out = out
      .replaceAll('${location.origin}/account/', `\${location.origin}${PREFIX}/account/`)
      .replace(/(["'])\/(account|assets|tools|en)\//g, `$1${PREFIX}/$2/`)
      .replace(/(["'])\/personality\.html/g, `$1${PREFIX}/personality.html`)
      .replace(/(["'])\/index\.html/g, `$1${PREFIX}/index.html`)
      .replace(/href=(['"])\/(?:\1)/g, `href=$1${PREFIX}/$1`);
  }
  return out;
}

async function proxyProtectedContent(req, url) {
  const upstream = new URL(CONTENT_ENDPOINT);
  upstream.search = url.search;
  const headers = new Headers();
  const auth = req.headers.get('authorization');
  if (auth) headers.set('authorization', auth);
  headers.set('origin', 'https://tamayuz10x.com');
  const r = await fetch(upstream.toString(), { method: 'GET', headers });
  const h = noStore(r.headers);
  if (!r.ok) return new Response(await r.text(), { status: r.status, headers: h });
  const text = rewriteText(await r.text(), 'protected-assessment.html');
  h.set('content-type', 'text/html; charset=utf-8');
  return new Response(text, { status: 200, headers: h });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith(PREFIX)) return new Response('Not found', { status: 404, headers: noStore() });
    if (!env.PREVIEW_PASSWORD) return new Response('Preview is not configured', { status: 503, headers: noStore() });

    const expected = await tokenFor(env.PREVIEW_PASSWORD);
    const authed = same(cookieValue(req, 'tamayuz_preview'), expected);

    if (url.pathname === `${PREFIX}/_login` && req.method === 'GET') {
      return new Response(loginPage(url.searchParams.get('next') || undefined), { status: 200, headers: noStore({ 'content-type': 'text/html; charset=utf-8' }) });
    }

    if (url.pathname === `${PREFIX}/_login` && req.method === 'POST') {
      const form = await req.formData();
      const password = String(form.get('password') || '');
      const next = String(form.get('next') || `${PREFIX}/account/register.html?lang=ar`);
      if (!same(await tokenFor(password), expected)) {
        return new Response(loginPage(next).replace('</form>', '<p style="color:#9b2c2c">كلمة المرور غير صحيحة.</p></form>'), { status: 401, headers: noStore({ 'content-type': 'text/html; charset=utf-8' }) });
      }
      const h = noStore({ location: next.startsWith(PREFIX) ? next : `${PREFIX}/account/register.html?lang=ar` });
      h.append('set-cookie', `tamayuz_preview=${expected}; Path=${PREFIX}; HttpOnly; Secure; SameSite=Strict; Max-Age=14400`);
      return new Response(null, { status: 303, headers: h });
    }

    if (!authed) {
      const next = encodeURIComponent(url.pathname + url.search);
      return new Response(null, { status: 302, headers: noStore({ location: `${PREFIX}/_login?next=${next}` }) });
    }

    if (url.pathname === `${PREFIX}/_logout`) {
      const h = noStore({ location: `${PREFIX}/_login` });
      h.append('set-cookie', `tamayuz_preview=; Path=${PREFIX}; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
      return new Response(null, { status: 303, headers: h });
    }

    if (url.pathname === `${PREFIX}/_api/assessment-content`) return proxyProtectedContent(req, url);

    let path = url.pathname.slice(PREFIX.length).replace(/^\/+/, '');
    if (!path) return new Response(null, { status: 302, headers: noStore({ location: `${PREFIX}/account/register.html?lang=ar` }) });
    if (path.endsWith('/')) path += 'index.html';
    if (!allowedPath(path)) return new Response('Not found', { status: 404, headers: noStore() });

    const upstream = await fetch(`${SOURCE}/${path}`, { headers: { 'user-agent': 'Tamayuz10X-Secure-Preview/1.0' } });
    if (!upstream.ok) return new Response('Not found', { status: 404, headers: noStore() });

    const type = contentType(path);
    const h = noStore({ 'content-type': type });
    if (type.startsWith('text/') || type.includes('javascript') || type.includes('json')) {
      const body = rewriteText(await upstream.text(), path);
      return new Response(body, { status: 200, headers: h });
    }
    return new Response(upstream.body, { status: 200, headers: h });
  }
};
