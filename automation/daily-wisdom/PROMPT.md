# Daily Hook Card — run instructions

> **Owner decision, 31 October 2026:** the daily card is no longer a standalone wisdom line. It is a **hook card**: a concrete hook taken from the article that makes the reader want to open it, plus one value line that is worth keeping even if the article is never opened. The call to read and the link live in the post caption, not on the image. Same visual identity, same slot, same approval flow. (Files and fields keep their old names where the scripts need them, for example `daily-wisdom/` and `log.jsonl`.)

Each run (once a day, 09:00 Dubai) produces **one hook card** taken from **one** Tamayuz 10X article, rendered as two cards (Arabic and English), and sends them to the owner with the ready post texts for LinkedIn (both cards) and the Facebook Page (Arabic card only). The owner gives **one** approval for both. Posts go out **only after the owner's explicit approval in this session** (step 7). Never post anything to any other website, social network or external service.

- Repository: `alaabmt/alaa-excellence`
- State branch (config, renderer, log): `ccr-87550695-nqef73`. The owner allows pushes to this branch **only** for appending to `automation/daily-wisdom/log.jsonl`.
- Folder: `automation/daily-wisdom/`

## 1. Prepare
1. Use the existing clone at `/home/user/alaa-excellence`. If it does not exist, clone the repository there. Then `git fetch origin ccr-87550695-nqef73 && git checkout -B ccr-87550695-nqef73 origin/ccr-87550695-nqef73`.
2. Read `10X_Agent_AI_Master_Operating_Manual_AR.md`, sections 3–6 (philosophy, voice, editorial rule, terms). If the focus is `preventive-engineering`, also read `AGENTS.md`, item 2.
3. Get the current date and time in `Asia/Dubai` (`TZ=Asia/Dubai date`). The slot is the nearest entry in `config.json → slots`. Slug = `YYYY-MM-DD-HHMM` of that slot, for example `2026-10-16-0900`.
4. If `log.jsonl` already has a line with this slug, stop. That slot is already done.

## 2. Choose the article
1. **Recent first.** Read `data/article-publication-dates.json` on `origin/main` (`git show origin/main:data/article-publication-dates.json`). If any Arabic page of `config.json → months` focus (or, for a new Preventive Engineering article, any `article-preventive-engineering-*.html`) was published in the **last 3 days** (Dubai date) and has **no** entry in `log.jsonl`, choose it (newest first). New Preventive Engineering articles are expected daily from 1 November 2026.
2. **Otherwise rotate.** Focus = `config.json → months["YYYY-MM"]` (fallback `default_focus`). Expand the `files` globs for that focus in the repository root (Arabic pages; the English page has the same name under `en/`). Choose the article with the **fewest** log entries; on a tie, the one used least recently. When the counts are close, **prefer an article with a human or organizational story** (a named organization, person, place or situation) over a purely technical one.
3. Never choose the same article as the previous log line, unless it is the only one in the focus.
4. Extract the text: `python3 -I automation/daily-wisdom/extract_text.py <file>` for the Arabic page and, when it exists, the English page. Take the article title from the page `<h1>`, not the `<title>` suffixes.
5. Read every earlier log entry for this article. The new hook must come from a **different scene or angle** than any earlier card of the same article.

## 3. Write the hook card
**First read `automation/daily-wisdom/WISDOM_WRITING_SKILL.md`, section 11 (hook card), and apply it.** Section 11 replaces sections 1–5 and 7–9 of that file for daily cards; sections 6 (truth before cleverness) and 10 (owner lessons: name the referent, test with a reader who has not read the article) still apply.

A hook card has five parts. Fields per language: `hook`, `value`, `title_short`, `teaser` (the caption), plus the fixed signature drawn by the renderer.

1. **Hook** (large text; the main element): 1–2 short sentences taken from the article itself: a concrete scene, a person/organization/situation, a surprising turn, or a real question the article answers. **The first sentence names a person, an organization or a situation, never an abstract concept.** Not a yes/no rhetorical question whose answer is obvious. Not a generic claim. If the article's scene is hypothetical (a teaching example), frame it as such («تخيّل…», «لنفترض…», "Picture…").
2. **Value line** (one sentence): the idea a reader keeps even if they never open the article. It must stand alone and be true to the article.
3. **Short card title** (`title_short`): at most about 8 Arabic words / 9 English words, faithful to the article. The article's H1 is not changed; it is used in the caption.
4. **Signature** (fixed, drawn by `render.mjs`): «من تحليل الدكتور علاء محمد أحمد» / "Analysis by Dr. Alaa Mohamed Ahmed". Never write «دراسة الدكتور علاء» or imply the owner ran the study.
5. **Call to read + link**: in the caption only (`teaser`), never on the image.

