// Faixa orbital horizontal: corpos variados (círculos em traço, esferas com
// sombreado, luas em crescente, anéis) espalhados ao longo de uma linha,
// cada um se deslocando a uma velocidade diferente conforme o scroll
// (parallax horizontal) — como se estivessem se movendo e se aproximando.
const SVG_NS = 'http://www.w3.org/2000/svg';

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

// Envolve um elemento num <g> com parallax horizontal próprio.
function parallaxGroup(speed) {
  return el('g', {
    'data-parallax': '',
    'data-parallax-speed': speed,
    'data-parallax-axis': 'x',
  });
}

export function initOrbitBelt(container) {
  const width = 1600;
  const height = 380;
  const midY = height / 2;

  const svg = el('svg', {
    viewBox: `0 0 ${width} ${height}`,
    class: 'orbit-belt__svg',
    'aria-hidden': 'true',
  });

  const defs = el('defs');
  const gradient = el('linearGradient', { id: 'orbit-belt-sphere', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
  gradient.appendChild(el('stop', { offset: '0%', 'stop-color': 'var(--color-tertiary-200)' }));
  gradient.appendChild(el('stop', { offset: '55%', 'stop-color': 'var(--color-tertiary-500)' }));
  gradient.appendChild(el('stop', { offset: '100%', 'stop-color': 'var(--color-gray-700)' }));
  defs.appendChild(gradient);
  svg.appendChild(defs);

  // Linha-base tracejada atravessando a faixa inteira, ligando os corpos.
  svg.appendChild(
    el('line', {
      x1: 0,
      y1: midY,
      x2: width,
      y2: midY,
      class: 'orbit-belt__baseline',
    })
  );

  // 1) Par de círculos sobrepostos — cliente e empresa se aproximando.
  const vennGroup = parallaxGroup(0.06);
  vennGroup.setAttribute('class', 'orbit-belt__venn');
  vennGroup.appendChild(el('circle', { cx: 165, cy: midY, r: 46, class: 'orbit-belt__outline' }));
  vennGroup.appendChild(el('circle', { cx: 215, cy: midY, r: 46, class: 'orbit-belt__outline' }));
  svg.appendChild(vennGroup);

  // 2) Anel maior com órbita tracejada por dentro.
  const ringGroup = parallaxGroup(-0.04);
  ringGroup.appendChild(el('circle', { cx: 460, cy: midY, r: 150, class: 'orbit-belt__outline' }));
  ringGroup.appendChild(
    el('circle', { cx: 460, cy: midY, r: 95, class: 'orbit-belt__dashed-ring' })
  );
  svg.appendChild(ringGroup);

  // 3) Esfera com sombreado (planeta), sobreposta ao anel anterior.
  const sphereGroup = parallaxGroup(0.09);
  sphereGroup.appendChild(el('circle', { cx: 560, cy: midY, r: 34, fill: 'url(#orbit-belt-sphere)' }));
  svg.appendChild(sphereGroup);

  // 4) Lua em crescente (círculo claro com uma "mordida" na cor do fundo).
  const crescentGroup = parallaxGroup(-0.08);
  crescentGroup.appendChild(el('circle', { cx: 700, cy: midY, r: 26, class: 'orbit-belt__crescent-base' }));
  crescentGroup.appendChild(el('circle', { cx: 712, cy: midY - 8, r: 24, class: 'orbit-belt__crescent-bite' }));
  svg.appendChild(crescentGroup);

  // 5) Círculo pequeno solto.
  const smallGroup = parallaxGroup(0.12);
  smallGroup.appendChild(el('circle', { cx: 790, cy: midY, r: 20, class: 'orbit-belt__outline' }));
  svg.appendChild(smallGroup);

  // 6) Dois anéis grandes se cruzando.
  const doubleRingGroup = parallaxGroup(-0.05);
  doubleRingGroup.appendChild(el('circle', { cx: 900, cy: midY, r: 62, class: 'orbit-belt__outline' }));
  doubleRingGroup.appendChild(el('circle', { cx: 985, cy: midY, r: 90, class: 'orbit-belt__outline' }));
  svg.appendChild(doubleRingGroup);

  // 7) Pontos dispersos entre os corpos.
  const dotsGroup = parallaxGroup(0.03);
  const dotPositions = [
    [1090, midY - 4], [1120, midY + 6], [1150, midY - 10], [1180, midY],
  ];
  dotPositions.forEach(([x, y]) => {
    dotsGroup.appendChild(el('circle', { cx: x, cy: y, r: 3, class: 'orbit-belt__dot' }));
  });
  svg.appendChild(dotsGroup);

  // 8) Anel espesso (donut) fechando a composição.
  const donutGroup = parallaxGroup(0.1);
  donutGroup.appendChild(el('circle', { cx: 1320, cy: midY, r: 28, class: 'orbit-belt__donut' }));
  svg.appendChild(donutGroup);

  // Pontos soltos (estrelas) espalhados pela faixa toda, com parallax leve.
  const starsGroup = parallaxGroup(0.02);
  let seed = 11;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 26; i += 1) {
    const x = random() * width;
    const y = midY + (random() - 0.5) * (height * 0.8);
    starsGroup.appendChild(
      el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: random() * 1.4 + 0.5, class: 'orbit-belt__dot' })
    );
  }
  svg.appendChild(starsGroup);

  container.appendChild(svg);
}
