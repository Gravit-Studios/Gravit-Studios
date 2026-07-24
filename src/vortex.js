// Vórtice em forma de "oito" (lemniscata) no fundo do banner: os dois laços
// simbolizam cliente e empresa sendo atraídos um ao encontro do outro, se
// cruzando no centro — onde a Gravit fica. Linhas finas, baixa opacidade,
// dois pontos viajando pelos laços em direção ao centro continuamente.
const SVG_NS = 'http://www.w3.org/2000/svg';

function el(name, attrs) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

// Lemniscata de Bernoulli parametrizada, centrada em (0,0).
function lemniscatePoint(a, t) {
  const denom = 1 + Math.sin(t) ** 2;
  return {
    x: (a * Math.cos(t)) / denom,
    y: (a * Math.sin(t) * Math.cos(t)) / denom,
  };
}

function buildLemniscatePath(a, cx, cy, steps = 220) {
  let d = '';
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * Math.PI * 2;
    const { x, y } = lemniscatePoint(a, t);
    d += `${i === 0 ? 'M' : 'L'}${(cx + x).toFixed(1)},${(cy + y).toFixed(1)} `;
  }
  return d;
}

export function initVortex(container) {
  const width = 900;
  const height = 560;
  const cx = width / 2;
  const cy = height / 2;
  const mainRadius = 300;

  const svg = el('svg', {
    viewBox: `0 0 ${width} ${height}`,
    class: 'vortex__svg',
    'aria-hidden': 'true',
  });

  const group = el('g', { class: 'vortex__group' });
  svg.appendChild(group);

  const loopCount = 6;
  for (let i = 0; i < loopCount; i += 1) {
    const a = mainRadius * (0.45 + (i / (loopCount - 1)) * 0.55);
    group.appendChild(
      el('path', {
        d: buildLemniscatePath(a, cx, cy),
        class: 'vortex__loop',
        style: `opacity:${0.5 - i * 0.06}`,
      })
    );
  }

  group.appendChild(el('circle', { cx, cy, r: 5, class: 'vortex__core' }));

  const clientDot = el('circle', { r: 4, class: 'vortex__traveler vortex__traveler--client' });
  const companyDot = el('circle', { r: 4, class: 'vortex__traveler vortex__traveler--company' });
  group.appendChild(clientDot);
  group.appendChild(companyDot);

  container.appendChild(svg);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    const { x, y } = lemniscatePoint(mainRadius, Math.PI / 2);
    clientDot.setAttribute('cx', cx + x);
    clientDot.setAttribute('cy', cy + y);
    companyDot.setAttribute('cx', cx - x);
    companyDot.setAttribute('cy', cy - y);
    return;
  }

  let rafId;
  function animate(time) {
    const t = time * 0.00035;
    const client = lemniscatePoint(mainRadius, t);
    const company = lemniscatePoint(mainRadius, t + Math.PI);

    clientDot.setAttribute('cx', cx + client.x);
    clientDot.setAttribute('cy', cy + client.y);
    companyDot.setAttribute('cx', cx + company.x);
    companyDot.setAttribute('cy', cy + company.y);

    rafId = requestAnimationFrame(animate);
  }
  rafId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(rafId);
}
