# Builds slides-ar.html and slides-en.html for post 006. Edit, then: python3 build.py && node render.js <folder> ar,en
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


SLUG = 'article-oe-evidence-medication-interruptions'
C1 = '<span class="ltr">Schroers 2025 · Eid 2022 · Ayanaw 2025</span>'
C2 = '<span class="ltr">Berdot et al., BMC Nurs, 2021</span>'
C3 = '<span class="ltr">Zhang et al., Worldviews Evid Based Nurs, 2025</span>'
NAME = '<span>د. علاء محمد أحمد</span>'
EN_NAME = '<span>Dr. Alaa Mohamed Ahmed</span>'
R = 'class="ref ltr" style="font-size:16px;margin-top:3px;line-height:1.35"'
REFS = f"""<p {R}><b>[1]</b> Schroers, G., et al. (2025). Associations between interruptions and medication administration errors among nurses in hospital settings. <i>J Adv Nurs</i>, 82, 2551–2569.</p>
  <p {R}><b>[2]</b> Eid, T., et al. (2022). Interruptions during medication work in a Saudi Arabian hospital. <i>J Nurs Scholarsh</i>, 54(5), 639–647.</p>
  <p {R}><b>[3]</b> Ayanaw, M., et al. (2025). How do interruptions and distractions affect pharmacy practice? <i>Res Social Adm Pharm</i>, 21(9), 667–678.</p>
  <p {R}><b>[4]</b> Berdot, S., et al. (2021). Effectiveness of a ‘do not interrupt’ vest intervention to reduce medication errors. <i>BMC Nursing</i>, 20, 153.</p>
  <p {R}><b>[5]</b> Zhang, W., et al. (2025). Effectiveness of interventions for reducing interruptions during medication administration. <i>Worldviews Evid Based Nurs</i>, 22(4), e70067.</p>"""
