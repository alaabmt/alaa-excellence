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

import requests
from bs4 import BeautifulSoup, NavigableString

SITE = "https://tamayuz10x.com"
CACHE_PATH = Path(".bilingual-translation-cache.json")
AR_RE = re.compile(r"[\u0600-\u06FF]")
EN_WORD_RE = re.compile(r"[A-Za-z]{2,}")
SKIP_TAGS = {"style", "code", "pre", "kbd", "samp", "svg", "math", "noscript"}
ROOT_EXCLUDE = {"contact-madar.html"}
PROTECTED_AR_EN = {
    "التميّز 10X": "Tamayuz 10X",
    "الدكتور علاء محمد أحمد": "Dr. Alaa Mohammad Ahmed",
    "علاء محمد أحمد": "Alaa Mohammad Ahmed",
}
PROTECTED_EN_AR = {v: k for k, v in PROTECTED_AR_EN.items()}
TEXT_ATTRS = {"title", "alt", "aria-label", "placeholder"}
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


class Translator:
    def __init__(self, src: str, dst: str, cache: dict[str, str]):
        self.src = src
        self.dst = dst
        self.cache = cache
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "Mozilla/5.0 Tamayuz10X-BilingualSync/1.0"})

    def needs_translation(self, text: str) -> bool:
        if self.src == "ar":
            return bool(AR_RE.search(text))
        return bool(EN_WORD_RE.search(text)) and not self._looks_technical(text)

    @staticmethod
    def _looks_technical(text: str) -> bool:
        s = text.strip()
        if not s:
            return True
        if s.startswith(("http://", "https://", "mailto:", "tel:", "#", "/", "./", "../")):
            return True
        if re.fullmatch(r"[A-Za-z0-9_.:/?#=&%+@-]+", s) and " " not in s:
            return True
        if re.fullmatch(r"[A-Z0-9][A-Z0-9 .&/+_-]{0,18}", s):
            return True
        return False

    def _mask_protected(self, text: str) -> tuple[str, dict[str, str]]:
        mapping = PROTECTED_AR_EN if self.src == "ar" else PROTECTED_EN_AR
        masked = text
        tokens: dict[str, str] = {}
        for i, (source, target) in enumerate(sorted(mapping.items(), key=lambda x: len(x[0]), reverse=True)):
            if source in masked:
                token = f"ZXQPROTECTED{i}QXZ"
                masked = masked.replace(source, token)
                tokens[token] = target
        return masked, tokens

    def translate(self, text: str) -> str:
        if not self.needs_translation(text):
            return text
        raw = text.strip()
        if not raw:
            return text
        key = f"{self.src}>{self.dst}|{raw}"
        if key in self.cache:
            translated = self.cache[key]
        else:
            masked, tokens = self._mask_protected(raw)
            translated = self._request(masked)
            for token, replacement in tokens.items():
                translated = translated.replace(token, replacement)
                translated = translated.replace(token.lower(), replacement)
            self.cache[key] = translated
        prefix = text[: len(text) - len(text.lstrip())]
        suffix = text[len(text.rstrip()):]
        return prefix + translated + suffix

    def _request(self, text: str) -> str:
        params = {"client": "gtx", "sl": self.src, "tl": self.dst, "dt": "t", "q": text}
        last = None
        for attempt in range(6):
            try:
                r = self.session.get("https://translate.googleapis.com/translate_a/single", params=params, timeout=35)
                r.raise_for_status()
                data = r.json()
                result = "".join(piece[0] for piece in data[0] if piece and piece[0])
                if result.strip():
                    time.sleep(0.04)
                    return result
            except Exception as exc:
                last = exc
                time.sleep(min(12, 1.5 ** attempt))
        raise RuntimeError(f"Translation failed for text: {text[:120]!r}: {last}")


def counterpart(path: Path, target_lang: str) -> Path:
    if target_lang == "en":
        return Path("en") / path.name
    if path.parts and path.parts[0] == "en":
        return Path(path.name)
    return path


def canonical_for(path: Path, lang: str) -> str:
    if path.name == "index.html":
        return f"{SITE}/en/" if lang == "en" else f"{SITE}/"
    return f"{SITE}/en/{path.name}" if lang == "en" else f"{SITE}/{path.name}"


def ar_url_for(name: str) -> str:
    return f"{SITE}/" if name == "index.html" else f"{SITE}/{name}"


def en_url_for(name: str) -> str:
    return f"{SITE}/en/" if name == "index.html" else f"{SITE}/en/{name}"


