// ─────────────────────────────────────────────────────────────────────────────
//  Inclinación 3D que sigue al puntero, para los visuales de portada del grupo «sectores»
//  (PilaPlanes, MosaicoProyectos).
//  Escribe --rx y --ry (grados) en el elemento; el CSS de cada visual decide cómo usarlos.
//  Solo con puntero fino (mouse) y sin «reducir movimiento». Sin JS, el visual queda quieto.
// ─────────────────────────────────────────────────────────────────────────────
export function inclinar(selector: string, fuerza: { x: number; y: number } = { x: 12, y: 8 }) {
  const fino = window.matchMedia('(pointer: fine)').matches;
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fino || reducido) return;
  for (const el of document.querySelectorAll<HTMLElement>(selector)) {
    let cuadro = 0;
    let x = 0;
    let y = 0;
    // La zona es la portada completa: el visual reacciona aunque el puntero esté sobre el texto.
    const zona = el.closest('header') ?? el;
    zona.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      if (cuadro) return;
      cuadro = requestAnimationFrame(() => {
        cuadro = 0;
        el.style.setProperty('--ry', `${(x * fuerza.x).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-y * fuerza.y).toFixed(2)}deg`);
      });
    });
    zona.addEventListener('pointerleave', () => {
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--rx', '0deg');
    });
  }
}
