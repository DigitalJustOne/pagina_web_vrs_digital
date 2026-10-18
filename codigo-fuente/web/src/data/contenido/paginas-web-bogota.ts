// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /paginas-web-bogota/ (servicio: páginas web profesionales).
//  Palabra clave principal: «diseño de páginas web Bogotá».
//  Fuentes: informe del Director (2026-10-05: planes, proceso, capacidad, decisiones),
//  src/data/sitio.ts e investigación verificada del 2026-10-06 (preguntas reales de
//  competidores de Bogotá y guía de Google sobre Core Web Vitals).
//  Precios, proceso, condiciones, medios de pago y casos salen de sitio.ts: no los copie a mano.
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Rangos de tiempo de entrega por plan. Hoy el texto dice «según alcance», sin cifras,
//    y promete la fecha estimada por escrito en la propuesta.
//  - Confirmar que los cambios de contenido los hace VRS Digital (las webs no tienen panel
//    de edición) y que el cliente los pide por WhatsApp o correo.
//  - A nombre de quién queda el dominio y si el alojamiento (hosting) va en la mensualidad.
//    Hoy no se afirma ninguna de las dos cosas.
//  - Confirmar que las webs de clientes se entregan como páginas estáticas, sin panel de
//    administración ni complementos (lo afirman la sección «velocidad-seguridad» y la
//    pregunta «¿Puedo cambiar yo mismo los textos?»). Si no es así en todos los planes, ajustar.
//  EDICIÓN FINAL (2026-10-06): H1 distinto del de /paginas-web-empresas-servicios/ para no
//  competir por la misma búsqueda. Se quitaron las preguntas de pago, de costos aparte y de
//  «primer lugar en Google» (ya están en /precios/ y en /posicionamiento-…/) y se agregaron
//  «Si ya tengo una página web…» y «¿Qué necesito tener listo…?».
// ─────────────────────────────────────────────────────────────────────────────
import {
  CIFRAS,
  CONDICIONES,
  DOMINIO_HOSTING,
  CONTACTO,
  CTA_PRINCIPAL,
  MEDIOS_PAGO,
  FUNDADOR,
  PLANES,
  PROCESO,
  enlaceWhatsApp,
  formatoCOP,
  type IdPlan,
  cuotaMensual,
} from '@/data/sitio';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;
const plan = (id: IdPlan) => PLANES.find((p) => p.id === id)!;
const desde = (id: IdPlan) => formatoCOP(plan(id).precioAnualDesde);
const cuotaDesde = (id: IdPlan) => formatoCOP(cuotaMensual(plan(id).precioAnualDesde));

const esencial = plan('esencial');
const visible = plan('visible');

const MEDIOS_PAGO_TEXTO = MEDIOS_PAGO.map((m) => (/^\p{Lu}\p{Ll}/u.test(m) ? m.charAt(0).toLowerCase() + m.slice(1) : m)).join(', ').replace(/, ([^,]*)$/, ' o $1');
const CAPACIDAD = CONDICIONES.find((c) => c.includes('dos proyectos'))!;

const MENSAJE_WHATSAPP = 'Hola, vi la página de diseño web de VRS Digital y quiero una revisión digital de mi empresa.';

