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
// ─────────────────────────────────────────────────────────────────────────────
import { CTA_PRINCIPAL, FUNDADOR, enlaceWhatsApp } from '@/data/sitio';
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
      'Respuestas claras a las preguntas que nos hacen los dueños de empresas antes de contratar: cuánto cuesta, qué funciona y qué no se puede prometer. Cada guía cita sus fuentes y lleva fecha de actualización.',
    ctaPrincipal: { texto: 'Ver las guías', href: '#guias' },
    ctaSecundario: CTA_PRINCIPAL,
  },
  respuestaDirecta: `En Recursos, VRS Digital publica guías prácticas para dueños de empresas de servicios en Colombia: cuánto cuesta una página web en Bogotá, qué se paga aparte y cómo comparar cotizaciones. Cada guía lleva la firma de ${FUNDADOR.nombreCorto}, cita fuentes oficiales o públicas y se revisa cuando cambian los datos.`,
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
            'Los precios que publican las agencias de Bogotá, por qué varían tanto, los costos que se pagan aparte y una lista para comparar cotizaciones.',
          icono: icono('calculator'),
          actualizado: '2026-10-18',
        },
      ],
    },
    {
      id: 'en-preparacion',
      etiqueta: 'En preparación',
      titulo: 'Temas que estamos preparando',
      introduccion:
        'Publicamos una guía cuando cada dato está verificado, por eso no anunciamos fechas. Estos son los próximos temas:',
      tipo: 'lista',
      items: [
        'Cómo preparar su web para Google y los asistentes de IA, según la documentación oficial de Google.',
        'Errores que hacen perder consultas por WhatsApp.',
      ],
    },
    {
      id: 'como-las-hacemos',
      etiqueta: 'Cómo las hacemos',
      titulo: 'Quién escribe estas guías y cómo se hacen',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Quién',
          texto: `Las firma ${FUNDADOR.nombreCorto}, fundador de VRS Digital y responsable de cada proyecto. Cada guía muestra la fecha de publicación y de actualización.`,
          icono: icono('users'),
        },
        {
          titulo: 'Cómo',
          texto:
            'La investigación y la redacción se hacen con apoyo de inteligencia artificial. Cada dato se verifica contra su fuente antes de publicar, y las fuentes van enlazadas.',
          icono: icono('search'),
        },
        {
          titulo: 'Por qué',
          texto:
            'Para que usted decida con información clara antes de contratar, con nosotros o con otro proveedor. No reemplazan la asesoría legal, contable o tributaria.',
          icono: icono('eye'),
        },
      ],
      nota: 'Somos parte interesada: vendemos páginas web y atención inteligente en WhatsApp. Por eso separamos nuestros precios de los datos de terceros y enlazamos cada fuente.',
    },
    {
      id: 'servicios',
      etiqueta: 'Servicios',
      titulo: 'Si prefiere que lo hagamos por usted',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Páginas web profesionales',
          texto: 'Una web clara, rápida y adaptada a celular que explica sus servicios y facilita el contacto.',
          icono: icono('monitor'),
          href: '/paginas-web-bogota/',
        },
        {
          titulo: 'Posicionamiento en Google y asistentes de IA',
          texto: 'Estructura y contenido para que Google y los asistentes de IA entiendan qué hace su empresa.',
          icono: icono('search'),
          href: '/posicionamiento-google-inteligencia-artificial/',
        },
        {
          titulo: 'Atención inteligente en WhatsApp Business',
          texto: 'Su WhatsApp Business responde a sus clientes a cualquier hora y le pasa a usted los casos que necesitan una persona.',
          icono: icono('message'),
          href: '/asistente-whatsapp-business/',
        },
      ],
    },
  ],
  preguntas: [
    {
      pregunta: '¿Quién escribe las guías de VRS Digital?',
      respuesta: `Las firma ${FUNDADOR.nombreCorto}, fundador de VRS Digital y responsable de cada proyecto. Él decide los temas, revisa cada dato contra su fuente y aprueba el texto final. Cada guía muestra su fecha de publicación y de última actualización, y enlaza las fuentes oficiales o públicas que usa.`,
    },
    {
      pregunta: '¿Cada cuánto se actualizan las guías?',
      respuesta:
        'Las revisamos cada trimestre y cuando cambia un dato importante, como los precios del mercado o las condiciones de WhatsApp Business. Cada guía muestra la fecha de su última actualización. Si encuentra un dato desactualizado, escríbanos por WhatsApp o por correo y lo revisamos.',
    },
    {
      pregunta: '¿Las guías reemplazan la asesoría de un profesional?',
      respuesta:
        'No. Son guías informativas para que usted entienda opciones, costos y límites antes de decidir. Cuando un tema toca impuestos, contratos, datos personales o salud, la decisión debe tomarla con un profesional calificado. Las guías enlazan las fuentes oficiales para que pueda verificar cada dato.',
    },
    {
      pregunta: '¿Puedo sugerir un tema para una guía?',
      respuesta:
        'Sí. Si tiene una pregunta sobre páginas web, posicionamiento en Google o atención por WhatsApp que no encuentra respondida, escríbanos por WhatsApp o por correo. Priorizamos los temas que nos preguntan los dueños de empresas de servicios y que podemos responder con fuentes verificables.',
    },
  ],
  cta: {
    titulo: '¿Tiene una pregunta sobre su caso?',
    texto:
      'Solicite una revisión digital. Revisamos su web, su visibilidad en Google y su atención por WhatsApp, y le entregamos tres prioridades concretas.',
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
  actualizado: '2026-10-11',
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
