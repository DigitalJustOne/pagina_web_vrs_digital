// ─────────────────────────────────────────────────────────────────────────────
//  Ayudas de la plantilla de páginas (src/components/pagina/).
//  - muestraPrecio(): ¿un texto o una sección muestra un precio de VRS Digital?
//    Donde haya un precio, la plantilla agrega NOTA_PRECIOS («IVA incluido»).
//  - grafoPagina(): JSON-LD de una página de contenido (pagina + migas + FAQ + servicio).
//  - fechaLarga(), esExterno(), tipoPaginaSchema().
// ─────────────────────────────────────────────────────────────────────────────
import { DOMINIO_HOSTING, LANDING, NOTA_PRECIOS, PLANES, PLAN_ENTRADA, cuotaMensual, formatoCOP, totalEnCuotas } from '@/data/sitio';
import { grafo, migas, pagina, preguntasFrecuentes, servicio } from '@/lib/schema';
import type { ModuloPagina, Pregunta } from '@/data/contenido/tipos';

// ── Precios ──────────────────────────────────────────────────────────────────
/** Todos los valores de VRS Digital que pueden aparecer en un texto (desde sitio.ts). */
const VALORES = new Set<number>([
  ...PLANES.flatMap((p) => [p.precioAnualDesde, p.precioAnualHasta, cuotaMensual(p.precioAnualDesde), totalEnCuotas(p.precioAnualDesde)]),
  PLAN_ENTRADA.mensualidad,
  LANDING.precio,
  LANDING.precioConDominio,
  DOMINIO_HOSTING.precioAnual,
]);

const escapar = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** «$1.200.000» y similares, sin confundirlos con US$14,99 ni con otras cifras ($52.374 de la UVT). */
const PATRON_PRECIO = new RegExp(
  `(?<![\\w$])(?:${[...VALORES].map((v) => escapar(formatoCOP(v))).join('|')})(?![\\d])(?!\\.\\d)`,
);

/** true si el texto (o cualquier texto dentro del objeto) muestra un precio de VRS Digital. */
export function muestraPrecio(valor: unknown): boolean {
  const texto = typeof valor === 'string' ? valor : JSON.stringify(valor ?? '');
  return PATRON_PRECIO.test(texto);
}

/** Muestra un precio y todavía no dice «IVA incluido»: solo entonces se agrega NOTA_PRECIOS.
 *  Regla de claridad (2026-10-19): el IVA se dice junto al precio, no repetido en cada bloque. */
export function necesitaNotaPrecios(valor: unknown): boolean {
  const texto = typeof valor === 'string' ? valor : JSON.stringify(valor ?? '');
  return muestraPrecio(texto) && !/IVA incluido/i.test(texto);
}

export { NOTA_PRECIOS };

// ── Fechas y enlaces ─────────────────────────────────────────────────────────
const FORMATO_FECHA = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** '2026-10-05' → '5 de octubre de 2026'. Si no es una fecha válida, devuelve el texto tal cual. */
export function fechaLarga(fecha: string): string {
  const d = new Date(`${fecha.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? fecha : FORMATO_FECHA.format(d);
}

/** Enlace a otro sitio (se abre en pestaña nueva con rel="noopener noreferrer"). */
export const esExterno = (href: string) => /^https?:\/\//i.test(href);

/** id del título H2 de una sección (aria-labelledby). */
export const idTitulo = (idSeccion: string) => `${idSeccion}-titulo`;

// ── JSON-LD ──────────────────────────────────────────────────────────────────
/** Tipo schema.org del nodo de la página según su ruta. */
export function tipoPaginaSchema(ruta: string): string {
  const tipos: Record<string, string> = {
    '/contacto/': 'ContactPage',
    '/nosotros/': 'AboutPage',
    '/proyectos/': 'CollectionPage',
    '/recursos/': 'CollectionPage',
  };
  return tipos[ruta] ?? 'WebPage';
}

/** Respuesta de una pregunta tal como se publica en el JSON-LD (con la nota de IVA si hay precio). */
export function respuestaConNota(p: Pregunta): string {
  return muestraPrecio(p.respuesta) ? `${p.respuesta} ${NOTA_PRECIOS}` : p.respuesta;
}

/**
 * Grafo JSON-LD de una página de contenido: organización, fundador y sitio (siempre, desde grafo()),
 * más la página, sus migas (si hay 2 o más), sus preguntas (FAQPage) y su servicio.
 * `extra` agrega nodos propios de la página (por ejemplo, ofertas en /precios/).
 */
export function grafoPagina(c: ModuloPagina, opciones: { tipo?: string; extra?: readonly object[] } = {}) {
  const nodos: object[] = [
    pagina({
      ruta: c.ruta,
      titulo: c.seo.titulo,
      descripcion: c.seo.descripcion,
      tipo: opciones.tipo ?? tipoPaginaSchema(c.ruta),
      fechaModificacion: c.actualizado,
    }),
  ];
  if (c.migas.length > 1) nodos.push(migas([...c.migas]));
  if (c.preguntas?.length) {
    nodos.push(preguntasFrecuentes(c.preguntas.map((p) => ({ pregunta: p.pregunta, respuesta: respuestaConNota(p) }))));
  }
  if (c.servicio) nodos.push(servicio({ ...c.servicio, ruta: c.ruta }));
  return grafo(...nodos, ...(opciones.extra ?? []));
}

// ── Títulos ──────────────────────────────────────────────────────────────────
/** Parte un título para pintar un fragmento exacto con el degradado (sin HTML crudo). */
export function partirResaltado(titulo: string, resaltado?: string): { texto: string; resaltar: boolean }[] {
  const i = resaltado ? titulo.indexOf(resaltado) : -1;
  if (!resaltado || i < 0) return [{ texto: titulo, resaltar: false }];
  return [
    { texto: titulo.slice(0, i), resaltar: false },
    { texto: resaltado, resaltar: true },
    { texto: titulo.slice(i + resaltado.length), resaltar: false },
  ].filter((p) => p.texto);
}
