// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /asistente-whatsapp-business/ (servicio: atención inteligente en WhatsApp Business).
//  Palabra clave principal: «atención inteligente WhatsApp Business».
//
//  DECISIÓN DE VÍCTOR (2026-10-18): la web NO explica cómo se hace el trabajo. No decir que el
//  servicio es «configurar el agente de IA que Meta ofrece», ni «función de Meta», ni «cuando su
//  cuenta tiene acceso», ni citar páginas de Meta. Se habla del resultado para el cliente. Se
//  mantiene lo que lo protege: nunca decir que VRS creó la tecnología (no «nuestro chatbot» ni
//  «IA propia»), avisar que no todas las cuentas son compatibles, que hay costos externos si
//  superan el cupo gratuito, que la IA puede equivocarse y qué pasa con los datos.
//  Fuentes: informe del Director (2026-10-05: «El servicio de WhatsApp», «Procedimiento del
//  agente», «Protección de datos») y fuentes oficiales de Meta y WhatsApp verificadas el
//  2026-10-06 (al final). Solo se afirma lo que dicen esas fuentes.
//
//  REGLAS DE ESTA PÁGINA:
//  - Nunca «nuestro chatbot», «chatbot personalizado», «asistente propio» ni «IA propia».
//  - No afirmar que está disponible en Colombia: no hay confirmación oficial de Meta.
//  - No usar la tarifa de US$2 por millón de tokens: es de la API (WhatsApp Business Platform),
//    que VRS Digital no vende. El costo de la app se explica con el cupo gratuito y Meta One.
//  - No prometer «lista de casos que necesitan atención», agendamiento ni el resumen matutino
//    como funciones garantizadas: no están confirmados para todas las cuentas.
//  - Revisar cada trimestre: Meta cambia nombres, funciones y precios con frecuencia.
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Si se puede contratar solo la configuración de WhatsApp (sin web). Hoy la página dice
//    que está incluida en el plan Web + Atención Inteligente.
//  - Si la configuración de las funciones clásicas (bienvenida, ausencia, respuestas rápidas,
//    etiquetas y catálogo) va sin costo adicional cuando la cuenta no tiene acceso al agente.
//  - El informe pide «prueba de 25 a 40 preguntas» y a la vez una batería mínima de 30.
//    Aquí se publica «de 25 a 40» y la distribución base de 30.
//  EDICIÓN FINAL (2026-10-06): título a 58 caracteres con la marca; «Silenciarlo no detiene esa
//  recopilación» en lugar de «solo desconectarlo detiene ese uso» (inferencia no textual de Meta);
//  preguntas centradas en el servicio, sin repetir las de la guía ni las de /precios/.
//  DISEÑO DE PÁGINA (2026-10-06, grupo servicios): la conversación de ejemplo vive en
//  CONVERSACION_EJEMPLO y la sección #ejemplo va justo después de #que-es, con cuatro puntos que
//  leen el ejemplo. Export `relojAtencion` con los rótulos del visual de portada (horas tomadas
//  del ejemplo). `verificado` pasa a fecha ISO (antes era una frase y la plantilla la rompía).
//  TEXTO NUEVO: lo debe revisar la Dirección.
// ─────────────────────────────────────────────────────────────────────────────
import { CONTACTO, CTA_PRINCIPAL, PLANES, enlaceWhatsApp, formatoCOP, type IdPlan, cuotaMensual } from '@/data/sitio';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;
const plan = (id: IdPlan) => PLANES.find((p) => p.id === id)!;
const desde = (id: IdPlan) => formatoCOP(plan(id).precioAnualDesde);
const cuotaDesde = (id: IdPlan) => formatoCOP(cuotaMensual(plan(id).precioAnualDesde));
/** Pasa a minúscula la primera letra, salvo en siglas (PSE, SST). */
const minuscula = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

const atencion = plan('atencion');

/** Aclaración obligatoria cerca de cualquier mención de «a cualquier hora» o «24/7». */
const ACLARACION_HORARIO = `El agente puede responder a cualquier hora. Nuestro acompañamiento humano es de ${minuscula(CONTACTO.horario)}. ${CONTACTO.respuestaHumana}`;

const MENSAJE_WHATSAPP = 'Hola, quiero saber si mi WhatsApp Business puede tener atención inteligente.';

