# Costa Rica PES — Final publication and mobile verification report

- Case: case-costa-rica-payments-for-environmental-services
- Original publication date: 2026-10-29 (Asia/Dubai)
- Final mobile recovery verification: 2026-11-07
- Publication decision: Already published; no duplicate publication.
- Original publication commit: bc45e74e5e577e76a3218cc08e7263241d07acab
- Final content and social cards commit: db48cd5ad5829d4ed90a4ccf657951677c9996a6
- Arabic URL: https://tamayuz10x.com/case-costa-rica-payments-for-environmental-services.html
- English URL: https://tamayuz10x.com/en/case-costa-rica-payments-for-environmental-services.html

## Editorial and evidence gates
- Evidence Pack: passed with explicit causal, equity and additionality limitations.
- Company Insider Critique: passed after four required revisions.
- Final Quality Gate: 96/100; bilingual parity and editorial review passed.
- All prior publication and metadata checks were already recorded as passed in the checkpoint; this recovery does not replay publication.

## Actual 390px mobile browser test
On 2026-11-07, launched Playwright headless Chromium in an internet-connected hosted Linux browser, with **viewport width 390, height 844, deviceScaleFactor 1, isMobile true, hasTouch true**, and loaded both public URLs, HTTP 200. Full-page browser screenshots were captured during the test (Arabic 390×16252 pixels, English 390×17915 pixels); the screenshots were not committed to the repository.

| Test | Arabic | English |
| --- | --- | --- |
| HTTP status | 200 | 200 |
| innerWidth / clientWidth / scrollWidth | 390 / 390 / 390 | 390 / 390 / 390 |
| document direction / language | rtl / ar | ltr / en |
| H1 | كيف دفعت كوستاريكا مقابل بقاء الغابة واقفة؟ | How Costa Rica Paid to Keep Forests Standing |
| YouTube embed/link present | yes | yes |
| References and editorial disclosure present | yes | yes |
| Elements extending beyond right viewport edge | none detected | none detected |
| JavaScript page errors | none | none |
| Canonical | correct Arabic URL | correct English URL |
| OG image | Arabic-specific | English-specific |
| Social card HTTP | 200, JPEG | 200, JPEG |

**Qualification:** This was a real mobile-sized browser rendering with automated layout inspection and screenshots, not physical-device manual interaction or a complete visual accessibility audit. The blocking criterion of actual narrow-viewport rendering was satisfied; no claim is made of testing every handset or every interaction.

## Actions and Pages
- On the lease-acquisition head fb181bc6c226be18c7843c91e26b0217d40eb5a5, Arabic editorial gate succeeded: https://github.com/alaabmt/alaa-excellence/actions/runs/42354508393
- Pages build/deployment succeeded for the same head: https://github.com/alaabmt/alaa-excellence/actions/runs/42354508146
- After this report and the final workflow state commit, check Pages against the final exact main head before declaring the cycle fully completed.
- Recent unrelated Site health QA failures on other commits were observed and should be investigated separately; they were not misreported as passing.

## Next
Complete the workflow checkpoint, release lease, and resume normal case scheduling only according to the daily duplicate and cadence checks. Do not republish this case.
