const PDF_MIME_TYPE='application/pdf';
const PAGE_W=1240;
const PAGE_H=1754;
const ORDER=['A','R','T','P'];
const COLORS={A:'#0f9d8a',R:'#7557b7',T:'#2b6cb0',P:'#e58b2b'};

const TEXT={
  ar:{
    brand:'التميّز 10X',eyebrow:'بصمتك في التعلّم',title:'تقريرك البصري في التعلّم',completed:'تاريخ الإكمال',summary:'ملخص النتيجة',strongest:'أبرز تفضيل حالي',stretch:'مساحة مفيدة للتوسّع',meaning:'ماذا تعني هذه النتيجة لك؟',cycle:'دورة تعلّمك',next:'تجربتك القادمة في التعلّم',note:'يعرض هذا التقرير الأبعاد الأربعة المحفوظة في حسابك. وهو أداة للتأمل والتطوير، وليس للتشخيص أو الحكم على القدرة.',recovery:'أُعيد إنشاء هذا التقرير البصري من النتيجة المحفوظة بأمان في حسابك.',
    names:{A:'التعلّم بالممارسة',R:'التأمّل والمراجعة',T:'التحليل المفاهيمي',P:'التطبيق العملي'},
    short:{A:'الممارسة',R:'التأمّل',T:'الفهم',P:'التطبيق'},
    helps:{
      A:'تميل إلى الاستفادة عندما تستطيع المشاركة والتجريب وخوض الخبرة بصورة مباشرة.',
      R:'تميل إلى الاستفادة عندما يتاح لك وقت للملاحظة والمراجعة ومقارنة وجهات النظر قبل الاستنتاج.',
      T:'تميل إلى الاستفادة عندما تكون الأفكار منظمة منطقيًا ومدعومة بالمبادئ والأدلة والتفسير الواضح.',
      P:'تميل إلى الاستفادة عندما ترتبط الأفكار بحاجة واقعية ويمكن اختبار فائدتها ضمن ظروف حقيقية.'
    },
    tryNext:{
      A:'جرّب خطوة صغيرة أولًا، ثم توقّف لمراجعة ما حدث وما تعلّمته.',
      R:'خصّص وقتًا قصيرًا للمراجعة، ثم حوّل إحدى ملاحظاتك إلى خطوة عملية محددة.',
      T:'بعد فهم الفكرة ومنطقها، اختبرها في مثال محدد أو موقف واقعي.',
      P:'قبل التطبيق، اسأل عن المبدأ الذي يستند إليه الأسلوب وما الذي ستتعلّمه من النتيجة.'
    },
    cycleSteps:[['١. مارِس','ابدأ بخبرة أو تجربة مباشرة.'],['٢. تَأَمَّل','راجع ما حدث وما الذي لاحظته.'],['٣. اِفْهَم','حدّد المبدأ أو المنطق أو الدليل.'],['٤. طَبِّق','استخدم التعلّم في موقف واقعي.']],
    lead:k=>`أقوى تركيز حالي لديك هو ${k}. استخدمه كنقطة دخول إلى التعلّم، لا كتصنيف ثابت.`,
    stretchText:k=>`أضف بصورة مقصودة خطوة من ${k} حتى توسّع مرونتك عبر دورة التعلّم كاملة.`,
    clear:k=>`تفضيل واضح نحو ${k}`,
    blended:(a,b)=>`مزيج متقارب بين ${a} و${b}`,
    balanced:'ملف تعلّم متوازن نسبيًا',
    read:'اقرأ النِّسب كتفضيلات حالية لا كدرجات نجاح. الفروق الصغيرة لا تعني فروقًا في الذكاء أو القدرة.'
  },
  en:{
    brand:'Tamayuz 10X',eyebrow:'Learning Style Profile',title:'Your Visual Learning Report',completed:'Completed',summary:'Result summary',strongest:'Most prominent current preference',stretch:'Useful stretch area',meaning:'What do these results mean for you?',cycle:'Your learning cycle',next:'Your next learning experiment',note:'This report shows the four learning dimensions saved in your account. It is a reflective development tool, not a diagnostic or ability assessment.',recovery:'This visual report was rebuilt from the result securely saved in your account.',
    names:{A:'Learning through action',R:'Reflection and review',T:'Conceptual analysis',P:'Practical application'},
    short:{A:'Action',R:'Reflect',T:'Understand',P:'Apply'},
    helps:{A:'You tend to learn well when you can participate, experiment, and gain direct experience early.',R:'You tend to learn well when you have time to observe, review, compare perspectives, and think before concluding.',T:'You tend to learn well when ideas are logically structured and supported by principles, evidence, and clear explanations.',P:'You tend to learn well when ideas connect with a real need and can be tested under practical conditions.'},
    tryNext:{A:'Try one small experiment, then pause to review what happened and what you learned.',R:'Use a short review period, then convert one reflection into a specific next action.',T:'After understanding the logic, test the idea in one concrete example or real situation.',P:'Before applying a method, ask what principle supports it and what you will learn from the result.'},
    cycleSteps:[['1. Do','Start with direct experience or a small experiment.'],['2. Reflect','Review what happened and what you noticed.'],['3. Understand','Identify the principle, logic, or evidence.'],['4. Apply','Use the learning in a real situation.']],
    lead:k=>`Your strongest current emphasis is ${k}. Use it as an entry point to learning, not as a fixed label.`,
    stretchText:k=>`Deliberately add a step from ${k} to build flexibility across the whole learning cycle.`,
    clear:k=>`Clear preference for ${k}`,
    blended:(a,b)=>`Close blend of ${a} and ${b}`,
    balanced:'Relatively balanced learning profile',
    read:'Read the percentages as current preferences, not grades. Small differences do not imply differences in intelligence or ability.'
  }
};

