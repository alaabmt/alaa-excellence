# Live verification report — Al-Hashr 59:18

- Checked at: 2026-11-18T22:04:32+04:00
- Deployed content head: `ebe4fa98d5ccc43b28db1d2e1b50f508f92d3e11`
- Actions checkpoint: `418c2ba0e1b1f9b50b953efd6a4097df313a49da`

## Live pages

- Arabic: https://tamayuz10x.com/reflection-al-hashr-what-have-we-sent-ahead.html
  - correct title and H1
  - `lang=ar`, `dir=rtl`
  - Arabic content and cover loaded
  - listen controls present
  - obsolete unpublished-draft notice absent
- English: https://tamayuz10x.com/en/reflection-al-hashr-what-have-we-sent-ahead.html
  - correct title and H1
  - `lang=en`, `dir=ltr`
  - English content and cover loaded
  - listen controls present
  - lead correctly references Al-Hashr 59:18; the stale Al-Ahzab reference is absent

Desktop checks found no horizontal overflow. Exact-head automated mobile checks passed 8/8 at 320, 375, 390, and 430 px for Arabic and English.

## Live discovery surfaces

The reflection is present on all four live indexes:

- https://tamayuz10x.com/articles.html
- https://tamayuz10x.com/en/articles.html
- https://tamayuz10x.com/quranic-reflections.html
- https://tamayuz10x.com/en/quranic-reflections.html

The live sitemap contains both Arabic and English URLs exactly once each.

## TTS gate

The controls and speeds are present in both languages, but the available verification browser reports `window.speechSynthesis === false`. Therefore actual audible Arabic/English playback, highlighting, pause/resume, stop, and speed behavior could not be verified.

**Decision required:** provide a Web Speech-capable browser/device with audible Arabic and English voices for the actual-playback gate, or explicitly approve completion without actual playback verification.
