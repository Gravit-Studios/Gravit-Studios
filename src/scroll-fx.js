// Parallax leve entre seções: elementos marcados com [data-parallax] se
// deslocam a uma fração da velocidade do scroll (via data-parallax-speed),
// dando sensação de profundidade. Também conduz o progresso de uma seção
// "scrubbed" (ex.: o portal), ligando sua animação diretamente ao scroll.
export function initScrollFx({ scrubbed } = {}) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]')).map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallaxSpeed || '0.1'),
    axis: el.dataset.parallaxAxis === 'x' ? 'x' : 'y',
  }));

  let ticking = false;

  function update() {
    const viewportCenter = window.innerHeight / 2;

    for (const { el, speed, axis } of parallaxEls) {
      const rect = el.getBoundingClientRect();
      const elCenter = axis === 'x' ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
      const viewportRef = axis === 'x' ? window.innerWidth / 2 : viewportCenter;
      const offset = (viewportRef - elCenter) * speed;
      el.style.transform = axis === 'x' ? `translateX(${offset.toFixed(1)}px)` : `translateY(${offset.toFixed(1)}px)`;
    }

    if (scrubbed?.controller && scrubbed.section) {
      const rect = scrubbed.section.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const scrolled = window.innerHeight - rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / total));
      scrubbed.controller.setProgress(progress);
    }

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}
