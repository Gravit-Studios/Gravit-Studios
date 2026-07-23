// Esconde o header ao rolar para baixo e mostra ao rolar para cima, com
// pequena tolerância no topo da página para não "piscar" perto do hero.
export function initNavScroll(header) {
  const HIDE_THRESHOLD = 80;
  let lastScrollY = window.scrollY;
  let ticking = false;

  function update() {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;

    if (currentScrollY <= HIDE_THRESHOLD) {
      header.classList.remove('header--hidden');
    } else if (scrollingDown) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  });
}
