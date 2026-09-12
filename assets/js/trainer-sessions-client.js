import { currentSession } from '/assets/js/assessment-auth-client.js';

const cfg = window.TAMAYUZ_AUTH_CONFIG || {};

async function request(method='GET', params='', body=null) {
  const endpoint = cfg.trainerSessionsEndpoint;
  if (!endpoint) throw new Error('TRAINER_SESSIONS_NOT_CONFIGURED');
  const { session } = await currentSession();
  if (!session?.access_token) throw new Error('TRAINER_SESSIONS_UNAUTHORIZED');
  const response = await fetch(`${endpoint}${params}`, {
    method,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: body == null ? undefined : JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error || 'TRAINER_SESSIONS_REQUEST_FAILED');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function registerTrainerSession({ sessionCode, sessionName='', joinUrl='', trainerToken }) {
  return request('POST', '', {
    session_code: sessionCode,
    session_name: sessionName,
    join_url: joinUrl,
    trainer_token: trainerToken
  });
}

export async function listTrainerSessions({ includeSummary=true } = {}) {
  return request('GET', includeSummary ? '?include_summary=1' : '');
}

export async function getTrainerDashboard(sessionCode) {
  const code = String(sessionCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  return request('GET', `?code=${encodeURIComponent(code)}&dashboard=1`);
}

export async function setTrainerSessionStatus(sessionCode, status) {
  return request('PATCH', '', { session_code: sessionCode, status });
}
