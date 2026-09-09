#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from bs4 import BeautifulSoup

SITE = "https://tamayuz10x.com"
EXCLUDE = {"contact-madar.html"}


def ar_url(name: str) -> str:
    return f"{SITE}/" if name == "index.html" else f"{SITE}/{name}"


def en_url(name: str) -> str:
    return f"{SITE}/en/" if name == "index.html" else f"{SITE}/en/{name}"


def ensure_metadata(soup: BeautifulSoup, name: str, lang: str) -> None:
    if soup.html:
        soup.html["lang"] = lang
        soup.html["dir"] = "rtl" if lang == "ar" else "ltr"
    head = soup.head
    if not head:
        return
    for link in list(head.find_all("link")):
        rel = link.get("rel") or []
        rels = rel if isinstance(rel, list) else [rel]
        if "alternate" in [str(x).lower() for x in rels] and link.get("hreflang") in {"ar", "en", "x-default"}:
            link.decompose()
    canonical = head.find("link", rel=lambda x: x and "canonical" in (x if isinstance(x, list) else [x]))
    if not canonical:
        canonical = soup.new_tag("link", rel="canonical")
        head.append(canonical)
    canonical["href"] = ar_url(name) if lang == "ar" else en_url(name)
    anchor = canonical
    for code, href in (("ar", ar_url(name)), ("en", en_url(name)), ("x-default", ar_url(name))):
        tag = soup.new_tag("link", rel="alternate", hreflang=code, href=href)
        anchor.insert_after(tag)
        anchor = tag


def fix_switch(soup: BeautifulSoup, name: str, lang: str) -> None:
    target_href = en_url(name).replace(SITE, "") if lang == "ar" else ar_url(name).replace(SITE, "")
    found = False
    for a in soup.find_all("a"):
        text = a.get_text(" ", strip=True)
        if lang == "ar":
            is_switch = a.get("hreflang") == "en" or a.get("lang") == "en" or text.lower() in {"english", "en"}
            if is_switch:
                a["href"] = target_href
                a["hreflang"] = "en"
                a["lang"] = "en"
                a.clear(); a.append("English")
                found = True
        else:
            is_switch = a.get("hreflang") == "ar" or a.get("lang") == "ar" or text == "العربية"
            if is_switch:
                a["href"] = target_href
                a["hreflang"] = "ar"
                a["lang"] = "ar"
                a.clear(); a.append("العربية")
                found = True
    if not found:
        print(f"WARN no explicit language switch found in {name} ({lang})")


def normalize(path: Path, lang: str) -> bool:
    original = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(original, "html.parser")
    name = path.name
    ensure_metadata(soup, name, lang)
    fix_switch(soup, name, lang)
    result = str(soup)
    if original.lstrip().lower().startswith("<!doctype") and not result.lstrip().lower().startswith("<!doctype"):
        result = "<!doctype html>\n" + result
    if result == original:
        return False
    path.write_text(result, encoding="utf-8")
    print(f"NORMALIZE {path}")
    return True


def main() -> int:
    changed = False
    for ar in sorted(Path(".").glob("*.html")):
        if ar.name in EXCLUDE:
            continue
        changed |= normalize(ar, "ar")
        en = Path("en") / ar.name
        if en.exists():
            changed |= normalize(en, "en")
    print("NORMALIZED=1" if changed else "NORMALIZED=0")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
