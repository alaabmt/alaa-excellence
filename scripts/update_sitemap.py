#!/usr/bin/env python3
from __future__ import annotations

import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

SITE = "https://tamayuz10x.com"
SITEMAP = Path("sitemap.xml")
ROBOTS = Path("robots.txt")
ARTICLES = Path("articles.html")
CONTENT_PREFIXES = ("case-", "article-", "idea-")


class HeadMetaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.canonical: str | None = None
        self.robots = ""

    def handle_starttag(self, tag: str, attrs):
        data = {str(k).lower(): (v or "") for k, v in attrs}
        tag = tag.lower()
        if tag == "link" and data.get("rel", "").lower() == "canonical":
            self.canonical = data.get("href", "").strip()
        elif tag == "meta" and data.get("name", "").lower() == "robots":
            self.robots = data.get("content", "").lower()


def git_lastmod(path: Path) -> str:
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", str(path)],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()
    if not result:
        raise RuntimeError(f"No git history found for {path}")
    return result


def parse_page(path: Path) -> tuple[str | None, bool]:
    parser = HeadMetaParser()
    parser.feed(path.read_text(encoding="utf-8", errors="strict"))
    return parser.canonical, "noindex" in parser.robots


def validate_canonical(path: Path, canonical: str) -> None:
    parsed = urlparse(canonical)
    if parsed.scheme != "https" or parsed.netloc != "tamayuz10x.com":
        raise RuntimeError(f"Invalid canonical domain/scheme in {path}: {canonical}")
    if parsed.query or parsed.fragment:
        raise RuntimeError(f"Canonical must not contain query/fragment in {path}: {canonical}")


def discover_indexable_pages() -> list[tuple[str, Path, str]]:
    rows: list[tuple[str, Path, str]] = []
    seen: set[str] = set()
    for path in sorted(Path(".").glob("*.html")):
        canonical, noindex = parse_page(path)
        if noindex or not canonical:
            continue
        validate_canonical(path, canonical)
        if canonical in seen:
            raise RuntimeError(f"Duplicate canonical detected: {canonical}")
        seen.add(canonical)
        rows.append((canonical, path, git_lastmod(path)))
    if f"{SITE}/" not in seen:
        raise RuntimeError("Homepage canonical is missing from discovered indexable pages")
    return rows


def validate_content_links(rows: list[tuple[str, Path, str]]) -> None:
    library = ARTICLES.read_text(encoding="utf-8")
    missing: list[str] = []
    for _, path, _ in rows:
        if path.name.startswith(CONTENT_PREFIXES) and f'href="{path.name}"' not in library:
            missing.append(path.name)
    if missing:
        raise RuntimeError(
            "Indexable content pages missing an internal link from articles.html: "
            + ", ".join(missing)
        )


def validate_robots() -> None:
    text = ROBOTS.read_text(encoding="utf-8")
    expected = f"Sitemap: {SITE}/sitemap.xml"
    if expected not in text:
        raise RuntimeError(f"robots.txt must contain: {expected}")


def write_sitemap(rows: list[tuple[str, Path, str]]) -> None:
    ns = "http://www.sitemaps.org/schemas/sitemap/0.9"
    ET.register_namespace("", ns)
    root = ET.Element(f"{{{ns}}}urlset")

    def sort_key(row):
        url, path, _ = row
        return (0 if path.name == "index.html" else 1, url)

    for url, _, lastmod in sorted(rows, key=sort_key):
        node = ET.SubElement(root, f"{{{ns}}}url")
        ET.SubElement(node, f"{{{ns}}}loc").text = url
        ET.SubElement(node, f"{{{ns}}}lastmod").text = lastmod

    tree = ET.ElementTree(root)
    ET.indent(tree, space="  ")
    tree.write(SITEMAP, encoding="utf-8", xml_declaration=True)
    SITEMAP.write_text(SITEMAP.read_text(encoding="utf-8") + "\n", encoding="utf-8")
    ET.parse(SITEMAP)


def main() -> int:
    validate_robots()
    rows = discover_indexable_pages()
    validate_content_links(rows)
    write_sitemap(rows)
    print(f"Sitemap validated and generated with {len(rows)} indexable URLs.")
    print("lastmod values come from each page's latest Git commit date; they are not forced to today's date.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"SEO crawlability gate failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
