const siteBase = 'https://tamayuz10x.com/';
const siteLogoAbsolute = `${siteBase}assets/images/file_0000000047188210ac6952e999d2eda7.png`;
const siteLogo = '/assets/images/file_0000000047188210ac6952e999d2eda7.png?v=20260910-logo4';
const siteLogoFallback = '/assets/images/logo-web.jpg?v=20260910-logo4';
const documentLanguage = (document.documentElement.lang || '').toLowerCase();
const isArabicPage = documentLanguage === 'ar' || documentLanguage.startsWith('ar-');
const siteLogoAlt = isArabicPage ? 'شعار التميّز 10X' : 'Tamayuz 10X logo';
const topicAllLabel = isArabicPage ? 'كل الموضوعات' : 'All Topics';
const topicSortLocale = isArabicPage ? 'ar' : 'en';

function applySiteLogo() {
  const mobile = window.matchMedia('(max-width: 600px)').matches;
  const logoWidth = mobile ? 175 : 210;

  document.querySelectorAll('.brand').forEach((brand) => {
    let logo = brand.querySelector('.brand-logo');
    if (!logo) {
      logo = document.createElement('img');
      logo.className = 'brand-logo';
      logo.alt = siteLogoAlt;
      brand.prepend(logo);
    }

    brand.querySelectorAll('.brand-mark, .brand > div').forEach((item) => {
      if (item !== logo) item.style.setProperty('display', 'none', 'important');
    });

    brand.style.setProperty('position', 'static', 'important');
    brand.style.setProperty('display', 'flex', 'important');
    brand.style.setProperty('align-items', 'center', 'important');
    brand.style.setProperty('width', 'auto', 'important');
    brand.style.setProperty('height', 'auto', 'important');
    brand.style.setProperty('min-width', '0', 'important');
    brand.style.setProperty('overflow', 'visible', 'important');
    brand.style.setProperty('flex', '0 1 auto', 'important');

    logo.onerror = () => {
      logo.onerror = null;
      logo.setAttribute('src', siteLogoFallback);
    };
    logo.setAttribute('src', siteLogo);
    logo.setAttribute('alt', siteLogoAlt);
    logo.style.setProperty('content', 'none', 'important');
    logo.style.setProperty('position', 'static', 'important');
    logo.style.setProperty('left', 'auto', 'important');
    logo.style.setProperty('top', 'auto', 'important');
    logo.style.setProperty('transform', 'none', 'important');
    logo.style.setProperty('width', `${logoWidth}px`, 'important');
    logo.style.setProperty('height', 'auto', 'important');
    logo.style.setProperty('max-width', mobile ? '48vw' : '210px', 'important');
    logo.style.setProperty('max-height', 'none', 'important');
    logo.style.setProperty('object-fit', 'contain', 'important');
    logo.style.setProperty('object-position', 'center', 'important');
    logo.style.setProperty('background', 'transparent', 'important');
    logo.style.setProperty('box-shadow', 'none', 'important');
    logo.style.setProperty('border-radius', '0', 'important');
  });

  document.querySelectorAll('img[src*="1788762427725.png"], img[src*="madar-logo"], img[src*="logo-web.jpg"], img[src*="madar-excellence-logo"]').forEach((logo) => {
    logo.onerror = () => {
      logo.onerror = null;
      logo.setAttribute('src', siteLogoFallback);
    };
    logo.setAttribute('src', siteLogo);
    logo.setAttribute('alt', siteLogoAlt);
  });

  document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => {
    meta.setAttribute('content', siteLogoAbsolute);
  });
  document.querySelectorAll('meta[property="og:image:alt"]').forEach((meta) => {
    meta.setAttribute('content', siteLogoAlt);
  });
}

