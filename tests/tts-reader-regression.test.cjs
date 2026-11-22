// Run with: node --test tests/tts-reader-regression.test.cjs
// These are deterministic contract tests with a mocked speech engine, not audible device tests.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/site-engagement.js'), 'utf8');

function extract(start, end) {
  const i = source.indexOf(start);
  const j = source.indexOf(end, i + start.length);
  assert.ok(i >= 0 && j > i, 'Reader fragment exists: ' + start);
  return source.slice(i, j);
}

function fakeElement(tag, text) {
  return {
    textContent: text, innerText: text,
    matches: (selector) => selector.split(',').includes(tag),
    closest: () => null, querySelectorAll: () => [], getAttribute: () => null,
    querySelector: () => null,
    classList: { add() {}, remove() {} }
  };
}

test('Arabic and English references are excluded, while the heading and body are spoken', () => {
  const heading = fakeElement('h1', 'Article heading');
  const lead = fakeElement('p', 'Article introduction');
  const document = { querySelector: (selector) => selector.startsWith('.case-hero h1') ? heading : lead };
  const cleanText = (x) => String(x || '').replace(/\s+/g, ' ').trim();
  const getVisibleSpeechText = (el) => cleanText(el.innerText);
  const fn = new Function('document', 'cleanText', 'getVisibleSpeechText', 'path',
    'return (' + extract('  function buildSpeechSegments(article) {', '  function getReadingText(article) {').trim() + ');'
  )(document, cleanText, getVisibleSpeechText, '/article-test.html');
  for (const refTitle of ['المراجع', 'المصادر', 'References', 'Sources']) {
    const article = { querySelectorAll: () => [
      fakeElement('h2', 'Findings'), fakeElement('p', 'Main body'),
      fakeElement('h2', refTitle), fakeElement('li', 'DO NOT SPEAK REFERENCE')
    ] };
    const spoken = fn(article).map((item) => item.text);
    assert.ok(spoken.includes('Article heading'));
    assert.ok(spoken.includes('Main body'));
    assert.ok(!spoken.includes('DO NOT SPEAK REFERENCE'), refTitle);
  }
});

function makePlayer(ignorePause = false) {
  const tasks = new Map();
  let taskId = 0;
  const window = {
    setTimeout(fn) { const id = ++taskId; tasks.set(id, fn); return id; },
    clearTimeout(id) { tasks.delete(id); },
    addEventListener() {}
  };
  const control = () => {
    const listeners = {};
    return {
      disabled: false, textContent: '', value: '1', selectedIndex: 0,
      options: [{ text: '1×' }, { text: '1.3×' }],
      classList: { add() {}, remove() {} },
      addEventListener(name, fn) { listeners[name] = fn; },
      click() { listeners.click?.(); },
      change() { listeners.change?.(); }
    };
  };
  const play = control(), stop = control(), speed = control();
  const floatingPause = control(), floatingStop = control(), floatingSpeed = control();
  const floating = { classList: { add() {}, remove() {} } };
  const floatingLabel = { textContent: '' }, status = { textContent: '' };
  const synth = {
    paused: false, speaking: false, current: null,
    getVoices() { return [{ lang: 'en-US' }]; },
    addEventListener() {},
    cancel() { this.paused = false; this.speaking = false; this.current = null; },
    speak(utterance) { this.paused = false; this.speaking = true; this.current = utterance; },
    pause() { if (!ignorePause) this.paused = true; },
    resume() { this.paused = false; }
  };
  class Utterance { constructor(text) { this.text = text; } }
  const segment = {
    text: 'A useful article with multiple words about public services.',
    el: { classList: { add() {}, remove() {} } }
  };
  const fragment = extract('    let segments = [];', '\n  }\n\n  function addGlobalShare()');
  const player = new Function(
    'synth', 'play', 'stop', 'speed', 'status', 'floating', 'floatingLabel',
    'floatingPause', 'floatingStop', 'floatingSpeed', 'SpeechSynthesisUtterance',
    'document', 'window', 'IS_ENGLISH_PAGE', 'ui', 'article', 'buildSpeechSegments',
    fragment + '\nreturn { state: () => ({ speaking, paused, spokenOffset }) };'
  )(
    synth, play, stop, speed, status, floating, floatingLabel,
    floatingPause, floatingStop, floatingSpeed, Utterance,
    { querySelectorAll: () => [] }, window, true, (en) => en, {},
    () => [segment]
  );
  return {
    synth, play, stop, speed, floatingPause, floatingStop, floatingSpeed, segment, player,
    runTimers() {
      const pending = [...tasks.values()];
      tasks.clear();
      pending.forEach((fn) => fn());
    }
  };
}

test('native pause and resume maintain the same utterance', () => {
  const p = makePlayer();
  p.play.click();
  const original = p.synth.current;
  original.onboundary({ charIndex: 10 });
  p.play.click();
  assert.equal(p.synth.paused, true);
  p.play.click();
  assert.equal(p.synth.paused, false);
  assert.equal(p.synth.current, original);
});

test('changing speed while paused resumes from saved boundary; stop cancels it', () => {
  const p = makePlayer();
  p.play.click();
  p.synth.current.onboundary({ charIndex: 12 });
  p.play.click();
  p.speed.value = '1.3';
  p.speed.change();
  p.play.click();
  assert.equal(p.synth.current.text, p.segment.text.slice(12));
  p.stop.click();
  assert.equal(p.synth.speaking, false);
  assert.equal(p.player.state().speaking, false);
});

test('unresponsive native pause falls back to cancel and resume from boundary', () => {
  const p = makePlayer(true);
  p.play.click();
  p.synth.current.onboundary({ charIndex: 7 });
  p.play.click();
  p.runTimers();
  assert.equal(p.synth.speaking, false);
  p.play.click();
  assert.equal(p.synth.current.text, p.segment.text.slice(7));
});
