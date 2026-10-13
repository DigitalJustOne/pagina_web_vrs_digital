// ─────────────────────────────────────────────────────────────────────────────
//  Guías de /recursos/ (colección «recursos», src/content.config.ts).
//
//  - guiasPublicadas(): guías sin `borrador`, la más reciente primero.
//  - prepararGuia(): toma el HTML que Astro ya generó del Markdown y, en la compilación
//    (sin JavaScript en el navegador):
//      · separa la firma inicial («Por **Víctor Ramírez**, …») para mostrarla en la portada;
//      · da a cada título un id sin tildes (#precios-publicados-en-bogota-…), estable y legible;
//      · vuelve cada tabla accesible y adaptable: roles ARIA explícitos, primera celda como
//        encabezado de fila y el nombre de la columna en cada dato (en celular cada fila es una
//        tarjeta), dentro de una región desplazable con nombre;
//      · abre los enlaces externos en otra pestaña y lo anuncia a lectores de pantalla;
//      · agrega NOTA_PRECIOS («IVA incluido») bajo cada bloque que muestra un precio de
//        VRS Digital, solo en las secciones sobre VRS Digital (los precios de otros proveedores
//        no llevan la nota: no sabemos si incluyen IVA).
//  - Control de coherencia: si una sección sobre VRS Digital muestra un valor en pesos que no
//    coincide con PLANES o PLAN_ENTRADA de sitio.ts, la compilación falla con el dato exacto.
//    Así una guía nunca publica un precio desactualizado.
// ─────────────────────────────────────────────────────────────────────────────
import { getCollection, type CollectionEntry } from 'astro:content';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ResumenGuia } from '@/data/contenido/tipos';
import { FUNDADOR, NOTA_PRECIOS, SITIO } from '@/data/sitio';
import { muestraPrecio } from '@/lib/paginas';
import { rellenarMarcadores } from '@/lib/marcadores';

export type Guia = CollectionEntry<'recursos'>;

/** Palabras por minuto para el tiempo de lectura (lectura en pantalla, en español). */
const PALABRAS_POR_MINUTO = 200;

/** Guías publicadas, de la más reciente a la más antigua. */
export async function guiasPublicadas(): Promise<Guia[]> {
  const guias = await getCollection('recursos', (g: Guia) => g.data.borrador !== true);
  return guias.sort(
    (a: Guia, b: Guia) => b.data.actualizado.getTime() - a.data.actualizado.getTime() || a.id.localeCompare(b.id),
  );
}

export const rutaGuia = (id: string) => `/recursos/${id}/`;

/** Fecha en formato AAAA-MM-DD (para <time datetime> y JSON-LD). */
export const isoFecha = (d: Date) => d.toISOString().slice(0, 10);

