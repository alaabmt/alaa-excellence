# Daily Wisdom Card — run instructions

Each run (once a day, 09:00 Dubai) produces **one wisdom** taken from **one** Tamayuz 10X article, rendered as two cards (Arabic and English), and sends them to the owner with the ready LinkedIn post text. The owner then approves or rejects the post. A post goes to LinkedIn **only after the owner's explicit approval in this session** (step 7). Never post anything to any other website, social network or external service.

- Repository: `alaabmt/alaa-excellence`
- State branch (config, renderer, log): `ccr-87550695-nqef73`. The owner allows pushes to this branch **only** for appending to `automation/daily-wisdom/log.jsonl`.
- Folder: `automation/daily-wisdom/`

## 1. Prepare
1. Use the existing clone at `/home/user/alaa-excellence`. If it does not exist, clone the repository there. Then `git fetch origin ccr-87550695-nqef73 && git checkout -B ccr-87550695-nqef73 origin/ccr-87550695-nqef73`.
2. Read `10X_Agent_AI_Master_Operating_Manual_AR.md`, sections 3–6 (philosophy, voice, editorial rule, terms). If the focus is `preventive-engineering`, also read `AGENTS.md`, item 2.
3. Get the current date and time in `Asia/Dubai` (`TZ=Asia/Dubai date`). The slot is the nearest entry in `config.json → slots`. Slug = `YYYY-MM-DD-HHMM` of that slot, for example `2026-10-16-0900`.
4. If `log.jsonl` already has a line with this slug, stop. That slot is already done.

## 2. Choose the article
1. Focus = `config.json → months["YYYY-MM"]`. If that key is missing, use `default_focus`. Expand the `files` globs for that focus in the repository root. These are the Arabic pages. The English page has the same file name under `en/`.
2. Among those files, choose the article with the **fewest** log entries for this focus. On a tie, choose the one used least recently. Never choose the same article as the previous log line, unless the focus has only one article.
3. Extract the text: `python3 -I automation/daily-wisdom/extract_text.py <file>`. Do this for the Arabic page and, when it exists, the English page. Use the article title from the page `<h1>` (the first heading line), not the `<title>` suffixes.
4. Read every earlier log entry for this article. The new wisdom must express a **different idea**.

## 3. Write the wisdom
A wisdom is **one idea**, stated as a lesson that also holds outside the article. It is not a summary of the article.

Length: not short and not long.
- Arabic: 18–35 words, in one or two sentences.
- English: 20–38 words, in one or two sentences.

Content rules:
- The idea must come clearly from the article's own argument. Do not add claims, numbers, percentages, organization names or results. Do not state or imply that anything was proven unless the article says so.
- No statistics at all. A wisdom carries an idea, not data.
- No talk about the reader or the writing ("in this article", "you will learn"…). No clichés such as «في عالم سريع التغير».
- Arabic: modern, natural فصحى that reads as written in Arabic from the start (Executive Analytical Arabic — Tamayuz 10X style). Use correct spelling and hamzas.
- English: an original editorial line in US spelling. It is not a translation of the Arabic. It keeps the same idea and the same level of certainty. Apply this test: would a native English editor guess it was translated? If yes, rewrite it.
- The Arabic term for Failure Mode is always «أوجه الفشل», never «وجوه الفشل».
- Preventive engineering focus: it is better to avoid technical terms. If FMEA is mentioned in Arabic, write exactly «منهجية هندسة الوقاية (FMEA)». If the three risk dimensions are named together in Arabic, write exactly «ثلاثية تحديد الخطر (Severity, Occurrence, Detection — S/O/D)». Never use «ثلاثية تقييم الخطر» or «ثالوث الخطر».
- Quranic reflections focus: do not quote or paraphrase verses on the card. Give the leadership lesson as the article states it. Do not give any verse a meaning that the article does not give it.
- The wisdom must not repeat or closely paraphrase any earlier wisdom in `log.jsonl`.

### Editorial standards (summary of the owner's Google Drive standards)
The full standards are in the owner's Google Drive: `10X_ENGLISH_EDITORIAL_TRANSLATION_AND_HUMAN_STYLE_STANDARD.md` and `Arabic_Editorial_and_Publishing_Agent.md`. If this session can read Google Drive, read both before writing. If it cannot, apply this summary strictly.

