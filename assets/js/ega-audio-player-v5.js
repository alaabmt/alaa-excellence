(() => {
  if (!/case-ega-dx-ultra-innovation\.html$/i.test(window.location.pathname)) return;
  if (window.__tenxEgaAudioPlayerV5) return;
  window.__tenxEgaAudioPlayerV5 = true;

  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    .tenx-reading-now{background:linear-gradient(90deg,rgba(201,165,92,.18),rgba(201,165,92,.06))!important;box-shadow:0 0 0 3px rgba(178,134,67,.16);border-radius:12px;transition:background .25s ease,box-shadow .25s ease}
    .tenx-floating-audio{position:fixed;left:14px;right:14px;bottom:14px;z-index:9999;display:none;align-items:center;gap:9px;padding:10px 12px;border-radius:18px;background:rgba(11,37,69,.97);color:#fff;box-shadow:0 14px 38px rgba(0,0,0,.28);backdrop-filter:blur(10px);direction:rtl}
    .tenx-floating-audio.is-visible{display:flex}.tenx-floating-audio button{border:0;border-radius:999px;padding:9px 13px;font:inherit;font-weight:800;cursor:pointer}.tenx-floating-pause{background:#fff;color:#0b2545}.tenx-floating-stop{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.28)!important}.tenx-floating-label{flex:1;min-width:0;font-size:.82rem;line-height:1.45;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tenx-floating-label b{display:block;font-size:.76rem;color:#e6c98a;margin-bottom:1px}
    @media(min-width:760px){.tenx-floating-audio{left:50%;right:auto;transform:translateX(-50%);width:min(680px,calc(100vw - 28px))}}
  `;
  document.head.appendChild(style);

  const normalize = (s) => String(s || '').normalize('NFC').replace(/\s+/g, ' ').trim();

  // Article-specific pronunciation dictionary. The spoken layer is separate from the visible article.
  const phraseFixes = [
    [/تقنية الصهر/g, 'تِقْنِيَّتُ الصَّهْرِ'],
    [/تقنيةً للصهر/g, 'تِقْنِيَّةً لِلصَّهْرِ'],
    [/تقنية لصهر/g, 'تِقْنِيَّةٌ لِصَهْرِ'],
    [/تقنية صهر/g, 'تِقْنِيَّتُ صَهْرٍ'],
    [/صهر الألمنيوم/g, 'صَهْرُ الأَلُومِنْيُومِ'],
    [/خلية الصهر/g, 'خَلِيَّتُ الصَّهْرِ'],
    [/خلايا الصهر/g, 'خَلايا الصَّهْرِ'],
    [/طاقة الصهر/g, 'طاقَتُ الصَّهْرِ'],
    [/المعرفة التشغيلية/g, 'المَعْرِفَتُ التَّشْغِيلِيَّةُ'],
    [/المعرفة الصناعية/g, 'المَعْرِفَتُ الصِّنَاعِيَّةُ'],
    [/الكفاءة التشغيلية/g, 'الكَفاءَتُ التَّشْغِيلِيَّةُ'],
    [/كفاءة التيار/g, 'كَفاءَتُ التَّيَّارِ'],
    [/شدة التيار/g, 'شِدَّتُ التَّيَّارِ'],
    [/التيار الكهربائي/g, 'التَّيَّارُ الكَهْرَبَائِيُّ'],
    [/التشغيل/g, 'التَّشْغِيل'],
    [/التصميم/g, 'التَّصْمِيم'],
    [/التطوير/g, 'التَّطْوِير'],
    [/التجريب/g, 'التَّجْرِيب'],
    [/التحول/g, 'التَّحَوُّل'],
    [/التدريب/g, 'التَّدْرِيب'],
    [/الصناعية/g, 'الصِّنَاعِيَّة'],
    [/الطاقة/g, 'الطَّاقَة'],
    [/المؤسسة/g, 'المُؤَسَّسَة'],
    [/الألمنيوم/g, 'الأَلُومِنْيُوم'],
    [/DX\+\s*Ultra/gi, 'دِي إِكْس بْلَس أَلْتْرا'],
    [/EGA/g, 'إِي جِي إِيه'],
    [/Alba/g, 'أَلْبا'],
    [/465\s*kA/gi, 'أَرْبَعُمِئَةٍ وَخَمْسَةٌ وَسِتُّونَ كِيلو أَمْبِير'],
    [/460\s*kA/gi, 'أَرْبَعُمِئَةٍ وَسِتُّونَ كِيلو أَمْبِير'],
    [/12\.87\s*kWh\/kg/gi, 'اِثْنَا عَشَرَ فَاصِلَةَ سَبْعَةٍ وَثَمَانِينَ كِيلُو وَاطْ سَاعَةً لِكُلِّ كِيلُوغْرَام'],
    [/37\.5%/g, 'سَبْعَةٌ وَثَلَاثُونَ فَاصِلَةَ خَمْسَةٌ بِالْمِئَة'],
    [/95%/g, 'خَمْسَةٌ وَتِسْعُونَ بِالْمِئَة'],
    [/424/g, 'أَرْبَعُمِئَةٍ وَأَرْبَعٌ وَعِشْرُونَ']
  ];

  function speechText(raw) {
    let out = normalize(raw);
    for (const [re, value] of phraseFixes) out = out.replace(re, value);

    // In connected speech, taa marbuta must be pronounced /t/, not /h/.
    // Convert it only in the hidden spoken layer when another Arabic word follows.
    out = out.replace(/ة([ًٌٍَُِ]?)(?=\s+[\u0621-\u064A])/g, (_, mark) => `ت${mark || 'ُ'}`);
    return out.normalize('NFC');
  }

  const candidates = [
    document.querySelector('.case-hero h1'),
    document.querySelector('.case-lead'),
    ...document.querySelectorAll('.case-article .case-section h2, .case-article .case-section p, .case-article .plain, .case-article .move, .case-article .metric, .case-article .lens, .case-article .use-card, .case-article .transfer-card, .case-article .reflection')
  ].filter(Boolean);

  const segments = candidates.map((el) => ({ el, visible: normalize(el.innerText || el.textContent), spoken: speechText(el.innerText || el.textContent) })).filter((x) => x.spoken);
  if (!segments.length) return;

  const bar = document.querySelector('.tenx-author-audio');
  if (!bar) return;
  const play = bar.querySelector('.tenx-listen-btn');
  const stop = bar.querySelector('.tenx-stop-btn');
  const speed = bar.querySelector('.tenx-speed');
  const status = bar.querySelector('.tenx-audio-status');
  if (!play || !stop || !speed || !status) return;

  const floating = document.createElement('div');
  floating.className = 'tenx-floating-audio';
  floating.setAttribute('role', 'region');
  floating.setAttribute('aria-label', 'التحكم في الاستماع');
  floating.innerHTML = '<div class="tenx-floating-label"><b>الاستماع إلى المقال</b><span></span></div><button type="button" class="tenx-floating-pause">إيقاف مؤقت</button><button type="button" class="tenx-floating-stop">إيقاف</button>';
  document.body.appendChild(floating);
  const fPause = floating.querySelector('.tenx-floating-pause');
  const fStop = floating.querySelector('.tenx-floating-stop');
  const fLabel = floating.querySelector('.tenx-floating-label span');

  let index = 0;
  let active = false;
  let paused = false;
  let voice = null;
  let currentEl = null;

  function pickVoice() {
    const voices = synth.getVoices();
    voice = voices.find((v) => /^ar[-_](AE|SA)/i.test(v.lang)) || voices.find((v) => /^ar[-_]/i.test(v.lang)) || null;
  }
  pickVoice();
  if ('onvoiceschanged' in synth) synth.addEventListener('voiceschanged', pickVoice);

  function clearHighlight() {
    if (currentEl) currentEl.classList.remove('tenx-reading-now');
    currentEl = null;
  }

  function highlight(el) {
    clearHighlight();
    currentEl = el;
    currentEl.classList.add('tenx-reading-now');
  }

  function syncFloating() {
    floating.classList.toggle('is-visible', active);
    fPause.textContent = paused ? 'متابعة' : 'إيقاف مؤقت';
    play.textContent = active ? (paused ? 'متابعة الاستماع' : 'إيقاف مؤقت') : 'استمع إلى المقال';
    stop.disabled = !active;
  }

  function reset() {
    active = false;
    paused = false;
    index = 0;
    clearHighlight();
    fLabel.textContent = '';
    status.textContent = 'القراءة تبدأ من عنوان المقال، مع تظليل الجزء الجاري قراءته.';
    syncFloating();
  }

  function speakCurrent() {
    if (!active || index >= segments.length) { reset(); return; }
    const seg = segments[index];
    const utterance = new SpeechSynthesisUtterance(seg.spoken);
    utterance.lang = voice?.lang || 'ar-AE';
    if (voice) utterance.voice = voice;
    utterance.rate = Number(speed.value || 1);
    utterance.onstart = () => {
      highlight(seg.el);
      fLabel.textContent = seg.visible.slice(0, 95);
      status.textContent = 'الاستماع جارٍ · يتم تظليل الجزء المقروء.';
    };
    utterance.onend = () => {
      if (!active || paused) return;
      index += 1;
      speakCurrent();
    };
    utterance.onerror = () => {
      active = false;
      clearHighlight();
      status.textContent = 'تعذر تشغيل الصوت على هذا الجهاز.';
      syncFloating();
    };
    synth.speak(utterance);
  }

  function start() {
    synth.cancel();
    index = 0;
    active = true;
    paused = false;
    syncFloating();
    speakCurrent();
  }

  function togglePause() {
    if (!active) { start(); return; }
    if (!paused) {
      synth.pause();
      paused = true;
      status.textContent = 'تم إيقاف القراءة مؤقتاً.';
    } else {
      synth.resume();
      paused = false;
      status.textContent = 'الاستماع جارٍ.';
    }
    syncFloating();
  }

  function stopAll() {
    synth.cancel();
    reset();
  }

  play.addEventListener('click', (e) => { e.preventDefault(); e.stopImmediatePropagation(); if (!active) start(); else togglePause(); }, true);
  stop.addEventListener('click', (e) => { e.preventDefault(); e.stopImmediatePropagation(); stopAll(); }, true);
  fPause.addEventListener('click', togglePause);
  fStop.addEventListener('click', stopAll);
  speed.addEventListener('change', (e) => {
    e.stopImmediatePropagation();
    if (!active) return;
    synth.cancel();
    paused = false;
    window.setTimeout(speakCurrent, 90);
  }, true);
  window.addEventListener('pagehide', () => synth.cancel(), { once: true });

  reset();
})();
