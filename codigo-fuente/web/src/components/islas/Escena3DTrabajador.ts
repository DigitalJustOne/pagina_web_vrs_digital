// Worker de la escena 3D: three.js se descarga, se evalúa y dibuja fuera del hilo
// principal (OffscreenCanvas). El hilo principal solo envía tamaño, puntero,
// desplazamiento y si debe animar. Ver Escena3DMotor.ts.
import { crearNucleo, type ConfigNucleo, type Nucleo } from './Escena3DNucleo';

export type MensajeAlTrabajador =
  | { tipo: 'iniciar'; lienzo: OffscreenCanvas; config: ConfigNucleo }
  | { tipo: 'tamano'; ancho: number; alto: number }
  | { tipo: 'puntero'; x: number; y: number }
  | { tipo: 'desplazamiento'; s: number }
  | { tipo: 'activo'; valor: boolean }
  | { tipo: 'destruir' };

export type MensajeDelTrabajador =
  | { tipo: 'lista'; tramos: Record<string, number>; llamadasDibujo: number }
  | { tipo: 'error'; mensaje: string; sinSoporte: boolean }
  | { tipo: 'perdido' };

const ambito = self as unknown as {
  onmessage: ((e: MessageEvent<MensajeAlTrabajador>) => void) | null;
  postMessage: (m: MensajeDelTrabajador) => void;
  close: () => void;
};

// Si el trabajador no tiene requestAnimationFrame (navegadores antiguos), ~60 cuadros por segundo con setTimeout.
const global = self as unknown as {
  requestAnimationFrame?: (cb: (t: number) => void) => number;
  cancelAnimationFrame?: (id: number) => void;
};
if (typeof global.requestAnimationFrame !== 'function') {
  global.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16) as unknown as number;
  global.cancelAnimationFrame = (id) => clearTimeout(id);
}

let nucleo: Nucleo | undefined;
let destruido = false;
// Lo que llegue mientras se crea la escena se aplica al final (solo importa el último valor).
const pendiente: { tamano?: [number, number]; puntero?: [number, number]; s?: number; activo?: boolean } = {};

function aplicar(m: MensajeAlTrabajador) {
  if (!nucleo) {
    if (m.tipo === 'tamano') pendiente.tamano = [m.ancho, m.alto];
    else if (m.tipo === 'puntero') pendiente.puntero = [m.x, m.y];
    else if (m.tipo === 'desplazamiento') pendiente.s = m.s;
    else if (m.tipo === 'activo') pendiente.activo = m.valor;
    return;
  }
  if (m.tipo === 'tamano') nucleo.redimensionar(m.ancho, m.alto);
  else if (m.tipo === 'puntero') nucleo.puntero(m.x, m.y);
  else if (m.tipo === 'desplazamiento') nucleo.desplazamiento(m.s);
  else if (m.tipo === 'activo') nucleo.activar(m.valor);
}

ambito.onmessage = async ({ data: m }) => {
  if (m.tipo === 'destruir') {
    destruido = true;
    nucleo?.destruir();
    nucleo = undefined;
    ambito.close();
    return;
  }
  if (m.tipo !== 'iniciar') return aplicar(m);
  // Safari 16 tiene OffscreenCanvas pero sin WebGL en trabajadores: el hilo principal lo reintenta.
  if (typeof (self as { WebGL2RenderingContext?: unknown }).WebGL2RenderingContext === 'undefined') {
    ambito.postMessage({ tipo: 'error', mensaje: 'WebGL 2 no disponible en el trabajador', sinSoporte: true });
    return;
  }
  try {
    const creado = await crearNucleo(m.lienzo, m.config, () => ambito.postMessage({ tipo: 'perdido' }));
    if (destruido) return creado.destruir();
    nucleo = creado;
    if (pendiente.tamano) nucleo.redimensionar(...pendiente.tamano);
    if (pendiente.puntero) nucleo.puntero(...pendiente.puntero);
    if (pendiente.s !== undefined) nucleo.desplazamiento(pendiente.s);
    if (pendiente.activo !== undefined) nucleo.activar(pendiente.activo);
    ambito.postMessage({ tipo: 'lista', tramos: nucleo.tramos, llamadasDibujo: nucleo.llamadasDibujo });
  } catch (error) {
    ambito.postMessage({ tipo: 'error', mensaje: String(error), sinSoporte: false });
  }
};
