# Builds slides-ar.html and slides-en.html for post 007. Edit, then: python3 build.py && node render.js <folder> ar,en
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


SLUG = 'article-oe-evidence-daily-safety-huddles'
C1 = '<span class="ltr">Guo et al., BMJ Qual Saf, 2025</span>'
C2 = '<span class="ltr">Lamming et al., BMC Health Serv Res, 2021</span>'
C3 = '<span class="ltr">Stayt et al., Intensive Crit Care Nurs, 2026</span>'
C4 = '<span class="ltr">Lin et al., J Multidiscip Healthc, 2022</span>'
NAME = '<span>د. علاء محمد أحمد</span>'
EN_NAME = '<span>Dr. Alaa Mohamed Ahmed</span>'
R = 'class="ref ltr" style="font-size:16px;margin-top:3px;line-height:1.35"'
REFS = f"""<p {R}><b>[1]</b> Guo, M.-Q., et al. (2025). Impact of medical safety huddles on patient safety: a stepped-wedge cluster randomised study. <i>BMJ Qual Saf</i>, 35(5), 326–333.</p>
  <p {R}><b>[2]</b> Lamming, L., et al. (2021). Fidelity and the impact of patient safety huddles on teamwork and safety culture (HUSH). <i>BMC Health Serv Res</i>, 21, 1038.</p>
  <p {R}><b>[3]</b> Stayt, L., et al. (2026). Safety huddles in ICUs across the United Kingdom: a national e-survey. <i>Intensive Crit Care Nurs</i>, 96, 104470.</p>
  <p {R}><b>[4]</b> Lee, S. E., et al. (2023). A safety huddle intervention in in-patient surgical units. <i>J Nurs Manag</i>, 2023, 8929993.</p>
  <p {R}><b>[5]</b> Lin, S.-P., et al. (2022). The effectiveness of multidisciplinary team huddles in a hospital setting. <i>J Multidiscip Healthc</i>, 15, 2241–2247.</p>"""
