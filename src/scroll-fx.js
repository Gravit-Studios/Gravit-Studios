// Parallax leve entre seções: elementos marcados com [data-parallax] se
// deslocam a uma fração da velocidade do scroll (via data-parallax-speed),
// dando sensação de profundidade. Também conduz o progresso da seção de
// "passagem" (linhas de warp), ligando sua animação diretamente ao scroll.
export function initScrollFx({ warp } = {}) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]')).map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallaxSpeed || '0.1'),
  }));

  let ticking = false;

  function update() {
    const viewportCenter = window.innerHeight / 2;

    for (const { el, speed } of parallaxEls) {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const offset = (viewportCenter - elCenter) * speed;
      el.style.transform = `translateY(${offset.toFixed(1)}px)`;
    }

    if (warp?.controller && warp.section) {
      const rect = warp.section.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const scrolled = window.innerHeight - rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / total));
      warp.controller.setProgress(progress);
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
