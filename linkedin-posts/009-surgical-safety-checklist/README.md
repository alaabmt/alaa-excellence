# LinkedIn Post 009 — قائمة تحقق في العمليات الجراحية / A checklist before surgery

**Format:** LinkedIn document (carousel), 8 slides, 1080×1350, two separate posts: Arabic (`carousel-ar.pdf`) and English (`carousel-en.pdf`). The English version is written as original English, not a translation.
**Website article:** https://tamayuz10x.com/article-oe-evidence-surgical-safety-checklist.html and https://tamayuz10x.com/en/article-oe-evidence-surgical-safety-checklist.html (PR #233, squash merge 8c3f312, live 2026-11-16).
**Editorial review:** article, slides and captions reviewed with the owner's `arabic-editorial-reviewer` and `english-editorial-reviewer` agents; all BLOCK/FIX findings fixed before delivery.
**Status:** Approved by the owner on 2026-11-16. Article live; Arabic post published; English post scheduled about two hours later.

| File | Purpose |
|---|---|
| `carousel-ar.pdf`, `carousel-en.pdf` | Upload as LinkedIn Documents |
| `post-text-ar.md`, `post-text-en.md` | Captions (end with the article link) |
| `build.py` → `slides-ar.html`, `slides-en.html` + `slides.css` | Editable source (edit `build.py`, run it, then `NODE_PATH=/opt/node-tools/node_modules node render.js "$PWD" ar,en`) |
| `preview/` | PNG of each slide |

## Evidence pack

Checked on 16 Nov 2026 against the PubMed abstracts (efetch); DOIs checked with Crossref.

| Claim | Source |
|---|---|
| 19-item checklist designed to improve team communication and consistency of care | [1] Background |
| 8 hospitals in 8 cities incl. Amman, Jordan; 2007–2008; 3,733 patients before, 3,955 after; age ≥16, noncardiac surgery | [1] Methods |
| Deaths 1.5% → 0.8% (P=0.003); inpatient complications 11.0% → 7.0% (P<0.001); before-and-after design | [1] Results |
| Ontario policy encouraging universal adoption; 101 hospitals; 109,341 and 106,370 procedures in 3-month periods | [2] Methods, Results |
| Adjusted death 0.71% → 0.65% (OR 0.91, P=0.13); adjusted complications 3.86% → 3.82% (P=0.29) | [2] Results |
| 20 systematic reviews; 24 observational pre-post studies reporting 18 clinical outcomes; 9 favored the checklist; DVT did not | [3] Results |
| 300 studies; 38% gave at least some description of how the checklist was completed; clearer positive relationship with provider outcomes than with patient outcomes | [4] Results |
| 13 studies, 17,867 participants; compliance 73% (Sign In 76%, Time Out 61%, Sign Out 62%); completeness 51%; facilitators and barriers | [5] Results |
| "Having a checklist or signing it may not be enough…" and leader steps | Author's inference; labeled |

[1] Haynes AB, et al. A surgical safety checklist to reduce morbidity and mortality in a global population. *N Engl J Med* 2009;360(5):491–499. doi:10.1056/NEJMsa0810119 (PMID 19144931)
[2] Urbach DR, et al. Introduction of surgical safety checklists in Ontario, Canada. *N Engl J Med* 2014;370(11):1029–1038. doi:10.1056/NEJMsa1308261 (PMID 24620866)
[3] Sotto KT, et al. Impact of the WHO Surgical Safety Checklist relative to its design and intended use: a systematic review and meta-meta-analysis. *J Am Coll Surg* 2021;233(6):794–809. doi:10.1016/j.jamcollsurg.2021.08.692 (PMID 34592406)
[4] Armstrong BA, et al. Effect of the surgical safety checklist on provider and patient outcomes: a systematic review. *BMJ Qual Saf* 2022;31(6):463–478. doi:10.1136/bmjqs-2021-014361 (PMID 35393355)
[5] Habtie TE, et al. Beyond compliance: examining the completeness and determinants of WHO surgical safety checklist. *BMC Health Serv Res* 2025;25:504. doi:10.1186/s12913-025-12569-0 (PMID 40186199)

**Evidence limits:** both primary studies are before-and-after designs with no comparison hospitals; Ontario used administrative data and 3-month windows; the 2021 review's outcome studies were all pre-post; the 2025 review has 13 studies; the Amman hospital's own results are not reported in the abstract; nothing was tested outside surgery.

## Publication

| Item | Status | Link |
|---|---|---|
| Website article | Live 2026-11-16 (PR #233) | https://tamayuz10x.com/article-oe-evidence-surgical-safety-checklist.html |
| Arabic post | Published 2026-11-16 (urn:li:ugcPost:7527992133295853568) | https://www.linkedin.com/feed/update/urn:li:ugcPost:7527992133295853568/ |
| English post | Scheduled about 2 hours after the Arabic post | — |
