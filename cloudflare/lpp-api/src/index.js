const ALLOWED_ORIGINS = new Set([
  'https://tamayuz10x.com',
  'https://www.tamayuz10x.com',
  'https://alaabmt.github.io'
]);

function cors(request) {
  const origin = request.headers.get('Origin') || '';
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://tamayuz10x.com';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(request, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(request) }
  });
}

function cleanCode(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

function randomString(length = 24) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => chars[b % chars.length]).join('');
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
}

async function readJson(request) {
  try { return await request.json(); } catch { return null; }
}

function participantUrl(request, code) {
  const base = 'https://tamayuz10x.com/tools/learning-preference-profile/';
  return `${base}?session=${encodeURIComponent(code)}`;
}

async function createSession(request, env) {
  const body = await readJson(request) || {};
  const name = String(body.name || '').trim().slice(0, 100) || null;
  const token = randomString(24);
  const tokenHash = await sha256(token);
  const id = crypto.randomUUID();

  let code;
  for (let i = 0; i < 8; i++) {
    code = randomCode();
    try {
      await env.DB.prepare(
        'INSERT INTO sessions (id, code, name, trainer_token_hash) VALUES (?, ?, ?, ?)'
      ).bind(id, code, name, tokenHash).run();
      return json(request, {
        ok: true,
        session: { id, code, name, participant_url: participantUrl(request, code) },
        trainer_token: token
      }, 201);
    } catch (e) {
      if (!String(e?.message || '').includes('UNIQUE')) throw e;
    }
  }
  return json(request, { ok: false, error: 'Could not allocate session code.' }, 500);
}

async function publicSession(request, env, code) {
  const row = await env.DB.prepare(
    'SELECT code, name, created_at, closed_at FROM sessions WHERE code = ?'
  ).bind(code).first();
  if (!row) return json(request, { ok: false, error: 'Session not found.' }, 404);
  return json(request, { ok: true, session: row });
}

async function verifyTrainer(request, env, code) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return null;
  const tokenHash = await sha256(token);
  return env.DB.prepare(
    'SELECT id, code, name, created_at, closed_at FROM sessions WHERE code = ? AND trainer_token_hash = ?'
  ).bind(code, tokenHash).first();
}

async function submitResponse(request, env, code) {
  const session = await env.DB.prepare(
    'SELECT id, closed_at FROM sessions WHERE code = ?'
  ).bind(code).first();
  if (!session) return json(request, { ok: false, error: 'Session not found.' }, 404);
  if (session.closed_at) return json(request, { ok: false, error: 'Session is closed.' }, 409);

  const body = await readJson(request);
  if (!body || typeof body.responses !== 'object' || typeof body.scores !== 'object') {
    return json(request, { ok: false, error: 'Invalid response payload.' }, 400);
  }

  const participantId = String(body.participant_id || '').trim().slice(0, 80) || crypto.randomUUID();
  const language = body.language === 'en' ? 'en' : 'ar';
  const startedAt = body.started_at || null;
  const completedAt = body.completed_at || null;
  const durationSeconds = Number.isFinite(Number(body.duration_seconds)) ? Math.max(0, Math.round(Number(body.duration_seconds))) : null;
  const id = crypto.randomUUID();
  const responsesJson = JSON.stringify(body.responses);
  const scoresJson = JSON.stringify(body.scores);
  const facetsJson = body.facets ? JSON.stringify(body.facets) : null;

  await env.DB.prepare(`
    INSERT INTO responses (id, session_id, participant_id, language, started_at, completed_at, duration_seconds, responses_json, scores_json, facets_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(session_id, participant_id) DO UPDATE SET
      language=excluded.language,
      started_at=excluded.started_at,
      completed_at=excluded.completed_at,
      duration_seconds=excluded.duration_seconds,
      responses_json=excluded.responses_json,
      scores_json=excluded.scores_json,
      facets_json=excluded.facets_json,
      updated_at=datetime('now')
  `).bind(
    id, session.id, participantId, language, startedAt, completedAt,
    durationSeconds, responsesJson, scoresJson, facetsJson
  ).run();

  return json(request, { ok: true, participant_id: participantId }, 201);
}

async function trainerDashboard(request, env, code) {
  const session = await verifyTrainer(request, env, code);
  if (!session) return json(request, { ok: false, error: 'Unauthorized.' }, 401);

  const rows = await env.DB.prepare(
    'SELECT scores_json, facets_json, language, duration_seconds, created_at FROM responses WHERE session_id = ? ORDER BY created_at ASC'
  ).bind(session.id).all();

  const items = rows.results || [];
  const sums = { A: 0, R: 0, T: 0, P: 0 };
  const distribution = { A: 0, R: 0, T: 0, P: 0, balanced: 0 };
  let durationTotal = 0;
  let durationCount = 0;

  for (const row of items) {
    let s = {};
    try { s = JSON.parse(row.scores_json || '{}'); } catch {}
    for (const k of ['A','R','T','P']) sums[k] += Number(s[k] || 0);
    const vals = ['A','R','T','P'].map(k => ({ k, v: Number(s[k] || 0) })).sort((a,b) => b.v-a.v);
    const spread = vals[0].v - vals[vals.length - 1].v;
    if (spread <= 10) distribution.balanced += 1;
    else distribution[vals[0].k] += 1;
    if (Number.isFinite(Number(row.duration_seconds))) {
      durationTotal += Number(row.duration_seconds);
      durationCount += 1;
    }
  }

  const n = items.length;
  const averages = {};
  for (const k of ['A','R','T','P']) averages[k] = n ? Math.round((sums[k] / n) * 10) / 10 : 0;

  return json(request, {
    ok: true,
    session,
    participant_count: n,
    averages,
    distribution,
    average_duration_seconds: durationCount ? Math.round(durationTotal / durationCount) : null
  });
}

export default {
  async fetch(request, env) {
    try {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(request) });
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, '') || '/';

      if (request.method === 'GET' && path === '/health') return json(request, { ok: true, service: 'lpp-api' });
      if (request.method === 'POST' && path === '/api/lpp/sessions') return createSession(request, env);

      let m = path.match(/^\/api\/lpp\/sessions\/([A-Z0-9]{4,8})$/i);
      if (m && request.method === 'GET') return publicSession(request, env, cleanCode(m[1]));

      m = path.match(/^\/api\/lpp\/sessions\/([A-Z0-9]{4,8})\/responses$/i);
      if (m && request.method === 'POST') return submitResponse(request, env, cleanCode(m[1]));

      m = path.match(/^\/api\/lpp\/sessions\/([A-Z0-9]{4,8})\/dashboard$/i);
      if (m && request.method === 'GET') return trainerDashboard(request, env, cleanCode(m[1]));

      return json(request, { ok: false, error: 'Not found.' }, 404);
    } catch (e) {
      return json(request, { ok: false, error: 'Server error.', detail: String(e?.message || e) }, 500);
    }
  }
};
