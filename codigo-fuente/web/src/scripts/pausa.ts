// ─────────────────────────────────────────────────────────────────────────────
//  Bucles de animación (CSS con iteraciones infinitas):
//  1. Fuera de pantalla se pausan solos: no recalculan estilos en el hilo principal mientras
//     nadie los ve (cada toque responde antes, INP) y no gastan batería.
//  2. «Pausar animaciones» (WCAG 2.2.2): botones [data-pausar-movimiento] (pie de página).
//  - Pausa los bucles infinitos de CSS (retículas, pulsos, tarjetas flotantes, anillos) con la
//    API de animaciones del navegador; las entradas cortas terminan normalmente.
//  - Marca html[data-sin-movimiento]: la escena 3D se detiene y la conversación de ejemplo se
//    muestra completa, como con «reducir movimiento» del sistema.
//  - Guarda la elección en localStorage (el script en línea de Base.astro la aplica al cargar).
//  - Avisa con el evento 'vrs:movimiento' (detail.pausado) a quien tenga su propio bucle.
// ─────────────────────────────────────────────────────────────────────────────
export const CLAVE_SIN_MOVIMIENTO = 'vrs-sin-movimiento';

const raiz = document.documentElement;
const botones = document.querySelectorAll<HTMLButtonElement>('[data-pausar-movimiento]');
const esBucle = (a: Animation) => a.effect?.getComputedTiming().iterations === Infinity;

let pausado = raiz.hasAttribute('data-sin-movimiento');

// ── Bucles por contenedor (sección, portada, figura o pie) y si está en pantalla ──
const porContenedor = new Map<Element, Set<Animation>>();
const fuera = new Set<Element>();
const contenedorDe = (el: Element) => el.closest('section, header, footer, figure, dialog') ?? el;
const observador =
  'IntersectionObserver' in window
    ? new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            if (e.isIntersecting) fuera.delete(e.target);
            else fuera.add(e.target);
            ajustar(porContenedor.get(e.target), e.target);
          }
        },
        { rootMargin: '100px 0px' },
      )
    : null;

function ajustar(animaciones: Iterable<Animation> | undefined, contenedor: Element) {
  if (!animaciones) return;
  const detener = pausado || fuera.has(contenedor);
  for (const a of animaciones) {
    if (a.playState === 'finished' || a.playState === 'idle') continue;
    if (detener && a.playState === 'running') a.pause();
    else if (!detener && a.playState === 'paused') a.play();
  }
}

function registrar(a: Animation) {
  if (!esBucle(a)) return;
  const destino = (a.effect as KeyframeEffect | null)?.target;
  if (!destino) return;
  const contenedor = contenedorDe(destino);
  let grupo = porContenedor.get(contenedor);
  if (!grupo) {
    grupo = new Set();
    porContenedor.set(contenedor, grupo);
    observador?.observe(contenedor);
  }
  grupo.add(a);
  ajustar([a], contenedor);
}

function aplicar(animaciones: Animation[]) {
  for (const a of animaciones) {
    if (!esBucle(a)) continue;
    const destino = (a.effect as KeyframeEffect | null)?.target;
    if (destino && porContenedor.get(contenedorDe(destino))?.has(a)) ajustar([a], contenedorDe(destino));
    else registrar(a);
  }
}

function pintarBotones() {
  for (const b of botones) {
    b.setAttribute('aria-pressed', String(pausado));
    const texto = b.querySelector('[data-texto]');
    if (texto) texto.textContent = pausado ? 'Reanudar animaciones' : 'Pausar animaciones';
  }
}

function cambiar(nuevo: boolean) {
  pausado = nuevo;
  raiz.toggleAttribute('data-sin-movimiento', pausado);
  try {
    if (pausado) localStorage.setItem(CLAVE_SIN_MOVIMIENTO, '1');
    else localStorage.removeItem(CLAVE_SIN_MOVIMIENTO);
  } catch {
    // Sin almacenamiento (navegación privada): la pausa vale solo para esta página.
  }
  for (const [contenedor, grupo] of porContenedor) ajustar(grupo, contenedor);
  aplicar(document.getAnimations());
  pintarBotones();
  window.dispatchEvent(new CustomEvent('vrs:movimiento', { detail: { pausado } }));
}

if ('getAnimations' in document) {
  // Los bucles que empiezan después (con retraso o al cambiar una clase) también se registran.
  document.addEventListener(
    'animationstart',
    (e) => {
      if (e.target instanceof Element) aplicar(e.target.getAnimations({ subtree: true })); // incluye ::before y ::after
    },
    true,
  );
  aplicar(document.getAnimations());
  pintarBotones();
  for (const b of botones) {
    b.hidden = false;
    b.addEventListener('click', () => cambiar(!pausado));
  }
}
