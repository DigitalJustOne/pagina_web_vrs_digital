#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  Lighthouse en modo celular (configuración por defecto: Moto G Power, 4G lenta
//  simulada, CPU 4x más lenta) para una lista de rutas del sitio compilado.
//
//  Uso:
//    cd web && npx astro build
//    node lighthouse.mjs [carpeta_salida] [--rutas /,/precios/] [--base http://127.0.0.1:4321]
//                        [--modo lighthouse|playwright] [--html]
//
//  Guarda <carpeta>/lighthouse.json con, por ruta: puntuaciones de rendimiento,
//  accesibilidad, buenas prácticas y SEO; LCP, CLS, TBT, FCP e índice de
//  velocidad; el elemento LCP y las auditorías que fallan. Con --html guarda
//  también el informe completo de Lighthouse de cada ruta.
//
//  Si Lighthouse no puede correr (falta el paquete o Chrome), usa el respaldo con
//  Playwright: CPU 4x más lenta y red 4G lenta por CDP, y mide LCP, CLS, TBT y FCP
//  con PerformanceObserver (sin puntuaciones de Lighthouse).
//
//  Chrome: usa CHROME_PATH si existe; si no, busca /opt/pw-browsers/chromium-*/chrome-linux/chrome.
//  Lighthouse se instala en esta carpeta: npm i lighthouse
// ─────────────────────────────────────────────────────────────────────────────
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { asegurarServidor, rutasDelSitemap, nombreRuta, argumentos } from './servidor.mjs';