function applyTenXUnifiedModel() {
  if (!isArabicPage) return;
  const philosophy = document.querySelector('.tenx-philosophy');
  const pathways = document.querySelector('.tenx-pathways');
  if (!philosophy) return;

  philosophy.className = 'tenx-system';
  philosophy.setAttribute('aria-labelledby', 'tenx-system-title');
  philosophy.innerHTML = `
    <div class="container">
      <header class="tenx-system-intro">
        <span class="eyebrow">فلسفة التميّز 10X</span>
        <h2 id="tenx-system-title">لا نحسّن الحاضر فقط؛ نعيد تصميم المستقبل ونقرّبه.</h2>
        <p class="tenx-question">ماذا لو لم يكن السؤال: <strong>كيف نصبح أفضل مما نحن عليه اليوم؟</strong><br>بل: <strong>ماذا يمكن أن تصبح عليه مؤسستنا بعد عشر سنوات، وكيف نبدأ بناء ذلك المستقبل من اليوم؟</strong></p>
        <p>من هنا تنطلق <strong>فلسفة التميّز 10X</strong>. هي فلسفة مؤسسية تتجاوز التحسين التدريجي إلى <strong>مضاعفة الممكن</strong>؛ فلا تنطلق من حدود الواقع الحالي، بل من استشراف المستقبل، ورفع سقف الطموح، وإعادة التفكير في القيمة التي يمكن للمؤسسة أن تصنعها.</p>
        <p>ثم تعمل على تقريب ذلك المستقبل من خلال قيادة قادرة على التحول، وإنسان ممكّن، وقدرات متجددة، ونماذج عمل أكثر مرونة، وابتكار أسرع، وذكاء مؤسسي وتقني أعمق؛ وصولاً إلى <strong>قفزات نوعية ومستدامة في القيمة والنتائج والأثر</strong>.</p>
        <blockquote>التميّز 10X يبدأ حين لا نكتفي بتحسين الحاضر، بل نفكر من موقع المستقبل، ونعيد تعريف ما يمكن للمؤسسة أن تصبح عليه، ثم نبني القدرة على الوصول إليه.</blockquote>
      </header>

      <div class="tenx-octet-heading">
        <span class="eyebrow">ثُمانيّة التميّز 10X</span>
        <h3>ثمانية مرتكزات لبناء المؤسسة القادرة على صناعة مستقبلها</h3>
        <p>تحوّل ثُمانيّة التميّز 10X الفلسفة إلى منظومة مؤسسية مترابطة؛ تبدأ من المستقبل الذي تطمح إليه المؤسسة، ثم تعيد تشكيل استراتيجيتها وقيادتها وقدراتها ونموذج عملها وابتكارها وذكائها، لتنتهي بقيمة وأثر يتجاوزان حدود الأداء التقليدي.</p>
      </div>
<div class="tenx-octet-grid">
        <article class="tenx-octet-card"><span class="tenx-num">01</span><div><h4>استشراف المستقبل وصناعة الطموح</h4><strong class="tenx-lead">نرى أبعد من حدود الحاضر.</strong><p>نستشرف التحولات والفرص والسيناريوهات التي يمكن أن تعيد تشكيل المؤسسة وقطاعها، ونبني صورة واضحة لما يمكن أن تصبح عليه خلال السنوات القادمة، ثم نحوّل هذه الصورة إلى <strong>طموح 10X</strong> يرفع سقف الممكن ويوجّه قرارات اليوم.</p><em>لا ننتظر المستقبل؛ نستعد له ونبدأ في صناعته.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">02</span><div><h4>إعادة تعريف القيمة والاتجاه الاستراتيجي</h4><strong class="tenx-lead">نرفع الطموح من تحسين الأداء إلى مضاعفة القيمة.</strong><p>نعيد التفكير في الغاية والاتجاه والأولويات الاستراتيجية، وفي القيمة التي تقدمها المؤسسة لمتعامليها وموظفيها وشركائها ومجتمعها، ونبحث عن الفرص القادرة على إحداث قفزات نوعية بدلاً من الاكتفاء بتحسينات محدودة. ويمتد ذلك إلى بناء الشراكات والمنظومات التي توسّع قدرة المؤسسة على صناعة القيمة والأثر.</p><em>10X يبدأ عندما نعيد تعريف ما يستحق أن نصنعه، ولمن، ولماذا.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">03</span><div><h4>القيادة وثقافة التحول والحوكمة المستقبلية</h4><strong class="tenx-lead">نحوّل الطموح إلى إرادة مؤسسية قادرة على التغيير.</strong><p>نبني قيادة تستشرف وتلهم وتحسم، وثقافة تقوم على الثقة والمساءلة والتعلم والجرأة المحسوبة والتكيف، وحوكمة مرنة تسرّع القرار وتمكّن الابتكار وتحافظ في الوقت نفسه على المسؤولية والشفافية.</p><em>المستقبل يحتاج قيادة تمكّنه، لا أنظمة تعيده إلى الماضي.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">04</span><div><h4>مضاعفة القدرات والتمكين</h4><strong class="tenx-lead">طموح 10X يحتاج قدرة 10X.</strong><p>لا يمكن تحقيق نتائج استثنائية بقدرات صُممت لمتطلبات الأمس. لذلك نستثمر في مضاعفة قدرات الموظفين والقيادات، ونوسّع مساحة القرار والمبادرة، وننمّي المواهب والتعلم والمهارات المستقبلية، في <strong>بيئة عمل داعمة ومحفّزة على التمكين والنمو</strong> تعزز المشاركة والرفاه الوظيفي والثقة والتعاون.</p><em>طموح 10X يحتاج قدرة 10X… وبيئة عمل تطلق هذه القدرة.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">05</span><div><h4>إعادة ابتكار المؤسسة ونموذج عملها</h4><strong class="tenx-lead">لا نحسّن المؤسسة فقط؛ نعيد التفكير في كيفية عملها.</strong><p>نعيد النظر في العمليات والهياكل ونماذج التشغيل والخدمات وتجارب أصحاب المصلحة وطرق اتخاذ القرار والعمل، ونزيل التعقيد والهدر والعوائق التي تحد من السرعة والقيمة، لبناء مؤسسة أبسط وأسرع وأكثر مرونة وجودة وقدرة على التكيف وصناعة القيمة.</p><em>عندما لا يكفي التحسين، يصبح إعادة التصميم ضرورة.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">06</span><div><h4>الابتكار والتجريب لتسريع التحول</h4><strong class="tenx-lead">نختبر أسرع، نتعلم أبكر، ونوسّع ما يصنع الفرق.</strong><p>نحوّل الابتكار من نشاط منفصل إلى قدرة مؤسسية مستمرة؛ نكتشف الفرص، ونطوّر الأفكار، ونختبر الحلول والنماذج الجديدة بسرعة، ونتعلم من النتائج، ثم نوسّع ما يثبت قدرته على صناعة القيمة.</p><em>لا ننتظر الحل المثالي؛ نجرّب، نتعلم، ثم نوسّع الأثر.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">07</span><div><h4>تعظيم الذكاء المؤسسي والتقني</h4><strong class="tenx-lead">نحوّل البيانات والتقنية إلى ذكاء يضاعف القرار والقدرة.</strong><p>نبني مؤسسات تتعلم من بياناتها وتجاربها وتحوّل المعرفة إلى قرارات أفضل، وتستخدم التحليلات والذكاء الاصطناعي والأتمتة والتقنيات الناشئة لتوسيع القدرة البشرية وتسريع الأداء وتحسين التجربة وفتح إمكانات جديدة.</p><em>التقنية ليست هدفاً؛ الذكاء الذي تصنعه هو القيمة.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">08</span><div><h4>تعظيم القيمة والنتائج المستدامة</h4><strong class="tenx-lead">نقيس ما تغيّر فعلاً، لا ما تم تنفيذه فقط.</strong><p>نربط التحول بالنتائج والقيمة والأثر؛ تجربة أفضل، قرارات أسرع، جودة أعلى، كفاءة أكبر، نمو مستدام، قيمة أوسع لأصحاب المصلحة، وأثر يمكن قياسه ومراجعته وتطويره.</p><em>10X لا يكتمل بالنشاط؛ يكتمل عندما يصبح الأثر واضحاً ومستداماً.</em></div></article>
      </div>

      <div class="tenx-final">استشراف المستقبل ← بلورة الطموح ← القيمة ← القيادة ← القدرة ← إعادة الابتكار ← الابتكار ← الذكاء ← النتائج</div>
    </div>
  `;

  if (pathways) pathways.remove();

  if (!document.getElementById('tenx-system-styles')) {
    const style = document.createElement('style');
    style.id = 'tenx-system-styles';
    style.textContent = `
      .tenx-system{padding:86px 0;background:linear-gradient(145deg,#06182b 0%,#0b3155 55%,#123c62 100%);color:#fff;overflow:hidden}
      .tenx-system .eyebrow{color:#9dc8e9}
      .tenx-system-intro{max-width:980px}
      .tenx-system-intro h2{font-size:clamp(2.2rem,5vw,4rem);color:#fff;margin:8px 0 22px;line-height:1.35}
      .tenx-system-intro p{font-size:1.08rem;line-height:2;color:#dce9f4;margin:0 0 16px}
      .tenx-system-intro .tenx-question{font-size:1.22rem;color:#fff;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:18px;padding:22px 24px;margin-bottom:24px}
      .tenx-system-intro blockquote{margin:28px 0 0;padding:22px 24px;border-right:4px solid #e7c86d;background:rgba(255,255,255,.08);border-radius:16px;color:#fff;font-size:1.22rem;font-weight:800;line-height:1.85}
      .tenx-octet-heading{margin:62px 0 26px;max-width:950px}
      .tenx-octet-heading h3{font-size:clamp(1.8rem,4vw,2.8rem);color:#fff;margin:7px 0 12px}
      .tenx-octet-heading p{color:#dce9f4;line-height:1.95;font-size:1.03rem;margin:0}
      .tenx-octet-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
      .tenx-octet-card{display:grid;grid-template-columns:58px 1fr;gap:16px;padding:26px 22px;border-radius:20px;background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(5px)}
      .tenx-num{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;color:#0b3155;font-weight:900;font-size:.95rem;box-shadow:0 8px 20px rgba(0,0,0,.12)}
      .tenx-octet-card h4{font-size:1.28rem;line-height:1.55;color:#fff;margin:2px 0 8px}
      .tenx-lead{display:block;color:#e7c86d;line-height:1.75;margin-bottom:8px;font-size:1rem}
      .tenx-octet-card p{color:#dce9f4;line-height:1.9;margin:0;font-size:.96rem}
      .tenx-octet-card em{display:block;margin-top:13px;padding-top:12px;border-top:1px solid rgba(255,255,255,.14);color:#fff;font-style:normal;font-weight:800;line-height:1.7;font-size:.93rem}
      .tenx-final{margin-top:36px;padding:25px 22px;border-radius:20px;background:#fff;color:#0b3155;text-align:center;font-size:clamp(1.45rem,3vw,2.15rem);font-weight:900;letter-spacing:.01em;box-shadow:0 18px 44px rgba(0,0,0,.18)}
      @media (max-width:900px){.tenx-system{padding:62px 0}.tenx-signature{grid-template-columns:1fr}.tenx-signature-mark{min-height:160px}.tenx-signature-track{grid-template-columns:repeat(4,1fr)}.tenx-octet-grid{grid-template-columns:1fr}}
      @media (max-width:620px){.tenx-system{padding:50px 0}.tenx-system-intro h2{font-size:2.25rem}.tenx-system-intro .tenx-question{padding:18px;font-size:1.05rem}.tenx-signature{padding:15px;border-radius:20px}.tenx-signature-track{grid-template-columns:repeat(2,1fr);gap:9px}.tenx-signature-track span{min-height:68px}.tenx-octet-card{grid-template-columns:46px 1fr;gap:13px;padding:20px 16px}.tenx-num{width:44px;height:44px}.tenx-octet-card h4{font-size:1.15rem}.tenx-final{font-size:1.35rem;padding:22px 14px}}
    `;
    document.head.appendChild(style);
  }
}

