// ─────────────────────────────────────────────────────────────────────────────
//  Efectos al desplazarse: ligeros, progresivos y accesibles.
//  Se activan solos al importar el módulo en una página:
//      <script>import '@/scripts/desplazamiento';</script>
//  (HeroVisual.astro ya lo importa.) Para contenido agregado después:
//      import { iniciarDesplazamiento } from '@/scripts/desplazamiento';
//      iniciarDesplazamiento(contenedor);
//
//  (a) [data-parallax="0.15"]      Desplazamiento vertical relativo. Positivo = más lento
//                                  (más lejos); negativo = más rápido. Usa transform.
//                                  CSS scroll-driven (view()) cuando existe; si no, rAF + IO.
//  (b) [data-contar]               Anima el número del texto (es-CO: 1.200.000 · 4,9 · 15+).
//                                  Opcionales: data-contar="1200000" (meta explícita),
//                                  data-desde="0", data-duracion="1600" (ms).
//  (c) [data-revelar-texto]        Revela palabra por palabra al entrar en pantalla.
//                                  data-revelar-texto="desplazamiento": se ilumina con el
//                                  desplazamiento (scrub). El texto completo queda para
//                                  lectores de pantalla; las palabras visibles son aria-hidden.
//  (d) [data-historia]             Narrativa "pegajosa" (position: sticky) con progreso:
//                                  hijos [data-historia-fijo], [data-historia-paso] (uno por
//                                  paso), opcionales [data-historia-escena] (uno por paso) y
//                                  [data-historia-barra]. Expone --historia-progreso (0-1),
//                                  --paso-progreso por paso, data-activo y aria-current="step".
//
//  Con "reducir movimiento" nada se mueve: el contenido queda en su estado final.
//  Sin JS, todo se ve normal (los estados ocultos solo existen cuando este script corre).
// ─────────────────────────────────────────────────────────────────────────────

const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
const reducido = () => consulta.matches;
const soportaVista = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');
const limitar = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
/** Opacidad de las palabras aún sin iluminar (data-revelar-texto="desplazamiento"). Con 0,52 el
 *  texto claro sobre #131315 conserva ≥ 4,5:1 (AA para cualquier tamaño). Debe coincidir con
 *  el .52 de ESTILOS (regla .vrs-iluminar y @keyframes vrs-iluminar). */
const OPACIDAD_MINIMA = 0.52;

// ── Estilos (se inyectan una vez; solo existen si el script corre) ──────────
const ESTILOS = `
.vrs-sr{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.vrs-palabra{display:inline-block}
@media (prefers-reduced-motion:no-preference){
  .vrs-revelar .vrs-palabra{opacity:0;transform:translate3d(0,.45em,0);transition:opacity .8s var(--ease-out-expo,ease-out),transform 1s var(--ease-out-expo,ease-out);transition-delay:calc(var(--i,0) * 38ms)}
  .vrs-revelar.vrs-revelado .vrs-palabra{opacity:1;transform:none}
  .vrs-iluminar .vrs-palabra{opacity:var(--o,.52);transition:opacity .25s linear}
  .vrs-historia{position:relative;min-height:calc(100svh + var(--historia-pasos,3) * var(--historia-tramo,70svh))}
  .vrs-historia [data-historia-fijo]{position:sticky;top:var(--alto-encabezado,0px);min-height:calc(100svh - var(--alto-encabezado,0px))}
  .vrs-historia [data-historia-paso]{transition:opacity .5s var(--ease-out-expo,ease-out),transform .6s var(--ease-out-expo,ease-out)}
  .vrs-historia [data-historia-paso]:not([data-activo]){opacity:.66}
}
@supports (animation-timeline:view()){
  @media (prefers-reduced-motion:no-preference){
    .vrs-parallax-css{animation:vrs-parallax linear both;animation-timeline:view();animation-range:cover 0% cover 100%}
    .vrs-iluminar{view-timeline-name:--vrs-texto}
    .vrs-iluminar .vrs-palabra{transition:none;animation:vrs-iluminar linear both;animation-timeline:--vrs-texto;
      animation-range:cover calc(18% + var(--i) / var(--n) * 26%) cover calc(24% + var(--i) / var(--n) * 26%)}
  }
}
@keyframes vrs-parallax{from{transform:translate3d(0,calc(var(--parallax,0) * -50vh),0)}to{transform:translate3d(0,calc(var(--parallax,0) * 50vh),0)}}
@keyframes vrs-iluminar{from{opacity:.52}to{opacity:1}}
`;

