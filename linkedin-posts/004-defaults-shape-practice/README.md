# LinkedIn Post 004 — حين يصبح الصواب هو الخيار الجاهز / When the right choice is the default

**Format:** LinkedIn document (carousel), 8 slides, 1080×1350, two separate posts: Arabic (`carousel-ar.pdf`) and English (`carousel-en.pdf`). The English version is written as original English, not a translation.
**Website article:** https://tamayuz10x.com/article-oe-evidence-defaults-shape-practice.html and https://tamayuz10x.com/en/article-oe-evidence-defaults-shape-practice.html (PR #79, squash merge 65e6dfd, live 2026-10-25).
**Status:** Approved by the owner on 2026-10-25. Article live; Arabic and English posts published.

| File | Purpose |
|---|---|
| `carousel-ar.pdf`, `carousel-en.pdf` | Upload as LinkedIn Documents |
| `post-text-ar.md`, `post-text-en.md` | Captions (end with the article link) |
| `build.py` → `slides-ar.html`, `slides-en.html` + `slides.css` | Editable source (edit `build.py`, run it, then `NODE_PATH=/opt/node-tools/node_modules node render.js "$PWD" ar,en`) |
| `preview/` | PNG of each slide |

## Evidence pack

All numbers checked against the PubMed abstracts on 22 Oct 2026.

| Claim | Source |
|---|---|
| 11 US hospitals; patients ≥65 with advanced COPD, dementia or kidney failure; 2016–2018; stepped-wedge cluster randomized; default consult order with opt-out; no added palliative care staffing | [1] Design, Intervention, Objective |
| 34,239 enrolled; 24,065 in primary analysis (stay ≥72 h) | [1] Results |
| Consult 43.9% vs 16.6% (aOR 5.17); timing 3.4 vs 4.6 days | [1] Results |
| Length of stay unchanged (−0.53%); more DNR orders (aOR 1.40) and hospice discharge (aOR 1.30); in-hospital mortality similar | [1] Results |
| 1,000 inpatients who smoked, Kansas City academic hospital, opt-out vs opt-in | [2] Design |
| Post-discharge medication 60% vs 34%; ≥1 counseling call 89% vs 37% | [2] Results |
| Verified quit 22% vs 16% at 1 month; 19% vs 18% at 6 months | [2] Results |
| 118 surgical clinicians randomized; 663 encounters; no overall MME difference; only 21% in the intervention group got pre-populated prescriptions, 79% free-form; pre-populated were smaller (−22.5 MME) | [3] Methods, Results |
| 12 ICUs, 2021–2023, 4,412 patients; default low tidal volume order and accountable justification; no significant difference; effect varied by ICU | [4] Methods, Results |
| "Accepting a default costs nothing…" (slide 5) | Author's interpretation; labeled on the slide |

[1] Courtright KR, et al. Default Palliative Care Consultation for Seriously Ill Hospitalized Patients: A Pragmatic Cluster Randomized Trial. *JAMA* 2024;331(3):224–232. PMID 38227032
[2] Richter KP, et al. The Effects of Opt-out vs Opt-in Tobacco Treatment on Engagement, Cessation, and Costs: A Randomized Clinical Trial. *JAMA Intern Med* 2023;183(4):331–339. PMID 36848129
[3] Zhang IY, et al. Prescription Default Nudges for Opioid Reduction after Major Surgery (NORMS): A Randomized Controlled Trial. *Ann Surg* 2025 (online ahead of print). PMID 41199437
[4] Kerlin MP, et al. Nudging implementation of low tidal volume ventilation: a stepped wedge, cluster randomized trial. *Implement Sci* 2026;21(1):40. PMID 42098760

The website article also cites two systematic reviews: Raban et al., *JAMIA* 2023 (PMID 37187160) and Nguyen et al., *JAMA Netw Open* 2024 (PMID 39287947).

**Evidence limits:** all four trials are in health care; two were single-center (smoking, surgery); the palliative care data are from 2016–2018 and the trial missed its primary outcome; the smoking trial used a Bayesian analysis; no Arab organizations were studied. Applying the idea to other sectors is an inference.

## Publication

| Item | Status | Link |
|---|---|---|
| Website article (AR + EN) | Live 2026-10-25 (PR #79). Title changed on 25 Oct to meet the Arabic editorial clarity standard: «ماذا حدث حين جعلت المستشفيات الإجراء الصحيح خيارًا جاهزًا؟» / "What Happened When Hospitals Made the Right Action the Default?" | https://tamayuz10x.com/article-oe-evidence-defaults-shape-practice.html · https://tamayuz10x.com/en/article-oe-evidence-defaults-shape-practice.html |
| LinkedIn Arabic carousel | Published 2026-10-25, `urn:li:ugcPost:7520021739255255040`, document title «حين يصبح الصواب هو الخيار الجاهز» | https://www.linkedin.com/feed/update/urn:li:ugcPost:7520021739255255040/ |
| LinkedIn English carousel | Published 2026-10-25, `urn:li:ugcPost:7520022360222085120`, document title "When the right choice is the default" | https://www.linkedin.com/feed/update/urn:li:ugcPost:7520022360222085120/ |
