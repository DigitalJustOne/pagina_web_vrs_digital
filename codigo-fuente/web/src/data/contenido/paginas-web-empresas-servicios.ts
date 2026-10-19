// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /paginas-web-empresas-servicios/ (empresas de servicios en general).
//  Palabra clave principal: «página web para empresas de servicios».
//  Precios, qué incluye y contacto salen de sitio.ts: no los copie a mano.
//  Reglas de texto: GUIA-CLARIDAD.md (palabras simples, frases cortas, un dato en un lugar).
//
//  REGLAS DE ESTA PÁGINA:
//  - No prometer especialización que no existe. Sin menú ni páginas por mercado (Víctor, 2026-10-18).
//  - Sin cifras de mercado ni casos de sectores: no hay casos documentados de VRS en ellos.
//  REPARTO CON /paginas-web-bogota/ (2026-10-19): aquí va qué debe tener la web de una empresa
//  de servicios, cómo se atiende por WhatsApp, el precio y lo que no hacemos. Los pasos, el
//  tiempo de entrega y los proyectos están en /paginas-web-bogota/: no repetirlos aquí.
//  DISEÑO DE PÁGINA: la lista de #estructura vive en ESTRUCTURA (la usan la sección, la portada
//  y el esquema, que dibuja 8 partes: mantenga 8). Exports `antesDespues` (ilustración deslizable
//  de la portada) y `anatomiaPagina` (texto alternativo del esquema de #estructura).
// ─────────────────────────────────────────────────────────────────────────────
import { CONDICIONES, CONTACTO, CTA_PRINCIPAL, PLANES, enlaceWhatsApp, formatoCOP, type IdPlan, cuotaMensual } from '@/data/sitio';
import type { ModuloPagina } from './tipos';

const plan = (id: IdPlan) => PLANES.find((p) => p.id === id)!;
const desde = (id: IdPlan) => formatoCOP(plan(id).precioAnualDesde);
const cuotaDesde = (id: IdPlan) => formatoCOP(cuotaMensual(plan(id).precioAnualDesde));
/** Pasa a minúscula la primera letra, salvo en siglas (PSE, SST). */
const minuscula = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);
/** Une una lista en una frase: «a, b y c». */
const enFrase = (l: readonly string[]) => l.map(minuscula).join(', ').replace(/, ([^,]*)$/, ' ni $1');

const esencial = plan('esencial');
const visible = plan('visible');
const atencion = plan('atencion');

const LICENCIAS = CONDICIONES.find((c) => c.includes('licencia'))!;

/** Aclaración obligatoria cerca de cualquier mención de «a cualquier hora» o «fuera de horario». */
const ACLARACION_HORARIO = `Las respuestas automáticas funcionan a cualquier hora. Nuestro equipo atiende de ${minuscula(CONTACTO.horario)}. ${CONTACTO.respuestaHumana}`;

const MENSAJE_WHATSAPP = 'Hola, tengo una empresa de servicios y quiero una revisión digital con VRS Digital.';

/** Lo que debe tener la web de una empresa de servicios (sección #estructura y su ilustración). */
const ESTRUCTURA = [
  { titulo: 'Respuesta clara arriba', texto: 'Qué hace, para quién, dónde y desde cuánto. En dos a cuatro frases.' },
  { titulo: 'Una página por servicio', texto: 'Qué incluye, qué no, para quién es y cómo se cotiza.' },
  { titulo: 'Cómo trabaja', texto: 'Los pasos desde el primer mensaje hasta la entrega.' },
  { titulo: 'Precio o forma de cotizar', texto: 'Un precio «desde», o qué hace cambiar el precio.' },
  { titulo: 'Pruebas reales', texto: 'Trabajos y reseñas reales, con permiso del cliente.' },
  { titulo: 'Quién está detrás', texto: 'Las personas responsables, con datos que se puedan comprobar.' },
  { titulo: 'Preguntas frecuentes', texto: 'Las que sus clientes hacen por WhatsApp, con respuestas cortas.' },
  { titulo: 'Contacto a la vista', texto: 'WhatsApp y un formulario corto, con la política de datos publicada.' },
] as const;

/**
 * Textos de la ilustración «antes y después» de la portada (deslizable). Las fallas resumen
 * #problema; las mejoras son los títulos de #estructura (ESTRUCTURA). Es una web ficticia.
 */
