# Builds slides-ar.html and slides-en.html for post 008. Edit, then: python3 build.py && node render.js <folder> ar,en
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


SLUG = 'article-oe-evidence-audit-and-feedback'
C1 = '<span class="ltr">Ivers et al., Cochrane, 2026</span>'
C2 = '<span class="ltr">Xu et al., Clin Infect Dis, 2025</span>'
C3 = '<span class="ltr">Tinmouth 2021 · Chamberlain 2025 · Gallagher 2026</span>'
NAME = '<span>د. علاء محمد أحمد</span>'
EN_NAME = '<span>Dr. Alaa Mohamed Ahmed</span>'
R = 'class="ref ltr" style="font-size:16px;margin-top:3px;line-height:1.35"'
REFS = f"""<p {R}><b>[1]</b> Ivers, N., et al. (2026). Audit and feedback: effects on professional practice. <i>Cochrane Database Syst Rev</i>, CD000259.</p>
  <p {R}><b>[2]</b> Xu, A. X. T., et al. (2025). Audit and feedback interventions for antibiotic prescribing in primary care. <i>Clin Infect Dis</i>, 80(2), 253–262.</p>
  <p {R}><b>[3]</b> Tinmouth, J., et al. (2021). A pragmatic RCT of an endoscopist audit and feedback report for colonoscopy. <i>Am J Gastroenterol</i>, 116(10), 2042–2051.</p>
  <p {R}><b>[4]</b> Chamberlain, J. M., et al. (2025). Audit and feedback on pediatric emergency department performance measures. <i>Hosp Pediatr</i>, 15(11), 901–910.</p>
  <p {R}><b>[5]</b> Gallagher, K., et al. (2026). RESECT: a randomised controlled trial of audit and feedback in bladder cancer surgery. <i>Eur Urol</i>, 89(4), 355–365.</p>"""
