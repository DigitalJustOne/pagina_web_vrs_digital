// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /paginas-web-empresas-servicios/ (sector general: empresas de servicios).
//  Palabra clave principal: «página web para empresas de servicios».
//  Fuentes: informe del Director (2026-10-05: sectores prioritarios, capacidad, servicio de
//  WhatsApp, exclusiones), src/data/sitio.ts e investigación verificada el 2026-10-06.
//  Precios, proceso, condiciones y contacto salen de sitio.ts: no los copie a mano.
//
//  REGLAS DE ESTA PÁGINA:
//  - No prometer especialización que no existe: las páginas por sector y los ejemplos de VRS se
//    concentran en firmas contables y consultores. Para abogados, inmobiliarias, servicios
//    técnicos y empresas B2B se adapta la misma estructura; se dice así, sin rodeos.
//  - Sin cifras de mercado ni casos de esos sectores: no hay casos documentados de VRS en ellos.
//  - SST se trata en /paginas-web-consultores/#sst (una sola URL por intención).
//  EDICIÓN FINAL (2026-10-06): H1 y descripción sin «en Bogotá» para no competir con
//  /paginas-web-bogota/ («diseño de páginas web Bogotá»). Se quitaron las preguntas de precio
//  y de «sin acceso al agente», que ya responden /paginas-web-bogota/ y /asistente-whatsapp-business/.
//  DISEÑO DE PÁGINA (2026-10-06, grupo servicios): la lista de #estructura vive en ESTRUCTURA
//  (la usan la sección, la portada y el esquema). Exports `antesDespues` (ilustración deslizable
//  de la portada: fallas de #problema y títulos de ESTRUCTURA) y `anatomiaPagina` (texto
//  alternativo del esquema de #estructura). TEXTO NUEVO: lo debe revisar la Dirección.
// ─────────────────────────────────────────────────────────────────────────────
import { CONTACTO, CTA_PRINCIPAL, PLANES, PROCESO, enlaceWhatsApp, formatoCOP, type IdPlan, cuotaMensual } from '@/data/sitio';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;
const plan = (id: IdPlan) => PLANES.find((p) => p.id === id)!;
const desde = (id: IdPlan) => formatoCOP(plan(id).precioAnualDesde);
const cuotaDesde = (id: IdPlan) => formatoCOP(cuotaMensual(plan(id).precioAnualDesde));
/** Pasa a minúscula la primera letra, salvo en siglas (PSE, SST). */
const minuscula = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

const esencial = plan('esencial');
const visible = plan('visible');
const atencion = plan('atencion');

/** Aclaración obligatoria cerca de cualquier mención de «a cualquier hora» o «fuera de horario». */
const ACLARACION_HORARIO = `El agente puede responder a cualquier hora. Nuestro acompañamiento humano es de ${minuscula(CONTACTO.horario)}. ${CONTACTO.respuestaHumana}`;

const MENSAJE_WHATSAPP = 'Hola, tengo una empresa de servicios y quiero una revisión digital con VRS Digital.';

/** Lo que debe tener la web de una empresa de servicios (sección #estructura y su ilustración). */
const ESTRUCTURA = [
  { titulo: 'Respuesta directa arriba', texto: 'Qué hace, para quién, dónde y desde cuánto, en dos a cuatro frases.' },
  { titulo: 'Una página por servicio', texto: 'Qué incluye, qué no, para quién es, cuánto tarda y cómo se cotiza.' },
  { titulo: 'Cómo trabaja', texto: 'Los pasos desde el primer contacto hasta la entrega, con lo que aporta el cliente.' },
  { titulo: 'Precio o forma de cotizar', texto: 'Un valor «desde» o una explicación clara de qué lo hace variar.' },
  { titulo: 'Pruebas reales', texto: 'Casos y reseñas auténticas, con autorización del cliente. Nunca inventadas.' },
  { titulo: 'Quién está detrás', texto: 'Las personas responsables, con credenciales que se puedan verificar.' },
  { titulo: 'Preguntas frecuentes reales', texto: 'Las que sus clientes hacen por WhatsApp, respondidas con claridad.' },
  { titulo: 'Contacto visible', texto: 'WhatsApp y un formulario corto, con política de tratamiento de datos publicada.' },
] as const;

/**
 * Textos de la ilustración «antes y después» de la portada (deslizable). Las fallas resumen
 * #problema; las mejoras son los títulos de #estructura (ESTRUCTURA). Es una web ficticia.
 */
