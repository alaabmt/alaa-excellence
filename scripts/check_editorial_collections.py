#!/usr/bin/env python3
"""Verify that Tamayuz 10X Quranic reflection collections match main article indexes.

This checks source-content consistency. It does not assert Google indexing,
validate theological interpretation, or verify publication dates independently.
"""
from __future__ import annotations
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CARD_RE = re.compile(r"<article\b(?P<attrs>[^>]*)>(?P<body>.*?)</article>", re.I | re.S)
ATTR_RE = re.compile(r'([\w:-]+)\s*=\s*([\x22\x27])(.*?)\2', re.S)
HEADING_RE = re.compile(r"<h3\b[^>]*>(.*?)</h3>", re.I | re.S)
HTML_RE = re.compile(r"<[^>]+>")


def attrs(raw: str) -> dict[str, str]:
    return {key.lower(): html.unescape(value) for key, _, value in ATTR_RE.findall(raw)}


def parse_cards(file: Path) -> list[dict[str, str]]:
    content = file.read_text(encoding="utf-8")
    rows: list[dict[str, str]] = []
    for match in CARD_RE.finditer(content):
        data = attrs(match.group("attrs"))
        if "article-card" not in data.get("class", "").split():
            continue
        slug = data.get("data-href", "")
        title_match = HEADING_RE.search(match.group("body"))
        title = re.sub(r"\s+", " ", html.unescape(HTML_RE.sub("", title_match.group(1)))).strip() if title_match else ""
        rows.append({"slug": slug, "category": data.get("data-category", ""),
                     "date": data.get("data-date", ""), "title": title,
                     "minutes": data.get("data-read-minutes", "")})
    return rows


def main() -> int:
    problems: list[str] = []
    warnings: list[str] = []
    stats: dict[str, int] = {}
    registry = json.loads((ROOT / "data/article-publication-dates.json").read_text(encoding="utf-8"))

    for lang in ("ar", "en"):
        directory = ROOT if lang == "ar" else ROOT / "en"
        index = parse_cards(directory / "articles.html")
        library = parse_cards(directory / "quranic-reflections.html")
        from_index = [row for row in index if "quranic" in row["category"].split()]
        by_slug = {row["slug"]: row for row in library}
        stats[lang + "_indexed_reflections"] = len(from_index)
        stats[lang + "_collection_reflections"] = len(library)
        if len(by_slug) != len(library):
            problems.append(lang + ": duplicate reflection cards in collection")
        missing = [row["slug"] for row in from_index if row["slug"] not in by_slug]
        extra = [row["slug"] for row in library if row["slug"] not in {x["slug"] for x in from_index}]
        if missing:
            problems.append(lang + ": missing reflection cards: " + ", ".join(missing))
        if extra:
            problems.append(lang + ": collection cards not in article index: " + ", ".join(extra))
        for row in from_index:
            partner = by_slug.get(row["slug"])
            if partner:
                for field in ("date", "title", "minutes"):
                    if row[field] != partner[field]:
                        problems.append(f"{lang}/{row['slug']}: {field} differs between indexes")
            if row["slug"] not in registry:
                warnings.append(f"{lang}/{row['slug']}: publication date not verified in registry")
        for row in from_index:
            if not (directory / row["slug"]).is_file():
                problems.append(f"{lang}/{row['slug']}: article file missing")

    english = {r["slug"] for r in parse_cards(ROOT / "en/articles.html")}
    for row in [x for x in parse_cards(ROOT / "articles.html") if "quranic" in x["category"].split()]:
        if row["slug"] not in english:
            warnings.append(f"{row['slug']}: no English article counterpart in index")

    # Recognize stand-alone indexable reflections not discoverable through either library.
    for lang, directory in (("ar", ROOT), ("en", ROOT / "en")):
        listed = {x["slug"] for x in parse_cards(directory / "articles.html")}
        for file in directory.glob("reflection-*.html"):
            if file.name not in listed:
                source = file.read_text(encoding="utf-8")
                if not re.search(r"noindex", source[: source.find("</head>")], re.I):
                    warnings.append(f"{lang}/{file.name}: indexable reflection is absent from index/library")

    print("TAMAYUZ EDITORIAL COLLECTION AUDIT")
    print(json.dumps(stats, ensure_ascii=False, sort_keys=True))
    for warning in sorted(set(warnings)):
        print("WARNING:", warning)
    for problem in problems:
        print("ERROR:", problem)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
