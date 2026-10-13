// ─────────────────────────────────────────────────────────────────────────────
//  Montaje de la escena 3D en la página (lado del DOM).
//  - Preferido: Worker + OffscreenCanvas. three.js se descarga, evalúa, compila y
//    dibuja fuera del hilo principal: cero tareas largas en la página (INP intacto).
//  - Respaldo: si el trabajador no tiene WebGL 2 (Safari 16, por ejemplo), el mismo
//    núcleo corre en el hilo principal, montado en tramos cortos con cesiones.
//  - Aquí viven los observadores: tamaño (ResizeObserver), visibilidad
//    (IntersectionObserver + visibilitychange), puntero y desplazamiento.
//  Uso: HeroVisual.astro (cargador propio) o la isla Escena3D.tsx.
// ─────────────────────────────────────────────────────────────────────────────
import type { ConfigNucleo } from './Escena3DNucleo';
import type { MensajeAlTrabajador, MensajeDelTrabajador } from './Escena3DTrabajador';
import { esCelular } from './Escena3DSoporte';

export interface OpcionesEscena {
  /** Solo pruebas: permite renderizado por software (SwiftShader). En producción se rechaza. */
  forzar?: boolean;
  /** Fuerza la calidad de celular. Por defecto se detecta. */
  celular?: boolean;
  /** Dónde correr: 'auto' (trabajador si se puede), 'principal' o 'trabajador'. */
  hilo?: 'auto' | 'principal' | 'trabajador';
  /** Se llama si el navegador pierde el contexto WebGL (la escena ya se destruyó). */
  alPerderContexto?: () => void;
  /** Cancela el montaje en curso o destruye la escena montada. */
  senal?: AbortSignal;
}

export interface MetricasEscena {
  /** ms desde que se llamó montarEscena hasta el primer cuadro listo. */
  total: number;
  hilo: 'trabajador' | 'principal';
  /** Tramos del montaje (ms) medidos en el hilo donde corre la escena. */
  tramos: Record<string, number>;
  densidadPixeles: number;
  suavizado: boolean;
  llamadasDibujo: number;
  calidad: 'celular' | 'computador';
}

export interface ControlEscena {
  lienzo: HTMLCanvasElement;
  metricas: MetricasEscena;
  destruir: () => void;
}

interface Puente {
  tamano: (ancho: number, alto: number) => void;
  puntero: (x: number, y: number) => void;
  desplazamiento: (s: number) => void;
  activo: (si: boolean) => void;
  destruir: () => void;
}

interface Montado {
  puente: Puente;
  tramos: Record<string, number>;
  llamadasDibujo: number;
}

class SinSoporteEnTrabajador extends Error {}

const soportaTrabajador = () =>
  typeof Worker !== 'undefined' &&
  typeof OffscreenCanvas !== 'undefined' &&
  'transferControlToOffscreen' in HTMLCanvasElement.prototype;

function crearLienzo(anfitrion: HTMLElement) {
  const lienzo = document.createElement('canvas');
  lienzo.setAttribute('aria-hidden', 'true');
  lienzo.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  anfitrion.appendChild(lienzo);
  return lienzo;
}

