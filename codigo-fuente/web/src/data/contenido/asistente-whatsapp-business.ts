// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /asistente-whatsapp-business/ (servicio: atención inteligente en WhatsApp Business).
//  Palabra clave principal: «atención inteligente WhatsApp Business».
//
//  CLARIDAD (2026-10-19, GUIA-CLARIDAD.md): en palabras simples, el servicio son respuestas
//  automáticas en el WhatsApp Business de la empresa. Nunca la palabra «agente»: se dice «la
//  atención inteligente» o «las respuestas automáticas». Lo que recibe el cliente sale del plan
//  'atencion' de PLANES (sitio.ts): queEs, incluye y noIncluye. Nada escrito a mano.
//
//  DECISIÓN DE VÍCTOR (2026-10-18): la web NO explica cómo se hace el trabajo. Esta página no
//  nombra a Meta. Se mantiene lo que protege al cliente (Ley 1480 y 1581), dicho UNA vez cada uno:
//  - la IA puede equivocarse → tarjeta en #antes-de-contratar;
//  - no todas las cuentas son compatibles → tarjeta en #antes-de-contratar (y la pregunta de qué
//    pasa en ese caso);
//  - el plan de pago de WhatsApp va aparte → tarjeta en #antes-de-contratar;
//  - qué pasa con los datos → sección #privacidad.
//  #antes-de-contratar tiene enlaces desde otras páginas (precios.ts): no cambiar su id.
//
//  REGLAS DE ESTA PÁGINA:
//  - Nunca «nuestro chatbot», «chatbot personalizado», «asistente propio» ni «IA propia».
//  - No afirmar que está disponible en Colombia.
//  - No prometer agendamiento ni resúmenes como funciones garantizadas: no están en todas las cuentas.
//  - Revisar cada trimestre: WhatsApp cambia nombres, funciones y precios con frecuencia.
//
//  PENDIENTE DE LA DIRECCIÓN:
//  - Si se puede contratar solo la atención inteligente (sin web). Hoy va en el plan Web + Atención
//    Inteligente.
//  - Si las respuestas básicas (cuando la cuenta no es compatible) van sin costo adicional.
// ─────────────────────────────────────────────────────────────────────────────
import { CONTACTO, CTA_PRINCIPAL, PLANES, enlaceWhatsApp, formatoCOP, type IdPlan } from '@/data/sitio';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;
const plan = (id: IdPlan) => PLANES.find((p) => p.id === id)!;
const desde = (id: IdPlan) => formatoCOP(plan(id).precioAnualDesde);
/** Pasa a minúscula la primera letra, salvo en siglas (PSE, SST). */
const minuscula = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

const atencion = plan('atencion');

const MENSAJE_WHATSAPP = 'Hola, quiero saber si mi WhatsApp Business puede tener atención inteligente.';

/** Conversación de ejemplo (firma ficticia): la usan la sección #ejemplo y la ilustración de la portada. */
const CONVERSACION_EJEMPLO = {
  titulo: 'Firma contable (ejemplo)',
  estado: 'Cuenta de empresa',
  mensajes: [
    {
      de: 'cliente',
      hora: '9:42 p. m.',
      texto: 'Buenas noches. ¿Ustedes hacen la declaración de renta para independientes? ¿Cuánto cuesta?',
    },
    {
      de: 'asistente',
      hora: '9:42 p. m.',
      texto:
        'Buenas noches. Sí, la firma hace la declaración de renta de independientes. El valor depende de sus ingresos y soportes. ¿Me comparte su nombre para que una persona le confirme el valor?',
    },
    { de: 'cliente', hora: '9:43 p. m.', texto: 'Andrea Gómez' },
    {
      de: 'asistente',
      hora: '9:43 p. m.',
      texto: 'Gracias, Andrea. Dejé su consulta lista. La firma le escribe en horario de oficina, de lunes a viernes.',
    },
    {
      de: 'persona',
      separador: 'Al día siguiente',
      hora: '8:15 a. m.',
      texto:
        'Buenos días, Andrea. Ya leí su consulta. ¿Este año tuvo ingresos solo como independiente o también como empleada?',
    },
  ],
  nota: 'Ejemplo con una firma inventada, no con un cliente real.',
} as const;

const MENSAJE_AUTOMATICO = CONVERSACION_EJEMPLO.mensajes.find((m) => m.de === 'asistente')!;
const MENSAJE_PERSONA = CONVERSACION_EJEMPLO.mensajes.find((m) => m.de === 'persona')!;

