// Gera um "mapa estelar" em SVG — círculos concêntricos, raios e marcações,
// como uma carta de navegação do universo. Usado como textura de fundo em
// seções escuras, sempre com uma rotação lenta (pausada em reduced-motion).
const SVG_NS = 'http://www.w3.org/2000/svg';

function el(name, attrs) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

export function renderStarmap(container, { seed = 1 } = {}) {
  const size = 900;
  const cx = size / 2;
  const cy = size / 2;

  const svg = el('svg', {
    viewBox: `0 0 ${size} ${size}`,
    class: 'starmap__svg',
    'aria-hidden': 'true',
  });

  const group = el('g', { class: 'starmap__group' });
  svg.appendChild(group);

  // Círculos concêntricos.
  const radii = [70, 140, 210, 280, 350, 420];
  radii.forEach((r, i) => {
    group.appendChild(
      el('circle', {
        cx,
        cy,
        r,
        class: 'starmap__ring',
        style: `opacity:${0.5 - i * 0.06}`,
      })
    );
  });

  // Raios saindo do centro até o círculo externo.
  const spokeCount = 36;
  const outerR = radii[radii.length - 1];
  const innerR = radii[0];
  for (let i = 0; i < spokeCount; i += 1) {
    const angle = (i / spokeCount) * Math.PI * 2;
    const x1 = cx + Math.cos(angle) * innerR;
    const y1 = cy + Math.sin(angle) * innerR;
    const x2 = cx + Math.cos(angle) * outerR;
    const y2 = cy + Math.sin(angle) * outerR;
    group.appendChild(el('line', { x1, y1, x2, y2, class: 'starmap__spoke' }));
  }

  // Marcações (ticks) logo além do círculo externo, como uma bússola.
  const tickCount = 96;
  for (let i = 0; i < tickCount; i += 1) {
    const angle = (i / tickCount) * Math.PI * 2;
    const long = i % 4 === 0;
    const r1 = outerR + 6;
    const r2 = outerR + (long ? 20 : 10);
    const x1 = cx + Math.cos(angle) * r1;
    const y1 = cy + Math.sin(angle) * r1;
    const x2 = cx + Math.cos(angle) * r2;
    const y2 = cy + Math.sin(angle) * r2;
    group.appendChild(el('line', { x1, y1, x2, y2, class: 'starmap__tick' }));
  }

  // Nós/estrelas dispersos dentro do disco (posições pseudo-aleatórias fixas por seed).
  let value = seed;
  const random = () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
  const nodeCount = 26;
  for (let i = 0; i < nodeCount; i += 1) {
    const angle = random() * Math.PI * 2;
    const r = innerR + random() * (outerR - innerR);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    group.appendChild(
      el('circle', { cx: x, cy: y, r: random() * 1.6 + 0.6, class: 'starmap__node' })
    );
  }

  // Núcleo brilhante central.
  group.appendChild(el('circle', { cx, cy, r: 34, class: 'starmap__core' }));

  container.appendChild(svg);
}
