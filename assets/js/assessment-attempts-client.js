import { createAuthClient } from './assessment-auth-client.js';

const endpoint = 'https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/assessment-attempts';

async function authHeaders(client) {
  const { data, error } = await client.auth.getSession();
  if (error || !data.session?.access_token) throw new Error('AUTH_REQUIRED');
  return {
    'content-type': 'application/json',
    'authorization': `Bearer ${data.session.access_token}`
  };
}

export async function startAssessmentAttempt(assessmentKey) {
  const client = await createAuthClient();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: await authHeaders(client),
    body: JSON.stringify({ assessment_key: assessmentKey })
  });
  if (!response.ok) throw new Error(`ATTEMPT_START_FAILED_${response.status}`);
  return response.json();
}

export async function completeAssessmentAttempt(id, resultJson) {
  const client = await createAuthClient();
  const response = await fetch(endpoint, {
    method: 'PATCH',
    headers: await authHeaders(client),
    body: JSON.stringify({ id, status: 'completed', result_json: resultJson })
  });
  if (!response.ok) throw new Error(`ATTEMPT_COMPLETE_FAILED_${response.status}`);
  return response.json();
}

export async function listAssessmentAttempts(assessmentKey = '') {
  const client = await createAuthClient();
  const qs = assessmentKey ? `?assessment_key=${encodeURIComponent(assessmentKey)}` : '';
  const response = await fetch(endpoint + qs, { headers: await authHeaders(client) });
  if (!response.ok) throw new Error(`ATTEMPT_LIST_FAILED_${response.status}`);
  return response.json();
}