/**
 * Textos de la ilustración de la portada: un teléfono dentro de un anillo de 24 horas. Las
 * respuestas automáticas contestan a cualquier hora; una persona continúa en su horario. Horas y
 * rótulos salen de la conversación de ejemplo. Los nombres de las claves (agente, autorAgente…) los
 * usa RelojAtencion.astro: no cambiarlos aquí.
 */
export const relojAtencion = {
  etiqueta: `Ilustración: un teléfono con una conversación de WhatsApp Business, rodeado por un reloj de 24 horas. A las ${MENSAJE_AUTOMATICO.hora} contesta la respuesta automática; ${MENSAJE_PERSONA.separador?.toLowerCase()}, a las ${MENSAJE_PERSONA.hora}, sigue una persona del equipo.`,
  agente: { hora: MENSAJE_AUTOMATICO.hora, titulo: 'Contesta la respuesta automática', detalle: 'Fuera de horario' },
  persona: { hora: MENSAJE_PERSONA.hora, titulo: 'Sigue una persona', detalle: MENSAJE_PERSONA.separador ?? '' },
  separador: MENSAJE_PERSONA.separador ?? '',
  /** Rótulos sobre las burbujas (los mismos de la conversación de ejemplo). */
  autorAgente: 'Respuesta automática',
  autorPersona: 'Persona del equipo',
  leyendaAgente: 'Respuestas automáticas: a cualquier hora',
  leyendaEquipo: 'Su equipo: en su horario de atención',
  /** Rótulos de las horas del anillo (6 a. m., 12 m., 6 p. m.). */
  horas: { manana: '6 a. m.', mediodia: '12 m.', tarde: '6 p. m.', medianoche: '12 a. m.' },
} as const;

