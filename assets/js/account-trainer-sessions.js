import { listTrainerSessions, setTrainerSessionStatus } from '/assets/js/trainer-sessions-client.js';

function ensureTrainerSessionsRoot(){
  let root=document.getElementById('trainerSessions');
  if(root)return root;
  const footer=document.querySelector('.account-footer-actions');
  const shell=document.querySelector('.account-shell');
  if(!shell)return null;
  const card=document.createElement('div');
  card.className='card';
  card.innerHTML='<h2 id="trainerSessionsTitle">جلساتي التدريبية</h2><div id="trainerSessions" class="muted">جارٍ التحميل…</div>';
  if(footer) shell.insertBefore(card,footer); else shell.appendChild(card);
  return card.querySelector('#trainerSessions');
}

const root = ensureTrainerSessionsRoot();
if (root) {
  const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
  const t = lang === 'ar' ? {
    title: 'جلساتي التدريبية', loading: 'جارٍ تحميل جلساتك التدريبية…', empty: 'لا توجد جلسات تدريبية محفوظة في حسابك حتى الآن.', failed: 'تعذر تحميل الجلسات التدريبية الآن.',
    completed: 'أكملوا التقييم', code: 'رمز الجلسة', open: 'مفتوحة', archived: 'مؤرشفة', results: 'عرض النتائج', share: 'فتح رابط المشاركين', archive: 'أرشفة الجلسة', restore: 'إعادة فتحها في الحساب', unknown: '—'
  } : {
    title: 'My trainer sessions', loading: 'Loading your trainer sessions…', empty: 'No trainer sessions are saved in your account yet.', failed: 'Trainer sessions could not be loaded right now.',
    completed: 'completed', code: 'Session code', open: 'Open', archived: 'Archived', results: 'View results', share: 'Open participant link', archive: 'Archive session', restore: 'Restore in account', unknown: '—'
  };
  const heading = document.getElementById('trainerSessionsTitle');
  if (heading) heading.textContent = t.title;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dateText = (value) => { const d = new Date(value); return Number.isNaN(d.getTime()) ? '' : d.toLocaleString(lang === 'ar' ? 'ar-AE' : 'en-AE'); };

  async function load() {
    root.className = 'muted'; root.textContent = t.loading;
    try {
      const data = await listTrainerSessions({ includeSummary: true });
      const sessions = data?.sessions || [];
      if (!sessions.length) { root.textContent = t.empty; return; }
      root.className = '';
      root.innerHTML = sessions.map((s) => {
        const n = s.completed_participants ?? t.unknown;
        const status = s.status === 'archived' ? t.archived : t.open;
        const dashboard = `/tools/learning-preference-profile/trainer-dashboard.html?session=${encodeURIComponent(s.session_code)}`;
        return `<article class="attempt trainer-session-row" data-trainer-session="${esc(s.session_code)}"><div class="row"><div><strong>${esc(s.session_name || (lang === 'ar' ? 'جلسة تفضيلات التعلّم' : 'Learning preference session'))}</strong><br><span class="muted">${t.code}: <b dir="ltr">${esc(s.session_code)}</b> · ${status} · ${esc(dateText(s.created_at))}</span></div><div class="metric" style="min-width:120px;text-align:center"><strong>${esc(n)}</strong><span>${t.completed}</span></div></div><div class="attempt-actions"><a class="btn" href="${dashboard}">${t.results}</a>${s.join_url ? `<a class="btn secondary" href="${esc(s.join_url)}" target="_blank" rel="noopener">${t.share}</a>` : ''}<button class="btn secondary" data-session-status="${s.status === 'archived' ? 'open' : 'archived'}" data-session-code="${esc(s.session_code)}">${s.status === 'archived' ? t.restore : t.archive}</button></div></article>`;
      }).join('');
      root.querySelectorAll('[data-session-status]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          btn.disabled = true;
          try { await setTrainerSessionStatus(btn.dataset.sessionCode, btn.dataset.sessionStatus); await load(); }
          catch (e) { console.error(e); btn.disabled = false; }
        });
      });
    } catch (e) { console.error('Trainer sessions load failed:', e); root.textContent = t.failed; }
  }
  load();
}