const require = createRequire(import.meta.url);
const args = argumentos();
const carpeta = path.resolve(args._[0] ?? path.join(process.cwd(), 'lighthouse-' + new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')));
fs.mkdirSync(carpeta, { recursive: true });

// El sitemap ya excluye privadas y borradores (web/src/data/rutas.ts); esto es solo un resguardo.
const PRIVADAS = ['/gracias/'];
const rutas = args.rutas
  ? String(args.rutas).split(',').map((r) => r.trim())
  : rutasDelSitemap().filter((r) => !PRIVADAS.some((p) => r.startsWith(p)));

// ── Chrome ───────────────────────────────────────────────────────────────────
function buscarChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const raiz = '/opt/pw-browsers';
  if (!fs.existsSync(raiz)) return null;
  const candidatos = fs
    .readdirSync(raiz)
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
    .map((d) => path.join(raiz, d, 'chrome-linux', 'chrome'))
    .filter((p) => fs.existsSync(p));
  return candidatos[0] ?? null;
}
const CHROME = buscarChrome();
if (CHROME) process.env.CHROME_PATH = CHROME;

const redondear = (v, d = 0) => (typeof v === 'number' ? Number(v.toFixed(d)) : null);

// ── Lighthouse ───────────────────────────────────────────────────────────────
async function conLighthouse(base) {
  const { default: lighthouse } = await import('lighthouse');
  const chromeLauncher = await import('chrome-launcher');
  const chrome = await chromeLauncher.launch({
    chromePath: CHROME ?? undefined,
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-first-run'],
  });
  const resultados = [];
  try {
    for (const ruta of rutas) {
      const url = base + ruta;
      const r = await lighthouse(
        url,
        {
          port: chrome.port,
          logLevel: 'error',
          output: args.html ? ['json', 'html'] : 'json',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          // Todo se sirve local: se bloquean las peticiones HTTPS externas.
          blockedUrlPatterns: ['https://*'],
          locale: 'es',
        },
      );
      if (!r?.lhr) throw new Error('Lighthouse no devolvió resultados para ' + url);
      const { lhr } = r;
      if (lhr.runtimeError) throw new Error(`${lhr.runtimeError.code}: ${lhr.runtimeError.message}`);
      if (args.html && Array.isArray(r.report)) fs.writeFileSync(path.join(carpeta, `${nombreRuta(ruta)}.html`), r.report[1]);
      const a = lhr.audits;
      const fallas = Object.values(lhr.categories).flatMap((cat) =>
        cat.auditRefs
          .filter((ref) => ref.weight > 0 || cat.id !== 'performance')
          .map((ref) => a[ref.id])
          .filter((au) => au && au.score !== null && au.score < 0.9 && ['binary', 'numeric', 'metricSavings'].includes(au.scoreDisplayMode))
          .map((au) => `[${cat.id}] ${au.title}${au.displayValue ? ` (${au.displayValue})` : ''}`),
      );
      const lcpItem = a['largest-contentful-paint-element']?.details?.items?.[0];
      const lcpNodo = lcpItem?.items?.[0]?.node ?? lcpItem?.node;
      resultados.push({
        ruta,
        rendimiento: Math.round(lhr.categories.performance.score * 100),
        accesibilidad: Math.round(lhr.categories.accessibility.score * 100),
        buenasPracticas: Math.round(lhr.categories['best-practices'].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
        lcpMs: redondear(a['largest-contentful-paint']?.numericValue),
        cls: redondear(a['cumulative-layout-shift']?.numericValue, 3),
        tbtMs: redondear(a['total-blocking-time']?.numericValue),
        fcpMs: redondear(a['first-contentful-paint']?.numericValue),
        indiceVelocidadMs: redondear(a['speed-index']?.numericValue),
        elementoLcp: lcpNodo ? `${lcpNodo.nodeLabel ?? ''} ${lcpNodo.selector ?? ''}`.trim().slice(0, 140) : null,
        pesoTotalKB: redondear((a['total-byte-weight']?.numericValue ?? 0) / 1024),
        // false en páginas con noindex a propósito (404, gracias): su SEO no se evalúa.
        indexable: a['is-crawlable']?.score !== 0,
        fallas,
      });
      process.stdout.write('.');
    }
  } finally {
    await chrome.kill();
  }
  return resultados;
}

// ── Respaldo con Playwright ──────────────────────────────────────────────────
async function conPlaywright(base) {
  const { chromium } = require('/opt/node-tools/node_modules/playwright');
  const navegador = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
  const resultados = [];
  for (const ruta of rutas) {
    const contexto = await navegador.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true, locale: 'es-CO' });
    await contexto.route('**/*', (r) => (new URL(r.request().url()).origin === new URL(base).origin || r.request().url().startsWith('data:') ? r.continue() : r.abort()));
    await contexto.addInitScript(() => {
      window.__m = { lcp: 0, cls: 0, tbt: 0, fcp: 0, lcpEl: '' };
      try {
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) {
            window.__m.lcp = e.startTime;
            window.__m.lcpEl = e.element ? e.element.tagName.toLowerCase() + (e.element.className && typeof e.element.className === 'string' ? '.' + e.element.className.split(' ')[0] : '') : e.url;
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        // CLS: ventana de sesión máxima (definición de Web Vitals).
        let ventana = 0, inicio = 0, ultimo = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) {
            if (e.hadRecentInput) continue;
            if (ventana && e.startTime - ultimo < 1000 && e.startTime - inicio < 5000) ventana += e.value;
            else { ventana = e.value; inicio = e.startTime; }
            ultimo = e.startTime;
            window.__m.cls = Math.max(window.__m.cls, ventana);
          }
        }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime;
        }).observe({ type: 'paint', buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) if (e.duration > 50) window.__m.tbt += e.duration - 50;
        }).observe({ type: 'longtask', buffered: true });
      } catch {}
    });
    const pagina = await contexto.newPage();
    const cdp = await contexto.newCDPSession(pagina);
    await cdp.send('Network.enable');
    // Igual que la 4G lenta de Lighthouse: 150 ms de latencia, 1,6 Mbps de bajada, 750 kbps de subida.
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await pagina.goto(base + ruta, { waitUntil: 'load', timeout: 90000 });
    await pagina.waitForTimeout(4000);
    const m = await pagina.evaluate(() => window.__m);
    const peso = await pagina.evaluate(() => performance.getEntriesByType('resource').reduce((s, r) => s + (r.transferSize || 0), 0) + (performance.getEntriesByType('navigation')[0]?.transferSize || 0));
    resultados.push({
      ruta,
      rendimiento: null,
      accesibilidad: null,
      buenasPracticas: null,
      seo: null,
      lcpMs: redondear(m.lcp),
      cls: redondear(m.cls, 3),
      tbtMs: redondear(m.tbt),
      fcpMs: redondear(m.fcp),
      indiceVelocidadMs: null,
      elementoLcp: m.lcpEl || null,
      pesoTotalKB: redondear(peso / 1024),
      indexable: null,
      fallas: [],
    });
    await contexto.close();
    process.stdout.write('.');
  }
  await navegador.close();
  return resultados;
}

