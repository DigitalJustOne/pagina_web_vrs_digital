// ─────────────────────────────────────────────────────────────────────────────
//  Núcleo de la escena 3D del inicio: "ser encontrado y responder".
//  Un cristal que late, anillos orbitales finos, búsquedas que viajan hacia el
//  núcleo (estelas) y respuestas que salen de él (burbujas).
//
//  - Sin DOM: funciona igual en un Worker (OffscreenCanvas) o en el hilo principal.
//    Escena3DMotor.ts decide dónde corre y le pasa tamaño, puntero y desplazamiento.
//  - Solo se importan las clases necesarias de three (tree-shaking).
//  - Sombreadores propios, sin luces ni posprocesado: el brillo es aditivo y el
//    "vidrio" es un fresnel con un entorno procedural (más barato que transmission).
//  - Toda la animación de partículas vive en la GPU (sin trabajo por partícula en JS).
//  - Geometría y azar compartidos con el póster SVG (Escena3DGeometria.ts).
// ─────────────────────────────────────────────────────────────────────────────
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  EdgesGeometry,
  FrontSide,
  Group,
  IcosahedronGeometry,
  LineSegments,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  type Material,
  type Object3D,
} from 'three';
import {
  ANILLOS,
  CANTIDADES,
  CRISTAL as K,
  glsl as f,
  FOV,
  LADO_REFERENCIA,
  datosBurbujas,
  datosEntrantes,
  datosNodos,
  datosPolvo,
  distanciaCamara,
} from './Escena3DGeometria';

// Paleta de marca en sRGB (los sombreadores escriben el color tal cual, sin conversión).
const LAVANDA = new Vector3(0xc0 / 255, 0xc1 / 255, 1);
const VIOLETA = new Vector3(0x80 / 255, 0x83 / 255, 1);
const INDIGO = new Vector3(0x63 / 255, 0x66 / 255, 0xf1 / 255);

export interface ConfigNucleo {
  ancho: number;
  alto: number;
  /** Densidad de píxeles ya limitada (1,75 computador, 1,25 celular). */
  densidad: number;
  celular: boolean;
  suavizado: boolean;
  /** Solo pruebas: acepta renderizado por software (SwiftShader). */
  forzar: boolean;
}

export interface Nucleo {
  /** Tramos de montaje en ms (en el hilo donde corre el núcleo). */
  tramos: Record<string, number>;
  llamadasDibujo: number;
  redimensionar: (ancho: number, alto: number) => void;
  /** Puntero normalizado (-1 a 1). */
  puntero: (x: number, y: number) => void;
  /** Progreso de desplazamiento (0 en reposo, ~1 tras bajar una pantalla). */
  desplazamiento: (s: number) => void;
  /** Inicia o pausa el bucle de animación. */
  activar: (si: boolean) => void;
  destruir: () => void;
}

// ── Sombreadores ────────────────────────────────────────────────────────────
const VERT_SUPERFICIE = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vVista;
  varying float vProf;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vVista = normalize(-mv.xyz);
    vProf = mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

// Vidrio facetado: fresnel + reflejo/refracción de un "estudio" procedural con dos franjas de luz.
const FRAG_CRISTAL = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  uniform float uPulso;
  uniform float uCara;
  varying vec3 vNormal;
  varying vec3 vVista;
  // rgb: color del entorno; a: intensidad de las franjas de luz.
  vec4 entorno(vec3 d) {
    float y = d.y * 0.5 + 0.5;
    vec3 base = mix(uC * ${f(K.baseOscura)}, uB * ${f(K.baseClara)}, smoothstep(0.05, 1.0, y));
    float franja = smoothstep(0.955, 0.995, 1.0 - abs(dot(d, normalize(vec3(0.62, 0.78, 0.0))) - 0.2));
    float franja2 = smoothstep(0.982, 1.0, 1.0 - abs(d.x + 0.58));
    float luz = franja * ${f(K.franja)} + franja2 * ${f(K.franja2)};
    return vec4(base + uA * luz, luz);
  }
  void main() {
    vec3 N = normalize(vNormal);
    if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(vVista);
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float fres = pow(1.0 - ndv, ${f(K.potenciaFresnel)});
    vec4 eT = entorno(refract(-V, N, 0.72));
    vec4 eR = entorno(reflect(-V, N));
    float kT = (1.0 - fres) * ${f(K.refraccion)};
    float kR = ${f(K.reflejo)} + fres * ${f(K.reflejoFresnel)};
    vec3 col = eT.rgb * kT + eR.rgb * kR + uA * fres * ${f(K.bordeFresnel)};
    col *= 0.88 + uPulso * 0.14;
    float alfa = clamp(${f(K.alfaBase)} + fres * ${f(K.alfaFresnel)} + (eT.a * kT + eR.a * kR) * ${f(K.alfaBrillo)}, 0.0, ${f(K.alfaMax)});
    alfa *= mix(${f(K.alfaAtras)}, 1.0, uCara);
    // Recorte que conserva el tono (los destellos quedan lavanda, no blancos) y salida premultiplicada.
    col /= max(1.0, max(col.r, max(col.g, col.b)));
    gl_FragColor = vec4(col * alfa, alfa);
  }
