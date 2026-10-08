#!/usr/bin/env python3
"""Connect reviewed covers to static social metadata, article covers and cards.

Only image metadata and presentation are updated. Publication dates, canonical
URLs, article prose, audio layers and editorial English remain unchanged.
"""
import html
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SPEC = json.loads((ROOT / 'data/article-covers.json').read_text())
CARDS = {c['slug']: c for c in SPEC['cards']}
REV = SPEC['version']
STYLE = f'<link rel="stylesheet" href="/assets/css/story-cards.css?v={REV}">'


def attrs(tag):
    return {m[1].lower(): html.unescape(m[3]) for m in re.finditer(r'''([\w:-]+)\s*=\s*(["'])(.*?)\2''', tag, re.S)}


def image_path(slug, lang):
    # Use a fresh URL after first publication to bypass cached pre-generation 404s.
    version = '20261008-masdar-v2' if slug == 'case-masdar-city-building-sustainability-capability' else REV
    return f'/assets/previews/story/{slug}-{lang}.jpg?v={version}'


def set_meta(source, key, value):
    replacement = f'<meta {"property" if key.startswith("og:") else "name"}="{key}" content="{html.escape(str(value), quote=True)}">'
    found = False
    def update(match):
        nonlocal found
        data = attrs(match[0])
        if data.get('property', data.get('name')) != key:
            return match[0]
        if found:
            return ''
        found = True
        return replacement
    source = re.sub(r'<meta\b[^>]*>', update, source, flags=re.I)
    if not found:
        source = source.replace('</head>', replacement + '\n</head>', 1)
    return source


def style_link(source):
    pattern = r'<link\b[^>]*href=["\'][^"\']*story-cards\.css[^>]*>'
    if re.search(pattern, source):
        return re.sub(pattern, lambda _: STYLE, source, count=1)
    return source.replace('</head>', STYLE + '\n</head>', 1)


def figure(slug, lang):
    alt = html.escape(CARDS[slug][lang]['alt'], quote=True)
    note = '' if CARDS[slug].get('reference') else ('صورة توضيحية' if lang == 'ar' else 'Illustrative image')
    caption = f'<figcaption class="story-cover-note" data-no-speech="true">{note}</figcaption>' if note else ''
    return f'<figure class="story-cover"><img src="{image_path(slug, lang)}" alt="{alt}" width="1200" height="630" decoding="async" fetchpriority="high">{caption}</figure>'


def sync_page(path, slug, lang):
    source = path.read_text()
    url = 'https://tamayuz10x.com' + image_path(slug, lang)
    for key, value in {
        'og:image': url, 'og:image:secure_url': url, 'og:image:type': 'image/jpeg',
        'og:image:width': 1200, 'og:image:height': 630, 'og:image:alt': CARDS[slug][lang]['alt'],
        'twitter:image': url, 'twitter:image:alt': CARDS[slug][lang]['alt'], 'twitter:card': 'summary_large_image',
    }.items():
        source = set_meta(source, key, value)

    def update_schema(match):
        data = json.loads(match[2])
        changed = False
        def visit(node):
            nonlocal changed
            if isinstance(node, list):
                for item in node: visit(item)
            elif isinstance(node, dict):
                types = node.get('@type', [])
                types = [types] if isinstance(types, str) else types
                if any(t in ('Article', 'BlogPosting', 'NewsArticle') for t in types):
                    node['image'] = {'@type': 'ImageObject', 'url': url, 'width': 1200, 'height': 630, 'caption': CARDS[slug][lang]['alt']}
                    changed = True
                if '@graph' in node: visit(node['@graph'])
        visit(data)
        return match[1] + json.dumps(data, ensure_ascii=False) + match[3] if changed else match[0]
    source = re.sub(r'(<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>)(.*?)(</script>)', update_schema, source, flags=re.S)

    cover = figure(slug, lang)
    source, count = re.subn(r'<figure\b[^>]*class=["\'][^"\']*cover[^"\']*["\'][^>]*>.*?</figure>', lambda _: cover, source, count=1, flags=re.S)
    if not count:
        source, count = re.subn(r'<img\b[^>]*class=["\'][^"\']*article-preview-hero[^"\']*["\'][^>]*>', lambda _: cover, source, count=1, flags=re.S)
    if not count:
        for pattern in (r'<section\b[^>]*class=["\'][^"\']*hero[^"\']*["\'][^>]*>.*?</section>', r'<header\b[^>]*>.*?</header>'):
            candidates = [m for m in re.finditer(pattern, source, re.S) if re.search(r'<h1\b', m[0])]
            if candidates:
                end = candidates[0].end()
                source = source[:end] + '\n' + cover + '\n' + source[end:]
                count = 1
                break
    if not count:
        raise ValueError(f'No unambiguous cover insertion point: {path}')
    source = style_link(source)
    if source != path.read_text(): path.write_text(source)


