// Fundo estilo "sistema estelar": anéis concêntricos centrais, dois
// sistemas satélites menores e linhas diagonais até os cantos, com alguns
// pontos orbitando continuamente — parte deles na cor primária, como sinais
// em destaque. Baixa opacidade geral, para ficar discreto atrás do texto.
const SVG_NS = 'http://www.w3.org/2000/svg';

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

function satelliteSystem(group, cx, cy, radii) {
  radii.forEach((r) => {
    group.appendChild(el('circle', { cx, cy, r, class: 'meridian__ring meridian__ring--faint' }));
  });
}

export function initMeridian(container) {
  const width = 1000;
  const height = 700;
  const cx = width / 2;
  const cy = height / 2;

  const svg = el('svg', { viewBox: `0 0 ${width} ${height}`, class: 'meridian__svg', 'aria-hidden': 'true' });
  const group = el('g', { class: 'meridian__group' });
  svg.appendChild(group);

  // Linhas diagonais até os quatro cantos, e uma linha horizontal central.
  [[0, 0], [width, 0], [0, height], [width, height]].forEach(([x, y]) => {
    group.appendChild(el('line', { x1: cx, y1: cy, x2: x, y2: y, class: 'meridian__line' }));
  });
  group.appendChild(el('line', { x1: 0, y1: cy, x2: width, y2: cy, class: 'meridian__line' }));

  // Anéis concêntricos centrais (bullseye).
  const centralRadii = [24, 52, 82, 114, 148, 184, 222];
  centralRadii.forEach((r, i) => {
    group.appendChild(
      el('circle', {
        cx,
        cy,
        r,
        class: 'meridian__ring',
        style: `opacity:${0.5 - i * 0.045}`,
      })
    );
  });

  // Dois sistemas satélites menores, à direita-cima e à esquerda-baixo.
  satelliteSystem(group, width * 0.82, height * 0.24, [34, 60]);
  satelliteSystem(group, width * 0.14, height * 0.78, [26, 46]);

  container.appendChild(svg);

  // Pontos orbitando o centro em raios/velocidades diferentes; alguns na
  // cor primária, maiores, como sinais em destaque.
  const orbiters = [
    { r: 82, speed: 0.00022, phase: 0, accent: true, size: 5 },
    { r: 114, speed: -0.00016, phase: 2, accent: false, size: 3 },
    { r: 148, speed: 0.00012, phase: 4, accent: true, size: 4 },
    { r: 184, speed: -0.0001, phase: 1, accent: false, size: 2.5 },
    { r: 222, speed: 0.00008, phase: 3, accent: false, size: 3 },
    { r: 60, speed: 0.00035, phase: 0.5, accent: true, size: 3.5, cx: width * 0.82, cy: height * 0.24 },
    { r: 46, speed: -0.0003, phase: 1.5, accent: false, size: 2.5, cx: width * 0.14, cy: height * 0.78 },
  ];

  const dots = orbiters.map((orbit) =>
    el('circle', {
      r: orbit.size,
      class: orbit.accent ? 'meridian__dot meridian__dot--accent' : 'meridian__dot',
    })
  );
  dots.forEach((dot) => group.appendChild(dot));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    orbiters.forEach((orbit, i) => {
      const ocx = orbit.cx ?? cx;
      const ocy = orbit.cy ?? cy;
      dots[i].setAttribute('cx', ocx + orbit.r);
      dots[i].setAttribute('cy', ocy);
    });
    return;
  }

  function animate(time) {
    orbiters.forEach((orbit, i) => {
      const angle = time * orbit.speed + orbit.phase;
      const ocx = orbit.cx ?? cx;
      const ocy = orbit.cy ?? cy;
      dots[i].setAttribute('cx', (ocx + Math.cos(angle) * orbit.r).toFixed(1));
      dots[i].setAttribute('cy', (ocy + Math.sin(angle) * orbit.r).toFixed(1));
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