ST = 'style="border-color:#2E4468"'
SN = 'style="color:var(--amber);font-size:90px;min-width:300px"'
SL = 'style="font-size:90px;min-width:300px"'
ar=[]
ar.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">التميّز التشغيلي · من الدراسات العلمية</div>
  <h1 style="font-size:70px">جرّبت مستشفيات سترة «لا تقاطعني» لتحمي الممرضين في أثناء إعطاء الأدوية.</h1>
  <h1 class="dim" style="margin-top:12px;font-size:58px;line-height:1.45">لكن تجربة عشوائية لم تجد أنها خفّضت الأخطاء.</h1>
  <p class="lead">هذا ما تقوله خمس دراسات نُشرت بين عامي <span class="ltr">2021</span> و<span class="ltr">2025</span>.</p>
  <div class="swipe">← اسحب للمتابعة</div>""",NAME))
ar.append(('',f"""<div class="kicker">جولة الأدوية</div>
  <h2>ماذا يحدث في أثناء جولة الأدوية؟</h2>
  <p class="lead">يُقاطَع الممرضون مرات كثيرة: زميل يسأل، أو طبيب يطلب شيئًا، أو مستلزم مفقود يجب البحث عنه.</p>
  <div class="box">
    <p>وفي مراجعة جمعت نتائج <span class="ltr">22</span> دراسة، وجدت <span class="ltr">16</span> دراسة منها ارتباطًا يُعتدّ به بين المقاطعة وزيادة أخطاء إعطاء الدواء.</p>
  </div>
  <p class="small" style="margin-top:28px">اختلفت الدراسات في تعريف المقاطعة والخطأ، والارتباط لا يثبت وحده أن المقاطعة هي السبب.</p>""",'<span class="ltr">Schroers et al., J Adv Nurs, 2025</span>'))
ar.append(('',f"""<div class="kicker">من أين تأتي المقاطعة؟</div>
  <h2>من الزملاء، ونقص المستلزمات، والهاتف</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>182</span><p>مقاطعة رصدها باحثون في <span class="ltr">15</span> جولة أدوية بمستشفى سعودي، وكان الممرضون والأطباء والعوائق أكثر مصادرها.</p></div>
    <div class="stat"><span class="n" {SL}>+20</span><p>مقاطعة في الساعة يصل إليها الصيادلة في بعض الدراسات، أكثرها من الهاتف وأسئلة المرضى.</p></div>
  </div>
  <p class="lead" style="font-size:30px">ولا يقتصر الأمر على التمريض.</p>""",C1))
ar.append(('',f"""<div class="kicker">التجربة</div>
  <h2>سترة «لا تقاطعني» في أربعة مستشفيات فرنسية</h2>
  <p class="lead">لبس الممرضون السترة في جولات الأدوية، ووُضعت لافتة عند مدخل الوحدة تشرح الأمر للمرضى وذويهم.</p>
  <div class="box">
    <p>ووُزّعت <span class="ltr">29</span> وحدة بالقرعة: <span class="ltr">14</span> وحدة طبّقت السترة، و<span class="ltr">15</span> وحدة بقيت على العمل المعتاد. وراقب مراقبون مدرَّبون <span class="ltr">383</span> جولة أدوية.</p>
  </div>""",C2))
ar.append(('',f"""<div class="kicker">النتائج</div>
  <h2>لم تقلّ الأخطاء، ولم تؤثر السترة في المقاطعة</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>7.09%</span><p>من الجرعات وقع فيها خطأ في الوحدات التي طُبّقت فيها السترة، مقابل <span class="ltr">6.23%</span> في الوحدات الأخرى.</p></div>
    <div class="stat"><span class="n" {SL}>15.04%</span><p>من الجرعات قُطع العمل فيها، بعد أن كانت <span class="ltr">13.4%</span> قبل التجربة. وفي الوحدات الأخرى انخفضت من <span class="ltr">23.78%</span> إلى <span class="ltr">20.75%</span>.</p></div>
  </div>
  <p class="lead" style="font-size:30px">وخلص الباحثون إلى أن السترة لم تؤثر في الأخطاء ولا في معدل المقاطعة.</p>""",C2))
ar.append(('amber',f"""<div class="kicker">لماذا لم تنجح السترة؟</div>
  <h2 style="margin-top:20px">بقيت مقاطعة الزملاء شائعة</h2>
  <p class="lead" style="font-size:36px">ففي مراجعة لـ <span class="ltr">14</span> دراسة، بقيت مقاطعة الممرضين بعضهم بعضًا شائعة حتى مع السترات والحملات، وبقي أثر هذه الحلول في الأخطاء غير محسوم.</p>
  <p class="lead" style="font-size:38px;margin-top:36px"><b>فالسترة تخاطب مصدرًا واحدًا، وكثير من المقاطعات عرَض لنظام لا يوفّر المستلزم أو المعلومة في وقتها.</b></p>
  <p class="small" style="margin-top:28px">الجملة الأخيرة تفسير من الكاتب استنادًا إلى هذه الدراسات، لا نتيجة قاستها.</p>""",C3))
ar.append(('dark',f"""<div class="kicker">مستخلص من الدراسات</div>
  <h2>ما الذي يستطيع القائد فعله؟</h2>
  <ul class="clean">
    <li><span class="num">1</span>يبدأ بالقياس، فيسأل: من يقاطع؟ ومتى؟ ولماذا؟</li>
    <li><span class="num">2</span>ويزيل أسباب المقاطعة من مصدرها، فيضع المستلزمات في مكانها، ويحوّل الأسئلة إلى زميل لا يعطي الدواء.</li>
    <li><span class="num">3</span>ويقيس الأخطاء نفسها، لا عدد من لبسوا السترة.</li>
  </ul>
  <div class="q" style="font-size:38px;margin-top:24px;padding:24px 32px">أيّ عمل دقيق في مؤسستك يُقاطَع أكثر من غيره، ومن أين تأتي مقاطعاته؟</div>""",NAME))
ar.append(('',f"""<div class="kicker">المصادر وحدود الدليل</div>
  <h2 style="font-size:46px">حدود هذه الأدلة</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">جُمعت بيانات التجربة الفرنسية عام <span class="ltr">2017</span>، واختبرت السترة واللافتة فقط.</li>
    <li style="font-size:22px;padding:6px 0">اختلفت تعريفات الدراسات في المراجعات، فلم تُجمع نتائجها في تحليل واحد.</li>
    <li style="font-size:22px;padding:6px 0">شملت الدراسات مستشفى عربيًا واحدًا، وتعميمها على قطاعات أخرى استنتاج.</li>
  </ul>
  <p class="small" style="margin-top:6px;font-size:18px;line-height:1.5"><b>تنويه تحريري:</b> الآراء والتحليلات الواردة في هذا المقال تمثل رأي الكاتب وتحليله المهني استنادًا إلى المصادر المشار إليها، ولا تمثل بالضرورة المواقف الرسمية للجهات المذكورة. وللاطلاع على المعلومات والمراجع الأصلية والكاملة والأحدث، يُرجى الرجوع مباشرة إلى المصادر الأصلية والوثائق الرسمية الواردة في قائمة المراجع.</p>
  {REFS}
  <p class="small" style="margin-top:6px;font-size:21px"><b>المقال الكامل:</b> <span class="ltr">tamayuz10x.com/{SLUG}.html</span></p>
  <div class="end-logo" style="margin-bottom:2px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>د. علاء محمد أحمد · التميّز التشغيلي</span>'))
