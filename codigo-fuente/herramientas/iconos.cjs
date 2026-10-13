// Uso: cd herramientas && NODE_PATH=../web/node_modules node iconos.cjs ../web
// Escribe en web/public: favicon.ico (16/32/48), icono-32.png, apple-touch-icon.png (180),
// icono-192.png, icono-512.png, icono-enmascarable-512.png (zona segura del 80 %) e
// img/logo-schema.png (logo de los datos estructurados, Organization.logo).
// Los iconos usan el símbolo completo de /img/logo.png (V + R + G, sin el nombre, ilegible a
// 16-32 px). El logo de los datos estructurados usa la marca completa (símbolo y nombre).
// Antes se recortaba un cuadrado de 600 px que dejaba la V reducida a una franja.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const raiz = process.argv[2];
const pub = (f) => path.join(raiz, 'public', f);

const FONDO = '#131315';
/** Caja del símbolo y de la marca completa dentro de logo.png (1024 x 1024, píxeles con opacidad > 40). */
const CAJA_SIMBOLO = { left: 62, top: 118, width: 899, height: 594 };
const CAJA_MARCA = { left: 38, top: 118, width: 950, height: 787 };

/** Recorta `caja` de logo.png y la ajusta a `ancho` x `alto` sin deformarla (fondo transparente). */
async function recorte(caja, ancho, alto) {
  return sharp(pub('img/logo.png'))
    .extract(caja)
    .resize(ancho, alto, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
    .png()
    .toBuffer();
}

/** Tile oscuro con el símbolo centrado. radio en fracción del lado; escala = ancho del símbolo / lado. */
async function icono(lado, { radio = 0.22, escala = 0.78 } = {}) {
  const ancho = Math.round(lado * escala);
  const alto = Math.round((ancho * CAJA_SIMBOLO.height) / CAJA_SIMBOLO.width);
  const r = Math.round(lado * radio);
  const fondo = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}">
      <defs><radialGradient id="g" cx="0.8" cy="0.15" r="0.9"><stop offset="0" stop-color="#2a2a52"/><stop offset="0.6" stop-color="#18181c"/><stop offset="1" stop-color="${FONDO}"/></radialGradient></defs>
      <rect width="${lado}" height="${lado}" rx="${r}" ry="${r}" fill="url(#g)"/></svg>`,
  );
  const sim = await recorte(CAJA_SIMBOLO, ancho, alto);
  return sharp(fondo)
    .composite([{ input: sim, left: Math.round((lado - ancho) / 2), top: Math.round((lado - alto) / 2) }])
    .png({ compressionLevel: 9, palette: lado > 64 })
    .toBuffer();
}

/** Logo de los datos estructurados: marca completa sobre fondo sólido, con 20 % de margen por lado. */
async function logoSchema(lado = 512) {
  const util = Math.round(lado * 0.6);
  const marca = await recorte(CAJA_MARCA, util, util);
  return sharp({ create: { width: lado, height: lado, channels: 4, background: FONDO } })
    .composite([{ input: marca, left: Math.round((lado - util) / 2), top: Math.round((lado - util) / 2) }])
    .flatten({ background: FONDO })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
}

function ico(pngs) {
  const cab = Buffer.alloc(6 + 16 * pngs.length);
  cab.writeUInt16LE(0, 0); cab.writeUInt16LE(1, 2); cab.writeUInt16LE(pngs.length, 4);
  let desplaz = cab.length;
  pngs.forEach(({ lado, buf }, i) => {
    const o = 6 + 16 * i;
    cab.writeUInt8(lado >= 256 ? 0 : lado, o); cab.writeUInt8(lado >= 256 ? 0 : lado, o + 1);
    cab.writeUInt8(0, o + 2); cab.writeUInt8(0, o + 3);
    cab.writeUInt16LE(1, o + 4); cab.writeUInt16LE(32, o + 6);
    cab.writeUInt32LE(buf.length, o + 8); cab.writeUInt32LE(desplaz, o + 12);
    desplaz += buf.length;
  });
  return Buffer.concat([cab, ...pngs.map((p) => p.buf)]);
}

(async () => {
  const pequenos = [];
  for (const lado of [16, 32, 48]) pequenos.push({ lado, buf: await icono(lado, { radio: 0.2, escala: 0.9 }) });
  fs.writeFileSync(pub('favicon.ico'), ico(pequenos));
  fs.writeFileSync(pub('icono-32.png'), pequenos[1].buf);
  // Apple recorta las esquinas: sin radio propio.
  fs.writeFileSync(pub('apple-touch-icon.png'), await icono(180, { radio: 0, escala: 0.74 }));
  fs.writeFileSync(pub('icono-192.png'), await icono(192));
  fs.writeFileSync(pub('icono-512.png'), await icono(512));
  // Enmascarable: fondo a sangre y el símbolo entero dentro del círculo seguro (radio 40 % del lado):
  // con 0,62 del lado de ancho, su media diagonal es 0,37 del lado.
  fs.writeFileSync(pub('icono-enmascarable-512.png'), await icono(512, { radio: 0, escala: 0.62 }));
  fs.writeFileSync(pub('img/logo-schema.png'), await logoSchema(512));
  for (const f of ['favicon.ico', 'icono-32.png', 'apple-touch-icon.png', 'icono-192.png', 'icono-512.png', 'icono-enmascarable-512.png', 'img/logo-schema.png'])
    console.log(f, fs.statSync(pub(f)).size);
})();