function inyectarEstilos() {
  if (document.getElementById('vrs-desplazamiento')) return;
  const estilo = document.createElement('style');
  estilo.id = 'vrs-desplazamiento';
  estilo.textContent = ESTILOS;
  document.head.appendChild(estilo);
}

/**
 * Prepara cada elemento solo cuando se acerca a la pantalla (200 px antes), no al cargar: así
 * la carga no mide ni reescribe el DOM de toda la página (tareas largas y reflujos forzados).
 * `preparar` recibe los elementos de cada aviso juntos, para leer todo y luego escribir todo.
 * Los que ya estaban a la vista en el primer aviso se dejan quietos (sin parpadeo).
 */
function alAcercarse(elementos: HTMLElement[], preparar: (lote: HTMLElement[]) => void, omitirVisibles = true) {
  if (!elementos.length) return;
  const vistos = new Set<Element>();
  const io = new IntersectionObserver(
    (entradas) => {
      const lote: HTMLElement[] = [];
      for (const e of entradas) {
        const primera = !vistos.has(e.target);
        vistos.add(e.target);
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const r = e.boundingClientRect;
        if (omitirVisibles && primera && r.bottom > 0 && r.top < window.innerHeight) continue;
        lote.push(e.target as HTMLElement);
      }
      if (lote.length) preparar(lote);
    },
    { rootMargin: '200px 0px' },
  );
  elementos.forEach((el) => io.observe(el));
}

// ── Bucle compartido de desplazamiento (un solo listener, un solo rAF) ─────
type Tarea = () => void;
const tareas = new Set<Tarea>();
let cuadroPendiente = 0;
const programar = () => {
  if (!cuadroPendiente) cuadroPendiente = requestAnimationFrame(ejecutar);
};
function ejecutar() {
  cuadroPendiente = 0;
  tareas.forEach((t) => t());
}
let escuchando = false;
function escuchar() {
  if (escuchando) return;
  escuchando = true;
  window.addEventListener('scroll', programar, { passive: true });
  window.addEventListener('resize', programar, { passive: true });
}

// ── (a) Parallax ────────────────────────────────────────────────────────────
interface Paralaje {
  el: HTMLElement;
  factor: number;
  actual: number;
  visible: boolean;
}
const paralajes: Paralaje[] = [];
let observadorParalaje: IntersectionObserver | undefined;

function tareaParalaje() {
  const vh = window.innerHeight;
  // Primero se lee todo, luego se escribe (sin forzar diseño repetido).
  const nuevos = paralajes.map((p) => {
    if (!p.visible) return null;
    const r = p.el.getBoundingClientRect();
    const arriba = r.top - p.actual; // posición sin el desplazamiento aplicado
    const progreso = (vh - arriba) / (vh + r.height);
    return p.factor * vh * (limitar(progreso, -0.2, 1.2) - 0.5);
  });
  nuevos.forEach((y, i) => {
    if (y === null) return;
    const p = paralajes[i];
    if (Math.abs(y - p.actual) < 0.1) return;
    p.actual = y;
    p.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  });
}

function iniciarParalaje(raiz: ParentNode) {
  raiz.querySelectorAll<HTMLElement>('[data-parallax]:not([data-parallax-listo])').forEach((el) => {
    el.dataset.parallaxListo = '';
    const factor = Number.parseFloat(el.dataset.parallax || '0.15');
    if (!Number.isFinite(factor) || factor === 0) return;
    if (soportaVista) {
      el.style.setProperty('--parallax', String(factor));
      el.classList.add('vrs-parallax-css');
      return;
    }
    const p: Paralaje = { el, factor, actual: 0, visible: false };
    paralajes.push(p);
    observadorParalaje ??= new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const item = paralajes.find((x) => x.el === e.target);
          if (item) item.visible = e.isIntersecting;
        }
        programar();
      },
      { rootMargin: '25% 0px' },
    );
    observadorParalaje.observe(el);
  });
  if (paralajes.length) {
    tareas.add(tareaParalaje);
    escuchar();
    programar();
  }
}

// ── (b) Contadores ──────────────────────────────────────────────────────────
/** Formato colombiano: punto de miles, coma decimal. */
function formatoNumero(valor: number, decimales: number) {
  const [entero, fraccion] = Math.abs(valor).toFixed(decimales).split('.');
  const miles = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (valor < 0 ? '-' : '') + miles + (fraccion ? ',' + fraccion : '');
}

