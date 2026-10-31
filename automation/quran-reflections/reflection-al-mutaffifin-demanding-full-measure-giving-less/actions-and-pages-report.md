# Actions and Pages verification — Al-Mutaffifin reflection

Checked: 2026-10-28 (Asia/Dubai)

## Resolved failures

- Reconciled the already-published Arabic and English page paths into `current_article.repository_publish`; publication was not replayed.
- Registered both publication paths in `data/article-publication-dates.json`.
- Added the reviewed bilingual story-cover record and generated the 1200×630 Arabic and English social cards.
- Added visible publication dates to the Arabic and English collection cards.
- Fixed mobile horizontal overflow caused by long reference URLs.

## Required checks

- Site health QA: success — https://github.com/alaabmt/alaa-excellence/actions/runs/40742136729
- Article date integrity: success — https://github.com/alaabmt/alaa-excellence/actions/runs/40742136785
- Sitemap maintenance: success — https://github.com/alaabmt/alaa-excellence/actions/runs/40742136798
- Social share cards: success — https://github.com/alaabmt/alaa-excellence/actions/runs/40742136707
- Arabic editorial gate and exact bilingual mobile renderer: success — https://github.com/alaabmt/alaa-excellence/actions/runs/40742136885
- Pages deployment including the reflection fix: success — https://github.com/alaabmt/alaa-excellence/actions/runs/40742455891

The exact mobile run passed eight cases: Arabic and English at 320, 375, 390 and 430 px. Assertions covered no horizontal overflow, visible H1, correct `lang`/`dir`, local assets, table safety and Listen-control presence. Artifact: https://github.com/alaabmt/alaa-excellence/actions/runs/40742136885/artifacts/12838898678

## Live destination checks

- Arabic page loaded with the correct title, H1, canonical, reciprocal hreflang, RTL direction, reviewed social image and Listen control.
- English page loaded with the correct title, H1, canonical, LTR direction, 1200 px reviewed cover and Listen control.
- The reflection appears exactly once as a story card in each of the four Arabic/English article and reflection indexes.
- The Arabic and English URLs each appear exactly once in `sitemap.xml`.
- The live deployment contains the mobile wrapping fix.

## Remaining gate

Actual speech playback could not be verified in the available cloud browser because `window.speechSynthesis` is unavailable. Clicking the Arabic Listen control did not enter a playing state. Controls and DOM structure are present, but this is not claimed as real audio playback evidence.
