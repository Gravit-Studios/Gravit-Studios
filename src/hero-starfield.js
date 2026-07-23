// Starfield leve e discreto para o fundo do hero — textura de universo com
// movimento sutil (drift + cintilação), pausado quando prefers-reduced-motion.
export function initHeroStarfield(canvas) {
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars = [];
  let rafId = null;

  const STAR_DENSITY = 0.00012;

  function createStars() {
    const count = Math.round(width * height * STAR_DENSITY);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.6 + 0.2,
      twinklePhase: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.015 + 0.004,
    }));
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      const twinkle = prefersReducedMotion
        ? star.baseAlpha
        : star.baseAlpha + Math.sin(time * 0.001 * star.twinkleSpeed + star.twinklePhase) * 0.25;
      const y = prefersReducedMotion ? star.y : (star.y + time * star.driftSpeed * 0.02) % height;

      ctx.beginPath();
      ctx.arc(star.x, y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, twinkle))})`;
      ctx.fill();
    }

    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame(draw);
    }
  }

  resize();
  draw(0);

  if (prefersReducedMotion) return () => {};

  const onResize = () => {
    cancelAnimationFrame(rafId);
    resize();
    rafId = requestAnimationFrame(draw);
  };

  window.addEventListener('resize', onResize);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
  };
}
