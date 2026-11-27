# Builds slides-ar.html and slides-en.html for post 003. Edit the text here, then run: python3 build.py
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

ENG = '<span class="ltr">Jones et al., Emerg Med J, 2022</span>'
KOR = '<span class="ltr">Kim et al., BMC Emerg Med, 2026</span>'
REFS = """<p class="ref ltr" style="font-size:20px;margin-top:10px"><b>[1]</b> Jones, S., Moulton, C., Swift, S., et al. (2022). Association between delays to patient admission from the emergency department and all-cause 30-day mortality. <i>Emergency Medicine Journal</i>, 39(3), 168–173.</p>
  <p class="ref ltr" style="font-size:20px;margin-top:6px"><b>[2]</b> Kim, M., Lee, J. H., Choi, M., et al. (2026). Association between emergency department crowding and mortality: a nationwide analysis stratified by emergency department levels. <i>BMC Emergency Medicine</i>, 26(1), 153.</p>
  <p class="ref ltr" style="font-size:20px;margin-top:6px"><b>[3]</b> af Ugglas, B., et al. (2020). Association between hospital bed occupancy and outcomes in emergency care: a cohort study in Stockholm Region, Sweden, 2012 to 2016. <i>Annals of Emergency Medicine</i>.</p>"""

# ---------------- Arabic ----------------
AR_NAME = '<span>د. علاء محمد أحمد</span>'
ar = [
('dark', f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">التميّز التشغيلي · من الدراسات العلمية</div>
  <h1 style="font-size:72px">حين لا يجد المريض سريرًا في المستشفى، يبقى في قسم الطوارئ، وللانتظار هناك ثمن.</h1>
  <h1 class="dim" style="margin-top:12px;font-size:58px;line-height:1.45">دراستان حديثتان من إنجلترا وكوريا الجنوبية شملتا ملايين المرضى.</h1>
  <div class="swipe">← اسحب للمتابعة</div>""", AR_NAME),
('', f"""<div class="kicker">أصل المشكلة</div>
  <h2>كيف يتحول امتلاء الأسرّة إلى انتظار؟</h2>
  <p class="lead">لا تصل الحالات الطارئة بانتظام. وحين تمتلئ أسرّة الأقسام، لا يجد المريض الذي قرر الأطباء إدخاله مكانًا ينتقل إليه، فيبقى في قسم الطوارئ، ويزدحم القسم بمن ينتظرون.</p>
  <div class="box"><p>ونقصد بالإشغال نسبة الأسرّة المشغولة من مجموع الأسرّة المتاحة.</p></div>""", AR_NAME),
('', f"""<div class="kicker">الدراسة الأولى: إنجلترا</div>
  <h2>بعد الساعة الخامسة، صار لكل ساعة انتظار ثمن</h2>
  <p class="lead" style="font-size:31px">حلّل باحثون بيانات 5.2 مليون مريض أُدخلوا المستشفى من أقسام الطوارئ الرئيسية في إنجلترا بين عامي 2016 و2018، ونُشرت الدراسة عام 2022.</p>
  <div style="margin-top:14px">
    <div class="stat"><span class="n" style="font-size:110px">5</span><p>ساعات من الوصول، وبعدها أخذت الوفيات خلال ثلاثين يومًا تزيد كلما طال الانتظار، حتى 12 ساعة.</p></div>
    <div class="stat"><span class="n" style="font-size:110px">8%</span><p>هي أكبر زيادة في نسبة الوفيات، وظهرت لدى من انتظروا أكثر من 6 إلى 8 ساعات.</p></div>
  </div>""", ENG),
('', f"""<div class="kicker">ما تعنيه الأرقام</div>
  <h2>وفاة إضافية لكل 82 مريضًا</h2>
  <div class="big" style="color:var(--rust);font-size:150px;line-height:1.5">1 من كل 82</div>
  <p class="lead" style="margin-top:10px">قدّرت الدراسة أنه مقابل كل 82 مريضًا يتأخر نقلهم إلى سرير في المستشفى أكثر من 6 إلى 8 ساعات من وصولهم، تحدث وفاة إضافية واحدة.</p>""", ENG),
('amber', f"""<div class="kicker">الدراسة الثانية: كوريا الجنوبية</div>
  <div class="big" style="direction:ltr;text-align:right;font-size:240px">100%</div>
  <h2 style="margin-top:0;font-size:54px">حين امتلأت أسرّة الطوارئ، ارتفعت احتمالات الوفاة</h2>
  <p class="lead" style="font-size:30px">حلّل باحثون نحو 26 مليون زيارة لأقسام الطوارئ بين عامي 2018 و2022. وحين بلغ إشغال أسرّة الطوارئ 100% أو أكثر، ارتفعت احتمالات الوفاة داخل المستشفى بنحو 12% في الأقسام الأعلى مستوى، و21% في الأقسام الأدنى مستوى.</p>""", KOR),
('dark', f"""<div class="kicker">أبعد من المستشفيات</div>
  <h2>والفكرة لا تخصّ المستشفيات وحدها</h2>
  <p class="lead">كل نظام يستقبل طلبًا غير منتظم، من مركز الاتصال إلى خط الإنتاج إلى فريق يعالج المعاملات، يتصرف بطريقة مشابهة: كلما اقترب من طاقته الكاملة، طالت الطوابير بسرعة تفوق الزيادة في العمل نفسه.</p>
  <p class="small" style="margin-top:30px">هذا استنتاج من نظرية الطوابير (<span class="ltr">Queueing theory</span>)، وهي فرع من الرياضيات التطبيقية يدرس الانتظار، وليس نتيجة من الدراستين.</p>""", AR_NAME),
('dark', f"""<div class="kicker">ما أستخلصه للقادة</div>
  <h2 style="font-size:60px">الهامش الفارغ ليس هدرًا، بل جزء من تصميم النظام</h2>
  <ul class="clean">
    <li><span class="num">1</span>قِس الإشغال في أوقات الذروة، لا متوسطه السنوي وحده، لأن المتوسط يُخفي الأيام التي يختنق فيها النظام.</li>
    <li><span class="num">2</span>خطّط للطاقة بحيث تستوعب تذبذب الطلب، لا الطلب المتوسط فقط.</li>
    <li><span class="num">3</span>تابع الوقت الذي ينتظره المريض حتى يصل إلى سريره، فهو يكشف ازدحام المستشفى كله، لا ازدحام الطوارئ وحدها.</li>
  </ul>
  <div class="q" style="font-size:40px;margin-top:28px;padding:26px 34px">إذا كان فريقك مشغولًا طوال الوقت، فأين سيذهب العمل الطارئ غدًا؟</div>""", AR_NAME),
('', f"""<div class="kicker">المصادر وحدود الدليل</div>
  <h2 style="font-size:52px">حدود هذه الأدلة</h2>
  <ul class="clean" style="margin-top:8px">
    <li style="font-size:24px;padding:12px 0">الدراستان رصديتان تثبتان ارتباطًا لا سببية، مع أن الباحثين عدّلوا النتائج بحسب العمر والأمراض المصاحبة وعوامل أخرى.</li>
    <li style="font-size:24px;padding:12px 0">لم تجد دراسة في ستوكهولم ارتباطًا بين إشغال أسرّة المستشفى والوفيات، فالأثر قد يختلف من نظام صحي إلى آخر.</li>
    <li style="font-size:24px;padding:12px 0">أُجريت الدراستان في إنجلترا وكوريا الجنوبية، ولم تشملا مستشفيات عربية.</li>
  </ul>
  <p class="small" style="margin-top:10px;font-size:22px;line-height:1.55"><b>تنويه تحريري:</b> الآراء والتحليلات الواردة في هذا المقال تمثل رأي الكاتب وتحليله المهني استنادًا إلى المصادر المشار إليها، ولا تمثل بالضرورة المواقف الرسمية للجهات المذكورة. وللاطلاع على المعلومات والمراجع الأصلية والكاملة والأحدث، يُرجى الرجوع مباشرة إلى المصادر الأصلية والوثائق الرسمية الواردة في قائمة المراجع.</p>
  {REFS}
  <div class="end-logo" style="margin-bottom:10px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""", '<span>د. علاء محمد أحمد · التميّز التشغيلي</span>'),
]
AR_CSS = ''':root{--serif:'Amiri',serif;--sans:'IBM Plex Sans Arabic',sans-serif}
.kicker{letter-spacing:0;text-transform:none;font-size:28px}
h1{font-size:88px;line-height:1.35}
h2{font-size:66px;line-height:1.4}
p,li{line-height:1.7}
.stat .n{direction:ltr;text-align:right}'''
open('slides-ar.html', 'w').write(page('ar', 'حين يمتلئ النظام', 'family=Amiri:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600', AR_CSS, ar))

