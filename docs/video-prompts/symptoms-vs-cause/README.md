# ريل «نوعان من الناس» — يعالج الأعراض / يعالج السبب

حزمة إنتاج لفيديو أنيميشن ثلاثي الأبعاد مدته 10 ثوانٍ بمقاس 9:16.

## الصور المرجعية

| الجهة | الملف | الحالة |
|---|---|---|
| اليمنى — يعالج السبب (شماغ أحمر وأبيض) | `reference-right-shemagh.jpg` | متوفرة (250×446 بكسل — دقة منخفضة) |
| اليسرى — يعالج الأعراض (غترة بيضاء) | `reference-left-ghutra.png` | غير متوفرة؛ تُولَّد أولًا بالبرومبت أدناه |

ملاحظات على الصورة اليمنى:
- الشخصية في الصورة تحمل جهازًا لوحيًا. البرومبت يطلب يدين فارغتين لأنها تحتاج يدها لتدوير المحبس.
- الخلفية الرمادية في الصورة تناسب المشهد، لذلك اعتمدنا نفس درجتها للجدار في الجهتين.
- الدقة منخفضة، ولا توجد نسخة أعلى. لذلك أضفنا نسخة مكبّرة `reference-right-shemagh-1000w.jpg` (1000×1784). التكبير لا يضيف تفاصيل جديدة، لكنه يتجاوز الحد الأدنى للأبعاد في بعض الأدوات التي ترفض الصور الصغيرة. ارفع النسخة المكبّرة إلى أداة التوليد.

### توليد صورة مرجعية للشخصية اليسرى

لا توجد صورة للشخصية اليسرى. نولّدها أولًا بأداة صور، مع إرفاق صورة الشخصية اليمنى كمرجع للأسلوب فقط، حتى تكون الشخصيتان من «عالم» واحد. بعد ذلك نستخدم الصورة الناتجة مرجعًا في مقطع الجهة اليسرى.

```text
Full-body character design, same 3D Pixar-like style, lighting, proportions and plain soft-grey studio background as the attached reference image, but a DIFFERENT man.
A Gulf Arab (Emirati) man standing, front view, neutral relaxed pose, hands empty at his sides.
Large head and slim body (head about one quarter of his height). Warm tan skin, big round expressive dark-brown eyes, very thick bushy dark eyebrows, short dark beard and moustache, slightly tired but friendly expression, clearly a different face from the reference.
Plain white ghutra (no pattern) with a black agal, the ghutra ends hanging over his shoulders. Long white Emirati kandura with a collarless neckline and a short tassel (tarboosh) hanging from the neck, brown sandals.
No props, no text, no logo, no watermark.
```

راجع الصورة الناتجة قبل استخدامها. يجب أن تكون: غترة بيضاء دون نقش، ووجه مختلف بوضوح عن الشخصية اليمنى، ويدان فارغتان. احفظها باسم `reference-left-ghutra.png`.

## لماذا نولّد كل جهة في مقطع مستقل

أدوات توليد الفيديو تخطئ كثيرًا في ثلاثة أمور حين يُطلب منها مشهد مقسوم في لقطة واحدة:

1. تربط الأنبوبين ببعضهما أو تنقل الحركة من جهة إلى أخرى.
2. توقف الماء في الجهتين معًا أو لا توقفه في أي منهما.
3. تكتب النص العربي بحروف مقطّعة أو مقلوبة أو غير صحيحة.

لذلك الطريقة الموصى بها هي:

| الخطوة | ماذا نفعل | لماذا |
|---|---|---|
| 1 | نولّد مقطع الجهة اليسرى وحده (9:16، 10 ثوانٍ) مع صورة الشخصية الأولى كمرجع | الماء لا يتوقف أبدًا، والشخصية ثابتة الملامح |
| 2 | نولّد مقطع الجهة اليمنى وحده بنفس الخلفية والإضاءة مع صورة الشخصية الثانية | الماء يتوقف فقط بعد تدوير المحبس |
| 3 | نجمع المقطعين ونضيف النص بالسكربت `compose.sh` | الأنبوبان منفصلان حتمًا، والنص العربي صحيح 100% |

