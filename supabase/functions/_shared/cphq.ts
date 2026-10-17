// Keep answer-bearing operations in the database. Never log tokens or questions.
export function createHandler(mode, env = (key) => Deno.env.get(key), request = fetch) {
  return async function handler(req) {
    const origin = req.headers.get('origin');
    const allowed = new Set(['https://tamayuz10x.com', 'https://www.tamayuz10x.com',
      ...(env('CPHQ_ALLOWED_ORIGINS') || '').split(',').map(s => s.trim()).filter(Boolean)]);
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store',
      'Vary': 'Origin', 'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info' };
    if (origin && allowed.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
    const reply = (value, status = 200) => new Response(JSON.stringify(value), { status, headers });
    if (origin && !allowed.has(origin)) return reply({ error: 'origin_not_allowed' }, 403);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (req.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405);
    try {
      const raw = await req.text();
      if (raw.length > 4096) return reply({ error: 'request_too_large' }, 413);
      let data;
      try { data = JSON.parse(raw); } catch { return reply({ error: 'invalid_json' }, 400); }
      if (!data || typeof data !== 'object' || Array.isArray(data)) return reply({ error: 'invalid_json' }, 400);
      if (!['next', 'submit', 'status'].includes(data.action)) return reply({ error: 'invalid_action' }, 400);
      if (data.action === 'next' && (!Number.isInteger(data.domain) || data.domain < 1 || data.domain > 7))
        return reply({ error: 'invalid_domain' }, 400);
      if (data.action === 'submit' && (!Number.isSafeInteger(data.question_id) || data.question_id < 1 ||
        !Number.isInteger(data.selected_index) || data.selected_index < 0 || data.selected_index > 3))
        return reply({ error: 'invalid_submission' }, 400);
      const url = env('SUPABASE_URL');
      const key = env(mode === 'guest' ? 'SUPABASE_SERVICE_ROLE_KEY' : 'SUPABASE_ANON_KEY');
      if (!url || !key) return reply({ error: 'server_not_configured' }, 503);
      let authorization = `Bearer ${key}`;
      const args = {};
      if (mode === 'guest') {
        if (typeof data.guest_token !== 'string' || !/^[0-9a-f]{64}$/.test(data.guest_token))
          return reply({ error: 'invalid_guest_token' }, 400);
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.guest_token));
        args.p_digest = Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
      } else {
        authorization = req.headers.get('authorization') || '';
        if (!/^Bearer \S+$/.test(authorization)) return reply({ error: 'login_required' }, 401);
        const userResponse = await request(`${url}/auth/v1/user`, {
          headers: { apikey: key, Authorization: authorization }, signal: AbortSignal.timeout(10000) });
        if (!userResponse.ok) return reply({ error: 'invalid_session' }, 401);
        const user = await userResponse.json();
        if (!user.id || user.is_anonymous) return reply({ error: 'login_required' }, 401);
      }
      if (data.action === 'next') args.p_domain = data.domain;
      if (data.action === 'submit') {
        args.p_question_id = data.question_id;
        args.p_selected_index = data.selected_index;
      }
      const rpc = mode === 'guest' ? `cphq_guest_${data.action}` :
        ({ next: 'cphq_next_registered', submit: 'cphq_submit_registered', status: 'cphq_status_registered' })[data.action];
      const result = await request(`${url}/rest/v1/rpc/${rpc}`, { method: 'POST',
        headers: { apikey: key, Authorization: authorization, 'Content-Type': 'application/json' },
        body: JSON.stringify(args), signal: AbortSignal.timeout(15000) });
      if (!result.ok) return reply({ error: 'request_failed' }, 503);
      const value = await result.json();
      const code = value?.error;
      return reply(value, !code ? 200 : code === 'daily_limit' ? 429 : code === 'login_required' ? 401 :
        ['already_answered', 'question_not_delivered', 'question_unavailable'].includes(code) ? 409 : 200);
    } catch {
      return reply({ error: 'temporarily_unavailable' }, 503);
    }
  };
}
