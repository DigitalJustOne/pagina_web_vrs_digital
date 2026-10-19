// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /recursos/ (centro de guías).
//  Palabra clave principal: «guías de páginas web, Google y WhatsApp para empresas».
//  Fuentes: informe del Director (2026-10-05: «Contenido citable», temas recomendados) y
//  guía de Google sobre contenido útil (marco «Quién, Cómo y Por qué»).
//
//  Las guías viven en src/content/recursos/<slug>.md. La lista `guias` de abajo repite el
//  slug, el título y el resumen de cada una para que la página funcione sin leer la colección;
//  si la plantilla lee la colección, use el slug como clave y tome el resto del frontmatter.
//  Al publicar una guía nueva, agréguela aquí y quítela de `en-preparacion`.
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Confirmar los temas de la sección «en preparación». No llevan fecha a propósito: una
//    guía se publica cuando está verificada.
//  2026-10-19 (claridad): textos simples. Se quitó la sección «como-las-hacemos» (explicaba cómo
//  se hacen las guías y repetía la pregunta «¿Quién escribe…?»). Las tarjetas de «servicios»
//  salen de SERVICIOS (sitio.ts).
// ─────────────────────────────────────────────────────────────────────────────
import { CTA_PRINCIPAL, FUNDADOR, SERVICIOS, enlaceWhatsApp } from '@/data/sitio';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;

const MENSAJE_WHATSAPP = 'Hola, leí una guía de VRS Digital y tengo una pregunta sobre mi empresa.';

export const contenido = {
  ruta: '/recursos/',
  seo: {
    // 37 caracteres + « | VRS Digital» (Seo.astro) = 51.
    titulo: 'Guías sobre páginas web para empresas',
    descripcion:
      'Guías claras para empresas de servicios: cuánto cuesta una página web en Bogotá, qué se paga aparte y cómo comparar cotizaciones. Con fuentes.',
    palabraClave: 'guías de páginas web, Google y WhatsApp para empresas',
    // Las búsquedas de cada tema las atiende su guía; esta página solo agrupa.
    secundarias: ['guías para empresas de servicios', 'recursos sobre páginas web y WhatsApp Business'],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Recursos', ruta: '/recursos/' },
  ],
  hero: {
    etiqueta: 'Recursos',
    titulo: 'Guías sobre páginas web, Google y WhatsApp para empresas de servicios',
    subtitulo:
      'Respuestas claras a lo que preguntan los dueños de empresas antes de contratar. Cada guía enlaza sus fuentes y muestra su fecha.',
    ctaPrincipal: { texto: 'Ver las guías', href: '#guias' },
    ctaSecundario: CTA_PRINCIPAL,
  },
  respuestaDirecta: `Hoy hay una guía publicada: cuánto cuesta una página web en Bogotá, qué se paga aparte y cómo comparar cotizaciones. La firma ${FUNDADOR.nombreCorto}.`,
  secciones: [
    {
      id: 'guias',
      etiqueta: 'Guías publicadas',
      titulo: 'Guías publicadas',
      tipo: 'guias',
      items: [
        {
          slug: 'cuanto-cuesta-una-pagina-web-en-bogota',
          href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/',
          etiqueta: 'Precios',
          titulo: '¿Cuánto cuesta una página web para empresa en Bogotá en 2026?',
          resumen:
            'Cuánto cobran las agencias de Bogotá, por qué los precios cambian tanto, qué se paga aparte y una lista para comparar cotizaciones.',
          icono: icono('calculator'),
          actualizado: '2026-10-18',
        },
      ],
    },
    {
      id: 'en-preparacion',
      etiqueta: 'En preparación',
      titulo: 'Temas que estamos preparando',
      introduccion: 'Publicamos una guía cuando cada dato está revisado. Por eso no damos fechas.',
      tipo: 'lista',
      items: [
        'Cómo preparar su web para salir en Google y en asistentes como ChatGPT.',
        'Errores que hacen perder clientes por WhatsApp.',
      ],
    },
    {
      id: 'servicios',
      etiqueta: 'Servicios',
      titulo: 'Si prefiere que lo hagamos por usted',
      tipo: 'tarjetas',
      columnas: 3,
      items: SERVICIOS.map((s) => ({
        titulo: s.nombre,
        texto: s.resumen,
        icono: icono(s.icono),
        href: `/${s.slug}/`,
      })),
    },
  ],
  preguntas: [
    {
      pregunta: '¿Quién escribe las guías de VRS Digital?',
      respuesta: `Las firma ${FUNDADOR.nombreCorto}, fundador de VRS Digital. Cada dato se revisa contra su fuente, y las fuentes van enlazadas. Como vendemos páginas web, separamos nuestros precios de los datos de otras empresas.`,
    },
    {
      pregunta: '¿Cada cuánto se actualizan las guías?',
      respuesta:
        'Las revisamos cada tres meses y cuando cambia un dato importante, como los precios. Si ve un dato viejo, escríbanos y lo revisamos.',
    },
    {
      pregunta: '¿Las guías reemplazan la asesoría de un profesional?',
      respuesta:
        'No. Sirven para entender opciones, costos y límites. Si su caso tiene que ver con impuestos, contratos o datos personales, consulte a un profesional.',
    },
    {
      pregunta: '¿Puedo sugerir un tema para una guía?',
      respuesta: 'Sí. Escríbanos su pregunta por WhatsApp o por correo.',
    },
  ],
  cta: {
    titulo: '¿Tiene una pregunta sobre su caso?',
    texto: 'Revisamos gratis su web, cómo aparece en Google y su WhatsApp. Le entregamos tres mejoras concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
    { texto: 'Precios, condiciones y formas de pago', href: '/precios/' },
    { texto: 'Quién está detrás de VRS Digital', href: '/nosotros/' },
  ],
  fuentes: [
    {
      titulo: 'Creating helpful, reliable, people-first content (Google Search Central)',
      url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      idioma: 'en',
    },
  ],
  actualizado: '2026-10-19',
} as const satisfies ModuloPagina;

