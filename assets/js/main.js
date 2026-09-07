const siteBase = 'https://tamayuz10x.com/';
const siteLogoAbsolute = `${siteBase}assets/images/file_0000000047188210ac6952e999d2eda7.png`;
const siteLogo = 'assets/images/file_0000000047188210ac6952e999d2eda7.png?v=20260907-logo2';

function applySiteLogo() {
  const mobile = window.matchMedia('(max-width: 600px)').matches;
  const logoWidth = mobile ? 175 : 210;

  document.querySelectorAll('.brand').forEach((brand) => {
    let logo = brand.querySelector('.brand-logo');
    if (!logo) {
      logo = document.createElement('img');
      logo.className = 'brand-logo';
      logo.alt = 'شعار التميّز 10X';
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

    logo.setAttribute('src', siteLogo);
    logo.setAttribute('alt', 'شعار التميّز 10X');
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
    logo.setAttribute('src', siteLogo);
    logo.setAttribute('alt', 'شعار التميّز 10X');
  });

  document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => {
    meta.setAttribute('content', siteLogoAbsolute);
  });
  document.querySelectorAll('meta[property="og:image:alt"]').forEach((meta) => {
    meta.setAttribute('content', 'شعار التميّز 10X');
  });
}

function applyTenXUnifiedModel() {
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
        <blockquote>التميّز 10X لا يعني أن نفعل المزيد بالطريقة نفسها؛ بل أن نعيد التفكير فيما يمكن تحقيقه، وكيف يمكن تحقيقه.</blockquote>
      </header>

      <div class="tenx-octet-heading">
        <span class="eyebrow">ثُمانيّة التميّز 10X</span>
        <h3>ثمانية مرتكزات لبناء المؤسسة القادرة على صناعة مستقبلها</h3>
        <p>تحوّل ثُمانيّة التميّز 10X الفلسفة إلى منظومة مؤسسية مترابطة؛ تبدأ من المستقبل الذي تطمح إليه المؤسسة، ثم تعيد تشكيل استراتيجيتها وقيادتها وقدراتها ونموذج عملها وابتكارها وذكائها، لتنتهي بقيمة وأثر يتجاوزان حدود الأداء التقليدي.</p>
      </div>

      <div class="tenx-signature" aria-label="المسار البصري لثُمانيّة التميّز 10X">
        <div class="tenx-signature-mark"><span>10</span><b>X</b><small>من المستقبل إلى الأثر</small></div>
        <div class="tenx-signature-track">
          <span><b>01</b> المستقبل</span><i>←</i>
          <span><b>02</b> القيمة</span><i>←</i>
          <span><b>03</b> القيادة</span><i>←</i>
          <span><b>04</b> القدرات</span><i>←</i>
          <span><b>05</b> المؤسسة</span><i>←</i>
          <span><b>06</b> الابتكار</span><i>←</i>
          <span><b>07</b> الذكاء</span><i>←</i>
          <span><b>08</b> الأثر</span>
        </div>
      </div>

      <div class="tenx-octet-grid">
        <article class="tenx-octet-card"><span class="tenx-num">01</span><div><h4>استشراف المستقبل وصناعة الطموح</h4><strong class="tenx-lead">نرى أبعد من حدود الحاضر.</strong><p>نستشرف التحولات والفرص والسيناريوهات التي يمكن أن تعيد تشكيل المؤسسة وقطاعها، ونبني صورة واضحة لما يمكن أن تصبح عليه خلال السنوات القادمة، ثم نحوّل هذه الصورة إلى <strong>طموح 10X</strong> يرفع سقف الممكن ويوجّه قرارات اليوم.</p><em>لا ننتظر المستقبل؛ نستعد له ونبدأ في صناعته.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">02</span><div><h4>إعادة تعريف القيمة والاتجاه الاستراتيجي</h4><strong class="tenx-lead">نرفع الطموح من تحسين الأداء إلى مضاعفة القيمة.</strong><p>نعيد التفكير في الغاية والاتجاه والأولويات الاستراتيجية، وفي القيمة التي تقدمها المؤسسة لمتعامليها وموظفيها وشركائها ومجتمعها، ونبحث عن الفرص القادرة على إحداث قفزات نوعية بدلاً من الاكتفاء بتحسينات محدودة. ويمتد ذلك إلى بناء الشراكات والمنظومات التي توسّع قدرة المؤسسة على صناعة القيمة والأثر.</p><em>10X يبدأ عندما نعيد تعريف ما يستحق أن نصنعه، ولمن، ولماذا.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">03</span><div><h4>القيادة وثقافة التحول والحوكمة المستقبلية</h4><strong class="tenx-lead">نحوّل الطموح إلى إرادة مؤسسية قادرة على التغيير.</strong><p>نبني قيادة تستشرف وتلهم وتحسم، وثقافة تقوم على الثقة والمساءلة والتعلم والجرأة المحسوبة والتكيف، وحوكمة مرنة تسرّع القرار وتمكّن الابتكار وتحافظ في الوقت نفسه على المسؤولية والشفافية.</p><em>المستقبل يحتاج قيادة تمكّنه، لا أنظمة تعيده إلى الماضي.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">04</span><div><h4>مضاعفة القدرات والتمكين</h4><strong class="tenx-lead">طموح 10X يحتاج قدرة 10X.</strong><p>لا يمكن تحقيق نتائج استثنائية بقدرات صُممت لمتطلبات الأمس. لذلك نستثمر في مضاعفة قدرات الموظفين والقيادات، ونوسّع مساحة القرار والمبادرة، وننمّي المواهب والتعلم والمهارات المستقبلية، في <strong>بيئة عمل داعمة ومحفّزة على التمكين والنمو</strong> تعزز المشاركة والرفاه الوظيفي والثقة والتعاون.</p><em>طموح 10X يحتاج قدرة 10X… وبيئة عمل تطلق هذه القدرة.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">05</span><div><h4>إعادة ابتكار المؤسسة ونموذج عملها</h4><strong class="tenx-lead">لا نحسّن المؤسسة فقط؛ نعيد التفكير في كيفية عملها.</strong><p>نعيد النظر في العمليات والهياكل ونماذج التشغيل والخدمات وتجارب أصحاب المصلحة وطرق اتخاذ القرار والعمل، ونزيل التعقيد والهدر والعوائق التي تحد من السرعة والقيمة، لبناء مؤسسة أبسط وأسرع وأكثر مرونة وجودة وقدرة على التكيف وصناعة القيمة.</p><em>عندما لا يكفي التحسين، يصبح إعادة التصميم ضرورة.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">06</span><div><h4>الابتكار والتجريب لتسريع التحول</h4><strong class="tenx-lead">نختبر أسرع، نتعلم أبكر، ونوسّع ما يصنع الفرق.</strong><p>نحوّل الابتكار من نشاط منفصل إلى قدرة مؤسسية مستمرة؛ نكتشف الفرص، ونطوّر الأفكار، ونختبر الحلول والنماذج الجديدة بسرعة، ونتعلم من النتائج، ثم نوسّع ما يثبت قدرته على صناعة القيمة.</p><em>لا ننتظر الحل المثالي؛ نجرّب، نتعلم، ثم نوسّع الأثر.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">07</span><div><h4>تعظيم الذكاء المؤسسي والتقني</h4><strong class="tenx-lead">نجعل المؤسسة أقدر على الفهم والتنبؤ والقرار والتنفيذ.</strong><p>نحوّل البيانات إلى معرفة، والمعرفة إلى قرار، والقرار إلى فعل؛ ونوظف التحول الرقمي والأتمتة والذكاء الاصطناعي و<strong>Agentic AI</strong> لتعزيز قدرات الإنسان والمؤسسة وإعادة تصور الخدمات والعمليات وطرق العمل.</p><em>التقنية ليست غاية 10X؛ بل قوة تضاعف ذكاء المؤسسة وقدرتها.</em></div></article>

        <article class="tenx-octet-card"><span class="tenx-num">08</span><div><h4>مضاعفة القيمة والأثر المستدام</h4><strong class="tenx-lead">ما لا يتحول إلى قيمة وأثر ليس 10X.</strong><p>نقيس النجاح بما أحدثته المؤسسة من تحول حقيقي: في النتائج والأداء، وتجربة أصحاب المصلحة، وقدرات الموظفين، والكفاءة والابتكار، والقيمة الاقتصادية والاجتماعية، والاستدامة. ولا نتوقف عند تحقيق النتائج؛ بل نبني القدرة على التعلم منها والمحافظة عليها ومضاعفتها عبر الزمن.</p><em>10X لا يُقاس بعدد المبادرات، بل بحجم القيمة والأثر الذي يبقى بعدها.</em></div></article>
      </div>

      <div class="tenx-final">8 مرتكزات. فلسفة واحدة. طموح 10X.</div>
    </div>`;

  if (pathways) pathways.remove();

  if (!document.getElementById('tenx-unified-style')) {
    const style = document.createElement('style');
    style.id = 'tenx-unified-style';
    style.textContent = `
      .tenx-system{padding:82px 0;background:linear-gradient(145deg,#07192d 0%,#0b3155 48%,#102943 100%);color:#fff;overflow:hidden;position:relative}
      .tenx-system:before{content:'10X';position:absolute;left:-2vw;top:80px;font-size:min(25vw,320px);font-weight:900;line-height:1;color:rgba(255,255,255,.025);letter-spacing:-.08em;pointer-events:none}
      .tenx-system .eyebrow{color:#9dc8e9;font-weight:800;letter-spacing:.03em}
      .tenx-system-intro{max-width:980px;position:relative;z-index:1}
      .tenx-system-intro h2{font-size:clamp(2.25rem,5vw,4rem);line-height:1.35;margin:10px 0 24px;color:#fff;max-width:900px}
      .tenx-system-intro p{font-size:1.08rem;line-height:2;color:#dce9f4;margin:0 0 16px}
      .tenx-system-intro .tenx-question{font-size:clamp(1.12rem,2.1vw,1.4rem);color:#fff;padding:20px 24px;border-right:4px solid #e7c86d;background:rgba(255,255,255,.06);border-radius:16px;margin:26px 0}
      .tenx-system-intro blockquote{margin:30px 0 0;padding:22px 26px;border:1px solid rgba(255,255,255,.18);border-radius:18px;background:rgba(255,255,255,.07);font-size:clamp(1.15rem,2.4vw,1.45rem);font-weight:800;line-height:1.9;color:#fff}
      .tenx-octet-heading{max-width:900px;margin:68px 0 26px}
      .tenx-octet-heading h3{font-size:clamp(1.9rem,4vw,3rem);line-height:1.4;color:#fff;margin:8px 0 14px}
      .tenx-octet-heading p{color:#dce9f4;line-height:1.95;font-size:1.05rem;margin:0}
      .tenx-signature{display:grid;grid-template-columns:220px 1fr;gap:24px;align-items:stretch;margin:34px 0 36px;padding:24px;border:1px solid rgba(255,255,255,.18);border-radius:26px;background:rgba(255,255,255,.055);box-shadow:0 22px 60px rgba(0,0,0,.16)}
      .tenx-signature-mark{min-height:190px;border-radius:20px;background:#fff;color:#0b3155;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
      .tenx-signature-mark span{font-size:5.6rem;font-weight:900;letter-spacing:-.11em;line-height:1}
      .tenx-signature-mark b{font-size:5.8rem;font-weight:900;line-height:1;margin-right:4px}
      .tenx-signature-mark small{position:absolute;bottom:17px;right:18px;left:18px;text-align:center;font-weight:800;font-size:.82rem;letter-spacing:.02em}
      .tenx-signature-track{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;align-content:center;direction:rtl}
      .tenx-signature-track span{min-height:74px;padding:13px 12px;border-radius:16px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.16);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-weight:800;color:#fff;line-height:1.45}
      .tenx-signature-track span b{display:block;color:#e7c86d;font-size:.78rem;margin-bottom:4px;letter-spacing:.08em}
      .tenx-signature-track i{display:none}
      .tenx-octet-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
      .tenx-octet-card{display:grid;grid-template-columns:58px 1fr;gap:18px;padding:25px 24px;border-radius:22px;background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.17);backdrop-filter:blur(6px);transition:transform .2s ease,border-color .2s ease,background .2s ease}
      .tenx-octet-card:hover{transform:translateY(-3px);border-color:rgba(231,200,109,.55);background:rgba(255,255,255,.1)}
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

applySiteLogo();
applyTenXUnifiedModel();
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
  const topics = [...new Set(availableCardsForCategory().map((card) => card.dataset.topic).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ar'));
  topicFilter.innerHTML = '<option value="all">كل الموضوعات</option>' + topics.map((topic) => `<option value="${topic}">${topic}</option>`).join('');
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
  const readingRange = readFilter?.value || 'all';
  let visibleCount = 0;
  articleCards.forEach((card) => {
    const categories = (card.dataset.category || '').split(' ');
    const show = (activeCategory === 'all' || categories.includes(activeCategory))
      && (topic === 'all' || card.dataset.topic === topic)
      && (!query || normalizeText(card.textContent).includes(query))
      && withinDateRange(card, dateRange)
      && matchesReadingTime(card, readingRange);
    card.hidden = !show;
    if (show) visibleCount += 1;
  });
  sortCards();
  if (resultsCount) resultsCount.textContent = visibleCount === 1 ? 'مقال واحد' : `${visibleCount} مقالات`;
  if (emptyState) emptyState.hidden = visibleCount !== 0;
};

if (filterButtons.length && articleCards.length) {
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.filter || 'all';
    filterButtons.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    populateTopics();
    applyArticleFilters();
  }));
}
[searchInput, topicFilter, dateFilter, readFilter, sortFilter].forEach((control) => {
  if (control) control.addEventListener(control === searchInput ? 'input' : 'change', applyArticleFilters);
});
if (clearFiltersButton) clearFiltersButton.addEventListener('click', () => {
  activeCategory = 'all';
  filterButtons.forEach((button) => {
    const isAll = button.dataset.filter === 'all';
    button.classList.toggle('active', isAll);
    button.setAttribute('aria-pressed', isAll ? 'true' : 'false');
  });
  if (searchInput) searchInput.value = '';
  if (dateFilter) dateFilter.value = 'all';
  if (readFilter) readFilter.value = 'all';
  if (sortFilter) sortFilter.value = 'newest';
  populateTopics();
  if (topicFilter) topicFilter.value = 'all';
  applyArticleFilters();
});
populateTopics();
applyArticleFilters();

document.querySelectorAll('.article-card[data-href]').forEach((card) => {
  const href = card.dataset.href;
  if (!href || href === '#') return;
  card.classList.add('article-card-clickable');
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'link');
  const go = () => { window.location.href = href; };
  card.addEventListener('click', (event) => { if (!event.target.closest('a,button')) go(); });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go(); }
  });
});