// ── Ejecución ────────────────────────────────────────────────────────────────
const servidor = await asegurarServidor(args.base ?? 'http://127.0.0.1:4321');
let modo = args.modo === 'playwright' ? 'playwright' : 'lighthouse';
let motivo = null;
let resultados = [];
console.log(`Midiendo ${rutas.length} rutas en ${servidor.base} (modo ${modo}, Chrome: ${CHROME ?? 'el de Playwright'})`);
try {
  resultados = modo === 'lighthouse' ? await conLighthouse(servidor.base) : await conPlaywright(servidor.base);
} catch (e) {
  motivo = `Lighthouse no pudo correr: ${e.message}`;
  console.error('\n' + motivo + '\nSe usa el respaldo con Playwright.');
  modo = 'playwright';
  resultados = await conPlaywright(servidor.base);
}
await servidor.cerrar();
process.stdout.write('\n');

// Umbrales de "bueno" de Core Web Vitals (TBT es el sustituto de laboratorio de INP).
const UMBRALES = { lcpMs: 2500, cls: 0.1, tbtMs: 200 };
const alertas = [];
for (const r of resultados) {
  if (r.lcpMs > UMBRALES.lcpMs) alertas.push(`${r.ruta}: LCP ${r.lcpMs} ms (> ${UMBRALES.lcpMs})`);
  if (r.cls > UMBRALES.cls) alertas.push(`${r.ruta}: CLS ${r.cls} (> ${UMBRALES.cls})`);
  if (r.tbtMs > UMBRALES.tbtMs) alertas.push(`${r.ruta}: TBT ${r.tbtMs} ms (> ${UMBRALES.tbtMs})`);
  for (const [k, n] of [['rendimiento', 90], ['accesibilidad', 95], ['buenasPracticas', 95], ['seo', 95]]) {
    if (k === 'seo' && r.indexable === false) continue;
    if (r[k] !== null && r[k] < n) alertas.push(`${r.ruta}: ${k} ${r[k]} (< ${n})`);
  }
}
const salida = { fecha: new Date().toISOString(), modo, motivo, chrome: CHROME, base: servidor.base, umbrales: UMBRALES, resultados, alertas };
fs.writeFileSync(path.join(carpeta, 'lighthouse.json'), JSON.stringify(salida, null, 2));

console.table(
  resultados.map((r) => ({
    ruta: r.ruta,
    rend: r.rendimiento ?? '-',
    acces: r.accesibilidad ?? '-',
    'b.prác': r.buenasPracticas ?? '-',
    seo: r.seo ?? '-',
    'LCP ms': r.lcpMs,
    CLS: r.cls,
    'TBT ms': r.tbtMs,
    'KB': r.pesoTotalKB,
  })),
);
for (const r of resultados) if (r.fallas.length) console.log(`\n${r.ruta} — auditorías por mejorar:\n  ${r.fallas.join('\n  ')}`);
console.log(alertas.length ? `\nAlertas:\n  ${alertas.join('\n  ')}` : '\nSin alertas: todas las rutas dentro de los umbrales.');
console.log(`\nResultado: ${path.join(carpeta, 'lighthouse.json')}`);
process.exit(alertas.length ? 1 : 0);