function language(result,options){
  const requested=options?.lang||result?.language||'ar';
  return requested==='en'?'en':'ar';
}

function scores(result){
  const p=result?.scores?.percent||{};
  const out={};
  for(const k of ORDER){
    const n=Number(p[k]);
    if(!Number.isFinite(n)||n<0||n>100)throw new Error('SAVED_LPP_SCORES_INVALID');
    out[k]=Math.round(n);
  }
  return out;
}

function profileInfo(p,tx){
  const ranked=ORDER.map(code=>({code,score:p[code]})).sort((a,b)=>b.score-a.score||ORDER.indexOf(a.code)-ORDER.indexOf(b.code));
  const high=ranked[0],second=ranked[1],low=ranked[ranked.length-1];
  const spread=high.score-low.score,gap=high.score-second.score;
  let title;
  if(spread<=10)title=tx.balanced;
  else if(gap>=10)title=tx.clear(tx.names[high.code]);
  else title=tx.blended(tx.names[high.code],tx.names[second.code]);
  return {ranked,high,second,low,title};
}

function page(lang){
  const c=document.createElement('canvas');
  c.width=PAGE_W;c.height=PAGE_H;
  const x=c.getContext('2d');
  x.fillStyle='#ffffff';x.fillRect(0,0,PAGE_W,PAGE_H);
  x.direction=lang==='ar'?'rtl':'ltr';
  x.textAlign=lang==='ar'?'right':'left';
  x.textBaseline='alphabetic';
  return {canvas:c,ctx:x};
}

function setFont(ctx,size,weight='400'){
  ctx.font=`${weight} ${size}px Tahoma, "Segoe UI", Arial, sans-serif`;
}