**Hard limits:** card image text (hook + value + title + signature) at most about 40 Arabic words; the hook is rendered at `font_px` ≥ 40 (the renderer reports it and fails below 40); nothing clipped; Arabic RTL shaped correctly.

**Rotation and bans:**
- Hook types: scene / paradox / correction / image / question / warning. **Do not repeat the type of either of the last TWO log entries.** Record the type in the log as `"hook"`.
- Forbidden: ending the card, the hook or the value line with «فاسأل…» or any generic imperative closing question; «في عالم سريع التغير»-style clichés; opening on an abstract concept.
- **Numbers:** at most **one** number per card, only if the article itself states it with its source and the fidelity checker passes it. Otherwise no numbers.
- **Truth:** everything comes from the article. No claim stronger than the article, no organization name, result or proof that the article does not give. Do not state or imply that anything was proven unless the article says so.
- Quranic reflections focus: do not quote or paraphrase verses on the card; give the leadership lesson as the article states it.
- The new card must not repeat or closely paraphrase an earlier hook or value line in `log.jsonl`.

Process: write three candidate hooks of three different (allowed) types, test them with the section 11 checklist, keep the best, then write the value line, the short title and the caption.

Length: hook 8–20 Arabic words (6–22 English); value line 8–18 words; total image text within the limit above.

Language rules:
- Arabic: modern, natural فصحى written as Arabic from the start (Executive Analytical Arabic, Tamayuz 10X). Full sentences; no «label: explanation» pattern; correct hamzas.
- English: original editorial English in US spelling, written from the idea and not from the Arabic; no contractions on the card. Would a native English editor guess it was translated? If yes, rewrite.
- Terms: Failure Mode is always «أوجه الفشل». FMEA in Arabic is exactly «منهجية هندسة الوقاية (FMEA)». The risk triad in Arabic is exactly «ثلاثية تحديد الخطر (Severity, Occurrence, Detection — S/O/D)»; never «ثلاثية تقييم الخطر» or «ثالوث الخطر». Preventive-engineering cards should avoid technical terms where possible.


### Plain-language gate — required (owner decision, 31 October 2026)
The owner judged the first sample cards unclear in both languages. Before the reviewers, test every hook, value line, short title and teaser with this gate and rewrite until all items pass:
1. Every sentence has a subject and a verb and says one thing. No noun-phrase lists («شركة أرباحها جيدة… ونقدها يضعف»; "good profits on paper, weakening cash").
2. Arabic sentences: about 15 words or fewer. English sentences: about 18 words or fewer, in plain contemporary American English for second-language readers.
3. No idioms («على الورق», "on paper") and no report jargon («لوحة المؤشرات», "dashboard") unless the article defines it on the card. The first mention of an abbreviation (for example FMEA) is expanded in the English text: FMEA (failure mode and effects analysis); in Arabic use exactly «منهجية هندسة الوقاية (FMEA)».
4. The hook states the situation and what is at stake. A reader who knows nothing about the topic can say what went wrong or what is surprising.
5. The value line is something a reader can do or understand without the article. It is not generic advice («cannot rely on one number»).
6. The short title says what the post is (a study, a case, an analysis) and what it is about.
7. Cold-reader test: read the card as if you know nothing about the topic. Can you say in one sentence what the card says and why it matters? If not, rewrite.
8. In English, do not translate the Arabic word by word; rebuild the sentence. Use «Analysis by Dr. Alaa Mohamed Ahmed» (fixed signature), never «From the analysis of».
Signature name (owner decision, 31 October 2026): «د. علاء محمد أحمد» / "Dr. Alaa Mohamed Ahmed", the form used on the site (about.html).

### Editorial standards (summary of the owner's Google Drive standards)
The full standards are in the owner's Google Drive: `10X_ENGLISH_EDITORIAL_TRANSLATION_AND_HUMAN_STYLE_STANDARD.md` and `Arabic_Editorial_and_Publishing_Agent.md`. If this session can read Google Drive, read both before writing. If it cannot, apply this summary strictly.