SL = 'style="font-size:90px;min-width:300px"'
L = lambda x: f'<span class="ltr">{x}</span>'
ar=[]
ar.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">التميّز التشغيلي · من الدراسات العلمية</div>
  <h1 style="font-size:66px">تعقد فرق في مستشفيات كثيرة اجتماعًا قصيرًا عن سلامة المرضى.</h1>
  <h1 class="dim" style="margin-top:12px;font-size:50px;line-height:1.5">وفي تجربة بأربعة مستشفيات جامعية، انخفض معدل الأحداث الضارة، أي الأضرار التي تسببها الرعاية نفسها، بنسبة {L('12%')}.</h1>
  <p class="lead">لكن كثيرًا من هذه الاجتماعات لا يُعقد كما خُطّط له. وهذا ما تعرضه خمس دراسات نُشرت بين عامي {L('2021')} و{L('2026')}.</p>
  <div class="swipe">← اسحب للمتابعة</div>""",NAME))
ar.append(('',f"""<div class="kicker">الفكرة</div>
  <h2>ما الاجتماع القصير للسلامة؟</h2>
  <p class="lead">هو اجتماع قصير ومنظم، يكون يوميًا في الغالب. يذكر فيه الفريق ما قد يؤذي المرضى، ويتفق على ما سيفعله لمنعه.</p>
  <div class="box">
    <p>والحدث الضار ضرر تسببه الرعاية نفسها، لا المرض.</p>
  </div>""",C2))
ar.append(('',f"""<div class="kicker">تجربة تورونتو</div>
  <h2>شملت التجربة أربعة مستشفيات جامعية، والأطباء وحدهم</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>12%</span><p>هي نسبة انخفاض معدل الأحداث الضارة بعد أن بدأ الأطباء الاجتماعات، بحسب مراجعة ملفات {L('912')}&nbsp;مريضًا.</p></div>
    <div class="stat"><span class="n" {SL}>64%</span><p>من إجابات الأطباء كانت إيجابية في أسئلة الاستبيان الخاصة بالحديث عن الأخطاء، بعد أن كانت {L('36%')}.</p></div>
  </div>
  <p class="small" style="margin-top:20px">ولم يكن حضور الأطباء كاملًا، فقد تراوح بين {L('30%')} و{L('85%')} بحسب المستشفى.</p>""",C1))
ar.append(('',f"""<div class="kicker">المشروع البريطاني</div>
  <h2>كثيرًا ما يُعقد الاجتماع ناقصًا</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>64</span><p>هو عدد الأجنحة التي استمرت فيها الاجتماعات، من أصل {L('92')}&nbsp;جناحًا في خمسة مستشفيات.</p></div>
    <div class="stat"><span class="n" {SL}>4.9</span><p>هو متوسط ما تضمّنه الاجتماع الواحد من {L('9')}&nbsp;عناصر يُفترض أن يشملها.</p></div>
  </div>
  <p class="small" style="margin-top:20px">وكانت الفرق تُغفل عادةً أمرين: عرض رسم بياني يبيّن الأضرار مع مرور الوقت، ومراجعة ما وقع منها سابقًا.</p>""",C2))
ar.append(('',f"""<div class="kicker">من يحضر؟</div>
  <h2>أفادت أكثر الوحدات المجيبة بأن الممرضين يحضرون بانتظام، وقلّة منها قالت ذلك عن الأطباء</h2>
  <p class="lead" style="font-size:30px">في استبيان أجابت عنه {L('74')}&nbsp;وحدة عناية مركزة بريطانية، قالت {L('71')}&nbsp;منها إنها تعقد هذه الاجتماعات.</p>
  <div style="margin-top:10px">
    <div class="stat"><span class="n" {SL}>89%</span><p>أفادت {L('63')}&nbsp;وحدة بأن الممرضين يحضرون بانتظام.</p></div>
    <div class="stat"><span class="n" {SL}>32%</span><p>ولم تُفِد بذلك عن الأطباء إلا {L('8')}&nbsp;وحدات.</p></div>
  </div>
  <p class="small" style="margin-top:14px">النسبتان محسوبتان من أعداد مختلفة من الوحدات التي أجابت.</p>
  <p class="small" style="margin-top:14px">وذكرت الوحدات عيوبًا: يأخذ الاجتماع وقتًا، وقد يبدو بلا فائدة، وقد يقطع رعاية المرضى، وقد يغيب فيه الأمان النفسي، أي شعور العاملين بأنهم يستطيعون الحديث عن الخطأ دون خوف.</p>""",C3))
ar.append(('amber',f"""<div class="kicker">المتابعة</div>
  <h2 style="margin-top:20px">في جناح بتايوان، حُلّت كل المشكلات التي طُرحت في الاجتماعات</h2>
  <p class="lead" style="font-size:36px">وهو جناح للأمراض الباطنية، طُرحت فيه {L('81')}&nbsp;مشكلة في {L('44')}&nbsp;اجتماعًا، وحُلّ أكثرها خلال ساعات.</p>
  <p class="lead" style="font-size:36px;margin-top:36px">ويُرجّح الكاتب، استنتاجًا من الدراسات الخمس، أن الاجتماع ينفع حين يحضره من يملك القرار، ويُطرح فيه الخطر دون خوف، ويُتابَع ما يُتفق عليه حتى يُنفّذ.</p>
  <p class="small" style="margin-top:28px">هذا استنتاج لم تقسه الدراسات.</p>""",C4))
ar.append(('dark',f"""<div class="kicker">ما يستنتجه الكاتب من الدراسات</div>
  <h2>ما الذي يستطيع القائد فعله؟</h2>
  <ul class="clean">
    <li><span class="num">1</span>يحدد للاجتماع هدفًا واضحًا: ما الذي قد يؤذي المرضى اليوم، وماذا سنفعل لمنعه؟</li>
    <li><span class="num">2</span>ويحرص على حضور الأطباء وسائر المهن، لا الممرضين وحدهم.</li>
    <li><span class="num">3</span>ويقيس أمرين: هل يُعقد الاجتماع كاملًا، وهل تقلّ الأضرار.</li>
  </ul>
  <p class="small" style="margin-top:10px">الخطوات الثلاث استنتاج من الكاتب، ولم تختبرها أي دراسة بوصفها إجراءً يتخذه القائد.</p>
  <div class="q" style="font-size:34px;margin-top:20px;padding:22px 32px">بعد ثلاث سنوات، أتريد أن يكون اجتماع فريقك موعدًا يُنسى ما قيل فيه، أم مكانًا تُكتشف فيه المخاطر ويُتفق على ما يمنعها؟</div>""",NAME))
ar.append(('',f"""<div class="kicker">المصادر وحدود الدليل</div>
  <h2 style="font-size:46px">حدود هذه الأدلة</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">أُجريت تجربة تورونتو في أربعة مستشفيات جامعية، وشملت الأطباء وحدهم.</li>
    <li style="font-size:22px;padding:6px 0">ولم تقارن دراستا كوريا الجنوبية وتايوان نتائجهما بأجنحة لم تعقد الاجتماعات، والاستبيانات تقيس آراء العاملين لا الأضرار نفسها.</li>
    <li style="font-size:22px;padding:6px 0">ولم تُجرَ أيٌّ من الدراسات الخمس في مستشفى عربي، ونفع الفكرة في قطاعات أخرى استنتاج لم يُختبر بعد.</li>
  </ul>
  <p class="small" style="margin-top:6px;font-size:18px;line-height:1.5"><b>تنويه تحريري:</b> الآراء والتحليلات الواردة في هذا المقال تمثل رأي الكاتب وتحليله المهني استنادًا إلى المصادر المشار إليها، ولا تمثل بالضرورة المواقف الرسمية للجهات المذكورة. وللاطلاع على المعلومات والمراجع الأصلية والكاملة والأحدث، يُرجى الرجوع مباشرة إلى المصادر الأصلية والوثائق الرسمية الواردة في قائمة المراجع.</p>
  {REFS}
  <p class="small" style="margin-top:6px;font-size:21px"><b>المقال الكامل:</b> <span class="ltr">tamayuz10x.com/{SLUG}.html</span></p>
  <div class="end-logo" style="margin-bottom:2px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>د. علاء محمد أحمد · التميّز التشغيلي</span>'))
