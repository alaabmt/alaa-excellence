# Repository publication report — Al-Ma’idah 5:2

## Article

- Arabic title: **متى تتحول المساعدة إلى مشاركة في الخطأ؟**
- English title: **When Does Helping Become Participation in Wrongdoing?**
- Publication date: 2026-11-11 (Asia/Dubai)
- Slug: `reflection-al-maidah-when-help-becomes-complicity`
- Final editorial quality gate: **98/100 — PASS**

## Duplicate and destination reconciliation

Checked immediately before public writes:

- `automation/quran-reflections-state.json`
- `data/quranic-reflection-topics.json`
- `data/article-publication-dates.json`
- intended Arabic and English page paths
- Arabic and English Qur’anic-reflection hubs
- Arabic and English article indexes
- `sitemap.xml`
- recent GitHub commits
- expected Arabic and English live URLs

No repository page, topic record, publication-date record or index entry existed for the slug before publication. Public search returned no matching page. A live-browser request did not expose article content. No duplicate article was created.

## Repository artifacts committed

- Arabic page: `reflection-al-maidah-when-help-becomes-complicity.html`
- English page: `en/reflection-al-maidah-when-help-becomes-complicity.html`
- Arabic social/cover asset: `assets/previews/story/reflection-al-maidah-when-help-becomes-complicity-ar.svg`
- English social/cover asset: `assets/previews/story/reflection-al-maidah-when-help-becomes-complicity-en.svg`
- Updated hubs: `quranic-reflections.html`, `en/quranic-reflections.html`
- Updated indexes: `articles.html`, `en/articles.html`
- Updated registries: `data/quranic-reflection-topics.json`, `data/article-publication-dates.json`
- Sitemap: updated automatically from page canonicals and Git dates

## Commit trail

- Arabic cover: `831a260d7fccacefbbd63d4043bfd78ff20061e5`
- English cover: `7af064469f9cb23e1bdf5a933a1096502c3c1643`
- Arabic page: `289b9bd997347ac4db54dd1d82cb0126c7c4979c`
- English page: `f304a0b60ba30468b49aad12e1d32aeee5d48b75`
- Arabic hub: `ebfd1a637f43fff3817ef55f9f3790e54f91c0cb`
- English hub: `508e75b4af5a2056fffee1c46971be4b9d7de036`
- Arabic articles index: `f8cb5f2327376508972599e950d5dd8f5c2b689e`
- English articles index: `1efef4df26cbd53ee888a29e79fb0c83f229ee09`
- Topic registry: `f69d447da099dd341cf6b3f776f54d705f20ec51`
- Publication-date registry: `9cfcf1fb8fa9e963e7c08a16cff1d57294e88ad4`
- Automatic sitemap update: `c0bfcc0bdb487669a3000f6cd388f554f9da5a5b`
- Reconciliation checkpoint: `28b36c4b4b38b41ed8913cfb28cc3f068bb59d91`

## Repository validation

- Both pages exist with reciprocal canonical and `hreflang` metadata.
- Titles match H1, document title, Open Graph, Twitter and Article schema.
- Article and BreadcrumbList structured data are present.
- Publication dates match in both languages and the date registry.
- Verse, context, four tafsir sources and methodological boundaries remain present.
- Arabic page loads the Arabic TTS normalization script and global engagement script.
- English page loads the global engagement script.
- Each hub and article index contains one card for the slug.
- Topic registry contains one article record; date registry contains one entry per language.
- Sitemap contains exactly the two language URLs.

## Pending verification

Repository publication is technically complete, but this is not yet a live-success declaration. The next stage must:

1. run or inspect GitHub Actions on the exact latest head;
2. render both pages at narrow widths and verify Arabic RTL and mixed-direction links;
3. test listening controls, title-first reading, highlighting and floating controls where the environment supports Web Speech;
4. verify social assets and metadata;
5. wait for GitHub Pages success on the exact final head;
6. inspect both live pages and all four live index entries.



## التحقق من Actions وPages والوجهة الحية — 2026-11-11

- تم إصلاح توافق مخطط الحالة مع فاحص الهاتف الحالي بإضافة `current_article.repository_publish` كمرآة لمسارات النشر، من دون إعادة نشر المحتوى أو الفهارس.
- نجحت بوابة التحرير العربية على الرأس `c12e32923ccf30f040d1e4a6fd713f3b5a83ac15`: [التشغيل 43083480059](https://github.com/alaabmt/alaa-excellence/actions/runs/43083480059)، المهمة `130741758808`.
- نجحت فحوص الهاتف الفعلية في Chromium للصفحتين العربية والإنجليزية عند العروض 320 و375 و390 و430 بكسل (8/8): لا تجاوز أفقي، H1 ظاهر، `lang/dir` صحيحان، الأصول المحلية تعمل، الجداول قابلة للتمرير، وعنصر الاستماع موجود.
- نجح نشر Pages للرأس نفسه: [التشغيل 43083478967](https://github.com/alaabmt/alaa-excellence/actions/runs/43083478967).
- تحققت الصفحتان الحيتان: العربية `ar/rtl` والإنجليزية `en/ltr`، مع canonical وhreflang المتبادلين وبيانات المشاركة وArticle/BreadcrumbList وصورة المؤلف وصندوق مشاركة واحد.
- ظهرت المادة في الفهارس الأربعة؛ كل فهرس يحوي رابطين إلى مسار المادة ضمن البطاقة، ويحوي sitemap عنواني العربية والإنجليزية مرة لكل منهما (مجموع ظهور slug: 2).
- تحققت أصول المشاركة العربية والإنجليزية الحية بصيغة SVG وبالعنوان الصحيح.
- **بوابة الاستماع الفعلية محجوبة:** متصفح التحقق الحالي لا يوفر `window.speechSynthesis`، لذلك لم يمكن إثبات التشغيل الفعلي، قراءة العنوان أولًا، التمييز المتزامن، عناصر التحكم العائمة، الإيقاف/الاستئناف، أو السرعة. وجود عنصر الاستماع اجتاز فحص CI، لكنه لا يفي وحده بمعيار التشغيل الفعلي.

### الإجراء التالي

اختبار الصفحتين الحيتين في متصفح/جهاز يوفّر Web Speech، والتحقق من التشغيل الفعلي باللغتين (العنوان أولًا، التمييز المتزامن، عناصر التحكم العائمة، إيقاف/استئناف/إيقاف نهائي/سرعة). إذا تعذر توفيره، يلزم قرار صريح بقبول فحص البنية وCI بدل اختبار التشغيل الفعلي لهذه الدورة.
