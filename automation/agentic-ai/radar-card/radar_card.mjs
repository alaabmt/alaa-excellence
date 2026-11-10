// Weekly-radar social card (owner-approved design, 7 Nov 2026). Light ivory + teal band + company chips + author photo.
// Usage: node radar_card.mjs spec.json
// spec: {"out_dir":"...","slug":"radar-2026-11-07","ar":{eyebrow,date,q,sub,chips[],cta,name,role},"en":{...}}
// Arabic date ranges must be wrapped: "&#8294;1–7&#8297; نوفمبر 2026" (LRI/PDI) so digits keep reading order.
// Card copy rule (owner, 7 Nov 2026): no criticism or evidence caveats on the card; limits stay in the article and the post text.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const here = dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const W = resolve(here, 'author.jpg');
const LOGO = resolve(here, '../../../assets/images/file_0000000047188210ac6952e999d2eda7.png');
const OUT = spec.out_dir; mkdirSync(OUT, { recursive: true });
const T = { ar: { rtl: true, ...spec.ar }, en: { rtl: false, ...spec.en } };
const page=(l,t)=>`<!doctype html><html lang="${l}" dir="${t.rtl?'rtl':'ltr'}"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap">
<style>
*{box-sizing:border-box;margin:0;padding:0}html,body{width:1080px;height:1350px;overflow:hidden}
body{font-family:'Tajawal',sans-serif;background:#f6f1e6;color:#0c2d4a;position:relative;overflow:hidden}
.band{background:#0f5b66;color:#fff;height:150px;display:flex;align-items:center;justify-content:space-between;padding:0 72px}
.band b{font-size:34px;font-weight:800}.band span{font-size:28px;color:#bfe3e6;font-weight:500}
.clip{position:absolute;top:150px;left:0;width:1080px;height:640px;overflow:hidden}
.rings{position:absolute;top:0;${t.rtl?'left':'right'}:-170px;width:620px;height:620px;border-radius:50%;
 border:3px solid rgba(15,91,102,.10);box-shadow:inset 0 0 0 70px rgba(15,91,102,.035),inset 0 0 0 71px rgba(15,91,102,.09),inset 0 0 0 140px rgba(15,91,102,.035),inset 0 0 0 141px rgba(15,91,102,.09)}
.body{position:relative;padding:70px 72px 0}
.q{font-size:96px;font-weight:900;line-height:1.28;color:#0c2d4a;max-width:900px}
.q em{font-style:normal;color:#0f5b66}
.sub{margin-top:34px;font-size:38px;line-height:1.7;font-weight:500;color:#34495e;max-width:880px}
.chips{display:flex;gap:16px;margin-top:40px;flex-wrap:wrap}
.chip{background:#fff;border:3px solid #0f5b66;color:#0f5b66;border-radius:999px;padding:10px 30px;font-size:32px;font-weight:800;direction:ltr}
.bottom{position:absolute;left:0;right:0;bottom:0;height:330px;background:#0c2d4a;display:flex;align-items:center;gap:36px;padding:0 72px;color:#fff}
.ph{flex:0 0 250px;height:250px;border-radius:32px;border:5px solid #c9a24a;background:url('file://${W}') no-repeat;background-size:540px auto;background-position:-175px -45px}
.who b{display:block;white-space:nowrap;font-size:38px;font-weight:900;line-height:1.3}.who span{display:block;margin-top:6px;font-size:28px;color:#f3d98f;font-weight:700}
.who i{display:inline-block;margin-top:22px;background:#c9a24a;color:#0c2d4a;font-style:normal;font-weight:900;font-size:30px;padding:10px 28px;border-radius:14px}
.logo{margin-${t.rtl?'right':'left'}:auto;background:#fff;border-radius:18px;padding:10px 16px}.logo img{height:96px;display:block}
</style></head><body>
<div class="band"><b>${t.eyebrow}</b><span>${t.date}</span></div><div class="clip"><div class="rings"></div></div>
<div class="body"><p class="q" id="q">${t.q}</p><p class="sub">${t.sub}</p>
<div class="chips">${t.chips.map(c=>`<span class="chip">${c}</span>`).join('')}</div></div>
<div class="bottom"><div class="ph"></div><div class="who"><b>${t.name}</b><span>${t.role}</span><i>${t.cta} ${t.rtl?'←':'→'}</i></div><div class="logo"><img src="file://${LOGO}"></div></div>
</body></html>`;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:2});
for(const [l,t] of Object.entries(T)){if(!spec[l])continue;const f=`${OUT}/${spec.slug}-${l}.html`;writeFileSync(f,page(l,t));await p.goto('file://'+f,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const r=await p.evaluate(()=>{const q=document.getElementById('q').getBoundingClientRect(),c=document.querySelector('.chips').getBoundingClientRect(),bt=document.querySelector('.bottom').getBoundingClientRect();return {chipsBottom:c.bottom,bottomTop:bt.top}});
 await p.screenshot({path:`${OUT}/${spec.slug}-${l}.png`,clip:{x:0,y:0,width:1080,height:1350}});console.log(l,JSON.stringify(r));}
await b.close();
