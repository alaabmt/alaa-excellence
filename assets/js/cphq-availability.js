// Counts only: this request does not reserve questions or expose bank contents.
(async () => {
  const label = document.getElementById('bank-availability');
  try {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
    const response = await fetch('https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/cphq-guest', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', guest_token: token }), signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) return;
    const data = await response.json();
    if (!Array.isArray(data.domains) || data.domains.length !== 7 ||
      data.domains.some(d => !Number.isInteger(d.domain) || d.domain < 1 || d.domain > 7 || !Number.isInteger(d.published) || d.published < 0)) return;
    const total = data.domains.reduce((sum, d) => sum + d.published, 0);
    label.textContent = `${total} practice questions are currently published across seven domains. You may answer each question once per UTC day. Availability can change as content is reviewed.`;
    for (const domain of data.domains) {
      const cell = document.querySelector(`[data-domain-count="${domain.domain}"]`);
      if (cell) cell.textContent = String(domain.published);
    }
  } catch { /* Keep useful fallback copy if counts cannot be loaded. */ }
})();
