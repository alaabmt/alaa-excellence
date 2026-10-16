# Evening Quranic Reflection Card — run instructions

Each run (once a day, 21:00 Dubai) produces **one Arabic card** from **one** article in the series «تأملات قرآنية في القيادة» (`reflection-*.html`). The card shows **one verse copied exactly from the article**, its reference, then **one leadership lesson**. The card goes to the owner for approval. After an explicit approval it is posted **to the Facebook Page only**. It is never posted anywhere else.

- Repository: `alaabmt/alaa-excellence`. State branch: `ccr-87550695-nqef73`. Folder: `automation/daily-wisdom/`
- Log: `automation/daily-wisdom/log_reflections.jsonl`. Pushes to the state branch are allowed **only** for this log file.

## 1. Prepare
1. Use `/home/user/alaa-excellence` (clone it if missing). Run `git fetch origin ccr-87550695-nqef73 && git checkout -B ccr-87550695-nqef73 origin/ccr-87550695-nqef73`.
2. Read the **Arabic** rules in `PROMPT.md` section 3 (editorial standards and the owner-approved examples). They apply here too.
3. Slug = `YYYY-MM-DD-2100` (Asia/Dubai date). If `log_reflections.jsonl` already has this slug, stop.

## 2. Choose the article and the verse
1. Among `reflection-*.html`, pick the article with the fewest log entries; on a tie, the least recently used. Never pick the same article as the previous entry.
2. Extract the text with `python3 -I automation/daily-wisdom/extract_text.py <file>`. Read every earlier log entry for this article; choose a **different verse or a different lesson**.
3. Choose one verse or a meaningful part of a verse that appears in the article between ﴿ ﴾. **Copy it character for character from the article**, with all diacritics. Never type a verse from memory, never correct it, never shorten it in the middle of a word, and never join two passages that the article quotes separately.
4. Run `python3 -I automation/daily-wisdom/verify_verse.py <file> "<verse>"`. It must print `OK`. If it prints `FAIL`, copy the verse again from the article. Never render a card that failed this check.
5. The reference is the one the article gives for that quotation (for example «الكهف: 94–95»). If the article gives no reference for it, show only the surah name if the article states it; never guess verse numbers.

## 3. Write the lesson
- One leadership lesson, 15–30 words, taken from the article's own reflection on this verse. Clear on the first reading.
- The articles state that they are contemporary reflections (تأملات تدبرية), not a new tafsir. The lesson must keep that position: present it as a lesson drawn from the scene. Never present a management idea as the meaning of the verse, and never attribute to the verse a meaning that the article does not give it.
- No sensational claims, no numbers, no fatwa-style language, no comparisons between prophets or between people.

### Post caption (teaser) — required
The post text is a small promise of knowledge that invites the reader to open the article (master manual §10), not a copy of the card. Write `ar.teaser` (Arabic, 45–90 words):
1. Open with the scene, tension, paradox or question that makes the article worth reading, drawn from the article itself.
2. One or two questions the article answers, without giving the full answer.
3. One short line on why it matters to a leader or an organization.
4. End with a call to read that is tied to the idea: «📖 اقرأ … كاملًا: «<article title>»». The script adds the link.
Do not use internal labels (The 10X Move, عدسة 10X, دليل الأثر), clichés, exaggeration, numbers or claims that are not in the article. The approved model is the Dhul-Qarnayn reflection caption of 16 October 2026: «عرض القوم على ذي القرنين المال ليحلّ مشكلتهم عنهم، فطلب منهم شيئًا آخر: أن يعينوه بقوتهم. لماذا لم يكتفِ بأن يحلّها وحده؟ …».

## 4. Render
1. Spec in your scratchpad: `{"out_dir": "...", "slug": "<slug>", "theme": "<theme from config.json → reflection_theme>", "ar": {"verse": "...", "verse_ref": "...", "wisdom": "...", "teaser": "...", "title": "<article H1>", "series": "تأملات قرآنية في القيادة"}}`. There is no English card and no author photo.
2. `node automation/daily-wisdom/render_reflection.mjs <spec.json>`. Check `tajawal_loaded: true`, then open the PNG and look at it. The verse must be fully visible, the diacritics clear, and the reference digits in the right order.

## 5. Deliver and ask
Send the PNG with `SendUserFile` (`status: "proactive"`, `display: "render"`). Show the Facebook caption from `python3 -I automation/daily-wisdom/post_facebook.py post --spec <spec.json> --article <file> --dry-run`. Then ask, in Arabic: «هل توافق على نشر بطاقة التأمل على صفحة فيسبوك؟ اكتب: نعم، انشر التأمل — أو: لا — أو اطلب تعديلًا.» Stop and wait.

## 6. Log
Right after delivery, append `{"slug","article","verse","verse_ref","wisdom","created_at","facebook":"pending"}` to `log_reflections.jsonl`. Commit only that file (`Reflection log: <slug>`) and push to `ccr-87550695-nqef73`. On a rejected push, run `git pull --rebase` and push again.

## 7. Owner decision (later turn in the same session)
- **Explicit approval** (for example «نعم، انشر التأمل»): run `post_facebook.py post --spec <spec.json> --article <file>` with exactly the card the owner saw. Send the link and set `"facebook": "<post id>"` in the log line, then commit and push.
- **Rejection** («لا»): post nothing; set `"facebook": "rejected"`, then commit and push.
- **Edit request**: change only what was asked, run `verify_verse.py` again if the verse changed, re-render, and ask again.
- An unclear reply is not approval. If posting fails (for example a Facebook error 190), report the exact error and do not retry with other credentials.
