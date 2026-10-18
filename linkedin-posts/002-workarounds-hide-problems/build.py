# Builds slides-ar.html and slides-en.html for post 002. Edit, then: python3 build.py && node render.js <folder> ar,en
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

SLUG = 'article-oe-evidence-workarounds-hide-problems'
SRC = '<span class="ltr">Tucker &amp; Edmondson, CMR, 2003</span>'
VAN = '<span class="ltr">Vanbelleghem et al., J Adv Nurs, 2026</span>'
NAME = '<span>د. علاء محمد أحمد</span>'
EN_NAME = '<span>Dr. Alaa Mohamed Ahmed</span>'
REFS = """<p class="ref ltr" style="font-size:19px;margin-top:8px"><b>[1]</b> Tucker, A. L., &amp; Edmondson, A. C. (2003). Why Hospitals Don't Learn from Failures. <i>California Management Review</i>, 45(2), 55–72.</p>
  <p class="ref ltr" style="font-size:19px;margin-top:4px"><b>[2]</b> Vanbelleghem, S., De Regge, M., Van Nieuwenhove, Y., &amp; Gemmel, P. (2026). Embedding Sustainable Second-Order Problem-Solving Behaviour in Hospital Nurses via Simulation-Based Education. <i>Journal of Advanced Nursing</i>.</p>"""