`;

// Corazón luminoso dentro del cristal.
const FRAG_CORAZON = /* glsl */ `
  uniform vec3 uB;
  uniform float uPulso;
  varying vec3 vNormal;
  varying vec3 vVista;
  void main() {
    float ndv = clamp(dot(normalize(vNormal), normalize(vVista)), 0.0, 1.0);
    float g = pow(ndv, 2.6);
    vec3 col = mix(uB, vec3(0.96, 0.96, 1.0), pow(ndv, 5.0));
    float i = g * (${f(K.corazon)} + uPulso * 0.3);
    col *= i;
    gl_FragColor = vec4(col, max(col.r, max(col.g, col.b)));
  }
`;

// Aristas del cristal, más tenues las de atrás.
const VERT_LINEA = /* glsl */ `
  varying float vProf;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vProf = mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG_ARISTA = /* glsl */ `
  uniform vec3 uA;
  uniform float uPulso;
  uniform float uDistancia;
  varying float vProf;
  void main() {
    float cerca = smoothstep(-uDistancia - 0.9, -uDistancia + 0.9, vProf);
    float i = mix(${f(K.aristaAtras)}, ${f(K.aristaFrente)}, cerca) * (0.85 + uPulso * 0.3);
    vec3 col = uA * i;
    gl_FragColor = vec4(col, i);
  }
`;

// Anillo orbital con un cometa (cabeza brillante y cola que se desvanece).
const VERT_ANILLO = /* glsl */ `
  varying vec2 vUv;
  varying float vProf;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vProf = mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG_ANILLO = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uTiempo;
  uniform float uVelocidad;
  uniform float uDesfase;
  uniform float uDistancia;
  varying vec2 vUv;
  varying float vProf;
  void main() {
    float a = fract(vUv.x - uTiempo * uVelocidad + uDesfase);
    float cola = pow(a, 6.0);
    float cabeza = pow(a, 90.0);
    float cerca = smoothstep(-uDistancia - 2.4, -uDistancia + 2.4, vProf);
    float i = (0.16 + cola * 0.5 + cabeza * 1.5) * mix(0.35, 1.0, cerca);
    vec3 col = mix(uB, uA, cola) * i + vec3(cabeza * 0.35);
    gl_FragColor = vec4(col, min(1.0, max(i, max(col.r, max(col.g, col.b)))));
  }
`;

