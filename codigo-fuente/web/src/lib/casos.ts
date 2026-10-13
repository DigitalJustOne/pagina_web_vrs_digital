// ─────────────────────────────────────────────────────────────────────────────
//  Presentación de los casos de CASOS (src/data/sitio.ts): medidas reales de cada
//  captura, texto alternativo, encuadre y rótulo según el tipo (cliente o producto).
//  Lo usan GaleriaCasos (ui) y CasosDetalle (pagina). Si agrega un caso nuevo,
//  agregue aquí sus medidas y su texto alternativo.
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import { CASOS, type Caso } from '@/data/sitio';

/** Medidas reales de cada imagen (px), medidas el 2026-10-06 (Beauty Manager, el 2026-10-11). */
const MEDIDAS: Record<string, { ancho: number; alto: number }> = {
  '/img/beautymanager-agenda.png': { ancho: 1280, alto: 800 },
  '/img/dec-preview.png': { ancho: 800, alto: 500 },
  '/img/delis-broaster.png': { ancho: 1024, alto: 580 },
  '/img/vitalcarga.png': { ancho: 1024, alto: 532 },
  '/img/longevity-therapy.png': { ancho: 1024, alto: 494 },
  '/img/beauty-pro.png': { ancho: 1024, alto: 789 },
  '/img/hero-image.png': { ancho: 1024, alto: 1024 },
};

/** Texto alternativo, encuadre y rótulo de cada caso. */
const PRESENTACION: Record<string, { alt: string; ajuste?: 'cover' | 'contain'; posicion?: string; rotulo?: string }> = {
  'Beauty Manager': {
    // Ilustración propia con datos de ejemplo (sin cifras de resultados): reemplazar por una captura real cuando exista.
    alt: 'Ilustración del panel de Beauty Manager con la agenda de citas y el registro de clientes, con datos de ejemplo',
    rotulo: 'Producto propio',
  },
  'Equipos y Componentes DEC': { alt: 'Logo de Equipos y Componentes DEC', ajuste: 'contain' },
  'Delis Broaster': { alt: 'Página de inicio de Delis Broaster con su logo y el botón para pedir domicilio', posicion: 'left center' },
  Vitalcarga: { alt: 'Página de inicio de Vitalcarga con los botones para rastrear guías y cotizar envíos' },
  'Longevity Therapy': { alt: 'Página de inicio de Longevity Therapy con la invitación a una sesión gratuita', posicion: 'center top' },
  // Sin confirmar si fue para un cliente (sitio.ts): se rotula como plataforma, sin llamarla cliente ni producto propio.
  'Belleza Profesional': {
    alt: 'Resumen de agenda de Belleza Profesional con citas del día y pendientes por confirmar',
    posicion: 'center top',
    rotulo: 'Plataforma',
  },
};

const ROTULO_TIPO: Record<Caso['tipo'], string> = { cliente: 'Cliente', producto: 'Producto propio' };

/** Medidas, versión .webp (si existe en public/) y medidas de cualquier imagen de public/. */
export function imagenPublica(ruta: string) {
  const medidas = MEDIDAS[ruta] ?? { ancho: 1024, alto: 576 };
  const webp = ruta.replace(/\.(png|jpe?g)$/i, '.webp');
  const hayWebp = webp !== ruta && fs.existsSync(path.join(process.cwd(), 'public', webp));
  return { ...medidas, webp: hayWebp ? webp : undefined };
}

/**
 * Miniatura .webp de 480 px de ancho (public/img/miniaturas/<nombre>-480.webp) para vistas
 * pequeñas como el muro de /proyectos/: pesa un tercio de la captura completa y no compite
 * con el LCP. Si no existe, undefined (se usa la captura completa).
 */
export function miniaturaCaso(imagen: string): string | undefined {
  const nombre = imagen.replace(/^\/img\//, '').replace(/\.(png|jpe?g|webp)$/i, '');
  const ruta = `/img/miniaturas/${nombre}-480.webp`;
  return fs.existsSync(path.join(process.cwd(), 'public', ruta)) ? ruta : undefined;
}

/** Todo lo necesario para pintar la captura de un caso. */
export function imagenCaso(caso: Pick<Caso, 'cliente' | 'imagen'>) {
  const p = PRESENTACION[caso.cliente] ?? { alt: `Vista del proyecto de ${caso.cliente}` };
  return { ...imagenPublica(caso.imagen), alt: p.alt, ajuste: p.ajuste ?? 'cover', posicion: p.posicion ?? 'center' };
}

/** Rótulo visible del caso: «Cliente», «Producto propio» o «Plataforma». */
export function rotuloCaso(cliente: string): string {
  const caso = CASOS.find((c) => c.cliente === cliente);
  return PRESENTACION[cliente]?.rotulo ?? (caso ? ROTULO_TIPO[caso.tipo] : 'Proyecto');
}

/**
 * Parte del id de cada caso en /proyectos/ (#proyecto-<slug>):
 * «Equipos y Componentes DEC» → «equipos-y-componentes-dec».
 * La usan CasosDetalle (pone el id) y MosaicoProyectos (enlaza a él): cambie solo aquí.
 */
export const slugCaso = (cliente: string) =>
  cliente
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** ¿Es un trabajo para un cliente? (los productos no muestran «resultados»). */
export const esCliente = (cliente: string) => CASOS.find((c) => c.cliente === cliente)?.tipo === 'cliente';

/** Casos por nombre, en el orden dado. Sin lista, todos. */
export function casosPorNombre(nombres?: readonly string[]): Caso[] {
  if (!nombres?.length) return CASOS;
  return nombres.map((n) => CASOS.find((c) => c.cliente === n)).filter((c): c is Caso => Boolean(c));
}
