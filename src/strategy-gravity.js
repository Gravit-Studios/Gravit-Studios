// Partículas em órbita que "seguem" o poço gravitacional do passo ativo —
// pequenos satélites orbitando ao redor da camada em foco, se deslocando
// suavemente sempre que o passo ativo muda ao rolar a página.
export function initStrategyGravity(canvas) {
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let targetY = 0;
  let currentY = 0;
  let rafId = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!particles.length) {
      particles = Array.from({ length: 22 }, () => ({
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() * 0.006 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
        radiusX: Math.random() * 70 + 30,
        radiusY: Math.random() * 90 + 40,
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.5 + 0.3,
      }));
    }

    if (targetY === 0) {
      targetY = height / 2;
      currentY = targetY;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    currentY += (targetY - currentY) * 0.06;
    const centerX = width / 2;

    for (const p of particles) {
      p.angle += p.angularSpeed;
      const x = centerX + Math.cos(p.angle) * p.radiusX;
      const y = currentY + Math.sin(p.angle) * p.radiusY;

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(241, 75, 53, ${p.alpha})`;
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  }

  resize();

  if (prefersReducedMotion) {
    ctx.clearRect(0, 0, width, height);
    return {
      setTargetY() {},
      destroy() {},
    };
  }

  draw();

  const onResize = () => resize();
  window.addEventListener('resize', onResize);

  return {
    setTargetY(y) {
      targetY = y;
    },
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    },
  };
}
