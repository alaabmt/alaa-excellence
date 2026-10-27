# Actions and Pages reconciliation — Al-Hujurat reflection

## Result

All required repository and deployment workflows succeeded on the current content lineage, and the Arabic and English pages are live. The stage is **completed**. The exact bilingual rendered mobile-width check passed for this specific reflection.

## Content lineage

- Publication commit: `33c743dfea7fa3c44cf73e5b1902a1d0ec9c2bbd`
- Reconciliation trigger: `cf580cca388ba8f79441dfec4b508450ea830020`
- Sitemap descendant: `1f6e07e49ce2533acd78035a07d1ce19761fbaf2`
- Social-card descendant / deployed content head: `c7b3b6c6fa8aeaca4f83aa2abb9ba7679f0032b3`

## Successful checks

- Site Health QA: [run 40416842011](https://github.com/alaabmt/alaa-excellence/actions/runs/40416842011)
- Maintain sitemap: [run 40416841888](https://github.com/alaabmt/alaa-excellence/actions/runs/40416841888)
- Article date integrity: [run 40416842076](https://github.com/alaabmt/alaa-excellence/actions/runs/40416842076)
- Arabic editorial gate: [run 40416841988](https://github.com/alaabmt/alaa-excellence/actions/runs/40416841988)
- Generate social share cards: [run 40416841929](https://github.com/alaabmt/alaa-excellence/actions/runs/40416841929)
- GitHub Pages on exact content head: [run 40416920989](https://github.com/alaabmt/alaa-excellence/actions/runs/40416920989)

## Live smoke verification

- Arabic and English pages return the intended titles and long-form article bodies.
- Arabic is `rtl`; English is `ltr`.
- Canonical and reciprocal `hreflang` links are correct.
- Listen controls are rendered on both pages.
- Both social cards load at 1200×630.
- The article is visible from all four intended indexes.
- The sitemap contains one Arabic and one English location.

## Exact bilingual mobile evidence

A durable test now reads the current reflection paths from `automation/quran-reflections-state.json` and renders both language pages in Playwright Chromium.

- Test commit: `a13cdad44405a7c2bdc3f3d769b5ec8a8c16d710`
- Arabic editorial workflow: [run 40430113647](https://github.com/alaabmt/alaa-excellence/actions/runs/40430113647)
- Evidence artifact: [artifact 12702275217](https://github.com/alaabmt/alaa-excellence/actions/runs/40430113647/artifacts/12702275217)
- GitHub Pages for the exact test commit: [run 40430114463](https://github.com/alaabmt/alaa-excellence/actions/runs/40430114463)

All eight rendered cases passed: Arabic and English at 320, 375, 390 and 430 pixels. Each case verified no horizontal overflow, visible H1, correct language and direction, successful local asset loads, safe table scrolling and a present listen control.
