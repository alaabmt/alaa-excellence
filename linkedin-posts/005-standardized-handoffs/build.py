# Builds slides-ar.html and slides-en.html for post 005. Edit, then: python3 build.py && node render.js <folder> ar,en
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


SLUG = 'article-oe-evidence-standardized-handoffs'
C1 = '<span class="ltr">Starmer et al., J Hosp Med, 2023</span>'
C2 = '<span class="ltr">McCarthy et al., BMJ Qual Saf, 2025</span>'
C34 = '<span class="ltr">Rihari-Thomas 2026 · Allen-Dicker 2025</span>'
NAME = '<span>د. علاء محمد أحمد</span>'
EN_NAME = '<span>Dr. Alaa Mohamed Ahmed</span>'
R = 'class="ref ltr" style="font-size:18px;margin-top:4px;line-height:1.4"'
REFS = f"""<p {R}><b>[1]</b> Starmer, A. J., et al. (2023). Implementation of the I-PASS handoff program in diverse clinical environments. <i>Journal of Hospital Medicine</i>, 18(1), 5–14.</p>
  <p {R}><b>[2]</b> McCarthy, S., et al. (2025). Use of structured handoff protocols for within-hospital unit transitions. <i>BMJ Quality &amp; Safety</i>, 34(10), 680–690.</p>
  <p {R}><b>[3]</b> Rihari-Thomas, J., et al. (2026). ACCELERATE: a stepped-wedge cluster randomised trial. <i>International Journal of Nursing Studies</i>, 183, 105652.</p>
  <p {R}><b>[4]</b> Allen-Dicker, J., et al. (2025). Physician inpatient handoffs: a systematic review. <i>Journal of Hospital Medicine</i>, 20(6), 607–622.</p>"""