إذا كانت الأداة تقبل «صورة البداية» (image-to-video)، فابدأ بإنتاج صورة ثابتة لكل جهة أولًا، ثم حرّكها. هذا يحافظ على ملامح الشخصيات أكثر من الوصف النصي وحده.

---

## الطريقة الموصى بها: مقطعان منفصلان

### برومبت الجهة اليسرى — يعالج الأعراض

```text
3D animated cartoon, cinematic Pixar-like quality, vertical 9:16, 10 seconds, static locked-off camera, no cuts.
Scene: plain soft-grey studio wall with a gentle gradient, simple grey floor. A horizontal metal water pipe is mounted on the wall at chest height. A blue round valve handle sits on top of the pipe on the left part of it (upstream). To the right of the valve, a small crack in the pipe leaks a steady stream of water onto the floor.
Character (use reference-left-ghutra.png as the character reference; keep him identical for the whole clip): a stylized 3D Pixar-like Gulf Arab man with a large head and slim body, very thick bushy dark eyebrows, short dark beard, plain white ghutra with black agal, white Emirati kandura with a short neck tassel, brown sandals. Same art style and proportions as the other clip's character, but a clearly different face.
0-2s: water leaks steadily, a small puddle is on the floor. He holds a floor mop.
2-5s: he mops fast and repeatedly, looking stressed and tired; the leak continues and the puddle grows.
5-7s: water keeps leaking at the same rate; the puddle keeps growing despite his effort.
7-10s: he stops for a moment, looks at the large puddle with frustration and fatigue, sighs, then starts mopping again without success. The clip ends with a large wide puddle.
The water never stops. He never touches the valve. No text, no logos, no watermark, no other people.
Soft studio lighting, clean details, realistic water motion.
```

### برومبت الجهة اليمنى — يعالج السبب

```text
3D animated cartoon, cinematic Pixar-like quality, vertical 9:16, 10 seconds, static locked-off camera, no cuts.
Scene: identical to the other clip — plain soft-grey studio wall with a gentle gradient (same tone as the reference image background), simple grey floor, horizontal metal water pipe on the wall at chest height, blue round valve handle on top of the pipe (upstream), small crack to the right of the valve leaking a steady stream of water.
Character (use reference-right-shemagh.jpg as the character reference; keep him identical for the whole clip): a stylized 3D Pixar-like Gulf Arab man with a large head and slim body (head about one quarter of his height). Warm tan skin, big round expressive dark-brown eyes, thick dark arched eyebrows, full thick black beard and moustache, wide friendly toothy smile. Red-and-white checked shemagh with a thick black double-ring agal; the shemagh ends hang over his shoulders down to his chest. Long plain white thobe to the ankles with a small stand-up collar and a short button placket, black slip-on loafers. His hands are empty (no tablet, no other props).
0-2s: water leaks onto the floor with the same strength as in the other clip. He looks at the leak, then calmly raises his eyes to the blue valve.
2-5s: he calmly reaches up, grips the blue valve with his hand and clearly turns it clockwise several times (the handle visibly rotates).
5-7s: he finishes turning; the water stream thins and stops completely and naturally. Only a few last drops fall. He smiles with confidence and satisfaction.
7-10s: he stands calmly next to the closed pipe. The floor under the pipe is dry and clean. No more water.
Water stops only after the valve is turned. No text, no logos, no watermark, no other people.
Soft studio lighting, clean details, realistic water motion.
```

### برومبت سلبي (Negative prompt) — للجهتين

```text
text, letters, subtitles, logo, watermark, UI, tablet, phone,  split screen, second pipe, extra characters, camera movement, zoom, cuts, face morphing, changing facial features, extra fingers, distorted hands
```

### التجميع

