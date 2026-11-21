# PubMed FMEA Article Agent — run instructions

Owner decisions (7 November 2026): the agent finds a recent PubMed study on FMEA, drafts a bilingual article for Tamayuz 10X, builds a hook card, and asks for approval. It runs **twice a week** (suggested: Tuesday and Friday, 09:00 Asia/Dubai). **LinkedIn only; no Facebook.**

Two rules never change: never publish anything (site article or LinkedIn post) without the owner's explicit approval of that specific item, and never print, request or store tokens. In Arabic say «مساعد الذكاء الاصطناعي», never «وكيل الذكاء الاصطناعي». The owner is «الدكتور علاء محمد أحمد» / "Dr. Alaa Mohammad Ahmed".

- Repository: `alaa-excellence`. State branch (config, scripts, logs): `ccr-87550695-nqef73`.
- Folder: `automation/pubmed-fmea/`. Log: `automation/pubmed-fmea/log.jsonl` (one line per run: `slug`, `pmid`, `doi`, `title`, `article_file`, `draft_branch`, `review`, `linkedin`, `site`).

## 1. Prepare
1. Clone to `/home/user/alaa-excellence` if missing. `git fetch origin ccr-87550695-nqef73 && git checkout -B ccr-87550695-nqef73 origin/ccr-87550695-nqef73`.
2. Read, from `main`: `10X_Agent_AI_Master_Operating_Manual_AR.md` (sections 3–6), `PREVENTIVE_ENGINEERING_ARTICLE_STANDARD.md`, `AGENTS.md`, and a recent published article-preventive-engineering-*.html as the structural model. Also read `automation/daily-wisdom/WISDOM_WRITING_SKILL.md` section 11 and `automation/daily-wisdom/PROMPT.md` (plain-language and review gates).
3. Slug = `YYYY-MM-DD` (Dubai date). If `log.jsonl` already has it, stop.

## 2. Find the study (PubMed E-utilities, no key needed)
1. Search `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=30&sort=date&term=...` with terms such as `("failure mode and effects analysis"[Title/Abstract] OR FMEA[Title/Abstract]) AND (2025:3000[dp])`. Fetch details with `esummary` and abstracts with `efetch` (`rettype=abstract`).
2. Exclude any PMID or DOI already in `log.jsonl` or already cited in a site article (`grep -l <pmid-or-doi> article-*.html` on `origin/main`).
3. Prefer: a real organization or setting, a stated method and result, an open-access full text (check PMC), clear limits. Reject: abstract-only claims you cannot support, retracted papers, predatory or unclear venues, studies with no FMEA content.
4. Read the full text when open access. If only the abstract is available, say so in the article's evidence limits and claim nothing beyond the abstract.
5. Offer the owner the chosen study and one runner-up in the delivery message.

## 3. Draft the article (on a separate branch, never on main)
1. Create branch `claude/pubmed-fmea-<slug>` from `origin/main`. Write the Arabic page and the English page under `en/` with the same file name, `article-preventive-engineering-<short-slug>.html`, following the model page and `PREVENTIVE_ENGINEERING_ARTICLE_STANDARD.md` (problem first, nine-stage method, one application case, narrated tables, evidence limits, mobile layout, references with PMID/DOI).
2. Exact Arabic terms: «منهجية هندسة الوقاية (FMEA)» at every Arabic occurrence; «ثلاثية تحديد الخطر (Severity, Occurrence, Detection — S/O/D)»; Failure Mode = «أوجه الفشل». Define each new term at first use. English: original editorial English, US spelling, not translated from Arabic.
3. Distinguish what the study documented from what the analyst infers. Never state or imply the owner ran the study. Do not invent numbers, organizations, results or proof.
4. Run the `tamayuz-publish-check` skill and the repository checks on both pages. Record each gate result, including any gate that could not be verified (for example real-phone layout is NOT VERIFIED, not PASS).
5. Push only the draft branch. Do **not** open a pull request, do **not** merge, do **not** touch `main`.

## 4. Card and post
Follow `automation/daily-wisdom/PROMPT.md` sections 3–5 for the hook card (one number at most, plain-language gate, Arabic and English cards, signature «من تحليل الدكتور علاء محمد أحمد», `render.mjs`), using the new article. Then run the three reviews (fidelity checker, Arabic editorial, English editorial) on the card, the captions and the article's executive-summary text; at most two rewrite rounds; report any unresolved BLOCK to the owner plainly. The card text must not be sent while a fidelity BLOCK is unresolved without a clear warning at the top of the message.

## 5. Deliver and ask
Send both PNGs with `SendUserFile` (`status: "proactive"`, `display: "render"`), plus: the study (title, journal, PMID, DOI), the draft branch name and the two page paths, the gate record, the review verdicts, and the LinkedIn text (run `python3 -I automation/daily-wisdom/post_linkedin.py post --spec <spec.json> --article <file> --dry-run` and paste it). Ask, in Arabic, for two separate approvals: (1) نشر المقال على الموقع، (2) نشر البطاقة على لينكدإن. Then stop.

## 6. After the owner replies
- **Site article approved:** only then merge the draft branch to `main` in the way the owner specifies (ask how if unknown), then verify the live Arabic and English URLs return 200. The LinkedIn post may go out only after the article is live, because it links to it.
- **LinkedIn approved:** `python3 -I automation/daily-wisdom/post_linkedin.py post --spec <spec.json> --article <file>`, the exact cards and text the owner saw.
- «لا» → publish nothing; record `rejected`. Edit request → change only what was asked and ask again. An unclear reply is not approval.
- On a token error (LinkedIn 401), report the exact error; do not retry with other credentials.
- Append the log line, commit only `log.jsonl` with message `PubMed FMEA log: <slug>`, push to the state branch.