ST = 'style="border-color:#2E4468"'
SN = 'style="color:var(--amber);font-size:96px;min-width:300px"'
SL = 'style="font-size:96px;min-width:300px"'
ar=[]
ar.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">التميّز التشغيلي · من الدراسات العلمية</div>
  <h1 style="font-size:72px">حين وحّدت المستشفيات طريقة تسليم المرضى بين المناوبات، تحسّن التسليم نفسه.</h1>
  <h1 class="dim" style="margin-top:12px;font-size:60px;line-height:1.45">أما النتائج فتفاوتت من دراسة إلى أخرى.</h1>
  <p class="lead">هذا ما تقوله أربع دراسات حديثة نُشرت بين عامي <span class="ltr">2023</span> و<span class="ltr">2026</span>.</p>
  <div class="swipe">← اسحب للمتابعة</div>""",NAME))
ar.append(('',f"""<div class="kicker">لحظة التسليم</div>
  <h2>ماذا يحدث حين تنتهي المناوبة؟</h2>
  <p class="lead">يسلّم الطبيب زميله القادم ما يعرفه عن كل مريض: حالته، وما ينتظره من فحوص، وما يجب فعله إن ساءت حالته.</p>
  <div class="box">
    <p>والأخطاء في هذا التسليم من الأسباب الرئيسة للأخطاء الطبية. لذلك تعلّم الأطباء المقيمون في <span class="ltr">32</span> مستشفى أمريكيًا طريقة موحّدة للتسليم، ورافقتهم فرق تدريب <span class="ltr">18</span> شهرًا.</p>
  </div>
  <p class="small" style="margin-top:28px">تُسمّى الطريقة <span class="ltr">(I-PASS)</span>، ولها خمس خطوات: شدة حالة المريض، وملخص حالته، وقائمة المهام، وما قد يحدث وكيف يُتصرَّف إن حدث، ثم يلخّص المستلم ما سمعه بكلماته.</p>""",C1))
ar.append(('',f"""<div class="kicker">النتائج</div>
  <h2>تحسّن التسليم، وقلّت الأحداث الضارة المبلَّغ عنها</h2>
  <div style="margin-top:24px">
    <div class="stat"><span class="n" {SL}>47%</span><p>انخفاضًا في الأحداث الضارة المرتبطة بالتسليم، كما أبلغ عنها الأطباء المقيمون أنفسهم.</p></div>
    <div class="stat"><span class="n" {SL}>66%</span><p>من التسليمات الشفهية تضمّنت العناصر الخمسة كلها، بعد أن كانت <span class="ltr">20%</span>.</p></div>
    <div class="stat"><span class="n" {SL}>83%</span><p>من التسليمات لخّص فيها المستلم ما سمعه، بعد أن كانت <span class="ltr">31%</span>.</p></div>
  </div>""",C1))
ar.append(('',f"""<div class="kicker">مراجعة منهجية · <span class="ltr">2025</span></div>
  <h2>أيّ طريقة تسليم يدعمها الدليل أكثر؟</h2>
  <p class="lead" style="font-size:32px">بحثت مراجعة منهجية في أدلة السنوات العشر الأخيرة عن <span class="ltr">12</span> أداة للتسليم داخل أقسام المستشفى.</p>
  <ul class="clean">
    <li style="font-size:31px">وجدت أن طريقة <span class="ltr">(I-PASS)</span> تقلّل الأخطاء والأحداث الضارة بدرجة يقين متوسطة، استنادًا إلى عشر دراسات.</li>
    <li style="font-size:31px">وأن أداة <span class="ltr">(SBAR)</span> الأقدم قد تحسّن السلامة، لكن بدرجة يقين منخفضة.</li>
    <li style="font-size:31px">وأن الأدوات الأخرى لم تُختبر بما يكفي للحكم عليها.</li>
  </ul>""",C2))
ar.append(('amber',f"""<div class="kicker">لماذا يساعد التوحيد؟</div>
  <h2 style="margin-top:20px">تُقال المعلومة المهمة في كل مرة، وبالترتيب نفسه</h2>
  <p class="lead" style="font-size:38px">ثم يلخّص المستلم ما سمعه بكلماته، فيظهر سوء الفهم قبل أن ينصرف زميله.</p>
  <p class="lead" style="font-size:40px;margin-top:40px"><b>فتعتمد سلامة المريض أقلّ على ذاكرة من يسلّم في نهاية يوم متعب.</b></p>
  <p class="small" style="margin-top:30px">هذا تفسير من الكاتب، لا نتيجة قاستها الدراسة.</p>""",NAME))
ar.append(('dark',f"""<div class="kicker">ولا يكفي التوحيد دائمًا</div>
  <h2 style="font-size:56px">قد يتحسّن التسليم ولا يتغيّر المؤشر الرئيس</h2>
  <div style="margin-top:20px">
    <div class="stat" {ST}><span class="n" {SN}>41%</span><p>انخفاضًا في قرح الضغط في تجربة عشوائية بتسعة أجنحة أسترالية، لكن مؤشرها الرئيس لم يتغيّر.</p></div>
    <div class="stat" {ST}><span class="n" {SN}><span class="ltr">3/16</span></span><p>من الدراسات التي قاست الأحداث الضارة وجدت تحسّنًا، في مراجعة جمعت <span class="ltr">42</span> دراسة.</p></div>
  </div>
  <p class="lead" style="font-size:30px">وكانت النتائج أفضل في الغالب حين اجتمع التدريب مع تغيير طريقة العمل نفسها.</p>""",C34))
ar.append(('dark',f"""<div class="kicker">مستخلص من الدراسات</div>
  <h2>ما الذي يستطيع القائد فعله؟</h2>
  <ul class="clean">
    <li><span class="num">1</span>أن يختار طريقة تسليم مختبرة، ويطلب من المستلم أن يلخّص ما سمعه.</li>
    <li><span class="num">2</span>ألّا يكتفي بالتدريب، بل يغيّر طريقة العمل: نموذج موحّد، ووقت ومكان محددان، ومتابعة في الأشهر الأولى.</li>
    <li><span class="num">3</span>أن يقيس جودة التسليم بالملاحظة المباشرة، ويتابع النتائج مدة كافية.</li>
  </ul>
  <div class="q" style="font-size:40px;margin-top:28px;padding:26px 34px">أيّ تسليم بين فريقين في مؤسستك يعتمد اليوم على ذاكرة شخص واحد؟</div>""",NAME))
ar.append(('',f"""<div class="kicker">المصادر وحدود الدليل</div>
  <h2 style="font-size:50px">حدود هذه الأدلة</h2>
  <ul class="clean" style="margin-top:4px">
    <li style="font-size:24px;padding:8px 0">دراسة المستشفيات الاثنين والثلاثين بلا مجموعة مقارنة، وأحداثها الضارة أبلغ عنها الأطباء أنفسهم.</li>
    <li style="font-size:24px;padding:8px 0">لبعض مؤلفيها حصص في شركة تدرّب على هذه الطريقة، وتولّى التحليل فريق مستقل.</li>
    <li style="font-size:24px;padding:8px 0">لم تشمل الدراسات مستشفيات عربية، وتعميمها على قطاعات أخرى استنتاج.</li>
  </ul>
  <p class="small" style="margin-top:8px;font-size:20px;line-height:1.55"><b>تنويه تحريري:</b> الآراء والتحليلات الواردة في هذا المقال تمثل رأي الكاتب وتحليله المهني استنادًا إلى المصادر المشار إليها، ولا تمثل بالضرورة المواقف الرسمية للجهات المذكورة. وللاطلاع على المعلومات والمراجع الأصلية والكاملة والأحدث، يُرجى الرجوع مباشرة إلى المصادر الأصلية والوثائق الرسمية الواردة في قائمة المراجع.</p>
  {REFS}
  <p class="small" style="margin-top:8px;font-size:23px"><b>المقال الكامل:</b> <span class="ltr">tamayuz10x.com/{SLUG}.html</span></p>
  <div class="end-logo" style="margin-bottom:4px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>د. علاء محمد أحمد · التميّز التشغيلي</span>'))
