(() => {
  const article = document.querySelector('.case-article, .article-wrap, .idea-body article');
  if (!article || document.querySelector('.tenx-share-box')) return;

  const path = window.location.pathname.toLowerCase();
  const isArticlePage = path.includes('/case-') || path.includes('/idea-') || path.includes('/article-');
  if (!isArticlePage) return;

  const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href.split('#')[0];
  const title = document.querySelector('meta[property="og:title"]')?.content || document.title;
  const shareText = `${title} — التميّز 10X`;
  const encodedUrl = encodeURIComponent(canonical);
  const encodedText = encodeURIComponent(shareText);

  const box = document.createElement('section');
  box.className = 'tenx-share-box';
  box.setAttribute('aria-label', 'مشاركة المقال');
  box.innerHTML = `
    <div class="tenx-share-copy">
      <span>شارك الفكرة</span>
      <h2>وجدت الفكرة مفيدة؟ شاركها مع من قد يستفيد منها.</h2>
      <p>المعرفة تصبح أكثر قيمة عندما تنتقل.</p>
    </div>
    <div class="tenx-share-actions">
      <a class="tenx-share-btn tenx-share-primary" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="شارك على LinkedIn">LinkedIn</a>
      <a class="tenx-share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="شارك على Facebook">Facebook</a>
      <a class="tenx-share-btn" href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}" target="_blank" rel="noopener noreferrer" aria-label="شارك على X">X</a>
      <a class="tenx-share-btn" href="https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="شارك عبر WhatsApp">WhatsApp</a>
      <button class="tenx-share-btn tenx-copy-link" type="button" aria-label="نسخ رابط المقال">نسخ الرابط</button>
      <button class="tenx-share-btn tenx-native-share" type="button" aria-label="مشاركة عبر تطبيقات الهاتف">مشاركة أخرى</button>
    </div>
    <div class="tenx-share-note">على الهاتف، يتيح زر «مشاركة أخرى» اختيار التطبيقات المتاحة على جهازك، ومنها Instagram عندما يدعم الجهاز المشاركة إليها.</div>
  `;

  const refs = article.querySelector('.refs');
  const back = article.querySelector('.back');
  if (refs) refs.insertAdjacentElement('beforebegin', box);
  else if (back) back.insertAdjacentElement('beforebegin', box);
  else article.appendChild(box);

  const style = document.createElement('style');
  style.id = 'tenx-share-style';
  style.textContent = `
    .tenx-share-box{margin:48px 0 28px;padding:28px;border:1px solid #dfe6ee;border-radius:24px;background:linear-gradient(135deg,#f8fafc,#fff);box-shadow:0 18px 44px rgba(11,37,69,.06)}
    .tenx-share-copy span{display:inline-block;color:#9b7436;font-size:.78rem;font-weight:900;margin-bottom:7px}.tenx-share-copy h2{margin:0;color:#0b2545;font-size:clamp(1.35rem,2.6vw,1.85rem);line-height:1.55}.tenx-share-copy p{margin:8px 0 0!important;color:#657487!important;font-size:.98rem!important;line-height:1.7!important}
    .tenx-share-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.tenx-share-btn{appearance:none;border:1px solid #d8e1ea;background:#fff;color:#0b2545;border-radius:999px;padding:11px 16px;font:inherit;font-size:.9rem;font-weight:850;line-height:1;cursor:pointer;text-decoration:none!important;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}.tenx-share-btn:hover{transform:translateY(-2px);border-color:#9fb1c5;box-shadow:0 8px 18px rgba(11,37,69,.08)}.tenx-share-primary{background:#0b2545;color:#fff!important;border-color:#0b2545}.tenx-share-note{margin-top:13px;color:#7a8798;font-size:.78rem;line-height:1.65}.tenx-share-btn.is-copied{background:#edf7f0;border-color:#b8d9c1;color:#215c34}
    @media(max-width:560px){.tenx-share-box{padding:22px 18px;border-radius:20px}.tenx-share-actions{display:grid;grid-template-columns:1fr 1fr}.tenx-share-btn{text-align:center;padding:13px 10px}.tenx-share-primary{grid-column:1/-1}}
  `;
  document.head.appendChild(style);

  const copyButton = box.querySelector('.tenx-copy-link');
  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(canonical);
      const original = copyButton.textContent;
      copyButton.textContent = 'تم نسخ الرابط';
      copyButton.classList.add('is-copied');
      window.setTimeout(() => {
        copyButton.textContent = original;
        copyButton.classList.remove('is-copied');
      }, 1800);
    } catch (_) {
      window.prompt('انسخ رابط المقال:', canonical);
    }
  });

  const nativeButton = box.querySelector('.tenx-native-share');
  if (!navigator.share) nativeButton?.remove();
  nativeButton?.addEventListener('click', async () => {
    try { await navigator.share({ title, text: shareText, url: canonical }); } catch (_) {}
  });
})();
