#!/usr/bin/env python3
from pathlib import Path
import re
from PIL import Image, ImageDraw, ImageFont, ImageOps

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
MUTED = "#617083"

CARDS = [
    {
        "slug": "dubai-paperless-share",
        "page": "case-dubai-paperless-10x.html",
        "og_title": "دبي بلا ورق: عندما يكون التحول الحقيقي هو إلغاء الحاجة إلى الورق، لا تحويله إلى شاشة",
        "og_desc": "لم تبدأ دبي من سؤال: كيف نُسرّع المعاملة الورقية؟ بل من سؤال أعمق: لماذا نحتاج إليها بهذا الشكل أصلاً؟ قصة تحول تكشف كيف يمكن لإعادة التفكير في العمليات أن تسبق التقنية وتصنع أثراً أكبر.",
        "alt": "بطاقة مقال دبي بلا ورق من التميّز 10X مع صورة الدكتور علاء محمد أحمد",
    },
    {
        "slug": "ega-innovation-share",
        "page": "case-ega-dx-ultra-innovation.html",
        "og_title": "من مصنع في الإمارات إلى تقنية تعمل في البحرين: متى يصبح الابتكار قدرة قابلة للتصدير؟",
        "og_desc": "من السهل أن تصف المؤسسة مشروعاً داخلياً بأنه ابتكار. الأصعب أن يثبت نفسه في التشغيل، ثم تختاره مؤسسة أخرى وتبني عليه جزءاً من قدرتها الإنتاجية. هذه قصة معرفة صناعية خرجت من مصنع في الإمارات لتعمل في البحرين بنتائج تشغيلية موثقة.",
        "alt": "بطاقة مقال الابتكار الصناعي من التميّز 10X مع صورة الدكتور علاء محمد أحمد",
    },
]


def rounded_image(img, size, radius=34, centering=(0.5, 0.34)):
    fitted = ImageOps.fit(img.convert("RGB"), size, method=Image.Resampling.LANCZOS, centering=centering)
    mask = Image.new("L", size, 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    out = Image.new("RGBA", size, (255, 255, 255, 0))
    out.paste(fitted.convert("RGBA"), (0, 0), mask)
    return out


def fit_logo(img, max_w=245, max_h=96):
    im = img.convert("RGBA")
    scale = min(max_w / im.width, max_h / im.height)
    return im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.Resampling.LANCZOS)


