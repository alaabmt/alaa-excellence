---
name: tamayuz-publish-check
description: Pre-publish quality gate for Tamayuz 10X pages (cases, articles, Quranic reflections, Agentic AI pieces). Use it before committing or merging any new or edited bilingual page on tamayuz10x.com, or when asked to "check", "verify" or "publish" a page. Runs the repo's checks, then verifies parity, phone layout and live URLs.
---

# Tamayuz 10X publish check

Use this skill when a page pair (Arabic at the repo root, English in `en/`) is new or has changed. It does not write content. It verifies a page before it goes live.

## Before you start

1. Read `AGENTS.md` and follow it. It lists which standards apply to the page type (executive summary, social preview, Preventive Engineering / FMEA).
2. Never invent a number or claim. Every figure must come from a source that was actually opened.

## Run the repo checks

Run these from the repo root. All must pass before commit.

```
python3 scripts/check_story_covers.py
python3 scripts/check_article_dates.py
python3 scripts/check_editorial_collections.py
python3 scripts/enforce_language_runtime_isolation.py
python3 scripts/check_preventive_engineering_arabic_terms.py
python3 scripts/site_health_audit.py
python3 scripts/update_sitemap.py
```

- `enforce_language_runtime_isolation.py` only checks by default. Its `--fix` flag edits English pages, so use it only on purpose.
- `site_health_audit.py` may fail locally only because of duplicate canonicals under `.claude/worktrees/`. Run it from a clean checkout, or let CI decide.
- Run `update_sitemap.py` after the page is committed, because it reads git history. Commit the result.

## Check the page pair by hand

- Dates: register the UTC date in `data/article-publication-dates.json` for both pages. A future date fails CI.
- Cards: add a card at the top of `articles.html` and `en/articles.html` (and the matching hub or collection page). CI fails when a page has no internal link from its library.
- Cover: add the entry in `data/article-covers.json`, then run `scripts/generate_story_covers.py --slug <slug>` and `scripts/sync_story_covers.py`. Look at both covers.
- Parity: the Arabic and English pages must have the same `h2` sequence and the same citations.
- Reading time: Arabic is counted at 150 words per minute and English at 170.
- Arabic style: write native Arabic, not a translated structure. No «label: explanation» headings, no slogan headings, and full sentences in cards and lists. The exact Arabic name is **منهجية هندسة الوقاية (FMEA)**. Do not write bare S/O/D in Arabic.
- Editorial disclaimer: present on every article page.

## Check the phone and audio behavior

- At a 390 px viewport there must be no horizontal scroll.
- With a mocked `window.speechSynthesis` (make `getVoices()` return `[]`), starting the listener must give the H1 the class `.tenx-reading-now` and show `.tenx-floating-audio.is-active`.

## Publish and verify

1. Commit, push to the designated branch, and open a pull request.
2. Wait for every CI check to pass on the head commit. Do not merge on a red check.
3. Merge only with the owner's approval of that specific page. Pass the full 40-character head SHA as `expectedHeadSha`.
4. After the merge, wait for the GitHub Pages deployment, then confirm that both new URLs return 200. GitHub Pages can lag by 30 minutes or more. Say "live" only after the URLs return 200.

## Report

Report in Arabic, right to left, with tables starting from the right-most column. State what passed, what failed, and what was not checked. Do not claim a check that was not run.
