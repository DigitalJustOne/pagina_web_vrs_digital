// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /posicionamiento-google-inteligencia-artificial/.
//  Nombre del servicio en el menú: «Aparecer en Google y en asistentes de IA» (SERVICIOS de sitio.ts).
//  Palabra clave principal: «posicionamiento en Google y asistentes de IA» (aparece una vez, en la
//  pregunta «¿Qué es el SEO?», junto con las siglas SEO, AEO y GEO explicadas).
//  SEO e IA van en una sola URL (no separar en dos páginas: misma intención).
//
//  CLARIDAD (2026-10-19, GUIA-CLARIDAD.md): texto reescrito en palabras simples. Se quitaron las
//  secciones de siglas, citas de Google, «lo que no hacemos» largo y proceso (repetían lo mismo o
//  explicaban cómo se hace el trabajo). Lo que incluye sale de PLANES (plan Web Visible).
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Si este trabajo se vende solo (para una web que ya existe). Hoy la página dice que está
//    incluido en el plan Web Visible y no ofrece un servicio aparte.
//  - Cuántas horas o mejoras cubre la revisión de cada mes.
//  - La ficha de Google Maps de la propia VRS Digital: Google exige atender clientes en persona;
//    si VRS opera 100 % remoto, crearla puede terminar en suspensión.
// ─────────────────────────────────────────────────────────────────────────────
import { CTA_PRINCIPAL, PLANES, enlaceWhatsApp, formatoCOP, type IdPlan, cuotaMensual } from '@/data/sitio';
import type { ModuloPagina } from './tipos';

const plan = (id: IdPlan) => PLANES.find((p) => p.id === id)!;
const desde = (id: IdPlan) => formatoCOP(plan(id).precioAnualDesde);
const cuotaDesde = (id: IdPlan) => formatoCOP(cuotaMensual(plan(id).precioAnualDesde));

const esencial = plan('esencial');
const visible = plan('visible');

const URL_FUNCIONES_IA = 'https://developers.google.com/search/docs/appearance/ai-features';

const MENSAJE_WHATSAPP = 'Hola, quiero saber cómo aparece mi empresa en Google y en los asistentes de IA.';

/** Búsqueda de ejemplo (empresa contable inventada): la usan el paso 01 de #como-se-arma y la ilustración. */
const CONSULTA_EJEMPLO = '«contador para independientes en Bogotá»';

/**
 * Textos de la ilustración «cómo se arma una respuesta» (portada y sección #como-se-arma).
 * Es un ejemplo: las fuentes son tipos de página, no sitios reales.
 */
export const esquemaRespuesta = {
  etiqueta:
    'Ilustración de ejemplo: alguien busca un contador en Bogotá. Google o un asistente de IA lee tres páginas de una web y responde con enlaces a ellas.',
  rotuloPregunta: 'Pregunta de ejemplo',
  consulta: CONSULTA_EJEMPLO,
  rotuloLectura: 'Páginas que puede leer',
  fuentes: ['Página de un servicio', 'Preguntas frecuentes', 'Una guía'],
  rotuloRespuesta: 'Respuesta con IA',
  rotuloFuentes: 'Fuentes',
} as const;