ar=[]
ar.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">التميّز التشغيلي · من الدراسات العلمية</div>
  <h1 style="font-size:76px">يحلّ الموظف المشكلة بنفسه، فتعود إليه في اليوم التالي.</h1>
  <h1 class="dim" style="margin-top:12px;font-size:62px;line-height:1.45">وفي <span class="ltr">93%</span> من الحالات لم يعلم بها أحد.</h1>
  <p class="lead">لاحظت ذلك دراسة ميدانية في مستشفيات أمريكية، وبعد أكثر من عشرين عامًا وجدت دراسة حديثة النمط نفسه تقريبًا.</p>
  <div class="swipe">← اسحب للمتابعة</div>""",NAME))
ar.append(('',f"""<div class="kicker">الدراسة</div>
  <h2>ما الذي رأته الباحثتان؟</h2>
  <p class="lead">أمضت الباحثتان أنيتا تاكر وإيمي إدموندسون 239 ساعة تراقبان عمل 26 ممرضًا وممرضة في تسعة مستشفيات أمريكية، اختير أكثرها لأنه معروف بجودة التمريض.</p>
  <div class="box">
    <p>ورصدتا خلال ذلك 194 خللًا في العمل اليومي، أغلبها مشكلات مألوفة: دواء لم يصل، أو جهاز معطّل، أو مستلزمات نفدت، أو وجبة عادية قُدّمت لمريض سكري.</p>
  </div>
  <p class="lead" style="font-size:34px">لم تكن مشكلات معقدة، ولم يكن حلّها يحتاج إلى خبرة نادرة.</p>""",SRC))
ar.append(('',f"""<div class="kicker">مثال من الدراسة</div>
  <h2>حلٌّ يُنهي الموقف، وحلٌّ يُنهي المشكلة</h2>
  <p class="lead">نفدت الأغطية النظيفة في نوبة ليلية، فأخذت الممرضة ما تحتاج إليه من قسم آخر وأكملت عملها. انتهى الموقف، لكن شيئًا لم يمنع تكرار المشكلة في الليلة التالية.</p>
  <p class="lead">والحل الآخر أن تُكمل عملها، ثم تُبلغ القسم المسؤول عن الأغطية أو مديرها، حتى يُعالَج السبب.</p>
  <p class="small" style="margin-top:36px">تسمّي الدراسة الأول <span class="ltr">First-order problem solving</span>، أي معالجة المشكلة في لحظتها، والثاني <span class="ltr">Second-order problem solving</span>، أي معالجة سببها حتى لا تتكرر.</p>""",SRC))
ar.append(('',f"""<div class="kicker">النتائج</div>
  <h2>أغلب المشكلات عولجت في لحظتها، ثم نُسيت</h2>
  <div style="margin-top:30px">
    <div class="stat"><span class="n">93%</span><p>من المشكلات اكتفى فيها الطاقم بما يُمكّنه من إكمال العمل، دون أن يُبلغ أحدًا.</p></div>
    <div class="stat"><span class="n">7%</span><p>فقط من الحالات نُبِّه فيها من يملك إصلاح السبب، مع أن الباحثتين لم تتشددا في الحكم.</p></div>
    <div class="stat"><span class="n">33</span><p>دقيقة تضيع في المتوسط من كل نوبة مدتها ثماني ساعات، في معالجة أعطال كان يمكن التخلص منها.</p></div>
  </div>""",SRC))
ar.append(('amber',f"""<div class="kicker">ولم يكن السبب تقصيرًا</div>
  <h2 style="margin-top:20px">الممرضون كانوا يبذلون أكثر مما يُطلب منهم</h2>
  <p class="lead" style="font-size:34px">تسعة من كل عشرة ممرضين راقبتهم الباحثتان طوال النوبة بقوا بعد انتهائها 45 دقيقة في المتوسط، بلا أجر إضافي، ليُكملوا رعاية مرضاهم.</p>
  <p class="lead" style="font-size:34px">وقال سبعة من تسعة ممن قابلتهم الباحثتان إنهم يشعرون بالرضا حين يجدون طريقة يتجاوزون بها العائق.</p>
  <p class="lead" style="font-size:36px;margin-top:40px"><b>وهنا المفارقة: كلما نجح الموظف في التعامل مع المشكلة وحده، بقيت مخفية عمّن يستطيع إصلاحها.</b></p>""",SRC))
ar.append(('dark',f"""<div class="kicker">وبعد أكثر من عشرين عامًا</div>
  <h2 style="font-size:60px">رأى الطاقم المشكلة، لكنه لم يُبلغ عنها في الغالب</h2>
  <div style="margin-top:20px">
    <div class="stat" style="border-color:#2E4468"><span class="n" style="color:var(--amber);font-size:96px;min-width:330px">96.2%</span><p>من الأعطال المقصودة في بيئة محاكاة لاحظها 80 ممرضًا وممرضة في دراسة بلجيكية نُشرت عام 2026.</p></div>
    <div class="stat" style="border-color:#2E4468"><span class="n" style="color:var(--amber);font-size:96px;min-width:330px">21.9%</span><p>فقط من الحالات عولج فيها السبب بالإبلاغ الرسمي أو برفع المشكلة إلى المسؤول.</p></div>
  </div>
  <p class="lead" style="font-size:30px">ولم تزد قصة مؤثرة عن سلامة المرضى من الإبلاغ، مع أنها أثارت مشاعر قوية.</p>""",VAN))
ar.append(('dark',f"""<div class="kicker">توصيات الدراستين</div>
  <h2>ما الذي يستطيع القائد فعله؟</h2>
  <ul class="clean">
    <li><span class="num">1</span>أن يحضر إلى موقع العمل في كل نوبة ولو وقتًا قصيرًا، فتصله المشكلات الصغيرة قبل أن تتراكم.</li>
    <li><span class="num">2</span>أن يجعل الإبلاغ عن المشكلة أمرًا آمنًا، لا يُفهم منه أن صاحبه عاجز عن عمله.</li>
    <li><span class="num">3</span>أن يستجيب لكل بلاغ بإجراء يراه الفريق، ويخصص نقاشًا قصيرًا بعد العمل يسأل فيه: ما الذي عطّلنا اليوم؟</li>
  </ul>
  <div class="q" style="font-size:42px;margin-top:32px;padding:28px 36px">كم مشكلة حلّها فريقك اليوم بنفسه، وستعود إليه غدًا؟</div>""",NAME))
ar.append(('',f"""<div class="kicker">المصادر وحدود الدليل</div>
  <h2 style="font-size:50px">حدود هذه الأدلة</h2>
  <ul class="clean" style="margin-top:6px">
    <li style="font-size:24px;padding:10px 0">دراسة 2003 نوعية بعيّنة صغيرة، ونسبها تخص ما رُصد أثناء المراقبة.</li>
    <li style="font-size:24px;padding:10px 0">دراسة 2026 أُجريت في بيئة محاكاة لا في جناح حقيقي، وشملت 80 مشاركًا.</li>
    <li style="font-size:24px;padding:10px 0">لم تشمل الدراستان مستشفيات عربية، وتعميم الفكرة على قطاعات أخرى استنتاج.</li>
  </ul>
  <p class="small" style="margin-top:8px;font-size:21px;line-height:1.5"><b>تنويه تحريري:</b> الآراء والتحليلات الواردة في هذا المقال تمثل رأي الكاتب وتحليله المهني استنادًا إلى المصادر المشار إليها، ولا تمثل بالضرورة المواقف الرسمية للجهات المذكورة. وللاطلاع على المعلومات والمراجع الأصلية والكاملة والأحدث، يُرجى الرجوع مباشرة إلى المصادر الأصلية والوثائق الرسمية الواردة في قائمة المراجع.</p>
  {REFS}
  <p class="small" style="margin-top:10px;font-size:24px"><b>المقال الكامل:</b> <span class="ltr">tamayuz10x.com/{SLUG}.html</span></p>
  <div class="end-logo" style="margin-bottom:6px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>د. علاء محمد أحمد · التميّز التشغيلي</span>'))
