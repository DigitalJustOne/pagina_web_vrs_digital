// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /contacto/.
//  Fuentes: informe del Director (2026-10-05: "Oferta de entrada", "Embudo sencillo",
//  "Proceso de entrega", "Capacidad y límites") y src/data/sitio.ts (CONTACTO, FORMA_DE_PAGO).
//  El formulario es la isla src/components/islas/Formulario.tsx (Formspree).
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Confirmar en cuánto tiempo se entrega la revisión (hoy solo se promete la primera
//    respuesta en uno o dos días hábiles, como dice CONTACTO.respuestaHumana).
//  - Confirmar si el WhatsApp de VRS Digital tendrá activo el agente de Meta. Si se activa,
//    hay que decirlo en esta página (el visitante debe saber que le responde una IA).
//  - El formulario enlaza /politica-de-privacidad/, que sigue en borrador (falta la validación
//    del abogado y los datos de identificación).
//  EDICIÓN FINAL (2026-10-06): se quitó «¿Trabajan con empresas fuera de Bogotá?» porque
//  repetía «¿Dónde está ubicado VRS Digital?» de /nosotros/. El formulario también pide el plan.
// ─────────────────────────────────────────────────────────────────────────────
import { CONTACTO, CTA_PRINCIPAL, FORMA_DE_PAGO, enlaceWhatsApp } from '@/data/sitio';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;
const minuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);
const anticipo = FORMA_DE_PAGO[0].porcentaje;

const MENSAJE_WHATSAPP = 'Hola, quiero solicitar una revisión digital gratuita para mi empresa.';

