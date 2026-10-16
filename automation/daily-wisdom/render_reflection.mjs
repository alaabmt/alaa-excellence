// Quranic reflection card (Arabic only, no photo). Usage: node render_reflection.mjs spec.json
// spec: {"out_dir","slug","theme": "night" | "parchment", "ar": {"verse","verse_ref","wisdom","title","series"}}
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const logo = resolve(here, '../../assets/images/file_0000000047188210ac6952e999d2eda7.png');
const amiri = resolve(here, '../../assets/fonts/Amiri-Bold.ttf');
const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const d = spec.ar;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ref = esc(d.verse_ref || '').replace(/[0-9٠-٩]+(?:\s*[–-]\s*[0-9٠-٩]+)?/g, m => `<bdi dir="ltr">${m}</bdi>`);

const themes = {
  night: { bg: '#0a1c2e', bg2: '#0f2d47', ink: '#ffffff', soft: '#c9d8e6', gold: '#d9b45a', verse: '#f1d78f', pattern: 0.07 },
  parchment: { bg: '#f7f0e1', bg2: '#efe3c8', ink: '#0b2b4b', soft: '#5b6b78', gold: '#a8801f', verse: '#0b2b4b', pattern: 0.09 },
};
const t = themes[spec.theme || 'night'];

// Eight-pointed star tile (khatam), a classic Islamic geometric motif, drawn as a light background pattern.
const star = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='none' stroke='${t.gold}' stroke-width='1.4'><rect x='35' y='35' width='50' height='50'/><rect x='35' y='35' width='50' height='50' transform='rotate(45 60 60)'/><circle cx='60' cy='60' r='9'/></g></svg>`;
const pattern = `url("data:image/svg+xml,${encodeURIComponent(star)}")`;
const orn = `<svg width="420" height="34" viewBox="0 0 420 34"><g fill="none" stroke="${t.gold}" stroke-width="2"><line x1="0" y1="17" x2="170" y2="17"/><line x1="250" y1="17" x2="420" y2="17"/><path d="M210 3 L224 17 L210 31 L196 17 Z" fill="${t.gold}"/><path d="M185 17 L193 9 L201 17 L193 25 Z"/><path d="M219 17 L227 9 L235 17 L227 25 Z"/></g></svg>`;

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap">
<style>
@font-face{font-family:'AmiriQ';src:url('file://${amiri}')}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px}
body{font-family:'Tajawal',sans-serif;background:radial-gradient(ellipse at 50% 38%,${t.bg2} 0%,${t.bg} 75%);color:${t.ink};display:flex;flex-direction:column;position:relative;overflow:hidden}
body:before{content:"";position:absolute;inset:0;background-image:${pattern};background-size:120px;opacity:${t.pattern}}
.frame{position:absolute;inset:38px 38px 168px;border:2px solid ${t.gold};border-radius:6px}
.frame:after{content:"";position:absolute;inset:10px;border:1px solid ${t.gold};opacity:.55;border-radius:4px}
.main{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:90px 110px 60px}
.series{color:${t.gold};font-weight:800;font-size:26px;letter-spacing:.5px;margin-bottom:22px}
.verse{font-family:'AmiriQ',serif;color:${t.verse};font-size:76px;line-height:2.05;margin:18px 0 4px}
.ref{color:${t.soft};font-size:26px;margin-bottom:26px}
.lesson{font-weight:700;font-size:42px;line-height:1.75;margin-top:30px;max-width:820px}
.src{margin-top:34px;font-size:22px;color:${t.soft};line-height:1.6;max-width:780px}
.src b{color:${t.ink};font-weight:700}
.foot{position:relative;background:#fff;border-top:5px solid #c9a24a;height:130px;display:flex;align-items:center;justify-content:space-between;padding:0 56px 0 80px}
.foot .t{font-size:26px;color:#42586c;font-weight:700}
.foot .t b{color:#0c3155;font-weight:900}
.foot img{height:112px}
</style></head><body>
<div class="frame"></div>
<div class="main" id="m">
  <div class="series">${esc(d.series)}</div>
  ${orn}
  <p class="verse" id="v">﴿${esc(d.verse)}﴾</p>
  <p class="ref">${ref}</p>
  ${orn}
  <p class="lesson" id="w">${esc(d.wisdom)}</p>
  <p class="src">من مقال: <b>${esc(d.title)}</b></p>
</div>
<div class="foot"><span class="t"><bdi><b>التميّز 10X</b></bdi> · <bdi dir="ltr">tamayuz10x.com</bdi></span><img src="file://${logo}" alt=""></div>
</body></html>`;

const out = resolve(spec.out_dir, `${spec.slug}-ar.html`);
writeFileSync(out, html);
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
await p.goto('file://' + out, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
const sizes = await p.evaluate(() => {
  const m = document.getElementById('m'), v = document.getElementById('v'), w = document.getElementById('w');
  let vs = 76, ws = 42;
  while (m.scrollHeight > m.clientHeight && (vs > 48 || ws > 30)) {
    if (vs > 48) { vs -= 4; v.style.fontSize = vs + 'px'; }
    if (ws > 30) { ws -= 2; w.style.fontSize = ws + 'px'; }
  }
  return { verse_px: vs, lesson_px: ws };
});
const ok = await p.evaluate(() => document.fonts.check('700 40px Tajawal'));
const png = resolve(spec.out_dir, `${spec.slug}-ar.png`);
await p.screenshot({ path: png, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
console.log(JSON.stringify({ png, ...sizes, tajawal_loaded: ok }));
await browser.close();
