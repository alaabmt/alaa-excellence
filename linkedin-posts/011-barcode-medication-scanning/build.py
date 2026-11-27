# Builds slides-ar.html and slides-en.html for post 011. Edit, then: python3 build.py && node render.js <folder> ar,en
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


SLUG = 'article-oe-evidence-barcode-medication-scanning'
C1 = '<span class="ltr">Poon et al., N Engl J Med, 2010</span>'
C14 = '<span class="ltr">Poon et al., 2010 · Koppel et al., 2008</span>'
C23 = '<span class="ltr">Hutton et al., 2021 · Ciapponi et al. (Cochrane), 2021</span>'
C4 = '<span class="ltr">Koppel et al., J Am Med Inform Assoc, 2008</span>'
C5 = '<span class="ltr">Williams et al., BMJ Health Care Inform, 2025</span>'
NAME = '<span>د. علاء محمد أحمد</span>'
EN_NAME = '<span>Dr. Alaa Mohammad Ahmed</span>'
R = 'class="ref ltr" style="font-size:16px;margin-top:3px;line-height:1.35"'
REFS = f"""<p {R}><b>[1]</b> Poon, E. G., et al. (2010). Effect of bar-code technology on the safety of medication administration. <i>N Engl J Med</i>, 362(18), 1698–1707.</p>
  <p {R}><b>[2]</b> Ciapponi, A., et al. (2021). Reducing medication errors for adults in hospital settings. <i>Cochrane Database Syst Rev</i>, 11, CD009985.</p>
  <p {R}><b>[3]</b> Hutton, K., et al. (2021). The effects of bar-coding technology on medication errors: a systematic literature review. <i>J Patient Saf</i>, 17(3), e192–e206.</p>
  <p {R}><b>[4]</b> Koppel, R., et al. (2008). Workarounds to barcode medication administration systems. <i>J Am Med Inform Assoc</i>, 15(4), 408–423.</p>
  <p {R}><b>[5]</b> Williams, R., et al. (2025). Barcode medication administration system use and safety implications. <i>BMJ Health Care Inform</i>, 32(1), e101214.</p>"""
