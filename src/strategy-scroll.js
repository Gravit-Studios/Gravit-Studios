// Marca o bloco de narrativa ativo conforme cruza a faixa central da
// viewport durante o scroll, destaca a camada correspondente na montagem
// (efeito de "aproximação") e atualiza o rótulo lateral que a acompanha.
export function initStrategyScroll(root) {
  const items = Array.from(root.querySelectorAll('[data-strategy-item]'));
  const layers = Array.from(root.querySelectorAll('[data-layer]'));
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
  setActive(0);
}
