# Tamayuz 10X — Editorial SEO and Article Taxonomy Audit
**Date:** 2026-10-13
**Repository:** `alaabmt/alaa-excellence` · `main` · `https://tamayuz10x.com/`
**Scope:** Source-based audit of public article/case/idea/reflection inventory, Arabic/English Quranic reflection collections, navigation, metadata, publication-date governance, and code paths for listening. Not a live browser/Google Search Console report or independent source-by-source factual verification.

## Requirements of the original operating plan
Checked against `AGENTS.md`, `10X_Agent_AI_Master_Operating_Manual_AR.md`, `BILINGUAL-SITE-PARITY-STANDARD.md`, `editorial-policy-disclaimer.html` and the publishing QA scripts.

Applicable standards include:
- Published article categories and article cards must reflect the actual article and its evidence; article cards promise a useful idea, not a dump of headings.
- Each indexable content page needs a grounded title, description, canonical, social sharing tags, Article and breadcrumb schema where appropriate.
- Arabic/English pairs must preserve substantive claims, with page-specific reciprocal language links; English must be idiomatic rather than literal translation.
- Immutable `datePublished` must reflect the actual first public date; `dateModified` is independent. The registry, card date, HTML metadata and schema must agree.
- Each article's listening begins at its H1, follows the opening and main text, highlights the spoken section, and provides accessible floating pause/resume/stop/speed controls. Sources and sharing controls must not be spoken.
- Religious reflection remains a contemporary application informed by recognized tafsir; do not attribute modern management concepts to scripture.

## Confirmed findings
| Item | Before | After source changes |
|---|---:|---:|
| Arabic content pages `case-*`, `article-*`, `idea-*`, `reflection-*` | 55 | 55 |
| English content pages | 54 | 54 |
| Arabic article-index cards | 53 | 53 |
| English article-index cards | 52 | 52 |
| Arabic reflection cards in dedicated category page | 3 | 9 |
| English reflection cards in dedicated category page | 3 | 8 |
| Reflection pages without `Article` and `BreadcrumbList` schemas **among indexed reflection cards** | 13 | 0 (4 already had both) |

### Additional issues found
1. `reflection-hoopoe-how-do-we-know.html` and `en/reflection-hoopoe-how-do-we-know.html` are currently indexable and listed in the sitemap, but neither appears in the main article index or the dedicated reflection collection. **Publication/category ownership must be decided before listing or changing indexability**; no date is recorded in the publication registry.
2. `reflection-ibrahim-building-before-ready.html` appears in the Arabic index, but its English article counterpart does not exist. The language switch previously could direct readers to an unrelated Yusuf article.
3. Several reflection pages used a shared JavaScript header that defaulted to linking to Yusuf rather than the current reflection; the Qur’anic category navigation also led to the generic article index.
4. Newly published pieces `case-ega-al-taweelah-recycling-10x.html`, `case-siemens-masdar-sustainable-construction.html`, `reflection-sulayman-rethinking-possible.html`, and `reflection-ibrahim-building-before-ready.html` lack entries in `data/article-publication-dates.json`. Their visible card dates must be independently confirmed as first-publication dates before registration. Article schema was added without inventing absent dates.
5. One date-registry identifier lacked `.html` (LA General case). The key was corrected while preserving its stored date (`2026-10-01`).
6. Source files previously lacked JSON-LD Article/Breadcrumb metadata on 13 indexed reflections. Those schemas were added using current H1, meta description, canonical URL, image, and official identity. No novel factual claims were introduced.
7. The shared listening script formerly recognized `case-`, `idea-`, and `article-`, but not `reflection-`. The reflection shell was updated to load shared listening controls when absent, and the shared script now recognizes reflections. Source-only syntax checks passed, **but full play/pause/highlight/floating-bar functionality remains unverified in a real browser**.

## Changes committed
- Rebuilt `quranic-reflections.html` (3 → 9 article cards) and `en/quranic-reflections.html` (3 → 8 cards) from the already-published language-specific article indexes. Kept existing card titles, teasers, images, categories and dates.
- Updated `assets/js/quranic-reflection-page.js` to link language-switches to the correct article slug, omit the false English switch for Ibrahim, link category navigation to the dedicated category page, and load shared article listening controls.
- Updated `assets/js/site-engagement.js` to recognize reflection pages, begin reading with H1 and opening text, avoid duplicate quotation readouts, exclude the article's trailing references/disclaimers in reflection audio, and avoid a duplicate share area where a bespoke one already exists.
- Added `Article` and `BreadcrumbList` JSON-LD to 13 indexed reflection pages that lacked it. Four other indexed reflection pages already contained both.
- Fixed the malformed `case-la-general-safer-at-home-acute-virtual-care.html` registry key with date unchanged.
- Added `scripts/check_editorial_collections.py` and a corresponding invocation in `.github/workflows/site-health-qa.yml` to detect future missing/mismatched reflection cards and warn about unverified publication dates, orphaned indexable reflection pages and missing translations.

## Validation completed
- Compared article index vs reflection collection lists in both languages, including card IDs, dates, titles and reading durations before applying updates.
- Confirmed that each of the nine indexed Arabic reflection card titles matched its article H1.
- Parsed newly created JSON-LD as valid JSON prior to writing, using only existing metadata as source.
- Read back shared JavaScript and verified syntactic compilation using a JavaScript parser.
- All modifications were committed to `main` through the connected GitHub account.

## Remaining gates: not yet verified
- GitHub Pages deployment of the **exact newest commit SHA**, source maps/cache freshness, and real mobile/desktop behavior.
- Real Arabic/English speech synthesis quality, TTS highlighting, floating controls, correct exclusions and custom sharing behavior.
- True Search Console indexing, impressions, CTR and live Core Web Vitals/PageSpeed.
- Expert theological/editorial validation of religious articles, references and factual claims, and an equivalent evidence-pack review of organizational case studies across the entire catalog.
- Missing publication registry dates and release decision for the Hoopoe reflection.
- The original general article-date checker `scripts/check_article_dates.py` has an attribute-order-sensitive card regex; replacing it with a robust parser should wait until the unverified publication-date gaps are resolved so that CI does not make unsupported assumptions.

## Next editorial decisions
1. Confirm the four missing registry publication dates from GitHub publication history or contemporaneous deployment records (not from card display alone).
2. Decide whether the Hoopoe reflection is publicly published or should remain held for review. If published, add to both indexes and collections with verified publication date and complete schemas; if not, use a deliberate editorial hold without silently changing published URLs.
3. Commission/approve an English edition of Ibrahim, or explicitly document the Arabic-only editorial policy.
4. Perform article-level evidence verification for factual changes; label each discrepancy as **fact**, **interpretation**, **missing source**, **category drift**, **title drift**, **bilingual mismatch**, or **SEO metadata**. Do not automatically rewrite historical, religious, scientific or numerical claims for SEO.
5. Complete browser-based audio and page-layout QA, review CI results, then run Search Console URL inspections and indexing reports.

**Status:** GitHub source updated. Production deployment and external metrics are not independently confirmed in this audit.
