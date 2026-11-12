# Repository publication report — Al-Ahzab 33:70–71

## Article

- Arabic title: **كيف يكون القول سديدًا حين يصعب الاعتراف بالخطأ؟**
- English title: **What Makes Speech Upright When Admitting Error Is Hard?**
- Publication date: 2026-11-12 (Asia/Dubai)
- Slug: `reflection-al-ahzab-upright-speech`
- Final editorial quality gate: **99/100 — PASS**

## Duplicate and destination reconciliation

Immediately before the public write, the workflow reconciled the committed checkpoint, latest `main`, topic and publication-date registries, both intended page paths, all four indexes, sitemap, cover registry, social source assets, and both expected live URLs. Neither repository target path existed, the slug was absent from the registries and indexes, and both expected live URLs returned 404. No duplicate publication was found.

## Atomic repository publication

Publication commit: `08da90922b404045be54eebadfb9fb95a98c8284`

Automation descendants reconciled: `58ac632dfaaa96bafd15b00b1e1d76a30cfca1a3` and `6b6d7f9b63af9483cbeec61eff0a66d5fab92cd0` (sitemap normalization, generated bilingual JPG cards, and metadata synchronization).

Committed artifacts:

- `reflection-al-ahzab-upright-speech.html`
- `en/reflection-al-ahzab-upright-speech.html`
- `assets/previews/story/reflection-al-ahzab-upright-speech-ar.svg`
- `assets/previews/story/reflection-al-ahzab-upright-speech-en.svg`
- `articles.html`
- `en/articles.html`
- `quranic-reflections.html`
- `en/quranic-reflections.html`
- `data/quranic-reflection-topics.json`
- `data/article-publication-dates.json`
- `data/article-covers.json`
- `sitemap.xml`

## Repository validation

- Both language pages exist with reciprocal canonical and `hreflang` metadata.
- Arabic and English titles match their H1 and metadata.
- Article and BreadcrumbList structured data remain present.
- Arabic uses `lang="ar" dir="rtl"`; English uses `lang="en" dir="ltr"`.
- Arabic keeps the normalized listening script; English does not load the Arabic-only script.
- Each of the four indexes contains exactly one new card.
- Topic registry has one article object; date registry has one entry per language.
- Sitemap has one Arabic and one English URL.
- SVG social sources and cover-registry metadata are present for both languages.

## Pending verification

Repository publication is complete, but this is not a live-success declaration. The next stage must reconcile any automation-generated descendant commits, inspect Actions on the exact latest content head, verify the generated JPG cards, run the exact mobile/RTL checks, wait for Pages success, inspect both live pages and all four live indexes, and test actual TTS playback where the environment supports Web Speech.
