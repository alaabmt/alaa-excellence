// Usage: node render.mjs spec.json
// spec: {"out_dir": "...", "slug": "2026-10-16-0900", "style" (optional, defaults to config.card_style), "ar": {...}, "en": {...}}
// each language: {"wisdom": "...", "title": "article title", "series": "series label"}
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const logo = resolve(here, '../../assets/images/file_0000000047188210ac6952e999d2eda7.png');
const photo = resolve(here, 'author.jpg');
const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const config = JSON.parse(readFileSync(resolve(here, 'config.json'), 'utf8'));
// Style: plain | signature | portrait. Per-slot choice comes from the slug's HHMM (e.g. ...-0900 -> "09:00").
const hhmm = (spec.slug.match(/(\d{2})(\d{2})$/) || []).slice(1).join(':');
const style = spec.style || (config.card_style_by_slot || {})[hhmm] || config.card_style || 'plain';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function page(lang, d) {
  const rtl = lang === 'ar';
  const t = rtl
    ? { from: 'من مقال', name: 'د. علاء محمد أحمد', brand: '<bdi><b>التميّز 10X</b></bdi> · <bdi dir="ltr">tamayuz10x.com</bdi>', mark: '”' }
    : { from: 'From the article', name: 'Dr. Alaa Mohammad Ahmad', brand: '<b>Tamayuz 10X</b> · tamayuz10x.com', mark: '“' };
  const portrait = style === 'portrait';
  // In Arabic the text starts at the right, so the photo sits on the left; English mirrors it.
  const fadeTo = rtl ? 'right' : 'left';
  const css = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px}
body{font-family:'Tajawal',sans-serif;background:linear-gradient(160deg,#071a2f 0%,#0c3155 70%,#103c66 100%);color:#fff;display:flex;flex-direction:column;position:relative;overflow:hidden}
.top{padding:64px 80px 0;position:relative;z-index:2}
.eyebrow{color:#f3d98f;font-weight:800;font-size:28px;letter-spacing:${rtl ? '0' : '.5px'}}
.main{flex:1;position:relative;display:flex;min-height:0}
.q{position:relative;z-index:2;display:flex;flex-direction:column;justify-content:center;padding:10px 80px 40px;overflow:hidden;${portrait ? 'width:640px;padding-inline-end:20px' : 'flex:1'}}
.mark{font-family:Georgia,serif;color:#c9a24a;font-size:150px;line-height:.8;height:90px}
.w{font-weight:${rtl ? 800 : 700};line-height:${rtl ? 1.75 : 1.45};font-size:${portrait ? 54 : 64}px}
.rule{width:120px;height:5px;background:#c9a24a;border-radius:3px;margin:36px 0 22px}
.src{font-size:24px;line-height:1.6;color:#b9cde0}
.src b{color:#fff;font-weight:700}
.name{font-size:30px;font-weight:900;color:#f3d98f;margin-bottom:6px}
.sig{display:flex;align-items:center;gap:26px;margin-top:40px}
.avatar{flex:0 0 150px;height:150px;border-radius:50%;border:5px solid #c9a24a;box-shadow:0 0 0 8px rgba(201,162,74,.18);background:url('file://${photo}') no-repeat;background-size:470px auto;background-position:-161px -66px}
.photo{position:absolute;bottom:0;${rtl ? 'left' : 'right'}:0;width:560px;height:100%;z-index:1;
  background:url('file://${photo}') no-repeat center bottom/cover;
  -webkit-mask-image:linear-gradient(to ${fadeTo},#000 45%,transparent 100%),linear-gradient(to bottom,transparent 0%,#000 22%);
  -webkit-mask-composite:source-in;mask-composite:intersect}
.foot{position:relative;z-index:3;background:#fff;border-top:5px solid #c9a24a;height:130px;display:flex;align-items:center;justify-content:space-between;padding:0 56px 0 80px}
.foot .t{font-size:26px;color:#42586c;font-weight:700}
.foot .t b{color:#0c3155;font-weight:900}
.foot img{height:112px}`;
  const quote = `<div class="mark">${t.mark}</div><p class="w" id="w">${esc(d.wisdom)}</p>`;
  const credit = style === 'plain'
    ? `<div class="rule"></div><p class="src">${t.from}: <b>${esc(d.title)}</b></p>`
    : portrait
    ? `<div class="rule"></div><p class="name">${t.name}</p><p class="src">${t.from}: <b>${esc(d.title)}</b></p>`
    : `<div class="sig"><div class="avatar"></div><div><p class="name">${t.name}</p><p class="src">${t.from}: <b>${esc(d.title)}</b></p></div></div>`;
  return `<!doctype html><html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap">
<style>${css}</style></head><body>
<div class="top"><span class="eyebrow">${esc(d.series)}</span></div>
<div class="main">${portrait ? '<div class="photo"></div>' : ''}<div class="q" id="q">${quote}${credit}</div></div>
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
  const size = await p.evaluate(() => {
    const q = document.getElementById('q'), w = document.getElementById('w');
    let s = parseFloat(getComputedStyle(w).fontSize);
    while (q.scrollHeight > q.clientHeight && s > 32) { s -= 2; w.style.fontSize = s + 'px'; }
    return s;
  });
  const fontOk = await p.evaluate(() => document.fonts.check("700 40px Tajawal"));
  const png = resolve(spec.out_dir, `${spec.slug}-${lang}.png`);
  await p.screenshot({ path: png, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  console.log(JSON.stringify({ lang, style, png, font_px: size, tajawal_loaded: fontOk }));
}
await browser.close();
