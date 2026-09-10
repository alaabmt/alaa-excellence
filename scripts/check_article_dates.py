#!/usr/bin/env python3
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "data" / "article-publication-dates.json"
INDEXES = [ROOT / "articles.html", ROOT / "en" / "articles.html"]

CARD_RE = re.compile(r'<article class="article-card"(?P<attrs>[^>]*)>(?P<body>.*?)</article>', re.S)
ATTR_RE = re.compile(r'([\w-]+)="([^"]*)"')
TIME_RE = re.compile(r'<time[^>]*datetime="(\d{4}-\d{2}-\d{2})"[^>]*>')
META_PUBLISHED_RE = re.compile(r'<meta[^>]+property="article:published_time"[^>]+content="(\d{4}-\d{2}-\d{2})"|<meta[^>]+content="(\d{4}-\d{2}-\d{2})"[^>]+property="article:published_time"')
JSON_PUBLISHED_RE = re.compile(r'"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"')
JSON_MODIFIED_RE = re.compile(r'"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"')


def fail(errors):
    print("\nARTICLE DATE INTEGRITY: FAILED")
    for e in errors:
        print(f"- {e}")
    sys.exit(1)


def extract_cards(path):
    html = path.read_text(encoding="utf-8")
    cards = {}
    for m in CARD_RE.finditer(html):
        attrs = dict(ATTR_RE.findall(m.group("attrs")))
        href = attrs.get("data-href")
        if not href:
            continue
        slug = Path(href).name
        t = TIME_RE.search(m.group("body"))
        cards[slug] = {
            "data_date": attrs.get("data-date"),
            "visible_date": t.group(1) if t else None,
        }
    return cards


def first_group(match):
    if not match:
        return None
    return next((g for g in match.groups() if g), None)


def page_dates(path):
    html = path.read_text(encoding="utf-8")
    meta = first_group(META_PUBLISHED_RE.search(html))
    schema = JSON_PUBLISHED_RE.search(html)
    modified = JSON_MODIFIED_RE.search(html)
    return meta, schema.group(1) if schema else None, modified.group(1) if modified else None


def main():
    errors = []
    if not REGISTRY.exists():
        fail(["Missing data/article-publication-dates.json"])
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))

    index_cards = {p: extract_cards(p) for p in INDEXES if p.exists()}
    all_index_slugs = set().union(*(set(v) for v in index_cards.values())) if index_cards else set()

    # Every indexed article must have an immutable publication-date registry entry.
    for slug in sorted(all_index_slugs):
        if slug not in registry:
            errors.append(f"{slug}: indexed but missing from publication-date registry")

    # Registry entries must be valid dates and must not be in the future.
    today = date.today()
    for slug, published in registry.items():
        try:
            d = date.fromisoformat(published)
        except ValueError:
            errors.append(f"{slug}: invalid registry date {published}")
            continue
        if d > today:
            errors.append(f"{slug}: publication date {published} is in the future")

    # Card date and visible card time must equal the registry in both languages.
    for index_path, cards in index_cards.items():
        for slug, values in cards.items():
            expected = registry.get(slug)
            if not expected:
                continue
            if values["data_date"] != expected:
                errors.append(f"{index_path.relative_to(ROOT)} / {slug}: data-date={values['data_date']} but registry={expected}")
            if values["visible_date"] != expected:
                errors.append(f"{index_path.relative_to(ROOT)} / {slug}: visible <time>={values['visible_date']} but registry={expected}")

    # Arabic and English article metadata/Schema must equal the same registry date.
    for slug, expected in registry.items():
        for path in [ROOT / slug, ROOT / "en" / slug]:
            if not path.exists():
                continue
            meta, schema, modified = page_dates(path)
            if meta and meta != expected:
                errors.append(f"{path.relative_to(ROOT)}: article:published_time={meta} but registry={expected}")
            if schema and schema != expected:
                errors.append(f"{path.relative_to(ROOT)}: Schema datePublished={schema} but registry={expected}")
            if modified:
                try:
                    if date.fromisoformat(modified) < date.fromisoformat(expected):
                        errors.append(f"{path.relative_to(ROOT)}: dateModified {modified} is earlier than datePublished {expected}")
                except ValueError:
                    errors.append(f"{path.relative_to(ROOT)}: invalid dateModified {modified}")

    if errors:
        fail(errors)

    print("ARTICLE DATE INTEGRITY: PASSED")
    print(f"Checked {len(registry)} registered publication dates across Arabic/English indexes and article metadata.")


if __name__ == "__main__":
    main()
