(() => {
  const url = 'https://tamayuz10x.com/cphq-free.html';
  const status = document.getElementById('share-status');
  document.getElementById('copy-link').onclick = async () => {
    try { await navigator.clipboard.writeText(url); status.textContent = 'Link copied.'; }
    catch { status.textContent = 'Copy this link: ' + url; }
  };
  const share = document.getElementById('share-link');
  if (navigator.share) {
    share.hidden = false;
    share.onclick = async () => { try { await navigator.share({ title: 'Free CPHQ Learning Center', url }); } catch {} };
  }
})();
