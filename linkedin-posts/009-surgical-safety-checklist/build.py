# Builds slides-ar.html and slides-en.html for post 009. Edit, then: python3 build.py && node render.js <folder> ar,en
B = '../brand/tamayuz10x-'
def imgs(kind): return ''.join(f'<img class="logo {t}" src="{B}{kind}-{t}.png" alt="Tamayuz 10X">' for t in ['color', 'ondark', 'navy'])
def footer(label, i): return f'<div class="footer"><span class="brand">{imgs("wordmark")}{label}</span><span class="ltr">{i} / 8</span></div>'
def page(lang, title, fonts, extra_css, slides):
    d = 'rtl' if lang == 'ar' else 'ltr'
    body = ''.join(f'\n<section class="slide {c}">\n  {b}\n  {footer(l, i + 1)}\n</section>\n' for i, (c, b, l) in enumerate(slides))
    return f'''<!doctype html>
<html lang="{lang}" dir="{d}">
<head>
<meta charset="utf-8">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?{fonts}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="slides.css">
<style>{extra_css}
.ltr{{direction:ltr;unicode-bidi:isolate}}
.ref.ltr{{text-align:left}}
</style>
</head>
<body>{body}
</body>
</html>
'''


SLUG = 'article-oe-evidence-surgical-safety-checklist'
C1 = '<span class="ltr">Haynes et al., N Engl J Med, 2009</span>'
C2 = '<span class="ltr">Urbach et al., N Engl J Med, 2014</span>'
C3 = '<span class="ltr">Armstrong 2022 · Habtie 2025</span>'
C4 = '<span class="ltr">Habtie et al., BMC Health Serv Res, 2025</span>'
NAME = '<span>د. علاء محمد أحمد</span>'
EN_NAME = '<span>Dr. Alaa Mohamed Ahmed</span>'
R = 'class="ref ltr" style="font-size:16px;margin-top:3px;line-height:1.35"'
REFS = f"""<p {R}><b>[1]</b> Haynes, A. B., et al. (2009). A surgical safety checklist to reduce morbidity and mortality in a global population. <i>N Engl J Med</i>, 360(5), 491–499.</p>
  <p {R}><b>[2]</b> Urbach, D. R., et al. (2014). Introduction of surgical safety checklists in Ontario, Canada. <i>N Engl J Med</i>, 370(11), 1029–1038.</p>
  <p {R}><b>[3]</b> Sotto, K. T., et al. (2021). Impact of the WHO surgical safety checklist relative to its design and intended use. <i>J Am Coll Surg</i>, 233(6), 794–809.</p>
  <p {R}><b>[4]</b> Armstrong, B. A., et al. (2022). Effect of the surgical safety checklist on provider and patient outcomes. <i>BMJ Qual Saf</i>, 31(6), 463–478.</p>
  <p {R}><b>[5]</b> Habtie, T. E., et al. (2025). Beyond compliance: completeness and determinants of the WHO surgical safety checklist. <i>BMC Health Serv Res</i>, 25, 504.</p>"""