/** id legible y sin tildes: «¿Está disponible en Colombia?» → «esta-disponible-en-colombia». */
export function idSinTildes(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const sinEtiquetas = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x26;|&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/** Valores en pesos escritos en un texto ($1.200.000, $49.900). Ignora US$14,99. */
const MONTOS_COP = /(?<![A-Za-z])\$\s?\d{1,3}(?:\.\d{3})+(?!\d)(?![.,]\d)/g;

export interface TituloGuia {
  id: string;
  texto: string;
  nivel: number;
}

export interface GuiaPreparada {
  /** HTML del cuerpo, listo para set:html. */
  html: string;
  /** Firma inicial en HTML (sin <p>), si la guía empieza con «Por …». */
  firma?: string;
  /** Títulos H2 y H3 con su id final. */
  titulos: TituloGuia[];
  palabras: number;
  minutos: number;
}

/** Tabla de Markdown → tabla accesible y adaptable (ver encabezado del archivo). */
function tablaAdaptable(tabla: string, idTituloSeccion: string | undefined, conNotaPrecios: boolean): string {
  const encabezados = [...(tabla.match(/<thead>[\s\S]*?<\/thead>/)?.[0] ?? '').matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(
    (m) => sinEtiquetas(m[1]),
  );
  const cuerpo = tabla.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? '';
  const filas = [...cuerpo.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((fila) => {
    const celdas = [...fila[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c, i) => {
      if (i === 0) return `<th role="rowheader" scope="row">${c[1]}</th>`;
      const etiqueta = encabezados[i] ?? '';
      return `<td role="cell"><span class="col-movil" aria-hidden="true">${etiqueta}</span>${c[1]}</td>`;
    });
    return `<tr role="row">${celdas.join('')}</tr>`;
  });
  const cabecera = `<thead role="rowgroup"><tr role="row">${encabezados
    .map((e) => `<th role="columnheader" scope="col">${e}</th>`)
    .join('')}</tr></thead>`;
  const leyenda = conNotaPrecios ? `<caption class="leyenda-precios">${NOTA_PRECIOS}</caption>` : '';
  const nombre = idTituloSeccion ? ` aria-labelledby="${idTituloSeccion}"` : '';
  return (
    `<div class="tabla-guia" role="region"${nombre} tabindex="0">` +
    `<table role="table"${nombre}>${leyenda}${cabecera}<tbody role="rowgroup">${filas.join('')}</tbody></table></div>`
  );
}

/** Revisa que cada valor en pesos de una sección sobre VRS Digital exista en sitio.ts. */
function verificarPrecios(seccion: string, titulo: string, slug: string) {
  for (const [monto] of sinEtiquetas(seccion).matchAll(MONTOS_COP)) {
    if (!muestraPrecio(monto.replace(/\s/g, ''))) {
      throw new Error(
        `[recursos/${slug}] La sección «${titulo}» muestra ${monto}, que no coincide con ningún precio de ` +
          `src/data/sitio.ts (PLANES, PLAN_ENTRADA ni sus totales de 12 meses). Actualice la guía para que use ` +
          `los precios vigentes antes de publicar.`,
      );
    }
  }
}

/** Prepara el HTML de una guía (en la compilación). */
export function prepararGuia(guia: Guia): GuiaPreparada {
  const slug = guia.id;
  // Precios, forma de pago y horario de VRS Digital: marcadores rellenados desde sitio.ts.
  let html = rellenarMarcadores(guia.rendered?.html ?? '');
  if (!html) throw new Error(`[recursos/${slug}] La guía no tiene contenido.`);

  // 1) Firma inicial: «Por <strong>Víctor Ramírez</strong>, fundador… Precios consultados el…».
  let firma: string | undefined;
  html = html.replace(/^\s*<p>(Por <strong>[\s\S]*?)<\/p>\s*/, (_, contenido: string) => {
    firma = contenido;
    return '';
  });

  // 2) ids sin tildes en H2 y H3 (los demás niveles no se usan en las guías).
  const titulos: TituloGuia[] = [];
  const usados = new Set<string>();
  html = html.replace(/<h([23]) id="([^"]*)">([\s\S]*?)<\/h\1>/g, (_, nivel: string, _id: string, interior: string) => {
    const texto = sinEtiquetas(interior);
    let id = idSinTildes(texto) || `seccion-${titulos.length + 1}`;
    for (let n = 2; usados.has(id); n++) id = `${idSinTildes(texto)}-${n}`;
    usados.add(id);
    titulos.push({ id, texto, nivel: Number(nivel) });
    return `<h${nivel} id="${id}">${interior}</h${nivel}>`;
  });

  // 3) Por secciones (cada H2 con lo que sigue): tablas, notas de precios y control de coherencia.
  const secciones = html.split(/(?=<h2[\s>])/).map((seccion) => {
    const h2 = seccion.match(/^<h2 id="([^"]*)">([\s\S]*?)<\/h2>/);
    const idTitulo = h2?.[1];
    const titulo = h2 ? sinEtiquetas(h2[2]) : '';
    const sobreVrs = titulo.includes(SITIO.nombre);
    if (sobreVrs) verificarPrecios(seccion, titulo, slug);

    // Tablas primero (sus celdas no deben recibir notas sueltas).
    const tablas: string[] = [];
    let s = seccion.replace(/<table>[\s\S]*?<\/table>/g, (tabla) => {
      tablas.push(tablaAdaptable(tabla, idTitulo, sobreVrs && muestraPrecio(tabla)));
      return `\u0000TABLA${tablas.length - 1}\u0000`;
    });
    if (sobreVrs) {
      s = s.replace(/<(p|ul|ol)>[\s\S]*?<\/\1>/g, (bloque) =>
        muestraPrecio(bloque) ? `${bloque}\n<p class="nota-precios">${NOTA_PRECIOS}</p>` : bloque,
      );
    }
    return s.replace(/\u0000TABLA(\d+)\u0000/g, (_, i: string) => tablas[Number(i)]);
  });
  html = secciones.join('');

  // 4) Enlaces externos: pestaña nueva, anunciada (el href ya viene escapado por Astro).
  html = html.replace(
    /<a href="(https?:\/\/[^"]+)">([\s\S]*?)<\/a>/g,
    (_, href: string, texto: string) =>
      `<a href="${href}" target="_blank" rel="noopener noreferrer" class="enlace-externo">${texto}<span class="sr-only"> (se abre en una pestaña nueva)</span></a>`,
  );

  const palabras = sinEtiquetas(html).split(' ').filter(Boolean).length;
  return { html, firma, titulos, palabras, minutos: Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO)) };
}

