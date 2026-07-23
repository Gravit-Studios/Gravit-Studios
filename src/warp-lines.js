// Linhas radiais que simulam uma passagem/salto no espaço (efeito "warp"),
// usadas na seção de transição entre o banner e a seção Sobre.
const SVG_NS = 'http://www.w3.org/2000/svg';

function el(name, attrs) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

export function initWarpLines(container) {
  const width = 1600;
  const height = 500;
  const cx = width / 2;
  const cy = height / 2;

  const svg = el('svg', {
    viewBox: `0 0 ${width} ${height}`,
    class: 'warp__svg',
    preserveAspectRatio: 'xMidYMid slice',
    'aria-hidden': 'true',
  });

  const group = el('g', { class: 'warp__group' });
  svg.appendChild(group);

  const lineCount = 48;
  let seed = 7;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < lineCount; i += 1) {
    const angle = (i / lineCount) * Math.PI * 2;
    const innerR = 40 + random() * 30;
    const outerR = Math.max(width, height) * (0.6 + random() * 0.5);
    const x1 = cx + Math.cos(angle) * innerR;
    const y1 = cy + Math.sin(angle) * innerR;
    const x2 = cx + Math.cos(angle) * outerR;
    const y2 = cy + Math.sin(angle) * outerR;

    group.appendChild(
      el('line', {
        x1,
        y1,
        x2,
        y2,
        class: 'warp__line',
        style: `opacity:${0.15 + random() * 0.35}`,
      })
    );
  }

  group.appendChild(el('circle', { cx, cy, r: 3, class: 'warp__core' }));

  container.appendChild(svg);

  return {
    setProgress(t) {
      const scale = 1 + t * 0.7;
      const opacity = 0.35 + Math.sin(t * Math.PI) * 0.65;
      group.style.transform = `scale(${scale})`;
      group.style.transformOrigin = `${cx}px ${cy}px`;
      group.style.opacity = String(opacity);
    },
  };
}