SL = 'style="font-size:84px;min-width:260px"'
L = lambda x: f'<span class="ltr">{x}</span>'
LI = 'style="font-size:28px;padding:12px 0"'
ar=[]
ar.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">التميّز التشغيلي · من الدراسات العلمية</div>
  <h1 style="font-size:62px">وضعت منظمة الصحة العالمية قائمة تحقق يراجعها فريق العمليات الجراحية.</h1>
  <h1 class="dim" style="margin-top:12px;font-size:46px;line-height:1.5">وفي ثمانية مستشفيات انخفضت الوفيات بعد استخدامها، لكن في {L('101')}&nbsp;مستشفى بأونتاريو لم يظهر فرق واضح.</h1>
  <p class="lead">فما الذي قد يفسّر الفرق؟ هذا ما تعرضه خمس دراسات نُشرت بين عامي {L('2009')} و{L('2025')}.</p>
  <div class="swipe">← اسحب للمتابعة</div>""",NAME))
ar.append(('',f"""<div class="kicker">الفكرة</div>
  <h2>ما قائمة التحقق من السلامة الجراحية؟</h2>
  <p class="lead">هي قائمة من {L('19')}&nbsp;بندًا، يراجعها الفريق في ثلاث مراحل: قبل تخدير المريض، وقبل أول شقّ جراحي، وقبل أن يغادر المريض غرفة العمليات.</p>
  <div class="box">
    <p>ودراسة «قبل وبعد» تقارن النتائج في المكان نفسه قبل التغيير وبعده، دون مجموعة لم يحدث فيها التغيير.</p>
  </div>""",C1))
ar.append(('',f"""<div class="kicker">الدراسة الأولى</div>
  <h2>في ثمانية مستشفيات، منها مستشفى في عمّان</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>0.8%</span><p>هي نسبة الوفيات بعد بدء استخدام القائمة، وكانت {L('1.5%')} قبلها.</p></div>
    <div class="stat"><span class="n" {SL}>7%</span><p>هي نسبة المضاعفات في أثناء الإقامة بالمستشفى بعد القائمة، وكانت {L('11%')} قبلها.</p></div>
  </div>
  <p class="small" style="margin-top:16px">وكان المرضى في سن 16 عامًا فأكثر، وخضعوا لجراحات غير جراحات القلب. وكان الانخفاضان أكبر من أن يُفسَّرا بالصدفة وحدها، لكنها دراسة قبل وبعد.</p>""",C1))
ar.append(('',f"""<div class="kicker">دراسة أونتاريو</div>
  <h2>في {L('101')}&nbsp;مستشفى بأونتاريو، لم يظهر فرق واضح</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>0.65%</span><p>هي نسبة الوفيات المعدّلة بعد اعتماد القائمة، وكانت {L('0.71%')} قبله.</p></div>
    <div class="stat"><span class="n" {SL}>3.82%</span><p>هي نسبة المضاعفات المعدّلة بعد اعتمادها، وكانت {L('3.86%')} قبله.</p></div>
  </div>
  <p class="small" style="margin-top:16px">والنسب المعدّلة محسوبة بعد مراعاة اختلاف المرضى بين الفترتين. ولم يبلغ أيٌّ من الفرقين حدّ الدلالة الإحصائية، فقد يكون صدفة. ولا تُقارَن هذه النسب بنسب الشريحة السابقة، لاختلاف المرضى وتعريف المضاعفات.</p>""",C2))
ar.append(('',f"""<div class="kicker">كيف تُستخدم القائمة؟</div>
  <h2>لا تُستخدم القائمة دائمًا في كل مراحلها</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>38%</span><p>هي نسبة الدراسات، من {L('300')}&nbsp;دراسة، التي وصفت كيف استُخدمت القائمة، ولو وصفًا جزئيًّا.</p></div>
    <div class="stat"><span class="n" {SL}>61%</span><p>هو متوسط الالتزام بمرحلة ما قبل أول شقّ جراحي، في مراجعة لـ{L('13')}&nbsp;دراسة. وكان {L('76%')} في مرحلة ما قبل التخدير.</p></div>
  </div>
  <p class="small" style="margin-top:16px">والالتزام يقيس هل استُخدمت القائمة، ويختلف تعريفه من دراسة إلى أخرى.</p>""",C3))
ar.append(('amber',f"""<div class="kicker">ما الذي ساعد على الالتزام؟</div>
  <h2 style="margin-top:20px">ساعد على الالتزام التدريب ودعم الإدارة والمتابعة</h2>
  <ul class="clean">
    <li {LI}>ساعدت عليه الخبرة السابقة بالقائمة والتدريب.</li>
    <li {LI}>وساعد عليه دعم الإدارة وبيئة العمل الإيجابية.</li>
    <li {LI}>وساعدت عليه المتابعة المنتظمة مع عرض النتائج على الفرق.</li>
  </ul>
  <p class="small" style="margin-top:20px">ومما أعاقه: نقص العاملين، وكثرة العمل، وغياب من يتولى القائمة.</p>""",C4))
ar.append(('dark',f"""<div class="kicker">ما يستنتجه الكاتب من الدراسات</div>
  <h2>ما الذي يستطيع القائد فعله؟</h2>
  <ul class="clean">
    <li><span class="num">1</span>يقيس طريقة استخدام القائمة، ولا يكتفي بالتحقق من توقيعها.</li>
    <li><span class="num">2</span>ويهتم بالمراحل التي يقلّ فيها الالتزام، ويعيّن في كل غرفة عمليات من يتولى القائمة.</li>
    <li><span class="num">3</span>ولا يكتفي بقرار يدعو إلى استخدامها، بل يدرّب الفرق ويتابعها.</li>
  </ul>
  <p class="small" style="margin-top:10px">هذه ثلاث من ست خطوات في المقال، استنتجها الكاتب من الدراسات، ولم تختبر أي دراسة أثرها مجتمعةً.</p>
  <div class="q" style="font-size:32px;margin-top:20px;padding:22px 32px">بعد ثلاث سنوات، أتريد أن تبقى قوائم التحقق في مؤسستك أوراقًا تُوقَّع ثم تُحفظ، أم وقفة يقرأ فيها الفريق كل بند ويتحدث كل فرد عما يقلقه؟</div>""",NAME))
ar.append(('',f"""<div class="kicker">المصادر وحدود الدليل</div>
  <h2 style="font-size:46px">حدود هذه الأدلة</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">دراستا المستشفيات الثمانية وأونتاريو من نوع قبل وبعد، ولم تُقسَّم فيهما المستشفيات بالقرعة إلى مجموعة تستخدم القائمة وأخرى لا تستخدمها.</li>
    <li style="font-size:22px;padding:6px 0">وكان أحد المستشفيات الثمانية في عمّان، لكن ملخص الدراسة لا يذكر نتائج كل مستشفى على حدة.</li>
    <li style="font-size:22px;padding:6px 0">ولم تختبر أيٌّ من الدراسات الخمس القائمة خارج الجراحة، فنفعها في قطاعات أخرى استنتاج من الكاتب لم تختبره هذه الدراسات.</li>
  </ul>
  <p class="small" style="margin-top:6px;font-size:18px;line-height:1.5"><b>تنويه تحريري:</b> الآراء والتحليلات الواردة في هذا المقال تمثل رأي الكاتب وتحليله المهني استنادًا إلى المصادر المشار إليها، ولا تمثل بالضرورة المواقف الرسمية للجهات المذكورة. وللاطلاع على المعلومات والمراجع الأصلية والكاملة والأحدث، يُرجى الرجوع مباشرة إلى المصادر الأصلية والوثائق الرسمية الواردة في قائمة المراجع.</p>
  {REFS}
  <p class="small" style="margin-top:6px;font-size:21px"><b>المقال الكامل:</b> <span class="ltr">tamayuz10x.com/{SLUG}.html</span></p>
  <div class="end-logo" style="margin-bottom:2px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>د. علاء محمد أحمد · التميّز التشغيلي</span>'))
