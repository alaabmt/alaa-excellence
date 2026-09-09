#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

from bs4 import BeautifulSoup, NavigableString

SITE = "https://tamayuz10x.com"
CACHE_PATH = Path(".bilingual-translation-cache.json")
ROOT_EXCLUDE = {"contact-madar.html"}
AR_RE = re.compile(r"[\u0600-\u06FF]")
EN_RE = re.compile(r"[A-Za-z]{2,}")
SKIP_TAGS = {"style", "code", "pre", "kbd", "samp", "svg", "math", "noscript"}
TEXT_ATTRS = ("title", "alt", "aria-label", "placeholder")
META_KEYS = {"description", "og:title", "og:description", "og:image:alt", "twitter:title", "twitter:description"}
PROTECTED_AR_EN = {
    "التميّز 10X": "Tamayuz 10X",
    "الدكتور علاء محمد أحمد": "Dr. Alaa Mohammad Ahmed",
    "علاء محمد أحمد": "Alaa Mohammad Ahmed",
}
PROTECTED_EN_AR = {v: k for k, v in PROTECTED_AR_EN.items()}
MODEL_NAMES = {
    ("ar", "en"): "Helsinki-NLP/opus-mt-tc-big-ar-en",
    ("en", "ar"): "Helsinki-NLP/opus-mt-tc-big-en-ar",
}


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
    if src == "ar":
        return bool(AR_RE.search(text))
    return bool(EN_RE.search(text)) and not looks_technical(text)


def looks_technical(text: str) -> bool:
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


class LocalTranslator:
    _loaded: dict[tuple[str, str], tuple[object, object]] = {}

    def __init__(self, src: str, dst: str, cache: dict[str, str]):
        self.src = src
        self.dst = dst
        self.cache = cache
        self.mapping = PROTECTED_AR_EN if src == "ar" else PROTECTED_EN_AR

    def _load(self):
        key = (self.src, self.dst)
        if key not in self._loaded:
            import torch
            from transformers import MarianMTModel, MarianTokenizer
            model_name = MODEL_NAMES[key]
            print(f"LOAD {model_name}", flush=True)
            tokenizer = MarianTokenizer.from_pretrained(model_name)
            model = MarianMTModel.from_pretrained(model_name)
            model.eval()
            torch.set_num_threads(max(1, min(4, os.cpu_count() or 2)))
            self._loaded[key] = (tokenizer, model)
        return self._loaded[key]

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
            text = re.sub(re.escape(token), replacement, text, flags=re.I)
        return text

    @staticmethod
    def _split_long(text: str, limit: int = 820) -> list[str]:
        text = text.strip()
        if len(text) <= limit:
            return [text]
        pieces = re.split(r"(?<=[.!?؟؛])\s+|\n+", text)
        chunks: list[str] = []
        buf = ""
        for piece in pieces:
            if not piece:
                continue
            if len(piece) > limit:
                words = piece.split()
                for word in words:
                    if buf and len(buf) + len(word) + 1 > limit:
                        chunks.append(buf.strip())
                        buf = ""
                    buf += (" " if buf else "") + word
                continue
            if buf and len(buf) + len(piece) + 1 > limit:
                chunks.append(buf.strip())
                buf = piece
            else:
                buf += (" " if buf else "") + piece
        if buf:
            chunks.append(buf.strip())
        return chunks or [text]

    def _translate_batch(self, texts: list[str]) -> list[str]:
        if not texts:
            return []
        import torch
        tokenizer, model = self._load()
        prepared = [f">>ara<< {x}" if self.src == "en" and self.dst == "ar" else x for x in texts]
        encoded = tokenizer(prepared, return_tensors="pt", padding=True, truncation=True, max_length=512)
        with torch.inference_mode():
            output = model.generate(**encoded, max_new_tokens=512, num_beams=4, early_stopping=True)
        return tokenizer.batch_decode(output, skip_special_tokens=True)

    def prefill(self, texts: list[str]) -> None:
        work: list[tuple[str, dict[str, str], list[str]]] = []
        seen: set[str] = set()
        for text in texts:
            if not needs_translation(text, self.src):
                continue
            raw = text.strip()
            if not raw:
                continue
            key = f"{self.src}>{self.dst}|{raw}"
            if key in self.cache or key in seen:
                continue
            seen.add(key)
            masked, tokens = self._mask(raw)
            work.append((key, tokens, self._split_long(masked)))

        flat: list[str] = []
        spans: list[tuple[int, int]] = []
        for _key, _tokens, chunks in work:
            start = len(flat)
            flat.extend(chunks)
            spans.append((start, len(flat)))

        translated_flat: list[str] = []
        batch_size = 12
        for start in range(0, len(flat), batch_size):
            batch = flat[start:start + batch_size]
            translated_flat.extend(self._translate_batch(batch))
            print(f"TRANSLATED {min(start + batch_size, len(flat))}/{len(flat)}", flush=True)

        for (key, tokens, _chunks), (start, end) in zip(work, spans):
            translated = " ".join(translated_flat[start:end]).strip()
            translated = self._unmask(translated, tokens)
            if self.dst == "en":
                translated = translated.replace("Excellence 10X", "Tamayuz 10X")
            self.cache[key] = translated

    def text(self, text: str) -> str:
        if not needs_translation(text, self.src):
            return text
        raw = text.strip()
        if not raw:
            return text
        key = f"{self.src}>{self.dst}|{raw}"
        if key not in self.cache:
            self.prefill([raw])
        translated = self.cache.get(key, raw)
        lead = text[: len(text) - len(text.lstrip())]
        tail = text[len(text.rstrip()):]
        return lead + translated + tail


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


