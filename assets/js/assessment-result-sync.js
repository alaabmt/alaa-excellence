import { completeAssessmentAttempt } from './assessment-attempts-client.js';
import { createAssessmentReportPdf } from './assessment-report-pdf.js';
import { listAssessmentReports, uploadAssessmentReport } from './assessment-reports-client.js';

const synced = new Set();

function currentAttempt(assessmentKey) {
  const storageKey = `tamayuz10x-current-attempt:${assessmentKey}`;
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
    return value?.id ? { ...value, storageKey } : null;
  } catch (_) {
    return null;
  }
}

function markCompleted(attempt) {
  try {
    sessionStorage.setItem(attempt.storageKey, JSON.stringify({
      id: attempt.id,
      assessmentKey: attempt.assessmentKey,
      startedAt: attempt.startedAt,
      completed: true
    }));
  } catch (_) {}
}

function lppResult() {
  let state;
  try { state = JSON.parse(localStorage.getItem('tamayuz10x-lpp-v1') || 'null'); }
  catch (_) { return null; }
  if (!state?.completedAt || state?.screen !== 'results') return null;
  const D = window.LPP_DATA;
  if (!D?.items?.length) return null;

  const order = ['A','R','T','P'];
  const raw = { A:0, R:0, T:0, P:0 };
  D.items.forEach(item => {
    const value = Number(state.responses?.[item.item_id] ?? 0);
    if (Object.prototype.hasOwnProperty.call(raw, item.construct_code)) raw[item.construct_code] += value;
  });
  const percent = {};
  order.forEach(code => { percent[code] = Math.round((raw[code] / 64) * 100); });
  const sorted = order.map(code => ({ code, score: percent[code] })).sort((a,b) => b.score-a.score || order.indexOf(a.code)-order.indexOf(b.code));
  return {
    instrument: 'learning-preference-profile',
    version: D.version || null,
    language: state.lang || document.documentElement.lang || 'ar',
    completedAt: new Date(state.completedAt).toISOString(),
    scores: { raw, percent, ranked: sorted }
  };
}

function latestCompletedWorkState() {
  let latest = null;
  for (let i=0; i<localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('wpf_v17_')) continue;
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      if (!value?.completed || !value?.completedAt || !value?.scores) continue;
      const ts = Date.parse(value.completedAt) || 0;
      if (!latest || ts > latest.ts) latest = { key, value, ts };
    } catch (_) {}
  }
  return latest?.value || null;
}

function workResult() {
  const state = latestCompletedWorkState();
  if (!state) return null;
  return {
    instrument: 'work-approach-assessment',
    version: state.version || null,
    blueprintVersion: state.blueprintVersion || null,
    language: state.language || document.documentElement.lang || 'ar',
    completedAt: state.completedAt,
    profile: state.profile || null,
    scores: state.scores
  };
}

async function ensurePdfReport(attemptId, assessmentKey, result) {
  const existing = await listAssessmentReports().catch(() => ({ reports: [] }));
  if ((existing?.reports || []).some(r => r.attempt_id === attemptId && r.status === 'ready')) return;
  const pdf = await createAssessmentReportPdf(assessmentKey, result);
  const suffix = result?.language === 'en' ? 'en' : 'ar';
  await uploadAssessmentReport(attemptId, pdf, `${assessmentKey}-${suffix}.pdf`);
}

async function sync(assessmentKey, result) {
  if (!result) return;
  const attempt = currentAttempt(assessmentKey);
  if (!attempt || attempt.completed || synced.has(attempt.id)) return;
  synced.add(attempt.id);
  try {
    await completeAssessmentAttempt(attempt.id, result);
    await ensurePdfReport(attempt.id, assessmentKey, result);
    markCompleted(attempt);
    window.dispatchEvent(new CustomEvent('tamayuz:assessment-result-saved', { detail: { assessmentKey, attemptId: attempt.id } }));
  } catch (error) {
    synced.delete(attempt.id);
    console.error('Assessment result/report sync failed:', error);
  }
}

function tick() {
  sync('learning-preference-profile', lppResult());
  sync('work-approach-assessment', workResult());
}

setInterval(tick, 1500);
window.addEventListener('storage', tick);
window.addEventListener('load', tick);
setTimeout(tick, 250);
