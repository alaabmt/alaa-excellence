const PDF_MIME_TYPE='application/pdf';

function isVisible(el){
  if(!el)return false;
  const cs=getComputedStyle(el),r=el.getBoundingClientRect();
  return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0&&r.width>300&&Math.max(r.height,el.scrollHeight)>500;
}

function reportMarkers(text){
  return /كيف تقرأ نتيجتك|How to read your result/i.test(text)&&/تفضيلاتك الأربعة|learning preferences/i.test(text);
}

function pickReportRoot(key){
  if(key!=='learning-preference-profile')return document.body;
  const all=[...document.querySelectorAll('#lppApp,.participant-enhanced,main,article,section,div')].filter(isVisible);
  const marked=all.filter(el=>reportMarkers((el.innerText||'').trim()));
  if(marked.length){
    marked.sort((a,b)=>{
      const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
      const aa=Math.max(a.scrollHeight,ar.height)*Math.max(a.scrollWidth,ar.width);
      const ba=Math.max(b.scrollHeight,br.height)*Math.max(b.scrollWidth,br.width);
      return aa-ba;
    });
    const preferred=marked.find(el=>Math.max(el.scrollHeight,el.getBoundingClientRect().height)>1400&&el.getBoundingClientRect().width>650);
    if(preferred)return preferred;
  }
  return document.querySelector('.participant-enhanced')||document.querySelector('#lppApp')||document.body;
}

async function waitForVisualReport(key){
  for(let i=0;i<100;i++){
    const root=pickReportRoot(key),text=(root?.innerText||'');
    if(root&&isVisible(root)&&reportMarkers(text)){
      await new Promise(r=>setTimeout(r,700));
      return root;
    }
    await new Promise(r=>setTimeout(r,250));
  }
  return pickReportRoot(key);
}

function loadScript(src,marker,ready){
  return new Promise((resolve,reject)=>{
    if(ready()){resolve();return;}
    const existing=document.querySelector(`script[data-${marker}]`);
    if(existing){existing.addEventListener('load',()=>ready()?resolve():reject(new Error(`${marker.toUpperCase()}_UNAVAILABLE`)),{once:true});existing.addEventListener('error',reject,{once:true});return;}
    const s=document.createElement('script');s.src=src;s.async=true;s.setAttribute(`data-${marker}`,'1');s.onload=()=>ready()?resolve():reject(new Error(`${marker.toUpperCase()}_UNAVAILABLE`));s.onerror=()=>reject(new Error(`${marker.toUpperCase()}_LOAD_FAILED`));document.head.appendChild(s);
  });
}

async function ensureHtml2Canvas(){
  await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js','tamayuz-html2canvas',()=>!!window.html2canvas);
  return window.html2canvas;
}

async function ensureJsPdf(){
  await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js','tamayuz-jspdf',()=>!!window.jspdf?.jsPDF);
  return window.jspdf.jsPDF;
}

function canvasHasContent(canvas){
  if(!canvas||canvas.width<100||canvas.height<100)return false;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const cols=24,rows=32;let nonWhite=0,dark=0;
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
    const px=Math.min(canvas.width-1,Math.floor((x+.5)*canvas.width/cols));
    const py=Math.min(canvas.height-1,Math.floor((y+.5)*canvas.height/rows));
    const d=ctx.getImageData(px,py,1,1).data;
    if(d[3]>0&&(d[0]<248||d[1]<248||d[2]<248))nonWhite++;
    if(d[3]>0&&(d[0]<210||d[1]<210||d[2]<210))dark++;
  }
  return nonWhite>=18&&dark>=4;
}

function ignoreCaptureElement(el){
  return !!el.matches?.('button,input,select,textarea,[role="button"],iframe,video,audio,object,embed,canvas,script,noscript');
}

async function captureElement(html2canvas,root){
  const rect=root.getBoundingClientRect();
  const width=Math.max(800,Math.ceil(root.scrollWidth||rect.width||1200));
  const height=Math.max(1200,Math.ceil(root.scrollHeight||rect.height||1600));
  const maxHeight=18000;
  const scale=Math.min(1.5,maxHeight/height);
  const canvas=await html2canvas(root,{
    backgroundColor:'#ffffff',
    scale:Math.max(.8,scale),
    useCORS:true,
    allowTaint:false,
    logging:false,
    foreignObjectRendering:false,
    removeContainer:true,
    width,
    height,
    x:0,
    y:0,
    scrollX:-window.scrollX,
    scrollY:-window.scrollY,
    windowWidth:Math.max(document.documentElement.clientWidth,width),
    windowHeight:Math.max(document.documentElement.clientHeight,Math.min(height,9000)),
    ignoreElements:ignoreCaptureElement,
    onclone:(doc)=>{
      doc.querySelectorAll('button,input,select,textarea,[role="button"],iframe,video,audio,object,embed,canvas,script,noscript').forEach(el=>el.remove());
      doc.documentElement.style.background='#fff';
      doc.body.style.background='#fff';
    }
  });
  return canvas;
}

async function visualSnapshot(root){
  const html2canvas=await ensureHtml2Canvas();
  let canvas=await captureElement(html2canvas,root);
  if(canvasHasContent(canvas))return canvas;

  const bodyCanvas=await captureElement(html2canvas,document.body);
  if(canvasHasContent(bodyCanvas))return bodyCanvas;

  throw new Error('VISUAL_REPORT_BLANK');
}

function sliceSnapshot(snapshot){
  const slices=[];
  const pageRatio=841.89/595.28;
  const sourcePageHeight=Math.max(1,Math.floor(snapshot.width*pageRatio));
  let sy=0;
  while(sy<snapshot.height){
    const sh=Math.min(sourcePageHeight,snapshot.height-sy);
    const c=document.createElement('canvas');
    c.width=snapshot.width;c.height=sh;
    const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
    ctx.drawImage(snapshot,0,sy,snapshot.width,sh,0,0,snapshot.width,sh);
    if(canvasHasContent(c)||slices.length===0)slices.push(c);
    sy+=sh;
  }
  return slices;
}

async function canvasesToPdf(canvases){
  const JsPdf=await ensureJsPdf();
  const pdf=new JsPdf({orientation:'portrait',unit:'pt',format:'a4',compress:true,putOnlyUsedFonts:true});
  const pageW=595.28,pageH=841.89;
  canvases.forEach((canvas,i)=>{
    if(i>0)pdf.addPage('a4','portrait');
    const ratio=Math.min(pageW/canvas.width,pageH/canvas.height);
    const w=canvas.width*ratio,h=canvas.height*ratio;
    const x=(pageW-w)/2;
    pdf.addImage(canvas.toDataURL('image/jpeg',0.92),'JPEG',x,0,w,h,undefined,'FAST');
  });
  const blob=pdf.output('blob');
  if(!(blob instanceof Blob)||blob.type!==PDF_MIME_TYPE||blob.size<5000)throw new Error('VISUAL_REPORT_PDF_INVALID');
  return blob;
}

export async function createAssessmentReportPdf(assessmentKey,result){
  const root=await waitForVisualReport(assessmentKey);
  if(!root||!isVisible(root))throw new Error('VISUAL_REPORT_NOT_READY');
  const snapshot=await visualSnapshot(root);
  const pages=sliceSnapshot(snapshot);
  if(!pages.length)throw new Error('VISUAL_REPORT_CAPTURE_FAILED');
  return canvasesToPdf(pages);
}
