(() => {
  if (window.__tenxArabicTanweenFix) return;
  window.__tenxArabicTanweenFix = true;

  const NativeUtterance = window.SpeechSynthesisUtterance;
  if (typeof NativeUtterance !== 'function') return;

  const STOP = '(?=\\s*[.!؟؛:،]|$)';

  function normalizeTanweenForSpeech(input) {
    let text = String(input || '').normalize('NFC');

    // الوقف: لا نُنطق نون التنوين عند نهاية الجملة أو موضع الوقف.
    text = text
      .replace(new RegExp('ًا' + STOP, 'g'), 'ا')
      .replace(new RegExp('ةً' + STOP, 'g'), 'ة')
      .replace(new RegExp('[ٌٍ]' + STOP, 'g'), '');

    // الوصل: نحول علامة التنوين في طبقة النطق فقط إلى نون ساكنة واحدة صريحة.
    // هذا يمنع بعض محركات Android/Web Speech من إخراج نونين للتنوين.
    text = text
      .replace(/ةً/g, 'تَنْ')
      .replace(/ًا/g, 'َنْ')
      .replace(/ً/g, 'َنْ')
      .replace(/ٌ/g, 'ُنْ')
      .replace(/ٍ/g, 'ِنْ');

    return text.normalize('NFC');
  }

  function TenxUtterance(text = '') {
    return new NativeUtterance(normalizeTanweenForSpeech(text));
  }

  TenxUtterance.prototype = NativeUtterance.prototype;
  try { Object.setPrototypeOf(TenxUtterance, NativeUtterance); } catch (_) {}
  window.SpeechSynthesisUtterance = TenxUtterance;
  window.__tenxNormalizeTanweenForSpeech = normalizeTanweenForSpeech;
})();