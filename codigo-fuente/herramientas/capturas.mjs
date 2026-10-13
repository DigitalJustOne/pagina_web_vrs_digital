#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  Recorre TODAS las rutas del sitemap generado (dist/sitemap-*.xml) en
//  computador (1440 x 900) y celular (390 x 844), toma capturas (primera
//  pantalla y página completa) y revisa la calidad de cada página.
//
//  Uso:
//    cd web && npx astro build
//    node capturas.mjs <carpeta_salida> [opciones]
//
//  Opciones:
//    --base http://127.0.0.1:4321   Servidor a usar. Si no responde, arranca `astro preview`.
//    --rutas /,/precios/            Solo estas rutas (por defecto: sitemap + /404.html).
//    --sin-capturas                 Solo revisiones, sin guardar imágenes (más rápido).
//    --movimiento-reducido          Emula prefers-reduced-motion: reduce.
//    --solo celular|computador      Una sola vista.
//    --dpr 2                        Densidad de píxeles de las capturas (por defecto 1).
//    --sin-fijar                    No reubica encabezado y barras fijas en la captura completa.
//    --dist dist-otra               Carpeta compilada a revisar (por defecto web/dist; también VRS_DIST).
//                                   Sírvala usted y pase --base: astro preview solo sirve web/dist.
//
//  Revisa: errores de consola y de JavaScript, recursos locales con error,
//  peticiones externas (se bloquean: todo se sirve local), desbordamiento
//  horizontal, un solo H1, imágenes sin alt o sin width/height, enlaces
//  internos y anclas rotas, JSON-LD que no se puede leer, metadatos básicos,
//  saltos en la jerarquía de títulos, ids repetidos, objetivos táctiles < 44 px
//  en celular, y los enlaces de llms.txt / robots.txt / manifest.
//
//  Escribe <carpeta_salida>/informe.json y termina con código 1 si hay errores.
// ─────────────────────────────────────────────────────────────────────────────
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { DIST, asegurarServidor, rutasDelSitemap, estadoRuta, nombreRuta, argumentos } from './servidor.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');