// Búsquedas que llegan: espiral hacia el núcleo, acelerando al final.
const COMUN_ENTRANTE = /* glsl */ `
  attribute vec3 aDir;
  attribute vec4 aDatos; // fase, velocidad, giro, tamaño
  uniform float uTiempo;
  varying float vAlfa;
  varying float vP;
  vec3 girarY(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z);
  }
  vec3 trayecto(float p) {
    float r = mix(3.7, 1.04, pow(p, 1.5));
    return girarY(aDir, (1.0 - p) * aDatos.z) * r;
  }
  float alfaTrayecto(float p) {
    return smoothstep(0.0, 0.2, p) * (1.0 - smoothstep(0.9, 1.0, p)) * mix(0.25, 1.0, p);
  }
`;
const VERT_ESTELA = /* glsl */ `
  ${COMUN_ENTRANTE}
  attribute float aCola;
  uniform float uDistancia;
  void main() {
    float p0 = fract(uTiempo * aDatos.y + aDatos.x);
    float p = max(p0 - aCola * 0.075, 0.0);
    vec4 mv = modelViewMatrix * vec4(trayecto(p), 1.0);
    float cerca = smoothstep(-uDistancia - 3.0, -uDistancia + 3.0, mv.z);
    vAlfa = alfaTrayecto(p0) * (1.0 - aCola) * mix(0.4, 1.0, cerca) * 0.75;
    vP = p0;
    gl_Position = projectionMatrix * mv;
  }
`;
const VERT_CABEZA = /* glsl */ `
  ${COMUN_ENTRANTE}
  uniform float uEscala;
  uniform float uDistancia;
  void main() {
    float p = fract(uTiempo * aDatos.y + aDatos.x);
    vec4 mv = modelViewMatrix * vec4(trayecto(p), 1.0);
    float cerca = smoothstep(-uDistancia - 3.0, -uDistancia + 3.0, mv.z);
    vAlfa = alfaTrayecto(p) * mix(0.45, 1.0, cerca);
    vP = p;
    gl_PointSize = aDatos.w * uEscala * mix(0.7, 1.25, p) * (uDistancia / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG_ESTELA = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  varying float vAlfa;
  varying float vP;
  void main() {
    vec3 col = mix(uB, uA, vP) * vAlfa;
    gl_FragColor = vec4(col, vAlfa);
  }
`;
const FRAG_PUNTO = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  varying float vAlfa;
  varying float vP;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float m = 1.0 - smoothstep(0.0, 1.0, d);
    m = m * m;
    float i = m * vAlfa;
    if (i < 0.004) discard;
    vec3 col = mix(uB, uA, vP) * i + vec3(pow(m, 6.0) * vAlfa * 0.35);
    gl_FragColor = vec4(col, min(1.0, max(i, max(col.r, max(col.g, col.b)))));
  }
`;

// Respuestas que salen: burbujas con borde que crecen y se desvanecen.
const VERT_BURBUJA = /* glsl */ `
  attribute vec3 aDir;
  attribute vec4 aDatos; // fase, velocidad, tamaño, deriva
  uniform float uTiempo;
  uniform float uEscala;
  uniform float uDistancia;
  varying float vAlfa;
  void main() {
    float p = fract(uTiempo * aDatos.y + aDatos.x);
    float e = 1.0 - pow(1.0 - p, 2.2);
    vec3 pos = aDir * mix(1.1, 3.25, e);
    pos.y += e * aDatos.w;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vAlfa = smoothstep(0.0, 0.08, p) * (1.0 - smoothstep(0.5, 1.0, p));
    gl_PointSize = aDatos.z * uEscala * mix(0.45, 1.5, e) * (uDistancia / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG_BURBUJA = /* glsl */ `
  uniform vec3 uA;
  varying float vAlfa;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    // Pompa: borde fino y brillante, relleno casi transparente y un reflejo pequeño.
    float borde = smoothstep(0.74, 0.86, d) * (1.0 - smoothstep(0.9, 1.0, d));
    float relleno = d * d * 0.09;
    float brillo = smoothstep(0.17, 0.0, length(gl_PointCoord - vec2(0.33, 0.3))) * 0.55;
    float i = (borde * 0.85 + relleno + brillo) * vAlfa;
    vec3 col = uA * i + vec3(brillo * vAlfa * 0.35);
    gl_FragColor = vec4(col, min(1.0, max(i, max(col.r, max(col.g, col.b)))));
  }
`;

// Polvo de fondo que titila (profundidad).
const VERT_POLVO = /* glsl */ `
  attribute vec2 aDatos; // fase, tamaño
  uniform float uTiempo;
  uniform float uEscala;
  uniform float uDistancia;
  varying float vAlfa;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vAlfa = 0.22 + 0.2 * sin(uTiempo * (0.6 + aDatos.x) + aDatos.x * 30.0);
    gl_PointSize = aDatos.y * uEscala * (uDistancia / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG_POLVO = /* glsl */ `
  uniform vec3 uA;
  varying float vAlfa;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float m = 1.0 - smoothstep(0.2, 1.0, d);
    float i = m * vAlfa;
    if (i < 0.004) discard;
    gl_FragColor = vec4(uA * i, i);
  }
`;

// Halo detrás del núcleo + onda que se expande con cada latido ("respuesta enviada").
const VERT_PLANO = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const FRAG_HALO = /* glsl */ `
  uniform vec3 uB;
  uniform vec3 uC;
  uniform float uPulso;
  uniform float uTiempo;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float d = length(p);
    float g = exp(-d * d * 9.0) * (0.2 + 0.08 * uPulso) + exp(-d * d * 40.0) * 0.16;
    float w = fract(uTiempo * 0.2);
    float onda = exp(-pow((d - mix(0.3, 0.92, w)) * 34.0, 2.0)) * pow(1.0 - w, 1.6) * 0.16;
    vec3 col = mix(uC, uB, exp(-d * d * 14.0)) * (g + onda);
    gl_FragColor = vec4(col, max(col.r, max(col.g, col.b)));
  }
