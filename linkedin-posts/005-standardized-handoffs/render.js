const { chromium } = require('playwright');
const path=require('path');
(async()=>{
 const dir=process.argv[2];
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
 for (const lang of (process.argv[3]||'ar,en').split(',')){
  const p=await b.newPage({viewport:{width:1080,height:1350}});
  await p.goto('file://'+path.join(dir,`slides-${lang}.html`),{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);
  await p.addStyleTag({content:'html,body{background:none}'});
  await p.pdf({path:path.join(dir,`carousel-${lang}.pdf`),width:'1080px',height:'1350px',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});
  const els=await p.$$('section.slide');
  for (let i=0;i<els.length;i++) await els[i].screenshot({path:path.join(dir,'preview',`${lang}-${i+1}.png`)});
  const fonts=await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight));
  console.log(lang,els.length,fonts.join(', '));
  // overflow check
  const ov=await p.evaluate(()=>[...document.querySelectorAll('section.slide')].map((s,i)=>{const f=s.querySelector('.footer').getBoundingClientRect().top;let m=0;s.querySelectorAll('h1,h2,p,li,.box,.q,.bars,.stat,.big,.swipe').forEach(e=>{if(e.closest('.footer'))return;m=Math.max(m,e.getBoundingClientRect().bottom)});return [i+1,Math.round(f-m)]}));
  console.log('gap to footer',JSON.stringify(ov));
 }
 await b.close();
})();
