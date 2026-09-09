#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

import translators as ts
from bs4 import BeautifulSoup

SITE = "https://tamayuz10x.com"
CACHE_PATH = Path(".bilingual-translation-cache.json")
ROOT_EXCLUDE = {"contact-madar.html"}
SERVICES = ("bing", "yandex", "alibaba", "google", "mymemory")
AR_RE = re.compile(r"[\u0600-\u06FF]")
EN_RE = re.compile(r"[A-Za-z]{2,}")
PROTECTED_AR_EN = {
    "التميّز 10X": "Tamayuz 10X",
    "الدكتور علاء محمد أحمد": "Dr. Alaa Mohammad Ahmed",
    "علاء محمد أحمد": "Alaa Mohammad Ahmed",
}
PROTECTED_EN_AR = {v: k for k, v in PROTECTED_AR_EN.items()}
TEXT_ATTRS = ("title", "alt", "aria-label", "placeholder")
META_KEYS = {"description", "og:title", "og:description", "og:image:alt", "twitter:title", "twitter:description"}


def load_cache() -> dict[str, str]:
    if CACHE_PATH.exists():
        try:
            return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def save_cache(cache: dict[str, str]) -> None:
    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def needs_translation(text: str, src: str) -> bool:
    return bool(AR_RE.search(text)) if src == "ar" else bool(EN_RE.search(text))


def looks_technical(text: str) -> bool:
    s = text.strip()
    if not s:
        return True
    if s.startswith(("http://", "https://", "mailto:", "tel:", "#", "/", "./", "../")):
        return True
    if re.fullmatch(r"[A-Za-z0-9_.:/?#=&%+@-]+", s) and " " not in s:
        return True
    return False


class MultiTranslator:
    def __init__(self, src: str, dst: str, cache: dict[str, str]):
        self.src = src
        self.dst = dst
        self.cache = cache
        self.mapping = PROTECTED_AR_EN if src == "ar" else PROTECTED_EN_AR

    def _mask(self, text: str) -> tuple[str, dict[str, str]]:
        masked = text
        tokens: dict[str, str] = {}
        for i, (source, target) in enumerate(sorted(self.mapping.items(), key=lambda x: len(x[0]), reverse=True)):
            if source in masked:
                token = f"ZXQPROTECTED{i}QXZ"
                masked = masked.replace(source, token)
                tokens[token] = target
        return masked, tokens

    @staticmethod
    def _unmask(text: str, tokens: dict[str, str]) -> str:
        for token, replacement in tokens.items():
            for variant in (token, token.lower(), token.upper(), token.replace("ZXQ", "ZXQ ")):
                text = text.replace(variant, replacement)
        return text

    def text(self, text: str) -> str:
        if not needs_translation(text, self.src) or looks_technical(text):
            return text
        raw = text.strip()
        key = f"{self.src}>{self.dst}|{raw}"
        if key in self.cache:
            translated = self.cache[key]
        else:
            masked, tokens = self._mask(raw)
            translated = self._translate_text(masked)
            translated = self._unmask(translated, tokens)
            self.cache[key] = translated
        lead = text[: len(text) - len(text.lstrip())]
        tail = text[len(text.rstrip()):]
        return lead + translated + tail

    def html(self, html: str) -> str:
        masked, tokens = self._mask(html)
        errors = []
        for service in SERVICES:
            try:
                print(f"  provider={service}", flush=True)
                out = ts.translate_html(masked, translator=service, from_language=self.src, to_language=self.dst)
                out = str(out)
                if out and len(out) > max(200, int(len(masked) * 0.45)):
                    return self._unmask(out, tokens)
            except Exception as exc:
                errors.append(f"{service}: {exc}")
                time.sleep(1.2)
        raise RuntimeError("All HTML translation providers failed: " + " | ".join(errors[-5:]))

    def _translate_text(self, text: str) -> str:
        errors = []
        for service in SERVICES:
            try:
                out = ts.translate_text(text, translator=service, from_language=self.src, to_language=self.dst)
                out = str(out).strip()
                if out:
                    time.sleep(0.08)
                    return out
            except Exception as exc:
                errors.append(f"{service}: {exc}")
                time.sleep(0.5)
        raise RuntimeError("All text translation providers failed: " + " | ".join(errors[-5:]))


