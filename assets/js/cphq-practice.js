import { createAuthClient } from '/assets/js/assessment-auth-client.js';

const $ = id => document.getElementById(id);
const mode = $('main').dataset.practice;
const endpoint = 'https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/' + (mode === 'guest' ? 'cphq-guest' : 'cphq-practice');
const messages = {
  daily_limit: 'Your daily allowance is complete. Return after 00:00 UTC (04:00 UAE).',
  domain_completed_today: 'No more new questions in this domain today. Choose another domain.',
  question_not_delivered: 'This question is no longer active. Get a question to continue.',
  already_answered: 'This question was already answered. Get the next question to continue.',
  question_unavailable: 'This question is temporarily unavailable. Please try again later.',
  login_required: 'Please sign in to continue.', invalid_session: 'Your session has expired. Please sign in again.',
  temporarily_unavailable: 'Practice is temporarily unavailable. Please try again.',
  request_failed: 'Practice is temporarily unavailable. Please try again.',
  origin_not_allowed: 'This preview address is not enabled for practice.',
  storage_unavailable: 'Guest practice needs browser storage to keep your allowance. Enable storage or sign in.',
};
let client, session, guestToken, current = null, busy = false, version = 0;
const node = (tag, text, cls) => {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (cls) el.className = cls;
  return el;
};
const say = text => { $('status').textContent = text; };
function controls() {
  $('next').disabled = busy || !!current;
  $('domain').disabled = busy || !!current;
  $('next').textContent = current ? 'Submit this question to continue' : 'Get question';
}
function reset() {
  version++;
  current = null;
  busy = false;
  $('question').replaceChildren();
  $('feedback').replaceChildren();
  $('progress').textContent = '';
  controls();
}
function problem(error) { say(messages[error.message] || 'Could not connect. Check your connection and try again.'); }
async function call(body) {
  const headers = { 'Content-Type': 'application/json' };
  if (mode === 'guest') body = { ...body, guest_token: guestToken };
  else {
    const result = await client.auth.getSession();
    if (result.error || !result.data.session) throw new Error('login_required');
    headers.Authorization = 'Bearer ' + result.data.session.access_token;
  }
  const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
  const value = await response.json();
  if (value.error || !response.ok) throw new Error(value.error || 'request_failed');
  return value;
}
function allowance(value) {
  const limit = mode === 'guest' ? 5 : 20;
  $('progress').textContent = `${value.remaining} of ${limit} new questions remaining today. Resets at 00:00 UTC.`;
}
async function loadStatus() {
  const epoch = version;
  const status = await call({ action: 'status' });
  if (epoch !== version) return;
  allowance(status);
  for (const d of status.domains || []) {
    const option = $('domain').querySelector(`option[value="${d.domain}"]`);
    if (option) {
      const label = option.dataset.label || option.textContent;
      option.dataset.label = label;
      option.textContent = `${label} (${d.available} new)`;
    }
  }
  if (status.delivered > status.answered) await next();
  else if (!status.remaining) say(messages.daily_limit);
  else if (status.domains.every(d => !d.available)) say('You have completed the available collection today. Return tomorrow for more practice.');
}
async function next() {
  if (busy || current) return;
  busy = true; controls();
  const epoch = version;
  say('Loading your question…');
  $('question').replaceChildren(); $('feedback').replaceChildren();
  try {
    const q = await call({ action: 'next', domain: Number($('domain').value) });
    if (epoch !== version) return;
    current = q;
    $('domain').value = String(q.domain);
    allowance(q);
    say('Choose the best answer. Explanations will appear after submission.');
    $('question').append(node('p', q.task, 'muted'));
    const form = node('form'), fieldset = node('fieldset');
    fieldset.append(node('legend', q.question));
    q.options.forEach((text, i) => {
      const label = node('label', undefined, 'choice'), input = node('input');
      input.type = 'radio'; input.name = 'answer'; input.value = String(i); input.required = true;
      label.append(input, node('span', `${String.fromCharCode(65 + i)}. ${text}`));
      fieldset.append(label);
    });
    const submit = node('button', 'Submit answer'); submit.type = 'submit';
    form.append(fieldset, submit);
    form.onsubmit = async event => {
      event.preventDefault();
      if (busy || !current) return;
      const selected = form.querySelector('input:checked');
      if (!selected) return;
      busy = true; submit.disabled = true; fieldset.disabled = true; controls();
      say('Checking your answer…');
      try {
        const answer = await call({ action: 'submit', question_id: q.id, selected_index: Number(selected.value) });
        if (epoch !== version) return;
        $('feedback').replaceChildren(node('h2', answer.is_correct ? 'Correct' : 'Review the correct answer'));
        $('feedback').append(node('p', `Correct answer: ${String.fromCharCode(65 + answer.correct_index)}. ${q.options[answer.correct_index]}`));
        answer.rationales.forEach((text, i) => {
          const block = node('div', undefined, 'explain' + (i === answer.correct_index ? ' correct' : ''));
          block.append(node('strong', `${String.fromCharCode(65 + i)}. ${q.options[i]}`), node('p', text));
          $('feedback').append(block);
        });
        $('feedback').append(node('h3', 'Key learning'), node('p', answer.lesson));
        const continueButton = node('button', 'Next question', 'continue-button');
        continueButton.type = 'button';
        continueButton.disabled = !answer.remaining;
        continueButton.onclick = () => { $('feedback').replaceChildren(); void next(); };
        $('feedback').append(continueButton);
        current = null; allowance(answer);
        say(answer.remaining ? 'Answer saved. Review the explanations, then choose your next question.' : messages.daily_limit);
        $('feedback').focus();
      } catch (error) {
        if (epoch !== version) return;
        problem(error);
        if (['question_not_delivered', 'already_answered'].includes(error.message)) current = null;
        else { submit.disabled = false; fieldset.disabled = false; }
      } finally { if (epoch === version) { busy = false; controls(); } }
    };
    $('question').append(form);
  } catch (error) { if (epoch === version) problem(error); }
  finally { if (epoch === version) { busy = false; controls(); } }
}
$('next').onclick = next;
async function showSession(nextSession) {
  const changed = session?.user.id !== nextSession?.user.id;
  session = nextSession;
  if (changed || !session) reset();
  const signedIn = !!session && !session.user.is_anonymous;
  $('learning').hidden = !signedIn;
  $('auth-links').hidden = signedIn;
  $('signout').hidden = !signedIn;
  $('auth-status').textContent = signedIn ? `Signed in as ${session.user.email || 'learner'}.` : 'Sign in with your existing account or create a free account.';
  if (signedIn && changed) { try { await loadStatus(); } catch (error) { problem(error); } }
}
try {
  if (mode === 'guest') {
    try {
      guestToken = localStorage.getItem('cphq-guest-token-v2');
      if (!guestToken || !/^[0-9a-f]{64}$/.test(guestToken)) {
        guestToken = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem('cphq-guest-token-v2', guestToken);
      }
    } catch { throw new Error('storage_unavailable'); }
    await loadStatus();
  } else {
    client = await createAuthClient();
    client.auth.onAuthStateChange((_event, value) => { setTimeout(() => { void showSession(value); }, 0); });
    const result = await client.auth.getSession();
    if (result.error) throw result.error;
    await showSession(result.data.session);
    $('signout').onclick = async () => {
      $('signout').disabled = true;
      try {
        const { error } = await client.auth.signOut();
        if (error) throw error;
        await showSession(null);
      } catch { $('auth-status').textContent = 'Sign-out failed. Please try again.'; }
      finally { $('signout').disabled = false; }
    };
  }
} catch (error) {
  if (mode === 'registered') $('auth-status').textContent = 'Could not load your session. Reload the page or use the sign-in link.';
  else { problem(error); $('next').disabled = true; }
}
