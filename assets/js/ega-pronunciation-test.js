(() => {
  if (!/case-ega-dx-ultra-innovation\.html$/i.test(window.location.pathname)) return;
  if (window.__tenxEgaPronunciationPatch) return;
  window.__tenxEgaPronunciationPatch = true;

  const NativeUtterance = window.SpeechSynthesisUtterance;
  if (!NativeUtterance) return;

  const replacements = [
    [/EGA/g, 'إي جي إيه'],
    [/DX\+\s*Ultra/gi, 'دي إكس بْلَس أَلْترا'],
    [/Alba/g, 'أَلْبا'],
    [/465\s*kA/gi, 'أربعمئة وخمسة وستون كيلو أَمبير'],
    [/460\s*kA/gi, 'أربعمئة وستون كيلو أَمبير'],
    [/kA/g, 'كيلو أَمبير'],
    [/12\.87\s*kWh\/kg/gi, 'اثنا عشر فاصلة سبعة وثمانون كيلوواط ساعة لكل كيلوغرام'],
    [/kWh\/kg/gi, 'كيلوواط ساعة لكل كيلوغرام'],
    [/37\.5%/g, 'سبعة وثلاثون فاصلة خمسة بالمئة'],
    [/95%/g, 'خمسة وتسعون بالمئة'],
    [/424/g, 'أربعمئة وأربع وعشرون'],
    [/الألمنيوم/g, 'الأَلُومِنْيُوم'],
    [/الصهر/g, 'الصَّهْر'],
    [/خلية الصهر/g, 'خَلِيَّة الصَّهْر'],
    [/كفاءة التيار/g, 'كَفاءَة التَّيَّار'],
    [/التيار الكهربائي/g, 'التَّيَّار الكَهْرَبائِي'],
    [/المعرفة التشغيلية/g, 'المَعْرِفَة التَّشْغِيلِيَّة'],
    [/الإمارات العالمية للألمنيوم/g, 'الإِمارات العالَمِيَّة لِلأَلُومِنْيُوم']
  ];

  function prepare(text) {
    let out = String(text || '');
    replacements.forEach(([pattern, value]) => { out = out.replace(pattern, value); });
    return out;
  }

  function PatchedUtterance(text) {
    return new NativeUtterance(prepare(text));
  }
  PatchedUtterance.prototype = NativeUtterance.prototype;
  Object.setPrototypeOf(PatchedUtterance, NativeUtterance);
  window.SpeechSynthesisUtterance = PatchedUtterance;
})();
