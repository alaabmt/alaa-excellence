# Unified article covers

The requested visual reference is the published Maryam story card: landscape
photography fading into navy, cream headlines, restrained gold accents, the
Tamayuz 10X identity and the author's name. The Maryam source art is retained.

The initial rollout covers all 35 published article, case, idea and reflection
pages, with a separate Arabic and English image for each. Drafts and redirects
remain excluded. Collection membership is unchanged.

## Sources and layout

- `data/article-covers.json` is the reviewed bilingual copy and asset manifest.
- `assets/previews/story-backgrounds/` contains 34 generated illustrations.
  Each is conceptual imagery, not documentary evidence of the named institution.
  Article figures label these as illustrative images.
- The illustration brief is a horizontal editorial photograph in warm gold and
  deep navy: a subject-specific scene at the left, fading into a dark, uncluttered
  reading area at the right. No generated text, logos, numerical claims or charts.
  Religious reflections use settings and objects without depicting prophets.
- `scripts/generate_story_covers.py` adds typography using Amiri and native RAQM
  Arabic shaping. It does not use generated lettering. A soft navy reading panel
  provides consistent text contrast across the photographs.
- `assets/previews/story/` contains the 70 final 1200 × 630 JPEG files. Each is
  below 170,000 bytes, with a 160,000-byte rendering target.
- `assets/css/story-cards.css` controls the shared card appearance. Images keep
  their complete aspect ratio, including on narrow screens and hover.

## Updating an article cover

Add or revise the reviewed short headline, subtitle and localized alt text in
the manifest. Choose an illustration grounded in the article's subject. Claims
must continue to comply with the case evidence standard; the initial set uses
qualitative headlines and no new numerical claims.

```bash
python scripts/generate_story_covers.py
python scripts/sync_story_covers.py
python scripts/check_story_covers.py
python scripts/check_article_dates.py
python scripts/site_health_audit.py
```

The synchronization script updates social image metadata, Article schema images,
page covers and collection cards. It leaves article prose, editorial English,
canonical URLs, publication dates and audio layers unchanged. The social-card
workflow runs these checks and requests a Pages build if it commits generated
assets. Inspect the images visually as well as running the automated checks.
