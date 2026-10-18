// ─────────────────────────────────────────────────────────────────────────────
//  Rutas que no se publican en el sitemap ni en llms.txt, y fecha de cada página. Un solo lugar para:
//  - astro.config.mjs (filtro del sitemap; no puede usar import.meta.glob),
//  - src/lib/llms.ts (llms.txt y llms-full.txt),
//  - src/pages/robots.txt.ts (Disallow, solo las privadas).
//
//  Privadas: páginas internas que no deben rastrearse (Disallow en robots.txt).
//  Borradores: páginas visibles con noindex (`borrador: true` en su módulo). NO van en
//  robots.txt: si se bloquean, Google no puede leer su noindex. Solo salen del sitemap y
//  de llms.txt. Al publicarlas basta con quitar `borrador: true` de su módulo.
//  Si otro módulo pasa a borrador, agréguelo a MODULOS_CON_BORRADOR: la compilación
//  falla y lo indica (comprobación en src/lib/llms.ts).
// ─────────────────────────────────────────────────────────────────────────────
import { contenido as asistenteWhatsApp } from './contenido/asistente-whatsapp-business';
import { contenido as contacto } from './contenido/contacto';
import { contenido as inicio } from './contenido/inicio';
import { contenido as nosotros } from './contenido/nosotros';
import { contenido as paginasWebBogota } from './contenido/paginas-web-bogota';
import { contenido as paginasWebEmpresasServicios } from './contenido/paginas-web-empresas-servicios';
import { contenido as politicaDePrivacidad } from './contenido/politica-de-privacidad';
import { contenido as posicionamiento } from './contenido/posicionamiento-google-inteligencia-artificial';
import { contenido as precios } from './contenido/precios';
import { contenido as proyectos } from './contenido/proyectos';
import { contenido as recursos } from './contenido/recursos';
import { contenido as terminos } from './contenido/terminos';

/** Páginas internas: Disallow en robots.txt y fuera del sitemap y de llms.txt. Reservada para una futura página de agradecimiento del formulario. */
export const RUTAS_PRIVADAS: readonly string[] = ['/gracias/'];

/** Módulos de contenido que pueden estar en borrador. */
const MODULOS_CON_BORRADOR = [politicaDePrivacidad, terminos];

/** Rutas cuyos módulos tienen hoy `borrador: true` (noindex): fuera del sitemap y de llms.txt. */
export const RUTAS_BORRADOR: readonly string[] = MODULOS_CON_BORRADOR.filter((c) => c.borrador === true).map((c) => c.ruta);

/** true si la ruta (/precios/, /recursos/guia/…) no debe ir en el sitemap ni en llms.txt. */
export const fueraDeIndices = (ruta: string) =>
  RUTAS_PRIVADAS.some((r) => ruta.startsWith(r)) || RUTAS_BORRADOR.includes(ruta);

/** Fecha de la última actualización de cada página (campo `actualizado` de su módulo): <lastmod> del
 *  sitemap (astro.config.mjs). Las guías la toman de la portada de su archivo .md. */
export const ACTUALIZADO: Readonly<Record<string, string>> = Object.fromEntries(
  [
    inicio,
    paginasWebBogota,
    posicionamiento,
    asistenteWhatsApp,
    paginasWebEmpresasServicios,
    precios,
    proyectos,
    recursos,
    nosotros,
    contacto,
    politicaDePrivacidad,
    terminos,
  ].flatMap((c) => (c.actualizado ? [[c.ruta, c.actualizado]] : [])),
);
