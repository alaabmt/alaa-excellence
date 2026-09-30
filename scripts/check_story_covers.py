#!/usr/bin/env python3
"""Quality gate for the bilingual cover set and its static page references."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SPEC = json.loads((ROOT / 'data/article-covers.json').read_text())
CARDS = {c['slug']: c for c in SPEC['cards']}


class Tags(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.meta, self.images = {}, []
        self.feed(source)

    def handle_starttag(self, tag, attributes):
        data = dict(attributes)
        if tag == 'meta':
            key = data.get('property', data.get('name'))
            self.meta.setdefault(key, []).append(data.get('content'))
        if tag == 'img': self.images.append(data)


def main():
    errors, sizes = [], []
    for slug, card in CARDS.items():
        if card.get('background'):
            background = ROOT / card['background']
            try:
                with Image.open(background) as im:
                    im.load()
                    if im.size != (1200, 630):
                        errors.append(f'Wrong source dimensions: {background.relative_to(ROOT)}')
            except (OSError, ValueError) as exc:
                errors.append(f'Unreadable source illustration: {background.relative_to(ROOT)}: {exc}')
        for lang in ('ar', 'en'):
            relative = f'assets/previews/story/{slug}-{lang}.jpg'
            image_file = ROOT / relative
            if not image_file.exists():
                errors.append(f'Missing cover: {relative}')
                continue
            size = image_file.stat().st_size
            sizes.append(size)
            with Image.open(image_file) as im:
                if im.size != (1200, 630) or im.format != 'JPEG':
                    errors.append(f'Wrong cover format or dimensions: {relative}')
                im.load()
            if size >= SPEC['maxBytes']: errors.append(f'Cover exceeds byte limit: {relative}: {size}')

            page = ROOT / ('en' if lang == 'en' else '') / (slug + '.html')
            # Validate page metadata only for languages that are actually published.
            # Generated companion-language assets may exist before the page does.
            if not page.exists():
                continue
            source = page.read_text()
            tags = Tags(source)
            url = f'https://tamayuz10x.com/{relative}?v={SPEC["version"]}'
            for key, expected in {
                'og:image': url, 'og:image:secure_url': url, 'twitter:image': url,
                'og:image:width': '1200', 'og:image:height': '630', 'og:image:type': 'image/jpeg',
                'og:image:alt': card[lang]['alt'], 'twitter:image:alt': card[lang]['alt'],
                'twitter:card': 'summary_large_image',
            }.items():
                if tags.meta.get(key) != [expected]: errors.append(f'{page.relative_to(ROOT)}: incorrect {key}')
            covers = re.findall(r'<figure class="story-cover">(.*?)</figure>', source, re.S)
            if len(covers) != 1 or url.replace('https://tamayuz10x.com','') not in covers[0]:
                errors.append(f'{page.relative_to(ROOT)}: expected exactly one matching in-page cover')
            if '/assets/css/story-cards.css?' not in source: errors.append(f'{page.name}: missing shared cover stylesheet')

    # Existing drafts and redirect pages are deliberately excluded.
    for page in ROOT.glob('*.html'):
        if not page.name.startswith(('article-', 'case-', 'idea-', 'reflection-')): continue
        tags = Tags(page.read_text())
        if any('noindex' in value for value in tags.meta.get('robots', [])): continue
        if page.stem not in CARDS: errors.append(f'Published article lacks a reviewed cover: {page.name}')

    count = 0
    for lang in ('ar', 'en'):
        for name in ('articles.html', 'quranic-reflections.html', 'agentic-ai-10x.html'):
            path = ROOT / ('en' if lang == 'en' else '') / name
            source = path.read_text()
            for block in re.findall(r'<article\b[^>]*data-story-card[^>]*>.*?</article>', source, re.S):
                count += 1
                images = Tags(block).images
                if len(images) != 1:
                    errors.append(f'{path.relative_to(ROOT)}: a card has {len(images)} images')
                    continue
                src = images[0].get('src', '')
                if not re.search(rf'/assets/previews/story/.+-{lang}\.jpg\?v=', src):
                    errors.append(f'{path.relative_to(ROOT)}: wrong language or legacy preview: {src}')
                if not images[0].get('alt') or not (ROOT / urlsplit(src).path.lstrip('/')).exists():
                    errors.append(f'{path.relative_to(ROOT)}: missing image or alternative text: {src}')
            if name == 'articles.html':
                all_cards = len(re.findall(r'<article\b[^>]*class="article-card"', source))
                unified = len(re.findall(r'<article\b[^>]*data-story-card', source))
                if all_cards != unified: errors.append(f'{path.relative_to(ROOT)}: {all_cards-unified} cards are not unified')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'STORY COVERS: PASSED — {len(sizes)} images, {count} cards, largest {max(sizes):,} bytes.')


if __name__ == '__main__': main()
