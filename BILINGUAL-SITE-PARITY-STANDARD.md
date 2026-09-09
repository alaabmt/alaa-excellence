# Tamayuz 10X Bilingual Site Parity Standard

**Version:** 1.0 — 10 September 2026

## 1. Governing rule

The Arabic and English editions of Tamayuz 10X are two language versions of the same website, not two independently designed sites.

For every public content page, the two editions must preserve the same:

- page purpose;
- information architecture;
- section order;
- headings hierarchy;
- cards, callouts, tables, metrics, references and media;
- navigation position;
- CTA position and function;
- author block;
- social-sharing components;
- SEO structure and structured-data intent;
- visual layout and responsive behavior.

Only language-dependent text, directionality (`rtl`/`ltr`), typography adjustments required for readability, and language-specific metadata may differ.

## 2. One-to-one page pairing

Every Arabic page must have an English counterpart and every English page must have an Arabic counterpart.

Default mapping:

- Arabic: `/<page>.html`
- English: `/en/<page>.html`
- Arabic homepage: `/`
- English homepage: `/en/`

The language switch must open the counterpart of the current page, never send users to a generic homepage when a paired page exists.

## 3. Translation behavior

When Arabic is the changed or newly uploaded source, create or update the English counterpart.

When English is the changed or newly uploaded source, create or update the Arabic counterpart.

Translation must preserve meaning, evidence, numbers, references, limitations, names, section structure and content order. It must not introduce new topics, omit existing topics, reorganize the page, or redesign the experience.

Arabic output must follow the latest `ARABIC-LANGUAGE-AND-TTS-STANDARD.md`.

English output must follow the current Tamayuz 10X English editorial, translation and human-style standard.

The output should read naturally in the target language while remaining structurally equivalent to the source page.

## 4. Source-of-truth rule

Before any bilingual synchronization run, read the latest `10X_Agent_AI_Master_Operating_Manual_AR.md` and the relevant language standards.

For each page pair, the most recently intentionally changed language version is the source for that synchronization run.

If both language versions were materially changed independently since the last synchronized state, do not overwrite either version automatically. Flag the conflict for human review.

## 5. Protected elements

Do not alter during translation unless explicitly required:

- URLs other than language-counterpart URLs;
- image/video files and their placement;
- CSS classes and component hierarchy;
- JavaScript behavior;
- analytics;
- accessibility semantics;
- citations and reference links;
- numeric values;
- publication dates;
- author identity;
- canonical and hreflang logic except to maintain correct language pairing.

## 6. SEO and language metadata

Each pair must include correct canonical and reciprocal `hreflang` metadata for Arabic and English. `x-default` should follow the site-wide policy in the master manual.

English pages use `lang="en" dir="ltr"` and Arabic pages use `lang="ar" dir="rtl"` unless a page-specific exception is technically necessary.

## 7. Parity gate

A bilingual page pair passes only when:

1. both pages exist;
2. their section sequence matches;
3. the same substantive topics are present;
4. media and components are in equivalent positions;
5. numbers, citations and factual claims match;
6. language switch links are reciprocal and page-specific;
7. canonical/hreflang metadata is correct;
8. target-language prose passes the relevant language editorial standard;
9. responsive behavior remains equivalent;
10. no unrelated site functionality was changed.

## 8. Publication status

Distinguish:

- **Translated:** target-language content created or revised.
- **Synchronized:** page pair passed the parity gate.
- **Technically updated:** repository files changed.
- **Live:** the exact latest deployed commit completed successfully on GitHub Pages.

Never describe content as live before exact-head deployment success is verified.