const args = argumentos();
const carpeta = path.resolve(args._[0] ?? path.join(process.cwd(), 'capturas-' + new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')));
fs.mkdirSync(carpeta, { recursive: true });
const conCapturas = !args['sin-capturas'];
const dpr = Number(args.dpr ?? 1);

const VISTAS = [
  { nombre: 'computador', viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false },
  { nombre: 'celular', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
].filter((v) => !args.solo || v.nombre === args.solo);

const sitemap = rutasDelSitemap();
const rutas = args.rutas ? String(args.rutas).split(',').map((r) => r.trim()) : [...sitemap, '/404.html'];
if (!rutas.length) {
  console.error('No hay rutas: ¿existe dist/sitemap-0.xml? Ejecute npx astro build.');
  process.exit(1);
}

const servidor = await asegurarServidor(args.base ?? 'http://127.0.0.1:4321');
const BASE = servidor.base;
const origenLocal = new URL(BASE).origin;
const esLocal = (u) => {
  try {
    const url = new URL(u);
    return url.origin === origenLocal || ['data:', 'blob:', 'about:'].includes(url.protocol);
  } catch {
    return false;
  }
};

const informe = {
  fecha: new Date().toISOString(),
  base: BASE,
  rutas: rutas.length,
  vistas: VISTAS.map((v) => v.nombre),
  paginas: {},
  errores: [],
  avisos: [],
};
const error = (ruta, vista, texto) => informe.errores.push({ ruta, vista, texto });
const aviso = (ruta, vista, texto) => informe.avisos.push({ ruta, vista, texto });

const idsPorRuta = new Map();
const enlacesPorRuta = new Map();

/** Revisiones dentro de la página (se ejecuta en el navegador). */
function revisarEnPagina({ esCelular, ancho }) {
  // En emulación de celular, innerWidth crece si la página se desborda: se compara con el ancho configurado.
  const vw = Math.min(window.innerWidth, ancho);
  const describir = (el) => {
    const id = el.id ? '#' + el.id : '';
    const clases = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
    const texto = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return `${el.tagName.toLowerCase()}${id}${clases}${texto ? ` «${texto}»` : ''}`;
  };
  const oculto = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (n.getAttribute('aria-hidden') === 'true') return true;
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden') return true;
    }
    return false;
  };
  const recortadoPorAncestro = (el) => {
    for (let n = el.parentElement; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
      const ox = getComputedStyle(n).overflowX;
      if (ox !== 'visible') return true;
    }
    return false;
  };

  // Desbordamiento horizontal
  const desborde = document.documentElement.scrollWidth - vw;
  const fuera = [];
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if ((r.right > vw + 1 || r.left < -1) && getComputedStyle(el).position !== 'fixed' && !oculto(el) && !recortadoPorAncestro(el)) {
      fuera.push(`${describir(el)} (${Math.round(r.left)}→${Math.round(r.right)} px)`);
      if (fuera.length >= 6) break;
    }
  }

  // Títulos
  const h1 = [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().replace(/\s+/g, ' '));
  const niveles = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => !oculto(h)).map((h) => Number(h.tagName[1]));
  const saltos = [];
  for (let i = 1; i < niveles.length; i++) if (niveles[i] - niveles[i - 1] > 1) saltos.push(`h${niveles[i - 1]} → h${niveles[i]}`);

  // Imágenes
  const imgs = [...document.querySelectorAll('img')];
  const sinAlt = imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.currentSrc || i.src);
  const sinMedidas = imgs.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).map((i) => i.currentSrc || i.src);
  const rotas = imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.currentSrc || i.src);

  // Enlaces e ids
  const enlaces = [...document.querySelectorAll('a[href]')].map((a) => a.href);
  const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
  const idsRepetidos = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  const sinNombre = [...document.querySelectorAll('a[href], button')]
    .filter((e) => !oculto(e) && !(e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.textContent.trim() || e.querySelector('img[alt]:not([alt=""])') || e.title))
    .map(describir)
    .slice(0, 6);

  // JSON-LD
  const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s, i) => {
    try {
      const datos = JSON.parse(s.textContent);
      const tipos = [];
      const recorrer = (o) => {
        if (Array.isArray(o)) return o.forEach(recorrer);
        if (o && typeof o === 'object') {
          if (o['@type']) tipos.push([].concat(o['@type']).join('+'));
          Object.values(o).forEach(recorrer);
        }
      };
      recorrer(datos);
      return { i, ok: true, contexto: Boolean(datos['@context']), tipos: [...new Set(tipos)] };
    } catch (e) {
      return { i, ok: false, error: String(e.message) };
    }
  });

  // Metadatos
  const meta = (sel, attr = 'content') => document.querySelector(sel)?.getAttribute(attr) ?? null;
  const metadatos = {
    lang: document.documentElement.lang || null,
    titulo: document.title,
    descripcion: meta('meta[name="description"]'),
    canonica: meta('link[rel="canonical"]', 'href'),
    robots: meta('meta[name="robots"]'),
    ogImagen: meta('meta[property="og:image"]'),
  };

  // Objetivos táctiles (solo celular). Los enlaces dentro de un texto quedan exentos (WCAG 2.5.8).
  const pequenos = [];
  if (esCelular) {
    for (const el of document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"])')) {
      if (oculto(el) || el.closest('.sr-only')) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'inline' && el.closest('p, li, dd, td, figcaption, blockquote')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.width < 44 || r.height < 44) pequenos.push(`${describir(el)} ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
  }

  return { desborde, fuera, h1, saltos, sinAlt, sinMedidas, rotas, enlaces, ids, idsRepetidos, sinNombre, jsonld, metadatos, pequenos };
}

const navegador = await chromium.launch();
console.log(`Revisando ${rutas.length} rutas × ${VISTAS.length} vistas en ${BASE} → ${carpeta}`);

for (const vista of VISTAS) {
  const contexto = await navegador.newContext({
    viewport: vista.viewport,
    deviceScaleFactor: dpr,
    isMobile: vista.isMobile,
    hasTouch: vista.hasTouch,
    locale: 'es-CO',
    reducedMotion: args['movimiento-reducido'] ? 'reduce' : 'no-preference',
    serviceWorkers: 'block',
  });
  // Sin red externa: todo debe servirse desde el sitio.
  const externas = new Set();
  await contexto.route('**/*', (r) => {
    const url = r.request().url();
    if (esLocal(url)) return r.continue();
    externas.add(url);
    return r.abort('blockedbyclient');
  });

  for (const ruta of rutas) {
    const pagina = await contexto.newPage();
    const consola = [];
    const fallidos = [];
    externas.clear();
    pagina.on('console', (m) => {
      if (m.type() !== 'error') return;
      const t = m.text();
      if (/ERR_BLOCKED_BY_CLIENT/.test(t)) return; // peticiones externas bloqueadas por esta herramienta
      consola.push(t);
    });
    pagina.on('pageerror', (e) => consola.push('JavaScript: ' + e.message));
    pagina.on('response', (r) => {
      if (r.status() >= 400 && esLocal(r.url()) && r.url() !== BASE + ruta) fallidos.push(`${r.status()} ${new URL(r.url()).pathname}`);
    });

    let estado = 0;
    try {
      const resp = await pagina.goto(BASE + ruta, { waitUntil: 'load', timeout: 45000 });
      estado = resp?.status() ?? 0;
      await pagina.evaluate(() => document.fonts.ready);
      await pagina.waitForTimeout(900);
    } catch (e) {
      error(ruta, vista.nombre, `No cargó: ${e.message}`);
      await pagina.close();
      continue;
    }
    if (estado !== 200) error(ruta, vista.nombre, `Respuesta HTTP ${estado}`);

    const base = path.join(carpeta, `${nombreRuta(ruta)}--${vista.nombre}`);
    if (conCapturas) await pagina.screenshot({ path: `${base}--primera-pantalla.png` });

    // Desplaza toda la página para disparar las animaciones de entrada y la carga diferida.
    const alto = await pagina.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < alto; y += Math.round(vista.viewport.height * 0.6)) {
      await pagina.evaluate((v) => window.scrollTo(0, v), y);
      await pagina.waitForTimeout(110);
    }
    await pagina.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await pagina.waitForTimeout(400);
    const res = await pagina.evaluate(revisarEnPagina, { esCelular: vista.isMobile, ancho: vista.viewport.width });
    await pagina.evaluate(() => {
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('scroll'));
    });
    await pagina.waitForTimeout(700);
    if (conCapturas) {
      // En la captura completa, los elementos fijos se verían repetidos o encima del
      // contenido: los de arriba (encabezado) quedan al inicio de la página y los de
      // abajo (barra del celular) se ocultan; ya salen en la primera pantalla.
      if (!args['sin-fijar']) {
        await pagina.evaluate(() => {
          for (const el of document.body.querySelectorAll('*')) {
            if (getComputedStyle(el).position !== 'fixed') continue;
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight / 2) {
              el.style.setProperty('position', 'absolute', 'important');
              el.style.setProperty('top', `${r.top}px`, 'important');
            } else el.style.setProperty('visibility', 'hidden', 'important');
          }
        });
      }
      await pagina.screenshot({ path: `${base}--completa.png`, fullPage: true });
    }

    // ── Resultado por página ──
    const v = vista.nombre;
    for (const c of consola) error(ruta, v, `Consola: ${c.slice(0, 300)}`);
    for (const f of [...new Set(fallidos)]) error(ruta, v, `Recurso con error: ${f}`);
    for (const x of externas) aviso(ruta, v, `Petición externa bloqueada: ${x.slice(0, 160)}`);
    if (res.desborde > 0) error(ruta, v, `Desbordamiento horizontal de ${res.desborde} px`);
    for (const f of res.fuera) aviso(ruta, v, `Elemento fuera de la pantalla (recortado): ${f}`);
    if (res.h1.length !== 1) error(ruta, v, `Debe haber un solo H1 y hay ${res.h1.length}${res.h1.length ? ': ' + res.h1.map((t) => `«${t.slice(0, 60)}»`).join(', ') : ''}`);
    for (const s of [...new Set(res.saltos)]) aviso(ruta, v, `Salto en la jerarquía de títulos: ${s}`);
    for (const s of res.sinAlt) error(ruta, v, `Imagen sin atributo alt: ${s}`);
    for (const s of res.sinMedidas) aviso(ruta, v, `Imagen sin width/height (riesgo de CLS): ${s}`);
    for (const s of res.rotas) error(ruta, v, `Imagen que no cargó: ${s}`);
    for (const s of res.idsRepetidos) error(ruta, v, `id repetido: #${s}`);
    for (const s of res.sinNombre) error(ruta, v, `Enlace o botón sin nombre accesible: ${s}`);
    for (const j of res.jsonld) {
      if (!j.ok) error(ruta, v, `JSON-LD #${j.i} no se puede leer: ${j.error}`);
      else if (!j.contexto) error(ruta, v, `JSON-LD #${j.i} sin @context`);
    }
    if (v === 'computador') {
      const m = res.metadatos;
      if (m.lang !== 'es-CO') aviso(ruta, v, `lang del documento: ${m.lang}`);
      if (!m.titulo) error(ruta, v, 'Página sin <title>');
      else if (m.titulo.length > 65) aviso(ruta, v, `Título largo (${m.titulo.length} caracteres): ${m.titulo}`);
      if (!m.descripcion) error(ruta, v, 'Página sin meta descripción');
      else if (m.descripcion.length < 70 || m.descripcion.length > 165) aviso(ruta, v, `Meta descripción de ${m.descripcion.length} caracteres (ideal 140-160)`);
      // La página de error no debe declarar canónica (no es una URL para indexar).
      if (ruta === '/404.html') {
        if (m.canonica) aviso(ruta, v, 'La página de error declara una URL canónica');
      } else if (!m.canonica) error(ruta, v, 'Página sin URL canónica');
      if (sitemap.includes(ruta) && /noindex/.test(m.robots ?? '')) error(ruta, v, 'Está en el sitemap pero tiene noindex');
    }
    if (res.pequenos.length) aviso(ruta, v, `${res.pequenos.length} objetivos táctiles menores de 44 px: ${res.pequenos.slice(0, 8).join(' | ')}`);

    informe.paginas[ruta] ??= {};
    informe.paginas[ruta][v] = {
      estado,
      h1: res.h1,
      jsonld: res.jsonld.map((j) => (j.ok ? j.tipos.join(', ') : 'ERROR')),
      metadatos: v === 'computador' ? res.metadatos : undefined,
      desborde: res.desborde,
      objetivosPequenos: res.pequenos.length,
      externas: [...externas].length,
    };
    if (v === 'computador' || !idsPorRuta.has(ruta)) idsPorRuta.set(ruta, new Set(res.ids));
    enlacesPorRuta.set(ruta, new Set([...(enlacesPorRuta.get(ruta) ?? []), ...res.enlaces]));
    await pagina.close();
    process.stdout.write('.');
  }
  await contexto.close();
}
await navegador.close();
await servidor.cerrar();
process.stdout.write('\n');

