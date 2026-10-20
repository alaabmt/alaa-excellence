# Resumable Qur’anic Reflections Workflow

This directory is the durable working memory for the Tamayuz 10X Qur’anic reflections publishing workflow.

## Source of truth

- Current checkpoint: `automation/quran-reflections-state.json`
- Published-topic registry: `data/quranic-reflection-topics.json`
- Editorial guide: the connected Google Drive document named `دليل مهارات كتابة التأملات القرآنية | التميّز 10X`
- Repository instructions and current templates on `main`

A scheduled run must not rely on chat memory. It must read the checkpoint, registry, repository instructions, and saved article artifacts before doing work.

## Stage protocol

Use this order:

1. `capability_check`
2. `load_checkpoint`
3. `duplicate_check`
4. `topic_selection`
5. `research`
6. `quran_verification`
7. `arabic_draft`
8. `independent_critique`
9. `english_draft`
10. `bilingual_parity`
11. `quality_gate`
12. `repository_publish`
13. `actions_and_pages`
14. `live_verification`
15. `completion_report`
16. `completed`

After every completed stage, update and commit the checkpoint before starting the next stage. Also save or update the relevant artifact in:

`automation/quran-reflections/<slug>/`

Use these filenames while work is incomplete:

- `research-notes.md`
- `draft-ar.md`
- `draft-en.md`
- `quality-review.md`
- `publication-report.md`

Published HTML pages are the final authoritative article versions. The checkpoint must point to them after publication.

## Resume and retry rules

- Read `next_action` and resume the first unfinished stage.
- Never restart research or drafting merely because a new scheduled run began.
- If usage or capability limits stop a run, do not erase or advance the checkpoint. Record `workflow_status: retry_waiting`, the blocker, and the same `next_action` when a safe write remains possible. Otherwise leave the last valid checkpoint untouched.
- Retry at the next hourly run. A usage reset is not itself a trigger.
- Never publish twice. Check the checkpoint, topic registry, repository pages, article indexes, sitemap, and live URLs.
- Start at most one article per Asia/Dubai calendar day. If the current day's article is complete, the hourly run is a no-op.
- Start a new article only after the previous one is `completed` or explicitly `blocked`.
- Do not mark publication complete until GitHub Actions, GitHub Pages, the two live pages, and their index entries are verified.