/** Solo publicamos guías firmadas por el fundador (no hay otros autores en VRS Digital). */
export function verificarAutor(guia: Guia) {
  const autor = guia.data.autor;
  if (autor !== FUNDADOR.nombreCorto && autor !== FUNDADOR.nombre) {
    throw new Error(
      `[recursos/${guia.id}] El autor «${autor}» no es ${FUNDADOR.nombreCorto}. La página muestra su retrato y su ` +
        'perfil como autor: revise el campo «autor» del frontmatter.',
    );
  }
}

// ── Fichas para listados (/recursos/) ───────────────────────────────────────
export interface FichaGuia {
  slug: string;
  href: string;
  etiqueta: string;
  titulo: string;
  resumen: string;
  icono?: NombreIconoTarjeta;
  /** AAAA-MM-DD */
  publicado: string;
  actualizado: string;
  minutos: number;
  fuentes: number;
  preguntas: number;
  /** Títulos H2 de la guía, en orden (vista previa del contenido). */
  temas: string[];
}

/**
 * Une el resumen de cada guía del módulo de /recursos/ (etiqueta, título, resumen e icono) con los
 * datos de la colección (fechas, tiempo de lectura, fuentes, preguntas y temas). La colección manda
 * en las fechas. Una guía publicada que aún no esté en el módulo aparece igual, con su H1 y su
 * descripción; una del módulo que no exista en la colección no se muestra.
 */
export async function fichasGuias(items: readonly ResumenGuia[], etiquetaPorDefecto: string): Promise<FichaGuia[]> {
  const guias = await guiasPublicadas();
  const ficha = (g: Guia, item?: ResumenGuia): FichaGuia => {
    const p = prepararGuia(g);
    return {
      slug: g.id,
      href: rutaGuia(g.id),
      etiqueta: item?.etiqueta ?? etiquetaPorDefecto,
      titulo: item?.titulo ?? g.data.h1,
      resumen: item?.resumen ?? g.data.descripcion,
      icono: item?.icono,
      publicado: isoFecha(g.data.publicado),
      actualizado: isoFecha(g.data.actualizado),
      minutos: p.minutos,
      fuentes: g.data.fuentes.length,
      preguntas: g.data.preguntas.length,
      temas: p.titulos.filter((t) => t.nivel === 2).map((t) => t.texto),
    };
  };
  const delModulo = items
    .map((item) => {
      const g = guias.find((x) => x.id === item.slug);
      return g ? ficha(g, item) : undefined;
    })
    .filter((f): f is FichaGuia => f !== undefined);
  const nuevas = guias.filter((g) => !items.some((it) => it.slug === g.id)).map((g) => ficha(g));
  return [...delModulo, ...nuevas];
}
