// Run: node --test tests/tts-reader-regression.test.cjs
// Synthetic Web Speech API checks; device audio acceptance must still be performed.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/site-engagement.js'), 'utf8');

function extract(start, end) {
  const i = source.indexOf(start), j = source.indexOf(end, i + start.length);
  assert.ok(i >= 0 && j > i, 'Reader fragment exists: ' + start);
  return source.slice(i, j);
}

function element(tag, text) {
  const classes = new Set();
  return {
    textContent: text, innerText: text,
    matches: (selector) => selector.split(',').includes(tag),
    closest: () => null, querySelectorAll: () => [], getAttribute: () => null,
    querySelector: () => null,
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name), contains: (name) => classes.has(name) }
  };
}

function speechSegments(children, pagePath = '/article-test.html') {
  const h1 = element('h1', 'Main title'), lead = element('p', 'First introduction');
  const document = { querySelector: (selector) => selector.startsWith('.case-hero h1') ? h1 : lead };
  const cleanText = (x) => String(x || '').replace(/\s+/g, ' ').trim();
  const getVisibleSpeechText = (el) => cleanText(el.innerText);
  const fn = new Function('document', 'cleanText', 'getVisibleSpeechText', 'path',
    'return (' + extract('  function buildSpeechSegments(article) {', '  function getReadingText(article) {').trim() + ');'
  )(document, cleanText, getVisibleSpeechText, pagePath);
  return fn({ querySelectorAll: () => children });
}

test('Arabic and English references are omitted, including unwrapped reference lists', () => {
  for (const title of ['المراجع', 'المصادر', 'References', 'Sources']) {
    const spoken = speechSegments([
      element('h2', 'Results'), element('p', 'Main narrative. Another sentence.'),
      element('h2', title), element('li', 'REFERENCE MUST NOT BE SPOKEN')
    ]).map((part) => part.text);
    assert.ok(spoken.includes('Main title'));
    assert.ok(spoken.includes('Main narrative.'));
    assert.ok(spoken.includes('Another sentence.'));
    assert.ok(!spoken.includes('REFERENCE MUST NOT BE SPOKEN'), title);
  }
});

function makePlayer(segments, options = {}) {
  const timers = new Map();
  let nextTimer = 0;
  const window = {
    setTimeout(fn) { const id = ++nextTimer; timers.set(id, fn); return id; },
    clearTimeout(id) { timers.delete(id); },
    addEventListener() {}
  };
  const button = () => {
    const handlers = {};
    const classes = new Set();
    return {
      textContent: '', value: '1', selectedIndex: 0, disabled: false,
      options: [{ text: '1×' }, { text: '1.3×' }],
      classList: { add: (x) => classes.add(x), remove: (x) => classes.delete(x), contains: (x) => classes.has(x) },
      addEventListener(event, handler) { handlers[event] = handler; },
      click() { handlers.click?.(); },
      change() { handlers.change?.(); }
    };
  };
  const play = button(), stop = button(), speed = button();
  const floatingPause = button(), floatingStop = button(), floatingSpeed = button();
  const floating = { classList: { add() {}, remove() {} } };
  const floatingLabel = { textContent: '' }, status = { textContent: '' };
  const synth = {
    speaking: false, paused: false, current: null, spoken: [], cancelCount: 0,
    getVoices() { return [{ lang: 'en-US' }]; },
    addEventListener() {},
    cancel() {
      this.cancelCount++;
      this.speaking = false;
      // Deliberately retain a stale callback reference: older voice engines
      // can dispatch an old onend after cancel, which must not advance the text.
      this.lastCanceled = this.current;
      this.current = null;
    },
    speak(utterance) { this.spoken.push(utterance); this.speaking = true; this.current = utterance; },
    pause() { throw Error('Must not use unreliable native pause'); },
    resume() { throw Error('Must not use unreliable native resume'); }
  };
  class Utterance { constructor(text) { this.text = text; } }
  const fragment = extract('    let segments = [];', '\n  }\n\n  function addGlobalShare()');
  const player = new Function(
    'synth', 'play', 'stop', 'speed', 'status', 'floating', 'floatingLabel',
    'floatingPause', 'floatingStop', 'floatingSpeed', 'SpeechSynthesisUtterance',
    'document', 'window', 'IS_ENGLISH_PAGE', 'ui', 'article', 'buildSpeechSegments',
    fragment + '\nreturn { state: () => ({ speaking, paused, index, spokenOffset }) };'
  )(
    synth, play, stop, speed, status, floating, floatingLabel,
    floatingPause, floatingStop, floatingSpeed, Utterance,
    { querySelectorAll: () => [] }, window, true, (en) => en, {},
    () => segments
  );
  return {
    synth, play, stop, speed, floatingPause, floatingStop, floatingSpeed, floatingLabel, status, player,
    runTimers() { const pending = [...timers.values()]; timers.clear(); pending.forEach((fn) => fn()); }
  };
}