export const antesDespues = {
  etiqueta:
    'Ilustración: la web de una empresa de servicios antes y después de ordenarla. Antes: todos los servicios en una sola página, sin precio «desde», un formulario con demasiados datos y un WhatsApp que no se ve. Después: respuesta clara arriba, una página por servicio, precio o forma de cotizar y contacto a la vista.',
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
    descripcion: `Página web para empresas de servicios: abogados, inmobiliarias, SST y servicios técnicos. Diga qué hace y cuánto cuesta. Desde ${desde('esencial')}.`,
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
    etiqueta: 'Empresas de servicios',
    titulo: 'Páginas web para empresas de servicios profesionales',
    subtitulo: 'Su web dice qué hace, para quién y cuánto cuesta. Así el cliente le escribe sabiendo qué va a recibir.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver precios y planes', href: '/precios/' },
    precio: `Desde ${desde('esencial')}`,
    puntos: ['Qué hace y cuánto cuesta, bien claro', 'WhatsApp y formulario a la vista'],
  },
  respuestaDirecta: `Un servicio no se puede ver antes de contratarlo. Por eso su web debe decir qué hace, para quién y cuánto cuesta. ${esencial.nombre} cuesta desde ${desde('esencial')} al año, IVA incluido, o 12 cuotas de ${cuotaDesde('esencial')} al mes.`,
  secciones: [
    {
      id: 'problema',
      etiqueta: 'Fallas comunes',
      titulo: 'Lo que suele fallar en la web de una empresa de servicios',
      introduccion: 'Revise si su web tiene alguna de estas fallas:',
      tipo: 'lista',
      variante: 'alerta',
      items: [
        'Nombra los servicios, pero no dice qué incluye cada uno.',
        'Todos los servicios están en una sola página. Ni el cliente ni Google saben cuál es el principal.',
        'No tiene precio «desde» ni dice cómo se cotiza.',
        'El WhatsApp no se ve, o nadie responde fuera de horario.',
        'El formulario pide demasiados datos y la persona se va sin enviarlo.',
        'Las mismas preguntas llegan cada día y se responden a mano, horas después.',
      ],
    },
    {
      id: 'estructura',
      etiqueta: 'Qué debe tener',
      titulo: 'Qué debe tener la web de una empresa de servicios',
      introduccion: 'Sea cual sea su sector, una buena web responde estas ocho cosas, en este orden:',
      tipo: 'lista',
      items: ESTRUCTURA,
      nota: 'Esto también ayuda a que Google y asistentes como ChatGPT entiendan qué ofrece. Nadie puede garantizar el primer lugar.',
      enlace: { texto: 'Ver cómo trabajamos para que salga en Google', href: '/posicionamiento-google-inteligencia-artificial/' },
    },
    {
      id: 'precio',
      etiqueta: 'Precio',
      titulo: 'Cuánto cuesta y qué páginas trae',
      introduccion: `${esencial.nombre}: ${minuscula(esencial.incluye[0])}. No trae ${enFrase(esencial.noIncluye)}. ${visible.nombre} suma una página para cada servicio, desde ${desde('visible')}. ${atencion.nombre} suma respuestas automáticas en WhatsApp, desde ${desde('atencion')}.`,
      tipo: 'planes',
      compacto: true,
      nota: LICENCIAS,
      enlace: { texto: 'Ver precios completos y condiciones', href: '/precios/' },
    },
    {
      id: 'whatsapp',
      etiqueta: 'WhatsApp',
      titulo: 'WhatsApp: respuestas automáticas para lo de siempre, una persona para lo importante',
      introduccion: `Con ${atencion.nombre}, su WhatsApp Business responde con la información que usted aprueba.`,
      tipo: 'comparacion',
      etiquetaIncluye: 'Responde solo',
      etiquetaNoIncluye: 'Siempre pasa a una persona',
      incluye: [
        'Servicios, horarios, zonas donde trabaja y formas de pago.',
        'Precios «desde» que usted autorice.',
        'Servicios o productos de su catálogo.',
        'Los datos que necesita para entender la solicitud.',
      ],
      noIncluye: [
        'Consejos jurídicos, contables, médicos o técnicos sobre un caso.',
        'Cotizaciones finales, descuentos y negociaciones.',
        'Documentos o datos sensibles.',
        'Urgencias, quejas y clientes que piden hablar con alguien.',
      ],
      parrafos: [
        'No todas las cuentas de WhatsApp Business son compatibles. Lo revisamos en el diagnóstico. Si la suya no lo es, dejamos listos los mensajes de bienvenida y de ausencia, las respuestas rápidas, las etiquetas y el catálogo.',
        'No la recomendamos para conversaciones con datos sensibles de salud, dinero o asuntos legales.',
        ACLARACION_HORARIO,
      ],
      enlace: { texto: 'Ver el servicio de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    },
    {
      id: 'que-no-hacemos',
      etiqueta: 'Lo que no hacemos',
      titulo: 'Lo que no incluye nuestro servicio',
      introduccion: 'Se lo decimos desde el principio:',
      tipo: 'lista',
      variante: 'excluye',
      items: [
        'Programas para manejar clientes y ventas.',
        'Chatbots hechos a la medida.',
        'Conexión con otros programas de su empresa (ventas, facturación, inventario).',
        'Envío de mensajes masivos.',
        'El primer lugar en Google o que ChatGPT nombre su empresa. Nadie lo puede garantizar.',
      ],
    },
  ],
  preguntas: [
    {
      pregunta: '¿Trabajan con abogados, inmobiliarias, SST o servicios técnicos?',
      respuesta:
        'Sí. Una buena web de servicios tiene las mismas partes en cualquier sector. La llenamos con la información de su empresa. Usted revisa que cumpla las reglas de su profesión.',
    },
    {
      pregunta: '¿Las respuestas automáticas de WhatsApp pueden dar consejos legales o técnicos?',
      respuesta:
        'No. Solo dan información general que usted aprueba. Si alguien pregunta por su caso, la conversación pasa a una persona. WhatsApp advierte que los mensajes hechos con IA pueden tener errores. Por eso los temas delicados los atiende alguien de su equipo.',
    },
  ],
  cta: {
    titulo: 'Pida una revisión gratuita de su web',
    texto: 'Le decimos qué le falta a su web para que un cliente entienda qué hace y le escriba.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Páginas web: qué trae, cuánto se demora y proyectos', href: '/paginas-web-bogota/' },
    { texto: 'Atención inteligente en WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Precios, condiciones y formas de pago', href: '/precios/' },
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
  ],
  /** Datos para servicio() de @/lib/schema. El precio sale de sitio.ts. */
  servicio: {
    nombre: 'Páginas web para empresas de servicios',
    tipo: 'Diseño y desarrollo de páginas web',
    descripcion:
      'Páginas web para empresas de servicios: dicen qué hace la empresa, para quién y cuánto cuesta, con botón de WhatsApp y formulario.',
    precioDesde: esencial.precioAnualDesde,
    audiencia: 'Empresas de servicios',
  },
  actualizado: '2026-10-19',
} as const satisfies ModuloPagina;