en=[]
en.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">Operational Excellence · What the research says</div>
  <h1 style="font-size:76px">When hospitals standardized shift handoffs, the handoffs got better.</h1>
  <h1 class="dim" style="margin-top:16px;font-size:64px">The results varied from study to study.</h1>
  <p class="lead">That is what four recent studies, published from 2023 to 2026, show.</p>
  <div class="swipe">Swipe →</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">The handoff</div>
  <h2>What happens when a shift ends?</h2>
  <p class="lead">The doctor going off shift hands over what they know about each patient: how they are doing, which tests are pending, and what to do if things get worse.</p>
  <div class="box"><p>Miscommunication at this moment is a leading source of medical errors. So resident doctors in 32 U.S. hospitals learned one standard way to hand over, with 18 months of coaching.</p></div>
  <p class="small" style="margin-top:28px">The method is called I-PASS. Its five steps: Illness severity, Patient summary, Action list, Situation awareness and contingency planning, and Synthesis by the receiver.</p>""",C1))
en.append(('',f"""<div class="kicker">Findings</div>
  <h2>Better handoffs, fewer reported adverse events</h2>
  <div style="margin-top:24px">
    <div class="stat"><span class="n" {SL}>47%</span><p>drop in handoff-related adverse events, as reported by the residents themselves.</p></div>
    <div class="stat"><span class="n" {SL}>66%</span><p>of verbal handoffs covered all five key elements, up from 20%.</p></div>
    <div class="stat"><span class="n" {SL}>83%</span><p>of handoffs ended with the receiver summing up what they heard, up from 31%.</p></div>
  </div>""",C1))
en.append(('',f"""<div class="kicker">Systematic review · 2025</div>
  <h2>Which handoff tool has the best evidence?</h2>
  <p class="lead" style="font-size:32px">A systematic review looked at ten years of evidence on 12 handoff tools used within hospital units.</p>
  <ul class="clean">
    <li style="font-size:31px">I-PASS reduces errors and adverse events, with moderate certainty, based on ten studies.</li>
    <li style="font-size:31px">The older SBAR tool may improve safety, but with low certainty.</li>
    <li style="font-size:31px">The other tools have not been tested enough to judge.</li>
  </ul>""",C2))
en.append(('amber',f"""<div class="kicker">Why does a standard help?</div>
  <h2 style="margin-top:20px">The key information comes up every time, in the same order.</h2>
  <p class="lead" style="font-size:38px">Then the receiver sums up what they heard, so a misunderstanding shows up before the other person leaves.</p>
  <p class="lead" style="font-size:40px;margin-top:40px"><b>Patient safety then depends less on one person's memory at the end of a long shift.</b></p>
  <p class="small" style="margin-top:30px">This is the author's interpretation, not something the study measured.</p>""",EN_NAME))
