// "Portal" — passagem em wireframe entre o Portfolio e o Sobre: dois funis
// (malha de anéis + meridianos) conectados por um torus central, com um
// ponto (a Gravit) que atravessa de cima a baixo conforme o scroll — como
// se ela entrasse no processo por cima e saísse concluído embaixo.
const SVG_NS = 'http://www.w3.org/2000/svg';

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Malha de um funil: anéis horizontais (elipses) + linhas meridianas
// verticais conectando-os, do raio largo (topR) ao estreito (narrowR).
function buildFunnel(group, { cx, wideY, narrowY, wideR, narrowR, squash, rows = 7, cols = 14, flare = 'in' }) {
  const rings = [];

  for (let i = 0; i < rows; i += 1) {
    const t = i / (rows - 1);
    const y = lerp(wideY, narrowY, t);
    const ease = flare === 'in' ? t * t : 1 - (1 - t) * (1 - t);
    const r = lerp(wideR, narrowR, ease);
    const ry = r * squash;
    rings.push({ y, r, ry });
    group.appendChild(el('ellipse', { cx, cy: y, rx: r, ry, class: 'portal__ring' }));
  }

  for (let j = 0; j < cols; j += 1) {
    const angle = (j / cols) * Math.PI * 2;
    const points = rings
      .map(({ y, r, ry }) => `${(cx + Math.cos(angle) * r).toFixed(1)},${(y + Math.sin(angle) * ry).toFixed(1)}`)
      .join(' ');
    group.appendChild(el('polyline', { points, class: 'portal__meridian' }));
  }
}

export function initPortal(container) {
  const width = 900;
  const height = 900;
  const cx = width / 2;

  const topWideY = 70;
  const neckTopY = 400;
  const ringY = 450;
  const neckBottomY = 500;
  const bottomWideY = 830;

  const wideR = 210;
  const neckR = 50;

  const svg = el('svg', { viewBox: `0 0 ${width} ${height}`, class: 'portal__svg', 'aria-hidden': 'true' });

  // Linhas diagonais guia, formando o "X" atrás dos funis.
  const guides = el('g', { class: 'portal__guides' });
  [[0, 0], [width, 0]].forEach(([x, y]) => {
    guides.appendChild(el('line', { x1: cx, y1: ringY, x2: x, y2: y, class: 'portal__guide' }));
  });
  [[0, height], [width, height]].forEach(([x, y]) => {
    guides.appendChild(el('line', { x1: cx, y1: ringY, x2: x, y2: y, class: 'portal__guide' }));
  });
  svg.appendChild(guides);

  const topFunnel = el('g', {
    class: 'portal__funnel',
    'data-parallax': '',
    'data-parallax-speed': '0.06',
  });
  buildFunnel(topFunnel, {
    cx,
    wideY: topWideY,
    narrowY: neckTopY,
    wideR,
    narrowR: neckR,
    squash: 0.34,
    flare: 'in',
  });
  svg.appendChild(topFunnel);

  const bottomFunnel = el('g', {
    class: 'portal__funnel',
    'data-parallax': '',
    'data-parallax-speed': '-0.06',
  });
  buildFunnel(bottomFunnel, {
    cx,
    wideY: neckBottomY,
    narrowY: bottomWideY,
    wideR: neckR,
    narrowR: wideR,
    squash: 0.34,
    flare: 'out',
  });
  svg.appendChild(bottomFunnel);

  // Torus central — o anel onde a Gravit "conecta" as duas pontas.
  const ring = el('g', { class: 'portal__torus' });
  ring.appendChild(el('ellipse', { cx, cy: ringY, rx: 118, ry: 40, class: 'portal__torus-outer' }));
  ring.appendChild(el('ellipse', { cx, cy: ringY, rx: 58, ry: 18, class: 'portal__torus-inner' }));
  svg.appendChild(ring);

  // O ponto da Gravit, atravessando o portal conforme o scroll.
  const traveler = el('circle', { cx, cy: topWideY - 60, r: 14, class: 'portal__traveler' });
  svg.appendChild(traveler);

  container.appendChild(svg);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startY = topWideY - 60;
  const endY = bottomWideY + 60;

  if (prefersReducedMotion) {
    traveler.setAttribute('cy', ringY);
    return;
  }

  return {
    setProgress(progress) {
      const y = lerp(startY, endY, progress);
      traveler.setAttribute('cy', y.toFixed(1));

      const distanceFromRing = Math.abs(y - ringY);
      const glow = Math.max(0, 1 - distanceFromRing / 140);
      traveler.style.setProperty('--glow', glow.toFixed(2));
    },
  };
}
