// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /asistente-whatsapp-business/ (servicio: configuración del agente de IA
//  de Meta en WhatsApp Business).
//  Palabra clave principal: «configurar agente IA WhatsApp Business».
//  Fuentes: informe del Director (2026-10-05: «El servicio de WhatsApp», «Procedimiento del
//  agente», «Protección de datos») y fuentes oficiales de Meta y WhatsApp verificadas el
//  2026-10-06 (al final). Solo se afirma lo que dicen esas fuentes.
//
//  REGLAS DE ESTA PÁGINA:
//  - El agente es de Meta. Nunca «nuestro chatbot», «chatbot personalizado» ni «asistente propio».
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

const URL_META_PRODUCTO = 'https://whatsappbusiness.com/products/business-app-ai-agent/';
const URL_META_PRODUCTO_ES = 'https://whatsappbusiness.com/es-la/products/business-app-ai-agent/';
const URL_AYUDA = 'https://faq.whatsapp.com/291930066973116/';
const URL_META_ONE = 'https://whatsappbusiness.com/products/business-app-meta-one/';

const MENSAJE_WHATSAPP = 'Hola, quiero saber si mi WhatsApp Business puede usar el agente de IA de Meta.';

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
  nota: 'Ejemplo ilustrativo con una firma ficticia, no de un cliente real. Las respuestas reales dependen de la información que su empresa apruebe y de las funciones que Meta habilite en su cuenta.',
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
    // 44 caracteres + « | VRS Digital» (Seo.astro) = 58.
    titulo: 'Configurar agente de IA de WhatsApp Business',
    descripcion:
      'Configuramos el agente de IA que Meta ofrece en WhatsApp Business: datos de su negocio, tono, pruebas y paso a una persona. Sin API ni CRM. Consulte si aplica.',
    palabraClave: 'configurar agente IA WhatsApp Business',
    // «agente de IA de WhatsApp Business», «Meta Business Agent» y «cómo automatizar respuestas»
    // son búsquedas informativas: las atiende la guía /recursos/agente-ia-whatsapp-business/.
    secundarias: [
      'asistente de WhatsApp para empresas',
      'atención inteligente WhatsApp',
      'configuración del agente de IA de WhatsApp Business',
    ],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Atención inteligente en WhatsApp Business', ruta: '/asistente-whatsapp-business/' },
  ],
  hero: {
    etiqueta: 'Atención inteligente en WhatsApp Business',
    titulo: 'Configuramos el agente de IA de WhatsApp Business para su empresa',
    subtitulo:
      'Meta ofrece un agente de inteligencia artificial dentro de la app WhatsApp Business. Nosotros preparamos la información de su empresa, lo configuramos, lo probamos y definimos cuándo debe pasarle la conversación a usted.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Preguntar por WhatsApp', href: enlaceWhatsApp(MENSAJE_WHATSAPP) },
    puntos: ['Función oficial de Meta, sin programación', 'Verificamos su cuenta antes de cobrar el agente', 'Sin API, CRM ni chatbot a medida'],
    precio: `Plan ${atencion.nombre} desde ${desde('atencion')}`,
  },
  respuestaDirecta:
    'Meta ofrece dentro de la app WhatsApp Business un agente de inteligencia artificial (Meta Business Agent) que responde a sus clientes con la información que usted le da. VRS Digital no creó esa tecnología: verificamos si su cuenta tiene acceso, organizamos la información de su negocio, lo configuramos, lo probamos y definimos cuándo debe pasarle la conversación a usted.',
  // Fecha AAAA-MM-DD: la plantilla la muestra como «Información verificada el 6 de octubre de 2026».
  // (Antes era una frase y se leía «Información verificada el Información sobre Meta…».) Que Meta
  // cambia nombres, funciones y precios ya lo dice la tarjeta «Cambios» de #depende-de-meta.
  verificado: '2026-10-06',
  secciones: [
    {
      id: 'que-es',
      etiqueta: 'Qué es',
      // H2 comercial: «Qué es el agente de IA de WhatsApp Business» es el título de la guía.
      titulo: 'El agente de IA de Meta que configuramos en su WhatsApp Business',
      tipo: 'texto',
      parrafos: [
        'Es una función de Meta disponible dentro de la app WhatsApp Business. Meta la presentó en junio de 2026 con el nombre Meta Business Agent. Responde los mensajes de sus clientes con la información de su empresa y no requiere programación.',
        'Según Meta, aprende de su página de Facebook, de sus chats anteriores de WhatsApp y de su sitio web. Usted también puede cargarle catálogos, listas de precios, documentos y fotos, y decidir con qué información aprende.',
      ],
      destacado: {
        titulo: 'Nuestro servicio, en una frase',
        texto:
          'Configuramos y optimizamos la atención inteligente disponible en WhatsApp Business para que responda preguntas frecuentes, explique sus servicios, comparta información comercial y pida los datos necesarios antes de pasar la conversación a una persona.',
      },
      enlace: { texto: 'Qué es y qué puede hacer: lea la guía completa', href: '/recursos/agente-ia-whatsapp-business/' },
    },
    {
      id: 'ejemplo',
      etiqueta: 'Ejemplo',
      titulo: 'Así se ve una conversación con el agente',
      introduccion:
        'En este ejemplo, una firma contable ficticia configuró el agente para responder lo básico, pedir solo el nombre y pasar el caso a una persona. El agente no da el precio exacto porque la firma no lo autorizó.',
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
      etiqueta: 'Según Meta',
      titulo: 'Qué puede hacer el agente, según Meta',
      introduccion:
        'Esto es lo que Meta describe en su página oficial. Lo que funcione en su cuenta depende de lo que Meta tenga habilitado para ella.',
      tipo: 'lista',
      items: [
        'Responder preguntas sobre horarios, ubicación, productos, servicios y precios.',
        'Recomendar productos o servicios de su catálogo.',
        'Responder sobre descuentos, formas de pago y envíos, con la información que usted autorice.',
        'Pedirle datos al cliente para entender qué necesita (calificar prospectos).',
        'Pasarle a usted los temas complejos o sensibles que usted defina.',
        'Agendar citas, cuando Meta habilite esa función en su cuenta.',
      ],
      nota: ACLARACION_HORARIO,
      enlace: { texto: 'Ver la página oficial de Meta', href: URL_META_PRODUCTO_ES },
    },
    {
      id: 'controles',
      etiqueta: 'Usted tiene el control',
      titulo: 'Lo que usted controla del agente',
      introduccion: 'Meta le da a la empresa estos controles. Los dejamos configurados y le explicamos cómo usarlos.',
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
          texto: 'Puede activarlo por chat o para todos, y desconectarlo por completo desde las herramientas de la app.',
          icono: icono('lock'),
        },
      ],
    },
    {
      id: 'alcance',
      etiqueta: 'Qué hacemos',
      titulo: 'Qué incluye nuestra configuración y qué no',
      introduccion:
        'Nuestro trabajo es preparar, configurar, probar y ajustar. No desarrollamos software: usamos la función que Meta ya ofrece en su cuenta.',
      tipo: 'comparacion',
      incluye: [
        'Verificación de que su cuenta tenga acceso al agente.',
        'Organización de la información comercial de su empresa.',
        'Optimización del perfil, la descripción, los horarios y el catálogo.',
        'Definición del tono y el estilo de las respuestas.',
        'Preguntas y respuestas frecuentes preparadas con usted.',
        'Carga de enlaces, archivos y políticas, cuando la herramienta lo permita.',
        'Definición de los datos que el agente puede pedir.',
        'Criterios para pasar la conversación a una persona.',
        'Prueba de 25 a 40 preguntas y corrección de las respuestas con problemas.',
        'Manual breve de supervisión.',
        'Optimización inicial durante 30 días.',
        'Revisión de las respuestas del agente cada mes.',
      ],
      noIncluye: [
        'Desarrollo de un chatbot propio o a medida.',
        'Programación de API (conexión técnica entre sistemas).',
        'CRM (programa para gestionar clientes y ventas).',
        'Integración con facturación, inventario, ERP (software de gestión empresarial) u otros programas.',
        'Envíos masivos de mensajes.',
        'Automatización en varios canales.',
        'Garantía de respuestas perfectas.',
        'Garantía de que Meta mantenga la función disponible.',
        'Recuperación de cuentas suspendidas.',
        'Soporte interno de Meta.',
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
      // Antes era la sección «Por qué su web mejora las respuestas del agente».
      parrafos: [
        'Meta indica que el agente aprende de su sitio web. Una web clara, con una página por servicio, precios «desde» y preguntas frecuentes, le da al agente mejor información para responder.',
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
      // Criterios de aprobación (antes, sección aparte «Cuándo lo damos por aprobado»).
      parrafos: [
        'El agente se activa con sus clientes solo si cumple estos criterios: no inventa precios ni políticas, no promete servicios que su empresa no presta, mantiene el tono definido, pide solo los datos necesarios, reconoce lo que no sabe, pasa la conversación a una persona cuando corresponde y no expone información privada. Si una respuesta falla, la corregimos y repetimos la prueba.',
        'Aun así, como toda inteligencia artificial, el agente puede equivocarse. WhatsApp lo advierte: los mensajes generados por IA pueden no ser precisos ni apropiados. Por eso usted puede responder personalmente en cualquier chat.',
      ],
      nota: 'En todos los grupos incluimos errores de ortografía y lenguaje informal, como «ola, q precio tiene?», porque así escriben muchos clientes.',
    },
    {
      id: 'depende-de-meta',
      etiqueta: 'Lo que depende de Meta',
      titulo: 'Lo que depende de Meta, no de nosotros',
      introduccion:
        'El agente es una función de Meta. Su disponibilidad, sus costos y sus reglas los define Meta. Esto es lo que usted debe saber antes de contratar:',
      tipo: 'tarjetas',
      columnas: 2,
      items: [
        {
          titulo: 'Disponibilidad',
          texto:
            'Meta indica que el agente está disponible para empresas elegibles en mercados seleccionados, y que algunas funciones pueden no estar habilitadas para todas. No encontramos una confirmación oficial de Meta para Colombia. Por eso lo verificamos en su cuenta.',
          icono: icono('eye'),
        },
        {
          titulo: 'Costos de Meta',
          texto:
            'Según Meta, la app WhatsApp Business es gratuita y hoy incluye un cupo mensual de respuestas del agente sin costo. Para más respuestas ofrece planes de pago (Meta One), desde US$14,99 al mes según Meta (septiembre de 2026); puede variar por país. Ese costo lo paga usted directamente a Meta y no está en nuestro precio.',
          icono: icono('calculator'),
        },
        {
          titulo: 'Cambios',
          texto:
            'Meta puede cambiar nombres, funciones, condiciones y precios. Por eso el contrato aclara que la activación, la continuidad y los costos futuros del agente dependen de Meta.',
          icono: icono('refresh'),
        },
        {
          titulo: 'Funciones de la app que se afectan',
          texto:
            'Según WhatsApp, activar la IA puede afectar las listas de difusión, los mensajes temporales y la edición o eliminación de mensajes. Se lo explicamos antes de activarla, para que usted decida.',
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
        'Meta informa que recopila los mensajes de los chats donde la IA está conectada para mejorar su inteligencia artificial, incluso si usted silencia el agente. Silenciarlo no detiene esa recopilación.',
        'Por eso no recomendamos activarlo en conversaciones con información de salud, financiera o jurídica sensible, ni usarlo para recibir documentos confidenciales.',
        'Su empresa es responsable de los datos de sus clientes (Ley 1581 de 2012). Le pedimos tener publicada su política de tratamiento de datos, configuramos el agente para pedir solo los datos necesarios y tenemos en cuenta los lineamientos de la Superintendencia de Industria y Comercio (SIC) sobre inteligencia artificial (Circular Externa 002 de 2024).',
        'Las decisiones médicas, legales, contables o financieras siempre requieren la revisión de una persona calificada.',
      ],
    },
    {
      id: 'sin-acceso',
      etiqueta: 'Si su cuenta no tiene acceso',
      titulo: 'Si su WhatsApp todavía no tiene el agente',
      introduccion:
        'Meta está habilitando esta función de forma gradual, por país y por cuenta. Si la suya aún no la tiene, esto es lo que hacemos:',
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
          texto: 'El valor del agente se descuenta o se pospone. Usted no paga por algo que su cuenta no tiene.',
        },
        {
          paso: '03',
          titulo: 'Configuramos las funciones clásicas',
          texto:
            'Perfil de empresa, mensaje de bienvenida, mensaje de ausencia fuera de horario, respuestas rápidas, etiquetas para ordenar sus chats y catálogo de servicios. Son funciones oficiales y gratuitas de la app.',
        },
        {
          paso: '04',
          titulo: 'Activamos el agente después',
          texto: 'Cuando Meta lo habilite en su cuenta, lo configuramos y lo probamos con el mismo procedimiento.',
        },
      ],
    },
    {
      id: 'precio',
      etiqueta: 'Precio',
      titulo: 'Cuánto cuesta la configuración',
      introduccion: `La configuración del agente está incluida en el plan ${atencion.nombre}: desde ${desde('atencion')} al año, o en 12 cuotas de ${cuotaDesde('atencion')} al mes, IVA incluido. El plan incluye también la web y el posicionamiento.`,
      tipo: 'planes',
      compacto: true,
      nota: 'Los costos de Meta, si los hay, los paga usted directamente a Meta y no están incluidos en nuestro precio. Licencias y suscripciones externas se identifican por separado.',
      enlace: { texto: 'Ver qué incluye cada plan', href: '/precios/#plan-atencion' },
    },
  ],
  // Preguntas sobre el SERVICIO de configuración. Las informativas sobre el agente (qué es, si está
  // en Colombia, cuánto cobra Meta, datos, intervenir o apagarlo) las responde la guía
  // /recursos/agente-ia-whatsapp-business/ y las secciones visibles de esta página.
  preguntas: [
    {
      pregunta: '¿VRS Digital creó este agente de IA?',
      respuesta:
        'No. El agente es una tecnología de Meta. Nuestro trabajo es configurarlo bien: organizamos la información de su empresa, definimos el tono, preparamos respuestas de ejemplo, fijamos qué datos puede pedir y cuándo debe pasarle la conversación, y lo probamos antes de activarlo. No es un chatbot a medida ni requiere API, CRM o integraciones.',
    },
    {
      pregunta: '¿Qué pasa si mi WhatsApp Business no tiene acceso al agente?',
      respuesta:
        'Meta lo habilita de forma gradual, por país y por cuenta, y en octubre de 2026 no encontramos una confirmación oficial para Colombia. Por eso lo verificamos en su cuenta durante el diagnóstico, antes de cobrarle este componente. Si no tiene acceso, entregamos la web y el posicionamiento, descontamos o posponemos el valor del agente y configuramos las funciones clásicas de la app.',
    },
    {
      pregunta: '¿Los costos de Meta están incluidos en su precio?',
      respuesta:
        'No. Según Meta, hoy el agente se puede usar cada mes sin costo hasta un cupo de respuestas incluido, y para más respuestas ofrece planes de pago llamados Meta One, desde US$14,99 al mes según su anuncio de septiembre de 2026. Ese costo lo contrata y lo paga usted directamente a Meta, y Meta puede cambiarlo. Nuestro precio cubre la preparación, la configuración, las pruebas y los ajustes.',
    },
    {
      pregunta: '¿El agente responde las 24 horas?',
      respuesta: `Puede responder a cualquier hora, también fuera de su horario, mientras esté activo y Meta mantenga la función disponible. Eso no significa soporte humano permanente: nuestro acompañamiento es de ${minuscula(CONTACTO.horario)}. ${CONTACTO.respuestaHumana} Los casos delicados quedan para usted o su equipo.`,
    },
    {
      pregunta: '¿El agente de IA se puede equivocar?',
      respuesta:
        'Sí. Como toda inteligencia artificial, puede equivocarse, y Meta lo advierte. Por eso lo probamos con 25 a 40 preguntas antes de activarlo, limitamos los temas que puede responder y definimos cuáles debe pasarle a usted. Además, usted puede responder personalmente en cualquier chat: cuando lo hace, el agente deja de responder en esa conversación.',
    },
    {
      pregunta: '¿Qué información necesitan de mi empresa para configurarlo?',
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
    titulo: 'Verifiquemos si su WhatsApp Business ya puede usar el agente',
    texto:
      'Empiece con una revisión digital gratuita: analizamos su web, su visibilidad en Google y su atención por WhatsApp, y le entregamos tres prioridades concretas. En el diagnóstico verificamos si su cuenta tiene acceso al agente.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Precios del plan Web + Atención Inteligente', href: '/precios/' },
    { texto: 'Diseño de páginas web en Bogotá para empresas', href: '/paginas-web-bogota/' },
    { texto: 'Posicionamiento en Google y asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
    { texto: 'Guía: qué puede hacer el agente de IA de WhatsApp Business', href: '/recursos/agente-ia-whatsapp-business/' },
  ],
  fuentes: [
    {
      titulo: 'Be There for Every Customer With Meta Business Agent (Meta Newsroom, 3 de junio de 2026)',
      url: 'https://about.fb.com/news/2026/06/meta-business-agent/',
      idioma: 'en',
    },
    { titulo: 'Meta Business Agent en WhatsApp (página oficial, en español)', url: URL_META_PRODUCTO_ES },
    { titulo: 'Meta Business Agent on WhatsApp (página oficial, en inglés)', url: URL_META_PRODUCTO, idioma: 'en' },
    { titulo: 'About using business AI to chat with customers (Centro de ayuda de WhatsApp)', url: URL_AYUDA, idioma: 'en' },
    { titulo: 'Meta One on WhatsApp Business App (página oficial)', url: URL_META_ONE, idioma: 'en' },
    {
      titulo: 'Introducing Meta One: A Subscription Service With More Features and AI (Meta Newsroom, 15 de septiembre de 2026)',
      url: 'https://about.fb.com/news/2026/09/introducing-meta-one-subscription-service-more-features-ai/',
      idioma: 'en',
    },
    { titulo: 'Business App Features (página oficial de WhatsApp Business)', url: 'https://whatsappbusiness.com/products/business-app-features/', idioma: 'en' },
    {
      titulo: 'Circular Externa 002 de 2024: datos personales en sistemas de inteligencia artificial (SIC)',
      url: 'https://sedeelectronica.sic.gov.co/sites/default/files/normativa/Circular%20Externa%20No.%20002%20del%2021%20de%20agosto%20de%202024.pdf',
    },
  ],
  /**
   * Datos para servicio() de @/lib/schema. Sin precioDesde: el precio publicado es del plan
   * completo (web + posicionamiento + agente), no de la configuración sola. No usar
   * SoftwareApplication ni Product: darían a entender un software propio.
   */
  servicio: {
    nombre: 'Configuración del agente de IA de WhatsApp Business',
    tipo: 'Configuración de funciones de Meta en WhatsApp Business',
    descripcion:
      'Configuración del agente de IA que Meta ofrece en la app WhatsApp Business: información del negocio, tono, pruebas y criterios para pasar la conversación a una persona.',
    audiencia: 'Empresas de servicios',
  },
  actualizado: '2026-10-11',
} as const satisfies ModuloPagina;
