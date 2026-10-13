// Comprobaciones baratas (sin three.js) para decidir si vale la pena montar la escena 3D.
// Las usan HeroVisual.astro (cargador propio) y la isla Escena3D.tsx antes de descargar three.

export interface OpcionesSoporte {
  /** Solo para pruebas: ignora la detección de gama baja y de ahorro de datos. */
  forzar?: boolean;
}

export type MotivoPoster = 'movimiento-reducido' | 'sin-webgl' | 'gama-baja' | 'ahorro-datos' | null;

interface NavegadorExtendido extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

/** Devuelve null si se puede montar la escena, o el motivo por el que se deja el póster. */
export function motivoParaPoster({ forzar = false }: OpcionesSoporte = {}): MotivoPoster {
  if (typeof window === 'undefined') return 'sin-webgl';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'movimiento-reducido';
  // «Pausar animaciones» del pie de página (src/scripts/pausa.ts).
  if (document.documentElement.hasAttribute('data-sin-movimiento')) return 'movimiento-reducido';
  // three.js (r163+) solo funciona con WebGL 2.
  if (!('WebGL2RenderingContext' in window)) return 'sin-webgl';
  if (forzar) return null;
  const nav = navigator as NavegadorExtendido;
  if (nav.connection?.saveData) return 'ahorro-datos';
  const nucleos = nav.hardwareConcurrency ?? 8;
  const memoria = nav.deviceMemory; // Safari y Firefox no la exponen: se trata como desconocida.
  if (nucleos <= 4 && memoria !== undefined && memoria <= 4) return 'gama-baja';
  return null;
}

export const puedeMontarEscena = (opciones?: OpcionesSoporte) => motivoParaPoster(opciones) === null && tieneWebGL2Real(opciones);

/**
 * Prueba un contexto WebGL 2 real antes de descargar three.js (unos 550 KB).
 * Con `failIfMajorPerformanceCaveat` el navegador devuelve null cuando solo hay
 * dibujo por software (SwiftShader, equipos sin GPU, Lighthouse): así se queda el
 * póster SVG sin errores en la consola. Cuesta unos milisegundos, por eso se llama
 * cuando el navegador está libre y justo antes de montar, no al cargar la página.
 */
export function tieneWebGL2Real({ forzar = false }: OpcionesSoporte = {}): boolean {
  try {
    const lienzo = document.createElement('canvas');
    const gl = lienzo.getContext('webgl2', { failIfMajorPerformanceCaveat: !forzar });
    if (!gl) return false;
    // Libera el contexto de prueba de inmediato (los navegadores limitan los contextos activos).
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** Celular o tableta: puntero grueso o pantalla angosta. Define calidad y densidad de píxeles. */
export const esCelular = () => window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 767px)').matches;
