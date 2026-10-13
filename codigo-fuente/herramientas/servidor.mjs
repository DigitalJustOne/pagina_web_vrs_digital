// Utilidades compartidas: servidor local de vista previa y rutas del sitemap.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

export const AQUI = path.dirname(fileURLToPath(import.meta.url));
export const WEB = path.resolve(AQUI, '../web');
/**
 * Carpeta compilada que se revisa (sitemap, enlaces internos, llms.txt). Por defecto web/dist.
 * Para otra carpeta: --dist <ruta> (relativa a web/ o absoluta) o la variable VRS_DIST.
 * Con una carpeta distinta de dist, sírvala usted y pase --base (astro preview sirve web/dist).
 */
const distPedido = (() => {
  const i = process.argv.indexOf('--dist');
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) return process.argv[i + 1];
  return process.argv.find((a) => a.startsWith('--dist='))?.slice('--dist='.length) ?? process.env.VRS_DIST;
})();
export const DIST = path.resolve(WEB, distPedido ?? 'dist');

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function responde(url) {
  try {
    const r = await fetch(url, { redirect: 'manual' });
    return r.status > 0;
  } catch {
    return false;
  }
}

/**
 * Usa un servidor que ya esté corriendo en `base` o arranca `astro preview`.
 * Devuelve { base, cerrar }.
 */
export async function asegurarServidor(base = 'http://127.0.0.1:4321') {
  if (await responde(base + '/')) return { base, cerrar: async () => {}, propio: false };
  if (!fs.existsSync(path.join(DIST, 'index.html'))) throw new Error(`No existe ${DIST}/index.html. Ejecute antes: npx astro build`);
  const { port, hostname } = new URL(base);
  const hijo = spawn('npx', ['astro', 'preview', '--port', port || '4321', '--host', hostname], {
    cwd: WEB,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });
  let salida = '';
  hijo.stdout.on('data', (d) => (salida += d));
  hijo.stderr.on('data', (d) => (salida += d));
  for (let i = 0; i < 120; i++) {
    if (await responde(base + '/')) {
      return {
        base,
        propio: true,
        cerrar: async () => {
          try {
            process.kill(-hijo.pid, 'SIGTERM');
          } catch {}
        },
      };
    }
    if (hijo.exitCode !== null) break;
    await espera(250);
  }
  try {
    process.kill(-hijo.pid, 'SIGTERM');
  } catch {}
  throw new Error('No se pudo iniciar astro preview:\n' + salida);
}

/** Lee dist/sitemap-index.xml (o sitemap-0.xml) y devuelve las rutas (/precios/, /...). */
export function rutasDelSitemap() {
  const indice = path.join(DIST, 'sitemap-index.xml');
  let archivos = [];
  if (fs.existsSync(indice)) {
    const xml = fs.readFileSync(indice, 'utf8');
    archivos = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => path.join(DIST, new URL(m[1]).pathname));
  }
  if (!archivos.length) archivos = [path.join(DIST, 'sitemap-0.xml')];
  const rutas = new Set();
  for (const a of archivos) {
    if (!fs.existsSync(a)) continue;
    const xml = fs.readFileSync(a, 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) rutas.add(new URL(m[1]).pathname);
  }
  return [...rutas];
}

/** ¿Existe esta ruta en dist? Devuelve 'ok', 'sin-barra' (redirige 301) o 'no-existe'. */
export function estadoRuta(ruta) {
  let p;
  try {
    p = decodeURIComponent(ruta);
  } catch {
    p = ruta;
  }
  const destino = path.join(DIST, p);
  if (!destino.startsWith(DIST)) return 'no-existe';
  if (p.endsWith('/')) return fs.existsSync(path.join(destino, 'index.html')) ? 'ok' : 'no-existe';
  if (fs.existsSync(destino) && fs.statSync(destino).isFile()) return 'ok';
  if (fs.existsSync(path.join(destino, 'index.html'))) return 'sin-barra';
  return 'no-existe';
}

/** Nombre de archivo para una ruta: '/' → 'inicio', '/recursos/guia/' → 'recursos__guia'. */
export const nombreRuta = (ruta) => ruta.replace(/^\/|\/$/g, '').replace(/\//g, '__').replace(/\.html$/, '') || 'inicio';

/** Lee argumentos --clave valor y --bandera. */
export function argumentos(argv = process.argv.slice(2)) {
  const r = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      if (v !== undefined) r[k] = v;
      else if (argv[i + 1] && !argv[i + 1].startsWith('--')) r[k] = argv[++i];
      else r[k] = true;
    } else r._.push(a);
  }
  return r;
}