export const antesDespues = {
  etiqueta:
    'Ilustración: la web de una empresa de servicios antes y después de ordenarla. Antes: todos los servicios en una sola página, sin precio «desde», un formulario con demasiados datos y un WhatsApp que no se ve. Después: respuesta directa arriba, una página por servicio, precio o forma de cotizar y contacto visible.',
  antes: 'Antes',
  despues: 'Después',
  fallas: ['Todos los servicios en una sola página', 'Sin precio «desde»', 'Formulario con demasiados datos', 'WhatsApp que no se ve'],
  mejoras: [ESTRUCTURA[0].titulo, ESTRUCTURA[1].titulo, ESTRUCTURA[3].titulo, ESTRUCTURA[7].titulo],
  control: 'Comparar la web antes y después: mueva la división',
  pista: 'Ilustración · Deslice para comparar',
} as const;

/** Texto alternativo del esquema de #estructura: una web con sus ocho partes numeradas. */
export const anatomiaPagina = {
  etiqueta: `Ilustración: una web de servicios con sus ocho partes numeradas en el orden de la lista: ${ESTRUCTURA.map((p, i) => `${i + 1}, ${p.titulo.charAt(0).toLowerCase()}${p.titulo.slice(1)}`).join('; ')}.`,
} as const;

export const contenido = {
  ruta: '/paginas-web-empresas-servicios/',
  seo: {
    // 45 caracteres + « | VRS Digital» (Seo.astro) = 59.
    titulo: 'Página web para empresas de servicios y pymes',
    descripcion:
      'Página web para empresas de servicios profesionales: abogados, inmobiliarias, SST y servicios técnicos. Explique qué hace y cuánto cuesta empezar. Vea cómo.',
    palabraClave: 'página web para empresas de servicios',
    // «páginas web para empresas» y «diseño de páginas web Bogotá» → /paginas-web-bogota/.
    secundarias: [
      'página web para servicios profesionales',
      'página web para abogados',
      'página web para inmobiliarias',
      'página web para empresas de servicios técnicos',
    ],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Empresas de servicios', ruta: '/paginas-web-empresas-servicios/' },
  ],
  hero: {
    etiqueta: 'Sectores',
    titulo: 'Páginas web para empresas de servicios profesionales',
    subtitulo:
      'Un servicio no se ve ni se toca. Su web debe explicar qué hace, para quién, cómo trabaja y cuánto cuesta empezar, y facilitar que le escriban. Nosotros la diseñamos, la preparamos para Google y ordenamos su atención por WhatsApp.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver precios y planes', href: '/precios/' },
    precio: `Desde ${desde('esencial')}`,
    puntos: ['Una página por cada servicio', 'Precio «desde» y proceso claros', 'Atención directa con el fundador'],
  },
  respuestaDirecta: `Una empresa de servicios vende algo que no se ve. Su web debe explicar qué hace, para quién, cómo trabaja y cuánto cuesta empezar. VRS Digital diseña esa web desde ${desde('esencial')} al año, o en 12 cuotas de ${cuotaDesde('esencial')} al mes, IVA incluido, la prepara para Google y asistentes de IA y, en el plan ${atencion.nombre}, configura el agente de IA de WhatsApp Business para responder preguntas frecuentes.`,
  secciones: [
    {
      id: 'problema',
      etiqueta: 'El problema',
      titulo: 'Por qué una empresa de servicios necesita una web distinta',
      introduccion:
        'Quien compra un producto puede verlo. Quien contrata un servicio compra una promesa, y antes de escribir quiere entender qué recibe. Revise si su web tiene alguna de estas fallas frecuentes:',
      tipo: 'lista',
      variante: 'alerta',
      items: [
        'La web lista servicios, pero no explica qué incluye cada uno ni para quién es.',
        'Todos los servicios están en una sola página, y ni el cliente ni Google saben cuál es el principal.',
        'No hay un precio «desde» ni una explicación de cómo se cotiza.',
        'El número de WhatsApp no se ve o no hay mensaje de ausencia fuera de horario.',
        'El formulario pide demasiados datos y la persona se va antes de enviarlo.',
        'Las mismas preguntas llegan por WhatsApp todos los días y se responden a mano, horas o días después.',
      ],
    },
    {
      id: 'sectores',
      etiqueta: 'Sectores',
      titulo: 'Sectores con los que trabajamos',
      introduccion:
        'Nuestras páginas por sector y nuestros ejemplos se concentran en firmas contables y consultores. También trabajamos con otras empresas de servicios: partimos de la misma estructura y la adaptamos con su información. No le vendemos una especialización que no tenemos.',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Firmas contables y tributarias',
          texto: 'Servicios para personas y empresas, contenido para cada temporada tributaria y consultas por WhatsApp ordenadas.',
          icono: icono('calculator'),
          href: '/paginas-web-contadores/',
        },
        {
          titulo: 'Consultores y capacitadores',
          texto: 'Especialidad, método, entregables y casos reales, con una forma sencilla de pedir propuesta.',
          icono: icono('briefcase'),
          href: '/paginas-web-consultores/',
        },
        {
          titulo: 'Seguridad y salud en el trabajo (SST)',
          texto: 'Licencia visible, estándares mínimos explicados y contenido antes de cada fecha de registro.',
          icono: icono('shield'),
          href: '/paginas-web-consultores/#sst',
        },
        {
          titulo: 'Abogados y firmas jurídicas pequeñas',
          texto:
            'Áreas de práctica, a quién atiende y cómo es la primera consulta. El agente de WhatsApp no da orientación jurídica: los casos pasan a un abogado.',
          icono: icono('scale'),
        },
        {
          titulo: 'Inmobiliarias pequeñas',
          texto:
            'Inmuebles, zonas, requisitos para arrendar y horarios de visita. El agente puede mostrar lo que usted carga en el catálogo; la visita la confirma una persona.',
          icono: icono('home'),
        },
        {
          titulo: 'Servicios técnicos para empresas',
          texto:
            'Cobertura, tipos de equipo, cómo se cotiza y tiempos de visita. El agente reúne los datos de la solicitud; las urgencias pasan a una persona.',
          icono: icono('wrench'),
        },
      ],
      nota: 'También atendemos agencias, profesionales independientes y empresas que venden a otras empresas. En el diagnóstico le decimos con franqueza si nuestro servicio le sirve.',
    },
    {
      id: 'estructura',
      etiqueta: 'Qué debe tener',
      titulo: 'Qué debe tener la web de una empresa de servicios',
      introduccion: 'Sea cual sea su sector, una buena web de servicios responde lo mismo, en este orden:',
      tipo: 'lista',
      items: ESTRUCTURA,
      nota: 'Esta misma estructura ayuda a Google y a los asistentes de inteligencia artificial (IA) a entender qué ofrece su empresa. Nadie puede garantizar una posición, pero una web clara es la base.',
      enlace: { texto: 'Ver cómo trabajamos el posicionamiento', href: '/posicionamiento-google-inteligencia-artificial/' },
    },
    {
      id: 'whatsapp',
      etiqueta: 'Atención por WhatsApp',
      titulo: 'WhatsApp: respuestas inmediatas para lo repetitivo, una persona para lo importante',
      introduccion:
        'El agente de IA de WhatsApp Business es una función de Meta dentro de la app. Nosotros la configuramos con la información que su empresa aprueba. Esto puede hacer y esto no:',
      tipo: 'comparacion',
      etiquetaIncluye: 'El agente puede',
      etiquetaNoIncluye: 'Siempre pasa a una persona',
      incluye: [
        'Responder sobre servicios, horarios, cobertura y formas de pago.',
        'Compartir precios «desde» que usted autorice.',
        'Recomendar servicios o productos de su catálogo.',
        'Pedir los datos necesarios para entender la solicitud.',
        'Pasarle la conversación a usted cuando el tema lo requiera.',
      ],
      noIncluye: [
        'Asesoría jurídica, contable, médica o técnica sobre un caso concreto.',
        'Cotizaciones finales, descuentos y negociaciones.',
        'Recibir documentos o datos sensibles.',
        'Urgencias, quejas y clientes que piden hablar con alguien.',
      ],
      parrafos: [
        'Meta habilita el agente de forma gradual, por país y por cuenta, y lo verificamos en el diagnóstico. Si su cuenta aún no lo tiene, configuramos las funciones clásicas de la app: bienvenida, ausencia, respuestas rápidas, etiquetas y catálogo.',
        'Meta informa que usa los mensajes de los chats donde el agente está activo para mejorar su inteligencia artificial. Por eso no lo recomendamos para conversaciones con información de salud, financiera o jurídica sensible.',
        ACLARACION_HORARIO,
      ],
      enlace: { texto: 'Ver el servicio de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    },
    {
      id: 'proceso',
      etiqueta: 'Cómo trabajamos',
      titulo: 'Cómo trabajamos, paso a paso',
      introduccion: 'Cinco etapas con una sola persona responsable. Usted revisa y aprueba antes de que publiquemos.',
      tipo: 'pasos',
      items: PROCESO,
    },
    {
      id: 'precio',
      etiqueta: 'Precio',
      titulo: 'Cuánto cuesta la web de una empresa de servicios',
      introduccion: `La web sola, ${esencial.nombre}, cuesta desde ${desde('esencial')} al año, o en 12 cuotas de ${cuotaDesde('esencial')} al mes, IVA incluido. Con una página por servicio y seguimiento en Google, ${visible.nombre} empieza en ${desde('visible')}. Con el agente de IA de WhatsApp Business configurado, ${atencion.nombre} empieza en ${desde('atencion')}.`,
      tipo: 'planes',
      compacto: true,
      nota: 'Licencias y suscripciones externas, incluidos los costos de Meta, se identifican por separado. El valor final depende del alcance y queda por escrito antes de empezar.',
      enlace: { texto: 'Ver precios completos y condiciones', href: '/precios/' },
    },
    {
      id: 'que-no-hacemos',
      etiqueta: 'Fuera de alcance',
      titulo: 'Lo que no incluye nuestro servicio',
      introduccion: 'Preferimos decirlo desde el principio. Estos trabajos no hacen parte de nuestros planes:',
      tipo: 'lista',
      variante: 'excluye',
      items: [
        'CRM (programa para gestionar clientes y ventas) ni chatbots desarrollados a medida.',
        'API (conexión técnica entre sistemas) ni integraciones con facturación, inventario u otros programas.',
        'Envíos masivos de mensajes.',
        'Primer lugar garantizado en Google o menciones garantizadas en asistentes de IA.',
      ],
    },
  ],
  preguntas: [
    {
      pregunta: '¿Qué debe tener la página web de una empresa de servicios?',
      respuesta:
        'Una respuesta clara arriba: qué hace, para quién, dónde y desde cuánto. Luego, una página por servicio con lo que incluye y lo que no, cómo trabaja, cómo se cotiza, pruebas reales, quién está detrás, preguntas frecuentes y un contacto visible por WhatsApp y formulario. Así el cliente entiende qué recibe antes de escribirle.',
    },
    {
      pregunta: '¿Trabajan con abogados, inmobiliarias o empresas de servicios técnicos?',
      respuesta:
        'Sí. Nuestras páginas por sector y nuestros ejemplos se concentran en firmas contables y consultores, pero la estructura de una buena web de servicios es la misma. La adaptamos con la información de su empresa y usted revisa que el contenido cumpla las reglas de su profesión. En el diagnóstico le decimos con franqueza si nuestro servicio le sirve.',
    },
    {
      pregunta: '¿El agente de WhatsApp puede dar orientación legal o técnica a mis clientes?',
      respuesta:
        'No debe hacerlo. Lo configuramos para responder información general que usted aprueba, como servicios, horarios, cobertura y precios «desde». Cuando alguien pide orientación sobre su caso, el agente le pasa la conversación a una persona. WhatsApp advierte que los mensajes generados por IA pueden no ser precisos, por eso los temas delicados siempre los atiende alguien de su equipo.',
    },
    {
      pregunta: '¿Necesito un CRM, una API o un chatbot a medida?',
      respuesta:
        'Para empezar, no. Nuestro servicio usa su web y la app WhatsApp Business con el agente de IA que Meta ofrece, sin programación. No vendemos CRM, API ni chatbots desarrollados a medida, ni integraciones con otros sistemas. Para la mayoría de pymes de servicios, una web clara y un WhatsApp bien configurado resuelven lo principal.',
    },
    {
      pregunta: '¿Cómo es el proceso para tener mi página web?',
      respuesta:
        'Son cinco etapas: diagnóstico, con una reunión de hasta 45 minutos; preparación de la estructura y los textos, que usted revisa en un documento; construcción; aprobación; y publicación. Trabajamos con máximo dos proyectos a la vez, así que la fecha de inicio se asigna según disponibilidad y queda por escrito.',
    },
  ],
  cta: {
    titulo: 'Descubra qué está frenando la presencia digital de su empresa',
    texto:
      'Solicite una revisión digital gratuita. Analizamos su web, su visibilidad en Google y su atención por WhatsApp, y le entregamos tres prioridades concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Diseño de páginas web en Bogotá para empresas', href: '/paginas-web-bogota/' },
    { texto: 'Páginas web para contadores y firmas contables', href: '/paginas-web-contadores/' },
    { texto: 'Páginas web para consultores, capacitadores y asesores SST', href: '/paginas-web-consultores/' },
    { texto: 'Configuración del agente de IA de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Precios, condiciones y formas de pago', href: '/precios/' },
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
  ],
  fuentes: [
    { titulo: 'About using business AI to chat with customers (Centro de ayuda de WhatsApp)', url: 'https://faq.whatsapp.com/291930066973116/', idioma: 'en' },
    { titulo: 'Meta Business Agent en WhatsApp (página oficial, español)', url: 'https://whatsappbusiness.com/es-la/products/business-app-ai-agent/' },
  ],
  /** Datos para servicio() de @/lib/schema. El precio sale de sitio.ts. */
  servicio: {
    nombre: 'Páginas web para empresas de servicios',
    tipo: 'Diseño y desarrollo de páginas web',
    descripcion:
      'Páginas web para empresas de servicios profesionales: una página por servicio, precio «desde», proceso claro y contacto por WhatsApp, preparadas para Google y asistentes de IA.',
    precioDesde: esencial.precioAnualDesde,
    audiencia: 'Empresas de servicios',
  },
  actualizado: '2026-10-11',
} as const satisfies ModuloPagina;
