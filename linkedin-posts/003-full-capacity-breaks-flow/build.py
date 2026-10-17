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

BMJ = '<span class="ltr">Bagust et al., BMJ, 1999</span>'
HA = '<span class="ltr">Madsen et al., Health Affairs, 2014</span>'
REFS = '''<p class="ref ltr" style="font-size:21px;margin-top:12px"><b>[1]</b> Bagust, A., Place, M., &amp; Posnett, J. W. (1999). Dynamics of bed use in accommodating emergency admissions: stochastic simulation model. <i>BMJ</i>, 319(7203), 155–158.</p>
  <p class="ref ltr" style="font-size:21px;margin-top:8px"><b>[2]</b> Madsen, F., Ladelund, S., &amp; Linneberg, A. (2014). High levels of bed occupancy associated with increased inpatient and thirty-day hospital mortality in Denmark. <i>Health Affairs</i>, 33(7), 1236–1244.</p>'''

# ---------------- Arabic ----------------
AR_NAME = '<span>د. علاء محمد أحمد</span>'
ar = [
('dark', f'''<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">التميّز التشغيلي · من الدراسات العلمية</div>
  <h1 style="font-size:74px">كلما امتلأ المستشفى أكثر، ضاقت قدرته على استقبال الحالة الطارئة التالية.</h1>
  <h1 class="dim" style="margin-top:12px;font-size:64px;line-height:1.45">والخطر يبدأ قبل أن يمتلئ تمامًا.</h1>
  <p class="lead">دراسة محاكاة بريطانية، وبيانات 2.65 مليون حالة دخول في الدنمارك، تشرحان لماذا يحتاج كل نظام إلى هامش فارغ.</p>
  <div class="swipe">← اسحب للمتابعة</div>''', AR_NAME),
('', f'''<div class="kicker">أصل المشكلة</div>
  <h2>لماذا لا يكفي أن يبدو متوسط الإشغال مقبولًا؟</h2>
  <p class="lead">لا تصل الحالات الطارئة بانتظام؛ ففي يوم تأتي قليلة، وفي يوم آخر تتزاحم. والمستشفى الذي يعمل قريبًا من طاقته الكاملة لا يجد أسرّة يستوعب بها هذا التزاحم، فيتحول يوم مزدحم واحد إلى أزمة.</p>
  <div class="box"><p>ونقصد بالإشغال نسبة الأسرّة المشغولة من مجموع الأسرّة المتاحة.</p></div>''', BMJ),
('', f'''<div class="kicker">الدراسة الأولى</div>
  <h2>ماذا وجد النموذج البريطاني؟</h2>
  <p class="lead" style="font-size:32px">بنى باحثون بريطانيون نموذج محاكاة حاسوبيًا لمستشفى يستقبل حالات طارئة، ونشرت المجلة الطبية البريطانية BMJ نتائجه عام 1999.</p>
  <div style="margin-top:20px">
    <div class="stat"><span class="n">85%</span><p>دون هذا المتوسط بقيت المخاطر محدودة، وعنده توقّع النموذج نقصًا في الأسرّة نحو أربعة أيام في السنة.</p></div>
    <div class="stat"><span class="n">90%</span><p>عند هذا المتوسط أو أعلى منه، صارت أزمات الأسرّة تتكرر بانتظام.</p></div>
  </div>''', BMJ),
('', f'''<div class="kicker">الكلفة الخفية</div>
  <h2>أربعة أيام في السنة تبدو قليلة، لكن أثرها أطول بكثير</h2>
  <div class="big" style="color:var(--rust);font-size:150px;line-height:1.6;margin-top:10px">8 أسابيع</div>
  <p class="lead" style="margin-top:10px">قدّرت الدراسة أن مستشفى يعجز عن استقبال المرضى أربعة أيام في السنة قد يضطرب عمله مدة تصل في مجموعها إلى ثمانية أسابيع.</p>''', BMJ),
('amber', f'''<div class="kicker">الدراسة الثانية</div>
  <div class="big" style="direction:ltr;text-align:right">9%</div>
  <h2 style="margin-top:0;font-size:58px">زيادة في الوفيات ارتبطت بارتفاع إشغال الأسرّة</h2>
  <p class="lead" style="font-size:32px">حلّل باحثون دنماركيون 2.65 مليون حالة دخول إلى أقسام الباطنة بين عامي 1995 و2012، ووجدوا أن ارتفاع الإشغال ارتبط بزيادة قدرها 9% في الوفيات داخل المستشفى وخلال ثلاثين يومًا، مقارنة بانخفاضه.</p>
  <p class="small" style="margin-top:20px">هذا ارتباط إحصائي، ولا يثبت وحده أن الإشغال هو السبب.</p>''', HA),
('dark', f'''<div class="kicker">أبعد من المستشفيات</div>
  <h2>والفكرة لا تخصّ المستشفيات وحدها</h2>
  <p class="lead">كل نظام يستقبل طلبًا غير منتظم، من مركز الاتصال إلى خط الإنتاج إلى فريق يعالج المعاملات، يتصرف بطريقة مشابهة: كلما اقترب من طاقته الكاملة، طالت الطوابير بسرعة تفوق الزيادة في العمل نفسه.</p>
  <p class="small" style="margin-top:30px">هذا استنتاج من نظرية الطوابير (<span class="ltr">Queueing theory</span>)، وهي فرع من الرياضيات التطبيقية يدرس الانتظار، وليس نتيجة من الدراستين.</p>''', AR_NAME),
('dark', f'''<div class="kicker">ما أستخلصه للقادة</div>
  <h2 style="font-size:60px">الهامش الفارغ ليس هدرًا، بل جزء من تصميم النظام</h2>
  <ul class="clean">
    <li><span class="num">1</span>قِس الإشغال في أوقات الذروة، لا متوسطه السنوي وحده، لأن المتوسط يُخفي الأيام التي ينهار فيها النظام.</li>
    <li><span class="num">2</span>خطّط للطاقة بحيث تستوعب تذبذب الطلب، لا الطلب المتوسط فقط.</li>
    <li><span class="num">3</span>لا تحكم على مبادرة من نتائج سنة واحدة في موقع واحد؛ فقد وجدت الدراسة البريطانية أن التذبذب العشوائي يطغى على أثرها.</li>
  </ul>
  <div class="q" style="font-size:40px;margin-top:28px;padding:26px 34px">إذا كان فريقك مشغولًا طوال الوقت، فأين سيذهب العمل الطارئ غدًا؟</div>''', AR_NAME),
('', f'''<div class="kicker">المصادر وحدود الدليل</div>
  <h2 style="font-size:54px">حدود هذه الأدلة</h2>
  <ul class="clean" style="margin-top:14px">
    <li style="font-size:26px">الدراسة البريطانية نموذج محاكاة لمستشفى افتراضي، لا بيانات مستشفى حقيقي، ونُشرت عام 1999.</li>
    <li style="font-size:26px">الدراسة الدنماركية تثبت ارتباطًا لا سببية، وتخصّ أقسام الباطنة في دولة واحدة.</li>
    <li style="font-size:26px">نسبة 85% نتيجة النموذج الذي بنته الدراسة، وقد يختلف الحد المناسب من مستشفى إلى آخر.</li>
  </ul>
  <p class="small" style="margin-top:16px;font-size:24px;line-height:1.6"><b>تنويه تحريري:</b> الآراء والتحليلات الواردة في هذا المقال تمثل رأي الكاتب وتحليله المهني استنادًا إلى المصادر المشار إليها، ولا تمثل بالضرورة المواقف الرسمية للجهات المذكورة. وللاطلاع على المعلومات والمراجع الأصلية والكاملة والأحدث، يُرجى الرجوع مباشرة إلى المصادر الأصلية والوثائق الرسمية الواردة في قائمة المراجع.</p>
  {REFS}
  <div class="end-logo">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>''', '<span>د. علاء محمد أحمد · التميّز التشغيلي</span>'),
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
('dark', f'''<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">Operational Excellence · What the research says</div>
  <h1 style="font-size:84px">The fuller a hospital runs, the less room it has for the next emergency.</h1>
  <h1 class="dim" style="margin-top:16px;font-size:72px">The trouble starts well before it is full.</h1>
  <p class="lead">A British simulation and data on 2.65 million Danish admissions show why spare capacity belongs in the design.</p>
  <div class="swipe">Swipe →</div>''', EN_NAME),
('', f'''<div class="kicker">The problem</div>
  <h2>Why a reasonable average can still hide danger</h2>
  <p class="lead">Emergencies don't arrive evenly. Some days are quiet, and others bring a rush. A hospital that runs close to capacity has no spare beds to absorb the rush, so one busy day can turn into a crisis.</p>
  <div class="box"><p>Bed occupancy is the share of available beds that are in use.</p></div>''', BMJ),
('', f'''<div class="kicker">Study 1</div>
  <h2>What the British model found</h2>
  <p class="lead" style="font-size:32px">Researchers built a computer simulation of a hospital that takes emergency admissions. The BMJ published the results in 1999.</p>
  <div style="margin-top:20px">
    <div class="stat"><span class="n">85%</span><p>Below this average, risk stayed low. At this level, the model expected the hospital to run short of beds on about four days a year.</p></div>
    <div class="stat"><span class="n">90%</span><p>At this level or higher, bed crises became a regular event.</p></div>
  </div>''', BMJ),
('', f'''<div class="kicker">The hidden cost</div>
  <h2>Four days a year sounds small. The damage lasts much longer.</h2>
  <div class="big" style="color:var(--rust);font-size:190px">8 weeks</div>
  <p class="lead" style="margin-top:10px">The study estimated that a hospital that runs out of beds on four days a year may see its work disrupted for up to eight weeks in total.</p>''', BMJ),
('amber', f'''<div class="kicker">Study 2</div>
  <div class="big">9%</div>
  <h2 style="margin-top:0;font-size:60px">higher mortality linked to high bed occupancy</h2>
  <p class="lead" style="font-size:32px">Danish researchers analyzed 2.65 million admissions to medical departments from 1995 to 2012. High occupancy was linked to a 9% rise in in-hospital and 30-day mortality, compared with low occupancy.</p>
  <p class="small" style="margin-top:20px">This is a statistical association. On its own, it does not prove that occupancy was the cause.</p>''', HA),
('dark', f'''<div class="kicker">Beyond hospitals</div>
  <h2>The same pattern shows up far from the hospital ward</h2>
  <p class="lead">Any system with uneven demand behaves in a similar way, whether it is a call center, a production line, or a team that handles requests. As it nears full capacity, queues grow much faster than the workload.</p>
  <p class="small" style="margin-top:30px">This point comes from queueing theory, the math of waiting lines. It is not a finding of the two studies.</p>''', EN_NAME),
('dark', f'''<div class="kicker">What I take from this for leaders</div>
  <h2 style="font-size:60px">Spare capacity is part of the design, not waste.</h2>
  <ul class="clean" style="margin-top:20px">
    <li style="font-size:32px;padding:16px 0"><span class="num">1</span>Track occupancy at peak times, not only the yearly average. The average hides the days when the system breaks.</li>
    <li style="font-size:32px;padding:16px 0"><span class="num">2</span>Plan capacity for the swings in demand, not just the average.</li>
    <li style="font-size:32px;padding:16px 0"><span class="num">3</span>Don't judge an initiative on one year at one site. The British study found that random variation swamps the effect.</li>
  </ul>
  <div class="q" style="font-size:38px;margin-top:22px;padding:22px 32px">If your team is busy all the time, where will tomorrow's urgent work go?</div>''', EN_NAME),
('', f'''<div class="kicker">Sources and limits</div>
  <h2 style="font-size:58px">What this evidence can and cannot tell us</h2>
  <ul class="clean" style="margin-top:14px">
    <li style="font-size:27px">The British study is a simulation of a hypothetical hospital, not real hospital data, and it dates from 1999.</li>
    <li style="font-size:27px">The Danish study shows an association, not cause, and covers medical departments in one country.</li>
    <li style="font-size:27px">The 85% figure comes from one model. The right limit can differ from one hospital to another.</li>
  </ul>
  <p class="small" style="margin-top:16px;font-size:23px;line-height:1.55"><b>Editorial disclaimer:</b> The views and analyses presented in this article represent the author’s professional interpretation based on the cited sources and do not necessarily represent the official positions of the organizations mentioned. For the original, complete and most current information, please consult the primary sources and official documents listed in the references.</p>
  {REFS}
  <div class="end-logo">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>''', '<span>Dr. Alaa Mohamed Ahmed · Operational Excellence</span>'),
]
EN_CSS = ''':root{--serif:'Source Serif 4',Georgia,serif;--sans:'Inter',Arial,sans-serif}'''
open('slides-en.html', 'w').write(page('en', 'When the System Is Full', 'family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;600', EN_CSS, en))
