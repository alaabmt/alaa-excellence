#!/usr/bin/env python3
"""Render the shared Maryam-inspired cover template from reviewed bilingual copy.

The photographic illustrations are generated assets. This script only lays out
the editable typography and exports web-sized JPEGs using native Arabic shaping.
Requires Pillow with libraqm; all fonts and source art are checked into the repo.
"""
import argparse
import io
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps, features

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'data/article-covers.json'
OUT = ROOT / 'assets/previews/story'
GOLD = '#e5bc78'
CREAM = '#fff0c7'
LABELS = {
    'ar': {'case': 'حالات وتجارب', 'reflection': 'تأملات قرآنية', 'idea': 'أفكار للتميّز', 'article': 'مقالات ورؤى', 'prevention': 'منهجية هندسة الوقاية (FMEA)'},
    'en': {'case': 'Cases & Insights', 'reflection': 'Quranic Reflections', 'idea': 'Ideas for Excellence', 'article': 'Ideas & Insights', 'prevention': 'FMEA · Failure Mode & Effects Analysis'},
}


def font(size, bold=False):
    name = 'Amiri-Bold.ttf' if bold else 'Amiri-Regular.ttf'
    return ImageFont.truetype(str(ROOT / 'assets/fonts' / name), size, layout_engine=ImageFont.Layout.RAQM)


def export_jpeg(im, path, cap=160000):
    for quality in range(92, 49, -2):
        stream = io.BytesIO()
        im.convert('RGB').save(stream, format='JPEG', quality=quality, optimize=True, progressive=True, subsampling=0)
        if stream.tell() < cap:
            path.parent.mkdir(parents=True, exist_ok=True)
            data = stream.getvalue()
            if not path.exists() or path.read_bytes() != data:
                temporary = path.with_suffix('.tmp')
                temporary.write_bytes(data)
                temporary.replace(path)
            return len(data)
    raise ValueError(f'Cannot meet the cover byte limit: {path}')


def width(draw, text, f, direction):
    return draw.textlength(text, font=f, direction=direction)


def wrap(draw, text, f, direction, limit=648):
    lines = ['']
    for word in text.split():
        candidate = (lines[-1] + ' ' + word).strip()
        if lines[-1] and width(draw, candidate, f, direction) > limit:
            lines.append(word)
        else:
            lines[-1] = candidate
    return lines



def procedural_background(card, spec):
    """Create a deterministic original editorial scene when no raster background is checked in."""
    width, height = spec['width'], spec['height']
    im = Image.new('RGB', (width, height), '#163b4a')
    d = ImageDraw.Draw(im)
    # Dawn sky and neighborhood depth.
    for y in range(height):
        t = y / max(1, height - 1)
        r = round(22 + 10 * t); g = round(59 + 35 * t); b = round(74 + 22 * t)
        d.line((0, y, width, y), fill=(r, g, b))
    d.ellipse((60, 50, 180, 170), fill='#e5bc78')
    d.polygon([(0,330),(150,235),(280,320),(430,210),(560,330),(560,630),(0,630)], fill='#274f55')
    # Homes and a primary-care clinic on the visible left.
    for x,y,w,h,c in [(25,300,120,120,'#d7c59f'),(165,270,110,150,'#b9d2c8'),(295,315,95,105,'#d9b28c')]:
        d.rectangle((x,y,x+w,y+h),fill=c); d.polygon([(x-8,y),(x+w/2,y-55),(x+w+8,y)],fill='#5b3f35')
        d.rectangle((x+18,y+45,x+48,y+h),fill='#244252')
    d.rounded_rectangle((40,150,310,275),radius=14,fill='#edf2e9',outline='#b7c8bf',width=3)
    d.rectangle((70,185,150,255),fill='#79a9b2'); d.rectangle((175,185,280,255),fill='#79a9b2')
    d.line((50,286,520,570),fill='#d8c5a0',width=78)
    # Five simplified team figures; no close-up faces or identifying detail.
    people=[(95,390,'#27496b'),(155,410,'#f2f0e8'),(215,385,'#1d3557'),(275,420,'#f2f0e8'),(335,400,'#3b6978')]
    for x,y,color in people:
        d.ellipse((x,y-24,x+26,y+2),fill='#6b4938')
        d.rounded_rectangle((x-2,y,x+30,y+78),radius=10,fill=color)
        d.line((x+7,y+78,x+2,y+132),fill='#172b36',width=9)
        d.line((x+23,y+78,x+30,y+132),fill='#172b36',width=9)
    return im