def internal_path_to_lang(url: str, target_lang: str) -> str:
    if not url or url.startswith(("mailto:", "tel:", "javascript:", "data:", "#")):
        return url
    parts = urlsplit(url)
    if parts.scheme and parts.netloc and parts.netloc != "tamayuz10x.com":
        return url
    p = parts.path
    if target_lang == "en":
        if p in ("", "/", "/index.html", "index.html"):
            newp = "/en/"
        elif p.startswith("/en/"):
            newp = p
        elif p.startswith("/") and p.endswith(".html") and p.count("/") == 1:
            newp = "/en" + p
        elif not p.startswith("/") and p.endswith(".html") and "/" not in p:
            newp = "/en/" + p
        else:
            newp = p
        if not parts.scheme and not parts.netloc and p and not p.startswith("/") and not p.endswith(".html") and not p.startswith("../"):
            newp = "../" + p
    else:
        if p in ("/en", "/en/", "/en/index.html", "en/index.html"):
            newp = "/"
        elif p.startswith("/en/") and p.endswith(".html"):
            newp = "/" + p[len("/en/"):]
        elif p.startswith("../"):
            newp = p[3:]
        else:
            newp = p
    return urlunsplit((parts.scheme, parts.netloc, newp, parts.query, parts.fragment))


def adjust_resource_path(url: str, target_lang: str) -> str:
    if not url or url.startswith(("http://", "https://", "//", "data:", "blob:", "#")):
        return url
    if target_lang == "en":
        if url.startswith("../") or url.startswith("/"):
            return url
        return "../" + url
    while url.startswith("../"):
        url = url[3:]
    return url


def translate_jsonld(obj, tr: Translator, source_url: str, target_url: str):
    if isinstance(obj, dict):
        out = {}
        for k, v in obj.items():
            if isinstance(v, str):
                if source_url and source_url in v:
                    v = v.replace(source_url, target_url)
                if k.startswith("@") or k in {"url", "image", "sameAs", "identifier", "contentUrl", "embedUrl"}:
                    out[k] = v
                else:
                    out[k] = tr.translate(v)
            else:
                out[k] = translate_jsonld(v, tr, source_url, target_url)
        return out
    if isinstance(obj, list):
        return [translate_jsonld(x, tr, source_url, target_url) for x in obj]
    if isinstance(obj, str):
        return tr.translate(obj)
    return obj


def translate_js_strings(script_text: str, tr: Translator) -> str:
    quote_re = re.compile(r"(?P<q>['\"])(?P<s>(?:\\.|(?!\1).)*?)(?P=q)", re.S)
    def repl(m):
        s = m.group("s")
        if "\n" in s or "\\" in s or len(s) > 500:
            return m.group(0)
        if tr.src == "ar" and not AR_RE.search(s):
            return m.group(0)
        if tr.src == "en" and (not EN_WORD_RE.search(s) or Translator._looks_technical(s)):
            return m.group(0)
        translated = tr.translate(s)
        q = m.group("q")
        translated = translated.replace("\\", "\\\\").replace(q, "\\" + q)
        return q + translated + q
    try:
        return quote_re.sub(repl, script_text)
    except Exception:
        return script_text


def ensure_hreflang(soup: BeautifulSoup, page_name: str, target_lang: str) -> None:
    head = soup.head
    if not head:
        return
    for tag in list(head.find_all("link")):
        rel = tag.get("rel") or []
        rels = [str(x).lower() for x in rel] if isinstance(rel, list) else [str(rel).lower()]
        if "alternate" in rels and tag.get("hreflang") in {"ar", "en", "x-default"}:
            tag.decompose()
    canonical = canonical_for(Path(page_name), target_lang)
    can = head.find("link", rel=lambda x: x and "canonical" in (x if isinstance(x, list) else [x]))
    if can:
        can["href"] = canonical
    else:
        can = soup.new_tag("link", rel="canonical", href=canonical)
        head.append(can)
    for lang, href in (("ar", ar_url_for(page_name)), ("en", en_url_for(page_name)), ("x-default", ar_url_for(page_name))):
        tag = soup.new_tag("link", rel="alternate", hreflang=lang, href=href)
        can.insert_after(tag)
        can = tag


def set_language_switch(soup: BeautifulSoup, page_name: str, target_lang: str) -> None:
    if target_lang == "en":
        for a in soup.find_all("a"):
            txt = a.get_text(" ", strip=True).lower()
            if a.get("hreflang") == "en" or a.get("lang") == "en" or txt in {"english", "en"}:
                a["href"] = "/" if page_name == "index.html" else f"/{page_name}"
                a["hreflang"] = "ar"
                a["lang"] = "ar"
                a.clear(); a.append("العربية")
    else:
        for a in soup.find_all("a"):
            txt = a.get_text(" ", strip=True)
            if a.get("hreflang") == "ar" or a.get("lang") == "ar" or txt == "العربية":
                a["href"] = "/en/" if page_name == "index.html" else f"/en/{page_name}"
                a["hreflang"] = "en"
                a["lang"] = "en"
                a.clear(); a.append("English")


