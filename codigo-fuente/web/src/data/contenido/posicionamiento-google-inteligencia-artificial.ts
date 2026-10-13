// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /posicionamiento-google-inteligencia-artificial/.
//  Palabra clave principal: «posicionamiento en Google y asistentes de IA».
//  SEO e IA van en una sola URL (no separar en dos páginas: misma intención).
//  Fuentes: informe del Director (2026-10-05: «SEO, AEO y GEO», plan Web Visible) y
//  documentación oficial de Google, Bing y OpenAI verificada el 2026-10-06 (al final).
//  Las citas de Google son textuales en inglés (campo `original`) con traducción propia.
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Si el posicionamiento se vende solo (para una web que ya existe). Hoy la página dice
//    que está incluido desde el plan Web Visible y no ofrece un servicio aparte.
//  - Cuántas horas o mejoras cubre el seguimiento mensual de cada plan.
//  - El Perfil de Empresa en Google de la propia VRS Digital: Google exige atender clientes
//    en persona; si VRS opera 100 % remoto, crearlo puede terminar en suspensión.
//  EDICIÓN FINAL (2026-10-06): título acortado a 58 caracteres con la marca. Esta página es la
//  única que responde «¿Qué es el SEO, el AEO y el GEO?» y «¿Pueden garantizar el primer lugar…?».
//  DISEÑO DE PÁGINA (2026-10-06, grupo servicios): nueva sección #como-se-arma (pasos «La
//  pregunta → La búsqueda → La lectura → La respuesta», según la documentación de Google y
//  OpenAI ya citada) y export `esquemaRespuesta` con los rótulos del esquema de la portada.
//  #precio marca Web Visible como recomendado. TEXTO NUEVO: lo debe revisar la Dirección.
// ─────────────────────────────────────────────────────────────────────────────
import { CTA_PRINCIPAL, PLANES, enlaceWhatsApp, formatoCOP, type IdPlan, cuotaMensual } from '@/data/sitio';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;
const plan = (id: IdPlan) => PLANES.find((p) => p.id === id)!;
const desde = (id: IdPlan) => formatoCOP(plan(id).precioAnualDesde);
const cuotaDesde = (id: IdPlan) => formatoCOP(cuotaMensual(plan(id).precioAnualDesde));

const esencial = plan('esencial');
const visible = plan('visible');

const URL_GUIA_IA = 'https://developers.google.com/search/docs/fundamentals/ai-optimization-guide';
const URL_FUNCIONES_IA = 'https://developers.google.com/search/docs/appearance/ai-features';
const URL_ACTUALIZACIONES = 'https://developers.google.com/search/updates';

const MENSAJE_WHATSAPP = 'Hola, quiero saber cómo aparece mi empresa en Google y en los asistentes de IA.';

/** Búsqueda de ejemplo: la usan el paso 01 de «Cómo se arma una respuesta» y la ilustración. */
const CONSULTA_EJEMPLO = '«contador para independientes en Bogotá»';

/**
 * Textos de la ilustración «cómo se arma una respuesta» (portada y sección #como-se-arma).
 * Es un esquema: las fuentes son tipos de página que preparamos (ver «Qué hacemos»), no sitios reales.
 */
export const esquemaRespuesta = {
  etiqueta:
    'Ilustración: una pregunta llega a Google o a un asistente de IA, que lee páginas de una web (la página de un servicio, sus preguntas frecuentes y una guía) y arma una respuesta con enlaces a esas fuentes.',
  rotuloPregunta: 'Pregunta',
  consulta: CONSULTA_EJEMPLO,
  rotuloLectura: 'Páginas que puede leer',
  fuentes: ['Página de servicio', 'Preguntas frecuentes', 'Guía con autor y fecha'],
  rotuloRespuesta: 'Respuesta con IA',
  rotuloFuentes: 'Fuentes',
} as const;

