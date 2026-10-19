// ─────────────────────────────────────────────────────────────────────────────
//  Datos para robots.txt, llms.txt y llms-full.txt (formato llmstxt.org).
//
//  Las listas se arman solas al compilar:
//  - Páginas: cada módulo de src/data/contenido/*.ts (ruta, seo, respuestaDirecta,
//    preguntas) más cada archivo estático de src/pages/.
//  - Guías: cada archivo src/content/recursos/*.md (frontmatter + texto).
//  Si todavía no existe ningún módulo o guía, todo sigue funcionando con los datos
//  de src/data/sitio.ts. No hace falta tocar este archivo al agregar una página.
//  Quedan fuera las rutas privadas y los borradores (src/data/rutas.ts), igual que en
//  el sitemap. Donde un texto muestra un precio de VRS Digital se agrega NOTA_PRECIOS.
// ─────────────────────────────────────────────────────────────────────────────
import { RUTAS_BORRADOR, RUTAS_PRIVADAS, fueraDeIndices } from '@/data/rutas';
import { SITIO, SERVICIOS, SECTORES } from '@/data/sitio';
import { NOTA_PRECIOS, muestraPrecio } from '@/lib/paginas';
import { urlAbsoluta } from '@/lib/schema';
import { rellenarEnTodo, rellenarMarcadores } from '@/lib/marcadores';

/** Rutas internas que no deben rastrearse ni listarse (robots.txt, llms.txt). Se definen en src/data/rutas.ts. */
export { RUTAS_PRIVADAS };

export interface PreguntaLlms {
  pregunta: string;
  respuesta: string;
}

export type GrupoLlms = 'empresa' | 'servicios' | 'sectores' | 'precios' | 'recursos' | 'guias' | 'otras';

export interface PaginaLlms {
  ruta: string;
  url: string;
  titulo: string;
  descripcion: string;
  respuestaDirecta?: string;
  preguntas: PreguntaLlms[];
  grupo: GrupoLlms;
  orden: number;
  actualizado?: string;
  /** Solo guías: texto completo en Markdown, con enlaces internos absolutos. */
  cuerpo?: string;
}

// ── Utilidades ───────────────────────────────────────────────────────────────
const texto = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v.trim() : undefined);

/** Fecha AAAA-MM-DD desde un texto o un Date (YAML convierte las fechas en Date). */
const fechaDe = (v: unknown): string | undefined =>
  v instanceof Date && !Number.isNaN(v.getTime()) ? v.toISOString().slice(0, 10) : texto(v)?.slice(0, 10);

/** Normaliza una ruta a la forma del sitio: con barra inicial y final. */
export function normalizarRuta(ruta: string): string {
  let r = ruta.trim();
  if (!r.startsWith('/')) r = '/' + r;
  if (!r.endsWith('/') && !/\.[a-z0-9]+$/i.test(r)) r += '/';
  return r.replace(/\/{2,}/g, '/');
}

/** Quita la marca al final del título (" | VRS Digital") para las listas. */
const sinMarca = (t: string) => t.replace(new RegExp(`\\s*[|·–-]\\s*${SITIO.nombre}\\s*$`), '').trim();

/** Convierte enlaces Markdown internos "](/ruta/)" en absolutos. */
export const enlacesAbsolutos = (md: string) => md.replace(/\]\(\/(?!\/)/g, `](${SITIO.url.replace(/\/$/, '')}/`);

const textoAbs = (v: unknown) => {
  const t = texto(v);
  return t ? enlacesAbsolutos(t) : undefined;
};

/** Igual que en la web: si el texto muestra un precio de VRS Digital, lleva «IVA incluido». */
const conNotaPrecios = (t: string | undefined) => (t && muestraPrecio(t) && !/IVA incluido/i.test(t) ? `${t} ${NOTA_PRECIOS}` : t);

function preguntasDe(v: unknown): PreguntaLlms[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((p) => ({ pregunta: texto(p?.pregunta), respuesta: conNotaPrecios(textoAbs(p?.respuesta)) }))
    .filter((p): p is PreguntaLlms => Boolean(p.pregunta && p.respuesta));
}

// ── Clasificación y orden por ruta ───────────────────────────────────────────
const RUTAS_SERVICIO = SERVICIOS.map((s) => `/${s.slug}/`);
const RUTAS_SECTOR = SECTORES.map((s) => `/${s.slug}/`);
const RUTAS_EMPRESA = ['/', '/nosotros/', '/proyectos/', '/contacto/'];

