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

| Claim | Source |
|---|---|
| Simulation model of an acute hospital taking emergency admissions; BMJ 1999 | [1] Methods, abstract |
| Risks minimal below ~85% mean occupancy | [1] Results: "Risks are minimal so long as the mean bed occupancy remains below about 85%" |
| At 85%, short of beds on about four days a year | [1] "at 85%, a hospital can expect to be short of beds for admissions on four days in a year" |
| Up to eight weeks of disruption in total | [1] "a hospital that runs out of beds for four days in a year may be disrupted for up to eight weeks in total" |
| ≥90% regular bed crises | [1] Abstract and key messages |
| Year-on-year evaluation at one hospital swamped by random variation | [1] Key messages |
| 2.65 million admissions to Danish medical departments, 1995–2012 | [2] Abstract |
| High occupancy associated with 9% increase in in-hospital and 30-day mortality vs low occupancy | [2] Abstract |
| Queueing statement (slide 6) | General queueing theory; labeled on the slide as an inference, not a finding of the two studies |

[1] Bagust A, Place M, Posnett JW. Dynamics of bed use in accommodating emergency admissions: stochastic simulation model. *BMJ* 1999;319(7203):155–158. https://pmc.ncbi.nlm.nih.gov/articles/PMC28163/
[2] Madsen F, Ladelund S, Linneberg A. High levels of bed occupancy associated with increased inpatient and thirty-day hospital mortality in Denmark. *Health Affairs* 2014;33(7):1236–1244. https://research.regionh.dk/da/publications/high-levels-of-bed-occupancy-associated-with-increased-inpatient-/

**Evidence limits:** [1] is a simulation of a hypothetical hospital (1999); its 85% figure is model-specific. [2] is observational (association, not cause), medical departments in one country; the abstract does not state the exact cut-offs for "high" and "low" occupancy, so the slides do not state them.