function drawText(ctx,text,x,y,maxWidth,lineHeight,opts={}){
  const words=String(text||'').split(/\s+/).filter(Boolean);
  if(!words.length)return y;
  const rtl=ctx.direction==='rtl';
  const lines=[];let line='';
  for(const word of words){
    const test=line?`${line} ${word}`:word;
    if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;}else line=test;
  }
  if(line)lines.push(line);
  const maxLines=opts.maxLines||99;
  lines.slice(0,maxLines).forEach((ln,i)=>ctx.fillText(ln,x,y+i*lineHeight,maxWidth));
  return y+Math.min(lines.length,maxLines)*lineHeight;
}

function roundRect(ctx,x,y,w,h,r,fill,stroke=''){
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}
}

function header(ctx,tx,lang,pageNo){
  roundRect(ctx,70,55,1100,126,28,'#0b2545');
  ctx.fillStyle='#ffffff';setFont(ctx,34,'700');
  ctx.textAlign=lang==='ar'?'right':'left';ctx.fillText(tx.brand,lang==='ar'?1115:125,113);
  setFont(ctx,20,'600');ctx.fillStyle='#cfe8ff';ctx.fillText(tx.eyebrow,lang==='ar'?1115:125,151);
  ctx.fillStyle='#64748b';setFont(ctx,16,'400');ctx.textAlign=lang==='ar'?'left':'right';ctx.fillText(String(pageNo),lang==='ar'?125:1115,1645);
  ctx.textAlign=lang==='ar'?'right':'left';
}

function footer(ctx,tx,lang){
  ctx.strokeStyle='#e2e8f0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(90,1588);ctx.lineTo(1150,1588);ctx.stroke();
  ctx.fillStyle='#64748b';setFont(ctx,16,'400');
  drawText(ctx,tx.note,lang==='ar'?1140:100,1625,1040,26,{maxLines:2});
}

function drawScoreRows(ctx,p,tx,lang,startY){
  let y=startY;
  for(const k of ORDER){
    const color=COLORS[k];
    roundRect(ctx,100,y,1040,132,22,'#f8fafc','#e2e8f0');
    const labelX=lang==='ar'?1090:150;
    ctx.fillStyle='#0f172a';setFont(ctx,26,'700');ctx.textAlign=lang==='ar'?'right':'left';ctx.fillText(tx.names[k],labelX,y+43);
    ctx.fillStyle=color;roundRect(ctx,150,y+74,820,22,11,'#e6edf4');roundRect(ctx,150,y+74,Math.max(16,820*p[k]/100),22,11,color);
    ctx.fillStyle=color;setFont(ctx,31,'800');ctx.textAlign=lang==='ar'?'left':'right';ctx.fillText(`${p[k]}%`,lang==='ar'?155:1085,y+54);
    y+=150;
  }
  ctx.textAlign=lang==='ar'?'right':'left';
  return y;
}

function pageOne(result,p,info,tx,lang){
  const {canvas,ctx}=page(lang);header(ctx,tx,lang,1);
  ctx.fillStyle='#0b2545';setFont(ctx,44,'800');ctx.fillText(tx.title,lang==='ar'?1120:100,260);
  ctx.fillStyle='#475569';setFont(ctx,23,'500');ctx.fillText(info.title,lang==='ar'?1120:100,310);
  const completed=new Date(result?.completedAt||Date.now());
  const dateText=Number.isFinite(completed.getTime())?completed.toLocaleString(lang==='ar'?'ar-AE':'en-GB'):'—';
  ctx.fillStyle='#64748b';setFont(ctx,18,'400');ctx.fillText(`${tx.completed}: ${dateText}`,lang==='ar'?1120:100,350);
  ctx.fillStyle='#0f172a';setFont(ctx,30,'800');ctx.fillText(tx.summary,lang==='ar'?1120:100,425);
  let y=drawScoreRows(ctx,p,tx,lang,465);
  const cardW=500,cardH=210,gap=40,left=100,right=640;
  roundRect(ctx,left,y+20,cardW,cardH,24,'#eef8f6');
  roundRect(ctx,right,y+20,cardW,cardH,24,'#fff7ed');
  ctx.fillStyle=COLORS[info.high.code];setFont(ctx,21,'800');ctx.fillText(tx.strongest,lang==='ar'?left+cardW-28:left+28,y+65);
  ctx.fillStyle='#0f172a';setFont(ctx,25,'700');ctx.fillText(`${tx.names[info.high.code]} — ${info.high.score}%`,lang==='ar'?left+cardW-28:left+28,y+106);
  ctx.fillStyle='#334155';setFont(ctx,18,'400');drawText(ctx,tx.lead(tx.names[info.high.code]),lang==='ar'?left+cardW-28:left+28,y+145,cardW-56,27,{maxLines:3});
  ctx.fillStyle=COLORS[info.low.code];setFont(ctx,21,'800');ctx.fillText(tx.stretch,lang==='ar'?right+cardW-28:right+28,y+65);
  ctx.fillStyle='#0f172a';setFont(ctx,25,'700');ctx.fillText(`${tx.names[info.low.code]} — ${info.low.score}%`,lang==='ar'?right+cardW-28:right+28,y+106);
  ctx.fillStyle='#334155';setFont(ctx,18,'400');drawText(ctx,tx.stretchText(tx.names[info.low.code]),lang==='ar'?right+cardW-28:right+28,y+145,cardW-56,27,{maxLines:3});
  footer(ctx,tx,lang);return canvas;
}

