#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
SITE_HOSTS = {"tamayuz10x.com", "www.tamayuz10x.com"}
SKIP_DIRS = {".git", ".github", "node_modules", "vendor"}
SKIP_SCHEMES = {"mailto", "tel", "javascript", "data", "blob"}
REF_ATTRS = {"href", "src", "poster"}
MAX_DETAILS = 120


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.html_attrs: dict[str, str] = {}
        self.title_parts: list[str] = []
        self._in_title = False
        self.description = ""
        self.robots = ""
        self.canonical = ""
        self.refresh = ""
        self.hreflangs: dict[str, str] = {}
        self.ids: list[tuple[str, int]] = []
        self.refs: list[tuple[str, str, str, int]] = []
        self.images_without_alt: list[int] = []
        self.visible_literal_escapes: list[tuple[int, str]] = []
        self._text_ignored_depth = 0

    def handle_starttag(self, tag: str, attrs) -> None:
        self._handle_tag(tag, attrs)

    def handle_startendtag(self, tag: str, attrs) -> None:
        self._handle_tag(tag, attrs)

    def _handle_tag(self, tag: str, attrs) -> None:
        tag = tag.lower()
        data = {str(k).lower(): (v or "") for k, v in attrs}
        line, _ = self.getpos()

        if tag == "html" and not self.html_attrs:
            self.html_attrs = data

        if tag == "title":
            self._in_title = True
        if tag in {"script", "style"}:
            self._text_ignored_depth += 1

        if data.get("id"):
            self.ids.append((data["id"], line))

        for attr in REF_ATTRS:
            value = data.get(attr, "").strip()
            if value:
                self.refs.append((tag, attr, value, line))

        if tag == "img" and "alt" not in data:
            self.images_without_alt.append(line)

        if tag == "meta":
            name = data.get("name", "").lower()
            if name == "description":
                self.description = data.get("content", "").strip()
            elif name == "robots":
                self.robots = data.get("content", "").lower()
            if data.get("http-equiv", "").lower() == "refresh":
                self.refresh = data.get("content", "").strip()

        if tag == "link":
            rel_tokens = {x.lower() for x in data.get("rel", "").split()}
            href = data.get("href", "").strip()
            if "canonical" in rel_tokens:
                self.canonical = href
            if "alternate" in rel_tokens and data.get("hreflang") and href:
                self.hreflangs[data["hreflang"].lower()] = href

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "title":
            self._in_title = False
        if tag in {"script", "style"} and self._text_ignored_depth:
            self._text_ignored_depth -= 1

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)
        if not self._text_ignored_depth and ("\\n" in data or "\\r" in data):
            line, _ = self.getpos()
            snippet = " ".join(data.strip().split())[:120]
            self.visible_literal_escapes.append((line, snippet))

    @property
    def title(self) -> str:
        return " ".join(" ".join(self.title_parts).split())


def page_files() -> list[Path]:
    out: list[Path] = []
    for path in ROOT.rglob("*.html"):
        rel = path.relative_to(ROOT)
        if any(part in SKIP_DIRS for part in rel.parts):
            continue
        out.append(path)
    return sorted(out, key=lambda p: p.relative_to(ROOT).as_posix())


def parse_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8", errors="strict"))
    return parser


def normalize_candidate(candidate: Path, original_path: str) -> Path:
    if original_path.endswith("/"):
        return candidate / "index.html"
    if candidate.exists() and candidate.is_dir():
        return candidate / "index.html"
    return candidate


def local_target(source: Path, raw_value: str) -> Path | None:
    value = html.unescape(raw_value).strip()
    if not value or value.startswith("#") or value.startswith("?"):
        return None

    parsed = urlparse(value)
    if parsed.scheme.lower() in SKIP_SCHEMES:
        return None

    if value.startswith("//"):
        parsed = urlparse("https:" + value)

    if parsed.scheme.lower() in {"http", "https"}:
        if parsed.netloc.lower() not in SITE_HOSTS:
            return None
        route = unquote(parsed.path or "/")
    elif parsed.scheme:
        return None
    else:
        route = unquote(parsed.path)

    if not route:
        return None

    if route.startswith("/api/"):
        return None

    if route.startswith("/"):
        candidate = ROOT / route.lstrip("/")
    else:
        candidate = source.parent / route

    candidate = normalize_candidate(candidate, route)
    resolved = candidate.resolve(strict=False)
    root_resolved = ROOT.resolve()
    try:
        resolved.relative_to(root_resolved)
    except ValueError:
        return Path("__OUTSIDE_REPOSITORY__")
    return resolved


