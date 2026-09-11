function escText(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
}

function assessmentTitle(key, lang) {
  if (key === 'learning-preference-profile') return lang === 'ar' ? 'بصمتك في التعلّم' : 'Learning Style Profile';
  return lang === 'ar' ? 'تقييم أسلوب العمل' : 'Work Approach Assessment';
}

function metricRows(key, result, lang) {
  if (key === 'learning-preference-profile') {
    const p = result?.scores?.percent || {};
    const names = lang === 'ar'
      ? { A:'الممارسة', R:'التأمل والمراجعة', T:'التحليل المفاهيمي', P:'التطبيق العملي' }
      : { A:'Action', R:'Reflection', T:'Conceptual analysis', P:'Practical application' };
    return ['A','R','T','P'].map(k => [names[k], `${p[k] ?? '—'}%`]);
  }
  const s = result?.scores || {};
  const core = s.core || {};
  const names = lang === 'ar'
    ? { U:'الفهم والتحقق', S:'التنظيم والهيكلة', A:'الفعل والتقدم' }
    : { U:'Understanding', S:'Structuring', A:'Action' };
  const rows = Object.keys(names).filter(k => core[k]).map(k => [names[k], `${Math.round(core[k].index ?? 0)}%`]);
  if (s.social?.index != null) rows.push([lang === 'ar' ? 'إشراك الآخرين' : 'Involving others', `${Math.round(s.social.index)}%`]);
  if (s.flex?.shiftCount != null) rows.push([lang === 'ar' ? 'تغيّر الاختيار مع السياق' : 'Context-dependent shifts', `${s.flex.shiftCount}/${s.flex.totalPairs ?? 4}`]);
  return rows;
}

function drawWrapped(ctx, text, x, y, maxWidth, lineHeight, align) {
  const words = escText(text).split(/\s+/).filter(Boolean);
  let line = '', cy = y;
  ctx.textAlign = align;
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lineHeight;
    } else line = trial;
  }
  if (line) ctx.fillText(line, x, cy);
  return cy + lineHeight;
}

function canvasToPdfBlob(canvas) {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const binary = atob(dataUrl.split(',')[1]);
  const image = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) image[i] = binary.charCodeAt(i);
  const enc = new TextEncoder();
  const parts = [];
  const offsets = [0];
  let length = 0;
  const pushText = s => { const b = enc.encode(s); parts.push(b); length += b.length; };
  const pushBytes = b => { parts.push(b); length += b.length; };
  pushText('%PDF-1.4\n%âãÏÓ\n');
  const obj = (n, body, bytes) => {
    offsets[n] = length;
    pushText(`${n} 0 obj\n${body}`);
    if (bytes) { pushText('\nstream\n'); pushBytes(bytes); pushText('\nendstream'); }
    pushText('\nendobj\n');
  };
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
  obj(4, `<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>`, image);
  const stream = enc.encode('q\n595 0 0 842 0 0 cm\n/Im0 Do\nQ');
  obj(5, `<< /Length ${stream.length} >>`, stream);
  const xref = length;
  pushText('xref\n0 6\n0000000000 65535 f \n');
  for (let i = 1; i <= 5; i++) pushText(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);
  pushText(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts, { type:'application/pdf' });
}

export async function createAssessmentReportPdf(assessmentKey, result) {
  const lang = result?.language === 'en' ? 'en' : 'ar';
  const rtl = lang === 'ar';
  const canvas = document.createElement('canvas');
  canvas.width = 1240; canvas.height = 1754;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.direction = rtl ? 'rtl' : 'ltr';
  const left = 110, right = 1130, contentW = right-left, anchor = rtl ? right : left, align = rtl ? 'right' : 'left';
  ctx.fillStyle = '#0b2545'; ctx.font = '700 44px Arial, sans-serif'; ctx.textAlign = align;
  ctx.fillText(rtl ? 'التميّز 10X' : 'Tamayuz 10X', anchor, 120);
  ctx.font = '700 58px Arial, sans-serif';
  let y = drawWrapped(ctx, assessmentTitle(assessmentKey, lang), anchor, 230, contentW, 72, align);
  ctx.fillStyle = '#475569'; ctx.font = '30px Arial, sans-serif';
  const completed = result?.completedAt ? new Date(result.completedAt) : new Date();
  const dateText = rtl ? `تاريخ الإكمال: ${completed.toLocaleString('ar')}` : `Completed: ${completed.toLocaleString('en')}`;
  ctx.fillText(dateText, anchor, y + 10); y += 85;
  ctx.strokeStyle = '#dbe3ec'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(left,y); ctx.lineTo(right,y); ctx.stroke(); y += 70;
  ctx.fillStyle = '#0b2545'; ctx.font = '700 38px Arial, sans-serif';
  ctx.fillText(rtl ? 'ملخص النتيجة' : 'Result summary', anchor, y); y += 55;
  const rows = metricRows(assessmentKey, result, lang);
  ctx.font = '32px Arial, sans-serif';
  for (const [name,value] of rows) {
    ctx.fillStyle = '#f7f9fc'; ctx.fillRect(left,y-8,contentW,88);
    ctx.fillStyle = '#0b2545'; ctx.font = '700 34px Arial, sans-serif';
    ctx.textAlign = rtl ? 'left' : 'right'; ctx.fillText(escText(value), rtl ? left+35 : right-35, y+48);
    ctx.font = '30px Arial, sans-serif'; ctx.textAlign = align; ctx.fillText(escText(name), anchor, y+48);
    y += 108;
  }
  y += 30; ctx.fillStyle = '#475569'; ctx.font = '27px Arial, sans-serif'; ctx.textAlign = align;
  const note = rtl
    ? 'هذا التقرير يلخص النتيجة المحفوظة في حسابك. وهو مخصص للتأمل والتطوير، وليس للتشخيص أو لاتخاذ قرارات اختيار.'
    : 'This report summarizes the result saved in your account. It is intended for reflection and development, not diagnosis or selection decisions.';
  drawWrapped(ctx, note, anchor, y, contentW, 42, align);
  return canvasToPdfBlob(canvas);
}