# ---------------- English ----------------
EN_NAME = '<span>Dr. Alaa Mohamed Ahmed</span>'
en = [
('dark', f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">Operational Excellence · What the research says</div>
  <h1 style="font-size:80px">When there is no bed upstairs, patients wait in the emergency department. That wait has a cost.</h1>
  <h1 class="dim" style="margin-top:16px;font-size:60px">Two recent studies from England and South Korea, covering millions of patients.</h1>
  <div class="swipe">Swipe →</div>""", EN_NAME),
('', f"""<div class="kicker">The problem</div>
  <h2>How full beds turn into waiting</h2>
  <p class="lead">Emergencies don't arrive evenly. When the wards are full, a patient who needs admission has nowhere to go. They stay in the emergency department, and the department fills up with people waiting.</p>
  <div class="box"><p>Bed occupancy is the share of available beds that are in use.</p></div>""", EN_NAME),
('', f"""<div class="kicker">Study 1: England</div>
  <h2>After five hours, every extra hour of waiting carried a cost</h2>
  <p class="lead" style="font-size:31px">Researchers analyzed 5.2 million patients admitted from major emergency departments in England from 2016 to 2018. The study was published in 2022.</p>
  <div style="margin-top:14px">
    <div class="stat"><span class="n" style="font-size:110px">5 h</span><p>After five hours from arrival, 30-day mortality rose steadily the longer patients waited, up to 12 hours.</p></div>
    <div class="stat"><span class="n" style="font-size:110px">8%</span><p>The largest rise in mortality, seen in patients who waited more than six to eight hours.</p></div>
  </div>""", ENG),
('', f"""<div class="kicker">What the numbers mean</div>
  <h2>One extra death for every 82 patients</h2>
  <div class="big" style="color:var(--rust);font-size:200px">1 in 82</div>
  <p class="lead" style="margin-top:10px">The study estimated one extra death for every 82 admitted patients whose move to a hospital bed was delayed beyond six to eight hours from arrival.</p>""", ENG),
('amber', f"""<div class="kicker">Study 2: South Korea</div>
  <div class="big" style="font-size:240px">100%</div>
  <h2 style="margin-top:0;font-size:58px">When emergency beds were full, the odds of death rose</h2>
  <p class="lead" style="font-size:30px">Researchers analyzed about 26 million emergency visits from 2018 to 2022. When emergency department occupancy reached 100% or more, the odds of in-hospital death rose by about 12% in higher-level departments and 21% in lower-level ones.</p>""", KOR),
('dark', f"""<div class="kicker">Beyond hospitals</div>
  <h2>The same pattern shows up far from the hospital ward</h2>
  <p class="lead">Any system with uneven demand behaves in a similar way, whether it is a call center, a production line, or a team that handles requests. As it nears full capacity, queues grow much faster than the workload.</p>
  <p class="small" style="margin-top:30px">This point comes from queueing theory, the math of waiting lines. It is not a finding of the two studies.</p>""", EN_NAME),
('dark', f"""<div class="kicker">What I take from this for leaders</div>
  <h2 style="font-size:60px">Spare capacity is part of the design, not waste.</h2>
  <ul class="clean" style="margin-top:20px">
    <li style="font-size:32px;padding:16px 0"><span class="num">1</span>Track occupancy at peak times, not only the yearly average. The average hides the days when the system chokes.</li>
    <li style="font-size:32px;padding:16px 0"><span class="num">2</span>Plan capacity for the swings in demand, not just the average.</li>
    <li style="font-size:32px;padding:16px 0"><span class="num">3</span>Track how long patients wait for a bed. It shows how crowded the whole hospital is, not just the emergency department.</li>
  </ul>
  <div class="q" style="font-size:38px;margin-top:22px;padding:22px 32px">If your team is busy all the time, where will tomorrow's urgent work go?</div>""", EN_NAME),
('', f"""<div class="kicker">Sources and limits</div>
  <h2 style="font-size:54px">What this evidence can and cannot tell us</h2>
  <ul class="clean" style="margin-top:8px">
    <li style="font-size:25px;padding:12px 0">Both studies are observational. They show association, not cause, although the researchers adjusted for age, other illnesses, and other factors.</li>
    <li style="font-size:25px;padding:12px 0">A study in Stockholm found no link between hospital bed occupancy and mortality, so the effect may differ between health systems.</li>
    <li style="font-size:25px;padding:12px 0">The studies come from England and South Korea, not from Arab health systems.</li>
  </ul>
  <p class="small" style="margin-top:10px;font-size:21px;line-height:1.5"><b>Editorial disclaimer:</b> The views and analyses presented in this article represent the author’s professional interpretation based on the cited sources and do not necessarily represent the official positions of the organizations mentioned. For the original, complete and most current information, please consult the primary sources and official documents listed in the references.</p>
  {REFS}
  <div class="end-logo" style="margin-bottom:10px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""", '<span>Dr. Alaa Mohamed Ahmed · Operational Excellence</span>'),
]
EN_CSS = ''':root{--serif:'Source Serif 4',Georgia,serif;--sans:'Inter',Arial,sans-serif}'''
open('slides-en.html', 'w').write(page('en', 'When the System Is Full', 'family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;600', EN_CSS, en))
