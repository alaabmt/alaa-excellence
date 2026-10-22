# Builds slides-ar.html and slides-en.html for post 004. Edit, then: python3 build.py && node render.js <folder> ar,en
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


SLUG = 'article-oe-evidence-defaults-shape-practice'
C1 = '<span class="ltr">Courtright et al., JAMA, 2024</span>'
C2 = '<span class="ltr">Richter et al., JAMA Intern Med, 2023</span>'
C34 = '<span class="ltr">Zhang, Ann Surg 2025 · Kerlin, Implement Sci 2026</span>'
NAME = '<span>د. علاء محمد أحمد</span>'
EN_NAME = '<span>Dr. Alaa Mohamed Ahmed</span>'
R = 'class="ref ltr" style="font-size:18px;margin-top:4px;line-height:1.4"'
REFS = f"""<p {R}><b>[1]</b> Courtright, K. R., et al. (2024). Default Palliative Care Consultation for Seriously Ill Hospitalized Patients. <i>JAMA</i>, 331(3), 224–232.</p>
  <p {R}><b>[2]</b> Richter, K. P., et al. (2023). The Effects of Opt-out vs Opt-in Tobacco Treatment on Engagement, Cessation, and Costs. <i>JAMA Internal Medicine</i>, 183(4), 331–339.</p>
  <p {R}><b>[3]</b> Zhang, I. Y., et al. (2025). Prescription Default Nudges for Opioid Reduction after Major Surgery (NORMS). <i>Annals of Surgery</i>.</p>
  <p {R}><b>[4]</b> Kerlin, M. P., et al. (2026). Nudging implementation of low tidal volume ventilation. <i>Implementation Science</i>, 21(1), 40.</p>"""