function ensureAccountNavStyles() {
  if (document.getElementById('account-nav-styles')) return;
  const style = document.createElement('style');
  style.id = 'account-nav-styles';
  style.textContent = `
    .account-switch{display:flex;align-items:center;flex:0 0 auto}
    .account-switch a{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:5px 12px;border:1px solid #cfd9e4;border-radius:999px;background:#fff;color:#1f467c;font-weight:800;line-height:1.2;white-space:nowrap;transition:background .18s,border-color .18s,color .18s}
    .account-switch a:hover,.account-switch a:focus-visible{background:#eef4fb;border-color:#9fb6d0;color:#173f67;outline:none}
    .account-switch a[data-auth-state="signed-in"]{background:#1f467c;border-color:#1f467c;color:#fff}
    @media(max-width:600px){.topbar-inner{gap:10px}.account-switch a{min-height:32px;padding:5px 10px;font-size:.84rem}.lang-switch{font-size:.84rem}}
  `;
  document.head.appendChild(style);
}

function loadAccountAuthConfig() {
  if (window.TAMAYUZ_AUTH_CONFIG) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="/assets/js/auth-config.js"],script[src*="assets/js/auth-config.js"]');
    if (existing) {
      if (window.TAMAYUZ_AUTH_CONFIG) return resolve();
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = '/assets/js/auth-config.js?v=20260912-accountnav1';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function applyAccountNavigation() {
  const topbar = document.querySelector('.topbar-inner');
  if (!topbar || topbar.querySelector('.account-switch')) return;

  ensureAccountNavStyles();
  const lang = isArabicPage ? 'ar' : 'en';
  const currentPath = `${location.pathname}${location.search}${location.hash}`;
  const labels = isArabicPage
    ? { signIn: 'تسجيل الدخول', account: 'حسابي' }
    : { signIn: 'Sign in', account: 'My account' };

  const wrap = document.createElement('div');
  wrap.className = 'account-switch';
  const link = document.createElement('a');
  link.href = `/account/login.html?lang=${lang}&next=${encodeURIComponent(currentPath)}`;
  link.textContent = labels.signIn;
  link.setAttribute('data-auth-state', 'signed-out');
  link.setAttribute('aria-label', labels.signIn);
  wrap.appendChild(link);

  const languageSwitch = topbar.querySelector('.lang-switch');
  if (languageSwitch) topbar.insertBefore(wrap, languageSwitch);
  else topbar.appendChild(wrap);

  try {
    await loadAccountAuthConfig();
    const { currentSession } = await import('/assets/js/assessment-auth-client.js?v=20260912-accountnav1');
    const { session } = await currentSession();
    if (!session) return;
    link.href = `/account/?lang=${lang}`;
    link.textContent = labels.account;
    link.setAttribute('data-auth-state', 'signed-in');
    link.setAttribute('aria-label', labels.account);
  } catch (error) {
    console.warn('Account navigation status unavailable:', error);
  }
}

applySiteLogo();
// The homepage philosophy is authored statically in index.html/en/index.html; do not replace the Arabic section at runtime.
applyAccountNavigation();
window.addEventListener('resize', applySiteLogo, { passive: true });

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const backToTop = document.createElement('button');
backToTop.type = 'button';
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'العودة إلى أعلى الصفحة');
backToTop.setAttribute('title', 'العودة إلى الأعلى');
backToTop.textContent = '↑';
document.body.appendChild(backToTop);

