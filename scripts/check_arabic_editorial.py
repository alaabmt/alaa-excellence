#!/usr/bin/env python3
"""Fail-closed editorial metadata and approval check for Arabic articles."""
import json
import re
import sys
from pathlib import Path
from html import unescape
from html.parser import HTMLParser

class Extract(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_h1 = False
        self.h1 = []
        self.title = []
        self.in_title = False
        self.meta = {}
        self.ld = []
        self.in_ld = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "h1": self.in_h1 = True
        if tag == "title": self.in_title = True
        if tag == "meta":
            self.meta[a.get("property") or a.get("name")] = a.get("content", "")
        if tag == "script" and a.get("type") == "application/ld+json": self.in_ld = True
    def handle_endtag(self, tag):
        if tag == "h1": self.in_h1 = False
        if tag == "title": self.in_title = False
        if tag == "script": self.in_ld = False
    def handle_data(self, data):
        if self.in_h1: self.h1.append(data)
        if self.in_title: self.title.append(data)
        if self.in_ld: self.ld.append(data)

def check(page, report):
    errors = []
    doc = Extract()
    doc.feed(page.read_text(encoding="utf-8"))
    ld = {}
    for block in doc.ld:
        try:
            obj = json.loads(block)
            if isinstance(obj, dict) and obj.get("@type") == "Article": ld = obj
        except json.JSONDecodeError:
            errors.append("Invalid Article JSON-LD")
    normalize = lambda s: re.sub(r"\s+", " ", unescape(s)).strip()
    browser = normalize("".join(doc.title))
    browser = re.sub(r"\s*\|\s*التميّز 10X$", "", browser)
    values = {
        "H1": normalize("".join(doc.h1)),
        "title": browser,
        "og:title": normalize(doc.meta.get("og:title", "")),
        "twitter:title": normalize(doc.meta.get("twitter:title", "")),
        "Article.headline": normalize(ld.get("headline", "")),
    }
    if not all(values.values()) or len(set(values.values())) != 1:
        errors.append("Headline missing or inconsistent: " + repr(values))
    if not report.exists():
        errors.append("Editorial approval report missing")
    else:
        try:
            qa = json.loads(report.read_text(encoding="utf-8"))
            gates = qa.get("gates", {})
            required = ["title", "introduction", "summary", "terminology", "evidence", "mobile", "language"]
            for key in required:
                if gates.get(key) != "PASS":
                    errors.append(f"Gate {key}: {gates.get(key, 'MISSING')}")
            if qa.get("headline") != values["H1"]: errors.append("QA report headline is stale")
            if not qa.get("reviewer") or not qa.get("reviewed_at"): errors.append("Reviewer/date missing")
            if not qa.get("mobile_evidence"): errors.append("Real mobile verification evidence missing")
            if not qa.get("source_evidence"): errors.append("Source review evidence missing")
        except (json.JSONDecodeError, OSError) as exc:
            errors.append(f"Invalid QA report: {exc}")
    return errors

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Usage: check_arabic_editorial.py PAGE.html QA.json")
    failures = check(Path(sys.argv[1]), Path(sys.argv[2]))
    for item in failures: print("FAIL:", item)
    if failures: sys.exit(1)
    print("PASS: headline and documented editorial gates")
