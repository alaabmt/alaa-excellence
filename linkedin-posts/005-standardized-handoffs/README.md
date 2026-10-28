# LinkedIn Post 005 — حين يكون التسليم واحدًا للجميع / When every shift hands over the same way

**Format:** LinkedIn document (carousel), 8 slides, 1080×1350, two separate posts: Arabic (`carousel-ar.pdf`) and English (`carousel-en.pdf`). The English version is written as original English, not a translation.
**Website article:** https://tamayuz10x.com/article-oe-evidence-standardized-handoffs.html and https://tamayuz10x.com/en/article-oe-evidence-standardized-handoffs.html (draft PR #85, not live yet).
**Status:** Draft, waiting for the owner's approval. Not published.

| File | Purpose |
|---|---|
| `carousel-ar.pdf`, `carousel-en.pdf` | Upload as LinkedIn Documents |
| `post-text-ar.md`, `post-text-en.md` | Captions (end with the article link) |
| `build.py` → `slides-ar.html`, `slides-en.html` + `slides.css` | Editable source (edit `build.py`, run it, then `NODE_PATH=/opt/node-tools/node_modules node render.js "$PWD" ar,en`) |
| `preview/` | PNG of each slide |

## Evidence pack

All numbers checked against the PubMed abstracts on 28 Oct 2026.

| Claim | Source |
|---|---|
| Handoff miscommunications are a leading source of medical errors | [1] Background |
| 32 hospitals (12 community, 20 academic); 2,735 residents; 760 faculty champions; 18 months of external coaching with monthly metric reviews | [1] Settings, Intervention, Results |
| Handoff-related reported adverse events −47% (major 1.7→0.9, minor 17.5→9.3 per person-year) | [1] Results (resident-reported surveillance surveys) |
| All five elements in verbal handoffs 20%→66%; written 10%→74%; receiver synthesis 31%→83% | [1] Results (direct observation) |
| 12 tools searched; I-PASS moderate certainty (10 studies); SBAR low certainty; others insufficient | [2] Results, Conclusion |
| ACCELERATE: 3 hospitals, 9 wards, 13,753 admissions; primary composite unchanged (OR 0.99); pressure injuries −41% (absolute 0.8%) | [3] Methods, Results |
| 42 studies (6 RCTs); adverse events improved in 3/16; combined structural + educational more often positive | [4] Results |
| "The key information comes up every time…" (slide 5) | Author's interpretation; labeled on the slide |

[1] Starmer AJ, et al. Implementation of the I-PASS handoff program in diverse clinical environments: a multicenter prospective effectiveness implementation study. *J Hosp Med* 2023;18(1):5–14. PMID 36326255
[2] McCarthy S, Motala A, Lawson E, Shekelle PG. Use of structured handoff protocols for within-hospital unit transitions: a systematic review from Making Healthcare Safer IV. *BMJ Qual Saf* 2025;34(10):680–690. PMID 40306923
[3] Rihari-Thomas J, et al. ACCELERATE: a stepped-wedge cluster randomised trial of a nurse-led assessment and handover communication intervention. *Int J Nurs Stud* 2026;183:105652. PMID 42574924
[4] Allen-Dicker J, et al. Physician inpatient handoffs—patient and physician outcomes: a systematic review. *J Hosp Med* 2025;20(6):607–622. PMID 39733333

**Evidence limits:** [1] is a pre-post study without a control group; adverse events were self-reported by residents; some authors hold equity in the I-PASS Patient Safety Institute (study designed before it existed; analysis by an independent statistical team). [3] covered three hospitals and its primary outcome did not change. [2] and [4] include mostly academic settings and few randomized trials. No Arab hospitals were studied. Applying the idea to other sectors is an inference.