def ar_url(name: str) -> str:
    return f"{SITE}/" if name == "index.html" else f"{SITE}/{name}"


def en_url(name: str) -> str:
    return f"{SITE}/en/" if name == "index.html" else f"{SITE}/en/{name}"


def canonical(name: str, lang: str) -> str:
    return en_url(name) if lang == "en" else ar_url(name)


def counterpart(source: Path, target_lang: str) -> Path:
    return Path("en") / source.name if target_lang == "en" else Path(source.name)


def map_internal_href(url: str, target_lang: str) -> str:
    if not url or url.startswith(("mailto:", "tel:", "javascript:", "data:", "#")):
        return url
    u = urlsplit(url)
    if u.scheme and u.netloc and u.netloc != "tamayuz10x.com":
        return url
    p = u.path
    if target_lang == "en":
        if p in ("", "/", "/index.html", "index.html"):
            p2 = "/en/"
        elif p.startswith("/en/"):
            p2 = p
        elif p.startswith("/") and p.endswith(".html") and p.count("/") == 1:
            p2 = "/en" + p
        elif not p.startswith("/") and p.endswith(".html") and "/" not in p:
            p2 = "/en/" + p
        elif not u.scheme and not u.netloc and p and not p.startswith(("/", "../")):
            p2 = "../" + p
        else:
            p2 = p
    else:
        if p in ("/en", "/en/", "/en/index.html", "en/index.html"):
            p2 = "/"
        elif p.startswith("/en/") and p.endswith(".html"):
            p2 = "/" + p[len("/en/"):]
        elif p.startswith("../"):
            p2 = p[3:]
        else:
            p2 = p
    return urlunsplit((u.scheme, u.netloc, p2, u.query, u.fragment))


def map_resource(url: str, target_lang: str) -> str:
    if not url or url.startswith(("http://", "https://", "//", "data:", "blob:", "#", "/")):
        return url
    if target_lang == "en":
        return url if url.startswith("../") else "../" + url
    while url.startswith("../"):
        url = url[3:]
    return url


def add_language_metadata(soup: BeautifulSoup, name: str, lang: str) -> None:
    if soup.html:
        soup.html["lang"] = lang
        soup.html["dir"] = "ltr" if lang == "en" else "rtl"
    head = soup.head
    if not head:
        return
    for link in list(head.find_all("link")):
        rel = link.get("rel") or []
        rels = rel if isinstance(rel, list) else [rel]
        if "alternate" in [str(x).lower() for x in rels] and link.get("hreflang") in {"ar", "en", "x-default"}:
            link.decompose()
    can = head.find("link", rel=lambda x: x and "canonical" in (x if isinstance(x, list) else [x]))
    if not can:
        can = soup.new_tag("link", rel="canonical")
        head.append(can)
    can["href"] = canonical(name, lang)
    anchor = can
    for code, href in (("ar", ar_url(name)), ("en", en_url(name)), ("x-default", ar_url(name))):
        tag = soup.new_tag("link", rel="alternate", hreflang=code, href=href)
        anchor.insert_after(tag)
        anchor = tag


def fix_language_switch(soup: BeautifulSoup, name: str, lang: str) -> None:
    for a in soup.find_all("a"):
        text = a.get_text(" ", strip=True)
        if lang == "en" and (a.get("hreflang") == "en" or a.get("lang") == "en" or text.lower() in {"english", "en"}):
            a["href"] = "/" if name == "index.html" else f"/{name}"
            a["hreflang"] = "ar"; a["lang"] = "ar"
            a.clear(); a.append("العربية")
        elif lang == "ar" and (a.get("hreflang") == "ar" or a.get("lang") == "ar" or text == "العربية"):
            a["href"] = "/en/" if name == "index.html" else f"/en/{name}"
            a["hreflang"] = "en"; a["lang"] = "en"
            a.clear(); a.append("English")


