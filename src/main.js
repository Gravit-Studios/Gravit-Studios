import './styles/main.scss';
import { initHeroStarfield } from './hero-starfield.js';
import { initNavScroll } from './nav-scroll.js';
import { initReveal } from './reveal.js';
import { initPortfolioCarousel } from './portfolio-carousel.js';
import { initStrategyScroll } from './strategy-scroll.js';
import { renderStarmap } from './starmap.js';
import { initPortal } from './portal.js';
import { initScrollFx } from './scroll-fx.js';
import { initContactForm } from './contact-form.js';
import { initMeridian } from './meridian.js';

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

const portalSection = document.querySelector('[data-portal]');
const portalController = portalSection ? initPortal(portalSection) : undefined;

initScrollFx({
  scrubbed: portalController ? { controller: portalController, section: portalSection } : undefined,
});

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) initContactForm(contactForm);

const meridian = document.querySelector('[data-meridian]');
if (meridian) initMeridian(meridian);
