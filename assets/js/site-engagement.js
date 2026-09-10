(() => {
  if (window.__tenxEngagementLoaded) return;
  window.__tenxEngagementLoaded = true;

  const AUTHOR_NAME = 'الدكتور علاء محمد أحمد';
  const AUTHOR_URL = 'about.html';
  const AUTHOR_IMAGE = 'assets/images/alaa-mohammad-ahmad-profile-hq.webp';
  const path = window.location.pathname.toLowerCase();
  const isArticlePage = /\/(case-|idea-|article-)/.test(path);
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
    document.head.appendChild(style);
  }

  function formatArabicDate(raw) {
    if (!raw) return '';
    const date = new Date(raw.length === 10 ? `${raw}T12:00:00` : raw);
    if (Number.isNaN(date.getTime())) return raw;
    try { return new Intl.DateTimeFormat('ar-AE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date); }
    catch (_) { return raw; }
  }

  function getArticleContainer() {
    return document.querySelector('.case-article, .article-wrap, .idea-body article, .article-content, main article');
  }

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function getVisibleSpeechText(el) {
    return cleanText(el?.getAttribute?.('data-tenx-speech') || el?.innerText || el?.textContent || '');
  }

  function buildSpeechSegments(article) {
    if (!article) return [];
    const result = [];
    const seen = new Set();
    const add = (el) => {
      if (!el || seen.has(el)) return;
      if (el.closest('.refs,.references,.tenx-share-box,.tenx-author-audio,.tenx-floating-audio,.back,nav,footer')) return;
      const text = getVisibleSpeechText(el);
      if (!text) return;
      seen.add(el);
      result.push({ el, text });
    };

    add(document.querySelector('.case-hero h1, .article-hero h1, .idea-hero h1, main h1'));
    add(document.querySelector('.case-lead, .article-lead, .idea-lead, .article-hero p, .idea-hero p'));

    const selector = 'h2,h3,h4,p,li,blockquote,.plain,.note,.move,.metric,.lens,.use-card,.transfer-card,.reflection';
    article.querySelectorAll(selector).forEach((el) => {
      if (el.matches('.refs *, .references *, .tenx-share-box *, .tenx-author-audio *, .back')) return;
      const nested = Array.from(el.querySelectorAll(selector)).some((child) => child !== el && cleanText(child.textContent));
      if (nested && !el.matches('h2,h3,h4,p,li,blockquote')) return;
      add(el);
    });
    return result;
  }

  function getReadingText(article) {
    return buildSpeechSegments(article).map((s) => s.text).join(' ');
  }

  function readingMinutes(text) {
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    return Math.max(1, Math.ceil(words / 180));
  }

  function addArticleMetaAndAudio() {
    if (!isArticlePage || document.querySelector('.tenx-author-audio')) return;
    const article = getArticleContainer();
    if (!article) return;
    const minutes = readingMinutes(getReadingText(article));
    const published = document.querySelector('meta[property="article:published_time"]')?.content || document.querySelector('time[datetime]')?.getAttribute('datetime') || '';
    const dateLabel = formatArabicDate(published);

    const bar = document.createElement('div');
    bar.className = 'tenx-author-audio';
    bar.innerHTML = `
      <div class="tenx-author-meta">
        <img class="tenx-author-avatar" src="${AUTHOR_IMAGE}" alt="${AUTHOR_NAME}" width="42" height="42" loading="lazy" decoding="async">
        <div class="tenx-author-lines">
          <a href="${AUTHOR_URL}">${AUTHOR_NAME}</a>
          <span class="dot">·</span><span>${minutes} دقائق قراءة</span>
          ${dateLabel ? `<span class="dot">·</span><time datetime="${published}">${dateLabel}</time>` : ''}
        </div>
      </div>
      <div class="tenx-listen-controls" aria-label="الاستماع إلى المقال">
        <button type="button" class="tenx-listen-btn">استمع إلى المقال</button>
        <button type="button" class="tenx-stop-btn" disabled>إيقاف</button>
        <select class="tenx-speed" aria-label="سرعة القراءة">
          <option value="0.85">0.85×</option><option value="1" selected>1×</option><option value="1.15">1.15×</option><option value="1.3">1.3×</option>
        </select>
      </div>
      <div class="tenx-audio-status" aria-live="polite"></div>`;

    const lead = document.querySelector('.case-lead, .article-lead, .idea-lead, .article-hero p, .idea-hero p');
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
      status.textContent = 'ميزة الاستماع غير مدعومة في هذا المتصفح.';
      return;
    }

    const floating = document.createElement('div');
    floating.className = 'tenx-floating-audio';
    floating.setAttribute('role', 'region');
    floating.setAttribute('aria-label', 'التحكم في الاستماع أثناء التمرير');
    floating.innerHTML = `
      <div class="tenx-floating-label">الاستماع إلى المقال</div>
      <button type="button" class="tenx-floating-btn tenx-floating-pause">إيقاف مؤقت</button>
      <button type="button" class="tenx-floating-btn tenx-floating-stop">إيقاف</button>
      <select class="tenx-floating-speed" aria-label="سرعة القراءة أثناء التمرير">
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
      chosenVoice = voices.find((v) => /^ar[-_]AE$/i.test(v.lang)) || voices.find((v) => /^ar[-_]SA$/i.test(v.lang)) || voices.find((v) => /^ar[-_]/i.test(v.lang)) || null;
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
      play.textContent = 'استمع إلى المقال';
      play.classList.remove('is-paused');
      stop.disabled = true;
      floating.classList.remove('is-active');
      floatingPause.textContent = 'إيقاف مؤقت';
      status.textContent = '';
    };

    const speakCurrent = () => {
      if (!speaking || index >= segments.length) { reset(); return; }
      setCurrentHighlight();
      const myToken = runToken;
      const utterance = new SpeechSynthesisUtterance(segments[index].text);
      utterance.lang = chosenVoice?.lang || 'ar-AE';
      if (chosenVoice) utterance.voice = chosenVoice;
      utterance.rate = Number(speed.value || 1);
      utterance.onend = () => {
        if (!speaking || paused || myToken !== runToken) return;
        index += 1;
        speakCurrent();
      };
      utterance.onerror = (event) => {
        if (event?.error === 'canceled' || myToken !== runToken) return;
        status.textContent = 'تعذر تشغيل الصوت على هذا الجهاز.';
        reset();
      };
      synth.speak(utterance);
      status.textContent = `الاستماع جارٍ · ${speed.options[speed.selectedIndex].text}`;
    };

    const pauseResume = () => {
      if (!speaking) return;
      if (!paused) {
        synth.pause();
        paused = true;
        play.textContent = 'متابعة الاستماع';
        play.classList.add('is-paused');
        floatingPause.textContent = 'متابعة';
        status.textContent = 'تم إيقاف القراءة مؤقتاً.';
      } else {
        synth.resume();
        paused = false;
        play.textContent = 'إيقاف مؤقت';
        play.classList.remove('is-paused');
        floatingPause.textContent = 'إيقاف مؤقت';
        status.textContent = 'الاستماع جارٍ.';
      }
    };

    const start = () => {
      synth.cancel();
      runToken += 1;
      segments = buildSpeechSegments(article);
      if (!segments.length) { status.textContent = 'لا يوجد نص قابل للقراءة.'; return; }
      index = 0;
      speaking = true;
      paused = false;
      stop.disabled = false;
      play.textContent = 'إيقاف مؤقت';
      play.classList.remove('is-paused');
      floatingPause.textContent = 'إيقاف مؤقت';
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
        play.textContent = 'متابعة الاستماع';
        floatingPause.textContent = 'متابعة';
        status.textContent = `تم تغيير السرعة إلى ${value}×. استأنف عند الجاهزية.`;
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
    if (document.querySelector('.tenx-share-box')) return;
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