const observadorContar =
  typeof IntersectionObserver === 'undefined'
    ? undefined
    : new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            if (!e.isIntersecting) continue;
            observadorContar?.unobserve(e.target);
            (e.target as HTMLElement & { _contar?: () => void })._contar?.();
          }
        },
        { threshold: 0.6 },
      );

function iniciarContadores(raiz: ParentNode) {
  const elementos = Array.from(raiz.querySelectorAll<HTMLElement>('[data-contar]:not([data-contar-listo])'));
  elementos.forEach((el) => (el.dataset.contarListo = ''));
  alAcercarse(elementos, prepararContadores);
}

function prepararContadores(lote: HTMLElement[]) {
  // Primero se leen todos los anchos; después se reescribe el DOM.
  const anchos = lote.map((el) => el.getBoundingClientRect().width);
  lote.forEach((el, n) => {
    const texto = el.textContent ?? '';
    const m = texto.match(/-?\d[\d.]*(?:,\d+)?/);
    if (!m || m.index === undefined) return;
    const prefijo = texto.slice(0, m.index);
    const sufijo = texto.slice(m.index + m[0].length);
    const decimales = m[0].includes(',') ? m[0].split(',')[1].length : 0;
    const meta = el.dataset.contar ? Number(el.dataset.contar) : Number(m[0].replace(/\./g, '').replace(',', '.'));
    if (!Number.isFinite(meta)) return;
    const desde = Number(el.dataset.desde ?? 0);
    const duracion = Number(el.dataset.duracion ?? 1600);

    // Reserva el ancho final (sin saltos de diseño) y separa lo visual de lo accesible.
    const ancho = anchos[n] ?? 0;
    const accesible = document.createElement('span');
    accesible.className = 'vrs-sr';
    accesible.textContent = texto;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    visual.style.cssText = `display:inline-block;min-width:${Math.ceil(ancho)}px;font-variant-numeric:tabular-nums`;
    const pintar = (v: number) => (visual.textContent = prefijo + formatoNumero(v, decimales) + sufijo);
    pintar(desde);
    el.replaceChildren(accesible, visual);

    (el as HTMLElement & { _contar?: () => void })._contar = () => {
      const inicio = performance.now();
      const paso = (ahora: number) => {
        const t = limitar((ahora - inicio) / duracion);
        const e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // salida exponencial
        pintar(desde + (meta - desde) * e);
        if (t < 1) requestAnimationFrame(paso);
        else el.replaceChildren(texto); // estado final idéntico al HTML original
      };
      requestAnimationFrame(paso);
    };
    observadorContar?.observe(el);
  });
}

// ── (c) Texto que se revela palabra por palabra ────────────────────────────
const INTERACTIVOS = 'a,button,input,select,textarea,details,[tabindex]';

/** Reconstruye el contenido en palabras (span.vrs-palabra) conservando etiquetas en línea. */
function partirEnPalabras(origen: Node, destino: Node, cuenta: { i: number }) {
  for (const hijo of Array.from(origen.childNodes)) {
    if (hijo.nodeType === Node.TEXT_NODE) {
      for (const parte of (hijo.textContent ?? '').split(/(\s+)/)) {
        if (!parte) continue;
        if (/^\s+$/.test(parte)) {
          destino.appendChild(document.createTextNode(parte));
          continue;
        }
        const s = document.createElement('span');
        s.className = 'vrs-palabra';
        s.style.setProperty('--i', String(cuenta.i++));
        s.textContent = parte;
        destino.appendChild(s);
      }
    } else if (hijo instanceof Element) {
      const copia = hijo.cloneNode(false) as Element;
      copia.removeAttribute('id');
      // Texto con degradado: se reconoce por su clase (sin getComputedStyle, que fuerza un reflujo).
      const degradado = hijo.classList.contains('degradado-texto');
      if (hijo.tagName === 'BR') {
        destino.appendChild(copia);
      } else if (degradado || hijo instanceof SVGElement) {
        // Texto con degradado o iconos: se revela como una sola unidad.
        const unidad = document.createElement('span');
        unidad.className = 'vrs-palabra';
        unidad.style.setProperty('--i', String(cuenta.i++));
        unidad.appendChild(hijo.cloneNode(true));
        destino.appendChild(unidad);
      } else {
        partirEnPalabras(hijo, copia, cuenta);
        destino.appendChild(copia);
      }
    }
  }
}