export const contenido = {
  ruta: '/posicionamiento-google-inteligencia-artificial/',
  seo: {
    // 44 caracteres + « | VRS Digital» (Seo.astro) = 58.
    titulo: 'Posicionamiento en Google y asistentes de IA',
    descripcion:
      'Posicionamiento web en Bogotá: preparamos su web para que Google y los asistentes de IA entiendan su empresa, con una página por servicio y datos ordenados.',
    palabraClave: 'posicionamiento en Google y asistentes de IA',
    secundarias: [
      'posicionamiento web Bogotá',
      'SEO local Bogotá',
      'SEO para empresas de servicios',
      'aparecer en respuestas de inteligencia artificial',
      'SEO para inteligencia artificial',
      'posicionamiento en asistentes de IA',
    ],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Posicionamiento en Google y asistentes de IA', ruta: '/posicionamiento-google-inteligencia-artificial/' },
  ],
  hero: {
    etiqueta: 'SEO, AEO y GEO en palabras sencillas',
    titulo: 'Posicionamiento en Google y asistentes de IA para empresas de servicios',
    subtitulo:
      'Para empresas de servicios en Bogotá y el resto de Colombia: organizamos su web para que Google y asistentes como ChatGPT, Gemini o Copilot entiendan qué hace su empresa, para quién y dónde. Sin promesas de primer lugar: con trabajo que se puede revisar mes a mes.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver el plan Web Visible', href: '/precios/#plan-visible' },
    precio: `Plan ${visible.nombre} desde ${desde('visible')}`,
    puntos: ['Basado en la documentación oficial de Google', 'Una página por cada servicio', 'Sin compra de enlaces ni reseñas'],
  },
  respuestaDirecta:
    'Preparamos su web para que Google y los asistentes de inteligencia artificial (IA), como ChatGPT, Gemini o Copilot, entiendan qué hace su empresa, para quién y dónde. Según Google, aparecer en sus resúmenes con IA no exige archivos ni códigos especiales: exige una web que Google pueda leer, clara y útil. Nadie puede garantizar posiciones ni menciones.',
  secciones: [
    {
      id: 'siglas',
      etiqueta: 'En palabras sencillas',
      titulo: 'SEO, AEO y GEO: qué significa cada sigla',
      introduccion:
        'Son tres nombres para un mismo objetivo: que su empresa se entienda bien en internet. Usted no necesita dominarlos. Aquí van en una frase cada uno:',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          antetitulo: 'SEO',
          titulo: 'Optimización para buscadores',
          texto: 'Que Google pueda encontrar, leer y entender su web, y la muestre cuando alguien busca lo que usted ofrece.',
          icono: icono('search'),
        },
        {
          antetitulo: 'AEO',
          titulo: 'Optimización para motores de respuesta',
          texto:
            'Escribir respuestas claras y directas a las preguntas reales de sus clientes, para que un buscador o un asistente las pueda tomar tal cual.',
          icono: icono('message'),
        },
        {
          antetitulo: 'GEO',
          titulo: 'Optimización para buscadores generativos',
          texto:
            'Que la información de su empresa sea clara, coherente y confiable, para que asistentes como ChatGPT, Gemini o Copilot puedan entenderla y citarla.',
          icono: icono('spark'),
        },
      ],
      nota: 'Google lo resume así: optimizar para la búsqueda con IA sigue siendo SEO. Por eso no vendemos tres servicios distintos, sino un solo trabajo bien hecho.',
    },
    {
      // Fuentes: «AI features and your website» (búsquedas relacionadas o «query fan-out», y requisito
      // de estar indexada con fragmento) y «Overview of OpenAI Crawlers» (OAI-SearchBot), ambas al final.
      id: 'como-se-arma',
      etiqueta: 'Cómo funciona',
      titulo: 'Cómo se arma una respuesta en Google o en un asistente de IA',
      introduccion:
        'Una explicación simplificada de lo que pasa cuando Google o un asistente de IA buscan en internet para responder. Los detalles cambian según el sistema.',
      tipo: 'pasos',
      items: [
        {
          paso: '01',
          titulo: 'La pregunta',
          texto: `Una persona escribe o dice lo que necesita, con sus propias palabras. Por ejemplo: ${CONSULTA_EJEMPLO}.`,
        },
        {
          paso: '02',
          titulo: 'La búsqueda',
          texto:
            'El buscador o el asistente busca entre las páginas que ya conoce. Según Google, sus funciones con IA pueden hacer varias búsquedas relacionadas para armar una sola respuesta.',
        },
        {
          paso: '03',
          titulo: 'La lectura',
          texto:
            'Lee las páginas que puede abrir. Google exige que estén indexadas y puedan mostrarse con un fragmento de texto; OpenAI recomienda permitir su rastreador para aparecer en las búsquedas de ChatGPT.',
        },
        {
          paso: '04',
          titulo: 'La respuesta',
          texto:
            'Resume lo que encontró y enlaza algunas de las páginas que usó. Cuáles aparecen lo deciden sus propios sistemas, y eso cambia con frecuencia.',
        },
      ],
      enlace: { texto: 'Ver cómo lo explica Google (en inglés)', href: URL_FUNCIONES_IA },
    },
    {
      id: 'que-dice-google',
      etiqueta: 'Fuentes oficiales',
      titulo: 'Qué dice Google sobre la inteligencia artificial en la búsqueda',
      introduccion:
        'Hay quien vende fórmulas secretas para aparecer en la IA. Nosotros preferimos citar lo que Google publica en su documentación oficial. Traducción nuestra; el texto original está en el enlace.',
      tipo: 'citas',
      items: [
        {
          texto:
            'Optimizar para la búsqueda con IA generativa es optimizar para la experiencia de búsqueda y, por lo tanto, sigue siendo SEO.',
          original: 'optimizing for generative AI search is optimizing for the search experience, and thus still SEO',
          fuente: 'Google Search Central, guía de optimización para funciones de IA generativa (actualizada el 10 de julio de 2026)',
          url: URL_GUIA_IA,
        },
        {
          texto:
            'No hay requisitos adicionales para aparecer en AI Overviews (resúmenes con IA) o en AI Mode (Modo IA), ni se necesitan otras optimizaciones especiales.',
          original: 'There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary',
          fuente: 'Google Search Central, «AI features and your website» (actualizada el 10 de diciembre de 2025)',
          fuenteEn: 'AI features and your website',
          url: URL_FUNCIONES_IA,
        },
        {
          texto:
            'Los datos estructurados no son un requisito para la búsqueda con IA generativa, y no hay un marcado especial de schema.org que deba agregar.',
          original: "Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add",
          fuente: 'Google Search Central, guía de optimización para funciones de IA generativa (actualizada el 10 de julio de 2026)',
          url: URL_GUIA_IA,
        },
        {
          texto: 'Los archivos llms.txt no son necesarios para la Búsqueda de Google y no afectarán su visibilidad, ni para bien ni para mal.',
          original: "aren't needed for Google Search (and won't negatively or positively impact your visibility)",
          fuente: 'Google Search Central, registro de cambios de la documentación (15 de junio de 2026)',
          url: URL_ACTUALIZACIONES,
        },
      ],
      parrafos: [
        'Para aparecer en esas funciones, Google pide lo básico: que la página esté indexada y pueda mostrarse con un fragmento de texto en los resultados. Lo demás es contenido útil, escrito para personas.',
      ],
    },
    {
      id: 'que-hacemos',
      etiqueta: 'Qué hacemos',
      titulo: 'Qué hacemos para que Google y la IA entiendan su empresa',
      tipo: 'tarjetas',
      columnas: 2,
      items: [
        {
          titulo: 'Investigamos qué buscan sus clientes',
          texto: 'Identificamos las preguntas y búsquedas reales de su sector antes de escribir una sola página.',
          icono: icono('search'),
        },
        {
          titulo: 'Una página por servicio',
          texto: 'Cada servicio tiene su propia página, con un tema claro. Así Google y los asistentes saben qué ofrece y a quién.',
          icono: icono('file'),
        },
        {
          titulo: 'Respuestas directas y preguntas frecuentes',
          texto:
            'Al inicio de cada página va una respuesta corta con lo esencial: qué es, para quién, dónde y desde cuánto. Debajo, las preguntas reales de sus clientes.',
          icono: icono('message'),
        },
        {
          titulo: 'Títulos, descripciones y enlaces internos',
          texto:
            'Cada página tiene un título y una descripción pensados para el resultado de búsqueda, y enlaza con las páginas relacionadas.',
          icono: icono('eye'),
        },
        {
          titulo: 'Datos estructurados que coinciden con lo visible',
          texto:
            'Agregamos un código que describe su empresa y sus servicios a los buscadores. No es un requisito para la IA, pero ayuda a entender la página, y siempre dice lo mismo que el texto visible.',
          icono: icono('check'),
        },
        {
          titulo: 'Una web que se puede leer',
          texto:
            'Contenido en texto, rápido en celular y con mapa del sitio. Permitimos que Google, Bing y el buscador de ChatGPT lean su web, como recomienda OpenAI.',
          icono: icono('monitor'),
        },
        {
          titulo: 'Perfil de Empresa en Google, si aplica',
          texto: 'Si su empresa cumple las reglas de Google, optimizamos su perfil para que diga lo mismo que su web.',
          icono: icono('home'),
        },
        {
          titulo: 'Autor, fecha y experiencia propia',
          texto:
            'Las guías llevan autor y fecha de actualización, y aportan experiencia real de su empresa. Google pide contenido útil y confiable, hecho para personas.',
          icono: icono('users'),
        },
      ],
    },
    {
      id: 'que-no-garantizamos',
      etiqueta: 'Lo que nadie puede garantizar',
      titulo: 'Lo que no podemos garantizar (y nadie puede)',
      introduccion:
        'Los resultados de Google y de los asistentes de IA los deciden sus propios sistemas, y cambian con frecuencia. Por eso no prometemos:',
      tipo: 'lista',
      variante: 'alerta',
      items: [
        'El primer lugar en Google ni una posición fija.',
        'Que ChatGPT, Gemini, Copilot u otro asistente recomiende o mencione su empresa.',
        'Aparecer siempre en los resúmenes con IA de Google.',
        'Resultados en un plazo fijo.',
        'Un número de visitas, llamadas o clientes.',
      ],
      nota: 'Lo que sí nos comprometemos a hacer está en el alcance de su plan, y cada mes revisamos con datos qué funcionó y qué conviene ajustar.',
    },
    {
      id: 'que-no-hacemos',
      etiqueta: 'Prácticas que no usamos',
      titulo: 'Lo que no hacemos',
      tipo: 'lista',
      variante: 'excluye',
      items: [
        'Comprar enlaces, menciones o reseñas.',
        'Publicar reseñas, testimonios o cifras inventadas.',
        'Crear muchas páginas sin valor para ocupar más resultados. Google lo considera un abuso de contenido a escala.',
        'Esconder texto o instrucciones para manipular a los buscadores o a los asistentes de IA.',
        'Venderle un archivo llms.txt como la clave para aparecer en la IA. Google dice que su búsqueda no lo usa.',
      ],
    },
    {
      id: 'como-medimos',
      etiqueta: 'Cómo medimos',
      titulo: 'Cómo medimos el avance',
      introduccion: 'Configuramos dos herramientas gratuitas y revisamos sus datos con usted, según el alcance de su plan.',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Google Search Console',
          texto:
            'Muestra cuántas veces aparece su web, con qué búsquedas y cuántas personas hacen clic. Según Google, incluye el tráfico de sus funciones con IA, aunque no lo separa.',
          icono: icono('chart'),
        },
        {
          titulo: 'Bing Webmaster Tools',
          texto:
            'Su informe de rendimiento en IA, en vista previa desde febrero de 2026, muestra cuántas veces Microsoft Copilot y los resúmenes con IA de Bing citan sus páginas.',
          icono: icono('eye'),
        },
        {
          titulo: 'Revisión mensual',
          texto: 'Revisamos qué búsquedas traen visitas, qué páginas conviene mejorar y qué preguntas nuevas hacen sus clientes.',
          icono: icono('refresh'),
        },
      ],
    },
    {
      id: 'proceso',
      etiqueta: 'Cómo trabajamos',
      titulo: 'Cómo trabajamos el posicionamiento',
      tipo: 'pasos',
      items: [
        {
          paso: '01',
          titulo: 'Investigación',
          texto: 'Estudiamos lo que buscan sus clientes y cómo se presentan hoy en Google las empresas de su sector.',
        },
        {
          paso: '02',
          titulo: 'Estructura',
          texto: 'Definimos qué páginas necesita su web: una por servicio, cada una con un tema claro.',
        },
        {
          paso: '03',
          titulo: 'Contenido',
          texto: 'Escribimos respuestas claras, preguntas frecuentes y textos con su experiencia. Usted los revisa y los aprueba.',
        },
        {
          paso: '04',
          titulo: 'Técnica',
          texto: 'Velocidad, versión para celular, datos estructurados, mapa del sitio y registro en Google Search Console y Bing Webmaster Tools.',
        },
        {
          paso: '05',
          titulo: 'Seguimiento',
          texto: 'Cada mes revisamos los datos y ajustamos lo que conviene, dentro del alcance de su plan.',
        },
      ],
    },
    {
      id: 'perfil-google',
      etiqueta: 'Perfil de Empresa en Google',
      titulo: 'SEO local: ¿su empresa necesita Perfil de Empresa en Google?',
      tipo: 'texto',
      parrafos: [
        'El Perfil de Empresa es la ficha que aparece en Google Maps y en las búsquedas locales, como «contador cerca de mí» o «abogado en Bogotá». Es importante para negocios que atienden clientes en persona.',
        'Google solo lo permite si su empresa atiende clientes en un local o va al lugar donde están. Si presta servicios a domicilio, debe ocultar la dirección. No se admiten oficinas virtuales, y el nombre no puede llevar palabras clave.',
        'Antes de crearlo u optimizarlo, revisamos si su empresa cumple estas reglas. Así reduce el riesgo de que Google lo suspenda.',
      ],
    },
    {
      id: 'precio',
      etiqueta: 'Precio',
      titulo: 'Cuánto cuesta el posicionamiento',
      introduccion: `El posicionamiento está incluido desde el plan ${visible.nombre}: desde ${desde('visible')} al año, o en 12 cuotas de ${cuotaDesde('visible')} al mes (IVA incluido), con seguimiento mensual. El plan ${esencial.nombre} solo incluye la optimización inicial de cada página.`,
      tipo: 'planes',
      compacto: true,
      recomendado: 'visible',
      nota: 'Licencias y suscripciones externas se identifican por separado. El valor final depende del alcance y queda por escrito antes de empezar.',
      enlace: { texto: 'Ver qué incluye cada plan', href: '/precios/' },
    },
  ],
  preguntas: [
    {
      pregunta: '¿Qué es el SEO, el AEO y el GEO?',
      respuesta:
        'Son tres formas de nombrar un mismo objetivo. SEO es la optimización para buscadores: que Google encuentre y entienda su web. AEO es la optimización para motores de respuesta: contenido que responde preguntas de forma directa. GEO es la optimización para buscadores generativos, como ChatGPT o Gemini: información clara y confiable que la inteligencia artificial pueda entender y citar.',
    },
    {
      pregunta: '¿Pueden garantizar el primer lugar en Google o que ChatGPT recomiende mi empresa?',
      respuesta:
        'No. Nadie puede garantizarlo. Google y los asistentes de inteligencia artificial deciden qué mostrar con sus propios sistemas, y esos sistemas cambian. Lo que sí hacemos es preparar su web para que la puedan leer y entender: una página por servicio, respuestas claras, datos coherentes y buena velocidad. Desconfíe de quien le garantice posiciones o menciones.',
    },
    {
      pregunta: '¿Necesito un archivo llms.txt para aparecer en la inteligencia artificial?',
      respuesta:
        'Para Google, no. Google indicó en junio de 2026 que los archivos llms.txt no son necesarios para su búsqueda y no afectan la visibilidad, ni para bien ni para mal. Es una propuesta que algunos sitios publican, pero no es un estándar. Si lo usamos, es un complemento menor, nunca la base de su posicionamiento.',
    },
    {
      pregunta: '¿Sirven los datos estructurados para aparecer en la inteligencia artificial?',
      respuesta:
        'Ayudan, pero no son un requisito. Google dice que no hacen falta para su búsqueda con IA y que no existe un marcado especial para ella. Los usamos porque describen su empresa y sus servicios de forma ordenada, siempre con la misma información que se ve en la página. Si no coinciden con lo visible, van en contra de las reglas de Google.',
    },
    {
      pregunta: '¿Se puede pagar para aparecer en las respuestas de la inteligencia artificial?',
      respuesta:
        'Los resultados orgánicos de Google no se compran. La publicidad es otra cosa: se muestra marcada como anuncio y no hace parte de nuestros planes. Si alguien le ofrece menciones garantizadas en ChatGPT u otro asistente a cambio de dinero, desconfíe. Lo que funciona es tener información clara, útil y coherente en su web y en sus perfiles.',
    },
    {
      pregunta: '¿Cómo sé si mi empresa aparece en las respuestas de la IA?',
      respuesta:
        'Hay dos herramientas gratuitas. Google Search Console muestra las búsquedas y los clics, e incluye el tráfico de las funciones con IA de Google, aunque no lo separa. Bing Webmaster Tools tiene un informe que muestra cuántas veces Copilot y los resúmenes con IA de Bing citan sus páginas. Las configuramos y revisamos los datos con usted.',
    },
    {
      pregunta: '¿Cuándo se ven los resultados del posicionamiento?',
      respuesta: `No prometemos un plazo, porque depende de su sector, de su competencia y del estado de su web. Primero Google debe rastrear e indexar las páginas nuevas. Después, los cambios se observan con datos mes a mes. Por eso el plan ${visible.nombre} incluye seguimiento mensual: revisamos qué búsquedas traen visitas y qué conviene mejorar.`,
    },
    {
      pregunta: '¿Mis preguntas frecuentes aparecerán destacadas en Google?',
      respuesta:
        'Ya no como antes. Google ya casi no muestra las preguntas frecuentes como resultado destacado. Aun así, las preguntas frecuentes siguen siendo útiles: resuelven dudas reales de sus clientes y dan respuestas claras que Google y los asistentes de IA pueden entender. Las escribimos para personas, no para un formato especial.',
    },
  ],
  cta: {
    titulo: '¿Cómo ven hoy Google y la IA a su empresa?',
    texto:
      'Solicite una revisión digital gratuita. Revisamos su web, su visibilidad en Google y su atención por WhatsApp, y le entregamos tres prioridades concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Diseño de páginas web en Bogotá para empresas', href: '/paginas-web-bogota/' },
    { texto: 'Configuración del agente de IA de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Precios del plan Web Visible y de los demás planes', href: '/precios/' },
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
    { texto: 'Páginas web para empresas de servicios', href: '/paginas-web-empresas-servicios/' },
    { texto: 'Páginas web para contadores y firmas contables', href: '/paginas-web-contadores/' },
  ],
  fuentes: [
    {
      titulo: 'Optimizing your website for generative AI features in Google Search (Google Search Central)',
      url: URL_GUIA_IA,
      idioma: 'en',
    },
    { titulo: 'AI features and your website (Google Search Central)', url: URL_FUNCIONES_IA, idioma: 'en' },
    { titulo: 'Latest Google Search Documentation Updates (Google Search Central)', url: URL_ACTUALIZACIONES, idioma: 'en' },
    {
      titulo: 'Creating helpful, reliable, people-first content (Google Search Central)',
      url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      idioma: 'en',
    },
    {
      titulo: 'Directrices para representar tu empresa en Google (Ayuda de Perfil de Empresa de Google)',
      url: 'https://support.google.com/business/answer/3038177?hl=es',
    },
    {
      titulo: 'Introducing AI Performance in Bing Webmaster Tools Public Preview (Bing Webmaster Blog)',
      url: 'https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview',
      idioma: 'en',
    },
    { titulo: 'Overview of OpenAI Crawlers (OpenAI)', url: 'https://developers.openai.com/docs/bots', idioma: 'en' },
    { titulo: 'The /llms.txt file (propuesta llmstxt.org)', url: 'https://llmstxt.org/', idioma: 'en' },
  ],
  /** Datos para servicio() de @/lib/schema. El precio sale de sitio.ts. */
  servicio: {
    nombre: 'Posicionamiento en Google y asistentes de IA',
    tipo: 'Optimización para buscadores (SEO)',
    descripcion:
      'Preparación de la web de empresas de servicios para que Google y los asistentes de IA entiendan qué hacen, para quién y dónde. Sin garantía de posiciones.',
    precioDesde: visible.precioAnualDesde,
    audiencia: 'Empresas de servicios',
  },
  actualizado: '2026-10-11',
} as const satisfies ModuloPagina;