en=[]
en.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">Operational Excellence · What the research says</div>
  <h1 style="font-size:72px">Many hospital teams now hold short safety huddles.</h1>
  <h1 class="dim" style="margin-top:16px;font-size:50px">In one trial in four academic hospitals, adverse events fell by 12% after doctors started them.</h1>
  <p class="lead">But many huddles are not run as planned. Here is what five studies, published from 2021 to 2026, show.</p>
  <div class="swipe">Swipe →</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">The idea</div>
  <h2>What is a safety huddle?</h2>
  <p class="lead">A short, structured meeting, often held daily. The team names what could harm patients and agrees how to prevent it.</p>
  <div class="box"><p>An adverse event is harm caused by care itself, not by illness.</p></div>""",C2))
en.append(('',f"""<div class="kicker">The Toronto trial</div>
  <h2>The trial covered doctors in four academic hospitals</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>12%</span><p>drop in the rate of adverse events after doctors started huddles, based on the records of 912 patients.</p></div>
    <div class="stat"><span class="n" {SL}>64%</span><p>of doctors' answers on communication about error were positive, up from 36%.</p></div>
  </div>
  <p class="small" style="margin-top:20px">Not every doctor attended: attendance ranged from 30% to 85% across hospitals.</p>""",C1))
en.append(('',f"""<div class="kicker">The UK project</div>
  <h2>Huddles are often run with parts missing</h2>
  <div style="margin-top:22px">
    <div class="stat"><span class="n" {SL}>64</span><p>of 92 wards in five hospitals sustained the huddles.</p></div>
    <div class="stat"><span class="n" {SL}>4.9</span><p>of 9 intended elements were included in an average huddle.</p></div>
  </div>
  <p class="small" style="margin-top:20px">Teams routinely left out two things: a chart showing harm over time, and a review of harm that had already happened.</p>""",C2))
en.append(('',f"""<div class="kicker">Who attends?</div>
  <h2 style="font-size:52px">Most responding units said nurses attended regularly. Few said the same about doctors.</h2>
  <p class="lead" style="font-size:30px">In a survey of 74 UK intensive care units, 71 said they held safety huddles.</p>
  <div style="margin-top:10px">
    <div class="stat"><span class="n" {SL}>89%</span><p>of responding units (63) reported that nurses attended regularly.</p></div>
    <div class="stat"><span class="n" {SL}>32%</span><p>of responding units (only 8) said the same about doctors.</p></div>
  </div>
  <p class="small" style="margin-top:14px">The two percentages are based on different numbers of responding units.</p>
  <p class="small" style="margin-top:14px">Units listed drawbacks: huddles take time, can seem pointless, can interrupt patient care, and may lack psychological safety. That means staff feel they can speak up about a mistake without fear.</p>""",C3))
en.append(('amber',f"""<div class="kicker">Follow-up</div>
  <h2 style="margin-top:20px">On one ward in Taiwan, every problem raised in the huddles was resolved</h2>
  <p class="lead" style="font-size:36px">On this medical ward, 81 problems were raised in 44 huddles. Most were resolved within hours.</p>
  <p class="lead" style="font-size:36px;margin-top:36px">From the five studies, the author infers that a huddle is likely to help when decision-makers attend, risks can be raised without fear, and agreed actions are carried out.</p>
  <p class="small" style="margin-top:28px">The studies did not test this.</p>""",C4))
en.append(('dark',f"""<div class="kicker">The author's reading of the studies</div>
  <h2>What can leaders do?</h2>
  <ul class="clean">
    <li style="font-size:33px"><span class="num">1</span>Give the huddle a clear purpose: what could harm patients today, and what will we do to prevent it?</li>
    <li style="font-size:33px"><span class="num">2</span>Make sure doctors and other professional groups attend, not only nurses.</li>
    <li style="font-size:33px"><span class="num">3</span>Measure two things: whether the huddle runs in full, and whether harm goes down.</li>
  </ul>
  <p class="small" style="margin-top:10px">All three steps are the author's inference from the studies. None was tested as a leader action.</p>
  <div class="q" style="font-size:34px;margin-top:24px;padding:22px 32px">Three years from now, do you want your team's huddle to be a routine people forget, or the place where risks are caught early and the team agrees how to prevent harm?</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">Sources and limits</div>
  <h2 style="font-size:48px">What this evidence can and cannot tell us</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">The Toronto trial covered four academic hospitals and included only doctors.</li>
    <li style="font-size:22px;padding:6px 0">The South Korean and Taiwanese studies had no comparison wards. The surveys measured staff views, not harm.</li>
    <li style="font-size:22px;padding:6px 0">None of the five studies took place in an Arab hospital. Applying the idea to other sectors is an untested inference.</li>
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
open('slides-ar.html','w').write(page('ar','ماذا حدث حين بدأت فرق في المستشفيات تعقد اجتماعًا قصيرًا عن سلامة المرضى؟','family=Amiri:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600',AR_CSS,ar))
open('slides-en.html','w').write(page('en','What Happened When Hospital Teams Started Holding Safety Huddles?','family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;600',EN_CSS,en))
