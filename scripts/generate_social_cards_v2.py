#!/usr/bin/env python3
from pathlib import Path
import re
from PIL import Image, ImageDraw, ImageFont, ImageOps, features

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "social"
OUT.mkdir(parents=True, exist_ok=True)
PROFILE = ROOT / "assets" / "images" / "alaa-mohammad-ahmad-profile-hq.webp"
LOGO = ROOT / "assets" / "images" / "file_0000000047188210ac6952e999d2eda7.png"

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
        "og_title": "دبي بلا ورق: عندما يكون التحول الحقيقي هو إلغاء الحاجة إلى الورق، لا تحويله إلى شاشة",
        "og_desc": "لم تبدأ دبي من سؤال: كيف نُسرّع المعاملة الورقية؟ بل من سؤال أعمق: لماذا نحتاج إليها بهذا الشكل أصلاً؟ قصة تحول تكشف كيف يمكن لإعادة التفكير في العمليات أن تسبق التقنية وتصنع أثراً أكبر.",
        "alt": "بطاقة مقال دبي بلا ورق من التميّز 10X مع صورة الدكتور علاء محمد أحمد",
    },
    {
        "slug": "ega-innovation-share",
        "page": "case-ega-dx-ultra-innovation.html",
        "category": "حالة تطبيقية · الابتكار الصناعي",
        "title": "من مصنع في الإمارات إلى تقنية تعمل في البحرين",
        "subtitle": "متى يصبح الابتكار قدرة قابلة للتصدير؟",
        "og_title": "من مصنع في الإمارات إلى تقنية تعمل في البحرين: متى يصبح الابتكار قدرة قابلة للتصدير؟",
        "og_desc": "من السهل أن تصف المؤسسة مشروعاً داخلياً بأنه ابتكار. الأصعب أن يثبت نفسه في التشغيل، ثم تختاره مؤسسة أخرى وتبني عليه جزءاً من قدرتها الإنتاجية. هذه قصة معرفة صناعية خرجت من مصنع في الإمارات لتعمل في البحرين بنتائج تشغيلية موثقة.",
        "alt": "بطاقة مقال الابتكار الصناعي من التميّز 10X مع صورة الدكتور علاء محمد أحمد",
    },
]


def find_font(bold=False):
    candidates = []
    if bold:
        candidates += [
            "/usr/share/fonts/truetype/noto/NotoSansArabic-Bold.ttf",
            "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Bold.ttf",
        ]
    else:
        candidates += [
            "/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf",
            "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Regular.ttf",
        ]
    candidates += [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    ]
    for p in candidates:
        if Path(p).exists():
            return p
    raise FileNotFoundError("No Arabic font found")


FONT_REG = find_font(False)
FONT_BOLD = find_font(True)


def bbox(draw, text, font):
    return draw.textbbox((0, 0), text, font=font, direction="rtl", language="ar")


def text_width(draw, text, font):
    b = bbox(draw, text, font)
    return b[2] - b[0]


def wrap_ar(draw, text, font, max_width):
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


def draw_ar_lines(draw, lines, right_x, y, font, fill, spacing=12):
    for line in lines:
        b = bbox(draw, line, font)
        h = b[3] - b[1]
        draw.text((right_x, y), line, font=font, fill=fill, direction="rtl", language="ar", anchor="ra")
        y += h + spacing
    return y


def rounded_image(img, size, radius=30, centering=(0.5, 0.34)):
    fitted = ImageOps.fit(img.convert("RGB"), size, method=Image.Resampling.LANCZOS, centering=centering)
    mask = Image.new("L", size, 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    out = Image.new("RGBA", size, (255, 255, 255, 0))
    out.paste(fitted.convert("RGBA"), (0, 0), mask)
    return out


def fit_logo(img, max_w=195, max_h=72):
    im = img.convert("RGBA")
    scale = min(max_w / im.width, max_h / im.height)
    return im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.Resampling.LANCZOS)