SL = 'style="font-size:90px;min-width:300px"'
L = lambda x: f'<span class="ltr">{x}</span>'
LI = 'style="font-size:28px;padding:12px 0"'
ar=[]
ar.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">التميّز التشغيلي · من الدراسات العلمية</div>
  <h1 style="font-size:66px">تعرض مؤسسات صحية كثيرة على أطبائها أرقام أدائهم.</h1>
  <h1 class="dim" style="margin-top:12px;font-size:50px;line-height:1.5">وفي مراجعة لتجارب عشوائية كثيرة، زاد اتباع ما توصي به الأدلة بنحو {L('6')}&nbsp;نقاط مئوية في المتوسط.</h1>
  <p class="lead">لكن الأثر تفاوت كثيرًا. وهذا ما تعرضه خمس دراسات نُشرت بين عامي {L('2021')} و{L('2026')}.</p>
  <div class="swipe">← اسحب للمتابعة</div>""",NAME))
ar.append(('',f"""<div class="kicker">الفكرة</div>
  <h2>ما التدقيق والتغذية الراجعة؟</h2>
  <p class="lead">هو أن يُقاس أداء الطبيب أو الفريق مدة محددة، ثم تُعرض عليه النتائج.</p>
  <div class="box">
    <p>والنقطة المئوية هي الفرق بين نسبتين: فالانتقال من {L('50%')} إلى {L('56%')} زيادة بست نقاط مئوية.</p>
  </div>""",C1))
ar.append(('',f"""<div class="kicker">مراجعة كوكرين</div>
  <h2>جمعت المراجعة {L('292')}&nbsp;تجربة عشوائية</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>6.2</span><p>هو متوسط الزيادة بالنقاط المئوية في اتباع ما توصي به الأدلة، في {L('177')}&nbsp;تجربة قارنت من تلقّوا الأرقام بمن لم يتلقّوها.</p></div>
    <div class="stat"><span class="n" {SL}>2.7</span><p>هو الحد الذي لم يتجاوزه التحسن في نصف النتائج. وفي ربعها على الأقل لم يحدث تحسن. وهذا الرقم محسوب بطريقة أخرى، فلا يُقارَن بالمتوسط مباشرة.</p></div>
  </div>
  <p class="small" style="margin-top:20px">وكان التحسن أكبر عند الأطباء الذين بدؤوا بأداء ضعيف.</p>""",C1))
ar.append(('',f"""<div class="kicker">وصف المضادات الحيوية</div>
  <h2>وصف أطباء الرعاية الأولية مضادات أقل</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>11%</span><p>هي نسبة انخفاض كمية المضادات الحيوية عند من تلقّوا الأرقام، في {L('21')}&nbsp;تجربة.</p></div>
    <div class="stat"><span class="n" {SL}>23%</span><p>هي نسبة انخفاض المرات التي بدأ فيها الأطباء مضادًا لا حاجة إليه، في {L('16')}&nbsp;تجربة.</p></div>
  </div>
  <p class="small" style="margin-top:20px">وهاتان النسبتان محسوبتان قياسًا إلى ما فعله الأطباء الذين لم يتلقّوا الأرقام، وليستا نقاطًا مئوية. ونبّه الباحثون إلى أن نتائج التجارب اختلفت كثيرًا.</p>""",C2))
ar.append(('',f"""<div class="kicker">نتائج متباينة</div>
  <h2>ولم يتحسن كل شيء</h2>
  <ul class="clean">
    <li {LI}>في أونتاريو بكندا، ارتفعت نسبة استئصال الزوائد عند أطباء التنظير في المجموعتين بقدر متقارب، لكن الأضعف أداءً ممن تلقّوا التقرير تحسّنوا أكثر.</li>
    <li {LI}>وفي سبعة أقسام لطوارئ الأطفال، تحسّن تسجيل العلامات الحيوية، وساءت في الفترة نفسها سرعة الخدمة.</li>
    <li {LI}>وفي {L('201')}&nbsp;مركز لجراحة أورام المثانة، تحسّن تسجيل المعلومات الجراحية في المراكز التي تلقّت التقارير، ولم يختلف معدل عودة الورم.</li>
  </ul>""",C3))
ar.append(('amber',f"""<div class="kicker">متى كان الأثر أكبر؟</div>
  <h2 style="margin-top:20px">كان الأثر أكبر حين خصّت الأرقام الطبيب نفسه</h2>
  <ul class="clean">
    <li {LI}>وحين قارنت أداءه بأفضل زملائه أو بمستوى مرجعي محدد.</li>
    <li {LI}>وحين عرضها شخص من مكان العمل يعرفه الطبيب من قبل.</li>
    <li {LI}>وحين صاحبتها خطة فيها خطوات محددة للتحسين.</li>
  </ul>
  <p class="small" style="margin-top:20px">جاءت أكثر هذه النتائج من مقارنة التجارب بعضها ببعض، وقال الباحثون إنها تحتاج إلى تأكيد.</p>""",C1))
ar.append(('dark',f"""<div class="kicker">ما يستنتجه الكاتب من الدراسات</div>
  <h2>ما الذي يستطيع القائد فعله؟</h2>
  <ul class="clean">
    <li><span class="num">1</span>يختار مؤشرًا مهمًا ما زال الأداء فيه بعيدًا عن المطلوب.</li>
    <li><span class="num">2</span>ويعرض على كل شخص أرقامه هو، ويناقشها معه شخص يعرفه، ومعها خطة محددة.</li>
    <li><span class="num">3</span>ويراقب مقاييس أخرى قد تسوء، لا المقياس المستهدف وحده.</li>
  </ul>
  <p class="small" style="margin-top:10px">الخطوات الثلاث استنتاج من الكاتب، ولم تختبرها أي دراسة مجتمعةً.</p>
  <div class="q" style="font-size:32px;margin-top:20px;padding:22px 32px">بعد ثلاث سنوات، أتريد أن تبقى تقارير الأداء في مؤسستك أوراقًا تُنسى، أم أن يراجع كل موظف أرقامه مع زميل يعرفه ويختارا خطوة لتحسينها؟</div>""",NAME))
ar.append(('',f"""<div class="kicker">المصادر وحدود الدليل</div>
  <h2 style="font-size:46px">حدود هذه الأدلة</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">في {L('39%')} من تجارب مراجعة كوكرين خطر مرتفع للتحيز، أي خلل قد يجعل النتيجة غير دقيقة.</li>
    <li style="font-size:22px;padding:6px 0">وتقيس المراجعة ما يفعله العاملون الصحيون، لا صحة المرضى.</li>
    <li style="font-size:22px;padding:6px 0">ولم يذكر ملخص أيٍّ من الدراسات الخمس تجربة في دولة عربية، ونفع الفكرة في قطاعات أخرى استنتاج لم يُختبر بعد.</li>
  </ul>
  <p class="small" style="margin-top:6px;font-size:18px;line-height:1.5"><b>تنويه تحريري:</b> الآراء والتحليلات الواردة في هذا المقال تمثل رأي الكاتب وتحليله المهني استنادًا إلى المصادر المشار إليها، ولا تمثل بالضرورة المواقف الرسمية للجهات المذكورة. وللاطلاع على المعلومات والمراجع الأصلية والكاملة والأحدث، يُرجى الرجوع مباشرة إلى المصادر الأصلية والوثائق الرسمية الواردة في قائمة المراجع.</p>
  {REFS}
  <p class="small" style="margin-top:6px;font-size:21px"><b>المقال الكامل:</b> <span class="ltr">tamayuz10x.com/{SLUG}.html</span></p>
  <div class="end-logo" style="margin-bottom:2px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>د. علاء محمد أحمد · التميّز التشغيلي</span>'))
