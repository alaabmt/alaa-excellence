// Usage: node render.mjs spec.json
// spec: {"out_dir": "...", "slug": "2026-11-01-0900", "style" (optional, defaults to config.card_style_by_slot / card_style), "ar": {...}, "en": {...}}
// each language (hook card): {"hook": "...", "value": "...", "title_short": "...", "series": "series label",
//                             "teaser": "post caption (used by the post scripts, not drawn)", "title": "full article H1 (used in the caption)"}
// Legacy specs with "wisdom" instead of "hook" still render (the wisdom becomes the hook, no value line).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const logo = resolve(here, '../../assets/images/file_0000000047188210ac6952e999d2eda7.png');
const photo = resolve(here, 'author.jpg');
const amiri = resolve(here, '../../assets/fonts/Amiri-Bold.ttf');
const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const config = JSON.parse(readFileSync(resolve(here, 'config.json'), 'utf8'));
// Style: plain | signature | portrait. Per-slot choice comes from the slug's HHMM (e.g. ...-0900 -> "09:00").
const hhmm = (spec.slug.match(/(\d{2})(\d{2})$/) || []).slice(1).join(':');
const style = spec.style || (config.card_style_by_slot || {})[hhmm] || config.card_style || 'plain';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Wrap Latin-script runs inside Arabic text so mixed direction renders in reading order (e.g. FMEA, S/O/D).
const bidi = (lang, s) => lang === 'ar'
  ? esc(s).replace(/[A-Za-z][A-Za-z0-9\-\/]*(?: [A-Za-z][A-Za-z0-9\-\/]*)*/g, m => `<bdi dir="ltr">${m}</bdi>`)
  : esc(s);

// Hook card (owner decision 31 Oct 2026): hook (large) -> value line -> short title -> signature.
// Old specs that only carry "wisdom" still render: the wisdom is shown as the hook, with no value line.
function page(lang, d) {
  const rtl = lang === 'ar';
  const t = rtl
    ? { sig: 'من تحليل الدكتور علاء محمد عيسى', brand: '<bdi><b>التميّز 10X</b></bdi> · <bdi dir="ltr">tamayuz10x.com</bdi>' }
    : { sig: 'From the analysis of Dr. Alaa Mohammed Eissa', brand: '<b>Tamayuz 10X</b> · tamayuz10x.com' };
  const hook = d.hook ?? d.wisdom ?? '';
  const value = d.value ?? '';
  const titleShort = d.title_short ?? d.title ?? '';
  const portrait = style === 'portrait';
  const fadeTo = rtl ? 'right' : 'left';
  const css = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px}
body{font-family:'Tajawal',sans-serif;background:linear-gradient(160deg,#071a2f 0%,#0c3155 70%,#103c66 100%);color:#fff;display:flex;flex-direction:column;position:relative;overflow:hidden}
.top{padding:64px 80px 0;position:relative;z-index:2}
.eyebrow{color:#f3d98f;font-weight:800;font-size:28px;letter-spacing:${rtl ? '0' : '.5px'}}
.main{flex:1;position:relative;display:flex;min-height:0}
.q{position:relative;z-index:2;display:flex;flex-direction:column;justify-content:center;padding:10px 80px 40px;overflow:hidden;${portrait ? 'width:660px;padding-inline-end:20px' : 'flex:1'}}
.bar{width:90px;height:8px;background:#c9a24a;border-radius:4px;margin-bottom:34px}
.h{font-weight:${rtl ? 800 : 700};line-height:${rtl ? 1.7 : 1.35};font-size:${portrait ? 58 : 68}px}
.v{margin-top:34px;font-weight:500;color:#dbe7f3;line-height:${rtl ? 1.75 : 1.5};font-size:${portrait ? 34 : 38}px;padding-inline-start:22px;border-inline-start:5px solid #c9a24a}
.ttl{margin-top:38px;font-size:30px;font-weight:800;color:#f3d98f;line-height:1.5}
.sig{display:flex;align-items:center;gap:22px;margin-top:22px;font-size:24px;color:#b9cde0;font-weight:500}
.avatar{flex:0 0 96px;height:96px;border-radius:50%;border:4px solid #c9a24a;box-shadow:0 0 0 6px rgba(201,162,74,.18);background:url('file://${photo}') no-repeat;background-size:300px auto;background-position:-103px -42px}
.photo{position:absolute;bottom:0;${rtl ? 'left' : 'right'}:0;width:560px;height:100%;z-index:1;
  background:url('file://${photo}') no-repeat center bottom/cover;
  -webkit-mask-image:linear-gradient(to ${fadeTo},#000 45%,transparent 100%),linear-gradient(to bottom,transparent 0%,#000 22%);
  -webkit-mask-composite:source-in;mask-composite:intersect}
.foot{position:relative;z-index:3;background:#fff;border-top:5px solid #c9a24a;height:130px;display:flex;align-items:center;justify-content:space-between;padding:0 56px 0 80px}
.foot .t{font-size:26px;color:#42586c;font-weight:700}
.foot .t b{color:#0c3155;font-weight:900}
.foot img{height:112px}`;
  const sig = style === 'signature'
    ? `<div class="sig"><div class="avatar"></div><span>${t.sig}</span></div>`
    : `<p class="sig" style="margin-top:14px">${t.sig}</p>`;
  return `<!doctype html><html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap">
<style>${css}</style></head><body>
<div class="top"><span class="eyebrow">${esc(d.series ?? '')}</span></div>
<div class="main">${portrait ? '<div class="photo"></div>' : ''}<div class="q" id="q"><div class="bar"></div>
<p class="h" id="w">${bidi(lang, hook)}</p>
${value ? `<p class="v" id="v">${bidi(lang, value)}</p>` : ''}
<p class="ttl">${bidi(lang, titleShort)}</p>${sig}</div></div>
<div class="foot"><span class="t">${t.brand}</span><img src="file://${logo}" alt=""></div>
</body></html>`;
}

const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
for (const lang of ['ar', 'en']) {
  if (!spec[lang]) continue;
  const html = resolve(spec.out_dir, `${spec.slug}-${lang}.html`);
  writeFileSync(html, page(lang, spec[lang]));
  await p.goto('file://' + html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const fit = await p.evaluate(() => {
    const q = document.getElementById('q'), w = document.getElementById('w'), v = document.getElementById('v');
    let s = parseFloat(getComputedStyle(w).fontSize);
    const v0 = v ? parseFloat(getComputedStyle(v).fontSize) : 0, s0 = s;
    while (q.scrollHeight > q.clientHeight && s > 40) {
      s -= 2; w.style.fontSize = s + 'px';
      if (v) v.style.fontSize = Math.max(28, Math.round(v0 * s / s0)) + 'px';
    }
    const clipped = q.scrollHeight > q.clientHeight + 1;
    const wide = [...q.children].some(c => c.scrollWidth > c.clientWidth + 1);
    const text = [...q.querySelectorAll('.h,.v,.ttl,.sig')].map(e => e.textContent).join(' ');
    const words = text.split(/\s+/).filter(Boolean).length;
    return { s, clipped, wide, words };
  });
  const size = fit.s;
  const fontOk = await p.evaluate(() => document.fonts.check("700 40px Tajawal"));
  const png = resolve(spec.out_dir, `${spec.slug}-${lang}.png`);
  await p.screenshot({ path: png, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  console.log(JSON.stringify({ lang, style, png, font_px: size, card_words: fit.words, clipped: fit.clipped || fit.wide, tajawal_loaded: fontOk }));
  if (fit.clipped || fit.wide || size < 40 || !fontOk) process.exitCode = 2;
}
await browser.close();
