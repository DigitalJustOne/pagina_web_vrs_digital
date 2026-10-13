// Renderiza la imagen social de VRS Digital (1200 x 630) desde og.html.
// Uso: node og.mjs [salida.png]   (por defecto ../web/public/img/og-vrs-digital.png)
// Todo es local: fuentes de node_modules/@fontsource-variable y logo de public/img.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const aqui = path.dirname(fileURLToPath(import.meta.url));
const salida = path.resolve(process.argv[2] ?? path.join(aqui, '../web/public/img/og-vrs-digital.png'));

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const errores = [];
pagina.on('requestfailed', (r) => errores.push(`No cargó: ${r.url()}`));
await pagina.goto(pathToFileURL(path.join(aqui, 'og.html')).href, { waitUntil: 'load' });
await pagina.evaluate(() => document.fonts.ready);
const fuentes = await pagina.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family));
const png = await pagina.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await navegador.close();
// Paleta de 256 colores con difuminado: ~90 KB en vez de ~390 KB, sin bandas visibles.
const sharp = createRequire(path.join(aqui, '../web/package.json'))('sharp');
await sharp(png).png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 }).toFile(salida);
if (errores.length) console.error(errores.join('\n'));
console.log(`Imagen: ${salida} (${Math.round(fs.statSync(salida).size / 1024)} KB). Fuentes cargadas: ${[...new Set(fuentes)].join(', ')}`);