interface Iluminable {
  el: HTMLElement;
  palabras: HTMLElement[];
  visible: boolean;
}
const iluminables: Iluminable[] = [];

function tareaIluminar() {
  const vh = window.innerHeight;
  for (const it of iluminables) {
    if (!it.visible) continue;
    const r = it.el.getBoundingClientRect();
    const progreso = (vh - r.top) / (vh + r.height); // igual que "cover" en CSS
    const n = it.palabras.length;
    it.palabras.forEach((p, i) => {
      const a = 0.18 + (i / n) * 0.26;
      const o = OPACIDAD_MINIMA + (1 - OPACIDAD_MINIMA) * limitar((progreso - a) / 0.06);
      p.style.setProperty('--o', o.toFixed(2));
    });
  }
}

let observadorIluminar: IntersectionObserver | undefined;
let observadorEntrada: IntersectionObserver | undefined;

function iniciarRevelarTexto(raiz: ParentNode) {
  const elementos = Array.from(raiz.querySelectorAll<HTMLElement>('[data-revelar-texto]:not([data-revelar-listo])'));
  elementos.forEach((el) => (el.dataset.revelarListo = ''));
  alAcercarse(
    elementos.filter((el) => !el.querySelector(INTERACTIVOS)),
    prepararRevelarTexto,
  );
}

function prepararRevelarTexto(lote: HTMLElement[]) {
  const entradas: HTMLElement[] = [];
  lote.forEach((el) => {
    const modo = el.dataset.revelarTexto === 'desplazamiento' ? 'desplazamiento' : 'entrada';

    const accesible = document.createElement('span');
    accesible.className = 'vrs-sr';
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    const cuenta = { i: 0 };
    partirEnPalabras(el, visual, cuenta);
    accesible.append(...Array.from(el.childNodes));
    el.replaceChildren(accesible, visual);
    el.style.setProperty('--n', String(Math.max(1, cuenta.i)));

    if (modo === 'entrada') {
      el.classList.add('vrs-revelar');
      entradas.push(el);
      return;
    }
    el.classList.add('vrs-iluminar');
    if (soportaVista) return; // lo resuelve CSS (animation-timeline)
    const it: Iluminable = { el, palabras: Array.from(visual.querySelectorAll<HTMLElement>('.vrs-palabra')), visible: false };
    iluminables.push(it);
    observadorIluminar ??= new IntersectionObserver((es) => {
      for (const e of es) {
        const item = iluminables.find((x) => x.el === e.target);
        if (item) item.visible = e.isIntersecting;
      }
      programar();
    });
    observadorIluminar.observe(el);
  });

  if (entradas.length) {
    observadorEntrada ??= new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('vrs-revelado');
          observadorEntrada?.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.2 },
    );
    entradas.forEach((el) => observadorEntrada?.observe(el));
  }
  if (iluminables.length) {
    tareas.add(tareaIluminar);
    escuchar();
    programar();
  }
}

// ── (d) Historia pegajosa ───────────────────────────────────────────────────
interface Historia {
  el: HTMLElement;
  fijo: HTMLElement;
  pasos: HTMLElement[];
  escenas: HTMLElement[];
  activo: number;
  visible: boolean;
  /** top del bloque fijo (px) y su alto: se miden al preparar y al cambiar el tamaño de la ventana. */
  arriba: number;
  altoFijo: number;
}
let medirHistorias = false;
const historias: Historia[] = [];

function marcarPaso(h: Historia, indice: number) {
  if (indice === h.activo) return;
  h.activo = indice;
  h.el.dataset.pasoActivo = String(indice);
  h.pasos.forEach((p, i) => {
    p.toggleAttribute('data-activo', i === indice);
    if (i === indice) p.setAttribute('aria-current', 'step');
    else p.removeAttribute('aria-current');
  });
  h.escenas.forEach((e, i) => e.toggleAttribute('data-activo', i === indice));
}

