// ─────────────────────────────────────────────────────────────────────────────
//  Saltos a #anclas que caen en su lugar.
//  Las secciones usan content-visibility: auto (global.css) con un alto provisional de 900 px.
//  Tras el salto, el navegador pinta las secciones vecinas con su alto real y los efectos de
//  desplazamiento.ts arman las suyas; si eso pasa arriba del destino, el contenido baja y el
//  navegador no siempre lo compensa (las transiciones de entrada anulan su «scroll anchoring»).
//  Aquí, durante unos instantes tras el salto, si el destino se mueve se vuelve a alinear.
//  Se detiene apenas la persona usa la rueda, el dedo, el ratón o el teclado.
// ─────────────────────────────────────────────────────────────────────────────
const ENTRADAS = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
/** Tiempo máximo de vigilancia y cuadros seguidos sin movimiento para darlo por asentado. */
const MAXIMO_MS = 2500;
const CUADROS_QUIETO = 40;

let detenerActual: (() => void) | undefined;

function fijar(destino: HTMLElement) {
  detenerActual?.();
  let cuadro = 0;
  const detener = () => {
    cancelAnimationFrame(cuadro);
    ENTRADAS.forEach((t) => window.removeEventListener(t, detener));
    if (detenerActual === detener) detenerActual = undefined;
  };
  detenerActual = detener;
  ENTRADAS.forEach((t) => window.addEventListener(t, detener, { passive: true }));

  const alinear = () => {
    destino.scrollIntoView({ block: 'start', behavior: 'instant' });
    return destino.getBoundingClientRect().top;
  };
  let ultima = alinear();
  let quieto = 0;
  const inicio = performance.now();
  const revisar = () => {
    const arriba = destino.getBoundingClientRect().top;
    if (Math.abs(arriba - ultima) > 1) {
      ultima = alinear();
      quieto = 0;
    } else quieto++;
    if (quieto < CUADROS_QUIETO && performance.now() - inicio < MAXIMO_MS) cuadro = requestAnimationFrame(revisar);
    else detener();
  };
  cuadro = requestAnimationFrame(revisar);
}

const destinoDe = (hash: string) => {
  if (hash.length < 2) return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
};

// Enlaces a otra parte de la misma página (índices «En esta página», «Saltar al contenido»…).
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const enlace = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href*="#"]');
  if (!enlace || enlace.target || enlace.origin !== location.origin || enlace.pathname !== location.pathname) return;
  const destino = destinoDe(enlace.hash);
  // Después del salto del navegador (que también abre un <details> que lo contenga).
  if (destino) requestAnimationFrame(() => fijar(destino));
});

// Llegada desde otra página a una dirección con #ancla (no al recargar: ahí se respeta la
// posición que restaura el navegador).
const navegacion = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
if (location.hash && navegacion?.type !== 'reload' && navegacion?.type !== 'back_forward') {
  const destino = destinoDe(location.hash);
  if (destino) fijar(destino);
}