function clasificar(ruta: string): { grupo: GrupoLlms; orden: number } {
  const en = (lista: string[], grupo: GrupoLlms) => (lista.includes(ruta) ? { grupo, orden: lista.indexOf(ruta) } : null);
  return (
    en(RUTAS_EMPRESA, 'empresa') ??
    en(RUTAS_SERVICIO, 'servicios') ??
    en(RUTAS_SECTOR, 'sectores') ??
    (ruta === '/precios/' ? { grupo: 'precios', orden: 0 } : null) ??
    (ruta === '/recursos/' ? { grupo: 'recursos', orden: 0 } : null) ??
    (ruta.startsWith('/recursos/') ? { grupo: 'guias', orden: 100 } : null) ?? { grupo: 'otras', orden: 100 }
  );
}

/** Títulos y descripciones de respaldo mientras una página no tenga módulo de contenido. */
const RESPALDO: Record<string, { titulo: string; descripcion: string }> = {
  '/': { titulo: `${SITIO.nombre}: ${SITIO.categoria}`, descripcion: SITIO.propuesta },
  '/precios/': {
    titulo: 'Planes y precios',
    descripcion: 'Planes con precio publicado: precio anual, cuotas, qué incluye y qué no incluye cada uno.',
  },
  '/proyectos/': { titulo: 'Proyectos', descripcion: 'Proyectos de VRS Digital con enlace público.' },
  '/recursos/': { titulo: 'Recursos y guías', descripcion: 'Guías prácticas sobre páginas web, visibilidad en Google y asistentes de IA, y atención por WhatsApp.' },
  '/nosotros/': { titulo: 'Nosotros', descripcion: 'Quién está detrás de VRS Digital, cómo trabajamos y el aval como empresa aliada MinTIC.' },
  '/contacto/': { titulo: 'Contacto', descripcion: 'Solicite una revisión digital de su empresa por formulario, WhatsApp o correo.' },
};
for (const s of SERVICIOS) {
  RESPALDO[`/${s.slug}/`] = { titulo: s.nombre, descripcion: s.resumen };
}
for (const s of SECTORES) {
  RESPALDO[`/${s.slug}/`] ??= { titulo: `Páginas web para ${s.nombre.charAt(0).toLowerCase()}${s.nombre.slice(1)}`, descripcion: `Páginas web, visibilidad y atención por WhatsApp pensadas para ${s.nombre.toLowerCase()}.` };
}

// ── Fuentes dinámicas ────────────────────────────────────────────────────────
// Los patrones son relativos a este archivo (src/lib/). Si la carpeta no existe, el resultado es {}.
const modulosContenido = import.meta.glob<Record<string, unknown>>('../data/contenido/*.ts', { eager: true });
const modulosGuias = import.meta.glob<Record<string, unknown>>('../content/recursos/*.md', { eager: true });
// Solo se usan los nombres de archivo (las funciones de importación nunca se llaman).
const archivosPaginas = Object.keys(import.meta.glob('../pages/**/*.{astro,md,mdx}'));

type Contenido = { ruta?: unknown; seo?: { titulo?: unknown; descripcion?: unknown }; respuestaDirecta?: unknown; preguntas?: unknown; actualizado?: unknown; borrador?: unknown };

/** Toma el objeto de contenido del módulo, se exporte como `contenido`, por defecto o con otro nombre. */
function contenidoDe(mod: Record<string, unknown>): Contenido | undefined {
  const candidatos = [mod.contenido, mod.default, ...Object.values(mod)];
  return candidatos.find((c): c is Contenido => typeof c === 'object' && c !== null && typeof (c as Contenido).ruta === 'string');
}

