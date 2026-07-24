// A "jornada" inteira da narrativa (do topo do bloco 01 até o fim do bloco
// 04) vira um progresso único de 0 a 1, diretamente ligado à posição atual
// do scroll — sem depender da distância instantânea de cada bloco ao
// centro (isso é o que causava o "bater e voltar"). Cada cubo ocupa uma
// fatia igual dessa jornada: entra em 0, chega a 1 e fica lá enquanto você
// não rolar de volta pra trás — e reverte de verdade se você subir.
export function initStrategyScroll(root) {
  const items = Array.from(root.querySelectorAll('[data-strategy-item]'));
  const cubes = Array.from(root.querySelectorAll('[data-layer]'));
  const fill = root.querySelector('[data-strategy-fill]');
  const labelTag = root.querySelector('[data-label-tag]');
  const labelTitle = root.querySelector('[data-label-title]');

  if (!items.length || items.length !== cubes.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = items.length;

  const cubeData = cubes.map((el) => ({
    el,
    joinX: parseFloat(el.style.getPropertyValue('--join-x')) || 0,
    joinY: parseFloat(el.style.getPropertyValue('--join-y')) || 0,
  }));

  function setLabel(index) {
    const active = items[index];
    if (labelTag) labelTag.textContent = active.dataset.tag || '';
    if (labelTitle) {
      labelTitle.textContent = active.querySelector('.strategy__block-title')?.textContent ?? '';
    }
  }

  function updateFromScroll() {
    const scrollY = window.scrollY;
    const viewportCenter = window.innerHeight / 2;

    const firstRect = items[0].getBoundingClientRect();
    const lastRect = items[count - 1].getBoundingClientRect();
    const journeyTop = firstRect.top + scrollY;
    const journeyBottom = lastRect.bottom + scrollY;
    const journeyHeight = Math.max(1, journeyBottom - journeyTop);

    const overall = Math.min(1, Math.max(0, (scrollY + viewportCenter - journeyTop) / journeyHeight));
    const closestIndex = Math.min(count - 1, Math.floor(overall * count));

    items.forEach((item, i) => {
      const zoneProgress = Math.min(1, Math.max(0, overall * count - i));
      const cube = cubeData[i];

      item.classList.toggle('is-active', closestIndex === i);
      cube.el.classList.toggle('is-active', zoneProgress > 0.5);

      if (!prefersReducedMotion) {
        cube.el.style.transform = `translate(${cube.joinX * zoneProgress}px, ${cube.joinY * zoneProgress}px) scale(${1 + zoneProgress * 0.15})`;
      }
    });

    setLabel(closestIndex);

    if (fill) fill.style.opacity = overall.toFixed(2);
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