def transform(source: Path, target_lang: str, cache: dict[str, str]) -> str:
    src_lang = "ar" if target_lang == "en" else "en"
    tr = MultiTranslator(src_lang, target_lang, cache)
    original = source.read_text(encoding="utf-8")
    print(f"TRANSLATE {source} {src_lang}->{target_lang}", flush=True)
    translated_html = tr.html(original)
    soup = BeautifulSoup(translated_html, "html.parser")
    name = source.name

    for tag in soup.find_all(True):
        for attr in TEXT_ATTRS:
            if tag.has_attr(attr) and needs_translation(str(tag[attr]), src_lang):
                tag[attr] = tr.text(str(tag[attr]))
        if tag.name == "meta" and tag.has_attr("content"):
            key = (tag.get("name") or tag.get("property") or "").lower()
            if key in META_KEYS and needs_translation(str(tag["content"]), src_lang):
                tag["content"] = tr.text(str(tag["content"]))
            elif key == "og:locale":
                tag["content"] = "en_US" if target_lang == "en" else "ar_AR"
            elif key == "og:url":
                tag["content"] = canonical(name, target_lang)
        if tag.name == "a" and tag.has_attr("href"):
            tag["href"] = map_internal_href(str(tag["href"]), target_lang)
        for attr in ("src", "poster"):
            if tag.has_attr(attr):
                tag[attr] = map_resource(str(tag[attr]), target_lang)
        if tag.has_attr("srcset"):
            items = []
            for part in str(tag["srcset"]).split(","):
                bits = part.strip().split()
                if bits:
                    bits[0] = map_resource(bits[0], target_lang)
                items.append(" ".join(bits))
            tag["srcset"] = ", ".join(items)
        if tag.name == "form" and tag.has_attr("action"):
            tag["action"] = map_internal_href(str(tag["action"]), target_lang)

    add_language_metadata(soup, name, target_lang)
    fix_language_switch(soup, name, target_lang)
    result = str(soup)
    if target_lang == "en":
        result = re.sub(r"(?<!\.)\bassets/", "../assets/", result).replace("../../assets/", "../assets/")
    else:
        result = result.replace("../assets/", "assets/")
    if original.lstrip().lower().startswith("<!doctype") and not result.lstrip().lower().startswith("<!doctype"):
        result = "<!doctype html>\n" + result
    return result


def root_pages() -> list[Path]:
    return [p for p in sorted(Path(".").glob("*.html")) if p.name not in ROOT_EXCLUDE]


def sync(source: Path, target_lang: str, cache: dict[str, str]) -> bool:
    target = counterpart(source, target_lang)
    target.parent.mkdir(parents=True, exist_ok=True)
    new = transform(source, target_lang, cache)
    old = target.read_text(encoding="utf-8") if target.exists() else None
    if new == old:
        return False
    target.write_text(new, encoding="utf-8")
    print(f"WRITE {target}", flush=True)
    return True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--full-ar", action="store_true")
    ap.add_argument("--changed", action="store_true")
    args = ap.parse_args()
    cache = load_cache()
    any_change = False
    if args.full_ar:
        for page in root_pages():
            any_change |= sync(page, "en", cache)
    elif args.changed:
        paths = [x.strip() for x in os.getenv("BILINGUAL_CHANGED_FILES", "").splitlines() if x.strip()]
        ar_changed = [Path(x) for x in paths if "/" not in x and x.endswith(".html") and x not in ROOT_EXCLUDE]
        en_changed = [Path(x) for x in paths if x.startswith("en/") and x.endswith(".html")]
        if ar_changed and en_changed:
            print("Bilingual conflict: both language editions changed in one commit; human review required.", file=sys.stderr)
            return 2
        for page in ar_changed:
            if page.exists(): any_change |= sync(page, "en", cache)
        for page in en_changed:
            if page.exists(): any_change |= sync(page, "ar", cache)
    else:
        ap.error("Choose --full-ar or --changed")
    save_cache(cache)
    print("CHANGED=1" if any_change else "CHANGED=0")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