Arabic:
- Write as if the text were written in Arabic first: no literal translation, no filler, no repeated words or roots in the same sentence (for example «لا يُستدام… يُستدام»).
- Use direct, analytical, smooth modern فصحى. Balance short and medium sentences. The idea comes before decoration.
- Use correct grammar, hamzas, ة and ى, and Arabic punctuation (، ؛ ؟). Use diacritics only to prevent ambiguity.
- Do not make the wisdom stronger than the source claim. Keep fact, interpretation and conclusion separate.
- Clarity comes first: any reader must understand the sentence on the first reading. Avoid unusual verbs and abstract metaphors (rejected examples: «قد تعبر بالمستشفى هذه الزيارة»، «أن تعود كل ملاحظة إلى أصلها»).
- Example approved by the owner: «إغلاق الملاحظات على عجل قبل زيارة المقيّمين قد يساعد المستشفى على اجتياز الزيارة، لكنه لا يحافظ على الاعتماد. يدوم الاعتماد حين نبحث عن السبب الحقيقي وراء كل ملاحظة، ونعالجه حتى لا تتكرر.»

English (Publication Translation mode):
- Workflow: Arabic → understand → rebuild in English → edit. Never replace Arabic phrases one by one. The English may use a different sentence order and a different image, but it keeps the same idea and the same level of certainty.
- Write plain, precise contemporary American English, with concrete nouns, strong verbs and familiar words. No slang or casual idioms (for example "cleanup sprint"). Avoid contractions in the card text.
- Avoid formulaic patterns: "It is not X; it is Y", "doesn't X… it Y", generic openings, inflated words (transformative, game-changing…), motivational clichés.
- Use the term that fits the context (for example, accreditation "assessment" outside the United States, not "survey").
- Read-aloud test: if the sentence is hard to say naturally, rewrite it. Ask: if the Arabic disappeared, would this read as an original English line by a senior editor? If not, rewrite.

Before rendering, check every item: one idea? Supported by the article? Word counts in range? No numbers? English reads as natively written? Different from the log? If any check fails, rewrite.

## 4. Render
1. Write `spec.json` in your scratchpad: `{"out_dir": "<scratchpad dir>", "slug": "<slug>", "ar": {"wisdom": "...", "title": "<Arabic H1>", "series": "<label_ar>"}, "en": {"wisdom": "...", "title": "<English H1>", "series": "<label_en>"}}`. If the English page does not exist, write an English title that faithfully renders the Arabic title.
2. Run `node automation/daily-wisdom/render.mjs <spec.json>`.
3. Each output line must show `"tajawal_loaded": true` and `font_px` ≥ 40. Open both PNGs and look at them. Check that nothing is clipped, the Arabic is shaped right-to-left, and there are no mixed-direction errors. Fix the problem and render again if needed.

## 5. Deliver
Send both PNGs with `SendUserFile`, using `status: "proactive"` and `display: "render"`. The caption is the Arabic wisdom, then the English wisdom, then the article links: `https://tamayuz10x.com/<file>` and `https://tamayuz10x.com/en/<file>`.
End the run with a short final message that has the same two texts, ready to copy as post captions, plus the links.

End the delivery message with this question, in Arabic: «هل توافق على نشر هذا المنشور على حسابك في لينكدإن؟ اكتب: نعم، انشر على لينكدإن — أو: لا — أو اطلب تعديلًا.» Then stop and wait for the owner's reply.

## 6. Log
1. Right after delivery, append one JSON line to `automation/daily-wisdom/log.jsonl`: `{"slug","focus","article","ar","en","created_at","linkedin":"pending"}`. `created_at` is in ISO 8601 format with the +04:00 offset.
2. Commit only that file with the message `Daily wisdom log: <slug>`. Push with `git push -u origin ccr-87550695-nqef73`. If the push is rejected because another run pushed first, run `git pull --rebase origin ccr-87550695-nqef73` and push again. Retry up to 4 times on network errors (2s, 4s, 8s, 16s).
3. Do not change any other file. Do not open a pull request.

## 7. Owner decision (later turn in the same session)
- **Explicit approval** (for example «نعم، انشر على لينكدإن»): run `python3 -I automation/daily-wisdom/post_linkedin.py post --spec <spec.json> --article <file>`, using the same spec and cards the owner saw. Never post different text or images. Then send the owner the post link, and update this run's log line to `"linkedin": "<post id>"`. Commit and push as in step 6.
- **Rejection** («لا»): post nothing. Update the log line to `"linkedin": "rejected"`, then commit and push.
- **Edit request**: change only what the owner asked, follow sections 3 and 4 again, send the new cards, and ask the same approval question again. The approval must be for the final version.
- An unclear reply is not approval. Ask again.
- If posting fails (for example, the token expired, error 401), report the exact error. Do not retry with other credentials. The token is renewed about every 60 days through the LinkedIn token generator and saved in the environment's Network secrets.
