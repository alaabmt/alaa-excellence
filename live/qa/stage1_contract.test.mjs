// Offline Tamayuz Live stage-1 contract checks. No API calls, production data or credentials.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const html = readFileSync(resolve(root, 'live/index.html'), 'utf8');
const edge = readFileSync(resolve(root, 'live/stage1/tamayuz-live.edge.ts'), 'utf8');
const sql = readFileSync(resolve(root, 'live/stage1/202611140001_live_qna_timer.sql'), 'utf8');
test('frontend script parses', () => {
  const scripts = [html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'))];
  assert.ok(scripts.length > 0);
  for (const script of scripts) new vm.Script(script);
});
test('ranking and image click are wired across editor, audience and Edge', () => {
  for (const kind of ['ranking', 'image_click']) {
    assert.ok(html.includes('value="' + kind + '"'), kind + ' missing editor');
    assert.ok(html.includes('q.kind==="' + kind + '"'), kind + ' missing audience');
    assert.ok(edge.includes('q.kind==="' + kind + '"'), kind + ' missing server validation');
    assert.ok(sql.includes("'" + kind + "'"), kind + ' missing migration constraint');
  }
});
test('Q&A requires participant authorization and presenter moderation', () => {
  for (const action of ['qna_list', 'qna_submit', 'qna_upvote', 'qna_moderate', 'qna_toggle', 'qna_presenter_list'])
    assert.ok(edge.includes('"' + action + '"'), action + ' missing');
  assert.match(edge, /token_hash.*await hash\\(token\\)/);
  assert.match(edge, /sessionByToken\\(id,token\\)/);
  assert.match(sql, /enable row level security/g);
});
test('timer expiry is enforced by the server and configurable in editor', () => {
  assert.ok(edge.includes('action==="timer_start"'));
  assert.ok(edge.includes('action==="timer_reset"'));
  assert.ok(edge.includes('Date.now()>=Date.parse(s.vote_deadline_at)'));
  assert.ok(html.includes('id="new-timer-seconds"'));
  assert.ok(sql.includes('vote_deadline_at'));
});
test('stage-1 SQL remains non-destructive and scoped to Live', () => {
  assert.doesNotMatch(sql, /\\bdrop\\s+(table|schema)\\b/i);
  assert.doesNotMatch(sql, /\\b(auth\\.|billing\\.|cphq)\\b/i);
  assert.match(sql, /revoke all on public.live_audience_questions from anon, authenticated/);
});
