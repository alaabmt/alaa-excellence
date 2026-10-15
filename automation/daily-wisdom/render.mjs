// Usage: node render.mjs spec.json
// spec: {"out_dir": "...", "slug": "2026-10-16-0900", "ar": {...}, "en": {...}}
// each language: {"wisdom": "...", "title": "article title", "series": "series label"}
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const logo = resolve(here, '../../assets/images/file_0000000047188210ac6952e999d2eda7.png');
const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function page(lang, d) {
  const rtl = lang === 'ar';
  const from = rtl ? 'من مقال' : 'From the article';
  const brand = rtl ? '<bdi><b>التميّز 10X</b></bdi> · <bdi dir="ltr">tamayuz10x.com</bdi>' : '<b>Tamayuz 10X</b> · tamayuz10x.com';
  return `<!doctype html><html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px}
body{font-family:'Tajawal',sans-serif;background:linear-gradient(160deg,#071a2f 0%,#0c3155 70%,#103c66 100%);color:#fff;display:flex;flex-direction:column}
.top{padding:64px 80px 0}
.eyebrow{color:#f3d98f;font-weight:800;font-size:28px;letter-spacing:${rtl ? '0' : '.5px'}}
.q{flex:1;display:flex;flex-direction:column;justify-content:center;padding:10px 80px 20px;overflow:hidden}
.mark{font-family:Georgia,serif;color:#c9a24a;font-size:150px;line-height:.8;height:90px}
.w{font-weight:${rtl ? 800 : 700};line-height:${rtl ? 1.75 : 1.45};font-size:64px}
.rule{width:120px;height:5px;background:#c9a24a;border-radius:3px;margin:40px 0 24px}
.src{font-size:25px;line-height:1.6;color:#b9cde0}
.src b{color:#fff;font-weight:700}
.foot{background:#fff;border-top:5px solid #c9a24a;height:130px;display:flex;align-items:center;justify-content:space-between;padding:0 56px 0 80px}
.foot .t{font-size:26px;color:#42586c;font-weight:700}
.foot .t b{color:#0c3155;font-weight:900}
.foot img{height:112px}
</style></head><body>
<div class="top"><span class="eyebrow">${esc(d.series)}</span></div>
<div class="q" id="q"><div class="mark">${rtl ? '”' : '“'}</div><p class="w" id="w">${esc(d.wisdom)}</p>
<div class="rule"></div><p class="src">${from}: <b>${esc(d.title)}</b></p></div>
<div class="foot"><span class="t">${brand}</span><img src="file://${logo}" alt=""></div>
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
    let s = 64;
    while (q.scrollHeight > q.clientHeight && s > 34) { s -= 2; w.style.fontSize = s + 'px'; }
    return s;
  });
  const fontOk = await p.evaluate(() => document.fonts.check("700 40px Tajawal"));
  const png = resolve(spec.out_dir, `${spec.slug}-${lang}.png`);
  await p.screenshot({ path: png, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  console.log(JSON.stringify({ lang, png, font_px: size, tajawal_loaded: fontOk }));
}
await browser.close();
