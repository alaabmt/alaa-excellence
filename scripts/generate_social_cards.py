#!/usr/bin/env python3
from pathlib import Path
import re
from PIL import Image, ImageDraw, ImageFont, ImageOps
import arabic_reshaper
from bidi.algorithm import get_display

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "social"
OUT.mkdir(parents=True, exist_ok=True)

PROFILE = ROOT / "assets" / "images" / "alaa-mohammad-ahmad-profile-hq.webp"
LOGO = ROOT / "assets" / "images" / "file_0000000047188210ac6952e999d2eda7.png"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

NAVY = "#0b2545"
NAVY2 = "#173d68"
GOLD = "#c5a05c"
WHITE = "#ffffff"
SOFT = "#f4f7fb"
INK = "#17324d"
MUTED = "#617083"

CARDS = [
    {
        "slug": "dubai-paperless-share",
        "page": "case-dubai-paperless-10x.html",
        "category": "حالة تطبيقية · التحول المؤسسي",
        "title": "دبي بلا ورق",
        "subtitle": "عندما يكون التحول الحقيقي هو إلغاء الحاجة إلى الورق، لا تحويله إلى شاشة",
        "og_title": "دبي بلا ورق: عندما نعيد تصميم العمل بدلاً من رقمنته",
        "og_desc": "لم تبدأ دبي من سؤال: كيف نُسرّع المعاملة الورقية؟ بل من سؤال أعمق: لماذا نحتاج إليها بهذا الشكل أصلاً؟",
        "alt": "بطاقة مقال دبي بلا ورق من التميّز 10X مع صورة الدكتور علاء محمد أحمد",
    },
    {
        "slug": "ega-innovation-share",
        "page": "case-ega-dx-ultra-innovation.html",
        "category": "حالة تطبيقية · الابتكار الصناعي",
        "title": "من مصنع في الإمارات إلى تقنية تعمل في البحرين",
        "subtitle": "متى يصبح الابتكار قدرة قابلة للتصدير؟",
        "og_title": "من مصنع في الإمارات إلى تقنية تعمل في البحرين: متى يصبح الابتكار قدرة قابلة للتصدير؟",
        "og_desc": "قصة موثقة تكشف كيف تتحول المعرفة التشغيلية المتراكمة إلى قدرة صناعية قابلة للقياس والنقل والتصدير.",
        "alt": "بطاقة مقال EGA والابتكار الصناعي من التميّز 10X مع صورة الدكتور علاء محمد أحمد",
    },
]


def rtl(text: str) -> str:
    return get_display(arabic_reshaper.reshape(text))


def text_width(draw, text, font):
    box = draw.textbbox((0, 0), rtl(text), font=font)
    return box[2] - box[0]


