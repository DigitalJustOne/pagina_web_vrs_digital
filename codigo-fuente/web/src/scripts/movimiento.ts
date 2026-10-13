// Revela elementos con [data-revelar] (tarjetas y visuales, nunca títulos ni párrafos) un poco
// antes de que entren en pantalla: quien lee nunca ve un hueco vacío mientras se desplaza.
// Con movimiento reducido o sin soporte, todo queda visible (ver global.css).
const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function iniciar() {
  const elementos = document.querySelectorAll<HTMLElement>('[data-revelar]:not(.visible)');
  if (reducido || !('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px 20% 0px', threshold: 0 },
  );
  elementos.forEach((el) => obs.observe(el));
}

iniciar();