def transform_html(source: Path, target_lang: str, cache: dict[str, str]) -> str:
    source_lang = "ar" if target_lang == "en" else "en"
    tr = Translator(source_lang, target_lang, cache)
    html = source.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    page_name = source.name
    if soup.html:
        soup.html["lang"] = target_lang
        soup.html["dir"] = "ltr" if target_lang == "en" else "rtl"

    source_url = ar_url_for(page_name) if source_lang == "ar" else en_url_for(page_name)
    target_url = en_url_for(page_name) if target_lang == "en" else ar_url_for(page_name)

    for node in list(soup.find_all(string=True)):
        parent = node.parent
        if not parent or parent.name in SKIP_TAGS:
            continue
        if parent.name == "script":
            if (parent.get("type") or "").lower() == "application/ld+json":
                try:
                    data = json.loads(str(node))
                    data = translate_jsonld(data, tr, source_url, target_url)
                    node.replace_with(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
                except Exception:
                    pass
            else:
                translated = translate_js_strings(str(node), tr)
                if translated != str(node):
                    node.replace_with(translated)
            continue
        if isinstance(node, NavigableString):
            text = str(node)
            if tr.needs_translation(text):
                node.replace_with(tr.translate(text))

    for tag in soup.find_all(True):
        for attr in TEXT_ATTRS:
            if tag.has_attr(attr):
                tag[attr] = tr.translate(str(tag[attr]))
        if tag.name == "meta" and tag.has_attr("content"):
            key = (tag.get("name") or tag.get("property") or "").lower()
            if key in META_KEYS:
                tag["content"] = tr.translate(str(tag["content"]))
            elif key == "og:locale":
                tag["content"] = "en_US" if target_lang == "en" else "ar_AR"
            elif key == "og:url":
                tag["content"] = target_url
        if tag.name == "a" and tag.has_attr("href"):
            tag["href"] = internal_path_to_lang(str(tag["href"]), target_lang)
        for attr in ("src", "poster"):
            if tag.has_attr(attr):
                tag[attr] = adjust_resource_path(str(tag[attr]), target_lang)
        if tag.has_attr("srcset"):
            parts = []
            for item in str(tag["srcset"]).split(","):
                bits = item.strip().split()
                if bits:
                    bits[0] = adjust_resource_path(bits[0], target_lang)
                parts.append(" ".join(bits))
            tag["srcset"] = ", ".join(parts)
        if tag.name == "form" and tag.has_attr("action"):
            tag["action"] = internal_path_to_lang(str(tag["action"]), target_lang)

    ensure_hreflang(soup, page_name, target_lang)
    set_language_switch(soup, page_name, target_lang)

    result = str(soup)
    if target_lang == "en":
        result = re.sub(r"(?<!\.)\bassets/", "../assets/", result)
        result = result.replace("../../assets/", "../assets/")
    else:
        result = result.replace("../assets/", "assets/")
    if html.lstrip().lower().startswith("<!doctype") and not result.lstrip().lower().startswith("<!doctype"):
        result = "<!doctype html>\n" + result
    return result


def root_pages() -> list[Path]:
    return [p for p in sorted(Path(".").glob("*.html")) if p.name not in ROOT_EXCLUDE]


def sync_pair(source: Path, target_lang: str, cache: dict[str, str]) -> bool:
    target = counterpart(source, target_lang)
    target.parent.mkdir(parents=True, exist_ok=True)
    new = transform_html(source, target_lang, cache)
    old = target.read_text(encoding="utf-8") if target.exists() else None
    if new == old:
        return False
    target.write_text(new, encoding="utf-8")
    print(f"SYNC {source} -> {target}")
    return True


def changed_files() -> list[str]:
    env = os.getenv("BILINGUAL_CHANGED_FILES", "").strip()
    if env:
        return [x.strip() for x in env.splitlines() if x.strip()]
    return []


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--full-ar", action="store_true")
    ap.add_argument("--changed", action="store_true")
    args = ap.parse_args()
    cache = load_cache()
    changed = False
    if args.full_ar:
        for p in root_pages():
            changed |= sync_pair(p, "en", cache)
    elif args.changed:
        paths = changed_files()
        ar_changed = [Path(x) for x in paths if "/" not in x and x.endswith(".html") and x not in ROOT_EXCLUDE]
        en_changed = [Path(x) for x in paths if x.startswith("en/") and x.endswith(".html")]
        if ar_changed and en_changed:
            print("Bilingual conflict: Arabic and English pages changed in the same commit; no automatic overwrite.", file=sys.stderr)
            return 2
        for p in ar_changed:
            if p.exists():
                changed |= sync_pair(p, "en", cache)
        for p in en_changed:
            if p.exists():
                changed |= sync_pair(p, "ar", cache)
    else:
        ap.error("Choose --full-ar or --changed")
    save_cache(cache)
    print("CHANGED=1" if changed else "CHANGED=0")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