function enTrabajador(lienzo: HTMLCanvasElement, config: ConfigNucleo, alPerder: () => void, senal?: AbortSignal) {
  return new Promise<Montado>((resolver, rechazar) => {
    const trabajador = new Worker(new URL('./Escena3DTrabajador.ts', import.meta.url), { type: 'module', name: 'escena-3d' });
    const enviar = (m: MensajeAlTrabajador, transferir: Transferable[] = []) => trabajador.postMessage(m, transferir);
    let lista = false;
    const terminar = () => trabajador.terminate();
    const cancelar = () => {
      terminar();
      rechazar(new Error('Montaje cancelado'));
    };
    senal?.addEventListener('abort', cancelar, { once: true });

    trabajador.onmessage = ({ data: m }: MessageEvent<MensajeDelTrabajador>) => {
      if (m.tipo === 'lista') {
        lista = true;
        senal?.removeEventListener('abort', cancelar);
        resolver({
          tramos: m.tramos,
          llamadasDibujo: m.llamadasDibujo,
          puente: {
            tamano: (ancho, alto) => enviar({ tipo: 'tamano', ancho, alto }),
            puntero: (x, y) => enviar({ tipo: 'puntero', x, y }),
            desplazamiento: (s) => enviar({ tipo: 'desplazamiento', s }),
            activo: (valor) => enviar({ tipo: 'activo', valor }),
            destruir: () => {
              // El trabajador libera la GPU y se cierra; terminate() es la red de seguridad.
              enviar({ tipo: 'destruir' });
              setTimeout(terminar, 500);
            },
          },
        });
      } else if (m.tipo === 'error') {
        terminar();
        rechazar(m.sinSoporte ? new SinSoporteEnTrabajador(m.mensaje) : new Error(m.mensaje));
      } else if (m.tipo === 'perdido') {
        terminar();
        if (lista) alPerder();
        else rechazar(new Error('Contexto WebGL perdido'));
      }
    };
    trabajador.onerror = (e) => {
      e.preventDefault();
      terminar();
      rechazar(new Error(e.message || 'Error en el trabajador'));
    };

    const pantalla = lienzo.transferControlToOffscreen();
    enviar({ tipo: 'iniciar', lienzo: pantalla, config }, [pantalla]);
  });
}

async function enHiloPrincipal(lienzo: HTMLCanvasElement, config: ConfigNucleo, alPerder: () => void): Promise<Montado> {
  const { crearNucleo } = await import('./Escena3DNucleo');
  const n = await crearNucleo(lienzo, config, alPerder);
  return {
    tramos: n.tramos,
    llamadasDibujo: n.llamadasDibujo,
    puente: {
      tamano: n.redimensionar,
      puntero: n.puntero,
      desplazamiento: n.desplazamiento,
      activo: n.activar,
      destruir: n.destruir,
    },
  };
}