def render(card, lang, spec):
    out = OUT / f"{card['slug']}-{lang}.jpg"
    if card.get('reference'):
        im = ImageOps.fit(Image.open(ROOT / card[lang]['source']).convert('RGB'), (spec['width'], spec['height']), method=Image.Resampling.LANCZOS)
        return export_jpeg(im, out)
    if card.get('procedural_scene'):
        im = procedural_background(card, spec)
    else:
        im = Image.open(ROOT / card['background']).convert('RGB')
    if im.size != (spec['width'], spec['height']):
        raise ValueError(f'Wrong background dimensions: {card["slug"]}')
    # A consistent navy reading panel keeps pale typography legible even when
    # a photograph has bright highlights near the transition into the text.
    # Preserve the full photographic scene at the left, with a soft transition.
    panel_mask = Image.new('L', im.size)
    mask_draw = ImageDraw.Draw(panel_mask)
    for column in range(360, im.width):
        t = min(1.0, (column - 360) / 200)
        alpha = round(240 * t * t * (3 - 2 * t))
        mask_draw.line((column, 0, column, im.height), fill=alpha)
    im = Image.composite(Image.new('RGB', im.size, '#05223b'), im, panel_mask)
    draw = ImageDraw.Draw(im)
    direction = 'rtl' if lang == 'ar' else 'ltr'
    x, anchor = (1150, 'rt') if lang == 'ar' else (504, 'lt')
    title = card[lang]['title']
    title_size = (82 if len(title) <= 2 else 70) if lang == 'ar' else (66 if len(title) <= 2 else 58)
    while any(width(draw, line, font(title_size, True), direction) > 646 for line in title):
        title_size -= 1
    if title_size < (58 if lang == 'ar' else 44):
        raise ValueError(f'Title needs editorial shortening: {card["slug"]}/{lang}')
    title_font = font(title_size, True)
    step = round(title_size * (1.28 if lang == 'ar' else 1.12))
    top = round(282 - (len(title) * step) / 2)
    for i, line in enumerate(title):
        draw.text((x, top + i * step), line, font=title_font, fill=CREAM, direction=direction, anchor=anchor)

    header = ('التميّز 10X · ' if lang == 'ar' else 'Tamayuz 10X · ') + LABELS[lang][card['category']]
    header_font = font(30 if lang == 'ar' else 28)
    draw.text((x, 82), header, font=header_font, fill=GOLD, direction=direction, anchor=anchor)
    draw.line((504, 136, 1150, 136), fill='#806641', width=1)

    sub_size = 36 if lang == 'ar' else 31
    while True:
        sub_font = font(sub_size)
        lines = wrap(draw, card[lang]['subtitle'], sub_font, direction)
        if len(lines) <= 2:
            break
        sub_size -= 1
    if sub_size < 27:
        raise ValueError(f'Subtitle needs editorial shortening: {card["slug"]}/{lang}')
    for i, line in enumerate(lines):
        draw.text((x, 415 + i * round(sub_size * 1.32)), line, font=sub_font, fill=CREAM, direction=direction, anchor=anchor)

    author = 'الدكتور علاء محمد أحمد' if lang == 'ar' else 'Dr. Alaa Mohammad Ahmed'
    author_font = font(31 if lang == 'ar' else 28)
    draw.line((504, 544, 1150, 544), fill='#806641', width=1)
    draw.text((x, 561), author, font=author_font, fill=GOLD, direction=direction, anchor=anchor)
    draw.text((48, 561), 'tamayuz10x.com', font=font(30, True), fill=GOLD, anchor='lt', stroke_width=1, stroke_fill='#05223b')
    return export_jpeg(im, out)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--slug', help='Render one reviewed card in both languages')
    args = parser.parse_args()
    if not features.check('raqm'):
        raise SystemExit('libraqm is required for Arabic shaping; do not render without it.')
    spec = json.loads(MANIFEST.read_text())
    cards = [c for c in spec['cards'] if not args.slug or c['slug'] == args.slug]
    sizes = [render(c, lang, spec) for c in cards for lang in ('ar', 'en')]
    print(f'Rendered {len(sizes)} bilingual covers; largest {max(sizes):,} bytes; all below {spec["maxBytes"]:,} bytes.')


if __name__ == '__main__':
    main()
