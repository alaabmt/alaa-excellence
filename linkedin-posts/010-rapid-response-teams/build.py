# Builds slides-ar.html and slides-en.html for post 010. Edit, then: python3 build.py && node render.js <folder> ar,en
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


SLUG = 'article-oe-evidence-rapid-response-teams'
C1 = '<span class="ltr">Hillman et al., Lancet, 2005</span>'
C2 = '<span class="ltr">Haegdorens et al., Resuscitation, 2018</span>'
C3 = '<span class="ltr">Maharaj et al., Crit Care, 2015</span>'
C34 = '<span class="ltr">Maharaj et al., 2015 · Zhang et al., 2024</span>'
C134 = '<span class="ltr">Hillman et al., 2005 · Maharaj et al., 2015 · Zhang et al., 2024</span>'
C15 = '<span class="ltr">Hillman et al., 2005 · Hecht et al., 2024</span>'
NAME = '<span>د. علاء محمد أحمد</span>'
EN_NAME = '<span>Dr. Alaa Mohammad Ahmed</span>'
R = 'class="ref ltr" style="font-size:16px;margin-top:3px;line-height:1.35"'
REFS = f"""<p {R}><b>[1]</b> Hillman, K., et al. (2005). Introduction of the medical emergency team (MET) system: a cluster-randomised controlled trial. <i>Lancet</i>, 365(9477), 2091–2097.</p>
  <p {R}><b>[2]</b> Haegdorens, F., et al. (2018). The introduction of a rapid response system in acute hospitals: a pragmatic stepped wedge cluster randomised controlled trial. <i>Resuscitation</i>, 129, 127–134.</p>
  <p {R}><b>[3]</b> Maharaj, R., et al. (2015). Rapid response systems: a systematic review and meta-analysis. <i>Crit Care</i>, 19, 254.</p>
  <p {R}><b>[4]</b> Zhang, Q., et al. (2024). Effects of a rapid response team on patient outcomes: a systematic review. <i>Heart Lung</i>, 63, 51–64.</p>
  <p {R}><b>[5]</b> Hecht, J. D., et al. (2024). A systematic review of the facilitators and barriers to rapid response team activation. <i>Worldviews Evid Based Nurs</i>, 21(2), 148–157.</p>"""