export const contenido = {
  ruta: '/asistente-whatsapp-business/',
  seo: {
    // 41 caracteres + « | VRS Digital» (Seo.astro) = 55.
    titulo: 'Atención inteligente en WhatsApp Business',
    // 140 caracteres.
    descripcion:
      'Respuestas automáticas en el WhatsApp Business de su empresa, a cualquier hora y con la información que usted aprueba. Lo difícil pasa a usted.',
    palabraClave: 'atención inteligente WhatsApp Business',
    secundarias: [
      'asistente de WhatsApp para empresas',
      'respuestas automáticas WhatsApp Business',
      'inteligencia artificial WhatsApp Business',
    ],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Atención inteligente en WhatsApp Business', ruta: '/asistente-whatsapp-business/' },
  ],
  hero: {
    etiqueta: 'Atención inteligente en WhatsApp Business',
    titulo: 'Atención inteligente en WhatsApp Business para su empresa',
    subtitulo:
      'Su WhatsApp Business contesta por sí mismo las preguntas de siempre, también de noche. Lo que necesita una persona, se lo pasa a usted.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Preguntar por WhatsApp', href: enlaceWhatsApp(MENSAJE_WHATSAPP) },
    puntos: ['Responde a cualquier hora', 'Revisamos su cuenta antes de cobrar', 'Usted decide qué responde'],
    precio: `Plan ${atencion.nombre} desde ${desde('atencion')}`,
  },
  respuestaDirecta:
    'La atención inteligente son respuestas automáticas en el WhatsApp Business de su empresa. Contestan con la información que usted aprueba: servicios, horarios, precios y cómo empezar. Usted decide qué datos piden y cuándo pasa la conversación a una persona.',
  secciones: [
    {
      id: 'ejemplo',
      etiqueta: 'Ejemplo',
      titulo: 'Así se ve una conversación',
      introduccion: 'Una firma contable inventada recibe un mensaje de noche, fuera de su horario:',
      tipo: 'conversacion',
      puntos: [
        `Contesta a las ${MENSAJE_AUTOMATICO.hora} con la información que la firma aprobó.`,
        'Pide solo el nombre.',
        'No da el precio exacto, porque la firma no lo autorizó.',
        'Deja el caso listo para que una persona siga.',
      ],
      conversacion: CONVERSACION_EJEMPLO,
    },
    {
      id: 'que-puede-hacer',
      etiqueta: 'Qué hace',
      titulo: 'Qué puede hacer por su empresa',
      tipo: 'lista',
      items: [
        'Contestar sobre horarios, ubicación, productos, servicios y precios.',
        'Recomendar productos o servicios de su catálogo.',
        'Contestar sobre descuentos, formas de pago y envíos, si usted lo autoriza.',
        'Pedirle datos al cliente para entender qué necesita.',
        'Pasarle a usted los temas difíciles o delicados.',
        'Agendar citas, si su cuenta tiene esa función.',
      ],
    },
    {
      id: 'controles',
      etiqueta: 'Usted tiene el control',
      titulo: 'Lo que usted controla',
      tipo: 'tarjetas',
      columnas: 2,
      items: [
        {
          titulo: 'Cómo habla',
          texto: 'Usted elige el tono. Si una respuesta no le gusta, se reescribe.',
          icono: icono('message'),
        },
        {
          titulo: 'A quién responde',
          texto: 'A todos sus clientes, solo a los nuevos o solo a quienes llegan por sus anuncios.',
          icono: icono('users'),
        },
        {
          titulo: 'Qué le pasa a usted',
          texto: 'Usted elige los temas que siempre atiende una persona, como quejas o casos delicados.',
          icono: icono('shield'),
        },
        {
          titulo: 'Responder usted o apagar',
          texto: 'Si usted escribe en un chat, las respuestas automáticas paran ahí hasta que las active de nuevo. Puede apagarlas del todo cuando quiera.',
          icono: icono('lock'),
        },
      ],
    },
    {
      id: 'alcance',
      etiqueta: 'Qué recibe',
      titulo: 'Qué recibe y qué no',
      introduccion: `${atencion.queEs} Esto es lo que hacemos en su WhatsApp:`,
      tipo: 'comparacion',
      incluye: atencion.incluye,
      noIncluye: atencion.noIncluye,
    },
    {
      id: 'informacion',
      etiqueta: 'Lo que necesitamos',
      titulo: 'Qué información nos da usted',
      introduccion: 'Las respuestas salen de esta información. Usted la llena en un formulario y aprueba por escrito lo que cargamos:',
      tipo: 'lista',
      items: [
        'Qué hace su empresa.',
        'Sus servicios y para quién son.',
        'Horarios y zonas donde atiende.',
        'Precios que se pueden decir.',
        'Formas de pago.',
        'Reglas de cambios, cancelaciones y garantías.',
        'Las preguntas que más le hacen.',
        'Los casos que siempre atiende una persona.',
        'Lo que nunca se debe decir.',
        'Los datos que se le pueden pedir al cliente.',
      ],
      parrafos: ['También usa su web. Por eso va en el mismo plan: una web clara da mejores respuestas.'],
    },
    {
      id: 'pruebas',
      etiqueta: 'Pruebas',
      titulo: 'Cómo probamos el servicio antes de activarlo',
      introduccion:
        'Le hacemos de 25 a 40 preguntas de prueba, según el tamaño de su negocio. Esta es la base, con 30 preguntas:',
      tipo: 'tabla',
      columnas: ['Grupo', 'Preguntas', 'Qué comprobamos', 'Ejemplo'],
      filas: [
        ['Preguntas normales', '10', 'Que conteste bien lo básico: servicios, horarios, ubicación y cómo empezar.', '«¿Qué servicios ofrecen?»'],
        ['Preguntas confusas', '5', 'Que pregunte en vez de suponer.', '«¿Cuánto vale?», sin decir qué servicio.'],
        ['Lo que usted no vende', '5', 'Que no invente servicios que su empresa no tiene.', '«¿Ustedes también venden computadores?»'],
        ['Precios', '5', 'Que use solo los precios autorizados y no prometa descuentos.', '«¿Me lo deja más barato si pago hoy?»'],
        ['Hablar con una persona', '5', 'Que pase la conversación a una persona cuando toca.', '«Quiero hablar con alguien» o «Tengo una queja».'],
      ],
      parrafos: [
        'Las preguntas traen errores de ortografía, como «ola, q precio tiene?», porque así escriben muchos clientes.',
        'Solo la activamos si no inventa, pide pocos datos, reconoce lo que no sabe y no muestra información privada. Si una respuesta falla, la corregimos y repetimos la prueba.',
      ],
    },
    {
      id: 'antes-de-contratar',
      etiqueta: 'Antes de contratar',
      titulo: 'Lo que debe saber antes de contratar',
      tipo: 'tarjetas',
      columnas: 2,
      items: [
        {
          titulo: 'Puede equivocarse',
          texto: 'Como toda inteligencia artificial, puede contestar mal. Por eso la probamos antes y usted puede responder en cualquier chat.',
          icono: icono('eye'),
        },
        {
          titulo: 'No todas las cuentas sirven',
          texto: 'No todas las cuentas de WhatsApp Business tienen esta función. Revisamos la suya antes de cobrar.',
          icono: icono('shield'),
        },
        {
          titulo: 'El plan de pago de WhatsApp va aparte',
          texto:
            'WhatsApp da cada mes un cupo gratis de respuestas automáticas. Si necesita más, WhatsApp cobra un plan que usted le paga directamente. Ese costo no está en nuestro precio.',
          icono: icono('calculator'),
        },
        {
          titulo: 'WhatsApp puede cambiar',
          texto:
            'WhatsApp puede cambiar la función o sus precios; eso no depende de nosotros. Además, al activarla pueden cambiar las listas de difusión, los mensajes temporales y la edición o borrado de mensajes.',
          icono: icono('refresh'),
        },
      ],
    },
    {
      id: 'privacidad',
      etiqueta: 'Datos personales',
      titulo: 'Qué pasa con los datos de sus clientes',
      tipo: 'texto',
      parrafos: [
        'WhatsApp informa que puede usar los mensajes de los chats con respuestas automáticas para mejorar sus servicios, aunque usted las silencie.',
        'Por eso no recomendamos usarlas en chats sobre salud, dinero o asuntos legales delicados, ni para recibir documentos confidenciales.',
        'Las decisiones médicas, legales, contables o de dinero siempre las debe revisar una persona experta.',
        'Su empresa responde por los datos de sus clientes (Ley 1581 de 2012). Le pedimos tener publicada su política de datos. Las respuestas piden solo los datos necesarios. Seguimos la guía de la Superintendencia de Industria y Comercio (Circular Externa 002 de 2024).',
      ],
    },
    {
      id: 'precio',
      etiqueta: 'Precio',
      titulo: 'Cuánto cuesta',
      introduccion: `Las respuestas automáticas vienen en el plan ${atencion.nombre}, junto con su web.`,
      tipo: 'planes',
      compacto: true,
      enlace: { texto: 'Ver qué incluye cada plan', href: '/precios/#plan-atencion' },
    },
  ],
  preguntas: [
    {
      pregunta: '¿Qué pasa si mi WhatsApp Business no es compatible?',
      respuesta:
        'Le entregamos su web completa y descontamos o posponemos el valor de las respuestas automáticas. Dejamos listo lo básico: mensaje de bienvenida, mensaje fuera de horario, respuestas rápidas y catálogo. Cuando su cuenta tenga la función, la activamos y la probamos igual.',
    },
    {
      pregunta: '¿Responde las 24 horas?',
      respuesta: `Sí, contesta a cualquier hora mientras esté activa. Nuestro equipo atiende ${minuscula(CONTACTO.horario)}. ${CONTACTO.respuestaHumana}`,
    },
  ],
  cta: {
    titulo: 'Revisemos la atención de su WhatsApp Business',
    texto:
      'Empiece con una revisión gratuita de su web, de cómo sale en Google y de su WhatsApp. Le entregamos tres cosas concretas para mejorar.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Precios del plan Web + Atención Inteligente', href: '/precios/' },
    { texto: 'Diseño de páginas web en Bogotá para empresas', href: '/paginas-web-bogota/' },
    { texto: 'Aparecer en Google y en asistentes como ChatGPT', href: '/posicionamiento-google-inteligencia-artificial/' },
  ],
  fuentes: [
    {
      titulo: 'Circular Externa 002 de 2024: datos personales en sistemas de inteligencia artificial (SIC)',
      url: 'https://sedeelectronica.sic.gov.co/sites/default/files/normativa/Circular%20Externa%20No.%20002%20del%2021%20de%20agosto%20de%202024.pdf',
    },
  ],
  /**
   * Datos para servicio() de @/lib/schema. Sin precioDesde: el precio publicado es del plan
   * completo (web + Google + atención inteligente). No usar SoftwareApplication ni Product: darían
   * a entender un software propio.
   */
  servicio: {
    nombre: 'Atención inteligente en WhatsApp Business',
    tipo: 'Respuestas automáticas en WhatsApp Business',
    descripcion:
      'Respuestas automáticas en el WhatsApp Business de la empresa, con la información que aprueba, probadas antes de activarlas y con paso a una persona.',
    audiencia: 'Empresas de servicios',
  },
  actualizado: '2026-10-19',
} as const satisfies ModuloPagina;