function paragraph(text) { return { text, el: element('p', text) }; }

test('pause cancels audio; resume immediately creates a new utterance from the saved word', () => {
  const sentence = 'The article describes complex service delivery.';
  const p = makePlayer([paragraph(sentence)]);
  p.play.click();
  p.synth.current.onboundary({ charIndex: 17 }); // inside 'describes' / near a word boundary
  const position = p.player.state().spokenOffset;
  assert.ok(position > 0);
  const oldUtterance = p.synth.current;
  p.play.click();
  assert.equal(p.synth.speaking, false);
  assert.equal(p.player.state().paused, true);
  assert.equal(p.play.textContent, 'Resume');
  oldUtterance.onend(); // late callback from cancelled speech
  assert.equal(p.player.state().index, 0);
  p.play.click();
  assert.equal(p.synth.speaking, true);
  assert.equal(p.player.state().paused, false);
  assert.equal(p.synth.current.text, sentence.slice(position));
  assert.equal(p.synth.spoken.length, 2);
});

test('resume works when no boundary events are emitted, from the current sentence', () => {
  const p = makePlayer([paragraph('First sentence.'), paragraph('Second sentence.')]);
  p.play.click();
  p.synth.current.onend();
  assert.equal(p.player.state().index, 1);
  p.floatingPause.click();
  assert.equal(p.synth.speaking, false);
  p.floatingPause.click();
  assert.equal(p.synth.current.text, 'Second sentence.');
  assert.equal(p.player.state().index, 1);
});

test('changing speed during a pause keeps pause state and resumes at changed rate', () => {
  const p = makePlayer([paragraph('A service process contains several stages.')]);
  p.play.click();
  p.synth.current.onboundary({ charIndex: 20 });
  p.play.click();
  const count = p.synth.spoken.length;
  p.speed.value = '1.3';
  p.speed.change();
  assert.equal(p.synth.spoken.length, count);
  assert.equal(p.player.state().paused, true);
  p.play.click();
  assert.equal(p.synth.current.rate, 1.3);
  assert.ok(p.synth.current.text.length > 0);
});

test('Stop cancels playback and prevents a delayed onend or timer from restarting speech', () => {
  const p = makePlayer([paragraph('A paragraph to read.')]);
  p.play.click();
  const old = p.synth.current;
  p.floatingStop.click();
  old.onend();
  p.runTimers();
  assert.equal(p.synth.speaking, false);
  assert.equal(p.player.state().speaking, false);
  assert.equal(p.synth.spoken.length, 1);
});

test('speed change during play restarts the current sentence and ignores stale completion', () => {
  const p = makePlayer([paragraph('One long sentence.')]);
  p.play.click();
  const old = p.synth.current;
  p.speed.value = '1.3';
  p.speed.change();
  old.onend();
  p.runTimers();
  assert.equal(p.synth.current.text, 'One long sentence.');
  assert.equal(p.synth.current.rate, 1.3);
  assert.equal(p.player.state().index, 0);
});


test('long Arabic and English text uses bounded playback chunks when voices omit boundaries', () => {
  for (const sentence of [
    'هذه تجربة طويلة للتحقق من قدرة الاستماع على استئناف النص من موضع قريب بدلاً من البدء من أول المقال '.repeat(3),
    'This long sentence verifies that the reader resumes close to the place where it was interrupted '.repeat(3)
  ]) {
    const sections = speechSegments([element('p', sentence)]).map((x) => x.text);
    const content = sections.slice(2); // Exclude the page title and lead.
    assert.ok(content.length >= 4);
    assert.ok(content.every((chunk) => chunk.trim().split(/\s+/u).length <= 8));
    assert.equal(content.join(' '), sentence.trim());
  }
});

test('pause after several completed chunks resumes the active checkpoint, not the article heading', () => {
  const manyWords = Array.from({ length: 48 }, (_, i) => 'word' + i).join(' ');
  const sections = speechSegments([element('p', manyWords)]);
  const p = makePlayer(sections);
  p.play.click();
  const title = p.synth.current.text;
  for (let i = 0; i < 5; i++) p.synth.current.onend();
  const position = p.player.state().index;
  assert.ok(position >= 5);
  const activeChunk = p.synth.current.text;
  assert.notEqual(activeChunk, title);
  p.play.click();
  assert.equal(p.player.state().index, position);
  assert.ok(p.status.textContent.includes(String(position + 1)));
  p.play.click();
  assert.equal(p.synth.current.text, activeChunk);
  assert.equal(p.player.state().index, position);
});
