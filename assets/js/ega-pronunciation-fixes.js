(() => {
  if (!/case-ega-dx-ultra-innovation\.html$/i.test(window.location.pathname)) return;
  if (window.__tenxEgaPronunciationFixesV4) return;
  window.__tenxEgaPronunciationFixesV4 = true;

  const NativeUtterance = window.SpeechSynthesisUtterance;
  if (!NativeUtterance) return;

  const fixes = [
    [/صَهْرُ الأَلُومِنْيُومِ/g, 'صَهْر الأَلُومِنْيُوم'],
    [/تِقْنِيَّةِ الصَّهْرِ/g, 'تِقْنِيَّة الصَّهْر'],
    [/خَلِيَّةَ الصَّهْرِ/g, 'خَلِيَّة الصَّهْر'],
    [/خَلايا الصَّهْرِ/g, 'خَلايا الصَّهْر'],
    [/طَاقَةِ الصَّهْرِ/g, 'طَاقَة الصَّهْر'],
    [/لِصَهْرِ الأَلُومِنْيُومِ/g, 'لِصَهْر الأَلُومِنْيُوم'],
    [/الصَّهْرِ/g, 'الصَّهْر'],
    [/صَهْرُ/g, 'صَهْر'],
    [/صَهْرِ/g, 'صَهْر'],
    [/التِّقْنِيَّةِ/g, 'التِّقْنِيَّة'],
    [/تِقْنِيَّةِ/g, 'تِقْنِيَّة'],
    [/الأَلُومِنْيُومِ/g, 'الأَلُومِنْيُوم'],
    [/التَّيّارِ/g, 'التَّيّار'],
    [/الكَهْرَبائِيِّ/g, 'الكَهْرَبائِي'],
    [/التَّشْغيلِ/g, 'التَّشْغيل'],
    [/الإِنْتاجِ/g, 'الإِنْتاج'],
    [/المَعْدِنِ/g, 'المَعْدِن'],
    [/المَعْرِفَةِ/g, 'المَعْرِفَة'],
    [/الطّاقَةِ/g, 'الطّاقَة'],
    [/كِيلو أَمْبير/g, 'كيلو أَمْبير'],
    [/كِيلوواطْ/g, 'كيلو واط'],
    [/كِيلوغْرام/g, 'كيلو غرام'],
    [/دِي إِكْس بْلَس أَلْتْرا/g, 'دي إكس بْلَس أَلْترا'],
    [/إِي جِي إِيه/g, 'إي جي إيه'],
    [/أَلْبا/g, 'أَلْبا']
  ];

  function tune(text) {
    let out = String(text || '');
    fixes.forEach(([pattern, value]) => { out = out.replace(pattern, value); });
    return out;
  }

  function PatchedUtterance(text) {
    return new NativeUtterance(tune(text));
  }
  PatchedUtterance.prototype = NativeUtterance.prototype;
  Object.setPrototypeOf(PatchedUtterance, NativeUtterance);
  window.SpeechSynthesisUtterance = PatchedUtterance;
})();
