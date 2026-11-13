# LinkedIn Post 008 — حين يرى الطبيب أرقام أدائه / When doctors see their own numbers

**Format:** LinkedIn document (carousel), 8 slides, 1080×1350, two separate posts: Arabic (`carousel-ar.pdf`) and English (`carousel-en.pdf`). The English version is written as original English, not a translation.
**Website article (draft):** https://tamayuz10x.com/article-oe-evidence-audit-and-feedback.html and https://tamayuz10x.com/en/article-oe-evidence-audit-and-feedback.html (draft PR #215; the links work only after approval and merge).
**Editorial review:** article, slides and captions reviewed with the owner's `arabic-editorial-reviewer` and `english-editorial-reviewer` agents (`.claude/agents/`); all BLOCK/FIX findings fixed before delivery.
**Status:** Draft, waiting for the owner's approval. Nothing published.

| File | Purpose |
|---|---|
| `carousel-ar.pdf`, `carousel-en.pdf` | Upload as LinkedIn Documents |
| `post-text-ar.md`, `post-text-en.md` | Captions (end with the article link) |
| `build.py` → `slides-ar.html`, `slides-en.html` + `slides.css` | Editable source (edit `build.py`, run it, then `NODE_PATH=/opt/node-tools/node_modules node render.js "$PWD" ar,en`) |
| `preview/` | PNG of each slide |

## Evidence pack

Checked on 13 Nov 2026 against the PubMed abstracts (efetch); DOIs checked with Crossref.

| Claim | Source |
|---|---|
| 292 randomized trials; recipients physicians in 81%; prescribing 47%, test ordering 35% | [1] Main results |
| 177 trials A&F vs control: mean absolute rise of 6.2 percentage points (95% CI 4.1–8.2, moderate certainty); median 2.7 (IQR 0.0–8.6) across 558 outcomes — median and mean are calculated differently and not compared | [1] Main results |
| Larger effects with lower baseline and more co-interventions; features: individual data, top-peer/benchmark comparison, local champion, interactive modalities, facilitation, action plans; repeated delivery linked to smaller effect; findings need confirmation | [1] Main results, Conclusions |
| 113 (39%) high risk of bias; 26 (9%) in low- or middle-income countries | [1] Main results |
| 56 RCTs in primary care; 11% relative reduction in antibiotic volume (21 trials, RR 0.89); 23% relative reduction in unnecessary initiation (16 trials, RR 0.77); substantial heterogeneity | [2] Results |
| Ontario, 833 endoscopists; polypectomy rate RR 1.07 vs 1.05 (P = 0.09); lower performers RR 1.34 vs 1.11 (P = 0.02) | [3] Results |
| 7 pediatric EDs, 2013–2016, monthly site-level reports with benchmarks; vitals documentation improved; throughput measures worsened; mixed results | [4] Methods, Results |
| 201 sites, 14,915 patients; documentation of tumour features and resection completeness improved; no difference in chemotherapy, muscle sampling or early recurrence; control arm also improved | [5] Key findings |
| Leader steps (slide 7) and "most likely to help when…" (caption) | Author's inference; labeled |

[1] Ivers N, et al. Audit and feedback: effects on professional practice. *Cochrane Database Syst Rev* 2026;6:CD000259. doi:10.1002/14651858.CD000259.pub5 (PMID 42325158)
[2] Xu AXT, et al. Audit and feedback interventions for antibiotic prescribing in primary care: a systematic review and meta-analysis. *Clin Infect Dis* 2025;80(2):253–262. doi:10.1093/cid/ciae604 (PMID 39657007)
[3] Tinmouth J, et al. A pragmatic randomized controlled trial of an endoscopist audit and feedback report for colonoscopy. *Am J Gastroenterol* 2021;116(10):2042–2051. doi:10.14309/ajg.0000000000001498 (PMID 34515669)
[4] Chamberlain JM, et al. Audit and feedback on pediatric emergency department performance measures: a stepped-wedge trial. *Hosp Pediatr* 2025;15(11):901–910. doi:10.1542/hpeds.2025-008440 (PMID 41062095)
[5] Gallagher K, et al. RESECT: a randomised controlled trial of audit and feedback in non-muscle-invasive bladder cancer surgery. *Eur Urol* 2026;89(4):355–365. doi:10.1016/j.eururo.2025.09.4174 (PMID 41444076)

**Evidence limits:** 39% of the Cochrane trials at high risk of bias; most trials combined data with other methods; outcomes are professional practice, not patient health; the pediatric ED data are from 2013–2016; no abstract mentions a trial in an Arab country; nothing was tested outside health care.

## Publication

| Item | Status | Link |
|---|---|---|
| Website article | Draft PR #215 | — |
| Arabic post | Waiting for approval | — |
| English post | Waiting for approval | — |