en=[]
en.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">Operational Excellence · What the research says</div>
  <h1 style="font-size:82px">Staff fix a problem on their own. The next day, it is back.</h1>
  <h1 class="dim" style="margin-top:16px;font-size:68px">In 93% of cases, no one else ever heard about it.</h1>
  <p class="lead">A field study in U.S. hospitals found this pattern. More than 20 years later, a new study found nearly the same thing.</p>
  <div class="swipe">Swipe →</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">The study</div>
  <h2>What did the researchers see?</h2>
  <p class="lead">Anita Tucker and Amy Edmondson spent 239 hours observing 26 nurses in nine U.S. hospitals, most of them known for strong nursing care.</p>
  <div class="box"><p>They recorded 194 breakdowns in everyday work. Most were familiar: a medication that never arrived, a broken device, supplies that ran out, or a regular meal tray sent to a diabetic patient.</p></div>
  <p class="lead" style="font-size:34px">None of these problems were complex, and none needed rare expertise to fix.</p>""",SRC))
en.append(('',f"""<div class="kicker">An example from the study</div>
  <h2>One fix ends the moment. The other ends the problem.</h2>
  <p class="lead">On a night shift, clean linen ran out. The nurse took some from another unit and finished her work. The moment passed, but nothing stopped the same thing from happening the next night.</p>
  <p class="lead">The other option is to finish the work, then tell the linen department or a manager so the cause gets fixed.</p>
  <p class="small" style="margin-top:36px">The study calls the first first-order problem solving and the second second-order problem solving.</p>""",SRC))
en.append(('',f"""<div class="kicker">Findings</div>
  <h2>Most problems were patched on the spot, then forgotten</h2>
  <div style="margin-top:30px">
    <div class="stat"><span class="n">93%</span><p>of problems: staff did just enough to finish the task and told no one.</p></div>
    <div class="stat"><span class="n">7%</span><p>of responses alerted someone who could fix the cause, even with a generous definition.</p></div>
    <div class="stat"><span class="n">33</span><p>minutes of each eight-hour shift, on average, went to coping with failures that could have been removed.</p></div>
  </div>""",SRC))
en.append(('amber',f"""<div class="kicker">It wasn't a lack of effort</div>
  <h2 style="margin-top:20px">The nurses were giving more than was asked of them</h2>
  <p class="lead" style="font-size:34px">Nine of the 10 nurses observed for a full shift stayed an average of 45 minutes after it ended, without extra pay, to finish caring for their patients.</p>
  <p class="lead" style="font-size:34px">Seven of the nine nurses interviewed said it felt good to find a way around an obstacle.</p>
  <p class="lead" style="font-size:36px;margin-top:40px"><b>That is the paradox: the better people handle a problem alone, the more it stays hidden from those who could fix it.</b></p>""",SRC))
en.append(('dark',f"""<div class="kicker">More than 20 years later</div>
  <h2 style="font-size:62px">Staff saw the problem, but mostly did not report it</h2>
  <div style="margin-top:20px">
    <div class="stat" style="border-color:#2E4468"><span class="n" style="color:var(--amber);font-size:96px;min-width:330px">96.2%</span><p>of built-in failures in a simulation were noticed by 80 nurses in a Belgian study published in 2026.</p></div>
    <div class="stat" style="border-color:#2E4468"><span class="n" style="color:var(--amber);font-size:96px;min-width:330px">21.9%</span><p>of cases led to action on the cause, such as formal reporting or escalation.</p></div>
  </div>
  <p class="lead" style="font-size:30px">A moving patient-safety story stirred strong feelings, but it did not increase reporting.</p>""",VAN))
en.append(('dark',f"""<div class="kicker">What the two studies recommend</div>
  <h2>What can leaders do?</h2>
  <ul class="clean">
    <li style="font-size:33px"><span class="num">1</span>Be present where the work happens during every shift, even briefly, so small problems reach you before they pile up.</li>
    <li style="font-size:33px"><span class="num">2</span>Make reporting a problem safe, never a sign that someone can't do the job.</li>
    <li style="font-size:33px"><span class="num">3</span>Answer every report with an action the team can see, and hold a short debrief after work: what got in our way today?</li>
  </ul>
  <div class="q" style="font-size:38px;margin-top:24px;padding:22px 32px">How many problems did your team fix on its own today that will be back tomorrow?</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">Sources and limits</div>
  <h2 style="font-size:52px">What this evidence can and cannot tell us</h2>
  <ul class="clean" style="margin-top:6px">
    <li style="font-size:24px;padding:10px 0">The 2003 study is qualitative with a small sample. Its figures cover only what was observed.</li>
    <li style="font-size:24px;padding:10px 0">The 2026 study took place in a simulation, not on a real ward, with 80 participants.</li>
    <li style="font-size:24px;padding:10px 0">Neither study included Arab hospitals. Applying the idea to other sectors is an inference.</li>
  </ul>
  <p class="small" style="margin-top:8px;font-size:20px;line-height:1.5"><b>Editorial disclaimer:</b> The views and analyses presented in this article represent the author’s professional interpretation based on the cited sources and do not necessarily represent the official positions of the organizations mentioned. For the original, complete and most current information, please consult the primary sources and official documents listed in the references.</p>
  {REFS}
  <p class="small" style="margin-top:10px;font-size:24px"><b>Full article:</b> tamayuz10x.com/en/{SLUG}.html</p>
  <div class="end-logo" style="margin-bottom:6px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>Dr. Alaa Mohamed Ahmed · Operational Excellence</span>'))
AR_CSS = ''':root{--serif:'Amiri',serif;--sans:'IBM Plex Sans Arabic',sans-serif}
.kicker{letter-spacing:0;text-transform:none;font-size:28px}
h1{font-size:88px;line-height:1.35}
h2{font-size:68px;line-height:1.4}
p,li{line-height:1.7}
.stat .n{direction:ltr;text-align:right}'''
EN_CSS = ''':root{--serif:'Source Serif 4',Georgia,serif;--sans:'Inter',Arial,sans-serif}'''
open('slides-ar.html','w').write(page('ar','حين يحلّ الموظف المشكلة وحده','family=Amiri:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600',AR_CSS,ar))
open('slides-en.html','w').write(page('en','When Staff Fix Problems Alone','family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;600',EN_CSS,en))
