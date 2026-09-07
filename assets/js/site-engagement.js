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
      .tenx-listen-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tenx-listen-btn,.tenx-stop-btn,.tenx-speed{appearance:none;border:1px solid #d8e1ea;background:#f8fafc;color:#0b2545;border-radius:999px;padding:10px 14px;font:inherit;font-size:.86rem;font-weight:850;cursor:pointer}.tenx-listen-btn{background:#0b2545;color:#fff;border-color:#0b2545}.tenx-listen-btn.is-paused{background:#fff;color:#0b2545}.tenx-listen-btn:disabled,.tenx-stop-btn:disabled{opacity:.48;cursor:not-allowed}.tenx-speed{padding:9px 10px;background:#fff}.tenx-audio-status{width:100%;font-size:.78rem;color:#748397;margin-top:-2px}
      .tenx-share-shell{max-width:1180px;margin:0 auto;padding:0 20px}.tenx-share-box{margin:48px 0 28px;padding:28px;border:1px solid #dfe6ee;border-radius:24px;background:linear-gradient(135deg,#f8fafc,#fff);box-shadow:0 18px 44px rgba(11,37,69,.06)}
      .tenx-share-copy span{display:inline-block;color:#9b7436;font-size:.78rem;font-weight:900;margin-bottom:7px}.tenx-share-copy h2{margin:0;color:#0b2545;font-size:clamp(1.35rem,2.6vw,1.85rem);line-height:1.55}.tenx-share-copy p{margin:8px 0 0!important;color:#657487!important;font-size:.98rem!important;line-height:1.7!important}
      .tenx-share-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.tenx-share-btn{appearance:none;border:1px solid #d8e1ea;background:#fff;color:#0b2545;border-radius:999px;padding:11px 16px;font:inherit;font-size:.9rem;font-weight:850;line-height:1;cursor:pointer;text-decoration:none!important;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}.tenx-share-btn:hover{transform:translateY(-2px);border-color:#9fb1c5;box-shadow:0 8px 18px rgba(11,37,69,.08)}.tenx-share-primary{background:#0b2545;color:#fff!important;border-color:#0b2545}.tenx-share-note{margin-top:13px;color:#7a8798;font-size:.78rem;line-height:1.65}.tenx-share-btn.is-copied{background:#edf7f0;border-color:#b8d9c1;color:#215c34}
      @media(max-width:640px){.tenx-author-audio{align-items:flex-start}.tenx-listen-controls{width:100%}.tenx-listen-btn{flex:1}.tenx-share-box{padding:22px 18px;border-radius:20px}.tenx-share-actions{display:grid;grid-template-columns:1fr 1fr}.tenx-share-btn{text-align:center;padding:13px 10px}.tenx-share-primary{grid-column:1/-1}.tenx-share-shell{padding:0 14px}}
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

  function getReadingText(article) {
    if (!article) return '';
    const clone = article.cloneNode(true);
    clone.querySelectorAll('.refs,.references,.tenx-share-box,.tenx-author-audio,.back,script,style,noscript,nav,button').forEach((el) => el.remove());
    return (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function readingMinutes(text) {
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    return Math.max(1, Math.ceil(words / 180));
  }

  function splitSpeech(text, maxLen = 190) {
    if (!text) return [];
    const sentences = text.split(/(?<=[.!؟؛:])\s+/);
    const chunks = [];
    let current = '';
    sentences.forEach((sentence) => {
      if (!sentence) return;
      if ((current + ' ' + sentence).trim().length <= maxLen) {
        current = (current + ' ' + sentence).trim();
      } else {
        if (current) chunks.push(current);
        if (sentence.length <= maxLen) current = sentence;
        else {
          const words = sentence.split(/\s+/);
          current = '';
          words.forEach((word) => {
            const candidate = (current + ' ' + word).trim();
            if (candidate.length <= maxLen) current = candidate;
            else { if (current) chunks.push(current); current = word; }
          });
        }
      }
    });
    if (current) chunks.push(current);
    return chunks;
  }

  function addArticleMetaAndAudio() {
    if (!isArticlePage || document.querySelector('.tenx-author-audio')) return;
    const article = getArticleContainer();
    if (!article) return;
    const text = getReadingText(article);
    const minutes = readingMinutes(text);
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

    let chunks = [];
    let index = 0;
    let speaking = false;
    let paused = false;
    let chosenVoice = null;
    const pickVoice = () => {
      const voices = synth.getVoices();
      chosenVoice = voices.find((v) => /^ar(-|_)/i.test(v.lang) && /AE|Arabic|العربية/i.test(`${v.lang} ${v.name}`)) || voices.find((v) => /^ar(-|_)/i.test(v.lang)) || null;
    };
    pickVoice();
    if ('onvoiceschanged' in synth) synth.addEventListener('voiceschanged', pickVoice, { once: true });

    const reset = () => {
      speaking = false; paused = false; index = 0;
      play.textContent = 'استمع إلى المقال';
      play.classList.remove('is-paused');
      stop.disabled = true;
      status.textContent = '';
    };

    const speakNext = () => {
      if (!speaking || index >= chunks.length) { reset(); return; }
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = chosenVoice?.lang || 'ar-AE';
      if (chosenVoice) utterance.voice = chosenVoice;
      utterance.rate = Number(speed.value || 1);
      utterance.onend = () => { if (speaking && !paused) { index += 1; speakNext(); } };
      utterance.onerror = () => { status.textContent = 'تعذر تشغيل الصوت على هذا الجهاز.'; reset(); };
      synth.speak(utterance);
      status.textContent = `الاستماع جارٍ · ${speed.options[speed.selectedIndex].text}`;
    };

    play.addEventListener('click', () => {
      if (speaking && !paused) {
        synth.pause(); paused = true; play.textContent = 'متابعة الاستماع'; play.classList.add('is-paused'); status.textContent = 'تم إيقاف القراءة مؤقتاً.'; return;
      }
      if (speaking && paused) {
        synth.resume(); paused = false; play.textContent = 'إيقاف مؤقت'; play.classList.remove('is-paused'); status.textContent = 'الاستماع جارٍ.'; return;
      }
      synth.cancel();
      chunks = splitSpeech(getReadingText(article));
      if (!chunks.length) { status.textContent = 'لا يوجد نص قابل للقراءة.'; return; }
      index = 0; speaking = true; paused = false; stop.disabled = false; play.textContent = 'إيقاف مؤقت';
      speakNext();
    });

    stop.addEventListener('click', () => { synth.cancel(); reset(); });
    speed.addEventListener('change', () => {
      if (!speaking) return;
      synth.cancel(); paused = false; status.textContent = `تم تغيير السرعة إلى ${speed.options[speed.selectedIndex].text}.`;
      window.setTimeout(speakNext, 80);
    });
    window.addEventListener('pagehide', () => synth.cancel(), { once: true });
  }

  function addGlobalShare() {
    if (document.querySelector('.tenx-share-box')) return;
    const encodedUrl = encodeURIComponent(canonical);
    const shareText = `${title} — التميّز 10X`;
    const encodedText = encodeURIComponent(shareText);
    const box = document.createElement('section');
    box.className = 'tenx-share-box';
    box.setAttribute('aria-label', 'مشاركة الصفحة');
    box.innerHTML = `
      <div class="tenx-share-copy"><span>شارك المعرفة</span><h2>وجدت هذه الصفحة مفيدة؟ شاركها مع من قد يستفيد منها.</h2><p>المعرفة تصبح أكثر قيمة عندما تنتقل.</p></div>
      <div class="tenx-share-actions">
        <a class="tenx-share-btn tenx-share-primary" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a class="tenx-share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a class="tenx-share-btn" href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}" target="_blank" rel="noopener noreferrer">X</a>
        <a class="tenx-share-btn" href="https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a class="tenx-share-btn" href="https://t.me/share/url?url=${encodedUrl}&text=${encodedText}" target="_blank" rel="noopener noreferrer">Telegram</a>
        <button class="tenx-share-btn tenx-copy-link" type="button">نسخ الرابط</button>
        <button class="tenx-share-btn tenx-native-share" type="button">مشاركة أخرى</button>
      </div>
      <div class="tenx-share-note">على الهاتف، يتيح «مشاركة أخرى» اختيار التطبيقات المتاحة على جهازك، ومنها Instagram عندما يدعم الجهاز المشاركة إليها.</div>`;

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
        copyButton.textContent = 'تم نسخ الرابط'; copyButton.classList.add('is-copied');
        window.setTimeout(() => { copyButton.textContent = original; copyButton.classList.remove('is-copied'); }, 1800);
      } catch (_) { window.prompt('انسخ رابط الصفحة:', canonical); }
    });
    const nativeButton = box.querySelector('.tenx-native-share');
    if (!navigator.share) nativeButton.remove();
    else nativeButton.addEventListener('click', async () => { try { await navigator.share({ title, text: shareText, url: canonical }); } catch (_) {} });
  }

  ensureStyle();
  addArticleMetaAndAudio();
  addGlobalShare();
})();