function pageTwo(p,info,tx,lang){
  const {canvas,ctx}=page(lang);header(ctx,tx,lang,2);
  ctx.fillStyle='#0b2545';setFont(ctx,38,'800');ctx.fillText(tx.meaning,lang==='ar'?1120:100,260);
  ctx.fillStyle='#475569';setFont(ctx,20,'400');drawText(ctx,tx.read,lang==='ar'?1120:100,310,1020,31,{maxLines:3});
  const positions=[[100,410],[640,410],[100,920],[640,920]];
  ORDER.forEach((k,i)=>{
    const [x,y]=positions[i],w=500,h=430,color=COLORS[k];
    roundRect(ctx,x,y,w,h,28,'#ffffff','#dbe4ee');
    roundRect(ctx,x,y,w,14,7,color);
    ctx.fillStyle=color;setFont(ctx,25,'800');ctx.fillText(`${tx.names[k]} — ${p[k]}%`,lang==='ar'?x+w-30:x+30,y+62);
    ctx.fillStyle='#0f172a';setFont(ctx,19,'700');ctx.fillText(lang==='ar'?'كيف قد يساعدك':'How this may help',lang==='ar'?x+w-30:x+30,y+112);
    ctx.fillStyle='#334155';setFont(ctx,18,'400');let yy=drawText(ctx,tx.helps[k],lang==='ar'?x+w-30:x+30,y+149,w-60,29,{maxLines:5});
    ctx.fillStyle='#0f172a';setFont(ctx,19,'700');ctx.fillText(lang==='ar'?'خطوة عملية مقترحة':'A practical next step',lang==='ar'?x+w-30:x+30,yy+28);
    ctx.fillStyle='#334155';setFont(ctx,18,'400');drawText(ctx,tx.tryNext[k],lang==='ar'?x+w-30:x+30,yy+65,w-60,29,{maxLines:5});
  });
  footer(ctx,tx,lang);return canvas;
}

