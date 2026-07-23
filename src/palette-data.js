// Espelha os mapas Sass em `src/styles/abstracts/_colors.scss` para alimentar a
// vitrine de tokens. Se a paleta mudar lá, atualize aqui também.
export const palettes = [
  {
    name: 'primary',
    label: 'Primária — Gravity Violet',
    steps: {
      100: '#f1e9fe', 200: '#dec9fc', 300: '#c6a3f9', 400: '#a873f3',
      500: '#8347e8', 600: '#6b2fd1', 700: '#5324a8', 800: '#3d1b7d', 900: '#271252',
    },
  },
  {
    name: 'secondary',
    label: 'Secundária — Nebula Cyan',
    steps: {
      100: '#e3f6fb', 200: '#b9e7f2', 300: '#86d3e8', 400: '#4fbbda',
      500: '#1f9dc4', 600: '#167da0', 700: '#10617d', 800: '#0b475c', 900: '#072f3c',
    },
  },
  {
    name: 'tertiary',
    label: 'Terciária — Stellar Gold',
    steps: {
      100: '#fff7e0', 200: '#ffecb3', 300: '#ffdd80', 400: '#ffcc4d',
      500: '#f5b324', 600: '#d9941a', 700: '#b37414', 800: '#8c580f', 900: '#663d0a',
    },
  },
  {
    name: 'gray',
    label: 'Grayscale — Deep Space',
    steps: {
      100: '#f5f6fa', 200: '#e6e8f0', 300: '#cbcedb', 400: '#a3a8bd',
      500: '#767c97', 600: '#565c77', 700: '#3b3f57', 800: '#23263a', 900: '#0d0e1a',
    },
  },
];
