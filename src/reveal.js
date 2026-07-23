// Dispara a animação de entrada dos elementos .reveal — imediatamente para o
// hero (acima da dobra) e via IntersectionObserver para o restante da página.
export function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const heroElements = document.querySelectorAll('#hero .reveal');
  requestAnimationFrame(() => {
    heroElements.forEach((el) => el.classList.add('is-revealed'));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.reveal:not(#hero .reveal)').forEach((el) => observer.observe(el));
}