// ── Enlaces internos y anclas ────────────────────────────────────────────────
const yaReportado = new Set();
let totalInternos = 0;
for (const [ruta, enlaces] of enlacesPorRuta) {
  for (const href of enlaces) {
    if (!esLocal(href)) continue;
    const u = new URL(href);
    totalInternos++;
    const clave = `${ruta}|${u.pathname}${u.hash}`;
    if (yaReportado.has(clave)) continue;
    yaReportado.add(clave);
    const e = estadoRuta(u.pathname);
    if (e === 'no-existe') error(ruta, '-', `Enlace interno roto: ${u.pathname}`);
    else if (e === 'sin-barra') aviso(ruta, '-', `Enlace sin barra final (redirige 301): ${u.pathname}`);
    if (u.hash && u.hash.length > 1 && e === 'ok') {
      const destino = u.pathname === '/index.html' ? '/' : u.pathname;
      const ids = idsPorRuta.get(destino);
      const id = decodeURIComponent(u.hash.slice(1));
      if (ids && !ids.has(id)) error(ruta, '-', `Ancla rota: ${u.pathname}${u.hash}`);
    }
  }
}

// ── Archivos de rastreo ──────────────────────────────────────────────────────
const leer = (f) => (fs.existsSync(path.join(DIST, f)) ? fs.readFileSync(path.join(DIST, f), 'utf8') : null);
const origenSitio = (() => {
  const xml = leer('sitemap-0.xml');
  const m = xml?.match(/<loc>([^<]+)<\/loc>/);
  return m ? new URL(m[1]).origin : null;
})();
const robots = leer('robots.txt');
if (!robots) error('/robots.txt', '-', 'No existe robots.txt');
else if (!/^Sitemap:\s*\S+/m.test(robots)) error('/robots.txt', '-', 'robots.txt sin línea Sitemap');
for (const archivo of ['llms.txt', 'llms-full.txt']) {
  const txt = leer(archivo);
  if (!txt) {
    error('/' + archivo, '-', `No existe ${archivo}`);
    continue;
  }
  const urls = [...txt.matchAll(/https?:\/\/[^\s)>\]]+/g)].map((m) => m[0].replace(/[.,;:]+$/, ''));
  for (const url of new Set(urls)) {
    const u = new URL(url);
    if (origenSitio && u.origin !== origenSitio) continue;
    const e = estadoRuta(u.pathname);
    if (e !== 'ok') error('/' + archivo, '-', `Enlace a una ruta que no existe en dist: ${u.pathname}`);
    else if (sitemap.length && u.pathname.endsWith('/') && !sitemap.includes(u.pathname)) aviso('/' + archivo, '-', `Enlace a una ruta que no está en el sitemap: ${u.pathname}`);
  }
}
const manifiesto = leer('manifest.webmanifest');
if (manifiesto) {
  try {
    JSON.parse(manifiesto);
  } catch (e) {
    error('/manifest.webmanifest', '-', `No es JSON válido: ${e.message}`);
  }
}

