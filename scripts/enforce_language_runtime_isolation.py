#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup, Comment

AR_RE = re.compile(r"[\u0600-\u06FF]")
ENGLISH_FORBIDDEN_RUNTIME = {
    "arabic-tts-standard.js",
    "arabic-tts-tanween-fix.js",
    "ega-audio-player-v5.js",
    "ega-audio-player-v7.js",
    "ega-pronunciation-fixes.js",
    "ega-pronunciation-test.js",
    "ega-visible-diacritics.js",
    "homepage-philosophy.js",
}
ALLOWED_ARABIC_VISIBLE = {"العربية"}


def script_filename(src: str) -> str:
    return src.split("?", 1)[0].rstrip("/").split("/")[-1]


def remove_forbidden_english_runtime(path: Path) -> bool:
    raw = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(raw, "html.parser")
    removed: list[str] = []
    for script in list(soup.find_all("script", src=True)):
        filename = script_filename(str(script.get("src", "")))
        if filename in ENGLISH_FORBIDDEN_RUNTIME:
            removed.append(filename)
            script.decompose()
    if not removed:
        return False
    out = str(soup)
    if raw.lstrip().lower().startswith("<!doctype") and not out.lstrip().lower().startswith("<!doctype"):
        out = "<!doctype html>\n" + out
    path.write_text(out, encoding="utf-8")
    print(f"FIX {path}: removed {', '.join(removed)}")
    return True


def audit_english_page(path: Path) -> list[str]:
    failures: list[str] = []
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")

    if not soup.html or soup.html.get("lang") != "en" or soup.html.get("dir") != "ltr":
        failures.append(f"{path}: expected lang=en and dir=ltr")

    for script in soup.find_all("script", src=True):
        filename = script_filename(str(script.get("src", "")))
        if filename in ENGLISH_FORBIDDEN_RUNTIME:
            failures.append(f"{path}: forbidden Arabic runtime script: {filename}")

    visible = BeautifulSoup(str(soup), "html.parser")
    for tag in visible(["script", "style", "noscript", "svg"]):
        tag.decompose()

    for node in visible.find_all(string=True):
        if isinstance(node, Comment):
            continue
        text = " ".join(str(node).split())
        if not text or not AR_RE.search(text):
            continue
        parent = node.parent
        explicitly_arabic = bool(
            parent
            and (
                parent.get("lang") == "ar"
                or parent.find_parent(attrs={"lang": "ar"})
            )
        )
        if text in ALLOWED_ARABIC_VISIBLE or explicitly_arabic:
            continue
        failures.append(f"{path}: visible Arabic leakage: {text[:120]}")

    for tag in visible.find_all(True):
        for attr in ("title", "alt", "aria-label", "placeholder"):
            value = " ".join(str(tag.get(attr, "")).split())
            if not value or not AR_RE.search(value):
                continue
            if value in ALLOWED_ARABIC_VISIBLE or tag.get("lang") == "ar":
                continue
            failures.append(f"{path}: Arabic in {attr}: {value[:120]}")

    return failures


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--fix", action="store_true", help="Remove Arabic-only runtime scripts from English pages before auditing.")
    args = parser.parse_args()

    pages = sorted(Path("en").glob("*.html"))
    if not pages:
        print("No English pages found.", file=sys.stderr)
        return 1

    changed = 0
    if args.fix:
        for path in pages:
            changed += int(remove_forbidden_english_runtime(path))

    failures: list[str] = []
    for path in pages:
        failures.extend(audit_english_page(path))

    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1

    print(f"English runtime language isolation passed for {len(pages)} pages; changed={changed}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
