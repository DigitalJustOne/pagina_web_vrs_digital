// ─────────────────────────────────────────────────────────────────────────────
//  Geometría compartida entre la escena 3D (Escena3DMotor.ts) y su póster SVG
//  (HeroVisual.astro). Sin three.js ni DOM: el póster se calcula al compilar con
//  los mismos números y el mismo azar determinista, así el primer cuadro de la
//  escena coincide con lo que la persona ya está viendo.
// ─────────────────────────────────────────────────────────────────────────────

/** Campo de visión vertical de la cámara, en grados. */
export const FOV = 35;
/** Radio (unidades de mundo) que siempre cabe en la dimensión menor del lienzo. */
export const ENCUADRE = 3.05;
/** Lado de referencia (px) para el tamaño de los puntos. */
export const LADO_REFERENCIA = 560;
/** Distancia de la cámara cuando el lienzo es cuadrado o apaisado. */
export const distanciaCamara = (aspecto = 1) => ENCUADRE / Math.min(1, aspecto) / Math.tan(((FOV / 2) * Math.PI) / 180);

/** Anillos orbitales: radio, inclinación (rad, eje X), giro en pantalla (rad, eje Z), velocidad del cometa, rotación propia y desfase. */
export const ANILLOS = [
  { radio: 1.62, inclinacion: 1.16, giro: 0.42, velocidad: 0.085, rotacion: 0.11, desfase: 0.15 },
  { radio: 2.2, inclinacion: 1.3, giro: -0.3, velocidad: 0.06, rotacion: -0.07, desfase: 0.55 },
  { radio: 2.78, inclinacion: 1.42, giro: 0.08, velocidad: 0.045, rotacion: 0.05, desfase: 0.85 },
] as const;

/** Sombreado del cristal y su corazón: lo usan el sombreador (Escena3DNucleo) y el póster SVG. */
export const CRISTAL = {
  /** Entorno procedural: índigo abajo, violeta arriba. */
  baseOscura: 0.1,
  baseClara: 0.34,
  /** Intensidad de las dos franjas de luz de "estudio" (destellos en las facetas). */
  franja: 2.2,
  franja2: 1.4,
  refraccion: 0.3,
  reflejo: 0.24,
  reflejoFresnel: 1.0,
  bordeFresnel: 0.7,
  potenciaFresnel: 2.6,
  alfaBase: 0.05,
  alfaFresnel: 0.75,
  /** Cuánto suben la opacidad los destellos (así se ven lavanda y no grises). */
  alfaBrillo: 0.9,
  alfaMax: 0.92,
  /** Las caras traseras se ven a través del vidrio: más tenues. */
  alfaAtras: 0.45,
  aristaAtras: 0.035,
  aristaFrente: 0.36,
  radioCorazon: 0.42,
  corazon: 0.55,
} as const;

/** Número como literal GLSL (siempre con punto decimal). */
export const glsl = (n: number) => (Number.isInteger(n) ? n.toFixed(1) : String(n));

/** Cantidades por calidad. La versión de celular usa los primeros elementos de la misma secuencia. */
export const CANTIDADES = {
  computador: { entrantes: 90, burbujas: 14, polvo: 140 },
  celular: { entrantes: 54, burbujas: 10, polvo: 80 },
} as const;

/** Generador pseudoaleatorio determinista (mulberry32). */
export function azar(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function direccionEsfera(r: () => number): [number, number, number] {
  const u = r() * 2 - 1;
  const th = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(th), u, s * Math.sin(th)];
}

// ── Datos de partículas (idénticos en escena y póster) ──────────────────────

/** Búsquedas que llegan. dir: vec3; datos: fase, velocidad, giro de la espiral, tamaño. */
export function datosEntrantes(n: number) {
  const dir = new Float32Array(n * 3);
  const datos = new Float32Array(n * 4);
  const r = azar(21);
  for (let k = 0; k < n; k++) {
    const [x, y, z] = direccionEsfera(r);
    dir.set([x, y * 0.72, z], k * 3); // achatado: llegan sobre todo de los lados
    datos.set([r(), 0.07 + r() * 0.07, 0.9 + r() * 1.6, 3.2 + r() * 3.2], k * 4);
  }
  return { dir, datos };
}

/** Respuestas que salen. dir: vec3 (hacia el frente y arriba); datos: fase, velocidad, tamaño, deriva vertical. */
export function datosBurbujas(m: number) {
  const dir = new Float32Array(m * 3);
  const datos = new Float32Array(m * 4);
  const r = azar(99);
  for (let k = 0; k < m; k++) {
    const [x, y, z] = direccionEsfera(r);
    const vx = x,
      vy = y * 0.8 + 0.25,
      vz = Math.abs(z) * 0.9 + 0.25;
    const l = Math.hypot(vx, vy, vz);
    dir.set([vx / l, vy / l, vz / l], k * 3);
    datos.set([k / m + r() * 0.04, 0.085 + r() * 0.05, 9 + r() * 9, 0.15 + r() * 0.35], k * 4);
  }
  return { dir, datos };
}

