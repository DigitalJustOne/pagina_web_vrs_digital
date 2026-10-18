// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de la página de inicio (/).
//  Fuentes: informe del Director "Estrategia integral para VRS Digital" (2026-10-05),
//  src/data/sitio.ts e investigación verificada del 2026-10-06 (fuentes al final).
//  Precios, contacto, casos, aval y proceso salen de sitio.ts: no los copie a mano.
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Si los servicios se venden sueltos (solo WhatsApp o solo posicionamiento): la pregunta
//    «¿Puedo contratar solo la página web?» dice que esos componentes van dentro de los planes.
//  EDICIÓN FINAL (2026-10-06): preguntas sin duplicar entre páginas. Las del agente de
//  WhatsApp, 24 horas, garantías, SEO/AEO/GEO y precios quedan en su página de servicio.
//
//  Además de `contenido`, exporta dos piezas propias de la portada (src/pages/index.astro):
//  `visualHero` (tarjetas del visual 3D) y `recorrido` (historia fija «encuentran → entienden →
//  reciben respuesta»). Las dos usan el mismo ejemplo ficticio de la sección «whatsapp».
// ─────────────────────────────────────────────────────────────────────────────
import {
  AVAL,
  CIFRAS,
  CONTACTO,
  CTA_PRINCIPAL,
  PLANES,
  PLAN_ENTRADA,
  MEDIOS_PAGO,
  LANDING,
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
const minuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

/** Aclaración obligatoria cerca de cualquier mención de "fuera de horario" o "24/7". */
const ACLARACION_HORARIO = `El agente puede responder a cualquier hora. Nuestro acompañamiento humano es de ${minuscula(CONTACTO.horario)}. ${CONTACTO.respuestaHumana}`;

const MEDIOS_PAGO_TEXTO = MEDIOS_PAGO.map((m) => (/^\p{Lu}\p{Ll}/u.test(m) ? m.charAt(0).toLowerCase() + m.slice(1) : m)).join(', ').replace(/, ([^,]*)$/, ' o $1');

/** Conversación de ejemplo (firma contable ficticia). La usan la sección «whatsapp» y el recorrido de la portada. */
const CONVERSACION_DEMO = {
  titulo: 'Firma contable (ejemplo)',
  estado: 'Cuenta de empresa',
  mensajes: [
    {
      de: 'cliente',
      separador: 'Domingo',
      hora: '7:42\u00a0p.\u00a0m.',
      texto: 'Buenas noches. ¿Ustedes hacen declaración de renta para personas naturales?',
    },
    {
      de: 'asistente',
      hora: '7:42\u00a0p.\u00a0m.',
      texto:
        'Buenas noches. Sí, la firma prepara la declaración de renta de personas naturales: empleados, independientes y pensionados. ¿En cuál de esos casos está usted?',
    },
    {
      de: 'cliente',
      hora: '7:44\u00a0p.\u00a0m.',
      texto: 'independiente, facturo como contratista. no se si estoy obligado a declarar y no quiero que me multen',
    },
    {
      de: 'asistente',
      hora: '7:44\u00a0p.\u00a0m.',
      texto:
        'Entiendo. Si debe declarar depende de topes de ingresos y patrimonio que fija la DIAN cada año, y su fecha límite depende de los dos últimos dígitos de su NIT. Revisar su caso le corresponde a un contador de la firma. ¿Quiere que uno le escriba?',
    },
    {
      de: 'cliente',
      hora: '7:45\u00a0p.\u00a0m.',
      texto: 'si porfa. y cuanto cobran?',
    },
    {
      de: 'asistente',
      hora: '7:45\u00a0p.\u00a0m.',
      texto:
        'El valor depende de sus ingresos y de cuántos soportes tenga. El contador se lo confirma antes de empezar. ¿Me indica su nombre para dejarle la consulta?',
    },
    {
      de: 'cliente',
      hora: '7:46\u00a0p.\u00a0m.',
      texto: 'Andrés Gómez. le mando de una vez los extractos por aquí?',
    },
    {
      de: 'asistente',
      hora: '7:46\u00a0p.\u00a0m.',
      texto:
        'Gracias, Andrés. Por seguridad, no envíe extractos ni certificados por este chat: el contador le indicará cómo compartirlos. Le paso su consulta a una persona del equipo, que le escribe mañana lunes en horario de oficina.',
    },
    {
      de: 'persona',
      separador: 'Lunes',
      hora: '8:10\u00a0a.\u00a0m.',
      texto:
        'Buenos días, Andrés. Soy Carolina, contadora de la firma. Leí su consulta de anoche. ¿Podemos hablar hoy a las 10:00\u00a0a.\u00a0m. para revisar si debe declarar y cuál es su fecha?',
    },
    {
      de: 'cliente',
      hora: '8:14\u00a0a.\u00a0m.',
      texto: 'Perfecto, a las 10 me sirve. Gracias.',
    },
  ],
  nota: 'Ejemplo ilustrativo con una firma contable ficticia. Las respuestas reales dependen de la información que su empresa apruebe y de las funciones que Meta habilite en su cuenta.',
} as const;

export const contenido = {
  ruta: '/',
  seo: {
    // La página de inicio no recibe " | VRS Digital" desde Seo.astro: la marca va aquí (54 caracteres).
    titulo: 'Páginas web, Google y WhatsApp en Bogotá | VRS Digital',
    // El precio va junto a «IVA incluido» y al comienzo: así no se corta en el resultado de Google.
    descripcion: `VRS Digital, estudio digital en Bogotá: páginas web listas para Google y la IA, y el agente de IA de WhatsApp. Desde ${desde('esencial')} IVA incluido.`,
    // Marca y categoría. Las palabras clave de cada servicio viven en su propia página
    // (no repetirlas aquí para no competir con ellas).
    palabraClave: 'páginas web inteligentes para empresas de servicios',
    secundarias: ['VRS Digital', 'estudio digital en Bogotá', 'página web con WhatsApp para empresas'],
  },
  migas: [{ nombre: 'Inicio', ruta: '/' }],
  hero: {
    etiqueta: 'Estudio digital en Bogotá',
    titulo: 'Haga que encuentren su empresa y reciban respuesta cuando le escriban',
    subtitulo:
      'Páginas web para empresas de servicios en Bogotá, preparadas para Google y asistentes de inteligencia artificial (IA), con el agente de IA que Meta ofrece en WhatsApp Business configurado.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver planes y precios', href: '/precios/' },
    puntos: ['Atención directa con el fundador', 'Precios publicados', 'Máximo dos proyectos a la vez'],
    // Precio visible en la primera pantalla (la plantilla agrega «IVA incluido»).
    precio: `Desde ${desde('esencial')}`,
  },
  respuestaDirecta: `VRS Digital es un estudio digital de Bogotá dirigido por su fundador, Víctor Ramírez. Crea páginas web para empresas de servicios desde ${desde('esencial')} al año, o en 12 cuotas de ${cuotaDesde('esencial')} al mes (IVA incluido), las prepara para Google y asistentes de IA, y configura el agente de IA que Meta ofrece en WhatsApp Business cuando su cuenta tiene acceso. Usted habla directamente con quien hace el trabajo.`,
  secciones: [
    {
      id: 'problema',
      etiqueta: 'El problema',
      titulo: 'Una web que no explica y un WhatsApp que no da abasto',
      introduccion:
        'Muchas empresas tienen una página que no explica bien sus servicios o dependen de responder a mano cada mensaje. Organizamos ambos puntos para que sus clientes encuentren información clara y reciban una primera respuesta.',
      tipo: 'lista',
      items: [
        'Su página no dice con claridad qué hace, para quién y cómo empezar.',
        'Cuando alguien busca su servicio en Google, encuentra primero a otras empresas.',
        'Los asistentes de IA, como ChatGPT o Gemini, no encuentran información clara sobre su empresa.',
        'Las mismas preguntas llegan todos los días por WhatsApp: precios, horarios, requisitos.',
        'Los mensajes de la noche o del fin de semana se responden horas o días después.',
      ],
    },
    {
      id: 'servicios',
      etiqueta: 'Lo que hacemos',
      titulo: 'Cuatro servicios bajo una sola estrategia',
      introduccion:
        'Puede contratar solo la página web o el plan completo. En los dos casos, su web, Google y WhatsApp trabajan con la misma información, revisada y aprobada por usted.',
      tipo: 'tarjetas',
      columnas: 2,
      items: [
        {
          titulo: 'Página web profesional',
          texto:
            'Una web clara, rápida y adaptada a celular que explica qué hace su empresa, para quién y cómo empezar. Incluye botón de WhatsApp y formulario de contacto.',
          icono: icono('monitor'),
          href: '/paginas-web-bogota/',
        },
        {
          titulo: 'Posicionamiento en Google y asistentes de IA',
          texto:
            'Organizamos su web para que Google y asistentes como ChatGPT o Gemini entiendan qué hace su empresa y dónde: una página por servicio, preguntas frecuentes y datos ordenados. Sin promesas de primer lugar.',
          icono: icono('search'),
          href: '/posicionamiento-google-inteligencia-artificial/',
        },
        {
          titulo: 'Agente de IA en WhatsApp Business',
          texto:
            'Configuramos el agente de IA que Meta ofrece en WhatsApp Business: información de su negocio, tono, pruebas y cuándo pasarle la conversación a una persona. Primero verificamos que su cuenta tenga acceso.',
          icono: icono('message'),
          href: '/asistente-whatsapp-business/',
        },
        {
          titulo: 'Mantenimiento y mejoras mensuales',
          texto:
            'Mantenemos su información al día, revisamos las respuestas del agente y mejoramos la web mes a mes, como servicio aparte.',
          icono: icono('refresh'),
          href: '/precios/',
        },
      ],
    },
    {
      id: 'diferenciador',
      etiqueta: 'Por qué VRS Digital',
      titulo: 'Hable con quien hace el trabajo, con precios publicados y entregas más rápidas gracias a la IA',
      introduccion:
        'VRS Digital es un estudio pequeño a propósito: una persona responsable, apoyada por inteligencia artificial y con un alcance claro desde el primer día.',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Comunicación directa',
          texto:
            'Usted habla con Víctor Ramírez, quien diseña, desarrolla, revisa y responde por su proyecto. Sin intermediarios ni cambios de interlocutor.',
          icono: icono('users'),
        },
        {
          titulo: 'Ejecución especializada',
          texto:
            'Nos concentramos en empresas de servicios. Web, visibilidad y WhatsApp se planean juntos, con precios y alcances publicados.',
          icono: icono('briefcase'),
        },
        {
          titulo: 'Procesos acelerados con IA',
          texto:
            'La inteligencia artificial acelera la investigación, los textos, el diseño y el desarrollo. Una persona verifica y aprueba cada entrega.',
          icono: icono('spark'),
        },
      ],
      enlace: { texto: 'Conozca cómo trabajamos', href: '/nosotros/' },
    },
    {
      id: 'whatsapp',
      etiqueta: 'Atención por WhatsApp',
      titulo: 'Así funciona la atención con el agente de IA de WhatsApp Business',
      introduccion:
        'Un ejemplo con una firma contable ficticia. Un cliente escribe un domingo en la noche. El agente responde con la información que la firma aprobó, no da asesoría tributaria y deja el caso listo para que una persona de la firma lo retome el lunes.',
      tipo: 'conversacion',
      conversacion: CONVERSACION_DEMO,
      puntos: [
        'Responde a cualquier hora con la información que la empresa aprobó.',
        'No da asesoría tributaria ni inventa precios: esos temas pasan a una persona.',
        'Pide solo el dato necesario y evita recibir documentos financieros por el chat.',
        'Una persona de la empresa retoma la conversación en su horario de trabajo.',
      ],
      // Portada: una nota breve con lo esencial; el detalle (acceso, errores, costos de Meta y datos)
      // vive en /asistente-whatsapp-business/, enlazado abajo.
      nota: `El agente de IA es una función de Meta: VRS Digital no creó esa tecnología, la configura, la prueba con 25 a 40 preguntas y la ajusta. Meta la habilita de forma gradual, por cuenta; puede equivocarse; usa los mensajes de esos chats para mejorar su IA, y define sus propios costos, que no están incluidos en nuestro precio. ${ACLARACION_HORARIO}`,
      // La plantilla muestra «Información verificada el <fecha>»: aquí va la fecha (AAAA-MM-DD).
      verificado: '2026-10-06',
      enlace: { texto: 'Ver el servicio de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    },
    {
      id: 'prueba',
      etiqueta: 'Proyectos y respaldo',
      titulo: 'Proyectos que puede revisar y un respaldo que puede verificar',
      introduccion:
        'Estos son proyectos de VRS Digital con enlace público, para que usted los revise. Algunos son plataformas a medida hechas antes de concentrar la oferta, como Vitalcarga; hoy no vendemos software a medida ni CRM.',
      tipo: 'casos',
      limite: 4,
      cifras: CIFRAS,
      aval: {
        titulo: AVAL.titulo,
        texto: AVAL.texto,
        enlace: { texto: 'Ver verificación en Cercia', href: AVAL.enlace },
      },
      nota: 'Los resultados de cada proyecto dependen del negocio, su mercado y su operación. No garantizan los mismos resultados en otra empresa.',
      enlace: { texto: 'Ver todos los proyectos', href: '/proyectos/' },
    },
    {
      id: 'planes',
      etiqueta: 'Precios',
      titulo: 'Precios publicados, desde una landing',
      introduccion: `Una ${LANDING.nombre} cuesta ${formatoCOP(LANDING.precio)}, pago único. En los planes web, el precio anual es el valor del proyecto (diseñar, construir y publicar su web). Se paga de una vez o en 12 cuotas mensuales. Desde ${desde('esencial')} al año en ${plan('esencial').nombre}, o 12 cuotas de ${cuotaDesde('esencial')}, IVA incluido. El precio final depende del número de páginas, los textos, la migración de una web anterior y la cantidad de información.`,
      tipo: 'planes',
      compacto: true,
      items: PLANES.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        paraQuien: p.paraQuien,
        precioAnual: `Desde ${formatoCOP(p.precioAnualDesde)} al año`,
        cuotas: `o 12 cuotas de ${formatoCOP(cuotaMensual(p.precioAnualDesde))}`,
        destacado: Boolean(p.destacado),
      })),
      planEntrada: {
        nombre: PLAN_ENTRADA.nombre,
        precio: `${formatoCOP(PLAN_ENTRADA.mensualidad)} al mes`,
        descripcion: PLAN_ENTRADA.descripcion,
      },
      nota: `Puede pagar por ${MEDIOS_PAGO_TEXTO}. Licencias, suscripciones externas y costos de Meta se pagan aparte.`,
      enlace: { texto: 'Ver qué incluye cada plan', href: '/precios/' },
    },
    {
      id: 'proceso',
      etiqueta: 'Proceso',
      titulo: 'Cómo trabajamos, paso a paso',
      introduccion:
        'Cinco etapas con una sola persona responsable. Usted sabe qué sigue en cada momento y qué necesitamos de su parte.',
      tipo: 'pasos',
      items: PROCESO,
    },
  ],
  preguntas: [
    {
      pregunta: '¿Qué hace exactamente VRS Digital?',
      respuesta:
        'VRS Digital diseña páginas web para empresas de servicios, las prepara para que Google y los asistentes de inteligencia artificial entiendan qué hace cada empresa, y configura el agente de IA que Meta ofrece dentro de WhatsApp Business. También ofrece mantenimiento mensual. No desarrolla chatbots a medida, sistemas de gestión de clientes (CRM) ni conexiones con otros programas (API o integraciones).',
    },
    // Preguntas propias de la página de inicio. Las de cada servicio (agente de WhatsApp, 24 horas,
    // garantías en Google, SEO/AEO/GEO, precios) viven en su página para no duplicarlas.
    {
      pregunta: '¿Con qué tipo de empresas trabajan?',
      respuesta:
        'Con empresas y profesionales de servicios que necesitan explicar bien lo que ofrecen y reciben muchas preguntas por WhatsApp. Hoy nos enfocamos en firmas contables y tributarias, y en consultores y capacitadores. También atendemos otras empresas de servicios, como firmas jurídicas pequeñas, inmobiliarias o servicios técnicos, con la misma estructura adaptada. Si su caso no encaja, se lo decimos.',
    },
    {
      pregunta: '¿Usan inteligencia artificial para hacer las páginas?',
      respuesta:
        'Sí. La inteligencia artificial acelera la investigación, los borradores de textos, el diseño y el desarrollo. Víctor Ramírez verifica la información, ajusta el tono, prueba el funcionamiento y aprueba cada entrega antes de mostrársela. Usted revisa y aprueba los textos de su web. El método y las herramientas son reservados; el alcance y los límites del servicio, no.',
    },
    {
      pregunta: '¿En qué se diferencia VRS Digital de una agencia tradicional?',
      respuesta:
        'Usted habla directamente con quien diseña, desarrolla y revisa su proyecto, sin intermediarios. Su web, su visibilidad en Google y su WhatsApp se planean con una sola estrategia. Los precios y los alcances están publicados. A cambio, somos claros con los límites: atendemos máximo dos proyectos a la vez y no ofrecemos CRM, API ni chatbots a medida.',
    },
    {
      pregunta: '¿Puedo contratar solo la página web?',
      respuesta: `Sí. El plan ${plan('esencial').nombre} incluye la página web, desde ${desde('esencial')} al año, o en 12 cuotas de ${cuotaDesde('esencial')} al mes. El seguimiento mensual en Google empieza en ${plan('visible').nombre}, y la configuración del agente de IA de WhatsApp Business, en ${plan('atencion').nombre}. Para microempresas que empiezan está el ${PLAN_ENTRADA.nombre}, por ${formatoCOP(PLAN_ENTRADA.mensualidad)} al mes. Dominio y hosting van incluidos en los planes web; los costos externos van aparte.`,
    },
    {
      pregunta: '¿Qué es la revisión digital gratuita?',
      respuesta: `Es el primer paso para trabajar con nosotros, no tiene costo y no lo obliga a contratar. Revisamos la claridad de su web, su visibilidad básica en Google, cómo se ve en el celular, sus formas de contacto y su atención por WhatsApp. Le entregamos tres prioridades concretas, en lenguaje sencillo. Puede pedirla por el formulario de contacto o por WhatsApp. ${CONTACTO.respuestaHumana}`,
    },
  ],
  cta: {
    titulo: 'Descubra qué está frenando la presencia digital de su empresa',
    texto:
      'Solicite una revisión digital gratuita. Analizamos su web, su visibilidad en Google y su atención por WhatsApp, y le entregamos tres prioridades concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: 'Hola, quiero una revisión digital gratuita para mi empresa.',
    enlaceWhatsApp: enlaceWhatsApp('Hola, quiero una revisión digital gratuita para mi empresa.'),
  },
  enlacesInternos: [
    { texto: 'Diseño de páginas web en Bogotá para empresas', href: '/paginas-web-bogota/' },
    { texto: 'Posicionamiento en Google y asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
    { texto: 'Configuración del agente de IA de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Páginas web para contadores y firmas contables', href: '/paginas-web-contadores/' },
    { texto: 'Precios y qué incluye cada plan', href: '/precios/' },
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
  ],
  fuentes: [
    {
      titulo: 'Meta Business Agent en WhatsApp (página oficial de WhatsApp Business)',
      url: 'https://whatsappbusiness.com/es-la/products/business-app-ai-agent/',
    },
    {
      titulo: 'About using business AI to chat with customers (Centro de ayuda de WhatsApp)',
      url: 'https://faq.whatsapp.com/291930066973116/',
      idioma: 'en',
    },
    {
      titulo: 'Meta One on WhatsApp Business App (página oficial de WhatsApp Business)',
      url: 'https://whatsappbusiness.com/products/business-app-meta-one/',
      idioma: 'en',
    },
    {
      titulo: 'AI features and your website (Google Search Central)',
      url: 'https://developers.google.com/search/docs/appearance/ai-features',
      idioma: 'en',
    },
  ],
  actualizado: '2026-10-11',
} as const satisfies ModuloPagina;