(The approved examples below come from the earlier wisdom-line format. Use them as references for Arabic and English quality and for the owner's taste, not as the card format.)

Arabic:
- Write as if the text were written in Arabic first: no literal translation, no filler, no repeated words or roots in the same sentence (for example «لا يُستدام… يُستدام»).
- Use direct, analytical, smooth modern فصحى. Balance short and medium sentences. The idea comes before decoration.
- Use correct grammar, hamzas, ة and ى, and Arabic punctuation (، ؛ ؟). Use diacritics only to prevent ambiguity.
- Do not make the wisdom stronger than the source claim. Keep fact, interpretation and conclusion separate.
- Clarity comes first: any reader must understand the sentence on the first reading. Avoid unusual verbs and abstract metaphors (rejected examples: «قد تعبر بالمستشفى هذه الزيارة»، «أن تعود كل ملاحظة إلى أصلها»).
- Example approved by the owner (preferred style, 16 October 2026): «اعتمادية الجودة والتميز تعهّدٌ بأن يلتزم المستشفى بمعاييره كل يوم، لا يوم الزيارة وحده. وإغلاق الملاحظات على عجل لا يفي بهذا التعهّد؛ ما يفي به هو معالجة السبب الحقيقي وراء كل ملاحظة.» Its approved English: «Accreditation is a promise that a hospital meets its standards every day, not only on the day of the visit. Closing findings in a rush cannot keep that promise; fixing the root cause of each finding can.» Pattern: first state the role or purpose of the concept, then the common mistake, then what actually works.
- Earlier example approved by the owner: «إغلاق الملاحظات على عجل قبل زيارة المقيّمين قد يساعد المستشفى على اجتياز الزيارة، لكنه لا يحافظ على الاعتماد. يدوم الاعتماد حين نبحث عن السبب الحقيقي وراء كل ملاحظة، ونعالجه حتى لا تتكرر.»

English (Publication Translation mode):
- Workflow: Arabic → understand → rebuild in English → edit. Never replace Arabic phrases one by one. The English may use a different sentence order and a different image, but it keeps the same idea and the same level of certainty.
- Write plain, precise contemporary American English, with concrete nouns, strong verbs and familiar words. No slang or casual idioms (for example "cleanup sprint"). Avoid contractions in the card text.
- Avoid formulaic patterns: "It is not X; it is Y", "doesn't X… it Y", generic openings, inflated words (transformative, game-changing…), motivational clichés.
- Use the term that fits the context (for example, accreditation "assessment" outside the United States, not "survey").
- Read-aloud test: if the sentence is hard to say naturally, rewrite it. Ask: if the Arabic disappeared, would this read as an original English line by a senior editor? If not, rewrite.

### Post caption (teaser) — required
The caption is where the call to read lives. Write `ar.teaser` (Arabic, 35–75 words) and `en.teaser` (English, 35–75 words, original editorial English), in this order, separated by blank lines:
1. **The same hook as the card** (verbatim or lightly extended; never a different story).
2. **One line** saying what the article answers, without giving the full answer (for example «تروي الحالة كيف … وأين …»).
3. **The call to read**, tied to the article: «📖 اقرأ المقال كاملًا: «<article H1>»» / "Read the full article: <English H1>" (for a case: «اقرأ الحالة كاملة» / "Read the full case"). The scripts add the link line after it.
No internal labels (The 10X Move, عدسة 10X, دليل الأثر), no clichés, no exaggeration, no claim or number that is not in the article. Everything in the caption is checked by the fidelity checker.

### Independent review gate — required (owner decision, 25 October 2026; updated 31 October 2026)
After the checklist and before rendering, run read-only review agents with the Agent tool. They neither edit files nor post.
1. `wisdom-card-fidelity-checker` («فاحص أمانة بطاقات الحكمة للمقال», `.claude/agents/wisdom-card-fidelity-checker.md`): **always required, for every card.** It guards truth. Give it the eight texts (AR_HOOK, AR_VALUE, EN_HOOK, EN_VALUE, AR_POST, EN_POST, plus AR_TITLE_SHORT and EN_TITLE_SHORT) and the article text (or its path). It BLOCKs any hook, value line, short title or caption line that the article does not support.
2. `wisdom-card-clarity-reviewer` («مراجع وضوح بطاقات الحكمة», `.claude/agents/wisdom-card-clarity-reviewer.md`): cold-read test. **Required until 14 November 2026 inclusive; after that date it becomes optional** (run it when a card feels unclear or when the owner asks). Give it **only** the same eight texts, never the article, your reasoning or your verdict. A hook card is PASS only if a cold reader understands what the article is about and why to read it.
Both return the fixed `FORMAT: v2` report with PASS or BLOCK per text and an OVERALL line. Do not send any card while an applicable OVERALL is BLOCK: rewrite and review again, at most **two** rewrite rounds. If it still blocks after two rounds, send the best version with a clear warning to the owner and the unresolved reviewer points. Paste the OVERALL verdicts (and any non-blocking notes) in the delivery message, and add `"review": {"clarity": "PASS|BLOCK|SKIPPED", "fidelity": "PASS|BLOCK", "rounds": n}` to the log line. When the agents' instructions change, rerun `automation/daily-wisdom/reviewer_tests.md` and make sure every case matches its expected verdict.

Before rendering, check every item of WISDOM_WRITING_SKILL.md section 11.7. If any check fails, rewrite.

## 4. Render
1. Write `spec.json` in your scratchpad: `{"out_dir": "<scratchpad dir>", "slug": "<slug>", "ar": {"hook": "...", "value": "...", "title_short": "...", "teaser": "...", "title": "<Arabic H1>", "series": "<label_ar>"}, "en": {"hook": "...", "value": "...", "title_short": "...", "teaser": "...", "title": "<English H1>", "series": "<label_en>"}}`. `hook`, `value`, `title_short` and `series` are drawn on the card; `teaser` and `title` are used by the post scripts (caption and call to read). If the English page does not exist, write an English title that faithfully renders the Arabic title. Old specs with `"wisdom"` still render (the wisdom becomes the hook).
2. Run `node automation/daily-wisdom/render.mjs <spec.json>`.
3. Each output line must show `"tajawal_loaded": true`, `font_px` ≥ 40, `"clipped": false` and `card_words` (Arabic card at most about 40). The script exits with code 2 if the hook would need to go below 40 px, text is clipped, or the font is missing. Open both PNGs and look at them. Check that the Arabic is shaped right-to-left and there are no mixed-direction errors. Fix and render again if needed.

## 5. Deliver
Send both PNGs with `SendUserFile`, using `status: "proactive"` and `display: "render"`. The attachment caption is the Arabic hook and value line, then the English hook and value line, then the article links: `https://tamayuz10x.com/<file>` and `https://tamayuz10x.com/en/<file>`.
End the run with a short final message that has the two post captions (teasers), ready to copy, plus the links.

End the delivery message with this question, in Arabic: «هل توافق على النشر في لينكدإن وصفحة فيسبوك؟ اكتب: نعم، انشر — أو: لا — أو اطلب تعديلًا.» Before the question, show both post texts: run `post_linkedin.py post ... --dry-run` and `post_facebook.py post ... --dry-run` and paste their text. Then stop and wait for the owner's reply.

## 6. Log
1. Right after delivery, append one JSON line to `automation/daily-wisdom/log.jsonl`: `{"slug","focus","article","hook","hook_text":{"ar","en"},"title_short":{"ar","en"},"ar","en","created_at","review","linkedin":"pending","facebook":"pending"}`. `hook` is the hook type (scene / paradox / correction / image / question / warning); `hook_text` holds the two hooks; `title_short` the two short titles; `ar` and `en` stay as in the old schema and now hold **hook + " " + value line** (so older readers of the log keep working). Old lines stay valid; `hook_text` and `title_short` are absent on them. `created_at` is in ISO 8601 format with the +04:00 offset.
2. Commit only that file with the message `Daily wisdom log: <slug>` (hook-card runs use the same message). Push with `git push -u origin ccr-87550695-nqef73`. If the push is rejected because another run pushed first, run `git pull --rebase origin ccr-87550695-nqef73` and push again. Retry up to 4 times on network errors (2s, 4s, 8s, 16s).
3. Do not change any other file. Do not open a pull request.

## 7. Owner decision (later turn in the same session)
- **Explicit approval** (for example «نعم، انشر» or «نعم، انشر على لينكدإن وفيسبوك»): run `python3 -I automation/daily-wisdom/post_linkedin.py post --spec <spec.json> --article <file>`, then `python3 -I automation/daily-wisdom/post_facebook.py post --spec <spec.json> --article <file>`, using the same spec and cards the owner saw. Never post different text or images. If the owner approves only one platform (for example «انشر على لينكدإن فقط»), post only there. Send the owner the post links, and update this run's log line with `"linkedin"` and `"facebook"` post ids (or `"skipped"`). If one platform fails, still report the other one's result. Commit and push as in step 6.
- **Rejection** («لا»): post nothing. Set `"linkedin"` and `"facebook"` to `"rejected"` in the log line, then commit and push.
- **Edit request**: change only what the owner asked, follow sections 3 and 4 again, send the new cards, and ask the same approval question again. The approval must be for the final version.
- An unclear reply is not approval. Ask again.
- If posting fails (for example, an expired token: LinkedIn error 401, Facebook error 190), report the exact error. Do not retry with other credentials. The LinkedIn token is renewed about every 60 days through the LinkedIn token generator. The Facebook Page token is a long-lived Page token. Both are kept in the environment's Network secrets.