function tareaHistoria() {
  if (medirHistorias) {
    medirHistorias = false;
    for (const h of historias) {
      h.arriba = Number.parseFloat(getComputedStyle(h.fijo).top) || 0; // top del sticky, ya en px
      h.altoFijo = h.fijo.offsetHeight;
    }
  }
  for (const h of historias) {
    if (!h.visible) continue;
    const r = h.el.getBoundingClientRect();
    const recorrido = Math.max(1, r.height - h.altoFijo);
    const progreso = limitar((h.arriba - r.top) / recorrido);
    const n = h.pasos.length;
    h.el.style.setProperty('--historia-progreso', progreso.toFixed(4));
    h.pasos.forEach((p, i) => p.style.setProperty('--paso-progreso', limitar(progreso * n - i).toFixed(3)));
    marcarPaso(h, Math.min(n - 1, Math.floor(progreso * n)));
  }
}

let observadorHistorias: IntersectionObserver | undefined;

function iniciarHistorias(raiz: ParentNode) {
  const elementos = Array.from(raiz.querySelectorAll<HTMLElement>('[data-historia]:not([data-historia-lista])'));
  elementos.forEach((el) => (el.dataset.historiaLista = ''));
  // La historia se arma también si ya está a la vista (no tiene un estado «quieto» propio).
  alAcercarse(elementos, prepararHistorias, false);
}

function prepararHistorias(lote: HTMLElement[]) {
  lote.forEach((el) => {
    const fijo = el.querySelector<HTMLElement>('[data-historia-fijo]');
    const pasos = Array.from(el.querySelectorAll<HTMLElement>('[data-historia-paso]'));
    if (!fijo || pasos.length < 2) return;
    const h: Historia = {
      el,
      fijo,
      pasos,
      escenas: Array.from(el.querySelectorAll<HTMLElement>('[data-historia-escena]')),
      activo: -1,
      visible: false,
      arriba: 0,
      altoFijo: 0,
    };
    el.style.setProperty('--historia-pasos', String(pasos.length));
    // En celular la historia no se fija: la pantalla y los pasos se leen completos, en lista normal.
    if (!window.matchMedia('(min-width: 1024px)').matches) {
      pasos.forEach((p) => p.setAttribute('data-activo', ''));
      return;
    }
    // Si el bloque fijo no cabe en la pantalla (bajo el encabezado), se queda como lista normal.
    el.classList.add('vrs-historia');
    h.arriba = Number.parseFloat(getComputedStyle(fijo).top) || 0;
    const disponible = window.innerHeight - h.arriba;
    if (fijo.scrollHeight > disponible + 1) {
      el.classList.remove('vrs-historia');
      pasos.forEach((p) => p.setAttribute('data-activo', ''));
      return;
    }
    h.altoFijo = fijo.offsetHeight;
    marcarPaso(h, 0);
    historias.push(h);
    observadorHistorias ??= new IntersectionObserver((es) => {
      for (const e of es) {
        const item = historias.find((x) => x.el === e.target);
        if (item) item.visible = e.isIntersecting;
      }
      programar();
    });
    observadorHistorias.observe(el);
  });
  if (historias.length) {
    tareas.add(tareaHistoria);
    window.addEventListener('resize', () => (medirHistorias = true), { passive: true });
    escuchar();
    programar();
  }
}

// ── Movimiento reducido ─────────────────────────────────────────────────────
/** Deja todo en su estado final. Se usa al iniciar con movimiento reducido o si la persona lo activa después. */
function estadoFinal(raiz: ParentNode = document) {
  tareas.clear();
  paralajes.forEach((p) => (p.el.style.transform = ''));
  raiz.querySelectorAll('.vrs-revelar').forEach((el) => el.classList.add('vrs-revelado'));
  iluminables.forEach((it) => it.palabras.forEach((p) => p.style.setProperty('--o', '1')));
  historias.forEach((h) => {
    h.el.classList.remove('vrs-historia');
    h.pasos.forEach((p) => p.setAttribute('data-activo', ''));
  });
  raiz.querySelectorAll<HTMLElement & { _contar?: () => void }>('[data-contar]').forEach((el) => {
    const accesible = el.querySelector('.vrs-sr');
    if (accesible) el.replaceChildren(accesible.textContent ?? '');
  });
}

/** Activa los efectos en `raiz` (idempotente: cada elemento se procesa una vez). */
export function iniciarDesplazamiento(raiz: ParentNode = document) {
  if (reducido()) return;
  inyectarEstilos();
  iniciarParalaje(raiz);
  iniciarContadores(raiz);
  iniciarRevelarTexto(raiz);
  iniciarHistorias(raiz);
}

iniciarDesplazamiento();
consulta.addEventListener('change', () => {
  if (reducido()) estadoFinal();
});