/** Polvo de fondo. pos: vec3; datos: fase, tamaño. */
export function datosPolvo(p: number) {
  const pos = new Float32Array(p * 3);
  const datos = new Float32Array(p * 2);
  const r = azar(3);
  for (let k = 0; k < p; k++) {
    const [x, y, z] = direccionEsfera(r);
    const rad = 3.3 + r() * 3.2;
    pos.set([x * rad, y * rad * 0.8, z * rad - 1], k * 3);
    datos.set([r(), 1.4 + r() * 1.8], k * 2);
  }
  return { pos, datos };
}

/** Nodos fijos sobre cada anillo (en el plano local del anillo). datos: fase, tamaño. */
export function datosNodos() {
  const r = azar(7);
  return ANILLOS.map((a, i) => {
    const n = 2 + (i % 2);
    const pos = new Float32Array(n * 3);
    const datos = new Float32Array(n * 2);
    for (let k = 0; k < n; k++) {
      const ang = (k / n) * Math.PI * 2 + r() * 1.2;
      pos.set([Math.cos(ang) * a.radio, Math.sin(ang) * a.radio, 0], k * 3);
      datos.set([r(), 5.5 + r() * 2.5], k * 2);
    }
    return { pos, datos };
  });
}

// ── Funciones de trayecto (espejo de los sombreadores) ─────────────────────
export const suave = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;

export function trayectoEntrante(dir: ArrayLike<number>, giro: number, p: number): [number, number, number] {
  const r = mezcla(3.7, 1.04, Math.pow(p, 1.5));
  const a = (1 - p) * giro;
  const c = Math.cos(a),
    s = Math.sin(a);
  return [(c * dir[0] + s * dir[2]) * r, dir[1] * r, (-s * dir[0] + c * dir[2]) * r];
}
export const alfaEntrante = (p: number) => suave(0, 0.2, p) * (1 - suave(0.9, 1, p)) * mezcla(0.25, 1, p);

export function posicionBurbuja(dir: ArrayLike<number>, deriva: number, p: number): [number, number, number] {
  const e = 1 - Math.pow(1 - p, 2.2);
  const r = mezcla(1.1, 3.25, e);
  return [dir[0] * r, dir[1] * r + e * deriva, dir[2] * r];
}
export const alfaBurbuja = (p: number) => suave(0, 0.08, p) * (1 - suave(0.5, 1, p));

/** Lleva un punto del plano local de un anillo al mundo (inclinación en X y luego giro en Z, orden 'ZXY'). */
export function puntoAnillo(i: number, x: number, y: number): [number, number, number] {
  const a = ANILLOS[i];
  const ci = Math.cos(a.inclinacion),
    si = Math.sin(a.inclinacion);
  const yy = y * ci,
    zz = y * si;
  const cg = Math.cos(a.giro),
    sg = Math.sin(a.giro);
  return [x * cg - yy * sg, x * sg + yy * cg, zz];
}

// ── Icosaedro subdividido (para el póster) ─────────────────────────────────
export function icosaedro(detalle = 1) {
  const t = (1 + Math.sqrt(5)) / 2;
  const v = [
    -1,
    t,
    0,
    1,
    t,
    0,
    -1,
    -t,
    0,
    1,
    -t,
    0,
    0,
    -1,
    t,
    0,
    1,
    t,
    0,
    -1,
    -t,
    0,
    1,
    -t,
    t,
    0,
    -1,
    t,
    0,
    1,
    -t,
    0,
    -1,
    -t,
    0,
    1,
  ];
  const f = [
    0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6,
    3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1,
  ];
  type V = [number, number, number];
  const norm = (p: V): V => {
    const l = Math.hypot(p[0], p[1], p[2]);
    return [p[0] / l, p[1] / l, p[2] / l];
  };
  const P = (i: number): V => norm([v[i * 3], v[i * 3 + 1], v[i * 3 + 2]]);
  const medio = (a: V, b: V): V => norm([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]);
  let caras: V[][] = [];
  for (let i = 0; i < f.length; i += 3) caras.push([P(f[i]), P(f[i + 1]), P(f[i + 2])]);
  for (let d = 0; d < detalle; d++) {
    const nuevas: V[][] = [];
    for (const [a, b, c] of caras) {
      const ab = medio(a, b),
        bc = medio(b, c),
        ca = medio(c, a);
      nuevas.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]);
    }
    caras = nuevas;
  }
  return caras;
}

// ── Proyección al póster (viewBox 0 0 600 600, mismo encuadre que la cámara) ──
export const LADO_POSTER = 600;
export function proyectar([x, y, z]: ArrayLike<number> & Iterable<number>): { x: number; y: number; escala: number } {
  const d = distanciaCamara(1);
  const f = d / (d - z);
  const s = LADO_POSTER / 2 / ENCUADRE;
  return { x: LADO_POSTER / 2 + x * f * s, y: LADO_POSTER / 2 - y * f * s, escala: f };
}
