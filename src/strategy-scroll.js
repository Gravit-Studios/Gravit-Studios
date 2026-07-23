// Marca o passo ativo da estratégia conforme ele cruza a faixa central da
// viewport durante o scroll, e revela o conteúdo correspondente no painel.
// Clicar num item também ativa (e rola até) o passo escolhido.
export function initStrategyScroll(root) {
  const items = Array.from(root.querySelectorAll('[data-strategy-item]'));
  const panels = Array.from(root.querySelectorAll('.strategy__panel-item'));

  if (!items.length || !panels.length) return;

  function setActive(index) {
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === index);
      panel.setAttribute('aria-hidden', String(i !== index));
    });
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      setActive(index);
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
}