// ── Página de cada guía (/recursos/<slug>/) ─────────────────────────────────
// El texto de cada guía vive en src/content/recursos/<slug>.md. Aquí van solo los rótulos de la
// página que la envuelve y los enlaces a servicios relacionados.

/** Rótulos de la portada, la ficha, el índice y el recuadro del autor de cada guía. */
export const textosGuia = {
  etiqueta: 'Guía',
  ficha: 'Ficha de la guía',
  publicada: 'Publicada',
  actualizada: 'Actualizada',
  lectura: 'Lectura',
  minutos: (n: number) => `${n} min`,
  fuentes: 'Fuentes enlazadas',
  preguntas: 'Preguntas respondidas',
  indice: 'Contenido de la guía',
  autorEtiqueta: 'Quién la escribe',
  autorTitulo: 'Sobre el autor',
  autorEnlace: { texto: 'Conozca cómo trabaja Víctor', href: '/nosotros/' },
  preguntasEtiqueta: 'Dudas comunes',
  preguntasTitulo: 'Preguntas frecuentes',
  todasLasGuias: { texto: 'Todas las guías de Recursos', href: '/recursos/' },
  // Tarjetas de /recursos/
  queEncontrara: 'Qué encontrará',
  masTemas: (n: number) => (n === 1 ? 'y 1 tema más' : `y ${n} temas más`),
  leer: 'Leer la guía',
} as const;

/**
 * Servicios relacionados con cada guía: ids de los ítems de la sección «servicios» de este módulo
 * (por href), en el orden en que se muestran. Una guía que no esté aquí muestra los tres.
 */
export const serviciosPorGuia: Readonly<Record<string, readonly string[]>> = {
  'cuanto-cuesta-una-pagina-web-en-bogota': [
    '/paginas-web-bogota/',
    '/posicionamiento-google-inteligencia-artificial/',
    '/asistente-whatsapp-business/',
  ],
};