ST = 'style="border-color:#2E4468"'
SN = 'style="color:var(--amber);font-size:96px;min-width:300px"'
ar=[]
ar.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">التميّز التشغيلي · من الدراسات العلمية</div>
  <h1 style="font-size:74px">حين صار الإجراء الصحيح هو الخيار الجاهز في النظام، فعله عدد أكبر من الناس.</h1>
  <h1 class="dim" style="margin-top:12px;font-size:62px;line-height:1.45">أما النتائج فلم تتغيّر دائمًا.</h1>
  <p class="lead">هذا ما تقوله أربع تجارب عشوائية نُشرت بين عامي <span class="ltr">2023</span> و<span class="ltr">2026</span>، وكلها في الرعاية الصحية.</p>
  <div class="swipe">← اسحب للمتابعة</div>""",NAME))
ar.append(('',f"""<div class="kicker">التجربة الأولى</div>
  <h2>ماذا تغيّر في أحد عشر مستشفى؟</h2>
  <p class="lead">في الرعاية المعتادة، لا يحصل المريض على استشارة الرعاية التلطيفية إلا إذا تذكّرها الطبيب وطلبها.</p>
  <div class="box">
    <p>ثم صار طلبها يُسجَّل تلقائيًا لكل مريض في الخامسة والستين فأكثر مصاب بانسداد رئوي مزمن متقدم أو خرف أو فشل كلوي، وبقي للطبيب أن يلغيه. ولم يزد عدد العاملين في الرعاية التلطيفية.</p>
  </div>
  <p class="small" style="margin-top:30px">الرعاية التلطيفية رعاية تخفّف الأعراض، وتساعد المريض وأسرته على اتخاذ قرارات العلاج في المرض الشديد.</p>""",C1))
ar.append(('',f"""<div class="kicker">النتائج</div>
  <h2>ارتفعت الاستشارات، وبقيت مدة البقاء كما هي</h2>
  <div style="margin-top:26px">
    <div class="stat"><span class="n" style="font-size:96px;min-width:300px">43.9%</span><p>من المرضى حصلوا على الاستشارة حين صارت تلقائية، مقابل <span class="ltr">16.6%</span> في الرعاية المعتادة.</p></div>
    <div class="stat"><span class="n" style="font-size:96px;min-width:300px">3.4</span><p>أيام بعد الدخول في المتوسط جاءت فيها الاستشارة، بدل <span class="ltr">4.6</span> أيام.</p></div>
  </div>
  <p class="lead" style="font-size:32px">لكن مدة البقاء في المستشفى، وهي الهدف الأول للدراسة، لم تتغيّر. وقد شمل التحليل <span class="ltr">24,065</span> مريضًا.</p>""",C1))
ar.append(('',f"""<div class="kicker">التجربة الثانية</div>
  <h2>علاج يبدأ للجميع، ولكلٍّ أن يرفضه</h2>
  <p class="lead" style="font-size:32px">في مستشفى جامعي أمريكي، وُزّع <span class="ltr">1000</span> مريض مدخّن على طريقتين: علاج لا يُقدَّم إلا لمن يطلبه، وعلاج يبدأ تلقائيًا ومن شاء رفضه.</p>
  <div style="margin-top:14px">
    <div class="stat"><span class="n" style="font-size:96px;min-width:300px">60%</span><p>استخدموا دواء الإقلاع بعد الخروج حين بدأ العلاج تلقائيًا، مقابل <span class="ltr">34%</span>.</p></div>
    <div class="stat"><span class="n" style="font-size:96px;min-width:300px">89%</span><p>أكملوا مكالمة إرشاد واحدة على الأقل، مقابل <span class="ltr">37%</span>.</p></div>
  </div>
  <p class="lead" style="font-size:30px">وبعد شهر أقلع <span class="ltr">22%</span> مقابل <span class="ltr">16%</span>، ثم تقارب الفريقان بعد ستة أشهر: <span class="ltr">19%</span> مقابل <span class="ltr">18%</span>.</p>""",C2))
ar.append(('amber',f"""<div class="kicker">لماذا يحدث ذلك؟</div>
  <h2 style="margin-top:20px">الخيار الجاهز لا يكلّف صاحبه شيئًا، أما الخروج عليه فيحتاج إلى قرار</h2>
  <p class="lead" style="font-size:38px">وكثير من الناس يقرؤون الخيار الجاهز توصيةً ضمنية ممن صمّم النظام.</p>
  <p class="lead" style="font-size:40px;margin-top:40px"><b>ومعنى ذلك أن من يصمّم النموذج أو قائمة الطلبات يقرّر، وإن لم يقصد، ما سيفعله أكثر من يستخدمونها.</b></p>
  <p class="small" style="margin-top:30px">هذا تفسير من الكاتب، لا نتيجة قاستها التجربتان.</p>""",NAME))
ar.append(('dark',f"""<div class="kicker">ولا ينجح الخيار الجاهز دائمًا</div>
  <h2 style="font-size:58px">الخيار الذي يمكن تجاوزه قد يتجاوزه أكثر الناس</h2>
  <div style="margin-top:20px">
    <div class="stat" {ST}><span class="n" {SN}>21%</span><p>فقط من مرضى الجراحة حصلوا على الوصفة الجاهزة للمسكّن، وكتب الجراحون للباقين وصفاتهم بأنفسهم، فلم تتغيّر الكمية الإجمالية.</p></div>
    <div class="stat" {ST}><span class="n" {SN}>12</span><p>وحدة عناية مركزة جرّبت إعدادًا جاهزًا لجهاز التنفس، فلم يرتفع الالتزام ارتفاعًا يُعتدّ به، وتفاوت الأثر بين الوحدات.</p></div>
  </div>""",C34))
ar.append(('dark',f"""<div class="kicker">مستخلص من الدراسات</div>
  <h2>ما الذي يستطيع القائد فعله؟</h2>
  <ul class="clean">
    <li><span class="num">1</span>أن يسأل: ما الذي يحدث تلقائيًا في نماذجنا وأنظمتنا إذا لم يختر أحد شيئًا؟</li>
    <li><span class="num">2</span>أن يجعل الإجراء الموصى به هو الخيار الجاهز، ويضعه في الطريق الذي يسلكه الناس فعلًا، مع إبقاء الرفض سهلًا.</li>
    <li><span class="num">3</span>أن يقيس أمرين: هل استُخدم الخيار الجاهز، وهل تغيّرت النتيجة.</li>
  </ul>
  <div class="q" style="font-size:40px;margin-top:28px;padding:26px 34px">أيّ خيار جاهز في أنظمتك يقرّر اليوم ما يفعله فريقك، دون أن ينتبه إليه أحد؟</div>""",NAME))
ar.append(('',f"""<div class="kicker">المصادر وحدود الدليل</div>
  <h2 style="font-size:50px">حدود هذه الأدلة</h2>
  <ul class="clean" style="margin-top:4px">
    <li style="font-size:25px;padding:9px 0">التجارب الأربع كلها في الرعاية الصحية، واثنتان منها في مستشفى أو مركز واحد.</li>
    <li style="font-size:25px;padding:9px 0">بيانات تجربة الرعاية التلطيفية جُمعت بين عامي <span class="ltr">2016</span> و<span class="ltr">2018</span>.</li>
    <li style="font-size:25px;padding:9px 0">لم تشمل أيٌّ منها مؤسسات عربية، وتعميم الفكرة على قطاعات أخرى استنتاج.</li>
  </ul>
  <p class="small" style="margin-top:8px;font-size:20px;line-height:1.55"><b>تنويه تحريري:</b> الآراء والتحليلات الواردة في هذا المقال تمثل رأي الكاتب وتحليله المهني استنادًا إلى المصادر المشار إليها، ولا تمثل بالضرورة المواقف الرسمية للجهات المذكورة. وللاطلاع على المعلومات والمراجع الأصلية والكاملة والأحدث، يُرجى الرجوع مباشرة إلى المصادر الأصلية والوثائق الرسمية الواردة في قائمة المراجع.</p>
  {REFS}
  <p class="small" style="margin-top:8px;font-size:23px"><b>المقال الكامل:</b> <span class="ltr">tamayuz10x.com/{SLUG}.html</span></p>
  <div class="end-logo" style="margin-bottom:4px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>د. علاء محمد أحمد · التميّز التشغيلي</span>'))