/** Conversación de ejemplo (firma ficticia): la usan la sección #ejemplo y la ilustración de la portada. */
const CONVERSACION_EJEMPLO = {
  titulo: 'Firma contable (ejemplo)',
  estado: 'Cuenta de empresa',
  mensajes: [
    {
      de: 'cliente',
      hora: '9:42\u00a0p.\u00a0m.',
      texto: 'Buenas noches. ¿Ustedes hacen la declaración de renta para independientes? ¿Cuánto cuesta?',
    },
    {
      de: 'asistente',
      hora: '9:42\u00a0p.\u00a0m.',
      texto:
        'Buenas noches. Sí, la firma prepara la declaración de renta de personas naturales, incluidos independientes. El valor depende de sus ingresos y de los soportes que tenga. ¿Me comparte su nombre para que una persona de la firma le confirme el valor exacto?',
    },
    { de: 'cliente', hora: '9:43\u00a0p.\u00a0m.', texto: 'Andrea Gómez' },
    {
      de: 'asistente',
      hora: '9:43\u00a0p.\u00a0m.',
      texto: 'Gracias, Andrea. Dejé su consulta lista para la firma. Le escribirán en horario de oficina, de lunes a viernes.',
    },
    {
      de: 'persona',
      separador: 'Al día siguiente',
      hora: '8:15\u00a0a.\u00a0m.',
      texto:
        'Buenos días, Andrea. Ya leí su consulta. Para darle el valor exacto, ¿me confirma si este año tuvo ingresos solo como independiente o también como empleada?',
    },
  ],
  nota: 'Ejemplo ilustrativo con una firma ficticia, no de un cliente real. Las respuestas reales dependen de la información que su empresa apruebe y de las funciones disponibles en su cuenta.',
} as const;

const MENSAJE_AGENTE = CONVERSACION_EJEMPLO.mensajes.find((m) => m.de === 'asistente')!;
const MENSAJE_PERSONA = CONVERSACION_EJEMPLO.mensajes.find((m) => m.de === 'persona')!;

/**
 * Textos de la ilustración de la portada: un teléfono dentro de un anillo de 24 horas. El agente
 * puede responder a cualquier hora; una persona continúa en su horario. Horas y rótulos salen de la
 * conversación de ejemplo. El arco «su equipo» es ilustrativo: cada empresa define su horario.
 */
export const relojAtencion = {
  etiqueta: `Ilustración: un teléfono con una conversación de WhatsApp Business, rodeado por un anillo de 24 horas. A las ${MENSAJE_AGENTE.hora} responde el agente de IA; ${MENSAJE_PERSONA.separador?.toLowerCase()}, a las ${MENSAJE_PERSONA.hora}, continúa una persona del equipo.`,
  agente: { hora: MENSAJE_AGENTE.hora, titulo: 'Responde el agente de IA', detalle: 'Fuera de horario' },
  persona: { hora: MENSAJE_PERSONA.hora, titulo: 'Continúa una persona', detalle: MENSAJE_PERSONA.separador ?? '' },
  separador: MENSAJE_PERSONA.separador ?? '',
  /** Rótulos sobre las burbujas (los mismos de la conversación de ejemplo). */
  autorAgente: 'Agente de IA',
  autorPersona: 'Persona del equipo',
  leyendaAgente: 'Agente de IA: puede responder a cualquier hora',
  leyendaEquipo: 'Su equipo: en su horario de atención',
  /** Rótulos de las horas del anillo (6 a. m., 12 m., 6 p. m.). */
  horas: { manana: '6\u00a0a.\u00a0m.', mediodia: '12 m.', tarde: '6\u00a0p.\u00a0m.', medianoche: '12\u00a0a.\u00a0m.' },
} as const;

