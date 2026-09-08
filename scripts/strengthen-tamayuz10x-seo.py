from pathlib import Path
import re
from html import unescape

TODAY = "2026-09-08"
SITE_AR = "التميّز 10X"
SITE_EN = "Tamayuz 10X"
SITE_NAME = f"{SITE_AR} | {SITE_EN}"
OFFICIAL_LOGO = "assets/images/file_0000000047188210ac6952e999d2eda7.png"

PRIMARY_PAGES = [
    "index.html",
    "vision-mission-values.html",
    "about.html",
    "books.html",
    "research.html",
    "articles.html",
    "case-dewa-hydro-insight-smart-water.html",
    "case-dubai-paperless-10x.html",
    "case-ega-dx-ultra-innovation.html",
    "article-ahsanu-amala.html",
    "idea-busy-or-progress.html",
    "idea-measure-before-improve.html",
    "idea-dont-solve-everything-yourself.html",
    "healthcare-excellence.html",
    "leadership-excellence.html",
    "life-society.html",
    "personality.html",
    "training.html",
    "services.html",
    "videos.html",
    "news.html",
    "contact.html",
]

# These hub pages carry the English transliteration in the document title as well.
BILINGUAL_TITLE_PAGES = {
    "index.html",
    "vision-mission-values.html",
    "about.html",
    "research.html",
    "articles.html",
    "training.html",
    "services.html",
}

IDENTITY_SCHEMA = '''\n<!-- tamayuz10x-site-identity-v1 -->\n<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","@id":"https://tamayuz10x.com/#website","url":"https://tamayuz10x.com/","name":"التميّز 10X","alternateName":["Tamayuz 10X","Tamayuz10X"],"inLanguage":"ar"}</script>\n'''


def add_brand_to_text(value: str, bilingual: bool = False) -> str:
    """Preserve the page topic, normalize legacy branding, then add the site identity once."""
    value = value.replace("مَدار التميّز", SITE_AR).strip()
    # Avoid repeating an already-present site identity.
    if SITE_AR not in value:
        value = f"{value} | {SITE_AR}"
    if bilingual and SITE_EN not in value:
        value = f"{value} | {SITE_EN}"
    # Collapse accidental exact duplicates from earlier edits.
    value = value.replace(f"{SITE_AR} | {SITE_AR}", SITE_AR)
    value = value.replace(f"{SITE_EN} | {SITE_EN}", SITE_EN)
    return value


def replace_title(s: str, filename: str) -> str:
    m = re.search(r"<title>(.*?)</title>", s, flags=re.I | re.S)
    if not m:
        raise RuntimeError(f"{filename}: missing <title>")
    old = m.group(1).strip()
    new = add_brand_to_text(old, filename in BILINGUAL_TITLE_PAGES)
    return s[:m.start(1)] + new + s[m.end(1):]


def normalize_meta_title(s: str, attr_name: str, filename: str) -> str:
    # Handles both property= and name= metadata.
    pattern = rf'(<meta\s+(?:property|name)="{re.escape(attr_name)}"\s+content=")([^"]*)(")'
    m = re.search(pattern, s, flags=re.I)
    if not m:
        return s
    bilingual = filename in BILINGUAL_TITLE_PAGES
    new_value = add_brand_to_text(unescape(m.group(2)), bilingual)
    return s[:m.start(2)] + new_value + s[m.end(2):]


def normalize_site_name(s: str) -> str:
    pattern = r'(<meta\s+property="og:site_name"\s+content=")([^"]*)(")'
    if re.search(pattern, s, flags=re.I):
        return re.sub(pattern, lambda m: m.group(1) + SITE_NAME + m.group(3), s, count=1, flags=re.I)
    # Add it if a page omitted it.
    return s.replace("</head>", f'<meta property="og:site_name" content="{SITE_NAME}">\n</head>', 1)


def ensure_canonical(s: str, filename: str) -> str:
    canonical = "https://tamayuz10x.com/" if filename == "index.html" else f"https://tamayuz10x.com/{filename}"
    pattern = r'<link\s+rel="canonical"\s+href="[^"]*"\s*/?>'
    tag = f'<link rel="canonical" href="{canonical}">'
    if re.search(pattern, s, flags=re.I):
        return re.sub(pattern, tag, s, count=1, flags=re.I)
    return s.replace("</head>", tag + "\n</head>", 1)