const updateScrollControls = () => {
  const scrolled = window.scrollY > 260;
  document.body.classList.toggle('is-scrolled', scrolled);
  backToTop.classList.toggle('visible', scrolled);
};
window.addEventListener('scroll', updateScrollControls, { passive: true });
updateScrollControls();
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (nav) nav.classList.remove('open');
});
if (nav) nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const articleGrid = document.getElementById('article-grid');
const articleCards = [...document.querySelectorAll('.article-card[data-category]')];
const searchInput = document.getElementById('article-search');
const topicFilter = document.getElementById('topic-filter');
const dateFilter = document.getElementById('date-filter');
const readFilter = document.getElementById('read-filter');
const sortFilter = document.getElementById('sort-filter');
const clearFiltersButton = document.getElementById('clear-article-filters');
const resultsCount = document.getElementById('article-results-count');
const emptyState = document.getElementById('article-empty-state');
let activeCategory = 'all';

const normalizeText = (value = '') => value.toLocaleLowerCase('ar').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim();
const getCardDate = (card) => {
  const value = card.dataset.date;
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};
const withinDateRange = (card, range) => {
  if (range === 'all') return true;
  const cardDate = getCardDate(card);
  if (!cardDate) return false;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === 'today') return cardDate.toDateString() === now.toDateString();
  if (range === 'week') { start.setDate(start.getDate() - 7); return cardDate >= start && cardDate <= now; }
  if (range === 'month') return cardDate.getFullYear() === now.getFullYear() && cardDate.getMonth() === now.getMonth() && cardDate <= now;
  if (range === '3months') { start.setMonth(start.getMonth() - 3); return cardDate >= start && cardDate <= now; }
  if (range === 'year') return cardDate.getFullYear() === now.getFullYear() && cardDate <= now;
  return true;
};
const matchesReadingTime = (card, range) => {
  if (range === 'all') return true;
  const minutes = Number(card.dataset.readMinutes || 0);
  if (range === 'quick') return minutes > 0 && minutes <= 3;
  if (range === 'medium') return minutes >= 4 && minutes <= 7;
  if (range === 'deep') return minutes >= 8;
  return true;
};
const availableCardsForCategory = () => articleCards.filter((card) => activeCategory === 'all' || (card.dataset.category || '').split(' ').includes(activeCategory));
const populateTopics = () => {
  if (!topicFilter) return;
  const previous = topicFilter.value;
  const topics = [...new Set(availableCardsForCategory().map((card) => card.dataset.topic).filter(Boolean))].sort((a, b) => a.localeCompare(b, topicSortLocale));
  topicFilter.innerHTML = `<option value="all">${topicAllLabel}</option>` + topics.map((topic) => `<option value="${topic}">${topic}</option>`).join('');
  if (topics.includes(previous)) topicFilter.value = previous;
};
const sortCards = () => {
  if (!articleGrid || !sortFilter) return;
  const mode = sortFilter.value;
  [...articleCards].sort((a, b) => {
    if (mode === 'oldest' || mode === 'newest') {
      const aDate = getCardDate(a)?.getTime() || 0;
      const bDate = getCardDate(b)?.getTime() || 0;
      return mode === 'newest' ? bDate - aDate : aDate - bDate;
    }
    if (mode === 'shortest') return Number(a.dataset.readMinutes || 999) - Number(b.dataset.readMinutes || 999);
    return 0;
  }).forEach((card) => articleGrid.appendChild(card));
};
const applyArticleFilters = () => {
  if (!articleCards.length) return;
  const query = normalizeText(searchInput?.value || '');
  const topic = topicFilter?.value || 'all';
  const dateRange = dateFilter?.value || 'all';
  const readRange = readFilter?.value || 'all';
  let visibleCount = 0;
  articleCards.forEach((card) => {
    const inCategory = activeCategory === 'all' || (card.dataset.category || '').split(' ').includes(activeCategory);
    const haystack = normalizeText([card.dataset.search, card.dataset.topic, card.textContent].filter(Boolean).join(' '));
    const matchesQuery = !query || haystack.includes(query);
    const matchesTopic = topic === 'all' || card.dataset.topic === topic;
    const visible = inCategory && matchesQuery && matchesTopic && withinDateRange(card, dateRange) && matchesReadingTime(card, readRange);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  sortCards();
  if (resultsCount) resultsCount.textContent = isArabicPage ? `${visibleCount} نتيجة` : `${visibleCount} result${visibleCount === 1 ? '' : 's'}`;
  if (emptyState) emptyState.hidden = visibleCount !== 0;
};
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((btn) => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
  activeCategory = button.dataset.filter || 'all';
  populateTopics();
  applyArticleFilters();
}));
[searchInput, topicFilter, dateFilter, readFilter, sortFilter].forEach((control) => {
  if (!control) return;
  control.addEventListener(control === searchInput ? 'input' : 'change', applyArticleFilters);
});
if (clearFiltersButton) clearFiltersButton.addEventListener('click', () => {
  activeCategory = 'all';
  filterButtons.forEach((btn) => {
    const selected = (btn.dataset.filter || '') === 'all';
    btn.classList.toggle('active', selected);
    btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
  if (searchInput) searchInput.value = '';
  if (dateFilter) dateFilter.value = 'all';
  if (readFilter) readFilter.value = 'all';
  if (sortFilter) sortFilter.value = 'newest';
  populateTopics();
  if (topicFilter) topicFilter.value = 'all';
  applyArticleFilters();
});
if (articleCards.length) {
  populateTopics();
  applyArticleFilters();
  articleCards.forEach((card) => {
    const primaryLink = card.querySelector('h3 a, .article-action, p a');
    if (!primaryLink) return;
    card.classList.add('article-card-clickable');
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    const openCard = () => { window.location.href = primaryLink.href; };
    card.addEventListener('click', (event) => {
      if (event.target.closest('a,button,input,select,textarea,label')) return;
      openCard();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openCard();
      }
    });
  });
}

const newsletter = document.getElementById('newsletter-form');
if (newsletter) newsletter.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('newsletter-message');
  if (msg) msg.textContent = 'شكراً لك. سيتم تفعيل الاشتراك البريدي قريباً.';
  newsletter.reset();
});

const contact = document.getElementById('contact-form');
if (contact) contact.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('form-message');
  if (msg) msg.textContent = 'تم استلام رسالتك مبدئياً. سيتم ربط النموذج بخدمة الإرسال قريباً.';
  contact.reset();
});
