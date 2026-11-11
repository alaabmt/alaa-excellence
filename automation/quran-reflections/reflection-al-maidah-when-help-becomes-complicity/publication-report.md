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