// ── Piezas propias de la portada (no forman parte de ModuloPagina) ──────────

/** Textos del visual 3D del hero (HeroVisual). Las tarjetas siguen el mismo ejemplo del recorrido. */
export const visualHero = {
  etiqueta:
    'Ilustración: un núcleo de cristal recibe búsquedas que llegan desde Google y asistentes de IA, y envía respuestas por WhatsApp, también un domingo en la noche.',
  consulta: { titulo: 'Alguien busca su servicio', detalle: '«contador tributario en Bogotá»' },
  respuesta: {
    titulo: 'Respuesta por WhatsApp',
    detalle: `${CONVERSACION_DEMO.mensajes[0].separador}, ${CONVERSACION_DEMO.mensajes[1].hora}`,
  },
} as const;

/**
 * Recorrido fijo de la portada (src/components/paginas/inicio/Recorrido.astro, con data-historia):
 * encuentran su empresa → entienden qué ofrece → reciben respuesta.
 * Todo es un ejemplo con la misma firma contable ficticia de la sección «whatsapp».
 */
export const recorrido = {
  id: 'recorrido',
  etiqueta: 'Cómo funciona',
  titulo: 'Encuentran su empresa, entienden qué ofrece y reciben respuesta',
  resaltado: 'reciben respuesta',
  introduccion:
    'Su web, Google y WhatsApp trabajan con la misma información, revisada y aprobada por usted. Este es el recorrido de un cliente nuevo, con una firma contable ficticia como ejemplo.',
  rotulo: 'Ejemplo con una firma contable ficticia',
  etiquetaPasos: 'Recorrido de un cliente nuevo',
  etiquetaVisual:
    'Ilustración de ejemplo en tres pantallas: una búsqueda que muestra la página de una firma contable ficticia, la página web de esa firma y una conversación de WhatsApp en la que el agente de IA responde un domingo en la noche.',
  pasos: [
    {
      paso: '01',
      titulo: 'Encuentran su empresa',
      texto:
        'Alguien busca su servicio en Google o le pregunta a un asistente de IA. Su web tiene la información ordenada: qué hace, para quién, dónde y las preguntas frecuentes. Sin promesas de primer lugar.',
      icono: icono('search'),
    },
    {
      paso: '02',
      titulo: 'Entienden qué ofrece',
      texto:
        'Al entrar, la persona entiende qué hace su empresa, para quién y cómo empezar, en el celular o en el computador. El botón de WhatsApp y el formulario le facilitan el contacto.',
      icono: icono('monitor'),
    },
    {
      paso: '03',
      titulo: 'Reciben respuesta',
      texto:
        'Si le escriben un domingo en la noche, el agente de IA que Meta ofrece en WhatsApp Business responde con la información que usted aprobó y deja el caso listo para que su equipo lo retome en horario de trabajo.',
      icono: icono('message'),
    },
  ],
  empresa: { nombre: CONVERSACION_DEMO.titulo, iniciales: 'FC', ciudad: 'Bogotá', estado: CONVERSACION_DEMO.estado },
  busqueda: {
    consulta: 'contador para declaración de renta en Bogotá',
    rotulo: 'Resultados de la búsqueda',
    titulo: 'Declaración de renta para personas naturales',
    descripcion: 'Para empleados, independientes y pensionados. Revisamos si usted debe declarar y cuál es su fecha.',
    preguntas: ['¿Quién debe declarar renta?', '¿Cuándo vence mi declaración?'],
    sello: 'Información clara y ordenada',
  },
  web: {
    etiqueta: 'Firma contable en Bogotá',
    titulo: 'Declaración de renta para personas naturales',
    chips: ['Empleados', 'Independientes', 'Pensionados'],
    botonWhatsApp: 'Escribir por WhatsApp',
    botonFormulario: 'Formulario de contacto',
    anotaciones: { que: 'Qué hace', quien: 'Para quién', como: 'Cómo empezar' },
  },
  chat: {
    autor: 'Agente de IA',
    autorPersona: 'Persona de la firma',
    mensajes: [CONVERSACION_DEMO.mensajes[0], CONVERSACION_DEMO.mensajes[1]],
    traspaso: 'Una persona de la firma retoma el caso el lunes',
    /** Mensaje del lunes (persona de la firma). Solo se ve si la pantalla es alta. */
    seguimiento: CONVERSACION_DEMO.mensajes[8],
  },
  // La aclaración de horario va una sola vez en la portada: en la sección «whatsapp».
  nota: 'El agente es una función de Meta: primero verificamos que su cuenta tenga acceso.',
} as const;
