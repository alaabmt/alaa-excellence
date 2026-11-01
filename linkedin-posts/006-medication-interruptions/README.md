# LinkedIn Post 006 — سترة «لا تقاطعني» لم تخفّض الأخطاء / A do-not-interrupt vest did not cut errors

**Format:** LinkedIn document (carousel), 8 slides, 1080×1350, two separate posts: Arabic (`carousel-ar.pdf`) and English (`carousel-en.pdf`). The English version is written as original English, not a translation.
**Website article:** https://tamayuz10x.com/article-oe-evidence-medication-interruptions.html and https://tamayuz10x.com/en/article-oe-evidence-medication-interruptions.html (PR #89, squash merge b6fd60e, live 2026-11-01).
**Editorial review:** article text reviewed with the owner's `arabic-editorial-reviewer` and `english-editorial-reviewer` agents (`.claude/agents/`); all BLOCK/FIX findings fixed.
**Status:** Approved by the owner on 2026-11-01. Article live; Arabic and English posts published.

| File | Purpose |
|---|---|
| `carousel-ar.pdf`, `carousel-en.pdf` | Upload as LinkedIn Documents |
| `post-text-ar.md`, `post-text-en.md` | Captions (end with the article link) |
| `build.py` → `slides-ar.html`, `slides-en.html` + `slides.css` | Editable source (edit `build.py`, run it, then `NODE_PATH=/opt/node-tools/node_modules node render.js "$PWD" ar,en`) |
| `preview/` | PNG of each slide |

## Evidence pack

Checked on 1 Nov 2026. PubMed was unavailable (server error); abstracts were read through Consensus, DOIs checked with Crossref, and the Berdot trial full text read through Europe PMC (PMC8383384).

| Claim | Source |
|---|---|
| 22 quantitative studies in 9 countries; 16 (73%) found a significant positive association between interruptions and medication administration errors; definitions varied | [1] Results |
| Saudi 1,000-bed teaching hospital: 28 nurses, 15 rounds, 182 interruptions; frequent sources nurses, doctors, impediments | [2] Design, Results |
| Pharmacists interrupted from fewer than 5 to more than 20 times per hour; phone calls and customer questions most common | [3] Results |
| 4 French hospitals, 29 units (14 vest, 15 control), 178 nurses, 1,346 patients, 383 rounds; data collected Mar–Jul 2017 | [4] Methods, Results |
| Error rate 7.09% vs 6.23% of opportunities for error (p = 0.192) | [4] Results |
| Interruption rate = doses with at least one interruption / all doses: pre 13.4% vs 23.78%; during 15.04% vs 20.75%; authors: no impact on errors or interruption rates | [4] Results, Table 3 (full text) |
| 14 studies; nurse-to-nurse interruptions remained common; effect on errors inconclusive | [5] Results |
| "Many interruptions are a symptom of a system…" (slide 6) | Author's interpretation; labeled on the slide |

[1] Schroers G, et al. Associations between interruptions and medication administration errors among nurses in hospital settings: a scoping review of quantitative studies. *J Adv Nurs* 2025;82:2551–2569. doi:10.1111/jan.70032
[2] Eid T, et al. Interruptions during medication work in a Saudi Arabian hospital: an observational and interview study of nurses. *J Nurs Scholarsh* 2022;54(5):639–647. doi:10.1111/jnu.12765
[3] Ayanaw M, et al. How do interruptions and distractions affect pharmacy practice? A scoping review. *Res Social Adm Pharm* 2025;21(9):667–678. doi:10.1016/j.sapharm.2025.05.001
[4] Berdot S, et al. Effectiveness of a 'do not interrupt' vest intervention to reduce medication errors during medication administration: a multicenter cluster randomized controlled trial. *BMC Nurs* 2021;20:153. doi:10.1186/s12912-021-00671-7
[5] Zhang W, et al. Effectiveness of interventions for reducing interruptions during medication administration: a systematic review. *Worldviews Evid Based Nurs* 2025;22(4):e70067. doi:10.1111/wvn.70067

**Evidence limits:** the only randomized trial collected data in 2017 and tested the vest and poster only; the reviews could not pool results because definitions differed; association is not causation; the Saudi study is small and descriptive; no setting outside health care was tested.

## Publication

| Item | Status | Link |
|---|---|---|
| Website article (AR + EN) | Live 2026-11-01 (PR #89; the same PR also fixed three bare "FMEA" labels in the `articles.html` navigation) | https://tamayuz10x.com/article-oe-evidence-medication-interruptions.html · https://tamayuz10x.com/en/article-oe-evidence-medication-interruptions.html |
| LinkedIn Arabic carousel | Published 2026-11-01, `urn:li:ugcPost:7522555113287389184`, document title «سترة «لا تقاطعني» لم تخفّض الأخطاء» | https://www.linkedin.com/feed/update/urn:li:ugcPost:7522555113287389184/ |
| LinkedIn English carousel | Published 2026-11-01, `urn:li:ugcPost:7522585802938146816`, document title "A do-not-interrupt vest did not cut errors" (includes the corrected last-slide limit line) | https://www.linkedin.com/feed/update/urn:li:ugcPost:7522585802938146816/ |

**Correction note (2026-11-01):** after the Arabic post went out, the last-slide line «شملت الدراسات مستشفى عربيًا واحدًا» was found to overstate the evidence (the reviews' included studies were not checked). The source PDFs now say that only one of the five cited studies took place in an Arab hospital. The English post was published with the corrected slide; the Arabic post on LinkedIn still shows the old line (LinkedIn does not allow replacing a published document).
