import './styles/main.scss';
import { initHeroStarfield } from './hero-starfield.js';
import { initNavScroll } from './nav-scroll.js';
import { initReveal } from './reveal.js';
import { initPortfolioCarousel } from './portfolio-carousel.js';
import { initStrategyScroll } from './strategy-scroll.js';
import { initStrategyGravity } from './strategy-gravity.js';
import { renderStarmap } from './starmap.js';
import { initWarpLines } from './warp-lines.js';
import { initScrollFx } from './scroll-fx.js';

initReveal();

const header = document.querySelector('[data-header]');
if (header) initNavScroll(header);

const heroCanvas = document.querySelector('[data-hero-canvas]');
if (heroCanvas) initHeroStarfield(heroCanvas);

const portfolio = document.querySelector('[data-portfolio]');
if (portfolio) initPortfolioCarousel(portfolio);

const strategy = document.querySelector('[data-strategy]');
if (strategy) {
  const gravityCanvas = strategy.querySelector('[data-strategy-gravity]');
  const gravity = gravityCanvas ? initStrategyGravity(gravityCanvas) : undefined;
  initStrategyScroll(strategy, { gravity });
}

document.querySelectorAll('[data-starmap], [data-starmap-footer]').forEach((el, i) => {
  renderStarmap(el, { seed: i + 1 });
});

const warpLinesContainer = document.querySelector('[data-warp-lines]');
const warpController = warpLinesContainer ? initWarpLines(warpLinesContainer) : undefined;
const warpSection = warpLinesContainer?.closest('.warp');

initScrollFx({ warp: warpController ? { controller: warpController, section: warpSection } : undefined });