en.append(('dark',f"""<div class="kicker">A standard is not always enough</div>
  <h2 style="font-size:58px">Handoffs can improve while the main outcome stays the same</h2>
  <div style="margin-top:20px">
    <div class="stat" {ST}><span class="n" {SN}>41%</span><p>fewer pressure injuries in a randomized trial on nine Australian wards, but the trial's main outcome did not change.</p></div>
    <div class="stat" {ST}><span class="n" {SN}>3/16</span><p>of the studies that measured adverse events found an improvement, in a review of 42 studies.</p></div>
  </div>
  <p class="lead" style="font-size:30px">Results were more often positive when training came with changes to how the work is done.</p>""",C34))
en.append(('dark',f"""<div class="kicker">What the studies suggest</div>
  <h2>What can leaders do?</h2>
  <ul class="clean">
    <li style="font-size:33px"><span class="num">1</span>Choose a tested handoff method, and ask the receiver to sum up what they heard.</li>
    <li style="font-size:33px"><span class="num">2</span>Don't stop at training. Change the work: a standard template, a set time and place, and support in the first months.</li>
    <li style="font-size:33px"><span class="num">3</span>Measure handoff quality by direct observation, and track outcomes over enough time.</li>
  </ul>
  <div class="q" style="font-size:38px;margin-top:24px;padding:22px 32px">Which handoff between two teams in your organization depends today on one person's memory?</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">Sources and limits</div>
  <h2 style="font-size:52px">What this evidence can and cannot tell us</h2>
  <ul class="clean" style="margin-top:4px">
    <li style="font-size:24px;padding:8px 0">The 32-hospital study had no control group, and adverse events were reported by the doctors themselves.</li>
    <li style="font-size:24px;padding:8px 0">Some of its authors hold equity in a company that trains hospitals in I-PASS; an independent team ran the analysis.</li>
    <li style="font-size:24px;padding:8px 0">None of the studies included Arab hospitals. Applying the idea to other sectors is an inference.</li>
  </ul>
  <p class="small" style="margin-top:8px;font-size:20px;line-height:1.55"><b>Editorial disclaimer:</b> The views and analyses presented in this article represent the author’s professional interpretation based on the cited sources and do not necessarily represent the official positions of the organizations mentioned. For the original, complete and most current information, please consult the primary sources and official documents listed in the references.</p>
  {REFS}
  <p class="small" style="margin-top:8px;font-size:23px"><b>Full article:</b> tamayuz10x.com/en/{SLUG}.html</p>
  <div class="end-logo" style="margin-bottom:4px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>Dr. Alaa Mohamed Ahmed · Operational Excellence</span>'))
AR_CSS = ''':root{--serif:'Amiri',serif;--sans:'IBM Plex Sans Arabic',sans-serif}
.kicker{letter-spacing:0;text-transform:none;font-size:28px}
h1{font-size:88px;line-height:1.35}
h2{font-size:68px;line-height:1.4}
p,li{line-height:1.7}
.stat .n{direction:ltr;text-align:right}'''
EN_CSS = ''':root{--serif:'Source Serif 4',Georgia,serif;--sans:'Inter',Arial,sans-serif}'''
open('slides-ar.html','w').write(page('ar','حين يكون التسليم واحدًا للجميع','family=Amiri:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600',AR_CSS,ar))
open('slides-en.html','w').write(page('en','When Every Shift Hands Over the Same Way','family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;600',EN_CSS,en))