en=[]
en.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">Operational Excellence · What the research says</div>
  <h1 style="font-size:72px">Hospitals tried a “Do not interrupt” vest to protect nurses giving medications.</h1>
  <h1 class="dim" style="margin-top:16px;font-size:60px">A randomized trial found no evidence that it reduced errors.</h1>
  <p class="lead">That is what five studies, published from 2021 to 2025, show.</p>
  <div class="swipe">Swipe →</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">The medication round</div>
  <h2>What happens during a medication round?</h2>
  <p class="lead">Nurses are interrupted again and again: a colleague has a question, a doctor needs something, or a missing item has to be found.</p>
  <div class="box"><p>In a review of 22 studies, 16 found a significant link between interruptions and more medication administration errors.</p></div>
  <p class="small" style="margin-top:28px">The studies defined interruptions and errors in different ways, and a link alone does not prove that interruptions cause errors.</p>""",'<span class="ltr">Schroers et al., J Adv Nurs, 2025</span>'))
en.append(('',f"""<div class="kicker">Where do interruptions come from?</div>
  <h2>From colleagues, missing supplies, and phone calls</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>182</span><p>interruptions recorded in 15 medication rounds in a Saudi hospital. Nurses, doctors, and obstacles were the most frequent sources.</p></div>
    <div class="stat"><span class="n" {SL}>20+</span><p>interruptions an hour for pharmacists in some studies, mostly from phone calls and patient questions.</p></div>
  </div>
  <p class="lead" style="font-size:30px">The problem goes beyond nursing.</p>""",C1))
en.append(('',f"""<div class="kicker">The trial</div>
  <h2>A “Do not interrupt” vest in four French hospitals</h2>
  <p class="lead">Nurses wore the vest during medication rounds, and a poster at the unit entrance explained it to patients and families.</p>
  <div class="box"><p>Researchers randomly assigned 29 units: 14 used the vest and 15 kept their usual practice. Trained observers watched 383 medication rounds.</p></div>""",C2))
en.append(('',f"""<div class="kicker">Findings</div>
  <h2>No fewer errors, and no effect on interruptions</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>7.09%</span><p>of doses had an error on vest units, compared with 6.23% on the other units.</p></div>
    <div class="stat"><span class="n" {SL}>15.04%</span><p>of doses were interrupted on vest units, up from 13.4% before the trial. On the other units, the rate fell from 23.78% to 20.75%.</p></div>
  </div>
  <p class="lead" style="font-size:30px">The researchers concluded that the vest had no impact on errors or on interruption rates.</p>""",C2))
en.append(('amber',f"""<div class="kicker">Why did the vest not work?</div>
  <h2 style="margin-top:20px">Nurse-to-nurse interruptions stayed common</h2>
  <p class="lead" style="font-size:36px">In a review of 14 studies, nurses interrupting other nurses stayed common even with vests and campaigns, and the effect of these measures on errors remained unclear.</p>
  <p class="lead" style="font-size:38px;margin-top:36px"><b>A vest targets only one source, and many interruptions are a symptom of a system that does not provide supplies or information on time.</b></p>
  <p class="small" style="margin-top:28px">The last sentence is the author's interpretation of these studies, not a measured result.</p>""",C3))
en.append(('dark',f"""<div class="kicker">What the studies suggest</div>
  <h2>What can leaders do?</h2>
  <ul class="clean">
    <li style="font-size:33px"><span class="num">1</span>Start by measuring: who interrupts, when, and why?</li>
    <li style="font-size:33px"><span class="num">2</span>Remove the causes at the source: put supplies in place, and send questions to a colleague who is not giving medications.</li>
    <li style="font-size:33px"><span class="num">3</span>Measure the errors themselves, not how many people wore the vest.</li>
  </ul>
  <div class="q" style="font-size:36px;margin-top:24px;padding:22px 32px">Which error-sensitive task in your organization is interrupted most often, and where do the interruptions come from?</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">Sources and limits</div>
  <h2 style="font-size:48px">What this evidence can and cannot tell us</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">The French trial collected its data in 2017 and tested only the vest and poster.</li>
    <li style="font-size:22px;padding:6px 0">The reviews drew on studies with different definitions, so results were not pooled.</li>
    <li style="font-size:22px;padding:6px 0">The studies included one Arab hospital. Applying the idea to other sectors is an inference.</li>
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
open('slides-ar.html','w').write(page('ar','سترة «لا تقاطعني» لم تخفّض الأخطاء','family=Amiri:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600',AR_CSS,ar))
open('slides-en.html','w').write(page('en','A Do-Not-Interrupt Vest Did Not Cut Errors','family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;600',EN_CSS,en))