```bash
./compose.sh left.mp4 right.mp4 music.mp3 final-reel.mp4
```

- كل مقطع يُصغَّر إلى 540×960 ويوضع في جهته بين العنوان والعبارتين.
- الخط الفاصل والعنوان «نوعان من الناس» و«يعالج الأعراض» (يسار) و«يعالج السبب» (يمين) تأتي من الملف `text-overlay-1080x1920.png` (خط Cairo عريض، لون أسود).
- صوت كل مقطع يُوجَّه إلى جهته في الستيريو، فحين يتوقف الماء في المقطع الأيمن يتوقف صوته من الجهة اليمنى ويستمر صوت التسرب من اليسار.
- الموسيقى اختيارية، وتُخفض إلى 25% مع تلاشٍ في الثانية الأخيرة.

لتعديل النص: عدّل `overlay.html` ثم أعد تصوير الصورة بالمتصفح بحجم 1080×1920 مع خلفية شفافة.

---

## طريقة بديلة: لقطة واحدة (أسرع، لكن أقل تحكمًا)

استخدمها فقط إذا كانت الأداة تتعامل جيدًا مع الشاشة المقسومة. ولا تطلب منها كتابة النص؛ أضفه بعدها من `text-overlay-1080x1920.png`.

```text
3D animated cartoon, cinematic Pixar-like quality, vertical 9:16, 10 seconds, static locked-off camera, no cuts.
The frame is split vertically into two equal halves by a thin dark line. The two halves are two separate rooms with identical layout, lighting and scale. Each half has its own separate horizontal metal water pipe mounted on the wall (the pipes do NOT connect across the line), a blue valve on top of the pipe upstream, a small crack downstream leaking water, and a simple grey floor.
LEFT half: the character from reference-left-ghutra.png — stylized 3D Gulf Arab man, large head, very thick bushy eyebrows, short dark beard, plain white ghutra with black agal, white kandura with neck tassel. He mops the floor fast and repeatedly, stressed and tired. His leak never stops and the puddle grows bigger all the time. At 7s he pauses, looks at the big puddle in frustration, then mops again without success.
RIGHT half: the character from reference-right-shemagh.jpg — stylized 3D Gulf Arab man, large head, big round dark-brown eyes, thick arched eyebrows, full black beard, wide toothy smile, red-and-white checked shemagh with thick black agal, long white thobe, black loafers, hands empty (no tablet). At 0-2s he looks at the leak, then up at the valve. At 2-5s he grips the blue valve and clearly turns it several times. At 5-7s the water stops completely; he smiles with confidence. At 7-10s he stands calmly; the floor under him is dry and clean.
Final frame: big puddle on the left, dry floor on the right. Keep both faces identical to the reference images. No text, no logos, no watermark, no extra people.
```

---

## مراجعة الجودة قبل النشر

| البند | السؤال | المطلوب |
|---|---|---|
| الأنبوب | هل يبدو الأنبوبان متصلين؟ | لا |
| الماء — يسار | هل يتوقف في أي لحظة؟ | لا، يستمر حتى الثانية 10 |
| الماء — يمين | هل يتوقف قبل تدوير المحبس؟ | لا، يتوقف بعد الدوران فقط (بين الثانية 5 و7) |
| المحبس | هل يدور بوضوح أم تكتفي اليد بلمسه؟ | يدور بوضوح |
| الملامح | هل تتغير الوجوه أو الملابس أثناء الحركة؟ | لا |
| النهاية | هل الفرق بين البركة الكبيرة والأرضية الجافة واضح؟ | نعم |
| النص | هل الكلمات صحيحة وفي مكانها؟ | «يعالج الأعراض» يسار، «يعالج السبب» يمين |
| الصوت | هل يتوقف صوت الماء في اليمين ويستمر في اليسار؟ | نعم |
| الرسالة | هل تُفهم الرسالة إذا شاهدت الفيديو دون قراءة النص؟ | نعم |
