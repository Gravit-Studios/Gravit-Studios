// Cada cubo percorre a própria linha tracejada conforme o bloco de texto
// correspondente se aproxima do centro da viewport durante o scroll. O
// progresso é monotônico (usa o máximo já alcançado): uma vez que o cubo
// chega ao centro, ele fica lá — não volta pro canto se você rolar mais.
// Assim os quatro vão se acumulando no centro, um a um, até preencherem o
// soquete central juntos.
export function initStrategyScroll(root) {
  const items = Array.from(root.querySelectorAll('[data-strategy-item]'));
  const cubes = Array.from(root.querySelectorAll('[data-layer]'));
  const fill = root.querySelector('[data-strategy-fill]');
  const labelTag = root.querySelector('[data-label-tag]');
  const labelTitle = root.querySelector('[data-label-title]');

  if (!items.length || items.length !== cubes.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cubeData = cubes.map((el) => ({
    el,
    joinX: parseFloat(el.style.getPropertyValue('--join-x')) || 0,
    joinY: parseFloat(el.style.getPropertyValue('--join-y')) || 0,
    maxProgress: 0,
    visited: false,
  }));

  function setLabel(index) {
    const active = items[index];
    if (labelTag) labelTag.textContent = active.dataset.tag || '';
    if (labelTitle) {
      labelTitle.textContent = active.querySelector('.strategy__block-title')?.textContent ?? '';
    }
  }

  function updateFromScroll() {
    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    const distances = items.map((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      return Math.abs(itemCenter - viewportCenter);
    });

    distances.forEach((distance, i) => {
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    items.forEach((item, i) => {
      const instantProgress = Math.max(0, 1 - distances[i] / (window.innerHeight * 0.6));
      const cube = cubeData[i];
      cube.maxProgress = Math.max(cube.maxProgress, instantProgress);
      const progress = cube.maxProgress;

      item.classList.toggle('is-active', closestIndex === i);
      cube.el.classList.toggle('is-active', progress > 0.5);

      if (progress > 0.85) cube.visited = true;

      if (!prefersReducedMotion) {
        cube.el.style.transform = `translate(${cube.joinX * progress}px, ${cube.joinY * progress}px) scale(${1 + progress * 0.15})`;
      }
    });

    setLabel(closestIndex);

    if (fill) {
      const connection = cubeData.filter((c) => c.visited).length / cubeData.length;
      fill.style.opacity = connection.toFixed(2);
    }
  }

  items.forEach((item) => {
    const activate = () => item.scrollIntoView({ behavior: 'smooth', block: 'center' });

    item.setAttribute('role', item.getAttribute('role') || 'button');
    item.addEventListener('click', activate);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });

  if (prefersReducedMotion) {
    setLabel(0);
    items[0]?.classList.add('is-active');
    cubes[0]?.classList.add('is-active');
    if (fill) fill.style.opacity = '0.25';
    return;
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateFromScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  updateFromScroll();
}