export const contenido = {
  ruta: '/paginas-web-bogota/',
  seo: {
    // 45 caracteres + « | VRS Digital» (Seo.astro) = 59.
    titulo: 'Diseño de páginas web en Bogotá para empresas',
    descripcion: `Diseño de páginas web en Bogotá para empresas de servicios: rápidas, adaptadas a celular, con WhatsApp y listas para Google. Desde ${desde('esencial')} IVA incluido.`,
    palabraClave: 'diseño de páginas web Bogotá',
    // «página web para servicios profesionales» → /paginas-web-empresas-servicios/;
    // «cuánto cuesta una página web en Bogotá» → guía de /recursos/ (una intención por URL).
    secundarias: ['páginas web para empresas', 'diseño web Bogotá', 'página web profesional para empresa'],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Páginas web en Bogotá', ruta: '/paginas-web-bogota/' },
  ],
  hero: {
    etiqueta: 'Páginas web profesionales en Bogotá',
    titulo: 'Diseño de páginas web en Bogotá para su empresa',
    subtitulo:
      'Una web clara, rápida y adaptada a celular que explica lo que usted ofrece, genera confianza y facilita que le escriban. Usted habla directamente con quien la diseña y la construye.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver precios y planes', href: '/precios/' },
    precio: `Desde ${desde('esencial')}`,
    puntos: ['Precio publicado desde el primer día', 'Dominio y hosting incluidos el primer año', 'Atención directa con el fundador'],
  },
  respuestaDirecta: `Diseñamos páginas web para empresas de servicios en Bogotá. El plan ${esencial.nombre} cuesta desde ${desde('esencial')} al año, o en 12 cuotas de ${cuotaDesde('esencial')} al mes, e incluye hasta cinco secciones adaptadas a celular, botón de WhatsApp, formulario y optimización inicial para Google. Usted trata directamente con ${FUNDADOR.nombreCorto}, quien dirige y revisa cada proyecto.`,
  secciones: [
    {
      id: 'para-quien',
      etiqueta: 'Para quién',
      titulo: 'Para empresas que venden servicios y necesitan explicarlos bien',
      introduccion:
        'Un servicio no se ve ni se toca. Por eso su web debe decir qué hace, para quién, cómo trabaja y cuánto cuesta empezar. Nos concentramos en estos sectores:',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Firmas contables y tributarias',
          texto:
            'Servicios para personas y empresas explicados con claridad, contenido para cada temporada de declaración y consultas por WhatsApp ordenadas.',
          icono: icono('calculator'),
          href: '/paginas-web-contadores/',
        },
        {
          titulo: 'Consultores y capacitadores',
          texto: 'Su especialidad, su método, lo que entrega y sus casos reales, con una forma sencilla de pedirle una propuesta.',
          icono: icono('briefcase'),
          href: '/paginas-web-consultores/',
        },
        {
          titulo: 'Otras empresas de servicios',
          texto:
            'Seguridad y salud en el trabajo (SST), firmas jurídicas pequeñas, inmobiliarias, servicios técnicos y empresas que venden a otras empresas.',
          icono: icono('users'),
          href: '/paginas-web-empresas-servicios/',
        },
      ],
    },
    {
      id: 'que-incluye',
      etiqueta: 'Qué incluye',
      titulo: 'Qué incluye su página web',
      introduccion: `Esto es lo que incluye el plan ${esencial.nombre}, el punto de partida. Los planes superiores suman posicionamiento mensual en Google y atención con el agente de IA de WhatsApp Business.`,
      tipo: 'comparacion',
      incluye: esencial.incluye,
      noIncluye: [
        ...esencial.noIncluye,
        DOMINIO_HOSTING.resumen,
        'Licencias y suscripciones externas: se identifican por separado en la propuesta',
      ],
      enlace: { texto: 'Comparar los tres planes', href: '/precios/' },
    },
    {
      id: 'entregables',
      etiqueta: 'Qué recibe',
      titulo: 'Qué recibe al terminar',
      introduccion: 'Al publicar, usted no recibe solo un diseño. Recibe una web funcionando y probada:',
      tipo: 'lista',
      items: [
        'Su web publicada en su dominio, con certificado de seguridad (SSL), el candado que protege la conexión de sus visitantes.',
        'Solicitud de indexación en Google, para que Google encuentre y muestre sus páginas.',
        'Botón de WhatsApp y formulario de contacto probados en celular y en computador.',
        'Textos revisados y aprobados por usted, escritos para sus clientes y para los buscadores.',
        'Un manual breve de uso.',
      ],
    },
    {
      id: 'velocidad-seguridad',
      etiqueta: 'Velocidad y seguridad',
      titulo: 'Una web rápida y con menos riesgos',
      introduccion:
        'Construimos su web como páginas listas para mostrarse. No depende de un panel de administración abierto en internet ni de complementos que haya que actualizar cada semana. Para usted, eso significa tres cosas:',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Carga rápido en celular',
          texto:
            'Las páginas no se arman cada vez que alguien entra: ya están listas. Antes de publicar revisamos la velocidad con las métricas que Google usa como referencia.',
          icono: icono('clock'),
        },
        {
          titulo: 'Menos puntos de ataque',
          texto:
            'Sin panel de acceso público ni complementos de terceros, hay menos por donde intentar entrar. Ninguna web es invulnerable, pero así se reducen los riesgos más comunes.',
          icono: icono('shield'),
        },
        {
          titulo: 'Menos mantenimiento técnico',
          texto:
            'No hay complementos pendientes de actualizar que puedan dañar la web. El mantenimiento se concentra en su información y en mejorar el contenido.',
          icono: icono('wrench'),
        },
      ],
      nota: 'Google recomienda buenas métricas de experiencia en la página (Core Web Vitals). Por ejemplo, que el contenido principal cargue en 2,5 segundos o menos.',
    },
    {
      id: 'proceso',
      etiqueta: 'Cómo trabajamos',
      titulo: 'Cómo trabajamos, paso a paso',
      introduccion: 'Cinco etapas con una sola persona responsable. Usted revisa y aprueba antes de que publiquemos.',
      tipo: 'pasos',
      items: PROCESO,
      nota: `Pago de una vez o en 12 cuotas mensuales. Medios de pago: ${MEDIOS_PAGO_TEXTO}.`,
    },
    {
      id: 'tiempos',
      etiqueta: 'Tiempos',
      titulo: 'Cuánto tarda: depende del alcance',
      introduccion:
        'No publicamos un plazo único porque cada web es distinta. Estos son los factores que más cambian el tiempo de entrega:',
      tipo: 'lista',
      items: [
        'El número de secciones o páginas.',
        'Si usted ya tiene los textos o los preparamos nosotros.',
        'Si hay una web anterior cuyo contenido se debe trasladar.',
        'Si el logo, las fotos y los documentos ya existen o hay que conseguirlos.',
        'Qué tan rápido recibimos su información y sus aprobaciones.',
      ],
      parrafos: [
        'En el diagnóstico confirmamos el alcance y la fecha de inicio. La fecha estimada de entrega queda por escrito en la propuesta.',
        `${CAPACIDAD} Así cada web recibe la atención que necesita.`,
      ],
    },
    {
      id: 'precios',
      etiqueta: 'Precios',
      titulo: 'Cuánto cuesta una página web con VRS Digital',
      introduccion: `Tres planes con precio publicado. La web sola empieza en ${desde('esencial')} al año, o en 12 cuotas de ${cuotaDesde('esencial')} al mes, IVA incluido. El valor final depende del alcance y se entrega por escrito antes de empezar.`,
      tipo: 'planes',
      compacto: true,
      nota: 'Licencias y suscripciones externas, incluidos los costos de Meta, se identifican por separado.',
      enlace: { texto: 'Ver precios completos, condiciones y formas de pago', href: '/precios/' },
    },
    {
      id: 'como-comparar',
      etiqueta: 'Antes de contratar',
      titulo: 'Cuatro preguntas antes de comparar cotizaciones',
      introduccion:
        'En Bogotá se publican precios muy distintos para lo que parece el mismo servicio. Haga estas preguntas a cualquier proveedor, también a nosotros:',
      tipo: 'lista',
      // Lista corta a propósito: la lista completa de verificación vive en la guía de precios
      // (una intención por URL; esta página no compite con ella).
      items: [
        '¿El precio incluye impuestos? ¿Qué se paga aparte?',
        '¿Qué incluye el precio anual y puedo pagar en cuotas?',
        '¿Cuál es la fecha estimada de entrega y queda por escrito?',
      ],
      nota: 'Si le prometen el primer lugar en Google, desconfíe: nadie puede garantizarlo.',
      enlace: { texto: 'Vea la lista completa y los precios publicados en Bogotá en nuestra guía', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
    },
    {
      id: 'quien',
      etiqueta: 'Quién hace su web',
      titulo: 'Quién hace su web',
      tipo: 'texto',
      parrafos: [
        `VRS Digital es un estudio digital de Bogotá dirigido por su fundador, ${FUNDADOR.nombreCorto}. Él atiende el diagnóstico, define la estructura, revisa cada texto y aprueba cada entrega.`,
        'Usamos inteligencia artificial (IA) para acelerar la investigación, la redacción y el desarrollo. Las decisiones, la revisión final y la comunicación con usted están a cargo de una persona.',
        'Sin intermediarios: quien habla con usted es quien responde por el resultado.',
      ],
      cifras: CIFRAS,
      enlace: { texto: `Conozca a ${FUNDADOR.nombreCorto}`, href: '/nosotros/' },
    },
    {
      id: 'proyectos',
      etiqueta: 'Proyectos',
      titulo: 'Algunas webs que hemos construido',
      introduccion: 'Proyectos con enlace público, para que usted los revise.',
      tipo: 'casos',
      clientes: ['La Casa de las Tejas', 'La Casa de las Tejas: teja Standing Seam', 'MG Power Electric'],
      enlace: { texto: 'Ver todos los proyectos', href: '/proyectos/' },
    },
  ],
  preguntas: [
    {
      pregunta: '¿Cuánto cuesta una página web para empresa en Bogotá con VRS Digital?',
      respuesta: `El plan ${esencial.nombre} cuesta desde ${desde('esencial')} al año, o en 12 cuotas de ${cuotaDesde('esencial')} al mes. Incluye hasta cinco secciones, diseño adaptado a celular, botón de WhatsApp, formulario y optimización inicial para Google. Si además quiere seguimiento mensual del posicionamiento, el plan ${visible.nombre} empieza en ${desde('visible')}. El valor final depende del número de páginas, los textos y la información, y queda por escrito antes de empezar.`,
    },
    {
      pregunta: '¿Cuánto tarda en estar lista mi página web?',
      respuesta:
        'Depende del alcance: el número de páginas, si usted ya tiene textos y fotos, si hay una web anterior que trasladar y qué tan rápido recibimos sus aprobaciones. En el diagnóstico confirmamos el alcance y la fecha de inicio, y la fecha estimada de entrega queda por escrito en la propuesta. Trabajamos con un máximo de dos proyectos al tiempo para cuidar la calidad.',
    },
    {
      pregunta: 'Si ya tengo una página web, ¿qué pasa con ella?',
      respuesta:
        'En el diagnóstico revisamos su web actual: qué páginas tiene, cuáles conviene conservar y qué direcciones ya conoce Google. Trasladar ese contenido es trabajo adicional que cambia el alcance y el precio, por eso se define y se cotiza por escrito antes de empezar. Nadie puede garantizar que conserve sus posiciones en Google, pero planear el traslado reduce el riesgo de perder visitas.',
    },
    {
      pregunta: '¿Mi página web será una plantilla?',
      respuesta:
        'No partimos de cero en cada proyecto: usamos un sistema de componentes de diseño probados que ajustamos a su marca, sus colores y sus servicios. Eso acelera la entrega y cuida la calidad. La estructura de páginas, los textos y las preguntas frecuentes se preparan para su empresa y sus clientes, y usted los aprueba antes de publicar.',
    },
    {
      pregunta: '¿Puedo cambiar yo mismo los textos de mi web?',
      respuesta: `Su web no tiene un panel de edición abierto en internet, y eso la hace más rápida y segura. Los cambios de textos, precios o fotos los hacemos nosotros. Usted nos envía la solicitud por WhatsApp o por correo. ${CONTACTO.respuestaHumana}`,
    },
    {
      pregunta: '¿Cómo reviso el diseño antes de que quede listo?',
      respuesta:
        'En la etapa de preparación usted revisa la estructura y los textos en un documento central antes del diseño. Así los cambios grandes se resuelven temprano y la presentación final llega más cerca de lo que usted espera.',
    },
    {
      pregunta: '¿Qué necesito tener listo para empezar mi página web?',
      respuesta:
        'Lo básico: la descripción de su empresa, sus servicios, a quién atiende, sus datos de contacto, su logo y las fotos que tenga. Se lo pedimos en un solo formulario. Si no tiene textos, los preparamos con usted y usted los aprueba antes de publicar. Si le faltan el logo o las fotos, se lo decimos en el diagnóstico, porque eso puede cambiar el plazo de entrega.',
    },
  ],
  cta: {
    titulo: 'Descubra qué está frenando la presencia digital de su empresa',
    texto:
      'Solicite una revisión digital gratuita. Analizamos su web actual, su visibilidad en Google y su atención por WhatsApp, y le entregamos tres prioridades concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Precios, condiciones y formas de pago', href: '/precios/' },
    { texto: 'Posicionamiento en Google y asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
    { texto: 'Configuración del agente de IA de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Páginas web para contadores y firmas contables', href: '/paginas-web-contadores/' },
    { texto: 'Proyectos realizados por VRS Digital', href: '/proyectos/' },
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
  ],
  fuentes: [
    {
      titulo: 'Understanding Core Web Vitals and Google search results (Google Search Central)',
      url: 'https://developers.google.com/search/docs/appearance/core-web-vitals',
      idioma: 'en',
    },
    {
      titulo: 'Creating helpful, reliable, people-first content (Google Search Central)',
      url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      idioma: 'en',
    },
  ],
  /** Datos para servicio() de @/lib/schema. El precio sale de sitio.ts. */
  servicio: {
    nombre: 'Diseño de páginas web para empresas de servicios en Bogotá',
    tipo: 'Diseño y desarrollo de páginas web',
    descripcion:
      'Páginas web profesionales para empresas de servicios: hasta cinco secciones, adaptadas a celular, con botón de WhatsApp, formulario y optimización inicial para Google.',
    precioDesde: esencial.precioAnualDesde,
    audiencia: 'Empresas de servicios',
  },
  actualizado: '2026-10-11',
} as const satisfies ModuloPagina;
