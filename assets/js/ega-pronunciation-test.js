(() => {
  if (!/case-ega-dx-ultra-innovation\.html$/i.test(window.location.pathname)) return;
  if (window.__tenxEgaPronunciationPlayer) return;
  window.__tenxEgaPronunciationPlayer = true;

  const replacements = [
    [/الإمارات العالمية للألمنيوم/g, 'الإِمارات العالَمِيَّة لِلأَلُومِنْيُوم'],
    [/خلية الصهر/g, 'خَلِيَّة الصَّهْر'],
    [/كفاءة التيار/g, 'كَفاءَة التَّيَّار'],
    [/التيار الكهربائي/g, 'التَّيَّار الكَهْرَبائِي'],
    [/المعرفة التشغيلية/g, 'المَعْرِفَة التَّشْغِيلِيَّة'],
    [/DX\+\s*Ultra/gi, 'دي إكس بْلَس أَلْترا'],
    [/EGA/g, 'إي جي إيه'],
    [/Alba/g, 'أَلْبا'],
    [/465\s*kA/gi, 'أربعمئة وخمسة وستون كيلو أَمبير'],
    [/460\s*kA/gi, 'أربعمئة وستون كيلو أَمبير'],
    [/12\.87\s*kWh\/kg/gi, 'اثنا عشر فاصلة سبعة وثمانون كيلوواط ساعة لكل كيلوغرام'],
    [/kWh\/kg/gi, 'كيلوواط ساعة لكل كيلوغرام'],
    [/kA/g, 'كيلو أَمبير'],
    [/37\.5%/g, 'سبعة وثلاثون فاصلة خمسة بالمئة'],
    [/95%/g, 'خمسة وتسعون بالمئة'],
    [/424/g, 'أربعمئة وأربع وعشرون'],
    [/الألمنيوم/g, 'الأَلُومِنْيُوم'],
    [/الصهر/g, 'الصَّهْر']
  ];

  const prepare = (text) => {
    let out = String(text || '');
    replacements.forEach(([pattern, value]) => { out = out.replace(pattern, value); });
    return out;
  };

  const splitSpeech = (text, maxLen = 180) => {
    const sentences = String(text || '').split(/(?<=[.!؟؛:])\s+/);
    const chunks = [];
    let current = '';
    for (const sentence of sentences) {
      if (!sentence) continue;
      const candidate = (current + ' ' + sentence).trim();
      if (candidate.length <= maxLen) { current = candidate; continue; }
      if (current) chunks.push(current);
      if (sentence.length <= maxLen) { current = sentence; continue; }
      current = '';
      for (const word of sentence.split(/\s+/)) {
        const next = (current + ' ' + word).trim();
        if (next.length <= maxLen) current = next;
        else { if (current) chunks.push(current); current = word; }
      }
    }
    if (current) chunks.push(current);
    return chunks;
  };

  const init = () => {
    const bar = document.querySelector('.tenx-author-audio');
    const article = document.querySelector('.case-article');
    if (!bar || !article || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;

    const play = bar.querySelector('.tenx-listen-btn');
    const stop = bar.querySelector('.tenx-stop-btn');
    const speed = bar.querySelector('.tenx-speed');
    const status = bar.querySelector('.tenx-audio-status');
    if (!play || !stop || !speed || !status) return;

    const clone = article.cloneNode(true);
    clone.querySelectorAll('.refs,.references,.tenx-share-box,.tenx-author-audio,.back,script,style,noscript,nav,button').forEach((el) => el.remove());
    const rawText = (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim();
    const chunks = splitSpeech(prepare(rawText));
    const synth = window.speechSynthesis;

    let index = 0;
    let active = false;
    let paused = false;
    let voice = null;

    const pickVoice = () => {
      const voices = synth.getVoices();
      voice = voices.find((v) => /^ar[-_](AE|SA)/i.test(v.lang)) || voices.find((v) => /^ar[-_]/i.test(v.lang)) || null;
    };
    pickVoice();
    if ('onvoiceschanged' in synth) synth.onvoiceschanged = pickVoice;

    const reset = () => {
      active = false;
      paused = false;
      index = 0;
      play.textContent = 'استمع إلى المقال';
      play.classList.remove('is-paused');
      stop.disabled = true;
      status.textContent = '';
    };

    const speakNext = () => {
      if (!active || index >= chunks.length) { reset(); return; }
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = voice?.lang || 'ar-AE';
      if (voice) utterance.voice = voice;
      utterance.rate = Number(speed.value || 1);
      utterance.onend = () => { if (active && !paused) { index += 1; speakNext(); } };
      utterance.onerror = () => { status.textContent = 'تعذر تشغيل الصوت على هذا الجهاز.'; reset(); };
      synth.speak(utterance);
      status.textContent = 'الاستماع بالتشكيل المحسّن جارٍ.';
    };

    play.addEventListener('click', (event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      if (active && !paused) {
        synth.pause(); paused = true; play.textContent = 'متابعة الاستماع'; play.classList.add('is-paused'); status.textContent = 'تم إيقاف القراءة مؤقتاً.'; return;
      }
      if (active && paused) {
        synth.resume(); paused = false; play.textContent = 'إيقاف مؤقت'; play.classList.remove('is-paused'); status.textContent = 'الاستماع بالتشكيل المحسّن جارٍ.'; return;
      }
      if (!chunks.length) { status.textContent = 'لا يوجد نص قابل للقراءة.'; return; }
      synth.cancel(); index = 0; active = true; paused = false; stop.disabled = false; play.textContent = 'إيقاف مؤقت'; speakNext();
    }, true);

    stop.addEventListener('click', (event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      synth.cancel(); reset();
    }, true);

    speed.addEventListener('change', (event) => {
      event.stopImmediatePropagation();
      if (!active) return;
      synth.cancel(); paused = false; status.textContent = 'تم تغيير سرعة القراءة.'; window.setTimeout(speakNext, 100);
    }, true);

    status.textContent = 'نسخة تجريبية: نطق عربي محسّن لهذا المقال.';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else window.setTimeout(init, 0);
})();