`;

// ── Utilidades ──────────────────────────────────────────────────────────────
interface ConSchedulerYield {
  scheduler?: { yield?: () => Promise<void> };
}
/** Devuelve el control al navegador entre tramos del montaje (cada tramo < 50 ms). */
const ceder = () => {
  const s = (globalThis as ConSchedulerYield).scheduler;
  return s?.yield ? s.yield() : new Promise<void>((r) => setTimeout(r, 0));
};

const aditivo = (uniforms: Record<string, { value: unknown }>, vertexShader: string, fragmentShader: string) =>
  new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    premultipliedAlpha: true,
  });

// ── Creación ────────────────────────────────────────────────────────────────
/**
 * Crea la escena sobre un lienzo (HTMLCanvasElement u OffscreenCanvas) en tramos cortos.
 * El lienzo debe estar oculto (opacidad 0) hasta que la promesa se resuelva.
 */
export async function crearNucleo(
  lienzo: HTMLCanvasElement | OffscreenCanvas,
  config: ConfigNucleo,
  alPerderContexto?: () => void,
): Promise<Nucleo> {
  const tramos: Record<string, number> = {};
  const medir = <T>(nombre: string, fn: () => T): T => {
    const a = performance.now();
    const r = fn();
    tramos[nombre] = Math.round((performance.now() - a) * 10) / 10;
    return r;
  };
  const { densidad, celular } = config;

  // 1. Contexto WebGL 2. Con renderizado por software falla (salvo pruebas) y se queda el póster.
  const renderer = medir(
    'contexto',
    () =>
      new WebGLRenderer({
        canvas: lienzo,
        alpha: true,
        antialias: config.suavizado,
        premultipliedAlpha: true,
        stencil: false,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: !config.forzar,
      }),
  );
  renderer.setPixelRatio(densidad);
  renderer.setClearColor(0x000000, 0);

  const escena = new Scene();
  const camara = new PerspectiveCamera(FOV, 1, 0.1, 60);
  let destruida = false;

  const alPerder = (e: Event) => {
    e.preventDefault();
    destruir();
    alPerderContexto?.();
  };
  lienzo.addEventListener('webglcontextlost', alPerder);

  function destruir() {
    if (destruida) return;
    destruida = true;
    renderer.setAnimationLoop(null);
    lienzo.removeEventListener('webglcontextlost', alPerder);
    escena.traverse((obj: Object3D) => {
      const o = obj as Object3D & { geometry?: BufferGeometry; material?: Material | Material[] };
      o.geometry?.dispose();
      if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
      else o.material?.dispose();
    });
    escena.clear();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  try {
    await ceder();

    // 2. Escena: geometrías, materiales y uniformes compartidos.
    const comunes = {
      uTiempo: { value: 0 },
      uPulso: { value: 0 },
      uEscala: { value: densidad },
      uDistancia: { value: distanciaCamara(1) },
      uA: { value: LAVANDA },
      uB: { value: VIOLETA },
      uC: { value: INDIGO },
    };

    const { mundo, halo, nucleo, giros } = medir('construccion', () => {
      const mundo = new Group();
      escena.add(mundo);

      // Halo (no se inclina con el puntero: solo acompaña el desplazamiento).
      const halo = new Mesh(
        new PlaneGeometry(7.4, 7.4),
        aditivo({ uB: comunes.uB, uC: comunes.uC, uPulso: comunes.uPulso, uTiempo: comunes.uTiempo }, VERT_PLANO, FRAG_HALO),
      );
      halo.position.z = -1.4;
      halo.renderOrder = 0;
      escena.add(halo);

      // Núcleo de cristal: caras traseras, corazón, caras delanteras y aristas.
      const nucleo = new Group();
      mundo.add(nucleo);
      const geoCristal = new IcosahedronGeometry(1, 1);
      geoCristal.computeVertexNormals(); // geometría sin índice: normales planas, aspecto facetado
      const uCristal = { uA: comunes.uA, uB: comunes.uB, uC: comunes.uC, uPulso: comunes.uPulso };
      const atras = new Mesh(
        geoCristal,
        new ShaderMaterial({
          uniforms: { ...uCristal, uCara: { value: 0 } },
          vertexShader: VERT_SUPERFICIE,
          fragmentShader: FRAG_CRISTAL,
          transparent: true,
          depthWrite: false,
          side: BackSide,
          blending: NormalBlending,
          premultipliedAlpha: true,
        }),
      );
      atras.renderOrder = 1;
      const corazon = new Mesh(
        new SphereGeometry(K.radioCorazon, celular ? 24 : 36, celular ? 16 : 24),
        aditivo({ uB: comunes.uB, uPulso: comunes.uPulso }, VERT_SUPERFICIE, FRAG_CORAZON),
      );
      corazon.renderOrder = 2;
      const frente = new Mesh(
        geoCristal,
        new ShaderMaterial({
          uniforms: { ...uCristal, uCara: { value: 1 } },
          vertexShader: VERT_SUPERFICIE,
          fragmentShader: FRAG_CRISTAL,
          transparent: true,
          depthWrite: false,
          side: FrontSide,
          blending: NormalBlending,
          premultipliedAlpha: true,
        }),
      );
      frente.renderOrder = 3;
      const aristas = new LineSegments(
        new EdgesGeometry(geoCristal, 1),
        aditivo({ uA: comunes.uA, uPulso: comunes.uPulso, uDistancia: comunes.uDistancia }, VERT_LINEA, FRAG_ARISTA),
      );
      aristas.renderOrder = 4;
      nucleo.add(atras, corazon, frente, aristas);

      // Anillos orbitales (el grupo inclina y gira en pantalla; la malla rota en su plano).
      const giros: Mesh[] = [];
      const nodosAnillos = datosNodos();
      ANILLOS.forEach((a, i) => {
        const grupo = new Group();
        grupo.rotation.set(a.inclinacion, 0, a.giro, 'ZXY');
        const anillo = new Mesh(
          new TorusGeometry(a.radio, celular ? 0.009 : 0.0075, 5, celular ? 160 : 240),
          aditivo(
            {
              uA: comunes.uA,
              uB: comunes.uB,
              uTiempo: comunes.uTiempo,
              uDistancia: comunes.uDistancia,
              uVelocidad: { value: a.velocidad },
              uDesfase: { value: a.desfase },
            },
            VERT_ANILLO,
            FRAG_ANILLO,
          ),
        );
        anillo.renderOrder = 5;
        // Nodos fijos sobre el anillo (satélites).
        const { pos, datos } = nodosAnillos[i];
        const geoNodos = new BufferGeometry();
        geoNodos.setAttribute('position', new BufferAttribute(pos, 3));
        geoNodos.setAttribute('aDatos', new BufferAttribute(datos, 2));
        const nodos = new Points(
          geoNodos,
          aditivo(
            { uA: comunes.uA, uTiempo: comunes.uTiempo, uEscala: comunes.uEscala, uDistancia: comunes.uDistancia },
            VERT_POLVO.replace('0.22 + 0.2 * sin', '0.75 + 0.25 * sin'),
            FRAG_POLVO,
          ),
        );
        nodos.renderOrder = 6;
        anillo.add(nodos);
        grupo.add(anillo);
        mundo.add(grupo);
        giros.push(anillo);
      });

      // Búsquedas que llegan (estela + cabeza).
      const cant = CANTIDADES[celular ? 'celular' : 'computador'];
      const N = cant.entrantes;
      const { dir, datos } = datosEntrantes(N);
      const geoCabezas = new BufferGeometry();
      geoCabezas.setAttribute('position', new BufferAttribute(new Float32Array(N * 3), 3));
      geoCabezas.setAttribute('aDir', new BufferAttribute(dir, 3));
      geoCabezas.setAttribute('aDatos', new BufferAttribute(datos, 4));
      const cabezas = new Points(
        geoCabezas,
        aditivo(
          { uA: comunes.uA, uB: comunes.uB, uTiempo: comunes.uTiempo, uEscala: comunes.uEscala, uDistancia: comunes.uDistancia },
          VERT_CABEZA,
          FRAG_PUNTO,
        ),
      );
      cabezas.renderOrder = 7;
      cabezas.frustumCulled = false;

      const dir2 = new Float32Array(N * 6);
      const datos2 = new Float32Array(N * 8);
      const cola = new Float32Array(N * 2);
      for (let k = 0; k < N; k++) {
        for (let j = 0; j < 2; j++) {
          dir2.set(dir.subarray(k * 3, k * 3 + 3), (k * 2 + j) * 3);
          datos2.set(datos.subarray(k * 4, k * 4 + 4), (k * 2 + j) * 4);
          cola[k * 2 + j] = j;
        }
      }
      const geoEstelas = new BufferGeometry();
      geoEstelas.setAttribute('position', new BufferAttribute(new Float32Array(N * 6), 3));
      geoEstelas.setAttribute('aDir', new BufferAttribute(dir2, 3));
      geoEstelas.setAttribute('aDatos', new BufferAttribute(datos2, 4));
      geoEstelas.setAttribute('aCola', new BufferAttribute(cola, 1));
      const estelas = new LineSegments(
        geoEstelas,
        aditivo(
          { uA: comunes.uA, uB: comunes.uB, uTiempo: comunes.uTiempo, uDistancia: comunes.uDistancia },
          VERT_ESTELA,
          FRAG_ESTELA,
        ),
      );
      estelas.renderOrder = 7;
      estelas.frustumCulled = false;

      // Respuestas que salen (burbujas), sobre todo hacia el frente y arriba.
      const M = cant.burbujas;
      const { dir: dirB, datos: datosB } = datosBurbujas(M);
      const geoBurbujas = new BufferGeometry();
      geoBurbujas.setAttribute('position', new BufferAttribute(new Float32Array(M * 3), 3));
      geoBurbujas.setAttribute('aDir', new BufferAttribute(dirB, 3));
      geoBurbujas.setAttribute('aDatos', new BufferAttribute(datosB, 4));
      const burbujas = new Points(
        geoBurbujas,
        aditivo(
          { uA: comunes.uA, uTiempo: comunes.uTiempo, uEscala: comunes.uEscala, uDistancia: comunes.uDistancia },
          VERT_BURBUJA,
          FRAG_BURBUJA,
        ),
      );
      burbujas.renderOrder = 8;
      burbujas.frustumCulled = false;

      // Polvo de fondo.
      const P = cant.polvo;
      const { pos: posP, datos: datosP } = datosPolvo(P);
      const geoPolvo = new BufferGeometry();
      geoPolvo.setAttribute('position', new BufferAttribute(posP, 3));
      geoPolvo.setAttribute('aDatos', new BufferAttribute(datosP, 2));
      const polvo = new Points(
        geoPolvo,
        aditivo(
          { uA: comunes.uA, uTiempo: comunes.uTiempo, uEscala: comunes.uEscala, uDistancia: comunes.uDistancia },
          VERT_POLVO,
          FRAG_POLVO,
        ),
      );
      polvo.renderOrder = 0;

      mundo.add(estelas, cabezas, burbujas, polvo);
      return { mundo, halo, nucleo, giros };
    });

    await ceder();

    // 3. Tamaño y encuadre: ENCUADRE siempre cabe en la dimensión menor (igual que el póster SVG).
    const redimensionar = (ancho: number, alto: number) => {
      ancho = Math.max(1, Math.round(ancho));
      alto = Math.max(1, Math.round(alto));
      const aspecto = ancho / alto;
      const distancia = distanciaCamara(aspecto);
      camara.aspect = aspecto;
      camara.position.set(0, 0, distancia);
      camara.updateProjectionMatrix();
      comunes.uDistancia.value = distancia;
      // Tamaño de puntos proporcional al lienzo (referencia: LADO_REFERENCIA px de lado menor).
      comunes.uEscala.value = densidad * (Math.min(ancho, alto) / LADO_REFERENCIA);
      renderer.setSize(ancho, alto, false);
    };
    medir('ajuste', () => redimensionar(config.ancho, config.alto));

    // 4. Compilación de sombreadores sin bloquear, solo si el navegador compila en paralelo
    //    (KHR_parallel_shader_compile). Si no, el precalentamiento reparte el costo.
    if (renderer.extensions.has('KHR_parallel_shader_compile')) {
      const tc = performance.now();
      await renderer.compileAsync(escena, camara);
      tramos.compilacionAsincrona = Math.round(performance.now() - tc);
      if (destruida) throw new Error('Montaje cancelado');
      await ceder();
    }

    // 5. Precalentamiento: un objeto por tarea para repartir la compilación perezosa del
    //    primer dibujo (el lienzo sigue invisible) y no bloquear el hilo más de 50 ms.
    escena.updateMatrixWorld();
    const esDibujable = (o: Object3D | null) =>
      !!o && ((o as Mesh).isMesh || (o as Points).isPoints || (o as LineSegments).isLineSegments);
    const dibujables: Object3D[] = [];
    escena.traverse((o) => {
      if (esDibujable(o) && !esDibujable(o.parent)) dibujables.push(o);
    });
    let peor = 0;
    for (const o of dibujables) {
      const a = performance.now();
      renderer.render(o, camara);
      peor = Math.max(peor, performance.now() - a);
      await ceder();
      if (destruida) throw new Error('Montaje cancelado');
    }
    tramos.precalentamientoPeor = Math.round(peor * 10) / 10;

    // 6. Animación.
    let tiempo = 0;
    let ultimo = performance.now();
    let px = 0,
      py = 0,
      objX = 0,
      objY = 0,
      s = 0,
      objS = 0;
    let corriendo = false;

    const cuadro = (ahora: number) => {
      // El sello de rAF puede ser anterior a 'ultimo': se limita a [0, 50 ms] (sin saltos tras una pausa).
      const dt = Math.min(Math.max((ahora - ultimo) / 1000, 0), 0.05);
      ultimo = ahora;
      tiempo += dt;
      const k = 1 - Math.exp(-dt * 3);
      px += (objX - px) * k;
      py += (objY - py) * k;
      s += (objS - s) * (1 - Math.exp(-dt * 7));

      // Latido suave: subida rápida, bajada lenta.
      const fase = (tiempo * 0.55) % 1;
      const latido = Math.pow(Math.sin(Math.PI * Math.pow(fase, 0.6)), 2);
      comunes.uTiempo.value = tiempo;
      comunes.uPulso.value = latido;
      nucleo.scale.setScalar(1 + latido * 0.035);
      nucleo.rotation.set(Math.sin(tiempo * 0.21) * 0.22, tiempo * 0.16, 0);

      giros.forEach((g, i) => (g.rotation.z = tiempo * ANILLOS[i].rotacion));

      mundo.rotation.y = px * 0.42 + s * 1.1 + Math.sin(tiempo * 0.13) * 0.1;
      mundo.rotation.x = py * 0.26 + s * 0.4;
      mundo.position.y = -s * 0.9;
      halo.position.y = mundo.position.y;

      renderer.render(escena, camara);
    };

    // Primer cuadro con el mismo encuadre que el póster.
    medir('primerCuadro', () => cuadro(performance.now()));

    return {
      tramos,
      llamadasDibujo: renderer.info.render.calls,
      redimensionar: (ancho, alto) => {
        if (destruida) return;
        redimensionar(ancho, alto);
        if (!corriendo) cuadro(performance.now());
      },
      puntero: (x, y) => {
        objX = x;
        objY = y;
      },
      desplazamiento: (valor) => {
        objS = valor;
      },
      activar: (si) => {
        if (destruida || si === corriendo) return;
        corriendo = si;
        ultimo = performance.now();
        renderer.setAnimationLoop(si ? cuadro : null);
      },
      destruir,
    };
  } catch (error) {
    destruir();
    throw error;
  }
}
