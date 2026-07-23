import './styles/main.scss';
import { palettes } from './palette-data.js';
import { initHeroStarfield } from './hero-starfield.js';
import { initNavScroll } from './nav-scroll.js';
import { initReveal } from './reveal.js';
import { initPortfolioCarousel } from './portfolio-carousel.js';
import { initStrategyScroll } from './strategy-scroll.js';
import { renderStarmap } from './starmap.js';

function renderPalettes() {
  const root = document.querySelector('#palette-showcase');
  if (!root) return;

  root.innerHTML = palettes
    .map(({ name, label, steps }) => `
      <h3 class="palette__name">${label}</h3>
      <div class="palette__row">
        ${Object.entries(steps)
          .map(
            ([step, hex]) => `
              <div class="swatch">
                <div class="swatch__color swatch__color--${name}-${step}"></div>
                <div class="swatch__meta">
                  <span class="swatch__step">${step}${step === '500' ? ' · base' : ''}</span>
                  <span class="swatch__hex">${hex}</span>
                </div>
              </div>
            `
          )
          .join('')}
      </div>
    `)
    .join('');
}

renderPalettes();
initReveal();

const header = document.querySelector('[data-header]');
if (header) initNavScroll(header);

const heroCanvas = document.querySelector('[data-hero-canvas]');
if (heroCanvas) initHeroStarfield(heroCanvas);

const portfolio = document.querySelector('[data-portfolio]');
if (portfolio) initPortfolioCarousel(portfolio);

const strategy = document.querySelector('[data-strategy]');
if (strategy) initStrategyScroll(strategy);

document.querySelectorAll('[data-starmap], [data-starmap-footer]').forEach((el, i) => {
  renderStarmap(el, { seed: i + 1 });
});
