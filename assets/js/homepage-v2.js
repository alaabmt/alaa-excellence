
(() => {
  const root = document.querySelector('.home-v2');
  if (!root || window.__tamayuzHomeV2Loaded) return;
  window.__tamayuzHomeV2Loaded = true;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  function enableTilt(stage, maxX, maxY) {
    if (!stage || reduceMotion || !finePointer) return;
    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - .5;
      const py = (event.clientY - rect.top) / rect.height - .5;
      stage.style.transform = \`rotateX(\${(-py * maxX).toFixed(2)}deg) rotateY(\${(px * maxY).toFixed(2)}deg)\`;
    });
    stage.addEventListener('pointerleave', () => {
      stage.style.transform = '';
    });
  }

  enableTilt(document.querySelector('[data-tilt-stage]'), 4.5, 6.5);
  enableTilt(document.querySelector('[data-orbit-stage]'), 3.5, 5);

  const detail = document.getElementById('tenx-detail');
  const nodes = Array.from(document.querySelectorAll('.orbit-node'));
  if (detail && nodes.length) {
    const number = detail.querySelector('.tenx-detail-number');
    const title = detail.querySelector('h3');
    const lead = detail.querySelector('strong');
    const text = detail.querySelector('p');

    const activate = (node) => {
      nodes.forEach((item) => {
        const active = item === node;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      detail.classList.remove('is-changing');
      void detail.offsetWidth;
      if (number) number.textContent = node.dataset.number || '';
      if (title) title.textContent = node.dataset.title || '';
      if (lead) lead.textContent = node.dataset.lead || '';
      if (text) text.textContent = node.dataset.text || '';
      detail.classList.add('is-changing');
    };

    nodes.forEach((node) => {
      node.addEventListener('click', () => activate(node));
      node.addEventListener('focus', () => activate(node));
    });
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: .12 });
    document.querySelectorAll('.hero-v2-stage,.tenx-visual-system').forEach((el) => observer.observe(el));
  }
})();