export const contenido = {
  ruta: '/posicionamiento-google-inteligencia-artificial/',
  seo: {
    // 40 caracteres + « | VRS Digital» (Seo.astro) = 54.
    titulo: 'Aparecer en Google y en asistentes de IA',
    descripcion:
      'Preparamos su web para que Google y asistentes como ChatGPT o Gemini entiendan su empresa. Cada mes revisamos cómo aparece. Sin promesas de primer lugar.',
    palabraClave: 'posicionamiento en Google y asistentes de IA',
    secundarias: [
      'aparecer en Google',
      'posicionamiento web Bogotá',
      'SEO para empresas de servicios',
      'aparecer en ChatGPT',
      'posicionamiento en asistentes de IA',
    ],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Aparecer en Google y en asistentes de IA', ruta: '/posicionamiento-google-inteligencia-artificial/' },
  ],
  hero: {
    etiqueta: 'Google y asistentes de IA',
    titulo: 'Aparecer en Google y en asistentes de IA',
    subtitulo:
      'Preparamos su web para que Google y asistentes como ChatGPT o Gemini entiendan qué hace su empresa y dónde. Cada mes revisamos cómo aparece.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: `Ver el plan ${visible.nombre}`, href: '/precios/#plan-visible' },
    precio: `Plan ${visible.nombre} desde ${desde('visible')}`,
    puntos: ['Una página para cada servicio', 'Revisión cada mes', 'Sin reseñas compradas'],
  },
  respuestaDirecta: `Hacemos que su web sea fácil de entender para Google y para asistentes como ChatGPT o Gemini. Así pueden mostrar su empresa cuando alguien busca lo que usted ofrece. Viene en el plan ${visible.nombre}. No prometemos el primer lugar en Google: nadie lo puede garantizar.`,
  secciones: [
    {
      id: 'como-se-arma',
      etiqueta: 'Cómo funciona',
      titulo: 'Cómo se arma una respuesta en Google o en ChatGPT',
      introduccion: 'En pocas palabras. La búsqueda y la empresa son un ejemplo inventado.',
      tipo: 'pasos',
      items: [
        {
          paso: '01',
          titulo: 'La pregunta',
          texto: `Una persona escribe lo que necesita. Por ejemplo: ${CONSULTA_EJEMPLO}.`,
        },
        {
          paso: '02',
          titulo: 'La búsqueda',
          texto: 'Google o el asistente busca entre las páginas que ya conoce. A veces hace varias búsquedas para una sola respuesta.',
        },
        {
          paso: '03',
          titulo: 'La lectura',
          texto: 'Lee las páginas que puede abrir. Si no encuentra su web, no la puede mostrar.',
        },
        {
          paso: '04',
          titulo: 'La respuesta',
          texto: 'Resume lo que encontró y pone enlaces a algunas páginas. Cuáles salen lo decide Google o el asistente.',
        },
      ],
      enlace: { texto: 'Ver cómo lo explica Google (en inglés)', href: URL_FUNCIONES_IA },
    },
    {
      id: 'que-hacemos',
      etiqueta: 'Qué hacemos',
      titulo: 'Qué hacemos para que su empresa salga en Google',
      introduccion: `Todo esto viene en el plan ${visible.nombre}:`,
      tipo: 'lista',
      variante: 'incluye',
      items: visible.incluye,
    },
    {
      id: 'como-medimos',
      etiqueta: 'Cada mes',
      titulo: 'Qué recibe cada mes',
      introduccion: 'Cada mes revisamos con usted cómo aparece su web en Google:',
      tipo: 'lista',
      variante: 'incluye',
      items: [
        'Qué búsquedas le traen visitas.',
        'Qué páginas conviene mejorar.',
        'Qué preguntas nuevas hacen sus clientes.',
      ],
    },
    {
      id: 'que-no-garantizamos',
      etiqueta: 'Lo que no prometemos',
      titulo: 'Lo que no prometemos (y nadie puede)',
      introduccion: 'Google y los asistentes deciden qué mostrar, y lo cambian seguido. Por eso no prometemos:',
      tipo: 'lista',
      variante: 'alerta',
      items: [
        'El primer lugar en Google ni un puesto fijo.',
        'Que ChatGPT, Gemini u otro asistente recomiende su empresa.',
        'Resultados en una fecha fija.',
        'Un número de visitas, llamadas o clientes.',
      ],
    },
    {
      id: 'que-no-hacemos',
      etiqueta: 'Lo que no hacemos',
      titulo: 'Lo que no hacemos',
      tipo: 'lista',
      variante: 'excluye',
      items: [
        'Comprar reseñas, menciones ni enlaces.',
        'Inventar reseñas, testimonios o cifras.',
        'Esconder texto para engañar a Google o a los asistentes.',
      ],
    },
    {
      id: 'perfil-google',
      etiqueta: 'Google Maps',
      titulo: '¿Su empresa puede tener ficha en Google Maps?',
      tipo: 'texto',
      parrafos: [
        'La ficha de empresa es lo que sale en Google Maps cuando alguien busca, por ejemplo, «contador cerca de mí».',
        'Google solo la permite si usted atiende clientes en un local o va adonde ellos están. No acepta oficinas virtuales.',
        'Antes de crearla o mejorarla, revisamos que su empresa cumpla esas reglas. Así evita que Google la suspenda.',
      ],
    },
    {
      id: 'precio',
      etiqueta: 'Precio',
      titulo: 'Cuánto cuesta',
      introduccion: `Viene en el plan ${visible.nombre}: desde ${desde('visible')} al año, o 12 cuotas de ${cuotaDesde('visible')} al mes, IVA incluido. El plan ${esencial.nombre} solo deja su web lista para que Google la pueda mostrar, sin revisión cada mes.`,
      tipo: 'planes',
      compacto: true,
      recomendado: 'visible',
      enlace: { texto: 'Ver qué incluye cada plan', href: '/precios/' },
    },
  ],
  preguntas: [
    {
      pregunta: '¿Qué es el SEO?',
      respuesta:
        'Es el posicionamiento en Google y asistentes de IA: que su web aparezca cuando alguien busca lo que usted ofrece. SEO, AEO y GEO son siglas en inglés para ese mismo trabajo. Usted no necesita aprenderlas.',
    },
    {
      pregunta: '¿Pueden garantizar el primer lugar en Google?',
      respuesta:
        'No. Nadie puede. Google y los asistentes deciden qué mostrar. Nosotros dejamos su web clara y fácil de leer. Desconfíe de quien le prometa el primer lugar.',
    },
    {
      pregunta: '¿Cuándo se ven los resultados?',
      respuesta:
        'No damos una fecha. Depende de su sector, de su competencia y de cómo está su web hoy. Primero Google debe encontrar las páginas nuevas. Después, cada mes revisamos cómo avanzan.',
    },
    {
      pregunta: '¿Se puede pagar para salir en ChatGPT o en Google?',
      respuesta:
        'En los resultados normales de Google, no. Los anuncios pagos son otra cosa y no están en nuestros planes. Si alguien le vende menciones seguras en ChatGPT, desconfíe.',
    },
  ],
  cta: {
    titulo: '¿Cómo ve Google hoy a su empresa?',
    texto:
      'Pida una revisión gratuita. Miramos su web, cómo aparece en Google y su WhatsApp. Le decimos las tres cosas que conviene mejorar primero.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Páginas web profesionales', href: '/paginas-web-bogota/' },
    { texto: 'Atención inteligente en WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Precios de todos los planes', href: '/precios/' },
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
  ],
  fuentes: [
    { titulo: 'AI features and your website (Google Search Central)', url: URL_FUNCIONES_IA, idioma: 'en' },
    {
      titulo: 'Creating helpful, reliable, people-first content (Google Search Central)',
      url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      idioma: 'en',
    },
    {
      titulo: 'Directrices para representar tu empresa en Google (Ayuda de Perfil de Empresa de Google)',
      url: 'https://support.google.com/business/answer/3038177?hl=es',
    },
  ],
  /** Datos para servicio() de @/lib/schema. El precio sale de sitio.ts. */
  servicio: {
    nombre: 'Aparecer en Google y en asistentes de IA',
    tipo: 'Optimización para buscadores (SEO)',
    descripcion:
      'Preparamos la web de su empresa para que Google y asistentes de IA entiendan qué hace y dónde. Revisión cada mes. Sin garantía de posiciones.',
    precioDesde: visible.precioAnualDesde,
    audiencia: 'Empresas de servicios',
  },
  actualizado: '2026-10-19',
} as const satisfies ModuloPagina;
