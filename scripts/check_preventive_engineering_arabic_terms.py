#!/usr/bin/env python3
"""Fail when reader-facing Arabic Preventive Engineering content uses bare FMEA."""
from pathlib import Path
import json
import re
import sys

FULL = "منهجية هندسة الوقاية (FMEA)"
RISK_TRIAD = "ثلاثية تقييم الخطر (Severity, Occurrence, Detection — S/O/D)"
LEGACY_RISK_TERMS = ("ثالوث" + " الخطر", "ثلاثية " + "تحديد الخطر")
errors = []

def check_text(label: str, text: str) -> None:
    remainder = text.replace(FULL, "")
    # Match the acronym as its own token. AFMEA is a distinct acronym and must
    # not be misclassified as a bare FMEA occurrence.
    bare_fmea = re.findall(r"(?<![A-Za-z0-9])FMEA(?![A-Za-z0-9])", remainder)
    if bare_fmea:
        errors.append(f"{label}: {len(bare_fmea)} bare FMEA occurrence(s); use {FULL}")
    risk_remainder = text.replace(RISK_TRIAD, "")
    for old_phrase in LEGACY_RISK_TERMS:
        if old_phrase in risk_remainder:
            errors.append(f"{label}: legacy risk-triad phrase is forbidden; use 'ثلاثية تقييم الخطر'")
    if "S/O/D" in risk_remainder or "S / O / D" in risk_remainder:
        errors.append(f"{label}: collective S/O/D must be written as {RISK_TRIAD}")

for path in sorted(Path(".").glob("article-preventive-engineering-*.html")):
    check_text(str(path), path.read_text(encoding="utf-8"))

index = Path("articles.html")
if index.exists():
    check_text(str(index), index.read_text(encoding="utf-8"))

manifest = Path("data/article-covers.json")
if manifest.exists():
    data = json.loads(manifest.read_text(encoding="utf-8"))
    for card in data.get("cards", []):
        if card.get("category") != "prevention":
            continue
        ar = card.get("ar", {})
        for key in ("title", "subtitle", "alt"):
            value = ar.get(key, "")
            if isinstance(value, list):
                value = " ".join(value)
            check_text(f"{manifest}:{card.get('slug')}:{key}", str(value))

if errors:
    print("Arabic Preventive Engineering terminology gate: FAIL", file=sys.stderr)
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit(1)

print(f"Arabic Preventive Engineering terminology gate: PASS — FMEA and risk-triad terminology are canonical.")
