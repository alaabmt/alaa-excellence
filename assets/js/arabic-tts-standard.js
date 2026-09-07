(() => {
  if (window.__tenxArabicTtsStandard) return;
  window.__tenxArabicTtsStandard = true;

  const NativeUtterance = window.SpeechSynthesisUtterance;
  if (typeof NativeUtterance !== 'function') return;

  const STOP = '(?=\\s*[.!؟؛:،]|$)';

  function prepareArabicSpeech(input) {
    let text = String(input || '').normalize('NFC');

    // التنوين في الوصل يحمل نوناً صوتية واحدة بذاته، لذلك لا نضيف نوناً أخرى.
    // نترك ً ٌ ٍ كما هي في أثناء الوصل ونفوض نطقها لمحرك العربية الأصلي.

    // في الوقف تسقط نون التنوين صوتياً، من غير تغيير الرسم الأصلي في الصفحة.
    text = text
      .replace(new RegExp('ًا' + STOP, 'g'), 'ا')
      .replace(new RegExp('ةً' + STOP, 'g'), 'ة')
      .replace(new RegExp('[ٌٍ]' + STOP, 'g'), '')
      .replace(new RegExp('ً' + STOP, 'g'), '');

    // إزالة مراجع الحواشي من طبقة النطق فقط.
    text = text.replace(/\[(?:\d+)\]/g, '');

    return text.replace(/\s+/g, ' ').trim().normalize('NFC');
  }

  function TenxUtterance(text = '') {
    return new NativeUtterance(prepareArabicSpeech(text));
  }

  TenxUtterance.prototype = NativeUtterance.prototype;
  try { Object.setPrototypeOf(TenxUtterance, NativeUtterance); } catch (_) {}

  window.SpeechSynthesisUtterance = TenxUtterance;
  window.__tenxPrepareArabicSpeech = prepareArabicSpeech;
})();