/** Ruta pública de un archivo de src/pages, o null si es dinámico, privado o interno. */
function rutaDeArchivo(archivo: string): string | null {
  const rel = archivo.replace(/^\.\.\/pages\//, '').replace(/\.(astro|md|mdx)$/, '');
  if (rel.split('/').some((parte) => parte.startsWith('_') || parte.includes('['))) return null;
  if (rel === '404' || rel === '500') return null;
  const sinIndice = rel === 'index' ? '' : rel.replace(/\/index$/, '');
  return normalizarRuta('/' + sinIndice);
}

/** Privadas y borradores: fuera de llms.txt, igual que del sitemap (src/data/rutas.ts). */
const excluida = (ruta: string) => fueraDeIndices(ruta);

let cache: PaginaLlms[] | undefined;

/** Todas las páginas públicas conocidas, ordenadas por grupo y por importancia. */
export function paginasLlms(): PaginaLlms[] {
  if (cache) return cache;
  const mapa = new Map<string, PaginaLlms>();

  const crear = (ruta: string): PaginaLlms => {
    const respaldo = RESPALDO[ruta];
    const { grupo, orden } = clasificar(ruta);
    return {
      ruta,
      url: urlAbsoluta(ruta),
      titulo: respaldo?.titulo ?? ruta.replace(/^\/|\/$/g, '').replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()),
      descripcion: respaldo?.descripcion ?? '',
      preguntas: [],
      grupo,
      orden,
    };
  };

  // 1) Páginas estáticas que ya existen en src/pages.
  for (const archivo of archivosPaginas) {
    const ruta = rutaDeArchivo(archivo);
    if (ruta && !excluida(ruta) && !mapa.has(ruta)) mapa.set(ruta, crear(ruta));
  }

  // 2) Módulos de contenido (pueden corresponder a rutas dinámicas).
  for (const mod of Object.values(modulosContenido)) {
    const c = contenidoDe(mod);
    if (!c) continue;
    const ruta = normalizarRuta(c.ruta as string);
    if (c.borrador === true) {
      // Un borrador sale de llms.txt y también del sitemap; para eso debe estar en src/data/rutas.ts.
      if (!RUTAS_BORRADOR.includes(ruta)) {
        throw new Error(`La página ${ruta} tiene «borrador: true»: agregue su módulo a MODULOS_CON_BORRADOR en src/data/rutas.ts para sacarla del sitemap.`);
      }
      mapa.delete(ruta);
      continue;
    }
    if (excluida(ruta)) {
      mapa.delete(ruta);
      continue;
    }
    const p = mapa.get(ruta) ?? crear(ruta);
    p.titulo = sinMarca(texto(c.seo?.titulo) ?? p.titulo);
    p.descripcion = conNotaPrecios(texto(c.seo?.descripcion)) ?? p.descripcion;
    p.respuestaDirecta = conNotaPrecios(textoAbs(c.respuestaDirecta));
    p.preguntas = preguntasDe(c.preguntas);
    p.actualizado = fechaDe(c.actualizado);
    mapa.set(ruta, p);
  }

  // 3) Guías en Markdown.
  for (const [archivo, mod] of Object.entries(modulosGuias)) {
    // Los marcadores de precios, pago y horario se rellenan desde sitio.ts (src/lib/marcadores.ts).
    const fm = rellenarEnTodo((mod.frontmatter ?? {}) as Record<string, unknown>);
    if (fm.borrador === true || fm.draft === true) continue;
    const seo = (fm.seo ?? {}) as Record<string, unknown>;
    const slug = texto(fm.slug) ?? archivo.split('/').pop()!.replace(/\.md$/, '');
    const ruta = normalizarRuta(texto(fm.ruta) ?? `/recursos/${slug}/`);
    if (excluida(ruta)) continue;
    const p = mapa.get(ruta) ?? crear(ruta);
    p.grupo = 'guias';
    p.titulo = sinMarca(texto(seo.titulo) ?? texto(fm.titulo) ?? texto(fm.title) ?? p.titulo);
    p.descripcion = conNotaPrecios(texto(seo.descripcion) ?? texto(fm.descripcion) ?? texto(fm.description)) ?? p.descripcion;
    // Las guías traen su respuesta directa en «resumen» (src/content.config.ts).
    p.respuestaDirecta = conNotaPrecios(textoAbs(fm.respuestaDirecta) ?? textoAbs(fm.resumen) ?? p.respuestaDirecta);
    p.preguntas = preguntasDe(fm.preguntas);
    p.actualizado = fechaDe(fm.actualizado) ?? fechaDe(fm.modificado) ?? fechaDe(fm.publicado) ?? fechaDe(fm.fecha);
    const crudo = typeof mod.rawContent === 'function' ? String((mod.rawContent as () => string)()) : '';
    p.cuerpo = crudo ? enlacesAbsolutos(rellenarMarcadores(crudo.trim())) : undefined;
    mapa.set(ruta, p);
  }

  const ordenGrupo: GrupoLlms[] = ['empresa', 'servicios', 'sectores', 'precios', 'recursos', 'guias', 'otras'];
  cache = [...mapa.values()].sort(
    (a, b) => ordenGrupo.indexOf(a.grupo) - ordenGrupo.indexOf(b.grupo) || a.orden - b.orden || a.titulo.localeCompare(b.titulo, 'es'),
  );
  return cache;
}

/** Fecha más reciente declarada en el contenido; si no hay, la fecha de compilación. */
export function fechaActualizacion(): string {
  const fechas = paginasLlms()
    .map((p) => p.actualizado)
    .filter((f): f is string => Boolean(f && /^\d{4}-\d{2}-\d{2}/.test(f)))
    .sort();
  return fechas.at(-1)?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
}

/** Respuesta de texto plano en UTF-8 para los endpoints. */
export function respuestaTexto(cuerpo: string): Response {
  return new Response(cuerpo.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