en=[]
en.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">Operational Excellence · What the research says</div>
  <h1 style="font-size:70px">Many health systems show doctors their own performance data.</h1>
  <h1 class="dim" style="margin-top:16px;font-size:50px">In a review of many randomized trials, recommended practice rose by about 6 percentage points on average, compared with clinicians who did not get their data.</h1>
  <p class="lead">But the effect varied widely. Here is what five studies, published from 2021 to 2026, show.</p>
  <div class="swipe">Swipe →</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">The idea</div>
  <h2>What is audit and feedback?</h2>
  <p class="lead">Measuring the performance of a doctor or team over a set period, then showing them the results.</p>
  <div class="box"><p>A percentage point is the difference between two percentages. Going from 50% to 56% is a rise of six percentage points.</p></div>""",C1))
en.append(('',f"""<div class="kicker">The Cochrane review</div>
  <h2>The review pooled 292 randomized trials</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>6.2</span><p>percentage points: the average rise in recommended practice, in 177 trials comparing clinicians who got their data with those who did not.</p></div>
    <div class="stat"><span class="n" {SL}>2.7</span><p>points or less: the improvement in half of the results. At least a quarter showed no improvement. This figure is calculated differently, so do not compare it directly with the average.</p></div>
  </div>
  <p class="small" style="margin-top:20px">Improvement was larger among doctors who started from low performance.</p>""",C1))
en.append(('',f"""<div class="kicker">Antibiotic prescribing</div>
  <h2>Primary care doctors prescribed fewer antibiotics</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>11%</span><p>fewer antibiotics prescribed by doctors who received their data, in 21 trials.</p></div>
    <div class="stat"><span class="n" {SL}>23%</span><p>fewer antibiotics started without need, in 16 trials.</p></div>
  </div>
  <p class="small" style="margin-top:20px">Both are relative reductions, measured against doctors who did not receive the data. They are not percentage points, so they cannot be compared directly with the 6.2 points on the previous slide. The researchers noted that results varied widely across trials.</p>""",C2))
en.append(('',f"""<div class="kicker">Mixed results</div>
  <h2>Not everything improved</h2>
  <ul class="clean">
    <li {LI}>In Ontario, Canada, the polyp removal rate rose by similar amounts among colonoscopy doctors who got a report and those who did not. But lower performers who got a report improved more than lower performers who did not.</li>
    <li {LI}>In seven pediatric emergency departments, recording of vital signs improved, while over the same period speed of care got worse.</li>
    <li {LI}>In 201 bladder cancer surgery centers, recording of surgical findings improved where reports were sent, but early cancer recurrence did not differ.</li>
  </ul>""",C3))
en.append(('amber',f"""<div class="kicker">What made the data more useful</div>
  <h2 style="margin-top:20px">When was the effect larger?</h2>
  <ul class="clean">
    <li {LI}>When the data were about the doctor's own practice and compared it with top peers or a set benchmark.</li>
    <li {LI}>When someone from the same workplace whom the doctor knew presented the data.</li>
    <li {LI}>When a plan with specific steps came with the report.</li>
  </ul>
  <p class="small" style="margin-top:20px">Most of these findings came from comparing results across trials, and the researchers said they need confirmation.</p>""",C1))
en.append(('dark',f"""<div class="kicker">The author's reading of the studies</div>
  <h2>What can leaders do?</h2>
  <ul class="clean">
    <li style="font-size:33px"><span class="num">1</span>Choose an important measure where performance is still far from the goal.</li>
    <li style="font-size:33px"><span class="num">2</span>Show each person their own numbers, have someone they know discuss them, and agree on a specific plan.</li>
    <li style="font-size:33px"><span class="num">3</span>Watch other measures that could get worse, not only the one you target.</li>
  </ul>
  <p class="small" style="margin-top:10px">All three steps are the author's inference from the studies. No study tested them together.</p>
  <div class="q" style="font-size:32px;margin-top:20px;padding:22px 32px">Three years from now, should performance reports in your organization be documents people forget, or a regular review of each person's numbers with a colleague they know?</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">Sources and limits</div>
  <h2 style="font-size:48px">What this evidence can and cannot tell us</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">In 39% of the Cochrane trials, flaws in design or conduct could make the result inaccurate (high risk of bias).</li>
    <li style="font-size:22px;padding:6px 0">The review measured what health professionals did, not patient health.</li>
    <li style="font-size:22px;padding:6px 0">None of the five study abstracts mentions a trial in an Arab country. Applying the idea to other sectors is an untested inference.</li>
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
open('slides-ar.html','w').write(page('ar','ماذا حدث حين عرضت مؤسسات صحية على أطبائها أرقام أدائهم؟','family=Amiri:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600',AR_CSS,ar))
open('slides-en.html','w').write(page('en','What Happened When Health Systems Showed Doctors Their Own Performance Data?','family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;600',EN_CSS,en))