def normalize_logo_and_navigation(s: str) -> str:
    # Remove legacy identity references from the primary site surfaces.
    s = s.replace("مَدار التميّز", SITE_AR)
    s = re.sub(r'assets/images/(?:madar-original-logo\.webp|madar-logo\.png)', OFFICIAL_LOGO, s, flags=re.I)
    s = s.replace('alt="شعار التميّز 10X"', 'alt="شعار التميّز 10X — Tamayuz 10X"')
    s = s.replace('alt="شعار التميّز 10X — Tamayuz 10X — Tamayuz 10X"', 'alt="شعار التميّز 10X — Tamayuz 10X"')
    s = s.replace('>التعلّم والتطوير</a>', '>بناء القدرات</a>')
    return s


def strengthen_footer_link(s: str) -> str:
    m = re.search(r'(<footer\b.*?</footer>)', s, flags=re.I | re.S)
    if not m:
        return s
    footer = m.group(1)
    footer = footer.replace('>التعلّم والتطوير</a>', '>بناء القدرات</a>')
    if 'aria-label="التميّز 10X | Tamayuz 10X"' not in footer:
        footer = footer.replace(
            '<strong>التميّز 10X</strong>',
            '<strong><a href="index.html" aria-label="التميّز 10X | Tamayuz 10X" style="color:inherit;text-decoration:none">التميّز 10X | <span dir="ltr">Tamayuz 10X</span></a></strong>',
            1,
        )
    return s[:m.start(1)] + footer + s[m.end(1):]


def ensure_identity_schema(s: str, filename: str) -> str:
    # The homepage already has the richer WebSite graph with alternateName.
    if filename == "index.html":
        return s
    if "tamayuz10x-site-identity-v1" in s:
        return s
    return s.replace("</head>", IDENTITY_SCHEMA + "</head>", 1)


def process_page(filename: str) -> None:
    p = Path(filename)
    if not p.exists():
        raise FileNotFoundError(f"Expected primary page not found: {filename}")
    s = p.read_text(encoding="utf-8")
    s = normalize_logo_and_navigation(s)
    s = replace_title(s, filename)
    s = normalize_site_name(s)
    s = normalize_meta_title(s, "og:title", filename)
    s = normalize_meta_title(s, "twitter:title", filename)
    s = ensure_canonical(s, filename)
    s = ensure_identity_schema(s, filename)
    s = strengthen_footer_link(s)
    p.write_text(s, encoding="utf-8")


for page in PRIMARY_PAGES:
    process_page(page)

# Regenerate the primary sitemap so every indexable navigation hub is discoverable.
urls = []
for page in PRIMARY_PAGES:
    url = "https://tamayuz10x.com/" if page == "index.html" else f"https://tamayuz10x.com/{page}"
    urls.append(f"  <url><loc>{url}</loc><lastmod>{TODAY}</lastmod></url>")
Path("sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "\n".join(urls)
    + "\n</urlset>\n",
    encoding="utf-8",
)

# QA: fail the run instead of publishing inconsistent identity signals.
errors = []
for page in PRIMARY_PAGES:
    s = Path(page).read_text(encoding="utf-8")
    title = re.search(r"<title>(.*?)</title>", s, flags=re.I | re.S)
    title_text = title.group(1) if title else ""
    if SITE_AR not in title_text:
        errors.append(f"{page}: Arabic site identity missing from title")
    if page in BILINGUAL_TITLE_PAGES and SITE_EN not in title_text:
        errors.append(f"{page}: English site identity missing from hub title")
    if f'property="og:site_name" content="{SITE_NAME}"' not in s:
        errors.append(f"{page}: og:site_name not normalized")
    if "مَدار التميّز" in s:
        errors.append(f"{page}: legacy brand remains")
    if "madar-original-logo.webp" in s or "madar-logo.png" in s:
        errors.append(f"{page}: legacy logo remains")
    if '>التعلّم والتطوير</a>' in s:
        errors.append(f"{page}: old training navigation label remains")
    expected_canonical = "https://tamayuz10x.com/" if page == "index.html" else f"https://tamayuz10x.com/{page}"
    if f'rel="canonical" href="{expected_canonical}"' not in s:
        errors.append(f"{page}: canonical mismatch")
    if page != "index.html" and "tamayuz10x-site-identity-v1" not in s:
        errors.append(f"{page}: identity schema missing")

sitemap = Path("sitemap.xml").read_text(encoding="utf-8")
for page in PRIMARY_PAGES:
    url = "https://tamayuz10x.com/" if page == "index.html" else f"https://tamayuz10x.com/{page}"
    if f"<loc>{url}</loc>" not in sitemap:
        errors.append(f"sitemap: missing {url}")

if errors:
    raise SystemExit("SEO identity QA failed:\n- " + "\n- ".join(errors))

print(f"Site-wide Tamayuz 10X identity strengthened across {len(PRIMARY_PAGES)} primary pages.")
print(f"Sitemap now contains {len(PRIMARY_PAGES)} primary URLs.")