def slug_from_card(block):
    opening = block[:block.find('>') + 1]
    href = attrs(opening).get('data-href')
    if not href:
        title_link = re.search(r'<h3\b[^>]*>\s*<a\b[^>]*>', block)
        href = attrs(title_link[0]).get('href') if title_link else None
    return Path(urlsplit(href).path).stem if href else None


def sync_card(block, lang):
    slug = slug_from_card(block)
    if slug not in CARDS: return block
    href = ('/en/' if lang == 'en' else '/') + slug + '.html'
    title = re.search(r'<h3\b[^>]*>(.*?)</h3>', block, re.S)
    label = html.unescape(re.sub('<[^>]*>', '', title[1])) if title else slug
    preview = f'<a class="article-preview" href="{href}" aria-label="{html.escape(label, quote=True)}"><img src="{image_path(slug,lang)}" alt="{html.escape(CARDS[slug][lang]["alt"],quote=True)}" width="1200" height="630" loading="lazy" decoding="async"></a>'
    found = False
    def replace_preview(match):
        nonlocal found
        if found: return ''
        found = True
        return preview
    block = re.sub(r'<a\b[^>]*class=["\'][^"\']*article-preview[^"\']*["\'][^>]*>.*?</a>', replace_preview, block, flags=re.S)
    if not found:
        pos = block.find('>') + 1
        block = block[:pos] + '\n' + preview + block[pos:]
    if 'data-story-card' not in block[:block.find('>')]:
        block = block.replace('<article ', '<article data-story-card="true" ', 1)
    return block


def main():
    for slug in CARDS:
        for lang in ('ar', 'en'):
            path = ROOT / ('en' if lang == 'en' else '') / (slug + '.html')
            # A reflection may launch in one language first. Sync only published pages;
            # the missing companion language must not block the reviewed cover.
            if path.exists():
                sync_page(path, slug, lang)

    indexes = {}
    for lang in ('ar', 'en'):
        path = ROOT / ('en' if lang == 'en' else '') / 'articles.html'
        source = re.sub(r'<article\b[^>]*class=["\'][^"\']*article-card[^"\']*["\'][^>]*>.*?</article>', lambda m: sync_card(m[0],lang), path.read_text(), flags=re.S)
        indexes[lang] = {slug_from_card(m[0]): m[0] for m in re.finditer(r'<article\b[^>]*>.*?</article>', source, re.S)}
        path.write_text(style_link(source))

    for lang in ('ar', 'en'):
        for name in ('quranic-reflections.html', 'agentic-ai-10x.html'):
            path = ROOT / ('en' if lang == 'en' else '') / name
            # Keep the existing collection membership and use the canonical card.
            def update(match):
                slug = slug_from_card(match[0])
                return indexes[lang].get(slug, match[0])
            source = re.sub(r'<article\b[^>]*>.*?</article>', update, path.read_text(), flags=re.S)
            path.write_text(style_link(source))

        # The home-page feature normally follows the collection dynamically;
        # its static fallback must use the same reviewed cover as well.
        path = ROOT / ('en' if lang == 'en' else '') / 'homepage-v2-preview.html'
        slug = 'case-rwanda-blood-on-demand-aerial-logistics'
        source = re.sub(
            rf'/assets/previews/(?:story/)?{slug}-{lang}\.(?:jpg|png)(?:\?[^"\s<>]*)?',
            image_path(slug, lang), path.read_text(),
        )
        if source != path.read_text(): path.write_text(source)

    print(f'Synchronized {len(CARDS)*2} article covers and social previews, plus Arabic and English article collections.')


if __name__ == '__main__':
    main()