def display_path(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def expected_page_route(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return "/"
    if rel == "en/index.html":
        return "/en/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def audit() -> tuple[list[str], list[str], dict[str, int]]:
    errors: list[str] = []
    warnings: list[str] = []
    pages = page_files()
    parsed_pages: dict[Path, PageParser] = {}
    canonical_owners: defaultdict[str, list[str]] = defaultdict(list)
    ref_count = 0
    local_ref_count = 0

    for path in pages:
        rel = path.relative_to(ROOT).as_posix()
        try:
            parsed = parse_page(path)
        except Exception as exc:
            errors.append(f"{rel}: HTML could not be parsed as UTF-8 ({exc})")
            continue
        parsed_pages[path] = parsed

        if not parsed.title:
            warnings.append(f"{rel}: missing <title>")

        is_root_public = len(path.relative_to(ROOT).parts) == 1
        is_english_public = rel.startswith("en/") and len(path.relative_to(ROOT).parts) == 2
        is_public_language_page = is_root_public or is_english_public

        if is_public_language_page:
            expected_lang = "en" if is_english_public else "ar"
            expected_dir = "ltr" if is_english_public else "rtl"
            actual_lang = parsed.html_attrs.get("lang", "").lower()
            actual_dir = parsed.html_attrs.get("dir", "").lower()
            if actual_lang != expected_lang:
                warnings.append(f"{rel}: html lang={actual_lang or '(missing)'}; expected {expected_lang}")
            if actual_dir != expected_dir:
                warnings.append(f"{rel}: html dir={actual_dir or '(missing)'}; expected {expected_dir}")

            noindex = "noindex" in parsed.robots
            if not noindex:
                if not parsed.description:
                    warnings.append(f"{rel}: indexable page is missing meta description")
                if not parsed.canonical:
                    warnings.append(f"{rel}: indexable page is missing canonical URL")

        if parsed.canonical:
            canonical = html.unescape(parsed.canonical).strip()
            c = urlparse(canonical)
            if c.scheme != "https" or c.netloc.lower() not in SITE_HOSTS:
                errors.append(f"{rel}: invalid canonical domain/scheme: {canonical}")
            elif c.query or c.fragment:
                errors.append(f"{rel}: canonical contains query or fragment: {canonical}")
            else:
                if "noindex" not in parsed.robots:
                    canonical_owners[canonical].append(rel)
                target = local_target(path, canonical)
                if target is not None and target.name == "__OUTSIDE_REPOSITORY__":
                    errors.append(f"{rel}: canonical escapes repository: {canonical}")
                elif target is not None and not target.exists():
                    errors.append(f"{rel}: canonical points to missing local page: {canonical}")

        if parsed.refresh:
            match = re.search(r"""(?:^|;)\s*url\s*=\s*['"]?([^'";]+)""", parsed.refresh, re.I)
            if not match:
                errors.append(f"{rel}: invalid meta refresh directive: {parsed.refresh}")
            else:
                refresh_url = html.unescape(match.group(1).strip())
                refresh_target = local_target(path, refresh_url)
                canonical_target = local_target(path, parsed.canonical) if parsed.canonical else None
                if refresh_target is None or refresh_target.name == "__OUTSIDE_REPOSITORY__":
                    errors.append(f"{rel}: meta refresh target is invalid: {refresh_url}")
                elif not refresh_target.exists():
                    errors.append(f"{rel}: meta refresh points to missing local page: {refresh_url}")
                elif not parsed.canonical:
                    errors.append(f"{rel}: meta refresh page is missing canonical destination")
                elif canonical_target != refresh_target:
                    errors.append(
                        f"{rel}: meta refresh target and canonical disagree: {refresh_url} vs {parsed.canonical}"
                    )

        id_counts = Counter(value for value, _ in parsed.ids)
        for value, count in sorted(id_counts.items()):
            if count > 1:
                warnings.append(f"{rel}: duplicate id '{value}' appears {count} times")

        for line in parsed.images_without_alt:
            warnings.append(f"{rel}:{line}: <img> is missing alt attribute")

        for line, snippet in parsed.visible_literal_escapes:
            errors.append(f"{rel}:{line}: visible literal escape sequence in page text: {snippet}")

        for tag, attr, raw, line in parsed.refs:
            ref_count += 1
            target = local_target(path, raw)
            if target is None:
                continue
            local_ref_count += 1
            if target.name == "__OUTSIDE_REPOSITORY__":
                errors.append(f"{rel}:{line}: {tag}[{attr}] escapes repository: {raw}")
                continue
            if not target.exists():
                errors.append(
                    f"{rel}:{line}: broken local {tag}[{attr}] '{raw}' -> {display_path(target)}"
                )

    for canonical, owners in sorted(canonical_owners.items()):
        if len(owners) > 1:
            errors.append(
                "duplicate canonical URL "
                + canonical
                + " used by: "
                + ", ".join(sorted(owners))
            )

    cname = ROOT / "CNAME"
    if not cname.exists():
        errors.append("CNAME: missing")
    elif cname.read_text(encoding="utf-8").strip().lower() != "tamayuz10x.com":
        errors.append("CNAME: expected tamayuz10x.com")

    robots = ROOT / "robots.txt"
    if not robots.exists():
        errors.append("robots.txt: missing")
    else:
        robots_text = robots.read_text(encoding="utf-8")
        if "Sitemap: https://tamayuz10x.com/sitemap.xml" not in robots_text:
            errors.append("robots.txt: missing canonical sitemap declaration")

    stats = {
        "html_pages": len(pages),
        "references_checked": ref_count,
        "local_references_checked": local_ref_count,
        "canonical_urls": len(canonical_owners),
        "critical_errors": len(errors),
        "warnings": len(warnings),
    }
    return errors, warnings, stats


def write_summary(errors: list[str], warnings: list[str], stats: dict[str, int]) -> None:
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_path:
        return
    lines = [
        "# Tamayuz 10X site health audit",
        "",
        f"- HTML pages scanned: **{stats['html_pages']}**",
        f"- References scanned: **{stats['references_checked']}**",
        f"- Local references verified: **{stats['local_references_checked']}**",
        f"- Canonical URLs checked: **{stats['canonical_urls']}**",
        f"- Critical errors: **{stats['critical_errors']}**",
        f"- Advisory warnings: **{stats['warnings']}**",
        "",
    ]
    if errors:
        lines += ["## Critical errors", ""]
        lines += [f"- {item}" for item in errors[:MAX_DETAILS]]
        if len(errors) > MAX_DETAILS:
            lines.append(f"- ... and {len(errors) - MAX_DETAILS} more")
        lines.append("")
    if warnings:
        lines += ["## Advisory warnings", ""]
        lines += [f"- {item}" for item in warnings[:MAX_DETAILS]]
        if len(warnings) > MAX_DETAILS:
            lines.append(f"- ... and {len(warnings) - MAX_DETAILS} more")
        lines.append("")
    if not errors:
        lines += ["**Gate result: PASS** — no critical static-site integrity errors were found.", ""]
    Path(summary_path).write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit Tamayuz 10X static-site integrity.")
    parser.add_argument("--json-out", help="Optional path for machine-readable audit output.")
    args = parser.parse_args()

    errors, warnings, stats = audit()

    print("SITE HEALTH AUDIT")
    print(json.dumps(stats, ensure_ascii=False, indent=2))

    if errors:
        print("\nCRITICAL ERRORS")
        for item in errors[:MAX_DETAILS]:
            print("-", item)
        if len(errors) > MAX_DETAILS:
            print(f"- ... and {len(errors) - MAX_DETAILS} more")

    if warnings:
        print("\nADVISORY WARNINGS")
        for item in warnings[:MAX_DETAILS]:
            print("-", item)
        if len(warnings) > MAX_DETAILS:
            print(f"- ... and {len(warnings) - MAX_DETAILS} more")

    if args.json_out:
        out = Path(args.json_out)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(
            json.dumps(
                {"stats": stats, "errors": errors, "warnings": warnings},
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

    write_summary(errors, warnings, stats)

    if errors:
        print("\nSITE HEALTH QA: FAIL")
        return 1

    print("\nSITE HEALTH QA: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
