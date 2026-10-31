/* Tamayuz 10X unified bilingual navigation — single source of truth. */
(()=>{if(window.__tamayuzUnifiedNav)return;window.__tamayuzUnifiedNav=true;
const ar=(document.documentElement.lang||'ar').toLowerCase().startsWith('ar');
const base=ar?'':'/en';
const items=ar?[
['/','الرئيسية'],['/vision-mission-values.html','الرؤية والرسالة والقيم'],['/about.html','عن الدكتور علاء محمد أحمد'],['/#tenx-10x','التميّز 10X'],['/articles.html','بوابة المعرفة التطبيقية'],['/books.html','الكتب'],['/research.html','الأبحاث والمنشورات'],['/personality.html','مختبر اكتشاف الذات'],['/training.html','بناء القدرات']
]:[['/en/','Home'],['/en/vision-mission-values.html','Vision, Mission & Values'],['/en/about.html','About Dr. Alaa Mohammad Ahmed'],['/en/#tenx-10x','Tamayuz 10X'],['/en/articles.html','Applied Knowledge Portal'],['/en/books.html','Books'],['/en/research.html','Research & Publications'],['/en/personality.html','Self-Discovery Lab'],['/en/training.html','Capability Building']];
const centers=ar?[
['/ai-center.html','مركز الذكاء الاصطناعي'],['/fmea.html','مركز هندسة الوقاية (FMEA)'],['/excellence-leadership.html','مركز التميّز والقيادة'],['/healthcare-excellence.html','مركز التميّز الصحي'],['/quranic-reflections.html','مركز التأملات القرآنية']
]:[['/en/ai-center.html','Artificial Intelligence Center'],['/en/fmea.html','Preventive Engineering (FMEA)'],['/en/excellence-leadership.html','Excellence & Leadership'],['/en/healthcare-excellence.html','Healthcare Excellence'],['/en/quranic-reflections.html','Qur’anic Reflections']];
function init(){const header=document.querySelector('header.site-header,header.sitehead,header.header');if(!header)return;
if(header.querySelector('#tx-unified-nav'))return;
const old=header.querySelector('.main-nav,nav.nav');if(old)old.hidden=true;
header.querySelectorAll('.menu-toggle').forEach(b=>{b.hidden=true;b.setAttribute('aria-hidden','true')});
const nav=document.createElement('nav');nav.id='tx-unified-nav';nav.setAttribute('aria-label',ar?'القائمة الرئيسية':'Main navigation');
const trigger=document.createElement('button');trigger.type='button';trigger.className='tx-nav-toggle';trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','tx-nav-panel');trigger.textContent=ar?'☰ القائمة':'☰ Menu';
const panel=document.createElement('div');panel.id='tx-nav-panel';panel.className='tx-nav-panel';
const current=location.pathname.replace(/\/$/,'/')||'/';
function link([href,label]){const a=document.createElement('a');a.href=href;a.textContent=label;if(current===href){a.setAttribute('aria-current','page');a.className='tx-current'}return a}
items.forEach((item,i)=>{if(i===4){const details=document.createElement('details');details.className='tx-centers';const summary=document.createElement('summary');summary.textContent=item[1];details.append(summary);const submenu=document.createElement('div');submenu.className='tx-submenu';submenu.append(link(item));centers.forEach(c=>submenu.append(link(c)));details.append(submenu);if(centers.some(c=>c[0]===current)||item[0]===current)details.classList.add('tx-active');panel.append(details)}else panel.append(link(item))});
nav.append(trigger,panel);if(old)old.after(nav);else header.append(nav);
trigger.addEventListener('click',()=>{const open=nav.classList.toggle('tx-open');trigger.setAttribute('aria-expanded',String(open))});
nav.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('tx-open');trigger.setAttribute('aria-expanded','false');trigger.focus()}});
document.addEventListener('click',e=>{if(!nav.contains(e.target)){nav.classList.remove('tx-open');trigger.setAttribute('aria-expanded','false')}});
}
const css=document.createElement('style');css.id='tx-unified-nav-css';css.textContent=`
header .main-nav[hidden],header nav.nav[hidden],header .menu-toggle[hidden]{display:none!important}
#tx-unified-nav{position:relative;z-index:90;background:#fff;border-top:1px solid #e4e8ed;border-bottom:1px solid #e4e8ed;font-family:system-ui,-apple-system,"Segoe UI",Tahoma,Arial,sans-serif;direction:inherit}
#tx-unified-nav *{box-sizing:border-box}
#tx-unified-nav .tx-nav-panel{max-width:1200px;margin:auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0 12px;padding:5px 16px}
#tx-unified-nav a,#tx-unified-nav summary{display:block;text-decoration:none;color:#19364e;font-size:13px;line-height:1.5;padding:12px 9px;cursor:pointer}
#tx-unified-nav a:hover,#tx-unified-nav summary:hover,#tx-unified-nav a:focus-visible,#tx-unified-nav summary:focus-visible{background:#f2f6f9;color:#174d73}
#tx-unified-nav a.tx-current,#tx-unified-nav .tx-active>summary{color:#205b83;font-weight:700}
#tx-unified-nav .tx-centers{position:relative}
#tx-unified-nav .tx-centers>summary{list-style:none}
#tx-unified-nav .tx-centers>summary::-webkit-details-marker{display:none}
#tx-unified-nav .tx-centers>summary:after{content:' ▾';font-size:12px}
#tx-unified-nav .tx-submenu{position:absolute;top:100%;inset-inline-start:0;min-width:260px;background:#fff;border:1px solid #dfe6ed;border-radius:10px;box-shadow:0 12px 30px #102c421c;padding:6px;z-index:99}
#tx-unified-nav .tx-submenu a{padding:11px 12px;white-space:normal}
#tx-unified-nav .tx-nav-toggle{display:none}
@media(max-width:850px){
#tx-unified-nav{padding:0 16px}
#tx-unified-nav .tx-nav-toggle{display:block;width:100%;min-height:48px;text-align:start;border:0;background:#fff;color:#17354e;font:700 16px system-ui,-apple-system,"Segoe UI",Tahoma,Arial,sans-serif;cursor:pointer}
#tx-unified-nav .tx-nav-panel{display:none;padding:4px 0 12px;max-height:70vh;overflow-y:auto;flex-direction:column;align-items:stretch;gap:0}
#tx-unified-nav.tx-open .tx-nav-panel{display:flex}
#tx-unified-nav .tx-nav-panel>a,#tx-unified-nav .tx-centers>summary{font-size:15px;padding:13px 12px;border-bottom:1px solid #e8edf1;min-height:48px}
#tx-unified-nav .tx-submenu{position:static;min-width:0;border:0;box-shadow:none;border-radius:0;background:#f6f9fb;padding:2px 8px}
#tx-unified-nav .tx-submenu a{font-size:14px;padding:12px 14px;min-height:44px}
#tx-unified-nav .tx-centers:not([open]) .tx-submenu{display:none}
}`;document.head.append(css);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();