def collect_strings(soup: BeautifulSoup, src_lang: str) -> list[str]:
    texts: list[str] = []
    for node in soup.find_all(string=True):
        parent = node.parent
        if not parent or parent.name in SKIP_TAGS or parent.name == "script":
            continue
        text = str(node)
        if needs_translation(text, src_lang):
            texts.append(text)
    for tag in soup.find_all(True):
        for attr in TEXT_ATTRS:
            if tag.has_attr(attr) and needs_translation(str(tag[attr]), src_lang):
                texts.append(str(tag[attr]))
        if tag.name == "meta" and tag.has_attr("content"):
            key = (tag.get("name") or tag.get("property") or "").lower()
            if key in META_KEYS and needs_translation(str(tag["content"]), src_lang):
                texts.append(str(tag["content"]))
    return texts


def translate_jsonld(obj, tr: LocalTranslator, source_url: str, target_url: str):
    if isinstance(obj, dict):
        out = {}
        for key, value in obj.items():
            if isinstance(value, str):
                if source_url in value:
                    value = value.replace(source_url, target_url)
                if key.startswith("@") or key in {"url", "image", "sameAs", "identifier", "contentUrl", "embedUrl"}:
                    out[key] = value
                else:
                    out[key] = tr.text(value)
            else:
                out[key] = translate_jsonld(value, tr, source_url, target_url)
        return out
    if isinstance(obj, list):
        return [translate_jsonld(x, tr, source_url, target_url) for x in obj]
    if isinstance(obj, str):
        return tr.text(obj)
    return obj


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
            a["hreflang"] = "ar"
            a["lang"] = "ar"
            a.clear()
            a.append("العربية")
        elif lang == "ar" and (a.get("hreflang") == "ar" or a.get("lang") == "ar" or text == "العربية"):
            a["href"] = "/en/" if name == "index.html" else f"/en/{name}"
            a["hreflang"] = "en"
            a["lang"] = "en"
            a.clear()
            a.append("English")


def transform(source: Path, target_lang: str, cache: dict[str, str]) -> str:
    src_lang = "ar" if target_lang == "en" else "en"
    tr = LocalTranslator(src_lang, target_lang, cache)
    original = source.read_text(encoding="utf-8")
    soup = BeautifulSoup(original, "html.parser")
    name = source.name
    print(f"TRANSLATE {source} {src_lang}->{target_lang}", flush=True)

    tr.prefill(collect_strings(soup, src_lang))
    source_url = ar_url(name) if src_lang == "ar" else en_url(name)
    target_url = en_url(name) if target_lang == "en" else ar_url(name)

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
            continue
        text = str(node)
        if isinstance(node, NavigableString) and needs_translation(text, src_lang):
            node.replace_with(tr.text(text))

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
    return [page for page in sorted(Path(".").glob("*.html")) if page.name not in ROOT_EXCLUDE]


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
    parser = argparse.ArgumentParser()
    parser.add_argument("--full-ar", action="store_true")
    parser.add_argument("--changed", action="store_true")
    args = parser.parse_args()
    cache = load_cache()
    any_change = False

    if args.full_ar:
        for page in root_pages():
            any_change |= sync(page, "en", cache)
            save_cache(cache)
    elif args.changed:
        paths = [x.strip() for x in os.getenv("BILINGUAL_CHANGED_FILES", "").splitlines() if x.strip()]
        ar_changed = [Path(x) for x in paths if "/" not in x and x.endswith(".html") and x not in ROOT_EXCLUDE]
        en_changed = [Path(x) for x in paths if x.startswith("en/") and x.endswith(".html")]
        if ar_changed and en_changed:
            print("Bilingual conflict: both language editions changed in one commit; human review required.", file=sys.stderr)
            return 2
        for page in ar_changed:
            if page.exists():
                any_change |= sync(page, "en", cache)
        for page in en_changed:
            if page.exists():
                any_change |= sync(page, "ar", cache)
    else:
        parser.error("Choose --full-ar or --changed")

    save_cache(cache)
    print("CHANGED=1" if any_change else "CHANGED=0")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