def make_card(cfg):
    if not features.check("raqm"):
        raise RuntimeError("Pillow RAQM support is required for correct Arabic shaping")

    W, H = 1200, 630
    canvas = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((28, 28, W - 28, H - 28), radius=38, fill=SOFT)

    # Left portrait panel.
    draw.rounded_rectangle((60, 60, 400, 570), radius=34, fill=NAVY)
    draw.ellipse((74, 75, 386, 387), fill=NAVY2)
    profile = rounded_image(Image.open(PROFILE), (280, 388), 30)
    canvas.paste(profile, (90, 98), profile)

    author_font = ImageFont.truetype(FONT_BOLD, 23)
    draw.text((230, 520), "الدكتور علاء محمد أحمد", font=author_font, fill=WHITE,
              direction="rtl", language="ar", anchor="ma")

    # Logo on upper right.
    draw.rounded_rectangle((886, 68, 1110, 151), radius=20, fill=WHITE)
    logo = fit_logo(Image.open(LOGO))
    canvas.paste(logo, (886 + (224-logo.width)//2, 68 + (83-logo.height)//2), logo)

    # Content area — native Arabic shaping, no manual reversing/reshaping.
    right_x = 1085
    text_w = 635
    cat_font = ImageFont.truetype(FONT_BOLD, 21)
    cat = cfg["category"]
    cw = text_width(draw, cat, cat_font)
    chip_left = right_x - cw - 38
    draw.rounded_rectangle((chip_left, 178, right_x, 226), radius=22, fill=NAVY)
    draw.text((right_x - 18, 202), cat, font=cat_font, fill=WHITE,
              direction="rtl", language="ar", anchor="rm")

    title_font = ImageFont.truetype(FONT_BOLD, 46)
    sub_font = ImageFont.truetype(FONT_REG, 31)
    title_lines = wrap_ar(draw, cfg["title"], title_font, text_w)
    y = draw_ar_lines(draw, title_lines, right_x, 270, title_font, NAVY, spacing=14)
    y += 10
    sub_lines = wrap_ar(draw, cfg["subtitle"], sub_font, text_w)
    draw_ar_lines(draw, sub_lines, right_x, y, sub_font, INK, spacing=10)

    draw.rounded_rectangle((955, 520, 1085, 528), radius=4, fill=GOLD)
    site_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    draw.text((1085, 555), "tamayuz10x.com", font=site_font, fill=MUTED, anchor="ra")

    out_path = OUT / f"{cfg['slug']}.png"
    canvas.save(out_path, format="PNG", optimize=True)


def ensure_social_meta(cfg):
    path = ROOT / cfg["page"]
    html = path.read_text(encoding="utf-8")
    image_url = f"https://tamayuz10x.com/assets/social/{cfg['slug']}.png?v=20260907-social2"
    html = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{cfg["og_title"]}">', html, count=1)
    html = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{cfg["og_desc"]}">', html, count=1)
    html = re.sub(r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="{image_url}">', html, count=1)
    html = re.sub(r'<meta property="og:image:secure_url" content="[^"]*">', f'<meta property="og:image:secure_url" content="{image_url}">', html, count=1)
    html = re.sub(r'<meta name="twitter:title" content="[^"]*">', f'<meta name="twitter:title" content="{cfg["og_title"]}">', html, count=1)
    html = re.sub(r'<meta name="twitter:description" content="[^"]*">', f'<meta name="twitter:description" content="{cfg["og_desc"]}">', html, count=1)
    html = re.sub(r'<meta name="twitter:image" content="[^"]*">', f'<meta name="twitter:image" content="{image_url}">', html, count=1)
    path.write_text(html, encoding="utf-8")


if __name__ == "__main__":
    for cfg in CARDS:
        make_card(cfg)
        ensure_social_meta(cfg)
    print("Generated social cards with native Arabic shaping.")
