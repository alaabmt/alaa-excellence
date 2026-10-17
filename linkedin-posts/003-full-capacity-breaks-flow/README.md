# LinkedIn Post 003 — When the system is full / حين يمتلئ النظام

**Format:** LinkedIn document (carousel), 8 slides, 1080×1350, two separate posts: Arabic (`carousel-ar.pdf`) and English (`carousel-en.pdf`). The English version is written as original English, not a translation.
**Status:** Draft, waiting for the owner's approval. Not published.

| File | Purpose |
|---|---|
| `carousel-ar.pdf`, `carousel-en.pdf` | Upload as LinkedIn Documents |
| `post-text-ar.md`, `post-text-en.md` | Captions |
| `build.py` → `slides-ar.html`, `slides-en.html` + `slides.css` | Editable source (edit `build.py`, run it, then `node render.js <folder> ar,en`) |
| `preview/` | PNG of each slide |

## Evidence pack

Rebuilt on 17 Oct 2026 on recent evidence, after the owner noted that the first draft relied on a 1999 study.

| Claim | Source |
|---|---|
| 5,249,891 patients admitted from every type 1 ED in England, Apr 2016–Mar 2018; published 2022 | [1] Abstract (PubMed 35042695) |
| Linear rise in 30-day mortality from 5 h after arrival up to 12 h | [1] Results |
| Largest change in 30-day SMR: +8%, in patients waiting more than 6 to 8 h | [1] Results |
| One extra death per 82 admitted patients delayed beyond 6–8 h | [1] Conclusions |
| Adjusted for sex, age, deprivation, comorbidities, time, prior attendances, crowding | [1] Methods |
| 25,905,347 ED visits, Korea NEDIS 2018–2022; published 2026 | [2] Abstract (PubMed 41935246) |
| ED occupancy ≥100%: aOR 1.121 (Level 1 EDs), 1.209 (Level 2 EDs) for in-hospital mortality; risk rose with occupancy | [2] Results |
| Stockholm: hospital bed occupancy not associated with 30-day or in-hospital mortality | [3] Abstract (read via Consensus database) |
| Queueing statement (slide 6) | General queueing theory; labeled on the slide as an inference, not a finding |

[1] Jones S, Moulton C, Swift S, et al. Association between delays to patient admission from the emergency department and all-cause 30-day mortality. *Emerg Med J* 2022;39(3):168–173. doi:10.1136/emermed-2021-211572
[2] Kim M, Lee JH, Choi M, et al. Association between emergency department crowding and mortality: a nationwide analysis stratified by emergency department levels. *BMC Emerg Med* 2026;26(1):153. doi:10.1186/s12873-026-01568-x
[3] af Ugglas B, et al. Association between hospital bed occupancy and outcomes in emergency care: a cohort study in Stockholm Region, Sweden, 2012 to 2016. *Annals of Emergency Medicine*, 2020. (Volume and pages not verified.)

**Evidence limits:** both main studies are observational (association, not cause); [1] uses the word "cause" in its conclusion, but the slides do not. [3] and other Swedish studies found weak or no association, so the effect may vary by system. "12%" and "21%" on slide 5 are adjusted odds ratios rounded from 1.121 and 1.209. No Arab health systems were studied.
