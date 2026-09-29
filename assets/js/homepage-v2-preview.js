
(() => {
  if (window.__tamayuzV3Preview) return;
  window.__tamayuzV3Preview = true;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const stage = document.querySelector('[data-v3-stage]');

  if (stage && finePointer && !reduceMotion) {
    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      stage.style.transform = \`rotateX(\${(-y * 5).toFixed(2)}deg) rotateY(\${(x * 7).toFixed(2)}deg)\`;
    });
    stage.addEventListener('pointerleave', () => {
      stage.style.transform = '';
    });
  }

  const selected = document.getElementById('v3-selected');
  const pillars = Array.from(document.querySelectorAll('.v3-pillar'));
  if (selected && pillars.length) {
    const number = selected.querySelector('.v3-selected-number');
    const title = selected.querySelector('h3');
    const lead = selected.querySelector('strong');
    const text = selected.querySelector('p');

    const activate = (pillar) => {
      pillars.forEach((item) => {
        const active = item === pillar;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      selected.classList.remove('is-changing');
      void selected.offsetWidth;
      number.textContent = pillar.dataset.number || '';
      title.textContent = pillar.dataset.title || '';
      lead.textContent = pillar.dataset.lead || '';
      text.textContent = pillar.dataset.text || '';
      selected.classList.add('is-changing');
    };

    pillars.forEach((pillar) => {
      pillar.addEventListener('click', () => activate(pillar));
      pillar.addEventListener('focus', () => activate(pillar));
    });
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const items = document.querySelectorAll('.v3-manifesto-grid,.v3-pillar,.v3-case-card,.v3-ecosystem-grid>a');
    items.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(18px)';
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transition = 'opacity .55s ease, transform .55s ease';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      });
    }, { threshold: .08 });
    items.forEach((item) => observer.observe(item));
  }
})();