export const contenido = {
  ruta: '/contacto/',
  seo: {
    // 41 caracteres + « | VRS Digital» = 55. «Gratuita» y «sin compromiso» van en título, descripción y respuesta.
    titulo: 'Revisión digital gratuita para su empresa',
    descripcion:
      'Revisión gratuita y sin compromiso: analizamos su web, su visibilidad en Google y su WhatsApp, y le entregamos tres prioridades concretas para mejorar.',
    palabraClave: 'revisión de presencia digital',
    secundarias: [
      'contacto VRS Digital',
      'diagnóstico de página web',
      'revisión de página web Bogotá',
      'mejorar atención por WhatsApp',
    ],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Contacto', ruta: '/contacto/' },
  ],
  hero: {
    etiqueta: 'Contacto',
    titulo: 'Solicite su revisión digital gratuita',
    subtitulo:
      'Analizamos su página web, su visibilidad en Google y su atención por WhatsApp, y le entregamos tres prioridades concretas para mejorar. Es gratuita, sencilla y sin compromiso de contratar.',
    ctaPrincipal: { texto: 'Ir al formulario', href: '#formulario' },
    ctaSecundario: { texto: 'Escribir por WhatsApp', href: enlaceWhatsApp(MENSAJE_WHATSAPP) },
  },
  respuestaDirecta:
    'La revisión digital gratuita de VRS Digital analiza la claridad de su página web, su visibilidad en Google, cómo se ve en el celular, sus formas de contacto y su atención por WhatsApp. Usted recibe tres prioridades concretas. Es gratuita y sin compromiso de contratar. Una persona le responde en uno o dos días hábiles, de lunes a viernes.',
  secciones: [
    {
      id: 'que-revisamos',
      etiqueta: 'La revisión',
      titulo: 'Qué revisamos de su empresa',
      introduccion: 'Cinco puntos que deciden si un cliente lo encuentra, entiende lo que ofrece y logra contactarlo.',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Claridad de la web',
          texto: 'Si su página dice en pocos segundos qué hace, para quién, dónde y cómo empezar.',
          icono: icono('eye'),
        },
        {
          titulo: 'Visibilidad básica',
          texto: 'Cómo aparece su empresa cuando la buscan en Google y qué información encuentran los asistentes de IA.',
          icono: icono('search'),
        },
        {
          titulo: 'Experiencia en celular',
          texto: 'Si su web se lee bien, carga rápido y es fácil de usar desde el celular.',
          icono: icono('monitor'),
        },
        {
          titulo: 'Formas de contacto',
          texto: 'Si es fácil escribirle o llamarlo, y si el botón de WhatsApp y el formulario funcionan.',
          icono: icono('check'),
        },
        {
          titulo: 'Atención por WhatsApp',
          texto: 'Cómo se responden hoy las preguntas frecuentes y qué pasa con los mensajes que llegan fuera de horario.',
          icono: icono('message'),
        },
      ],
    },
    {
      id: 'que-recibe',
      etiqueta: 'Resultado',
      titulo: 'Qué recibe: tres prioridades concretas',
      tipo: 'lista',
      introduccion: 'No es un informe largo ni una lista de cien errores. Es una guía corta para decidir por dónde empezar.',
      items: [
        'Tres mejoras concretas para su empresa, explicadas en lenguaje sencillo.',
        'Por qué importa cada una para que sus clientes lo encuentren, le entiendan o le escriban.',
        'Qué conviene hacer primero, aunque decida hacerlo por su cuenta o con otro proveedor.',
      ],
      nota: 'La prepara Víctor Ramírez con apoyo de inteligencia artificial y la revisa personalmente. Si su necesidad está fuera de lo que hacemos (por ejemplo, un CRM, una API o un chatbot a medida), se lo decimos desde el principio.',
    },
    {
      id: 'que-pasa-despues',
      etiqueta: 'Siguientes pasos',
      titulo: 'Qué pasa después de escribirnos',
      tipo: 'pasos',
      items: [
        {
          paso: '01',
          titulo: 'Usted nos escribe',
          texto: 'Por el formulario o por WhatsApp. Solo le pedimos los datos necesarios para responderle.',
        },
        {
          paso: '02',
          titulo: 'Le respondemos',
          texto: `Una persona le responde, de ${minuscula(CONTACTO.horario)}.`,
        },
        {
          paso: '03',
          titulo: 'Recibe la revisión',
          texto: 'Le enviamos qué mejorar primero en su web, su visibilidad y su atención por WhatsApp.',
        },
        {
          paso: '04',
          titulo: 'Diagnóstico, si quiere avanzar',
          texto: 'Reunión de hasta 45 minutos para confirmar el alcance y verificar si su WhatsApp Business tiene acceso al agente de IA de Meta.',
        },
        {
          paso: '05',
          titulo: 'Propuesta y fecha de inicio',
          texto: `Le enviamos una propuesta con máximo tres opciones. Si la acepta, el proyecto inicia con el ${anticipo}\u00a0% del valor y una fecha según disponibilidad.`,
        },
      ],
    },
    {
      id: 'formulario',
      etiqueta: 'Formulario',
      titulo: 'Cuéntenos sobre su empresa',
      introduccion:
        'Nombre, empresa, WhatsApp, el plan que le interesa (o «Aún no sé») y una descripción breve de lo que necesita. El correo y la dirección de su web son opcionales, pero nos ayudan a preparar la revisión.',
      tipo: 'formulario',
      nota: 'Usamos sus datos solo para responder su solicitud, con su autorización y según la Ley 1581 de 2012 de protección de datos personales.',
      enlacePrivacidad: { texto: 'Política de privacidad', href: '/politica-de-privacidad/' },
    },
    {
      id: 'canales',
      etiqueta: 'Canales',
      titulo: 'Horarios y canales de atención',
      tipo: 'contacto',
      canales: [
        {
          nombre: 'WhatsApp',
          valor: CONTACTO.whatsappVisible,
          href: enlaceWhatsApp(MENSAJE_WHATSAPP),
        },
        {
          nombre: 'Correo',
          valor: CONTACTO.correo,
          href: `mailto:${CONTACTO.correo}`,
        },
      ],
      horario: CONTACTO.horario,
      respuestaHumana: CONTACTO.respuestaHumana,
      redes: CONTACTO.redes,
      parrafos: [
        'Si escribe de noche o el fin de semana, ese plazo empieza a contar el siguiente día hábil.',
        'La atención las 24 horas corresponde al agente de WhatsApp que configuramos para su empresa, no a nuestra atención personal.',
      ],
    },
    {
      id: 'antes-de-escribir',
      etiqueta: 'Alcance',
      titulo: 'Antes de escribirnos',
      tipo: 'lista',
      introduccion: 'Trabajamos con empresas y profesionales de servicios. Para ahorrarle tiempo, esto es lo que no hacemos:',
      variante: 'excluye',
      items: [
        'Chatbots desarrollados a medida.',
        'Sistemas de gestión de clientes (CRM).',
        'Conexiones técnicas entre programas (API) ni integraciones con facturación, inventario u otros sistemas.',
        'Envíos masivos de mensajes.',
      ],
      nota: 'Trabajamos con un máximo de dos proyectos al mismo tiempo. La fecha de inicio se asigna según disponibilidad.',
    },
  ],
  preguntas: [
    {
      pregunta: '¿La revisión digital tiene algún costo?',
      respuesta:
        'No. La revisión no tiene costo ni lo obliga a contratar. La ofrecemos a empresas y profesionales de servicios cuyo caso encaje con lo que hacemos: páginas web, posicionamiento en Google y asistentes de IA, WhatsApp Business y mantenimiento. Si su necesidad está fuera de ese alcance, se lo decimos desde el principio.',
    },
    {
      pregunta: '¿En cuánto tiempo me responden?',
      respuesta: `Una persona le responde en uno o dos días hábiles. Atendemos de ${minuscula(CONTACTO.horario)}. Si escribe de noche o el fin de semana, el plazo empieza a contar el siguiente día hábil. No ofrecemos atención humana las 24 horas.`,
    },
    {
      pregunta: '¿Qué datos debo enviar para pedir la revisión?',
      respuesta:
        'Su nombre, el nombre de su empresa, un número de WhatsApp, el plan que le interesa o «Aún no sé», y una descripción breve de lo que necesita. El correo y la dirección de su web son opcionales, pero nos ayudan a preparar la revisión. Usamos sus datos solo para responderle, con su autorización.',
    },
    {
      pregunta: '¿Necesito tener página web para pedir la revisión?',
      respuesta:
        'No. Si aún no tiene página web, revisamos cómo lo encuentran hoy sus clientes: en Google, en redes sociales y por WhatsApp. La revisión le indicará por dónde empezar. Si ya tiene página, revisamos además su claridad, cómo se ve en el celular y qué tan fácil es contactarlo.',
    },
    {
      pregunta: '¿Qué pasa si quiero avanzar después de la revisión?',
      respuesta: `Agendamos una reunión de diagnóstico de hasta 45 minutos para confirmar el alcance y verificar si su WhatsApp Business tiene acceso al agente de IA de Meta. Luego le enviamos una propuesta con máximo tres opciones. Si la acepta, el proyecto inicia con el ${anticipo}\u00a0% del valor y una fecha asignada según disponibilidad.`,
    },
    {
      pregunta: '¿Cuándo podríamos empezar mi proyecto?',
      respuesta:
        'Depende de la disponibilidad. Trabajamos con un máximo de dos proyectos al mismo tiempo para cuidar la calidad, así que la fecha de inicio se asigna según el cupo y se confirma junto con la propuesta. Si hoy no hay cupo, se lo decimos con claridad y le proponemos una fecha.',
    },
  ],
  cta: {
    titulo: 'Descubra qué está frenando la presencia digital de su empresa',
    texto: 'Escríbanos por el formulario o por WhatsApp. La revisión es gratuita y sin compromiso.',
    ctaPrincipal: { texto: CTA_PRINCIPAL.texto, href: '#formulario' },
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Precios y qué incluye cada plan', href: '/precios/' },
    { texto: 'Configuración del agente de IA de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Proyectos de páginas web y plataformas', href: '/proyectos/' },
    { texto: 'Quién está detrás de VRS Digital', href: '/nosotros/' },
  ],
  actualizado: '2026-10-11',
} as const satisfies ModuloPagina;
