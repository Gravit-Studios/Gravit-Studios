// Marca o bloco de narrativa ativo conforme cruza a faixa central da
// viewport durante o scroll, destaca a camada correspondente na montagem
// (efeito de "aproximação"), avança a linha de energia até ela e atualiza
// o alvo das partículas em órbita — tudo remetendo à atração gravitacional.
export function initStrategyScroll(root, { gravity } = {}) {
  const items = Array.from(root.querySelectorAll('[data-strategy-item]'));
  const layers = Array.from(root.querySelectorAll('[data-layer]'));
  const visual = root.querySelector('[data-strategy-visual]');
  const progress = root.querySelector('[data-strategy-progress]');
  const labelTag = root.querySelector('[data-label-tag]');
  const labelTitle = root.querySelector('[data-label-title]');

  if (!items.length) return;

  function setActive(index) {
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    layers.forEach((layer, i) => layer.classList.toggle('is-active', i === index));

    const active = items[index];
    if (labelTag) labelTag.textContent = active.dataset.tag || '';
    if (labelTitle) {
      labelTitle.textContent = active.querySelector('.strategy__block-title')?.textContent ?? '';
    }

    const activeLayer = layers[index];
    if (activeLayer && visual) {
      const visualRect = visual.getBoundingClientRect();
      const layerRect = activeLayer.getBoundingClientRect();
      const centerY = layerRect.top - visualRect.top + layerRect.height / 2;

      if (progress) progress.style.height = `${centerY}px`;
      gravity?.setTargetY(centerY);
    }
  }

  items.forEach((item, index) => {
    const activate = () => {
      setActive(index);
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    item.addEventListener('click', activate);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(items.indexOf(entry.target));
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  items.forEach((item) => observer.observe(item));

  // Medir a posição real das camadas depende do layout já estar pronto.
  requestAnimationFrame(() => setActive(0));
}
