// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de la página de inicio (/).
//  Reescrito en palabras simples el 2026-10-19 (GUIA-CLARIDAD.md). En los primeros segundos el
//  lector debe saber: qué hace VRS Digital, cuánto cuesta lo más barato (Landing Page) y cómo pedir
//  la revisión gratuita (hero, respuesta directa y cierre).
//  Precios, contacto, casos, aval, servicios y proceso salen de sitio.ts: no los copie a mano.
//
//  Además de `contenido`, exporta dos piezas propias de la portada (src/pages/index.astro):
//  `visualHero` (tarjetas del visual 3D) y `recorrido` (historia fija «encuentran → entienden →
//  reciben respuesta»). Las dos usan el mismo ejemplo de la sección «whatsapp»: una firma contable
//  inventada, que no es cliente de VRS Digital.
// ─────────────────────────────────────────────────────────────────────────────
import {
  AVAL,
  CIFRAS,
  CONTACTO,
  CTA_PRINCIPAL,
  CUOTAS,
  PLANES,
  PLAN_ENTRADA,
  MEDIOS_PAGO,
  LANDING,
  PROCESO,
  SERVICIOS,
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
const PRECIO_LANDING = formatoCOP(LANDING.precio);

const MEDIOS_PAGO_TEXTO = MEDIOS_PAGO.map((m) => (/^\p{Lu}\p{Ll}/u.test(m) ? m.charAt(0).toLowerCase() + m.slice(1) : m)).join(', ').replace(/, ([^,]*)$/, ' o $1');

const MENSAJE_REVISION = 'Hola, quiero una revisión digital gratuita para mi empresa.';

/** Conversación de ejemplo (firma contable inventada). La usan la sección «whatsapp» y el recorrido de la portada. */
const CONVERSACION_DEMO = {
  titulo: 'Firma contable (ejemplo)',
  estado: 'Cuenta de empresa',
  mensajes: [
    {
      de: 'cliente',
      separador: 'Domingo',
      hora: '7:42 p. m.',
      texto: 'Buenas noches. ¿Ustedes hacen declaración de renta para personas naturales?',
    },
    {
      de: 'asistente',
      hora: '7:42 p. m.',
      texto: 'Buenas noches. Sí, para empleados, independientes y pensionados. ¿En cuál de esos casos está usted?',
    },
    {
      de: 'cliente',
      hora: '7:44 p. m.',
      texto: 'independiente, facturo como contratista. no se si estoy obligado a declarar y no quiero que me multen',
    },
    {
      de: 'asistente',
      hora: '7:44 p. m.',
      texto: 'Entiendo. Eso depende de sus ingresos y su patrimonio, y lo debe revisar un contador de la firma. ¿Quiere que uno le escriba?',
    },
    {
      de: 'cliente',
      hora: '7:45 p. m.',
      texto: 'si porfa. y cuanto cobran?',
    },
    {
      de: 'asistente',
      hora: '7:45 p. m.',
      texto: 'El valor depende de su caso. El contador se lo dice antes de empezar. ¿Me indica su nombre?',
    },
    {
      de: 'cliente',
      hora: '7:46 p. m.',
      texto: 'Andrés Gómez. le mando de una vez los extractos por aquí?',
    },
    {
      de: 'asistente',
      hora: '7:46 p. m.',
      texto: 'Gracias, Andrés. Por seguridad, no envíe extractos por este chat. Una persona de la firma le escribe mañana lunes.',
    },
    {
      de: 'persona',
      separador: 'Lunes',
      hora: '8:10 a. m.',
      texto: 'Buenos días, Andrés. Soy Carolina, contadora de la firma. ¿Hablamos hoy a las 10:00 a. m. para revisar su caso?',
    },
    {
      de: 'cliente',
      hora: '8:14 a. m.',
      texto: 'Perfecto, a las 10 me sirve. Gracias.',
    },
  ],
  nota: 'Ejemplo inventado. Su WhatsApp responde con la información que usted apruebe.',
} as const;

export const contenido = {
  ruta: '/',
  seo: {
    // La página de inicio no recibe " | VRS Digital" desde Seo.astro: la marca va aquí (44 caracteres).
    titulo: 'Páginas web, Google y WhatsApp | VRS Digital',
    descripcion: `Páginas web para empresas en Bogotá, listas para Google, y respuestas automáticas en WhatsApp. ${LANDING.nombre} por ${PRECIO_LANDING}, IVA incluido.`,
    palabraClave: 'páginas web para empresas',
    secundarias: ['VRS Digital', 'página web con WhatsApp para empresas'],
  },
  migas: [{ nombre: 'Inicio', ruta: '/' }],
  hero: {
    etiqueta: 'Páginas web en Bogotá',
    titulo: 'Hacemos la página web de su empresa y la dejamos lista para Google',
    subtitulo: 'También ponemos respuestas automáticas en su WhatsApp Business. Pida gratis una revisión de su web y su WhatsApp.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Pedir la revisión por WhatsApp', href: enlaceWhatsApp(MENSAJE_REVISION) },
    puntos: ['Revisión gratis y sin compromiso', 'Precios publicados', 'Máximo dos proyectos a la vez'],
    // Precio más bajo en la primera pantalla (la plantilla agrega «IVA incluido»).
    precio: `${LANDING.nombre}: ${PRECIO_LANDING}, pago único`,
  },
  respuestaDirecta: `VRS Digital hace páginas web para empresas en Bogotá y las deja listas para que Google las muestre. También pone respuestas automáticas en WhatsApp Business. Lo más económico es una ${LANDING.nombre} de ${PRECIO_LANDING}, pago único. Una web de hasta 5 páginas cuesta desde ${desde('esencial')} al año.`,
  secciones: [
    {
      id: 'problema',
      etiqueta: 'El problema',
      titulo: 'Una web que no explica y un WhatsApp que no da abasto',
      tipo: 'lista',
      items: [
        'Su web no dice claro qué hace su empresa ni cómo contratarla.',
        'Quien busca su servicio en Google encuentra primero a otras empresas.',
        'Por WhatsApp llegan cada día las mismas preguntas. Las de la noche esperan hasta el otro día.',
      ],
    },
    {
      id: 'servicios',
      etiqueta: 'Lo que hacemos',
      titulo: 'Lo que hacemos',
      tipo: 'tarjetas',
      columnas: 3,
      items: SERVICIOS.map((s) => ({
        titulo: s.nombre,
        texto: s.resumen,
        icono: icono(s.icono),
        href: `/${s.slug}/`,
      })),
    },
    {
      id: 'whatsapp',
      etiqueta: 'Ejemplo en WhatsApp',
      titulo: 'Ejemplo: así responde su WhatsApp un domingo en la noche',
      introduccion: 'Una firma contable inventada recibe un mensaje el domingo. Las respuestas automáticas contestan, y el lunes sigue una persona.',
      tipo: 'conversacion',
      conversacion: CONVERSACION_DEMO,
      puntos: [
        'Responde a cualquier hora con la información que su empresa aprobó.',
        'No inventa precios ni da asesoría: esos casos pasan a una persona.',
        'No pide documentos por el chat.',
        'Su equipo sigue la conversación en horario de trabajo.',
      ],
      // Avisos de ley (Ley 1480): puede equivocarse, cuentas compatibles, plan de pago aparte y horario.
      nota: `Antes de activarlas, las probamos con 25 a 40 preguntas. Aun así, pueden equivocarse. No todas las cuentas de WhatsApp Business son compatibles: lo revisamos antes de cobrar. Si necesita más mensajes que el cupo gratis de WhatsApp, ese plan se paga aparte. Nuestro equipo atiende de ${minuscula(CONTACTO.horario)}.`,
      enlace: { texto: 'Ver el servicio de WhatsApp', href: '/asistente-whatsapp-business/' },
    },
    {
      id: 'prueba',
      etiqueta: 'Proyectos',
      titulo: 'Proyectos y respaldo que puede revisar',
      introduccion: 'Webs hechas por VRS Digital. Ábralas y revíselas usted mismo.',
      tipo: 'casos',
      limite: 4,
      cifras: CIFRAS,
      aval: {
        titulo: AVAL.titulo,
        texto: AVAL.texto,
        enlace: { texto: 'Ver la verificación', href: AVAL.enlace },
      },
      enlace: { texto: 'Ver todos los proyectos', href: '/proyectos/' },
    },
    {
      id: 'planes',
      etiqueta: 'Precios',
      titulo: 'Cuánto cuesta',
      introduccion: `Lo más económico es la ${LANDING.nombre}: ${minuscula(LANDING.queEs)} Cuesta ${PRECIO_LANDING}, pago único. Los planes web se pagan al año, de una vez o en ${CUOTAS.numero} cuotas mensuales (suman ${CUOTAS.recargo * 100} % más). El precio final depende de cuántas páginas necesita y de si hay que pasar el contenido de su web anterior.`,
      tipo: 'planes',
      compacto: true,
      planEntrada: {
        nombre: PLAN_ENTRADA.nombre,
        precio: `${formatoCOP(PLAN_ENTRADA.mensualidad)} al mes`,
        descripcion: PLAN_ENTRADA.queEs,
      },
      nota: `Puede pagar por ${MEDIOS_PAGO_TEXTO}. Si su web necesita un servicio pago de otra empresa, se lo decimos antes de empezar.`,
      enlace: { texto: 'Ver qué incluye cada plan', href: '/precios/' },
    },
    {
      id: 'proceso',
      etiqueta: 'Pasos',
      titulo: 'Los 5 pasos para tener su web',
      tipo: 'pasos',
      items: PROCESO,
    },
  ],
  preguntas: [
    {
      pregunta: '¿Qué es la revisión gratuita?',
      respuesta: `Revisamos su web, cómo aparece en Google y cómo atiende por WhatsApp. Le decimos, en palabras sencillas, las tres cosas que más conviene mejorar. No tiene costo ni lo obliga a contratar. Pídala en el formulario de contacto o por WhatsApp al ${CONTACTO.whatsappVisible}. ${CONTACTO.respuestaHumana}`,
    },
    {
      pregunta: '¿Puedo contratar solo la página web?',
      respuesta: `Sí. ${plan('esencial').nombre} es solo la web: ${minuscula(plan('esencial').queEs)} Cuesta desde ${desde('esencial')} al año, o 12 cuotas de ${cuotaDesde('esencial')}. Si solo necesita una página para vender un servicio, está la ${LANDING.nombre}.`,
    },
    {
      pregunta: '¿Con qué empresas trabajan?',
      respuesta: 'Con empresas y profesionales de servicios que reciben muchas preguntas por WhatsApp. Si no le podemos ayudar, se lo decimos.',
    },
  ],
  cta: {
    titulo: 'Pida su revisión gratuita',
    texto: 'Le decimos qué mejorar primero en su web y su WhatsApp. No tiene costo ni lo obliga a contratar.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_REVISION,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_REVISION),
  },
  enlacesInternos: [
    { texto: 'Páginas web para empresas en Bogotá', href: '/paginas-web-bogota/' },
    { texto: 'Aparecer en Google y en asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
    { texto: 'Respuestas automáticas en WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Precios y qué incluye cada plan', href: '/precios/' },
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
  ],
  fuentes: [
    {
      titulo: 'AI features and your website (Google Search Central)',
      url: 'https://developers.google.com/search/docs/appearance/ai-features',
      idioma: 'en',
    },
  ],
  actualizado: '2026-10-19',
} as const satisfies ModuloPagina;

// ── Piezas propias de la portada (no forman parte de ModuloPagina) ──────────

/** Textos del visual 3D del hero (HeroVisual). Las tarjetas siguen el mismo ejemplo del recorrido. */
export const visualHero = {
  etiqueta: 'Ilustración: búsquedas que llegan desde Google y asistentes de IA, y respuestas que salen por WhatsApp un domingo en la noche.',
  consulta: { titulo: 'Alguien busca su servicio', detalle: '«contador tributario en Bogotá»' },
  respuesta: {
    titulo: 'Respuesta por WhatsApp',
    detalle: `${CONVERSACION_DEMO.mensajes[0].separador}, ${CONVERSACION_DEMO.mensajes[1].hora}`,
  },
} as const;

/**
 * Recorrido fijo de la portada (src/components/paginas/inicio/Recorrido.astro, con data-historia):
 * encuentran su empresa → entienden qué ofrece → reciben respuesta.
 * Todo es un ejemplo con la misma firma contable inventada de la sección «whatsapp».
 */
export const recorrido = {
  id: 'recorrido',
  etiqueta: 'Cómo funciona',
  titulo: 'Encuentran su empresa, entienden qué ofrece y reciben respuesta',
  resaltado: 'reciben respuesta',
  introduccion: 'Así llega un cliente nuevo, con una firma contable inventada como ejemplo.',
  rotulo: 'Ejemplo: firma contable inventada',
  etiquetaPasos: 'Cómo llega un cliente nuevo',
  etiquetaVisual:
    'Ilustración de ejemplo en tres pantallas: una búsqueda en Google, la página web de una firma contable inventada y una conversación de WhatsApp con respuestas automáticas un domingo en la noche.',
  pasos: [
    {
      paso: '01',
      titulo: 'Encuentran su empresa',
      texto: 'Alguien busca su servicio en Google o en asistentes como ChatGPT. Su web tiene la información ordenada para que la puedan mostrar. No prometemos el primer lugar.',
      icono: icono('search'),
    },
    {
      paso: '02',
      titulo: 'Entienden qué ofrece',
      texto: 'Entran a su web desde el celular y ven qué hace, para quién y cómo contratar. Le escriben por WhatsApp o llenan el formulario.',
      icono: icono('monitor'),
    },
    {
      paso: '03',
      titulo: 'Reciben respuesta',
      texto: 'Si le escriben un domingo en la noche, su WhatsApp Business responde con la información que usted aprobó. El lunes, su equipo sigue la conversación.',
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
    autor: 'Respuesta automática',
    autorPersona: 'Persona de la firma',
    mensajes: [CONVERSACION_DEMO.mensajes[0], CONVERSACION_DEMO.mensajes[1]],
    traspaso: 'Una persona de la firma sigue el caso el lunes',
    /** Mensaje del lunes (persona de la firma). Solo se ve si la pantalla es alta. */
    seguimiento: CONVERSACION_DEMO.mensajes[8],
  },
  // Aclara que el ejemplo no es un cliente. Los avisos de WhatsApp van una sola vez, en la sección «whatsapp».
  nota: 'La firma contable es un ejemplo inventado. No es un cliente de VRS Digital.',
} as const;