// ── Resumen ──────────────────────────────────────────────────────────────────
informe.enlacesInternosRevisados = totalInternos;
fs.writeFileSync(path.join(carpeta, 'informe.json'), JSON.stringify(informe, null, 2));
const agrupar = (lista) => {
  const m = new Map();
  for (const x of lista) {
    const k = x.texto;
    if (!m.has(k)) m.set(k, new Set());
    m.get(k).add(`${x.ruta}${x.vista !== '-' ? ` (${x.vista})` : ''}`);
  }
  return [...m].map(([t, d]) => `  - ${t}\n      en: ${[...d].slice(0, 6).join(', ')}${d.size > 6 ? ` y ${d.size - 6} más` : ''}`);
};
console.log(`\nRutas: ${rutas.length} · Vistas: ${VISTAS.map((v) => v.nombre).join(', ')} · Enlaces internos revisados: ${totalInternos}`);
console.log(`Errores: ${informe.errores.length}`);
if (informe.errores.length) console.log(agrupar(informe.errores).join('\n'));
console.log(`Avisos: ${informe.avisos.length}`);
if (informe.avisos.length) console.log(agrupar(informe.avisos).slice(0, 40).join('\n'));
console.log(`\nInforme: ${path.join(carpeta, 'informe.json')}${conCapturas ? `\nCapturas: ${carpeta}` : ''}`);
process.exit(informe.errores.length ? 1 : 0);
