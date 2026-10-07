(function () {
  'use strict';
  const form = document.getElementById('book-order-form');
  if (!form) return;
  const ar = form.dataset.language === 'ar';
  const button = form.querySelector('button[type="submit"]');
  const success = document.getElementById('book-order-success');
  const error = document.getElementById('book-order-error');
  const idleLabel = button.textContent;
  let sending = false;
  let reference = '';

  function makeReference() {
    const bytes = new Uint32Array(2);
    window.crypto.getRandomValues(bytes);
    return 'CMI-' + Array.from(bytes, n => n.toString(16).padStart(8, '0')).join('').toUpperCase();
  }

  function prepareLinks(data) {
    const value = key => String(data.get(key) || '').trim();
    const lines = ar ? [
      'طلب نسخة مطبوعة: Mastering Case Mix Index',
      'مرجع الطلب: ' + reference,
      'الكمية: نسخة واحدة باللغة الإنجليزية',
      'الإجمالي: 100 درهم شامل التوصيل داخل الإمارات وجميع الرسوم',
      'الاسم: ' + value('name'), 'البريد الإلكتروني: ' + value('email'),
      'الهاتف: ' + value('phone'), 'الإمارة: ' + value('emirate'),
      'المدينة / المنطقة: ' + value('city_area'), 'العنوان: ' + value('delivery_address'),
      'ملاحظات التوصيل: ' + (value('delivery_notes') || 'لا توجد'),
      'لم يتم الدفع. يرجى إرسال رابط زينة إلى البريد الإلكتروني بعد قبول الطلب.'
    ] : [
      'Printed book request: Mastering Case Mix Index',
      'Request reference: ' + reference,
      'Quantity: 1 English-language copy',
      'Total: AED 100 including UAE delivery and all charges',
      'Name: ' + value('name'), 'Email: ' + value('email'),
      'Phone: ' + value('phone'), 'Emirate: ' + value('emirate'),
      'City / area: ' + value('city_area'), 'Address: ' + value('delivery_address'),
      'Delivery notes: ' + (value('delivery_notes') || 'None'),
      'Unpaid request. Please email the Ziina payment link after accepting the order.'
    ];
    const message = lines.join('\n');
    document.querySelectorAll('[data-order-whatsapp]').forEach(link => {
      link.href = 'https://wa.me/971559310642?text=' + encodeURIComponent(message);
    });
    document.querySelector('[data-order-email]').href = 'mailto:info@tamayuz10x.com?subject=' +
      encodeURIComponent('Book order ' + reference + ' | AED 100') + '&body=' + encodeURIComponent(message);
    return message;
  }

  error.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (event) {
      if (!form.reportValidity()) {
        event.preventDefault();
        return;
      }
      prepareLinks(new FormData(form));
    });
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (sending) return;
    for (const name of ['name', 'email', 'phone', 'city_area', 'delivery_address', 'delivery_notes']) {
      form.elements.namedItem(name).value = form.elements.namedItem(name).value.trim();
    }
    if (!form.reportValidity()) return;
    if (form.elements.namedItem('_gotcha').value) return;
    sending = true;
    button.disabled = true;
    button.textContent = ar ? 'جارٍ إرسال الطلب…' : 'Submitting request…';
    form.setAttribute('aria-busy', 'true');
    error.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      if (!reference) reference = makeReference();
      const data = new FormData(form);
      data.set('request_reference', reference);
      data.set('_subject', 'Book order ' + reference + ' | Mastering Case Mix Index | AED 100');
      data.set('order_summary', prepareLinks(data));
      const response = await fetch(form.action, {
        method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || result.ok === false) throw new Error('Submission not confirmed');
      document.querySelector('[data-order-reference]').textContent =
        (ar ? 'مرجع الطلب: ' : 'Request reference: ') + reference;
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (_) {
      error.hidden = false;
      error.focus();
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.textContent = idleLabel;
      form.removeAttribute('aria-busy');
    }
  });
})();