/** Monta la escena dentro de `anfitrion` (posición relativa y tamaño definido). Rechaza si no puede. */
export async function montarEscena(anfitrion: HTMLElement, opciones: OpcionesEscena = {}): Promise<ControlEscena> {
  const inicio = performance.now();
  const { senal } = opciones;
  const celular = opciones.celular ?? esCelular();
  const densidad = Math.min(window.devicePixelRatio || 1, celular ? 1.25 : 1.75);
  // En computador siempre hay suavizado; en celular solo si el equipo tiene núcleos de sobra.
  const suavizado = !celular || (navigator.hardwareConcurrency ?? 4) >= 6;
  const caja = anfitrion.getBoundingClientRect();
  const config: ConfigNucleo = { ancho: caja.width, alto: caja.height, densidad, celular, suavizado, forzar: !!opciones.forzar };

  let destruida = false;
  let puente: Puente | undefined;
  const desmontadores: Array<() => void> = [];
  let lienzo = crearLienzo(anfitrion);

  const destruir = () => {
    if (destruida) return;
    destruida = true;
    desmontadores.forEach((fn) => fn());
    puente?.destruir();
    lienzo.remove();
  };
  const alPerder = () => {
    destruir();
    opciones.alPerderContexto?.();
  };

  // 1. Montaje: trabajador si se puede; si el trabajador no tiene WebGL 2, hilo principal.
  let montado: Montado | undefined;
  let hilo: MetricasEscena['hilo'] = 'principal';
  try {
    if (opciones.hilo !== 'principal' && soportaTrabajador()) {
      try {
        montado = await enTrabajador(lienzo, config, alPerder, senal);
        hilo = 'trabajador';
      } catch (error) {
        // Un lienzo transferido ya no sirve en el hilo principal: se reemplaza.
        lienzo.remove();
        if (!(error instanceof SinSoporteEnTrabajador) || opciones.hilo === 'trabajador') throw error;
        lienzo = crearLienzo(anfitrion);
      }
    }
    if (senal?.aborted) throw new Error('Montaje cancelado');
    montado ??= await enHiloPrincipal(lienzo, config, alPerder);
  } catch (error) {
    destruida = true;
    lienzo.remove();
    throw error;
  }
  puente = montado.puente;
  if (senal?.aborted) {
    destruir();
    throw new Error('Montaje cancelado');
  }
  senal?.addEventListener('abort', destruir, { once: true });
  desmontadores.push(() => senal?.removeEventListener('abort', destruir));

  // 2. Desplazamiento: progreso desde que el visual entra en pantalla (0 en reposo en el hero).
  let arribaDocumento = caja.top + window.scrollY;
  const progreso = () => {
    const inicioDesp = Math.max(0, arribaDocumento - window.innerHeight);
    return Math.min(1.4, Math.max(0, (window.scrollY - inicioDesp) / window.innerHeight));
  };
  // Puntero y desplazamiento se agrupan en un solo envío por cuadro.
  let px = 0;
  let py = 0;
  let cuadroPendiente = 0;
  let ultimoS = -1;
  const enviarCuadro = () => {
    cuadroPendiente = 0;
    puente?.puntero(px, py);
    const s = progreso();
    if (Math.abs(s - ultimoS) > 0.0005) {
      ultimoS = s;
      puente?.desplazamiento(s);
    }
  };
  const programar = () => {
    if (!cuadroPendiente) cuadroPendiente = requestAnimationFrame(enviarCuadro);
  };
  const alMover = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return; // en pantallas táctiles manda el desplazamiento
    px = (e.clientX / window.innerWidth) * 2 - 1;
    py = (e.clientY / window.innerHeight) * 2 - 1;
    programar();
  };
  const alSalir = () => {
    px = 0;
    py = 0;
    programar();
  };
  window.addEventListener('pointermove', alMover, { passive: true });
  window.addEventListener('scroll', programar, { passive: true });
  document.documentElement.addEventListener('pointerleave', alSalir);
  desmontadores.push(() => {
    cancelAnimationFrame(cuadroPendiente);
    window.removeEventListener('pointermove', alMover);
    window.removeEventListener('scroll', programar);
    document.documentElement.removeEventListener('pointerleave', alSalir);
  });
  enviarCuadro();

  // 3. Pausa fuera de pantalla o con la pestaña oculta.
  // También se detiene con «Pausar animaciones» (evento 'vrs:movimiento' de src/scripts/pausa.ts).
  let enPantalla = true;
  const sinMovimiento = () => document.documentElement.hasAttribute('data-sin-movimiento');
  const actualizar = () => puente?.activo(enPantalla && !document.hidden && !destruida && !sinMovimiento());
  const observador = new IntersectionObserver(([e]) => {
    enPantalla = e.isIntersecting;
    actualizar();
  });
  observador.observe(anfitrion);
  document.addEventListener('visibilitychange', actualizar);
  window.addEventListener('vrs:movimiento', actualizar);
  desmontadores.push(() => {
    observador.disconnect();
    document.removeEventListener('visibilitychange', actualizar);
    window.removeEventListener('vrs:movimiento', actualizar);
  });

  // 4. Tamaño (sin escuchar resize en cada cuadro). Solo se envía si cambió.
  let ultimoTamano = [config.ancho, config.alto];
  const redimensionador = new ResizeObserver(([e]) => {
    const { width, height } = e.contentRect;
    if (Math.abs(width - ultimoTamano[0]) < 0.5 && Math.abs(height - ultimoTamano[1]) < 0.5) return;
    ultimoTamano = [width, height];
    arribaDocumento = anfitrion.getBoundingClientRect().top + window.scrollY;
    puente?.tamano(width, height);
  });
  redimensionador.observe(anfitrion);
  desmontadores.push(() => redimensionador.disconnect());

  actualizar();

  return {
    lienzo,
    destruir,
    metricas: {
      total: Math.round(performance.now() - inicio),
      hilo,
      tramos: montado.tramos,
      densidadPixeles: densidad,
      suavizado,
      llamadasDibujo: montado.llamadasDibujo,
      calidad: celular ? 'celular' : 'computador',
    },
  };
}