def make_card(cfg):
    # Social preview identity card: Arabic article copy stays in Open Graph metadata,
    # while the image itself uses only raster brand assets + Latin URL/10X.
    # This avoids any platform/font-specific Arabic shaping problems inside previews.
    W, H = 1200, 630
    canvas = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle((24, 24, W - 24, H - 24), radius=42, fill=SOFT)

    # Right brand field.
    draw.rounded_rectangle((430, 58, 1138, 572), radius=36, fill=NAVY)
    draw.ellipse((830, 106, 1160, 436), fill=NAVY2)
    draw.ellipse((940, 320, 1210, 590), fill="#102f53")

    # Large 10X brand signal.
    ten_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 190)
    x_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 190)
    draw.text((742, 307), "10", font=ten_font, fill=WHITE, anchor="mm")
    draw.text((960, 307), "X", font=x_font, fill=GOLD, anchor="mm")

    # Logo remains a raster asset, so its Arabic identity is preserved exactly.
    draw.rounded_rectangle((838, 82, 1108, 186), radius=22, fill=WHITE)
    logo = fit_logo(Image.open(LOGO))
    canvas.paste(logo, (838 + (270 - logo.width) // 2, 82 + (104 - logo.height) // 2), logo)

    # Visual separator + site address.
    draw.rounded_rectangle((780, 484, 1080, 493), radius=5, fill=GOLD)
    site_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 25)
    draw.text((1080, 530), "tamayuz10x.com", font=site_font, fill=WHITE, anchor="ra")

    # Portrait panel, with no rendered Arabic name below it.
    draw.rounded_rectangle((62, 58, 398, 572), radius=36, fill=NAVY)
    draw.ellipse((80, 72, 380, 372), fill=NAVY2)
    profile = rounded_image(Image.open(PROFILE), (286, 430), 34)
    canvas.paste(profile, (87, 88), profile)
    draw.rounded_rectangle((105, 536, 355, 546), radius=5, fill=GOLD)

    out_path = OUT / f"{cfg['slug']}.png"
    canvas.save(out_path, format="PNG", optimize=True)


def ensure_social_meta(cfg):
    path = ROOT / cfg["page"]
    html = path.read_text(encoding="utf-8")
    image_url = f"https://tamayuz10x.com/assets/social/{cfg['slug']}.png?v=20260907-social3"
    html = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{cfg["og_title"]}">', html, count=1)
    html = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{cfg["og_desc"]}">', html, count=1)
    html = re.sub(r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="{image_url}">', html, count=1)
    html = re.sub(r'<meta property="og:image:secure_url" content="[^"]*">', f'<meta property="og:image:secure_url" content="{image_url}">', html, count=1)
    html = re.sub(r'<meta name="twitter:title" content="[^"]*">', f'<meta name="twitter:title" content="{cfg["og_title"]}">', html, count=1)
    html = re.sub(r'<meta name="twitter:description" content="[^"]*">', f'<meta name="twitter:description" content="{cfg["og_desc"]}">', html, count=1)
    html = re.sub(r'<meta name="twitter:image" content="[^"]*">', f'<meta name="twitter:image" content="{image_url}">', html, count=1)
    path.write_text(html, encoding="utf-8")



PREVIEW_OUT = ROOT / "assets" / "previews"
PREVIEW_OUT.mkdir(parents=True, exist_ok=True)
MUSA_PREVIEW_LIMIT = 117000


def _find_font(name):
    hits = list(Path("/usr/share/fonts").rglob(name))
    if not hits:
        raise FileNotFoundError(name)
    return str(hits[0])


def _musa_background(rtl=True):
    W, H = 1200, 630
    gradient = Image.linear_gradient("L").resize((W, H))
    canvas = ImageOps.colorize(gradient, "#ece7d8", "#d3ded5").convert("RGB")
    draw = ImageDraw.Draw(canvas)
    if rtl:
        draw.rounded_rectangle((535, 46, 1150, 584), radius=28, fill="#10343a")
        cx = 275
    else:
        draw.rounded_rectangle((50, 46, 665, 584), radius=28, fill="#10343a")
        cx = 925
    gy = 455
    draw.ellipse((cx - 160, gy - 22, cx + 160, gy + 24), fill="#c4b08a")
    draw.rounded_rectangle((cx - 95, gy - 112, cx + 95, gy), radius=16, fill="#847052")
    draw.ellipse((cx - 95, gy - 130, cx + 95, gy - 83), fill="#a28b64")
    draw.ellipse((cx - 70, gy - 120, cx + 70, gy - 91), fill="#22494b")
    draw.line((cx, gy - 145, cx, gy - 105), fill="#5d4b35", width=5)
    draw.arc((cx - 42, gy - 178, cx + 42, gy - 105), 180, 360, fill="#5d4b35", width=5)
    draw.line((cx - 260, 520, cx - 60, 470), fill="#b39a6f", width=6)
    draw.line((cx + 260, 520, cx + 60, 470), fill="#b39a6f", width=6)
    return canvas


def _save_musa_jpeg(canvas, path):
    for quality in range(86, 39, -2):
        canvas.save(path, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=2)
        if path.stat().st_size < MUSA_PREVIEW_LIMIT:
            print(f"{path.name}: {path.stat().st_size} bytes at quality {quality}")
            return
    raise RuntimeError(f"{path.name} exceeds {MUSA_PREVIEW_LIMIT} bytes")


def make_musa_reflection_cards():
    ar_bold = ImageFont.truetype(_find_font("NotoSansArabic-Bold.ttf"), 59)
    ar_regular = ImageFont.truetype(_find_font("NotoSansArabic-Regular.ttf"), 31)
    ar_small = ImageFont.truetype(_find_font("NotoSansArabic-Regular.ttf"), 23)
    ar_author = ImageFont.truetype(_find_font("NotoSansArabic-Regular.ttf"), 22)
    ar_brand = ImageFont.truetype(_find_font("NotoSansArabic-Bold.ttf"), 30)
    latin_bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)

    canvas = _musa_background(True)
    draw = ImageDraw.Draw(canvas)
    x = 1105
    draw.text((x, 92), "التميّز", font=ar_brand, fill="#ebcb89", anchor="ra", direction="rtl", language="ar")
    bbox = draw.textbbox((0, 0), "التميّز", font=ar_brand, direction="rtl", language="ar")
    aw = bbox[2] - bbox[0]
    draw.text((x - aw - 15, 91), "10X", font=latin_bold, fill="#ebcb89", anchor="ra")
    draw.text((x, 145), "تأملات قرآنية", font=ar_small, fill="#dce7e4", anchor="ra", direction="rtl", language="ar")
    draw.text((x, 180), "سورة القصص", font=ar_small, fill="#dce7e4", anchor="ra", direction="rtl", language="ar")
    draw.text((x, 270), "كيف نعرف الناس", font=ar_bold, fill="white", anchor="ra", direction="rtl", language="ar")
    draw.text((x, 343), "حقاً؟", font=ar_bold, fill="white", anchor="ra", direction="rtl", language="ar")
    draw.text((x, 425), "القوي الأمين", font=ar_regular, fill="#ebcb89", anchor="ra", direction="rtl", language="ar")
    draw.text((x, 468), "حين تتكلم الأفعال قبل أن تُمنح المسؤولية", font=ar_regular, fill="#ebcb89", anchor="ra", direction="rtl", language="ar")
    draw.text((x, 540), "الدكتور علاء محمد أحمد", font=ar_author, fill="#dce7e4", anchor="ra", direction="rtl", language="ar")
    _save_musa_jpeg(canvas, PREVIEW_OUT / "reflection-musa-strong-trustworthy-ar.jpg")

    en_bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
    en_regular = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 27)
    en_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 21)
    en_brand = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 29)
    en_author = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)

    canvas = _musa_background(False)
    draw = ImageDraw.Draw(canvas)
    x = 95
    draw.text((x, 92), "Tamayuz 10X", font=en_brand, fill="#ebcb89", anchor="la")
    draw.text((x, 142), "Qur’anic Reflection", font=en_small, fill="#dce7e4", anchor="la")
    draw.text((x, 173), "Surah Al-Qasas", font=en_small, fill="#dce7e4", anchor="la")
    draw.text((x, 242), "How Do We Really", font=en_bold, fill="white", anchor="la")
    draw.text((x, 302), "Know People?", font=en_bold, fill="white", anchor="la")
    draw.text((x, 382), "The strong and trustworthy:", font=en_regular, fill="#ebcb89", anchor="la")
    draw.text((x, 424), "when actions speak before", font=en_regular, fill="#ebcb89", anchor="la")
    draw.text((x, 466), "responsibility", font=en_regular, fill="#ebcb89", anchor="la")
    draw.text((x, 540), "Dr. Alaa Mohammad Ahmed", font=en_author, fill="#dce7e4", anchor="la")
    _save_musa_jpeg(canvas, PREVIEW_OUT / "reflection-musa-strong-trustworthy-en.jpg")

if __name__ == "__main__":
    for cfg in CARDS:
        make_card(cfg)
        ensure_social_meta(cfg)
    make_musa_reflection_cards()
    print("Generated social cards, including Musa reflection previews under the strict byte cap.")
