// Carrossel horizontal do portfolio: um slide por vez, ocupando a largura
// inteira do palco. Ao avançar/voltar, a trilha desliza inteira — o slide
// atual é "empurrado" para fora enquanto o próximo é "puxado" para dentro.
export function initPortfolioCarousel(root) {
  const track = root.querySelector('[data-portfolio-track]');
  const slides = Array.from(track.children);
  const prevBtn = root.querySelector('[data-portfolio-prev]');
  const nextBtn = root.querySelector('[data-portfolio-next]');
  const currentLabel = root.querySelector('[data-portfolio-current]');
  const totalLabel = root.querySelector('[data-portfolio-total]');

  let index = 0;

  function pad(n) {
    return String(n + 1).padStart(2, '0');
  }

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    if (currentLabel) currentLabel.textContent = pad(index);
  }

  function goTo(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    render();
  }

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  if (totalLabel) totalLabel.textContent = pad(slides.length - 1);
  render();
}