en=[]
en.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">Operational Excellence · What the research says</div>
  <h1 style="font-size:80px">When the right action became the default, more people did it.</h1>
  <h1 class="dim" style="margin-top:16px;font-size:68px">The results didn't always follow.</h1>
  <p class="lead">That is what four randomized trials published from 2023 to 2026 show. All of them come from health care.</p>
  <div class="swipe">Swipe →</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">Trial one</div>
  <h2>What changed in 11 hospitals?</h2>
  <p class="lead">Under usual care, a patient got a palliative care consult only if a doctor remembered to order one.</p>
  <div class="box"><p>Then the consult was ordered automatically for every patient aged 65 or older with advanced chronic lung disease (COPD), dementia, or kidney failure. Doctors could cancel it. Palliative care staffing did not increase.</p></div>
  <p class="small" style="margin-top:30px">Palliative care relieves symptoms and helps patients and families make treatment decisions during serious illness.</p>""",C1))
en.append(('',f"""<div class="kicker">Findings</div>
  <h2>More consults. Same length of stay.</h2>
  <div style="margin-top:26px">
    <div class="stat"><span class="n" style="font-size:96px;min-width:300px">43.9%</span><p>of patients got a consult when it was ordered by default, compared with 16.6% under usual care.</p></div>
    <div class="stat"><span class="n" style="font-size:96px;min-width:300px">3.4</span><p>days after admission, on average, the consult came, instead of 4.6 days.</p></div>
  </div>
  <p class="lead" style="font-size:32px">But length of stay, the study's primary goal, did not change. The analysis included 24,065 patients.</p>""",C1))
en.append(('',f"""<div class="kicker">Trial two</div>
  <h2>Treatment for everyone, unless they say no</h2>
  <p class="lead" style="font-size:29px">At a U.S. academic hospital, 1,000 inpatients who smoked were randomly assigned to treatment only for those who asked, or treatment that started automatically and could be declined.</p>
  <div style="margin-top:14px">
    <div class="stat"><span class="n" style="font-size:96px;min-width:300px">60%</span><p>used quit-smoking medication after discharge when treatment started automatically, compared with 34%.</p></div>
    <div class="stat"><span class="n" style="font-size:96px;min-width:300px">89%</span><p>completed at least one counseling call, compared with 37%.</p></div>
  </div>
  <p class="lead" style="font-size:27px">After one month, 22% had quit, compared with 16%. By six months, the groups were close: 19% and 18%.</p>""",C2))
en.append(('amber',f"""<div class="kicker">Why does this happen?</div>
  <h2 style="margin-top:20px">Accepting a default costs nothing. Leaving it takes a decision.</h2>
  <p class="lead" style="font-size:38px">Many people also read a default as a quiet recommendation from whoever built the system.</p>
  <p class="lead" style="font-size:40px;margin-top:40px"><b>So the person who designs a form or an order set decides, often without meaning to, what most users will do.</b></p>
  <p class="small" style="margin-top:30px">This is the author's interpretation, not something the trials measured.</p>""",EN_NAME))
en.append(('dark',f"""<div class="kicker">Defaults don't always work</div>
  <h2 style="font-size:60px">If people can skip a default, many will</h2>
  <div style="margin-top:20px">
    <div class="stat" {ST}><span class="n" {SN}>21%</span><p>of surgical patients got the pre-filled pain prescription. Surgeons typed the rest by hand, so the total amount did not change.</p></div>
    <div class="stat" {ST}><span class="n" {SN}>12</span><p>ICUs tested a pre-set ventilator order. Adherence did not rise significantly, and results varied from unit to unit.</p></div>
  </div>""",C34))
en.append(('dark',f"""<div class="kicker">What the studies suggest</div>
  <h2>What can leaders do?</h2>
  <ul class="clean">
    <li style="font-size:33px"><span class="num">1</span>Ask what happens automatically in your forms and systems when nobody chooses anything.</li>
    <li style="font-size:33px"><span class="num">2</span>Make the recommended action the default, put it where people actually work, and keep saying no easy.</li>
    <li style="font-size:33px"><span class="num">3</span>Measure two things: was the default used, and did the outcome change?</li>
  </ul>
  <div class="q" style="font-size:38px;margin-top:24px;padding:22px 32px">Which default in your systems decides what your team does today, without anyone noticing?</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">Sources and limits</div>
  <h2 style="font-size:52px">What this evidence can and cannot tell us</h2>
  <ul class="clean" style="margin-top:4px">
    <li style="font-size:25px;padding:9px 0">All four trials come from health care, and two were run in a single hospital or center.</li>
    <li style="font-size:25px;padding:9px 0">The palliative care trial used data from 2016 to 2018.</li>
    <li style="font-size:25px;padding:9px 0">None included organizations in the Arab region. Applying the idea to other sectors is an inference.</li>
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
open('slides-ar.html','w').write(page('ar','حين يصبح الصواب هو الخيار الجاهز','family=Amiri:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600',AR_CSS,ar))
open('slides-en.html','w').write(page('en','When the Right Choice Is the Default','family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;600',EN_CSS,en))
