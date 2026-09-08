from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

repls = {
'<title>الدكتور علاء محمد أحمد | التميّز 10X | التميّز المؤسسي وهندسة التحول</title>':'<title>التميّز 10X | Tamayuz 10X | الدكتور علاء محمد أحمد</title>',
'<meta name="description" content="التميّز 10X مع الدكتور علاء محمد أحمد: أبحاث ورؤى واستشارات في التميّز المؤسسي، هندسة التحول، القيادة، الجودة، الابتكار، التحول الرقمي والذكاء الاصطناعي.">':'<meta name="description" content="التميّز 10X — Tamayuz 10X مع الدكتور علاء محمد أحمد: معرفة وأبحاث ورؤى في التميّز المؤسسي، هندسة التحول، القيادة، الجودة، الابتكار، التحول الرقمي والذكاء الاصطناعي.">',
'<meta property="og:site_name" content="التميّز 10X">':'<meta property="og:site_name" content="التميّز 10X | Tamayuz 10X">',
'<meta property="og:title" content="الدكتور علاء محمد أحمد | التميّز 10X">':'<meta property="og:title" content="التميّز 10X | Tamayuz 10X | الدكتور علاء محمد أحمد">',
'<meta name="twitter:title" content="الدكتور علاء محمد أحمد | التميّز 10X">':'<meta name="twitter:title" content="التميّز 10X | Tamayuz 10X | الدكتور علاء محمد أحمد">',
'<a href="training.html">التعلّم والتطوير</a>':'<a href="training.html">بناء القدرات</a>',
'alt="شعار التميّز 10X"':'alt="شعار التميّز 10X — Tamayuz 10X"'
}
for old,new in repls.items():
    if old not in s:
        print('WARN missing:', old[:80])
    s = s.replace(old,new)

old_schema='''<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Person","@id":"https://tamayuz10x.com/#person","name":"الدكتور علاء محمد أحمد","url":"https://tamayuz10x.com/","image":"https://tamayuz10x.com/assets/images/alaa-mohammad-ahmad-profile-hq.webp","jobTitle":"خبير ومستشار في التميّز المؤسسي وهندسة التحول","knowsAbout":["التميّز المؤسسي","هندسة التحول","التحول المؤسسي","التحول الرقمي","الذكاء الاصطناعي","Agentic AI","نظم إدارة الجودة","إدارة الأداء","القيادة","الابتكار المؤسسي","التميّز الصحي"]},{"@type":"WebSite","@id":"https://tamayuz10x.com/#website","url":"https://tamayuz10x.com/","name":"التميّز 10X","inLanguage":"ar","publisher":{"@id":"https://tamayuz10x.com/#person"}}]}</script>'''
new_schema='''<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Person","@id":"https://tamayuz10x.com/#person","name":"الدكتور علاء محمد أحمد","url":"https://tamayuz10x.com/","image":"https://tamayuz10x.com/assets/images/alaa-mohammad-ahmad-profile-hq.webp","jobTitle":"خبير في التميّز المؤسسي وهندسة التحول","knowsAbout":["التميّز المؤسسي","هندسة التحول","التحول المؤسسي","التحول الرقمي","الذكاء الاصطناعي","Agentic AI","نظم إدارة الجودة","إدارة الأداء","القيادة","الابتكار المؤسسي","التميّز الصحي"]},{"@type":"WebSite","@id":"https://tamayuz10x.com/#website","url":"https://tamayuz10x.com/","name":"التميّز 10X","alternateName":["Tamayuz 10X","Tamayuz10X"],"inLanguage":"ar","publisher":{"@id":"https://tamayuz10x.com/#person"}},{"@type":"WebPage","@id":"https://tamayuz10x.com/#webpage","url":"https://tamayuz10x.com/","name":"التميّز 10X | Tamayuz 10X","isPartOf":{"@id":"https://tamayuz10x.com/#website"},"about":{"@id":"https://tamayuz10x.com/#person"},"inLanguage":"ar"}]}</script>'''
if old_schema not in s:
    raise SystemExit('Schema block not found; aborting')
s=s.replace(old_schema,new_schema)

# Make the brand name explicit near the top without changing the main headline.
needle='<span class="eyebrow">التميّز المؤسسي · التحول · الجودة · الابتكار</span><h1>'
replacement='<span class="eyebrow">التميّز 10X — Tamayuz 10X</span><h1>'
if needle in s:
    s=s.replace(needle,replacement,1)

p.write_text(s,encoding='utf-8')

sp=Path('sitemap.xml')
sm=sp.read_text(encoding='utf-8')
sm=sm.replace('<loc>https://tamayuz10x.com/</loc><lastmod>2026-09-07</lastmod>','<loc>https://tamayuz10x.com/</loc><lastmod>2026-09-08</lastmod>')
sm=sm.replace('<loc>https://tamayuz10x.com/training.html</loc><lastmod>2026-09-07</lastmod>','<loc>https://tamayuz10x.com/training.html</loc><lastmod>2026-09-08</lastmod>')
sp.write_text(sm,encoding='utf-8')

print('Updated index.html and sitemap.xml')
