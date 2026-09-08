from pathlib import Path
import re

replacements = [
    (re.compile(r'(<a\b[^>]*href=["\']services\.html["\'][^>]*>)[^<]*(</a>)', re.I), r'\1الخبرة المهنية\2'),
    (re.compile(r'(<a\b[^>]*href=["\']training\.html["\'][^>]*>)[^<]*(</a>)', re.I), r'\1التعلّم والتطوير\2'),
    (re.compile(r'(<a\b[^>]*href=["\']contact\.html["\'][^>]*>)(?:اطلب استشارة|احجز استشارة|اطلب عرضاً|اطلب عرضا|سجّل الآن|سجل الآن|احجز الآن|ابدأ الآن)(</a>)', re.I), r'\1تواصل معي\2'),
]

changed = []
for p in Path('.').glob('*.html'):
    s = p.read_text(encoding='utf-8')
    out = s
    for pattern, repl in replacements:
        out = pattern.sub(repl, out)
    if out != s:
        p.write_text(out, encoding='utf-8')
        changed.append(str(p))

print('Changed:', ', '.join(changed) if changed else 'none')

terms = [
    'اطلب استشارة', 'احجز استشارة', 'اطلب عرضاً', 'اطلب عرضا',
    'سجّل الآن', 'سجل الآن', 'احجز الآن', 'اشترك الآن',
    'الاستشارات المؤسسية', 'خدماتنا الاستشارية'
]
for p in Path('.').glob('*.html'):
    text = p.read_text(encoding='utf-8')
    hits = [t for t in terms if t in text]
    if hits:
        print('FLAG', p, hits)