en=[]
en.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">Operational Excellence · What the research says</div>
  <h1 style="font-size:64px">The World Health Organization designed a checklist for surgical teams.</h1>
  <h1 class="dim" style="margin-top:16px;font-size:46px">In eight hospitals, deaths fell after it was introduced. In 101 Ontario hospitals, there was no clear difference.</h1>
  <p class="lead">What might explain the gap? Here is what five studies, published from 2009 to 2025, show.</p>
  <div class="swipe">Swipe →</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">The idea</div>
  <h2>What is the Surgical Safety Checklist?</h2>
  <p class="lead">A 19-item list the team reviews at three points: before anesthesia, before the first incision, and before the patient leaves the operating room.</p>
  <div class="box"><p>A before-and-after study compares results in the same place before and after a change, with no group where the change did not happen.</p></div>""",C1))
en.append(('',f"""<div class="kicker">The first study</div>
  <h2>Eight hospitals, including one in Amman</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>0.8%</span><p>death rate after the checklist was introduced, down from 1.5% before.</p></div>
    <div class="stat"><span class="n" {SL}>7%</span><p>rate of complications during the hospital stay after the checklist, down from 11%.</p></div>
  </div>
  <p class="small" style="margin-top:16px">Patients were 16 or older and had surgery other than heart surgery. Both drops were too large to be explained by chance alone, but this was a before-and-after study.</p>""",C1))
en.append(('',f"""<div class="kicker">The Ontario study</div>
  <h2>In 101 Ontario hospitals, no clear difference</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>0.65%</span><p>adjusted death rate after adoption, compared with 0.71% before.</p></div>
    <div class="stat"><span class="n" {SL}>3.82%</span><p>adjusted complication rate after adoption, compared with 3.86% before.</p></div>
  </div>
  <p class="small" style="margin-top:16px">Adjusted rates take account of differences between patients in the two periods. Neither difference was statistically significant, so either could be due to chance. These figures should not be compared with the previous slide, because the patients and the definition of complications differed.</p>""",C2))
en.append(('',f"""<div class="kicker">How is the checklist used?</div>
  <h2>The checklist is not always used at every step</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>38%</span><p>of 300 studies gave even some description of how the checklist was actually used.</p></div>
    <div class="stat"><span class="n" {SL}>61%</span><p>average compliance for the step before the first incision, in a review of 13 studies. It was 76% for the step before anesthesia.</p></div>
  </div>
  <p class="small" style="margin-top:16px">Compliance asks whether the checklist was used; definitions varied between studies.</p>""",C3))
en.append(('amber',f"""<div class="kicker">What helped compliance?</div>
  <h2 style="margin-top:20px">Training, management support, and follow-up helped</h2>
  <ul class="clean">
    <li {LI}>Earlier experience with the checklist and training helped.</li>
    <li {LI}>Management support and a positive work environment helped.</li>
    <li {LI}>Regular monitoring with feedback to teams helped.</li>
  </ul>
  <p class="small" style="margin-top:20px">Barriers included too few staff, heavy workloads, and no one owning the checklist.</p>""",C4))
en.append(('dark',f"""<div class="kicker">The author's reading of the studies</div>
  <h2>What can leaders do?</h2>
  <ul class="clean">
    <li style="font-size:33px"><span class="num">1</span>Measure how the checklist is used, not just whether it was signed.</li>
    <li style="font-size:33px"><span class="num">2</span>Focus on the steps with lower compliance, and name someone in each operating room who owns the checklist.</li>
    <li style="font-size:33px"><span class="num">3</span>Do not rely on a policy alone; train teams and follow up.</li>
  </ul>
  <p class="small" style="margin-top:10px">These are three of the six steps in the article. The author inferred them from the studies, and no study tested their combined effect.</p>
  <div class="q" style="font-size:32px;margin-top:20px;padding:22px 32px">Three years from now, will checklists in your organization be forms that are signed and filed, or a real pause where the team reads each item and anyone can raise a concern?</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">Sources and limits</div>
  <h2 style="font-size:48px">What this evidence can and cannot tell us</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">The eight-hospital and Ontario studies were before-and-after studies; no hospitals were assigned to go without the checklist for comparison.</li>
    <li style="font-size:22px;padding:6px 0">One of the eight hospitals was in Amman, but the study abstract does not report results for each hospital separately.</li>
    <li style="font-size:22px;padding:6px 0">None of the five studies tested the checklist outside surgery. Applying it to other sectors is the author's untested inference.</li>
  </ul>
  <p class="small" style="margin-top:6px;font-size:18px;line-height:1.5"><b>Editorial disclaimer:</b> The views and analyses presented in this article represent the author’s professional interpretation based on the cited sources and do not necessarily represent the official positions of the organizations mentioned. For the original, complete and most current information, please consult the primary sources and official documents listed in the references.</p>
  {REFS}
  <p class="small" style="margin-top:6px;font-size:21px"><b>Full article:</b> tamayuz10x.com/en/{SLUG}.html</p>
  <div class="end-logo" style="margin-bottom:2px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>Dr. Alaa Mohamed Ahmed · Operational Excellence</span>'))
AR_CSS = ''':root{--serif:'Amiri',serif;--sans:'IBM Plex Sans Arabic',sans-serif}
.kicker{letter-spacing:0;text-transform:none;font-size:28px}
h1{font-size:88px;line-height:1.35}
h2{font-size:68px;line-height:1.4}
p,li{line-height:1.7}
.stat .n{direction:ltr;text-align:right}'''
EN_CSS = ''':root{--serif:'Source Serif 4',Georgia,serif;--sans:'Inter',Arial,sans-serif}'''
open('slides-ar.html','w').write(page('ar','ماذا حدث حين بدأت مستشفيات تستخدم قائمة تحقق في العمليات الجراحية؟','family=Amiri:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600',AR_CSS,ar))
open('slides-en.html','w').write(page('en','What Happened When Hospitals Started Using a Surgical Safety Checklist?','family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;600',EN_CSS,en))