export const contenido = {
  ruta: '/asistente-whatsapp-business/',
  seo: {
    // 41 caracteres + « | VRS Digital» (Seo.astro) = 55.
    titulo: 'Atención inteligente en WhatsApp Business',
    descripcion:
      'Su WhatsApp Business responde a sus clientes a cualquier hora con la información de su empresa y le pasa los casos que necesitan una persona.',
    palabraClave: 'atención inteligente WhatsApp Business',
    secundarias: [
      'asistente de WhatsApp para empresas',
      'respuestas automáticas WhatsApp Business',
      'agente de IA WhatsApp Business',
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
      'Su WhatsApp Business responde a sus clientes a cualquier hora, con la información que usted aprueba, y le pasa a usted los casos que necesitan una persona. Lo dejamos listo, probado y ajustado.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Preguntar por WhatsApp', href: enlaceWhatsApp(MENSAJE_WHATSAPP) },
    puntos: ['Responde a cualquier hora', 'Revisamos su cuenta antes de cobrar', 'Usted decide qué responde'],
    precio: `Plan ${atencion.nombre} desde ${desde('atencion')}`,
  },
  respuestaDirecta:
    'Con la atención inteligente de VRS Digital, su WhatsApp Business responde a sus clientes a cualquier hora con la información de su empresa: servicios, horarios, precios autorizados y cómo empezar. Usted define qué puede responder, qué datos puede pedir y cuándo le pasa la conversación a una persona.',
  secciones: [
    {
      id: 'que-es',
      etiqueta: 'Qué es',
      titulo: 'Qué es la atención inteligente en WhatsApp',
      tipo: 'texto',
      parrafos: [
        'Es un asistente de inteligencia artificial que trabaja dentro de su WhatsApp Business. Responde los mensajes de sus clientes con la información de su empresa, a cualquier hora, y le pasa a usted los casos que necesitan una persona.',
        'Aprende de la información que usted aprueba: su catálogo, sus listas de precios, sus documentos, sus fotos y su sitio web.',
      ],
      destacado: {
        titulo: 'Nuestro servicio, en una frase',
        texto:
          'Dejamos su WhatsApp Business respondiendo preguntas frecuentes, explicando sus servicios, compartiendo información comercial y pidiendo los datos necesarios antes de pasar la conversación a una persona.',
      },
    },
    {
      id: 'ejemplo',
      etiqueta: 'Ejemplo',
      titulo: 'Así se ve una conversación con el agente',
      introduccion:
        'En este ejemplo, una firma contable ficticia tiene la atención inteligente lista para responder lo básico, pedir solo el nombre y pasar el caso a una persona. El agente no da el precio exacto porque la firma no lo autorizó.',
      tipo: 'conversacion',
      puntos: [
        `Responde a las ${MENSAJE_AGENTE.hora} con la información que la firma aprobó.`,
        'Pide solo el nombre.',
        'No da el precio exacto, porque la firma no lo autorizó.',
        'Deja el caso listo para que una persona lo continúe.',
      ],
      conversacion: CONVERSACION_EJEMPLO,
    },
    {
      id: 'que-puede-hacer',
      etiqueta: 'Qué hace',
      titulo: 'Qué puede hacer por su empresa',
      introduccion: 'Lo que funcione en su cuenta lo revisamos en el diagnóstico, antes de cobrar.',
      tipo: 'lista',
      items: [
        'Responder preguntas sobre horarios, ubicación, productos, servicios y precios.',
        'Recomendar productos o servicios de su catálogo.',
        'Responder sobre descuentos, formas de pago y envíos, con la información que usted autorice.',
        'Pedirle datos al cliente para entender qué necesita (calificar prospectos).',
        'Pasarle a usted los temas complejos o sensibles que usted defina.',
        'Agendar citas, cuando su cuenta tenga esa función.',
      ],
      nota: ACLARACION_HORARIO,
    },
    {
      id: 'controles',
      etiqueta: 'Usted tiene el control',
      titulo: 'Lo que usted controla',
      introduccion: 'Lo dejamos listo y le explicamos cómo usar cada control.',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Qué sabe',
          texto: 'Usted decide con qué información aprende: su perfil, su catálogo, su sitio web, documentos y respuestas de ejemplo.',
          icono: icono('file'),
        },
        {
          titulo: 'Cómo habla',
          texto: 'Se define el tono de las respuestas. Si una respuesta no le gusta, se puede reescribir.',
          icono: icono('message'),
        },
        {
          titulo: 'A quién responde',
          texto: 'A todos sus clientes, solo a los clientes nuevos o solo a quienes llegan desde sus anuncios.',
          icono: icono('users'),
        },
        {
          titulo: 'Cuándo le pasa la conversación',
          texto: 'Usted define los temas que siempre deben pasar a una persona, como quejas o casos delicados.',
          icono: icono('shield'),
        },
        {
          titulo: 'Intervenir en cualquier chat',
          texto: 'Si usted responde en un chat, el agente deja de responder en ese chat hasta que usted lo reactive.',
          icono: icono('eye'),
        },
        {
          titulo: 'Apagarlo',
          texto: 'Puede activarlo por chat o para todos, y desconectarlo por completo cuando quiera.',
          icono: icono('lock'),
        },
      ],
    },
    {
      id: 'alcance',
      etiqueta: 'Qué hacemos',
      titulo: 'Qué incluye el servicio y qué no',
      introduccion: 'Preparamos, probamos y ajustamos la atención de su WhatsApp Business.',
      tipo: 'comparacion',
      incluye: [
        'Revisión de que su cuenta de WhatsApp Business sea compatible.',
        'Organización de la información comercial de su empresa.',
        'Optimización del perfil, la descripción, los horarios y el catálogo.',
        'Definición del tono y el estilo de las respuestas.',
        'Preguntas y respuestas frecuentes preparadas con usted.',
        'Carga de enlaces, archivos y políticas, cuando su cuenta lo permita.',
        'Definición de los datos que el agente puede pedir.',
        'Criterios para pasar la conversación a una persona.',
        'Prueba de 25 a 40 preguntas y corrección de las respuestas con problemas.',
        'Manual breve de supervisión.',
        'Optimización inicial durante 30 días.',
        'Revisión de las respuestas del agente cada mes.',
      ],
      noIncluye: [
        'Chatbot a medida.',
        'Programación de API (conexión técnica entre sistemas).',
        'CRM (programa para gestionar clientes y ventas).',
        'Integración con facturación, inventario, ERP (software de gestión empresarial) u otros programas.',
        'Envíos masivos de mensajes.',
        'Automatización en varios canales.',
        'Garantía de respuestas perfectas.',
        'Garantía de que WhatsApp mantenga la función disponible.',
        'Recuperación de cuentas suspendidas.',
        'Soporte técnico de WhatsApp.',
      ],
    },
    {
      id: 'informacion',
      etiqueta: 'Lo que necesitamos',
      titulo: 'Qué información necesitamos de su empresa',
      introduccion:
        'El agente responde tan bien como la información que recibe. Se la pedimos en un solo formulario, y usted aprueba por escrito lo que cargamos:',
      tipo: 'lista',
      items: [
        'Descripción del negocio.',
        'Servicios y a quién van dirigidos.',
        'Horarios y zonas de cobertura.',
        'Precios que se pueden comunicar.',
        'Métodos de pago.',
        'Políticas: cambios, cancelaciones, garantías.',
        'Preguntas frecuentes de sus clientes.',
        'Situaciones que siempre debe atender una persona.',
        'Lo que el agente nunca debe afirmar.',
        'Los datos que puede pedirle al cliente.',
      ],
      parrafos: [
        'El agente también aprende de su sitio web. Una web clara, con una página por servicio, precios «desde» y preguntas frecuentes, le da mejor información para responder.',
        `Por eso lo ofrecemos junto con la web en el plan ${atencion.nombre}: la misma información ordenada sirve a Google, a los asistentes de IA y a sus clientes en WhatsApp.`,
      ],
    },
    {
      id: 'pruebas',
      etiqueta: 'Pruebas',
      titulo: 'Cómo lo probamos antes de activarlo',
      introduccion:
        'Antes de que hable con sus clientes, le hacemos de 25 a 40 preguntas de prueba, según el tamaño de su negocio. Esta es la distribución base, con 30 preguntas en cinco grupos:',
      tipo: 'tabla',
      columnas: ['Grupo', 'Preguntas', 'Qué comprobamos', 'Ejemplo'],
      filas: [
        ['Preguntas normales', '10', 'Que responda bien lo básico: servicios, horarios, ubicación y cómo empezar.', '«¿Qué servicios ofrecen?»'],
        ['Preguntas ambiguas', '5', 'Que pida una aclaración en lugar de suponer.', '«¿Cuánto vale?», sin decir qué servicio.'],
        ['Fuera de alcance', '5', 'Que reconozca lo que su empresa no hace y no invente.', '«¿Ustedes también venden computadores?»'],
        ['Precios', '5', 'Que use solo los precios autorizados y no prometa descuentos.', '«¿Me lo deja más barato si pago hoy?»'],
        ['Atención humana', '5', 'Que pase la conversación a una persona cuando corresponde.', '«Quiero hablar con alguien» o «Tengo una queja».'],
      ],
      parrafos: [
        'El agente se activa con sus clientes solo si cumple estos criterios: no inventa precios ni políticas, no promete servicios que su empresa no presta, mantiene el tono definido, pide solo los datos necesarios, reconoce lo que no sabe, pasa la conversación a una persona cuando corresponde y no expone información privada. Si una respuesta falla, la corregimos y repetimos la prueba.',
        'Aun así, como toda inteligencia artificial, el agente puede equivocarse. Por eso usted puede responder personalmente en cualquier chat.',
      ],
      nota: 'En todos los grupos incluimos errores de ortografía y lenguaje informal, como «ola, q precio tiene?», porque así escriben muchos clientes.',
    },
    {
      id: 'antes-de-contratar',
      etiqueta: 'Antes de contratar',
      titulo: 'Lo que debe saber antes de contratar',
      tipo: 'tarjetas',
      columnas: 2,
      items: [
        {
          titulo: 'Cuentas compatibles',
          texto: 'No todas las cuentas de WhatsApp Business tienen esta función todavía. Por eso revisamos la suya antes de cobrar.',
          icono: icono('eye'),
        },
        {
          titulo: 'Costos externos',
          texto:
            'WhatsApp incluye cada mes un cupo de respuestas automáticas sin costo. Si su empresa necesita más, WhatsApp cobra un plan aparte, que usted paga directamente. Se lo informamos antes de activar el servicio.',
          icono: icono('calculator'),
        },
        {
          titulo: 'Cambios',
          texto:
            'WhatsApp puede cambiar funciones, condiciones y precios. Por eso el contrato aclara que la continuidad de la función y sus costos futuros no dependen de nosotros.',
          icono: icono('refresh'),
        },
        {
          titulo: 'Funciones de la app que se afectan',
          texto:
            'Activar la inteligencia artificial puede afectar las listas de difusión, los mensajes temporales y la edición o eliminación de mensajes. Se lo explicamos antes de activarla, para que usted decida.',
          icono: icono('wrench'),
        },
      ],
    },
    {
      id: 'privacidad',
      etiqueta: 'Datos personales',
      titulo: 'Qué pasa con los datos de sus clientes',
      tipo: 'texto',
      parrafos: [
        'WhatsApp informa que puede usar los mensajes de los chats donde la inteligencia artificial está activa para mejorar sus servicios, incluso si usted la silencia.',
        'Por eso no recomendamos activarla en conversaciones con información de salud, financiera o jurídica sensible, ni usarla para recibir documentos confidenciales.',
        'Su empresa es responsable de los datos de sus clientes (Ley 1581 de 2012). Le pedimos tener publicada su política de tratamiento de datos, dejamos el agente pidiendo solo los datos necesarios y tenemos en cuenta los lineamientos de la Superintendencia de Industria y Comercio (SIC) sobre inteligencia artificial (Circular Externa 002 de 2024).',
        'Las decisiones médicas, legales, contables o financieras siempre requieren la revisión de una persona calificada.',
      ],
    },
    {
      id: 'sin-acceso',
      etiqueta: 'Si su cuenta no es compatible',
      titulo: 'Si su cuenta todavía no tiene esta función',
      introduccion: 'Si su WhatsApp Business todavía no la tiene, esto es lo que hacemos:',
      tipo: 'pasos',
      items: [
        {
          paso: '01',
          titulo: 'Entregamos lo demás',
          texto: 'Su web y su posicionamiento se entregan completos, sin ese componente.',
        },
        {
          paso: '02',
          titulo: 'No le cobramos lo que no tiene',
          texto: 'El valor de la atención inteligente se descuenta o se pospone. Usted no paga por algo que su cuenta no tiene.',
        },
        {
          paso: '03',
          titulo: 'Dejamos listas las respuestas básicas',
          texto:
            'Perfil de empresa, mensaje de bienvenida, mensaje de ausencia fuera de horario, respuestas rápidas, etiquetas para ordenar sus chats y catálogo de servicios.',
        },
        {
          paso: '04',
          titulo: 'La activamos después',
          texto: 'Cuando su cuenta tenga la función, la dejamos lista y la probamos con el mismo procedimiento.',
        },
      ],
    },
    {
      id: 'precio',
      etiqueta: 'Precio',
      titulo: 'Cuánto cuesta',
      introduccion: `La atención inteligente en WhatsApp está incluida en el plan ${atencion.nombre}: desde ${desde('atencion')} al año, o en 12 cuotas de ${cuotaDesde('atencion')} al mes, IVA incluido. El plan incluye también la web y el posicionamiento.`,
      tipo: 'planes',
      compacto: true,
      nota: 'Si su empresa necesita un plan de pago de WhatsApp para más respuestas, ese costo se paga aparte y no está incluido en nuestro precio. Licencias y suscripciones externas se identifican por separado.',
      enlace: { texto: 'Ver qué incluye cada plan', href: '/precios/#plan-atencion' },
    },
  ],
  preguntas: [
    {
      pregunta: '¿Qué pasa si mi WhatsApp Business no es compatible?',
      respuesta:
        'Lo revisamos en el diagnóstico, antes de cobrarle este componente. Si su cuenta todavía no tiene la función, entregamos la web y el posicionamiento, descontamos o posponemos ese valor y dejamos listas las respuestas básicas de su WhatsApp Business.',
    },
    {
      pregunta: '¿Hay costos aparte de su precio?',
      respuesta:
        'WhatsApp incluye cada mes un cupo de respuestas automáticas sin costo. Si su empresa recibe muchos mensajes y necesita más, WhatsApp cobra un plan aparte, que usted paga directamente. Se lo informamos antes de activar el servicio. Nuestro precio cubre la preparación, las pruebas y los ajustes.',
    },
    {
      pregunta: '¿El agente responde las 24 horas?',
      respuesta: `Puede responder a cualquier hora, también fuera de su horario, mientras esté activo. Eso no significa soporte humano permanente: nuestro acompañamiento es de ${minuscula(CONTACTO.horario)}. ${CONTACTO.respuestaHumana} Los casos delicados quedan para usted o su equipo.`,
    },
    {
      pregunta: '¿El agente de IA se puede equivocar?',
      respuesta:
        'Sí. Como toda inteligencia artificial, puede equivocarse. Por eso lo probamos con 25 a 40 preguntas antes de activarlo, limitamos los temas que puede responder y definimos cuáles debe pasarle a usted. Además, usted puede responder personalmente en cualquier chat: cuando lo hace, el agente deja de responder en esa conversación.',
    },
    {
      pregunta: '¿Qué información necesitan de mi empresa?',
      respuesta:
        'La descripción de su negocio, sus servicios y a quién van dirigidos, horarios y zonas de cobertura, los precios que se pueden comunicar, los métodos de pago, sus políticas y las preguntas frecuentes de sus clientes. También definimos con usted qué situaciones debe atender una persona, qué no debe afirmar el agente y qué datos puede pedir. Usted aprueba por escrito lo que cargamos.',
    },
    {
      pregunta: '¿Cómo prueban el agente antes de activarlo?',
      respuesta:
        'Le hacemos de 25 a 40 preguntas de prueba: normales, ambiguas, fuera de alcance, sobre precios y pedidos de hablar con una persona, con errores de ortografía y lenguaje informal. Lo aprobamos solo si no inventa precios ni políticas, mantiene el tono, pide pocos datos, reconoce lo que no sabe y pasa la conversación cuando corresponde. Si una respuesta falla, la corregimos y repetimos la prueba.',
    },
  ],
  cta: {
    titulo: 'Revisemos la atención de su WhatsApp Business',
    texto:
      'Empiece con una revisión digital gratuita: analizamos su web, su visibilidad en Google y su atención por WhatsApp, y le entregamos tres prioridades concretas. En el diagnóstico revisamos si su cuenta es compatible.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Precios del plan Web + Atención Inteligente', href: '/precios/' },
    { texto: 'Diseño de páginas web en Bogotá para empresas', href: '/paginas-web-bogota/' },
    { texto: 'Posicionamiento en Google y asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
  ],
  fuentes: [
    {
      titulo: 'Circular Externa 002 de 2024: datos personales en sistemas de inteligencia artificial (SIC)',
      url: 'https://sedeelectronica.sic.gov.co/sites/default/files/normativa/Circular%20Externa%20No.%20002%20del%2021%20de%20agosto%20de%202024.pdf',
    },
  ],
  /**
   * Datos para servicio() de @/lib/schema. Sin precioDesde: el precio publicado es del plan
   * completo (web + posicionamiento + atención inteligente). No usar SoftwareApplication ni
   * Product: darían a entender un software propio.
   */
  servicio: {
    nombre: 'Atención inteligente en WhatsApp Business',
    tipo: 'Atención automatizada en WhatsApp Business',
    descripcion:
      'Atención inteligente en WhatsApp Business: información del negocio, tono, pruebas y criterios para pasar la conversación a una persona.',
    audiencia: 'Empresas de servicios',
  },
  actualizado: '2026-10-18',
} as const satisfies ModuloPagina;