SL = 'style="font-size:84px;min-width:260px"'
L = lambda x: f'<span class="ltr">{x}</span>'
LI = 'style="font-size:28px;padding:12px 0"'
ar=[]
ar.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">التميّز التشغيلي · من الدراسات العلمية</div>
  <h1 style="font-size:60px;line-height:1.6">صار الممرض في مستشفيات كثيرة يتحقق من الدواء والمريض بماسح ضوئي قبل الإعطاء.</h1>
  <h1 class="dim" style="margin-top:12px;font-size:44px;line-height:1.8">وفي مركز طبي جامعي أمريكي، وقع نحو {L('115')}&nbsp;خطأً في كل ألف مرة أُعطي فيها دواء قبل النظام، ونحو {L('68')}&nbsp;بعده، من غير أخطاء التوقيت. لكن في دراسة بريطانية شملت خمسة أقسام، لم يُستعمل الماسح في أحد الأقسام إلا مع نحو {L('6%')} من الأدوية.</h1>
  <p class="lead">فلماذا لا يُستعمل الماسح دائمًا؟ تعرض خمس دراسات نُشرت بين عامَي {L('2008')} و{L('2025')} ما يساعد على فهم ذلك.</p>
  <div class="swipe">← اسحب للمتابعة</div>""",NAME))
ar.append(('',f"""<div class="kicker">الفكرة</div>
  <h2>ما الذي يفعله الماسح الضوئي؟</h2>
  <p class="lead">قبل أن يعطي الممرض الدواء، يقرأ بالماسح رمزًا شريطيًّا على سوار المريض، ثم رمزًا على عبوة الدواء. ويقارن النظام الرمزين بما وصفه الطبيب للمريض. فإن كان الدواء أو الجرعة أو المريض غير صحيح، ظهر تنبيه.</p>
  <div class="box">
    <p>والرمز الشريطي (Barcode) خطوط مطبوعة يقرؤها الماسح الضوئي، فيعرف منها الدواء أو المريض.</p>
  </div>""",C14))
ar.append(('',f"""<div class="kicker">مركز طبي جامعي أمريكي</div>
  <h2 style="line-height:1.8">قلّ وقوع بعض أخطاء إعطاء الدواء بعد بدء النظام</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>6.8%</span><p>هي نسبة مرات إعطاء الدواء التي وقع فيها خطأ بعد النظام، وكانت {L('11.5%')} قبله. ولا يدخل فيها إعطاء الدواء قبل موعده أو بعده.</p></div>
    <div class="stat"><span class="n" {SL}>1.6%</span><p>هي نسبة مرات إعطاء الدواء التي وقع فيها خطأ قد يؤذي المريض، من غير أخطاء التوقيت، بعد النظام، وكانت {L('3.1%')} قبله.</p></div>
  </div>
  <p class="small" style="margin-top:16px">ومعنى ذلك: من كل {L('1,000')}&nbsp;مرة أُعطي فيها دواء، وقع نحو {L('115')}&nbsp;خطأً قبل النظام، ونحو {L('68')}&nbsp;بعده، أي أنها قلّت بنحو {L('41%')} من عددها الأصلي. لكنها دراسة قبل وبعد في مركز واحد، أي أنها قارنت الأقسام نفسها في فترتين.</p>""",C1))
ar.append(('',f"""<div class="kicker">المراجعات</div>
  <h2 style="line-height:1.8">رجّحت مراجعتان أن الرمز الشريطي قد يقلّل الأخطاء، ووصفت إحداهما ثقتها بالدليل بأنها منخفضة</h2>
  <ul class="clean">
    <li {LI}>جمعت المراجعة الأولى عشر دراسات، كلها من نوع قبل وبعد، أي قارنت المستشفى نفسه قبل الرمز الشريطي وبعده. وأظهرت كلها نتائج أفضل بعد بدئه.</li>
    <li {LI}>ووصفت مراجعة كوكرين (Cochrane)، وهي شبكة دولية تُعدّ مراجعات للأدلة الطبية، ثقتها بالدليل بأنها منخفضة. وقامت نتيجتها على دراستين شملتا أكثر من {L('50')}&nbsp;ألف مشارك.</li>
  </ul>
  <p class="small" style="margin-top:16px">والثقة المنخفضة بالدليل تعني أن الأثر الحقيقي قد يختلف كثيرًا عما وجدته الدراسات.</p>""",C23))
ar.append(('',f"""<div class="kicker">خمسة مستشفيات</div>
  <h2 style="line-height:1.8">وجد الباحثون {L('15')}&nbsp;طريقة يتجاوز بها العاملون خطوات النظام</h2>
  <p class="lead" style="margin-top:18px">ومنها أن يُلصق رمز سوار المريض على عربة الحاسوب، أو على إطار الباب، أو على الماسح نفسه، وأن تُقرأ رموز أدوية عدة مرضى بالماسح مسبقًا، ثم تُحمل على العربة.</p>
  <div class="box">
    <p>ومن أسباب هذا التجاوز رموز أدوية لا تُقرأ، وماسحات معطلة، وأساور مرضى مفقودة، وأدوية بلا رمز، وحالات طارئة.</p>
  </div>""",C4))
ar.append(('amber',f"""<div class="kicker">خمسة أقسام بريطانية، بعد بدء النظام</div>
  <div class="stat" style="margin-top:14px"><span class="n" {SL}>5.6%</span><p>هي نسبة الأدوية التي استُعمل معها الماسح في أحد خمسة أقسام، وبلغت {L('67%')} في قسم آخر.</p></div>
  <ul class="clean">
    <li {LI}>قلّت قراءة الرموز بالماسح مع مرور الوقت خلال أول {L('16')}&nbsp;شهرًا.</li>
    <li {LI}>ومن الأسباب التي سجّلها العاملون لعدم قراءة رمز الدواء أن الرمز لا يُقرأ، أو أن الماسح غير متاح.</li>
    <li {LI}>وكانت قراءة الرموز أكثر حين وُجدت في القسم مبادرة لتحسين الجودة يقودها العاملون فيه.</li>
  </ul>""",C5))
ar.append(('dark',f"""<div class="kicker">ما يستنتجه الكاتب من الدراسات</div>
  <h2>ما الذي يستطيع القائد فعله؟</h2>
  <ul class="clean">
    <li><span class="num">1</span>يقيس كل شهر نسبة الأدوية التي قُرئ رمزها بالماسح في كل قسم.</li>
    <li><span class="num">2</span>ويسأل عن أسباب عدم قراءة الرموز، ويعالجها: الرموز التي لا تُقرأ، والماسحات المعطلة، والأساور المفقودة.</li>
    <li><span class="num">3</span>ويدعم في كل قسم مبادرة تحسين يقودها العاملون أنفسهم.</li>
  </ul>
  <p class="small" style="margin-top:10px">هذه ثلاث من ست خطوات في المقال، استنتجها الكاتب من الدراسات، ولم تختبر أي دراسة أثرها مجتمعةً.</p>
  <div class="q" style="font-size:32px;margin-top:20px;padding:22px 32px">بعد ثلاث سنوات، هل سيبقى في مؤسستكم نظام تحقق اشتريتموه، ثم لا يُستعمل إلا قليلًا؟ أم سيصير التحقق جزءًا عاديًّا من كل خطوة مهمة؟</div>""",NAME))
ar.append(('',f"""<div class="kicker">المصادر وحدود الدليل</div>
  <h2 style="font-size:46px">حدود هذه الأدلة</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">دراسة المركز الطبي الأمريكي والدراسات العشر في المراجعة الأولى قارنت كلها المكان نفسه قبل النظام وبعده، دون مكان آخر للمقارنة، فلا تثبت أن النظام وحده سبب الانخفاض.</li>
    <li style="font-size:22px;padding:6px 0">ونُشرت دراسة طرق التجاوز عام {L('2008')}، وقد تكون الأجهزة تغيّرت منذ ذلك الحين. واقتصرت الدراسة البريطانية على خمسة أقسام.</li>
    <li style="font-size:22px;padding:6px 0">ولا تذكر الملخصات المنشورة للدراسات الخمس أي مستشفى عربي، ولم تختبر أيٌّ منها الفكرة خارج المستشفيات.</li>
  </ul>
  <p class="small" style="margin-top:6px;font-size:18px;line-height:1.5"><b>تنويه تحريري:</b> الآراء والتحليلات الواردة في هذا المقال تمثل رأي الكاتب وتحليله المهني استنادًا إلى المصادر المشار إليها، ولا تمثل بالضرورة المواقف الرسمية للجهات المذكورة. وللاطلاع على المعلومات والمراجع الأصلية والكاملة والأحدث، يُرجى الرجوع مباشرة إلى المصادر الأصلية والوثائق الرسمية الواردة في قائمة المراجع.</p>
  {REFS}
  <p class="small" style="margin-top:6px;font-size:21px"><b>المقال الكامل:</b> <span class="ltr">tamayuz10x.com/{SLUG}.html</span></p>
  <div class="end-logo" style="margin-bottom:2px">{imgs("logo")}<span class="ltr">tamayuz10x.com</span></div>""",'<span>د. علاء محمد أحمد · التميّز التشغيلي</span>'))
en=[]
en.append(('dark',f"""<div class="cover-logo">{imgs("logo")}</div>
  <div class="kicker">Operational Excellence · What the research says</div>
  <h1 style="font-size:60px">In many hospitals, nurses now scan the medicine and the patient's wristband before giving a dose.</h1>
  <h1 class="dim" style="margin-top:16px;font-size:44px">In one U.S. academic medical center, there were about 115 errors per 1,000 administrations before the system and about 68 after it, not counting medicines given too early or too late. In a U.K. study of five wards, staff on one ward scanned only about 6% of medicines.</h1>
  <p class="lead">Why is the scanner not always used? Here is what five studies, published from 2008 to 2025, show.</p>
  <div class="swipe">Swipe →</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">The idea</div>
  <h2>What does the scanner do?</h2>
  <p class="lead">Before giving a medicine, the nurse scans a barcode on the patient's wristband, then one on the medicine package. The system checks both against the doctor's order and warns if the medicine, the dose, or the patient is wrong.</p>
  <div class="box"><p>A barcode is a set of printed lines that a scanner reads to identify a medicine or a patient.</p></div>""",C14))
en.append(('',f"""<div class="kicker">A U.S. academic medical center</div>
  <h2>Some medication errors became less common after the system started</h2>
  <div style="margin-top:18px">
    <div class="stat"><span class="n" {SL}>6.8%</span><p>of administrations had an error after the system, compared with 11.5% before. These figures leave out medicines given too early or too late.</p></div>
    <div class="stat"><span class="n" {SL}>1.6%</span><p>of administrations had an error that could harm a patient after the system, compared with 3.1% before, again leaving out timing errors.</p></div>
  </div>
  <p class="small" style="margin-top:16px">In other words, for every 1,000 administrations, there were about 115 such errors before and about 68 after, about 41% fewer. But this was a before-and-after study in one center: it compared the same units in two periods.</p>""",C1))
en.append(('',f"""<div class="kicker">The reviews</div>
  <h2>Two reviews say barcoding may reduce errors, but the evidence is limited</h2>
  <ul class="clean">
    <li {LI}>The first review gathered 10 studies, all before-and-after studies, meaning each compared the same hospital before and after barcoding. All reported better results after it started.</li>
    <li {LI}>Cochrane, an international network that prepares reviews of medical evidence, found that barcoding may reduce errors compared with usual care. The result rested on two studies with more than 50,000 participants, and the authors rated their certainty as low.</li>
  </ul>
  <p class="small" style="margin-top:16px">Low certainty of evidence means the true effect may be quite different from what the studies found.</p>""",C23))
en.append(('',f"""<div class="kicker">Five hospitals</div>
  <h2>Researchers found 15 ways staff work around the system</h2>
  <p class="lead" style="margin-top:18px">In some cases, a copy of a patient's wristband barcode was stuck on a computer cart, on the scanner itself, or on a door frame. In others, several patients' medicines were scanned in advance and then carried around on the cart.</p>
  <div class="box"><p>Causes included unreadable barcodes, broken scanners, missing wristbands, medicines with no barcode, and emergencies.</p></div>""",C4))
en.append(('amber',f"""<div class="kicker">Five U.K. wards, after the system started</div>
  <div class="stat" style="margin-top:14px"><span class="n" {SL}>5.6%</span><p>of medicines were scanned on one of five wards; on another ward, 67% were.</p></div>
  <ul class="clean">
    <li {LI}>Scanning declined over the first 16 months.</li>
    <li {LI}>Reasons staff recorded for not scanning included unreadable barcodes and scanners that were not available.</li>
    <li {LI}>Scanning was higher where there was a locally led quality improvement initiative.</li>
  </ul>""",C5))
en.append(('dark',f"""<div class="kicker">The author's reading of the studies</div>
  <h2>What can leaders do?</h2>
  <ul class="clean">
    <li style="font-size:33px"><span class="num">1</span>Measure each month the share of medicines scanned on each ward.</li>
    <li style="font-size:33px"><span class="num">2</span>Ask why scanning did not happen, and fix the causes: unreadable barcodes, broken scanners, missing wristbands.</li>
    <li style="font-size:33px"><span class="num">3</span>Support an improvement initiative on each ward, led by the staff themselves.</li>
  </ul>
  <p class="small" style="margin-top:10px">These are three of the six steps in the article. The author inferred them from the studies, and no study tested their combined effect.</p>
  <div class="q" style="font-size:32px;margin-top:20px;padding:22px 32px">Three years from now, will your organization still have a checking system that you paid for but people rarely use? Or will checking be a normal part of every important step?</div>""",EN_NAME))
en.append(('',f"""<div class="kicker">Sources and limits</div>
  <h2 style="font-size:48px">What this evidence can and cannot tell us</h2>
  <ul class="clean" style="margin-top:2px">
    <li style="font-size:22px;padding:6px 0">The U.S. study and the 10 studies in the first review all compared the same place before and after the system, with no other place for comparison, so they cannot show that the system alone caused the drop.</li>
    <li style="font-size:22px;padding:6px 0">The workaround study was published in 2008, and devices may have changed since; the U.K. study covered only five wards.</li>
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
open('slides-ar.html','w').write(page('ar','ماذا حدث حين صار الممرضون يتحققون من الدواء بماسح ضوئي قبل إعطائه للمريض؟','family=Amiri:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600',AR_CSS,ar))
open('slides-en.html','w').write(page('en','What Happened When Hospital Nurses Began Scanning Barcodes Before Giving Medicines?','family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;600',EN_CSS,en))