SL = 'style="font-size:84px;min-width:260px"'
L = lambda x: f'<span class="ltr">{x}</span>'
LI = 'style="font-size:28px;padding:12px 0"'
ar=[]
ar.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">التميّز التشغيلي · من الدراسات العلمية</div>
  <h1 style="font-size:62px;line-height:1.6">أنشأت مستشفيات فرقًا تسرع إلى المريض إذا ساءت حالته.</h1>
  <h1 class="dim" style="margin-top:12px;font-size:46px;line-height:1.8">وفي مراجعة جمعت {L('29')}&nbsp;دراسة، ارتبطت هذه الفرق بوفيات أقل. لكن في أستراليا وبلجيكا، لم تُظهر تجربتان استُعملت فيهما القرعة اختلافًا يُستبعَد أن يكون صدفةً في الوفيات غير المتوقعة وتوقف القلب.</h1>
  <p class="lead">فما الذي قد يفسّر ذلك؟ تعرض خمس دراسات نُشرت بين عامَي {L('2005')} و{L('2024')} ما يساعد على فهمه.</p>
  <div class="swipe">← اسحب للمتابعة</div>""",NAME))
ar.append(('',f"""<div class="kicker">الفكرة</div>
  <h2>ما فريق الاستجابة السريعة؟</h2>
  <p class="lead">هو فريق يستدعيه العاملون حين تظهر على المريض علامات تدهور محددة مسبقًا. ويأتي الفريق إلى المريض ليقيّم حالته ويعالجه قبل أن تسوء أكثر.</p>
  <div class="box">
    <p>ودراسة «قبل وبعد» تقارن النتائج في المكان نفسه قبل التغيير وبعده. أما التجربة العشوائية فتُوزَّع فيها المستشفيات أو المرضى على مجموعتين بالقرعة، حتى تكون المقارنة عادلة.</p>
  </div>""",C134))
ar.append(('',f"""<div class="kicker">مراجعة جمعت {L('29')}&nbsp;دراسة</div>
  <h2 style="line-height:1.8">ارتبطت الفرق بوفيات أقل، لكن أكثر الدراسات من نوع قبل وبعد</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>13%</span><p>هو انخفاض الوفيات تقريبًا لدى المرضى البالغين حيث وُجدت الفرق.</p></div>
    <div class="stat"><span class="n" {SL}>35%</span><p>هو انخفاض حالات توقف القلب تقريبًا لدى المرضى البالغين حيث وُجدت الفرق.</p></div>
  </div>
  <p class="small" style="margin-top:16px">والانخفاض نسبي: إذا مات {L('100')}&nbsp;مريض بالغ في مستشفيات بلا فرق، فالمقابل نحو {L('87')}&nbsp;بين عدد مماثل من المرضى في مستشفيات فيها فرق. ونبّه الباحثون إلى أن نتائج الدراسات اختلفت كثيرًا.</p>""",C3))
ar.append(('',f"""<div class="kicker">التجربة الأسترالية</div>
  <h2 style="line-height:1.8">قسّم الباحثون {L('23')}&nbsp;مستشفى بالقرعة إلى مجموعتين، وجاءت الأحداث الخطيرة متقاربة فيهما</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>5.31</span><p>هو عدد الأحداث الخطيرة لكل ألف حالة دخول في المستشفيات التي أنشأت الفرق، وكان {L('5.86')} في التي لم تنشئها.</p></div>
  </div>
  <p class="small" style="margin-top:16px">والأحداث الخطيرة هنا ثلاثة جُمعت في مقياس واحد: توقف القلب، والوفاة غير المتوقعة، والنقل غير المخطط له إلى العناية المركزة. ولم يكن الاختلاف مثبتًا إحصائيًّا، أي قد يكون جاء بالصدفة. وتابع الباحثون النتائج ستة أشهر فقط.</p>""",C1))
ar.append(('',f"""<div class="kicker">التجربة البلجيكية</div>
  <h2 style="line-height:1.8">في نحو {L('70')}&nbsp;ألف حالة دخول، لم يظهر بعد إدخال النظام اختلاف يُستبعَد أن يكون صدفةً</h2>
  <p class="lead" style="margin-top:18px">أدخل الباحثون نظامًا موحّدًا لمراقبة المرضى والاستجابة حين تسوء حالتهم. وبدأ النظام على مراحل، في مواعيد حدّدتها القرعة، في {L('28')}&nbsp;قسمًا داخل {L('7')}&nbsp;مستشفيات.</p>
  <div class="box">
    <p>ولم يظهر ذلك في الوفيات غير المتوقعة، ولا في توقف القلب، ولا في النقل غير المخطط له إلى العناية المركزة. وكانت الوفيات غير المتوقعة وحالات توقف القلب في بداية التجربة أقل مما توقع الباحثون، فضعفت قدرة الدراسة على كشف أي اختلاف.</p>
  </div>""",C2))
ar.append(('amber',f"""<div class="kicker">لماذا لا يُستدعى الفريق دائمًا؟</div>
  <div class="stat" style="margin-top:14px"><span class="n" {SL}>30%</span><p>هي نسبة المرضى الذين استُدعي إليهم الفريق، من بين مرضى ظهرت عليهم علامات التدهور المحددة لاستدعائه ثم نُقلوا إلى العناية المركزة، في المستشفيات الأسترالية التي أنشأت الفرق.</p></div>
  <p class="small" style="margin-top:14px">وفي مراجعة جمعت {L('25')}&nbsp;دراسة أمريكية عن فرق يقودها ممرضون:</p>
  <ul class="clean">
    <li {LI}>ساعد على الاستدعاء أن يرى الممرضون فائدة الفريق، وأن يعرفوا متى يستدعونه.</li>
    <li {LI}>وأعاقه القلق من الفريق، والحيرة: هل حالة المريض تستدعيه أم لا؟</li>
  </ul>""",C15))
ar.append(('dark',f"""<div class="kicker">ما يستنتجه الكاتب من الدراسات</div>
  <h2>ما الذي يستطيع القائد فعله؟</h2>
  <ul class="clean">
    <li><span class="num">1</span>يكتب علامات الاستدعاء بوضوح، ويدرّب العاملين عليها.</li>
    <li><span class="num">2</span>ويتابع المرات التي ظهرت فيها العلامات ولم يُستدعَ الفريق.</li>
    <li><span class="num">3</span>ويُظهر دعم الإدارة والأطباء للفريق، ويعالج مخاوف العاملين من استدعائه.</li>
  </ul>
  <p class="small" style="margin-top:10px">هذه ثلاث من ست خطوات في المقال، استنتجها الكاتب من الدراسات، ولم تختبر أي دراسة أثرها مجتمعةً.</p>
  <div class="q" style="font-size:32px;margin-top:20px;padding:22px 32px">بعد ثلاث سنوات، أتريد أن يبقى فريق الاستجابة في مؤسستك رقم هاتف يتردد الناس في طلبه، أم تريد أن يعرف كل موظف متى يطلب المساعدة، وأن يطلبها دون خوف؟</div>""",NAME))
ar.append(('',f"""<div class="kicker">المصادر وحدود الدليل</div>
  <h2 style="font-size:46px">حدود هذه الأدلة</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">أكثر الدراسات في مراجعة الـ{L('29')}&nbsp;دراسة، وفي مراجعة أخرى جمعت {L('61')}&nbsp;دراسة عام {L('2024')}، من نوع قبل وبعد، ولا تثبت أن الفرق هي سبب التحسن.</li>
    <li style="font-size:22px;padding:6px 0">وضمّت التجربة البلجيكية {L('14')}&nbsp;مستشفى، لكن التحليل النهائي لم يشمل إلا {L('7')}&nbsp;منها.</li>
    <li style="font-size:22px;padding:6px 0">ولا تذكر الملخصات المنشورة للدراسات الخمس أي مستشفى عربي، ولم تختبر أيٌّ منها الفكرة خارج المستشفيات.</li>
  </ul>
  <p class="small" style="margin-top:6px;font-size:18px;line-height:1.5"><b>تنويه تحريري:</b> الآراء والتحليلات الواردة في هذا المقال تمثل رأي الكاتب وتحليله المهني استنادًا إلى المصادر المشار إليها، ولا تمثل بالضرورة المواقف الرسمية للجهات المذكورة. وللاطلاع على المعلومات والمراجع الأصلية والكاملة والأحدث، يُرجى الرجوع مباشرة إلى المصادر الأصلية والوثائق الرسمية الواردة في قائمة المراجع.</p>
  {REFS}
  <p class="small" style="margin-top:6px;font-size:21px"><b>المقال الكامل:</b> <span class="ltr">tamayuz10x.com/{SLUG}.html</span></p>
  <div class="end-logo" style="margin-bottom:2px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>د. علاء محمد أحمد · التميّز التشغيلي</span>'))
