/* Shared navigation bootstrap for editorial pages without main.js. */
(()=>{if(document.querySelector('script[src*="unified-navigation.js"]'))return;const sc=document.createElement('script');sc.src='/assets/js/unified-navigation.js?v=20261101-6';sc.defer=true;document.head.appendChild(sc)})();
(() => {
  if (window.__tenxEngagementLoaded) return;
  window.__tenxEngagementLoaded = true;

  const PAGE_LANG = (document.documentElement.lang || '').toLowerCase();
  const IS_ENGLISH_PAGE = PAGE_LANG === 'en' || PAGE_LANG.startsWith('en-');
  const AUTHOR_NAME = IS_ENGLISH_PAGE ? 'Dr. Alaa Mohammad Ahmed' : 'الدكتور علاء محمد أحمد';
  const AUTHOR_URL = IS_ENGLISH_PAGE ? '/en/about.html' : '/about.html';
  const AUTHOR_IMAGE = '/assets/images/alaa-mohammad-ahmad-profile-hq.webp';
  const ui = (en, ar) => IS_ENGLISH_PAGE ? en : ar;
  const path = window.location.pathname.toLowerCase();
  const isArticlePage = /\/(case-|idea-|article-|reflection-)/.test(path) || !!document.querySelector('[data-tenx-article]');
  const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href.split('#')[0];
  const title = document.querySelector('meta[property="og:title"]')?.content || document.querySelector('h1')?.textContent?.trim() || document.title;

  function ensureStyle() {
    if (document.getElementById('tenx-engagement-style')) return;
    const style = document.createElement('style');
    style.id = 'tenx-engagement-style';
    style.textContent = `
      .tenx-author-audio{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin:22px 0 6px;padding:14px 16px;border:1px solid #e0e7ef;border-radius:18px;background:#fff;box-shadow:0 10px 28px rgba(11,37,69,.05)}
      .tenx-author-meta{display:flex;align-items:center;gap:11px;min-width:0}.tenx-author-avatar{width:42px;height:42px;border-radius:50%;object-fit:cover;flex:0 0 auto;border:2px solid #fff;box-shadow:0 0 0 1px #d9e2ec}.tenx-author-lines{display:flex;align-items:center;gap:7px;flex-wrap:wrap;color:#657487;font-size:.88rem;line-height:1.5}.tenx-author-lines a{color:#0b2545;font-weight:900;text-decoration:none}.tenx-author-lines .dot{color:#b28643;font-weight:900}
      .tenx-listen-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tenx-listen-btn,.tenx-stop-btn,.tenx-speed,.tenx-floating-btn,.tenx-floating-speed{appearance:none;border:1px solid #d8e1ea;background:#f8fafc;color:#0b2545;border-radius:999px;padding:10px 14px;font:inherit;font-size:.86rem;font-weight:850;cursor:pointer}.tenx-listen-btn{background:#0b2545;color:#fff;border-color:#0b2545}.tenx-listen-btn.is-paused{background:#fff;color:#0b2545}.tenx-listen-btn:disabled,.tenx-stop-btn:disabled{opacity:.48;cursor:not-allowed}.tenx-speed{padding:9px 10px;background:#fff}.tenx-audio-status{width:100%;font-size:.78rem;color:#748397;margin-top:-2px}
      .tenx-reading-now{background:linear-gradient(180deg,rgba(231,191,101,.12),rgba(231,191,101,.24))!important;box-shadow:0 0 0 4px rgba(178,134,67,.10);border-radius:10px;transition:background .2s ease,box-shadow .2s ease}
      .tenx-floating-audio{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;width:min(760px,calc(100% - 24px));display:none;align-items:center;gap:9px;padding:11px 13px;border:1px solid rgba(11,37,69,.15);border-radius:18px;background:rgba(255,255,255,.97);box-shadow:0 18px 50px rgba(11,37,69,.2);backdrop-filter:blur(10px)}.tenx-floating-audio.is-active{display:flex}.tenx-floating-label{min-width:0;flex:1;color:#40536a;font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tenx-floating-btn{background:#fff}.tenx-floating-pause{background:#0b2545;color:#fff;border-color:#0b2545}.tenx-floating-speed{padding:9px 10px;background:#fff}
      .tenx-share-shell{max-width:1180px;margin:0 auto;padding:0 20px}.tenx-share-box{margin:48px 0 28px;padding:28px;border:1px solid #dfe6ee;border-radius:24px;background:linear-gradient(135deg,#f8fafc,#fff);box-shadow:0 18px 44px rgba(11,37,69,.06)}
      .tenx-share-copy span{display:inline-block;color:#9b7436;font-size:.78rem;font-weight:900;margin-bottom:7px}.tenx-share-copy h2{margin:0;color:#0b2545;font-size:clamp(1.35rem,2.6vw,1.85rem);line-height:1.55}.tenx-share-copy p{margin:8px 0 0!important;color:#657487!important;font-size:.98rem!important;line-height:1.7!important}
      .tenx-share-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.tenx-share-btn{appearance:none;border:1px solid #d8e1ea;background:#fff;color:#0b2545;border-radius:999px;padding:11px 16px;font:inherit;font-size:.9rem;font-weight:850;line-height:1;cursor:pointer;text-decoration:none!important;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}.tenx-share-btn:hover{transform:translateY(-2px);border-color:#9fb1c5;box-shadow:0 8px 18px rgba(11,37,69,.08)}.tenx-share-primary{background:#0b2545;color:#fff!important;border-color:#0b2545}.tenx-share-note{margin-top:13px;color:#7a8798;font-size:.78rem;line-height:1.65}.tenx-share-btn.is-copied{background:#edf7f0;border-color:#b8d9c1;color:#215c34}
      @media(max-width:640px){.tenx-author-audio{align-items:flex-start}.tenx-listen-controls{width:100%}.tenx-listen-btn{flex:1}.tenx-floating-audio{bottom:9px;flex-wrap:wrap}.tenx-floating-label{flex-basis:100%;order:-1}.tenx-floating-pause{flex:1}.tenx-share-box{padding:22px 18px;border-radius:20px}.tenx-share-actions{display:grid;grid-template-columns:1fr 1fr}.tenx-share-btn{text-align:center;padding:13px 10px}.tenx-share-primary{grid-column:1/-1}.tenx-share-shell{padding:0 14px}}
    `;
    style.textContent += "\n/* Share Studio */\n.tenx-studio-overlay{position:fixed;inset:0;z-index:99999;background:rgba(3,18,28,.78);display:flex;justify-content:center;align-items:center;padding:16px;overflow:auto}.tenx-studio{box-sizing:border-box;background:#102f3b;color:#fff;width:min(640px,100%);max-height:calc(100dvh - 32px);overflow:auto;border:1px solid #4b7580;border-radius:24px;padding:24px;box-shadow:0 22px 80px #0006}.tenx-studio-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.tenx-studio-head h2{color:#fff!important;font-size:1.6rem;margin:0 0 16px}.tenx-studio-close{background:none;border:0;color:#fff;font-size:2rem;cursor:pointer}.tenx-studio-preview{background:#fff;border-radius:15px;overflow:hidden;margin:8px 0 18px}.tenx-studio-preview img{display:block;width:100%;height:auto;aspect-ratio:1200/630;object-fit:contain}.tenx-studio-fallback{color:#0b2545;padding:30px;font-weight:bold}.tenx-studio label{display:block;margin-bottom:8px;font-weight:700}.tenx-studio textarea{box-sizing:border-box;width:100%;background:#071e27;border:1px solid #54727c;color:#fff;padding:14px;border-radius:12px;font:inherit;line-height:1.6;resize:vertical}.tenx-studio-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:18px}.tenx-studio-grid button{background:#153b49;color:#fff;border:1px solid #466976;border-radius:14px;min-height:62px;padding:10px 6px;font:inherit;cursor:pointer}.tenx-studio-grid button:hover,.tenx-studio-grid button:focus-visible{border-color:#d4ac56;background:#205064}.tenx-studio-grid button:first-child{background:#cba64e;color:#071e27;font-weight:800}.tenx-studio-note{color:#c4d0d4;font-size:.85rem;line-height:1.6}@media(max-width:480px){.tenx-studio{padding:18px;border-radius:18px}.tenx-studio-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}\n";
    document.head.appendChild(style);
  }

  function formatArticleDate(raw) {
    if (!raw) return '';
    const date = new Date(raw.length === 10 ? `${raw}T12:00:00` : raw);
    if (Number.isNaN(date.getTime())) return raw;
    try { return new Intl.DateTimeFormat(IS_ENGLISH_PAGE ? 'en-US' : 'ar-AE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date); }
    catch (_) { return raw; }
  }

  function getArticleContainer() {
    return document.querySelector('.case-article, .article-wrap, .idea-body article, .article-content, main article');
  }

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function getVisibleSpeechText(el) {
    const spoken = el?.getAttribute?.('data-tenx-speech');
    if (spoken) return cleanText(spoken);
    // Inline parts marked data-no-speech (such as evidence labels) stay visible but are not read aloud.
    if (el?.querySelector?.('[data-no-speech]')) {
      const copy = el.cloneNode(true);
      copy.querySelectorAll('[data-no-speech]').forEach((node) => node.remove());
      return cleanText(copy.textContent || '');
    }
    return cleanText(el?.innerText || el?.textContent || '');
  }

  function buildSpeechSegments(article) {
    if (!article) return [];
    const result = [];
    const seen = new Set();
    const add = (el) => {
      if (!el || seen.has(el)) return;
      if (el.closest('.refs,.references,.agent-refs,.tenx-share-box,.tenx-author-audio,.tenx-floating-audio,.back,nav,footer')) return;
      const text = getVisibleSpeechText(el);
      if (!text) return;
      seen.add(el);
      result.push({ el, text });
    };

    add(document.querySelector('.case-hero h1, .article-hero h1, .idea-hero h1, main h1'));
    add(document.querySelector('.case-lead, .article-lead, .idea-lead, .article-hero p, .idea-hero p, main article header.page-header h1 + p'));

    const selector = 'h2,h3,h4,p,li,blockquote,.plain,.note,.move,.metric,.lens,.use-card,.transfer-card,.reflection';
    const reflectionPage = /\/reflection-/.test(path);
    let afterReflectionText = false;
    article.querySelectorAll(selector).forEach((el) => {
      if (reflectionPage && el.matches('h2') && /^(المراجع|المصادر|تنويه تحريري|أسرار المشاركة|References|Editorial Disclaimer|Sharing Notes)/i.test(cleanText(el.textContent))) afterReflectionText = true;
      if (reflectionPage && (afterReflectionText || el.closest('.page-header .eyebrow'))) return;
      if (el.matches('.refs *, .references *, .agent-refs *, .tenx-share-box *, .tenx-author-audio *, .back')) return;
      const nested = Array.from(el.querySelectorAll(selector)).some((child) => child !== el && cleanText(child.textContent));
      if (nested && !el.matches('h2,h3,h4,p,li')) return;
      add(el);
    });
    return result;
  }

  function getReadingText(article) {
    return buildSpeechSegments(article).map((s) => s.text).join(' ');
  }

  function readingMinutes(text) {
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    // Same rates as the article cards: about 150 words a minute in Arabic, 170 in English.
    return Math.max(1, Math.ceil(words / (IS_ENGLISH_PAGE ? 170 : 150)));
  }

  function arabicReadingLabel(n) {
    if (n === 1) return 'دقيقة قراءة';
    if (n === 2) return 'دقيقتا قراءة';
    if (n >= 3 && n <= 10) return `${n} دقائق قراءة`;
    return `${n} دقيقة قراءة`;
  }

  function addArticleMetaAndAudio() {
    if (!isArticlePage || document.querySelector('.tenx-author-audio')) return;
    const article = getArticleContainer();
    if (!article) return;
    const minutes = readingMinutes(getReadingText(article));
    const published = document.querySelector('meta[property="article:published_time"]')?.content || document.querySelector('time[datetime]')?.getAttribute('datetime') || '';
    const dateLabel = formatArticleDate(published);

    const bar = document.createElement('div');
    bar.className = 'tenx-author-audio';
    bar.innerHTML = `
      <div class="tenx-author-meta">
        <img class="tenx-author-avatar" src="${AUTHOR_IMAGE}" alt="${AUTHOR_NAME}" width="42" height="42" loading="lazy" decoding="async">
        <div class="tenx-author-lines">
          <a href="${AUTHOR_URL}">${AUTHOR_NAME}</a>
          <span class="dot">·</span><span>${IS_ENGLISH_PAGE ? `${minutes} min read` : arabicReadingLabel(minutes)}</span>
          ${dateLabel ? `<span class="dot">·</span><time datetime="${published}">${dateLabel}</time>` : ''}
        </div>
      </div>
      <div class="tenx-listen-controls" aria-label="${ui('Listen to this article', 'الاستماع إلى المقال')}">
        <button type="button" class="tenx-listen-btn">${ui('Listen to Article', 'استمع إلى المقال')}</button>
        <button type="button" class="tenx-stop-btn" disabled>${ui('Stop', 'إيقاف')}</button>
        <select class="tenx-speed" aria-label="${ui('Reading speed', 'سرعة القراءة')}">
          <option value="0.85">0.85×</option><option value="1" selected>1×</option><option value="1.15">1.15×</option><option value="1.3">1.3×</option>
        </select>
      </div>
      <div class="tenx-audio-status" aria-live="polite"></div>`;

    const lead = document.querySelector('.case-lead, .article-lead, .idea-lead, .article-hero p, .idea-hero p, main article header.page-header h1 + p');
    if (lead) lead.insertAdjacentElement('afterend', bar);
    else article.insertAdjacentElement('afterbegin', bar);

    // EGA has a dedicated, fully vocalized player that takes over these controls.
    if (document.querySelector('script[src*="ega-audio-player-v7.js"]')) return;

    const play = bar.querySelector('.tenx-listen-btn');
    const stop = bar.querySelector('.tenx-stop-btn');
    const speed = bar.querySelector('.tenx-speed');
    const status = bar.querySelector('.tenx-audio-status');
    const synth = window.speechSynthesis;
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      play.disabled = true;
      speed.disabled = true;
      status.textContent = ui('Audio playback is not supported in this browser.', 'ميزة الاستماع غير مدعومة في هذا المتصفح.');
      return;
    }

    const floating = document.createElement('div');
    floating.className = 'tenx-floating-audio';
    floating.setAttribute('role', 'region');
    floating.setAttribute('aria-label', ui('Listening controls while scrolling', 'التحكم في الاستماع أثناء التمرير'));
    floating.innerHTML = `
      <div class="tenx-floating-label">${ui('Listen to Article', 'الاستماع إلى المقال')}</div>
      <button type="button" class="tenx-floating-btn tenx-floating-pause">${ui('Pause', 'إيقاف مؤقت')}</button>
      <button type="button" class="tenx-floating-btn tenx-floating-stop">${ui('Stop', 'إيقاف')}</button>
      <select class="tenx-floating-speed" aria-label="${ui('Reading speed while scrolling', 'سرعة القراءة أثناء التمرير')}">
        <option value="0.85">0.85×</option><option value="1" selected>1×</option><option value="1.15">1.15×</option><option value="1.3">1.3×</option>
      </select>`;
    document.body.appendChild(floating);

    const floatingLabel = floating.querySelector('.tenx-floating-label');
    const floatingPause = floating.querySelector('.tenx-floating-pause');
    const floatingStop = floating.querySelector('.tenx-floating-stop');
    const floatingSpeed = floating.querySelector('.tenx-floating-speed');

    let segments = [];
    let index = 0;
    let speaking = false;
    let paused = false;
    let chosenVoice = null;
    let runToken = 0;

    const pickVoice = () => {
      const voices = synth.getVoices();
      chosenVoice = IS_ENGLISH_PAGE
        ? (voices.find((v) => /^en[-_]US$/i.test(v.lang)) || voices.find((v) => /^en[-_]GB$/i.test(v.lang)) || voices.find((v) => /^en[-_]/i.test(v.lang)) || null)
        : (voices.find((v) => /^ar[-_]AE$/i.test(v.lang)) || voices.find((v) => /^ar[-_]SA$/i.test(v.lang)) || voices.find((v) => /^ar[-_]/i.test(v.lang)) || null);
    };
    pickVoice();
    if ('onvoiceschanged' in synth) synth.addEventListener('voiceschanged', pickVoice);

    const clearHighlight = () => document.querySelectorAll('.tenx-reading-now').forEach((el) => el.classList.remove('tenx-reading-now'));
    const syncSpeed = (value) => {
      speed.value = value;
      floatingSpeed.value = value;
    };
    const setCurrentHighlight = () => {
      clearHighlight();
      const current = segments[index];
      if (!current) return;
      current.el.classList.add('tenx-reading-now');
      const short = current.text.length > 95 ? `${current.text.slice(0, 95)}…` : current.text;
      floatingLabel.textContent = short;
    };
    const reset = () => {
      speaking = false;
      paused = false;
      index = 0;
      runToken += 1;
      clearHighlight();
      play.textContent = ui('Listen to Article', 'استمع إلى المقال');
      play.classList.remove('is-paused');
      stop.disabled = true;
      floating.classList.remove('is-active');
      floatingPause.textContent = ui('Pause', 'إيقاف مؤقت');
      status.textContent = '';
    };

    const speakCurrent = () => {
      if (!speaking || index >= segments.length) { reset(); return; }
      setCurrentHighlight();
      const myToken = runToken;
      const utterance = new SpeechSynthesisUtterance(segments[index].text);
      utterance.lang = chosenVoice?.lang || (IS_ENGLISH_PAGE ? 'en-US' : 'ar-AE');
      if (chosenVoice) utterance.voice = chosenVoice;
      utterance.rate = Number(speed.value || 1);
      utterance.onend = () => {
        if (!speaking || paused || myToken !== runToken) return;
        index += 1;
        speakCurrent();
      };
      utterance.onerror = (event) => {
        if (event?.error === 'canceled' || myToken !== runToken) return;
        status.textContent = ui('Audio could not be played on this device.', 'تعذر تشغيل الصوت على هذا الجهاز.');
        reset();
      };
      synth.speak(utterance);
      status.textContent = IS_ENGLISH_PAGE ? `Playing · ${speed.options[speed.selectedIndex].text}` : `الاستماع جارٍ · ${speed.options[speed.selectedIndex].text}`;
    };

    const pauseResume = () => {
      if (!speaking) return;
      if (!paused) {
        synth.pause();
        paused = true;
        play.textContent = ui('Resume', 'متابعة الاستماع');
        play.classList.add('is-paused');
        floatingPause.textContent = ui('Resume', 'متابعة');
        status.textContent = ui('Playback paused.', 'تم إيقاف القراءة مؤقتاً.');
      } else {
        synth.resume();
        paused = false;
        play.textContent = ui('Pause', 'إيقاف مؤقت');
        play.classList.remove('is-paused');
        floatingPause.textContent = ui('Pause', 'إيقاف مؤقت');
        status.textContent = ui('Playing.', 'الاستماع جارٍ.');
      }
    };

    const start = () => {
      synth.cancel();
      runToken += 1;
      segments = buildSpeechSegments(article);
      if (!segments.length) { status.textContent = ui('No readable text was found.', 'لا يوجد نص قابل للقراءة.'); return; }
      index = 0;
      speaking = true;
      paused = false;
      stop.disabled = false;
      play.textContent = ui('Pause', 'إيقاف مؤقت');
      play.classList.remove('is-paused');
      floatingPause.textContent = ui('Pause', 'إيقاف مؤقت');
      floating.classList.add('is-active');
      speakCurrent();
    };

    const stopAll = () => {
      runToken += 1;
      synth.cancel();
      reset();
    };

    const changeSpeed = (value) => {
      syncSpeed(value);
      if (!speaking) return;
      const wasPaused = paused;
      runToken += 1;
      synth.cancel();
      paused = false;
      if (wasPaused) {
        speaking = true;
        paused = true;
        play.textContent = ui('Resume', 'متابعة الاستماع');
        floatingPause.textContent = ui('Resume', 'متابعة');
        status.textContent = IS_ENGLISH_PAGE ? `Speed changed to ${value}×. Resume when ready.` : `تم تغيير السرعة إلى ${value}×. استأنف عند الجاهزية.`;
        return;
      }
      window.setTimeout(speakCurrent, 90);
    };

    play.addEventListener('click', () => speaking ? pauseResume() : start());
    stop.addEventListener('click', stopAll);
    floatingPause.addEventListener('click', pauseResume);
    floatingStop.addEventListener('click', stopAll);
    speed.addEventListener('change', () => changeSpeed(speed.value));
    floatingSpeed.addEventListener('change', () => changeSpeed(floatingSpeed.value));
    window.addEventListener('pagehide', () => { runToken += 1; synth.cancel(); }, { once: true });
  }

  function addGlobalShare() {
    if (document.querySelector('.tenx-share-box, .reflection-share')) return;
    const encodedUrl = encodeURIComponent(canonical);
    const isEnglish = (document.documentElement.lang || '').toLowerCase().startsWith('en');
    const shareText = isEnglish ? `${title} — Tamayuz 10X` : `${title} — التميّز 10X`;
    const encodedText = encodeURIComponent(shareText);
    const shareLabel = isEnglish ? 'Share the Knowledge' : 'شارك المعرفة';
    const shareHeading = isEnglish ? 'Found this page useful? Share it with someone who may benefit.' : 'وجدت هذه الصفحة مفيدة؟ شاركها مع من قد يستفيد منها.';
    const shareIntro = isEnglish ? 'Knowledge creates greater value when it is shared.' : 'المعرفة تصبح أكثر قيمة عندما تنتقل.';
    const shareAria = isEnglish ? 'Share this page' : 'مشاركة الصفحة';
    const box = document.createElement('section');
    box.className = 'tenx-share-box';
    box.setAttribute('aria-label', shareAria);
    box.innerHTML = `
      <div class="tenx-share-copy"><span>${shareLabel}</span><h2>${shareHeading}</h2><p>${shareIntro}</p></div>
      <div class="tenx-share-actions">
        <a class="tenx-share-btn tenx-share-primary" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a class="tenx-share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a class="tenx-share-btn" href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}" target="_blank" rel="noopener noreferrer">X</a>
        <a class="tenx-share-btn" href="https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a class="tenx-share-btn" href="https://t.me/share/url?url=${encodedUrl}&text=${encodedText}" target="_blank" rel="noopener noreferrer">Telegram</a>
        <button class="tenx-share-btn tenx-copy-link" type="button">${isEnglish ? 'Copy Link' : 'نسخ الرابط'}</button>
        <button class="tenx-share-btn tenx-native-share" type="button">${isEnglish ? 'More Sharing Options' : 'مشاركة أخرى'}</button>
      </div>
      <div class="tenx-share-note">${isEnglish ? 'On mobile, More Sharing Options lets you choose from the sharing apps available on your device, including Instagram when supported.' : 'على الهاتف، يتيح «مشاركة أخرى» اختيار التطبيقات المتاحة على جهازك، ومنها Instagram عندما يدعم الجهاز المشاركة إليها.'}</div>`;

    const article = isArticlePage ? getArticleContainer() : null;
    if (article) {
      const refs = article.querySelector('.refs,.references');
      const back = article.querySelector('.back');
      if (refs) refs.insertAdjacentElement('beforebegin', box);
      else if (back) back.insertAdjacentElement('beforebegin', box);
      else article.appendChild(box);
    } else {
      const shell = document.createElement('div');
      shell.className = 'tenx-share-shell';
      shell.appendChild(box);
      const footer = document.querySelector('footer');
      if (footer) footer.insertAdjacentElement('beforebegin', shell);
      else document.body.appendChild(shell);
    }

    // Tamayuz 10X Share Studio: progressive enhancement of the existing share panel.
    const studioButton = document.createElement('button');
    studioButton.type = 'button';
    studioButton.className = 'tenx-share-btn tenx-share-primary tenx-open-studio';
    studioButton.textContent = ui('Share Studio · Preview Card', 'استوديو المشاركة · معاينة البطاقة');
    box.querySelector('.tenx-share-actions').prepend(studioButton);
    let studio = null;
    let previousFocus = null;
    const esc = (v) => String(v || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const getCover = () => document.querySelector('meta[property="og:image"]')?.content || document.querySelector('main article img')?.src || '';
    const getDescription = () => document.querySelector('meta[property="og:description"]')?.content || document.querySelector('meta[name="description"]')?.content || '';
    const defaultPost = () => [title, getDescription(), canonical].filter(Boolean).join('\n\n');
    const copyText = async (value, button) => {
      try {
        await navigator.clipboard.writeText(value);
        const old = button.textContent;
        button.textContent = ui('Copied', 'تم النسخ');
        setTimeout(() => { button.textContent = old; }, 1600);
      } catch (_) { window.prompt(ui('Copy text:', 'انسخ النص:'), value); }
    };
    const closeStudio = () => {
      if (!studio) return;
      studio.remove(); studio = null;
      document.body.style.overflow = '';
      previousFocus?.focus();
    };
    const openStudio = () => {
      if (studio) return;
      previousFocus = document.activeElement;
      const cover = getCover();
      studio = document.createElement('div');
      studio.className = 'tenx-studio-overlay';
      studio.innerHTML = `<div class="tenx-studio" role="dialog" aria-modal="true" aria-label="${ui('Share this page', 'مشاركة الصفحة')}" dir="${IS_ENGLISH_PAGE ? 'ltr' : 'rtl'}">
        <div class="tenx-studio-head"><h2>${ui('Share this page', 'شارك هذه الصفحة')}</h2><button type="button" class="tenx-studio-close" aria-label="${ui('Close', 'إغلاق')}">×</button></div>
        <div class="tenx-studio-preview">${cover ? `<img src="${esc(cover)}" alt="${esc(title)}" loading="lazy">` : `<div class="tenx-studio-fallback">${esc(title)}</div>`}</div>
        <label for="tenx-studio-post">${ui('Ready post (you can edit it)', 'منشور جاهز (يمكنك تعديله)')}</label>
        <textarea id="tenx-studio-post" rows="5"></textarea>
        <div class="tenx-studio-grid">
          <button type="button" data-action="copy-post">${ui('Copy post', 'نسخ المنشور')}</button>
          <button type="button" data-action="copy-link">${ui('Copy link', 'نسخ الرابط')}</button>
          <button type="button" data-action="whatsapp">WhatsApp</button>
          <button type="button" data-action="linkedin">LinkedIn</button>
          <button type="button" data-action="facebook">Facebook</button>
          <button type="button" data-action="x">X</button>
          <button type="button" data-action="telegram">Telegram</button>
          <button type="button" data-action="instagram">Instagram</button>
          <button type="button" data-action="share-card">${ui('Share the card', 'مشاركة البطاقة')}</button>
        </div>
        <p class="tenx-studio-note">${ui('Some platforms do not accept prefilled post text. Copy your edited post before opening them. Image sharing depends on your device.', 'بعض المنصات لا تسمح بملء نص المنشور تلقائيًا. انسخ النص المعدّل قبل فتحها. مشاركة الصورة تعتمد على دعم جهازك.')}</p>
      </div>`;
      document.body.appendChild(studio);
      document.body.style.overflow = 'hidden';
      const textarea = studio.querySelector('textarea');
      textarea.value = defaultPost();
      studio.querySelector('.tenx-studio-close').addEventListener('click', closeStudio);
      studio.addEventListener('click', (event) => { if (event.target === studio) closeStudio(); });
      const open = (url) => window.open(url, '_blank', 'noopener,noreferrer');
      studio.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', async () => {
        const action = button.dataset.action;
        const post = textarea.value;
        if (action === 'copy-post') return copyText(post, button);
        if (action === 'copy-link') return copyText(canonical, button);
        if (action === 'linkedin') return open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(canonical));
        if (action === 'facebook') return open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(canonical));
        if (action === 'x') return open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(post));
        if (action === 'telegram') return open('https://t.me/share/url?url=' + encodeURIComponent(canonical) + '&text=' + encodeURIComponent(post));
        if (action === 'whatsapp') return open('https://api.whatsapp.com/send?text=' + encodeURIComponent(post));
        if (action === 'instagram') {
          if (navigator.share) { try { await navigator.share({title, text:post, url:canonical}); } catch (_) {} }
          else await copyText(post, button);
          return;
        }
        if (action === 'share-card') {
          if (!cover) return copyText(canonical, button);
          try {
            const response = await fetch(cover, {mode:'cors'});
            if (!response.ok) throw new Error('image unavailable');
            const blob = await response.blob();
            const file = new File([blob], 'tamayuz10x-card.jpg', {type:blob.type || 'image/jpeg'});
            if (navigator.canShare?.({files:[file]}) && navigator.share) await navigator.share({files:[file],title,text:post});
            else {
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
              setTimeout(() => URL.revokeObjectURL(a.href), 5000);
            }
          } catch (_) { await copyText(canonical, button); }
        }
      }));
      studio.querySelector('.tenx-studio-close').focus();
    };
    studioButton.addEventListener('click', openStudio);
    document.addEventListener('keydown', (event) => { if (!studio) return; if (event.key === 'Escape') closeStudio(); if (event.key === 'Tab') { const focusable = Array.from(studio.querySelectorAll('button,textarea')); const first = focusable[0], last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } });
    const copyButton = box.querySelector('.tenx-copy-link');
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(canonical);
        const original = copyButton.textContent;
        copyButton.textContent = isEnglish ? 'Link Copied' : 'تم نسخ الرابط';
        copyButton.classList.add('is-copied');
        window.setTimeout(() => { copyButton.textContent = original; copyButton.classList.remove('is-copied'); }, 1800);
      } catch (_) { window.prompt(isEnglish ? 'Copy page link:' : 'انسخ رابط الصفحة:', canonical); }
    });
    const nativeButton = box.querySelector('.tenx-native-share');
    if (!navigator.share) nativeButton.remove();
    else nativeButton.addEventListener('click', async () => {
      try { await navigator.share({ title, text: shareText, url: canonical }); } catch (_) {}
    });
  }

  ensureStyle();
  addArticleMetaAndAudio();
  addGlobalShare();
})();
