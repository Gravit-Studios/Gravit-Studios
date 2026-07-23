## Gravit Studios

Site institucional da Gravit Studios — agência digital especializada em sites,
landing pages, apresentações institucionais e consultoria para negócios de
pequeno e médio porte.

Tema visual: espaço, galáxia, universo e gravidade — a força de atração como
metáfora para o poder de um site bem desenhado de atrair clientes.

### Stack

- [Vite](https://vitejs.dev/) para dev server e build.
- [Sass](https://sass-lang.com/) (Dart Sass, módulos `@use`/`@forward`) para o
  design system — sem CSS solto, tudo orientado a tokens.

### Rodando localmente

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção em dist/
```

### Design System

Toda a base visual vive em `src/styles/`:

- `abstracts/_colors.scss` — paletas de marca (primária, secundária,
  terciária, grayscale) em escala de 100 a 900, com 500 como cor base, e
  cores de sistema (success/warning/error/info).
- `abstracts/_tokens.scss` — tokens semânticos (o que cada cor *significa*:
  `cta-bg`, `text-subtitle`, `badge-bg`...), tipografia, espaçamento, raio e
  breakpoints.
- `base/_theme.scss` — publica os tokens Sass como CSS Custom Properties
  (`--color-primary-500`, `--cta-bg`, etc.), consumidas por todos os
  componentes.
- `components/` — botões, badges, seções, cards e header, já aplicando a
  regra de composição 60% neutro / 30% secundária / 10% primária.
- `components/_swatch.scss` + `src/palette-data.js` — vitrine viva da
  paleta, renderizada na seção `#tokens` da home (`index.html`).

Regra de uso das cores:

| Cor | Uso |
|---|---|
| Primária (Gravity Violet) | CTAs e destaques pontuais — 10% da composição |
| Secundária (Nebula Cyan) | Subtítulos e backgrounds de seções em destaque — 30% |
| Terciária (Stellar Gold) | Badges e informações simples — acento pontual |
| Grayscale (Deep Space) | Fundos, texto e superfícies — 60% da composição |