def wrap_rtl(draw, text, font, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = word if not current else current + " " + word
        if text_width(draw, candidate, font) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_rtl_lines(draw, lines, xy, font, fill, max_width, spacing=10):
    x, y = xy
    for line in lines:
        shown = rtl(line)
        box = draw.textbbox((0, 0), shown, font=font)
        w = box[2] - box[0]
        h = box[3] - box[1]
        draw.text((x + max_width - w, y), shown, font=font, fill=fill)
        y += h + spacing
    return y


def rounded_image(img, size, radius=32, centering=(0.5, 0.34)):
    fitted = ImageOps.fit(img.convert("RGB"), size, method=Image.Resampling.LANCZOS, centering=centering)
    mask = Image.new("L", size, 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    out = Image.new("RGBA", size, (255, 255, 255, 0))
    out.paste(fitted.convert("RGBA"), (0, 0), mask)
    return out


def fit_logo(img, max_w=205, max_h=80):
    im = img.convert("RGBA")
    scale = min(max_w / im.width, max_h / im.height)
    return im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.Resampling.LANCZOS)


def make_card(cfg):
    W, H = 1200, 630
    canvas = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(canvas)

    # Brand frame
    draw.rounded_rectangle((28, 28, W - 28, H - 28), radius=38, fill=SOFT)
    draw.rounded_rectangle((60, 60, 405, 570), radius=34, fill=NAVY)
    draw.ellipse((73, 74, 390, 390), fill=NAVY2)
    draw.text((105, 405), "10X", font=ImageFont.truetype(FONT_BOLD, 78), fill="#264f78")

    # Portrait
    profile = Image.open(PROFILE)
    portrait = rounded_image(profile, (285, 390), 30)
    canvas.paste(portrait, (90, 100), portrait)

    # Author line on portrait panel
    author_font = ImageFont.truetype(FONT_BOLD, 24)
    author = rtl("الدكتور علاء محمد أحمد")
    box = draw.textbbox((0, 0), author, font=author_font)
    aw = box[2] - box[0]
    draw.text((90 + (285 - aw) / 2, 510), author, font=author_font, fill=WHITE)

    # Logo pill
    draw.rounded_rectangle((885, 70, 1110, 157), radius=20, fill=WHITE)
    logo = fit_logo(Image.open(LOGO))
    lx = 885 + (225 - logo.width) // 2
    ly = 70 + (87 - logo.height) // 2
    canvas.paste(logo, (lx, ly), logo)

    # Category chip
    cat_font = ImageFont.truetype(FONT_BOLD, 22)
    cat = rtl(cfg["category"])
    cb = draw.textbbox((0, 0), cat, font=cat_font)
    cw = cb[2] - cb[0]
    chip_x = 1085 - cw - 34
    draw.rounded_rectangle((chip_x, 185, 1085, 232), radius=22, fill=NAVY)
    draw.text((chip_x + 17, 193), cat, font=cat_font, fill=WHITE)

    # Main title / subtitle
    text_x = 455
    text_w = 630
    title_font = ImageFont.truetype(FONT_BOLD, 47)
    sub_font = ImageFont.truetype(FONT_REG, 31)
    title_lines = wrap_rtl(draw, cfg["title"], title_font, text_w)
    y = draw_rtl_lines(draw, title_lines, (text_x, 270), title_font, NAVY, text_w, spacing=14)
    y += 10
    sub_lines = wrap_rtl(draw, cfg["subtitle"], sub_font, text_w)
    y = draw_rtl_lines(draw, sub_lines, (text_x, y), sub_font, INK, text_w, spacing=11)

    # Accent and footer
    draw.rounded_rectangle((955, 521, 1085, 529), radius=4, fill=GOLD)
    site_font = ImageFont.truetype(FONT_BOLD, 20)
    site = "tamayuz10x.com"
    sb = draw.textbbox((0, 0), site, font=site_font)
    sw = sb[2] - sb[0]
    draw.text((1085 - sw, 545), site, font=site_font, fill=MUTED)

    out_path = OUT / f"{cfg['slug']}.png"
    canvas.save(out_path, format="PNG", optimize=True)
    return out_path


def ensure_social_meta(page_path: Path, cfg):
    html = page_path.read_text(encoding="utf-8")
    image_url = f"https://tamayuz10x.com/assets/social/{cfg['slug']}.png?v=20260907-social1"

    html = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{cfg["og_title"]}">', html, count=1)
    html = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{cfg["og_desc"]}">', html, count=1)
    html = re.sub(r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="{image_url}">', html, count=1)
    html = re.sub(r'<meta name="twitter:image" content="[^"]*">', f'<meta name="twitter:image" content="{image_url}">', html, count=1)

    # Remove old structured image fields to avoid duplicates, then append after og:image.
    html = re.sub(r'<meta property="og:image:(?:type|width|height|alt|secure_url)" content="[^"]*">\s*', '', html)
    html = re.sub(r'<meta name="twitter:image:alt" content="[^"]*">\s*', '', html)
    anchor = f'<meta property="og:image" content="{image_url}">'
    extra = (
        anchor
        + f'\n<meta property="og:image:secure_url" content="{image_url}">'
        + '\n<meta property="og:image:type" content="image/png">'
        + '\n<meta property="og:image:width" content="1200">'
        + '\n<meta property="og:image:height" content="630">'
        + f'\n<meta property="og:image:alt" content="{cfg["alt"]}">'
        + f'\n<meta name="twitter:image:alt" content="{cfg["alt"]}">'
    )
    html = html.replace(anchor, extra, 1)

    # Keep Twitter teaser clean and curiosity-led.
    html = re.sub(r'<meta name="twitter:description" content="[^"]*">', f'<meta name="twitter:description" content="{cfg["og_desc"]}">', html, count=1)

    page_path.write_text(html, encoding="utf-8")


def update_articles_listing():
    path = ROOT / "articles.html"
    if not path.exists():
        return
    html = path.read_text(encoding="utf-8")

    # Upgrade Dubai teaser to the approved editorial card style.
    html = re.sub(
        r'(<article class="article-card"[^>]*data-href="case-dubai-paperless-10x\.html".*?<h3>.*?</h3>)<p>.*?</p><a class="article-action" href="case-dubai-paperless-10x\.html">.*?</a>',
        r'\1<p><a href="case-dubai-paperless-10x.html">لم تبدأ دبي من سؤال: كيف نُسرّع المعاملة الورقية؟ بل من سؤال أعمق: لماذا نحتاج إليها بهذا الشكل أصلاً؟ قصة تحول تكشف كيف يمكن لإعادة التفكير في العمليات أن تسبق التقنية وتصنع أثراً أكبر.</a></p><a class="article-action" href="case-dubai-paperless-10x.html">اقرأ القصة والتحول الذي وراءها ←</a>',
        html,
        count=1,
        flags=re.S,
    )

    # Add EGA case to the top of the grid if it is not listed yet.
    if 'data-href="case-ega-dx-ultra-innovation.html"' not in html:
        marker = '<div class="article-grid" id="article-grid">'
        card = '''\n<article class="article-card" data-category="case management" data-topic="الابتكار الصناعي والقدرات المؤسسية" data-date="2026-09-07" data-read-minutes="8" data-href="case-ega-dx-ultra-innovation.html"><div class="article-meta"><span class="tag">حالة تطبيقية</span><span>8 دقائق قراءة</span><time datetime="2026-09-07">7 سبتمبر 2026</time></div><h3><a href="case-ega-dx-ultra-innovation.html">من مصنع في الإمارات إلى تقنية تعمل في البحرين: متى يصبح الابتكار قدرة قابلة للتصدير؟</a></h3><p><a href="case-ega-dx-ultra-innovation.html">من السهل أن تصف المؤسسة مشروعاً داخلياً بأنه ابتكار. الأصعب أن يثبت نفسه في التشغيل، ثم تختاره مؤسسة أخرى وتبني عليه جزءاً من قدرتها الإنتاجية. قصة تكشف كيف تتحول المعرفة المتراكمة إلى أصل صناعي قابل للقياس والنقل.</a></p><a class="article-action" href="case-ega-dx-ultra-innovation.html">اقرأ كيف تحولت المعرفة إلى قدرة قابلة للتصدير ←</a></article>'''
        html = html.replace(marker, marker + card, 1)

    # Add EGA to CollectionPage JSON-LD if absent.
    if '"url":"https://tamayuz10x.com/case-ega-dx-ultra-innovation.html"' not in html:
        needle = '"hasPart":['
        item = '{"@type":"Article","headline":"من مصنع في الإمارات إلى تقنية تعمل في البحرين: متى يصبح الابتكار قدرة قابلة للتصدير؟","url":"https://tamayuz10x.com/case-ega-dx-ultra-innovation.html"},'
        html = html.replace(needle, needle + item, 1)

    path.write_text(html, encoding="utf-8")


def main():
    for cfg in CARDS:
        make_card(cfg)
        ensure_social_meta(ROOT / cfg["page"], cfg)
    update_articles_listing()
    print("Generated social cards:")
    for cfg in CARDS:
        print(f" - assets/social/{cfg['slug']}.png")


if __name__ == "__main__":
    main()