function pageThree(info,tx,lang){
  const {canvas,ctx}=page(lang);header(ctx,tx,lang,3);
  ctx.fillStyle='#0b2545';setFont(ctx,38,'800');ctx.fillText(tx.cycle,lang==='ar'?1120:100,260);
  let y=350;
  tx.cycleSteps.forEach((step,i)=>{
    const k=ORDER[i],color=COLORS[k];
    roundRect(ctx,130,y,980,190,28,'#f8fafc','#dbe4ee');
    roundRect(ctx,lang==='ar'?1010:130,y,100,190,28,color);
    ctx.fillStyle='#ffffff';setFont(ctx,36,'800');ctx.textAlign='center';ctx.fillText(String(i+1),lang==='ar'?1060:180,y+110);
    ctx.textAlign=lang==='ar'?'right':'left';ctx.fillStyle=color;setFont(ctx,28,'800');ctx.fillText(step[0],lang==='ar'?970:270,y+72);
    ctx.fillStyle='#334155';setFont(ctx,21,'400');drawText(ctx,step[1],lang==='ar'?970:270,y+118,690,32,{maxLines:2});
    y+=220;
  });
  roundRect(ctx,100,1260,1040,220,28,'#eef5ff');
  ctx.fillStyle='#0b2545';setFont(ctx,28,'800');ctx.fillText(tx.next,lang==='ar'?1100:140,1320);
  ctx.fillStyle='#334155';setFont(ctx,21,'400');
  const experiment=lang==='ar'?`في تعلّمك القادم، ابدأ من ${tx.names[info.high.code]} ثم أضف خطوة مقصودة من ${tx.names[info.low.code]}. الهدف هو زيادة المرونة، لا تغيير هويتك.`:`In your next learning task, start with ${tx.names[info.high.code]} and deliberately add one step from ${tx.names[info.low.code]}. The goal is greater flexibility, not changing who you are.`;
  drawText(ctx,experiment,lang==='ar'?1100:140,1372,960,34,{maxLines:4});
  ctx.fillStyle='#64748b';setFont(ctx,16,'400');drawText(ctx,tx.recovery,lang==='ar'?1100:140,1515,960,25,{maxLines:2});
  footer(ctx,tx,lang);return canvas;
}

function canvasJpeg(canvas){
  const b64=canvas.toDataURL('image/jpeg',0.92).split(',')[1];
  const bin=atob(b64),u=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  return u;
}

function pagesToPdf(canvases){
  const enc=new TextEncoder(),parts=[],offsets=[0];let len=0;
  const pushText=s=>{const b=enc.encode(s);parts.push(b);len+=b.length;};
  const pushBytes=b=>{parts.push(b);len+=b.length;};
  pushText('%PDF-1.4\n%TAMAYUZ10X\n');
  const n=canvases.length,maxObj=2+n*3;
  const obj=(num,body,bytes)=>{offsets[num]=len;pushText(`${num} 0 obj\n${body}`);if(bytes){pushText('\nstream\n');pushBytes(bytes);pushText('\nendstream');}pushText('\nendobj\n');};
  const kids=[];for(let i=0;i<n;i++)kids.push(`${3+i*3} 0 R`);
  obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${n} >>`);
  for(let i=0;i<n;i++){
    const pageObj=3+i*3,img=4+i*3,content=5+i*3,jpg=canvasJpeg(canvases[i]);
    obj(pageObj,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 ${img} 0 R >> >> /Contents ${content} 0 R >>`);
    obj(img,`<< /Type /XObject /Subtype /Image /Width ${canvases[i].width} /Height ${canvases[i].height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>`,jpg);
    const stream=enc.encode('q\n595 0 0 842 0 0 cm\n/Im0 Do\nQ');obj(content,`<< /Length ${stream.length} >>`,stream);
  }
  const xref=len;pushText(`xref\n0 ${maxObj+1}\n0000000000 65535 f \n`);for(let i=1;i<=maxObj;i++)pushText(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);pushText(`trailer\n<< /Size ${maxObj+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  const blob=new Blob(parts,{type:PDF_MIME_TYPE});
  if(blob.size<20000)throw new Error('SAVED_LPP_PDF_INVALID');
  return blob;
}

export async function createSavedLearningPreferenceReportPdf(result,options={}){
  const lang=language(result,options),tx=TEXT[lang],p=scores(result),info=profileInfo(p,tx);
  await document.fonts?.ready?.catch?.(()=>{});
  return pagesToPdf([pageOne(result,p,info,tx,lang),pageTwo(p,info,tx,lang),pageThree(info,tx,lang)]);
}
