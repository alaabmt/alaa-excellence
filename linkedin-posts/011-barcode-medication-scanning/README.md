# LinkedIn Post 011 — التحقق من الدواء بالماسح الضوئي / Barcode scanning before giving medicines

**Format:** LinkedIn document (carousel), 8 slides, 1080×1350, two separate posts: Arabic (`carousel-ar.pdf`) and English (`carousel-en.pdf`). The English version is written as original English, not a translation.
**Website article:** https://tamayuz10x.com/article-oe-evidence-barcode-medication-scanning.html and https://tamayuz10x.com/en/article-oe-evidence-barcode-medication-scanning.html (PR #256, squash merge 7f57961, live 2026-11-27).
**Editorial review:** article, slides and captions reviewed with the owner's `arabic-editorial-reviewer` and `english-editorial-reviewer` agents; all BLOCK/FIX findings fixed before delivery (final: Arabic OVERALL PASS after 3 rounds, English OVERALL PASS after 3 rounds).
**Status:** Approved by the owner on 2026-11-27 (article and both posts). Article live; Arabic post published; English post scheduled.

| File | Purpose |
|---|---|
| `carousel-ar.pdf`, `carousel-en.pdf` | Upload as LinkedIn Documents |
| `post-text-ar.md`, `post-text-en.md` | Captions (end with the article link) |
| `build.py` → `slides-ar.html`, `slides-en.html` + `slides.css` | Editable source (edit `build.py`, run it, then `NODE_PATH=/opt/node-tools/node_modules node render.js "$PWD" ar,en`) |
| `preview/` | PNG of each slide |

## Evidence pack

Checked on 25 Nov 2026 against the PubMed abstracts (efetch); DOIs checked with Crossref.

| Claim | Source |
|---|---|
| Before-and-after quasi-experimental study in an academic medical center (author affiliation: Boston, USA); 14,041 administrations observed; 3,082 transcriptions reviewed | [1] Methods, Results |
| Non-timing administration errors 11.5% → 6.8% (41.4% relative reduction); worked example 115 → 68 per 1,000 | [1] Results |
| Non-timing potential ADEs 3.1% → 1.6%; timing errors −27.3%; timing-related potential ADEs no significant change; transcription errors 6.1% → eliminated; errors not eliminated | [1] Results, Conclusions |
| 65 studies (51 RCTs, 14 ITS) on reducing medication errors in hospitalised adults; barcoding: low-certainty evidence that it may reduce medication errors (2 studies, n=50,545), compared with usual care | [2] Main results, Conclusions |
| 10 prospective before-and-after studies (searched to Dec 2016; 9 US, 1 UK); all showed overall positive effects; may prevent wrong dose, wrong drug, wrong patient, unauthorized drug, wrong route errors | [3] Methods, Results, Conclusions |
| Five hospitals; observation at two; 15 workaround types; 31 cause types; overrides for 4.2% of patients and 10.3% of medications; administration errors least likely to be intercepted; reductions "not clearly demonstrated" | [4] Abstract |
| Five hospital wards (author affiliation: London, UK); first 16 months; 613,868 administrations; medication scanning 5.6%–67%; patient scanning 4.6%–89%; reported reasons; scanning declined over time; local QI initiative linked to higher scanning; 37% of alerts changed user action | [5] Methods, Results |
| "Buying a checking system does not by itself change how people work…" and the leader steps | Author's inference; labeled |

[1] Poon EG, et al. Effect of bar-code technology on the safety of medication administration. *N Engl J Med* 2010;362(18):1698–1707. doi:10.1056/NEJMsa0907115 (PMID 20445181)
[2] Ciapponi A, et al. Reducing medication errors for adults in hospital settings. *Cochrane Database Syst Rev* 2021;11:CD009985. doi:10.1002/14651858.CD009985.pub2 (PMID 34822165)
[3] Hutton K, Ding Q, Wellman G. The effects of bar-coding technology on medication errors: a systematic literature review. *J Patient Saf* 2021;17(3):e192–e206. doi:10.1097/PTS.0000000000000366 (PMID 28234729)
[4] Koppel R, et al. Workarounds to barcode medication administration systems: their occurrences, causes, and threats to patient safety. *J Am Med Inform Assoc* 2008;15(4):408–423. doi:10.1197/jamia.M2616 (PMID 18436903)
[5] Williams R, et al. Barcode medication administration system use and safety implications: a data-driven longitudinal study supported by clinical observation. *BMJ Health Care Inform* 2025;32(1):e101214. doi:10.1136/bmjhci-2024-101214 (PMID 39832825)

**Evidence limits:** the primary study and the first review's studies are before-and-after designs; the Cochrane barcoding result has low certainty and rests on two studies; the workaround study was published in 2008; the U.K. study covers five wards; the published abstracts mention no Arab hospital; nothing was tested outside hospitals.

## Publication

| Item | Status | Link |
|---|---|---|
| Website article | Live 2026-11-27 (PR #256) | https://tamayuz10x.com/article-oe-evidence-barcode-medication-scanning.html |
| Arabic post | Published 2026-11-27 (urn:li:ugcPost:7532180114671923200) | https://www.linkedin.com/feed/update/urn:li:ugcPost:7532180114671923200/ |
| English post | Scheduled for about 2 hours after the Arabic post (27 Nov) | — |
