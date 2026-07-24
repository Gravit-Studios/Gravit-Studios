// "Portal" — duas elipses verticais sobrepostas (traço sólido + tracejado,
// como um par de vesica piscis), cada uma com uma esfera que viaja da
// lateral até o centro conforme o scroll. Quando as duas se encontram no
// meio, um núcleo acende na cor primária — a Gravit unindo os dois lados.
const SVG_NS = 'http://www.w3.org/2000/svg';

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

// Ponto de uma elipse rotacionada, em coordenadas do SVG.
function ellipsePoint(cx, cy, rx, ry, rotRad, t) {
  const x0 = rx * Math.cos(t);
  const y0 = ry * Math.sin(t);
  return {
    x: cx + x0 * Math.cos(rotRad) - y0 * Math.sin(rotRad),
    y: cy + x0 * Math.sin(rotRad) + y0 * Math.cos(rotRad),
  };
}

function buildEllipsePath(cx, cy, rx, ry, rotDeg, steps = 120) {
  const rotRad = (rotDeg * Math.PI) / 180;
  let d = '';
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * Math.PI * 2;
    const { x, y } = ellipsePoint(cx, cy, rx, ry, rotRad, t);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return d;
}

export function initPortal(container) {
  const width = 1000;
  const height = 1300;
  const cx = width / 2;
  const cy = height / 2;

  const rx = 235;
  const ry = 560;
  const tilt = 7;

  const leftCx = cx - 170;
  const rightCx = cx + 170;

  const svg = el('svg', { viewBox: `0 0 ${width} ${height}`, class: 'portal__svg', 'aria-hidden': 'true' });
  const group = el('g', { class: 'portal__group' });
  svg.appendChild(group);

  const leftGroup = el('g', { class: 'portal__oval', 'data-parallax': '', 'data-parallax-speed': '0.05' });
  leftGroup.appendChild(el('path', { d: buildEllipsePath(leftCx, cy, rx, ry, -tilt), class: 'portal__oval-line' }));
  leftGroup.appendChild(
    el('path', { d: buildEllipsePath(leftCx, cy, rx * 1.08, ry * 1.04, -tilt - 3), class: 'portal__oval-line portal__oval-line--dashed' })
  );
  group.appendChild(leftGroup);

  const rightGroup = el('g', { class: 'portal__oval', 'data-parallax': '', 'data-parallax-speed': '-0.05' });
  rightGroup.appendChild(el('path', { d: buildEllipsePath(rightCx, cy, rx, ry, tilt), class: 'portal__oval-line' }));
  rightGroup.appendChild(
    el('path', { d: buildEllipsePath(rightCx, cy, rx * 1.08, ry * 1.04, tilt + 3), class: 'portal__oval-line portal__oval-line--dashed' })
  );
  group.appendChild(rightGroup);

  // Núcleo central — acende quando as duas esferas se encontram.
  const core = el('circle', { cx, cy, r: 30, class: 'portal__core' });
  group.appendChild(core);

  const leftTraveler = el('circle', { r: 14, class: 'portal__traveler portal__traveler--left' });
  const rightTraveler = el('circle', { r: 14, class: 'portal__traveler portal__traveler--right' });
  group.appendChild(leftTraveler);
  group.appendChild(rightTraveler);

  container.appendChild(svg);

  const leftTiltRad = (-tilt * Math.PI) / 180;
  const rightTiltRad = (tilt * Math.PI) / 180;

  // Esfera esquerda: começa no ponto mais à esquerda da própria elipse (t=π)
  // e viaja até o ponto mais à direita (t=0), que cai perto do cruzamento
  // central com a elipse direita. A direita faz o caminho espelhado.
  function place(progress) {
    const tLeft = Math.PI - progress * Math.PI;
    const tRight = progress * Math.PI;

    const left = ellipsePoint(leftCx, cy, rx, ry, leftTiltRad, tLeft);
    const right = ellipsePoint(rightCx, cy, rx, ry, rightTiltRad, tRight);

    leftTraveler.setAttribute('cx', left.x.toFixed(1));
    leftTraveler.setAttribute('cy', left.y.toFixed(1));
    rightTraveler.setAttribute('cx', right.x.toFixed(1));
    rightTraveler.setAttribute('cy', right.y.toFixed(1));

    const meet = Math.max(0, (progress - 0.7) / 0.3);
    core.style.setProperty('--meet', meet.toFixed(2));
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    place(0.5);
    return;
  }

  place(0);

  return {
    setProgress(progress) {
      place(progress);
    },
  };
}
