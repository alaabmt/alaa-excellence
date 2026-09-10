function unauthorized() {
  return new Response('Unauthorized', { status: 401 });
}

function badRequest(message = 'Bad request') {
  return new Response(message, { status: 400 });
}

function safeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function getObjectKey(url) {
  const prefix = '/objects/';
  if (!url.pathname.startsWith(prefix)) return null;
  const key = decodeURIComponent(url.pathname.slice(prefix.length));
  if (!key || key.includes('..') || key.startsWith('/') || key.length > 600) return null;
  return key;
}

function authenticated(request, env) {
  const supplied = request.headers.get('x-tamayuz-internal-key') || '';
  return safeEqual(supplied, env.REPORTS_INTERNAL_KEY || '');
}

export default {
  async fetch(request, env) {
    if (!authenticated(request, env)) return unauthorized();

    const url = new URL(request.url);
    const key = getObjectKey(url);
    if (!key) return badRequest('Invalid object key');

    if (request.method === 'PUT') {
      const contentType = request.headers.get('content-type') || 'application/pdf';
      if (contentType !== 'application/pdf') return badRequest('Only PDF reports are accepted');

      const contentLength = Number(request.headers.get('content-length') || 0);
      if (contentLength && contentLength > 15 * 1024 * 1024) return new Response('File too large', { status: 413 });

      const object = await env.REPORTS_BUCKET.put(key, request.body, {
        httpMetadata: { contentType: 'application/pdf' }
      });

      return Response.json({
        key,
        etag: object.httpEtag,
        size: object.size,
        uploaded: object.uploaded?.toISOString?.() || null
      }, { status: 201 });
    }

    if (request.method === 'GET') {
      const object = await env.REPORTS_BUCKET.get(key);
      if (!object) return new Response('Not found', { status: 404 });

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('content-type', 'application/pdf');
      headers.set('cache-control', 'private, no-store');
      headers.set('content-disposition', `inline; filename="${key.split('/').pop() || 'report.pdf'}"`);
      if (object.httpEtag) headers.set('etag', object.httpEtag);
      return new Response(object.body, { headers });
    }

    if (request.method === 'DELETE') {
      await env.REPORTS_BUCKET.delete(key);
      return new Response(null, { status: 204 });
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: { allow: 'GET, PUT, DELETE' }
    });
  }
};
