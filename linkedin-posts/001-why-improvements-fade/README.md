# LinkedIn Post 001 — Why Improvements Fade

**Format:** LinkedIn document (carousel) post, 8 slides, 1080×1350.
**Language:** Arabic only.
**Publishing:** manual, by the account owner.

| File | Purpose |
|---|---|
| `carousel-ar.pdf` | Upload as a LinkedIn Document |
| `post-text-ar.md` | Post caption |
| `slides-ar.html` + `slides.css` | Editable source |
| `preview/` | PNG of each slide, for review |
| `../brand/` | Tamayuz 10X logo and wordmark: color (light bg), ondark (navy bg), navy (amber bg) |

## Evidence pack

Every number on the slides traces to one of these sources:

| Claim | Source |
|---|---|
| 28 plants, 17 firms, near Mumbai, 2008, randomized; 38 practices | [2] §II.A |
| 93% recorded defects, 29% monitored daily/by type, none had a system (treatment plants, baseline) | [2] §II.A |
| Adoption +38 pp (treatment) vs +12 pp (diagnosis only) | [2] §II.B |
| +17% productivity in year one | [1] abstract; [2] fn. 12 |
| ~US$325,000 profit per plant per year (estimate) | [2] §II.C |
| About half of adopted practices dropped by 2017; gap in practices and performance persisted | [2] abstract |
| New plant manager = 9.9 of 16.7 pp dropped in treatment experimental plants (>½); director time | [2] Table 3, §III.C |
| Spread to non-experimental plants in same firm | [2] abstract, §II.B |

[1] Bloom, Eifert, Mahajan, McKenzie & Roberts (2013). Does Management Matter? Evidence from India. *QJE* 128(1): 1–51. doi:10.1093/qje/qjs044
[2] Bloom, Mahajan, McKenzie & Roberts (2020). Do Management Interventions Last? Evidence from India. *AEJ: Applied* 12(2): 198–219. doi:10.1257/app.20180369 — working paper: World Bank WPS 8339 (2018), https://documents1.worldbank.org/curated/en/346001518549616744/pdf/WPS8339.pdf

**Evidence limits:** one industry, one region, family-owned firms, 28 plants; profit figure is an estimate; reasons for dropping practices are self-reported.

## Re-render

```
node render.js <this-folder>   # Playwright + Chromium; fonts load from Google Fonts
```

## Publication record

- **Published:** 2026-10-16, via LinkedIn API, visibility PUBLIC
- **Post:** `urn:li:ugcPost:7516923334178107392` — https://www.linkedin.com/feed/update/urn:li:ugcPost:7516923334178107392/
- **Document:** `urn:li:document:D4D10AQEcZ1ti46jAQQ` (carousel-ar.pdf), title «لماذا يتلاشى التحسين؟»