en=[]
en.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">Operational Excellence · What the research says</div>
  <h1 style="font-size:64px">Many hospitals created teams that rush to a patient whose condition gets worse.</h1>
  <h1 class="dim" style="margin-top:16px;font-size:46px">A review of 29 studies linked these teams to fewer deaths than in periods or hospitals without them. But two trials that used chance to decide which hospitals or wards started first found no statistically significant difference in their main outcomes between care with and without the new approach.</h1>
  <p class="lead">What might explain the gap? Here is what five studies, published from 2005 to 2024, show.</p>
  <div class="swipe">Swipe →</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">The idea</div>
  <h2>What is a rapid response team?</h2>
  <p class="lead">A team that staff call when a patient shows specific warning signs. The team comes to the patient to assess and treat them before their condition gets worse.</p>
  <div class="box"><p>A before-and-after study compares results in the same place before and after a change. In a randomized trial, chance decides which hospitals or patients go into each group, so that the comparison is fair.</p></div>""",C134))
en.append(('',f"""<div class="kicker">A review of 29 studies</div>
  <h2>Teams were linked to fewer deaths, but most studies only compared before and after</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>13%</span><p>fewer deaths among adult patients, roughly, than in periods or hospitals without a team.</p></div>
    <div class="stat"><span class="n" {SL}>35%</span><p>fewer cardiac arrests among adult patients, roughly, than in periods or hospitals without a team.</p></div>
  </div>
  <p class="small" style="margin-top:16px">These are relative reductions: for every 100 adult deaths without a team, there were about 87 among a similar number of patients with one. The authors noted that results varied widely between studies.</p>""",C3))
en.append(('',f"""<div class="kicker">The Australian trial</div>
  <h2>In 23 hospitals assigned by chance, the main results were similar in both groups</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>5.31</span><p>serious events per 1,000 admissions in hospitals with teams, compared with 5.86 in hospitals without them.</p></div>
  </div>
  <p class="small" style="margin-top:16px">The measure combined three events: cardiac arrest, unexpected death, and unplanned admission to intensive care. The difference was not statistically significant, so it may have been due to chance. Results were followed for only six months.</p>""",C1))
en.append(('',f"""<div class="kicker">The Belgian trial</div>
  <h2>Across about 70,000 admissions, no statistically significant difference between periods with and without the new system</h2>
  <p class="lead" style="margin-top:18px">Researchers introduced a standard system for monitoring patients and responding when they got worse. It started in stages, at times set by chance. Data came from 28 wards in 7 hospitals.</p>
  <div class="box"><p>There was no statistically significant difference in unexpected deaths, cardiac arrests, or unplanned admissions to intensive care. Unexpected deaths and cardiac arrests were less common at the start than expected, which made any difference harder to detect.</p></div>""",C2))
en.append(('amber',f"""<div class="kicker">Why is the team not always called?</div>
  <div class="stat" style="margin-top:14px"><span class="n" {SL}>30%</span><p>In the Australian hospitals with teams, the team was called for only 30% of patients who met the calling criteria and were later admitted to intensive care.</p></div>
  <p class="small" style="margin-top:14px">A review of 25 U.S. studies of nurse-led teams found:</p>
  <ul class="clean">
    <li {LI}>Calls were more likely when nurses saw the team's value and knew when to call.</li>
    <li {LI}>Calls were less likely when nurses had worries about the team or were unsure whether a patient was sick enough.</li>
  </ul>""",C15))
en.append(('dark',f"""<div class="kicker">The author's reading of the studies</div>
  <h2>What can leaders do?</h2>
  <ul class="clean">
    <li style="font-size:33px"><span class="num">1</span>Write the calling criteria clearly, and train staff on them.</li>
    <li style="font-size:33px"><span class="num">2</span>Track the times the criteria were met but the team was not called.</li>
    <li style="font-size:33px"><span class="num">3</span>Show that management and doctors support the team, and address staff concerns about calling it.</li>
  </ul>
  <p class="small" style="margin-top:10px">These are three of the six steps in the article. The author inferred them from the studies, and no study tested their combined effect.</p>
  <div class="q" style="font-size:32px;margin-top:20px;padding:22px 32px">Three years from now, will your response team still be a phone number that people hesitate to call? Or will every staff member know when to ask for help, and ask without fear?</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">Sources and limits</div>
  <h2 style="font-size:48px">What this evidence can and cannot tell us</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">Most studies in the first two reviews were before-and-after studies, which cannot show that the teams caused the improvement.</li>
    <li style="font-size:22px;padding:6px 0">The Belgian trial included 14 hospitals, but the final analysis covered only 7.</li>
    <li style="font-size:22px;padding:6px 0">The published abstracts of the five studies do not mention any Arab hospital, and none of the studies tested the idea outside hospitals.</li>
  </ul>
  <p class="small" style="margin-top:6px;font-size:18px;line-height:1.5"><b>Editorial disclaimer:</b> The views and analyses presented in this article represent the author’s professional interpretation based on the cited sources and do not necessarily represent the official positions of the organizations mentioned. For the original, complete and most current information, please consult the primary sources and official documents listed in the references.</p>
  {REFS}
  <p class="small" style="margin-top:6px;font-size:21px"><b>Full article:</b> tamayuz10x.com/en/{SLUG}.html</p>
  <div class="end-logo" style="margin-bottom:2px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>Dr. Alaa Mohammad Ahmed · Operational Excellence</span>'))
AR_CSS = ''':root{--serif:'Amiri',serif;--sans:'IBM Plex Sans Arabic',sans-serif}
.kicker{letter-spacing:0;text-transform:none;font-size:28px}
h1{font-size:88px;line-height:1.35}
h2{font-size:68px;line-height:1.4}
p,li{line-height:1.7}
.stat .n{direction:ltr;text-align:right}'''
EN_CSS = ''':root{--serif:'Source Serif 4',Georgia,serif;--sans:'Inter',Arial,sans-serif}'''
open('slides-ar.html','w').write(page('ar','ماذا حدث حين أنشأت مستشفيات فرقًا تسرع إلى المريض إذا ساءت حالته؟','family=Amiri:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600',AR_CSS,ar))
open('slides-en.html','w').write(page('en','What Happened When Hospitals Created Rapid Response Teams?','family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;600',EN_CSS,en))
