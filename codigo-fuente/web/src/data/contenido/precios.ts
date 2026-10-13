// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /precios/.
//  Palabra clave principal: «precios de páginas web en Bogotá».
//  Fuentes: informe del Director (2026-10-05: «Precios orientativos», decisión 14 sobre el Plan
//  Emprendedor) y src/data/sitio.ts (PLANES, PLAN_ENTRADA, LANDING, DOMINIO_HOSTING, CUOTAS,
//  MEDIOS_PAGO). Costos de Meta verificados el 2026-10-06.
//  Todos los valores se calculan desde sitio.ts: un cambio de precio se refleja aquí solo.
//  Se publica solo el valor «desde» de cada rango (decisión de la Dirección, 2026-10-05).
//
//  Modelo de precio (Víctor, 2026-10-13): cada plan web tiene UN precio anual. Se paga de una vez
//  o en 12 cuotas mensuales, que suman 20 % más (cuotaMensual en sitio.ts). No se suma una
//  mensualidad al precio anual. El mantenimiento y los cambios son servicios aparte: no se
//  describen en la página de precios.
//
//  2026-10-12: la Dirección agregó la Landing Page (pago único) y pidió unificar dominio y hosting
//  en un paquete comercial: DOMINIO_HOSTING y LANDING de sitio.ts.
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Si el Plan Emprendedor ($49.900 al mes) pasa a precio anual, como los planes web.
//  - Si la forma de pago en tres partes (50/30/20, FORMA_DE_PAGO) se mantiene para el precio
//    anual. Hoy no aparece en esta página, pero sí en contacto y condiciones.
//  - Qué es la «agenda básica» que incluye el Plan Emprendedor.
// ─────────────────────────────────────────────────────────────────────────────
import {
  CONTACTO,
  CTA_PRINCIPAL,
  MEDIOS_PAGO,
  PLANES,
  PLAN_ENTRADA,
  LANDING,
  DOMINIO_HOSTING,
  cuotaMensual,
  enlaceWhatsApp,
  formatoCOP,
  totalEnCuotas,
  type IdPlan,
} from '@/data/sitio';
import type { ModuloPagina } from './tipos';

const plan = (id: IdPlan) => PLANES.find((p) => p.id === id)!;
/** Precio anual «desde», pago de una vez. */
const desde = (id: IdPlan) => formatoCOP(plan(id).precioAnualDesde);
/** Cuota mensual si paga en 12 cuotas (incluye el 20 %). */
const cuota = (id: IdPlan) => formatoCOP(cuotaMensual(plan(id).precioAnualDesde));
/** Total que suma pagar en 12 cuotas. */
const total = (id: IdPlan) => formatoCOP(totalEnCuotas(plan(id).precioAnualDesde));
/** Pasa a minúscula la primera letra, salvo en siglas (PSE, SST). */
const minuscula = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

const esencial = plan('esencial');
const visible = plan('visible');
const atencion = plan('atencion');

const MEDIOS_PAGO_TEXTO = MEDIOS_PAGO.map(minuscula).join(', ').replace(/, ([^,]*)$/, ' o $1');
const EMPRENDEDOR_NO_INCLUYE = PLAN_ENTRADA.noIncluye.map(minuscula).join(' ni ');
const EMPRENDEDOR_PRECIO = `${formatoCOP(PLAN_ENTRADA.mensualidad)} al mes`;

const LANDING_PRECIO = formatoCOP(LANDING.precio);
const DH_PRECIO = `${formatoCOP(DOMINIO_HOSTING.precioAnual)} al año`;

const URL_META_ONE = 'https://whatsappbusiness.com/products/business-app-meta-one/';

const MENSAJE_WHATSAPP = 'Hola, vi la página de precios de VRS Digital y quiero una revisión digital de mi empresa.';

// ── Comparador punto por punto (sección 'comparar') ─────────────────────────
// Sale de PLANES: cada plan incluye todo lo del anterior («incluyeAnterior»), así que un punto
// que aparece en un plan está también en los planes siguientes. La página lo muestra como una
// tabla con marcas (ComparadorPlanes.astro); estos textos son su contenido.
const INCLUIDO = 'Incluido';
const NO_INCLUIDO = 'No incluido';
const FILAS_COMPARAR = PLANES.flatMap((p, i) => p.incluye.map((punto) => [punto, ...PLANES.map((_, j) => (j >= i ? INCLUIDO : NO_INCLUIDO))]));

/** Textos de los bloques propios de /precios/ (portada, comparador y pagos). Precios: siempre de sitio.ts. */
export const textosPrecios = {
  /** Portada: los tres planes como capas (PilaPlanes.astro). */
  pila: {
    etiqueta: 'Resumen de los planes: precio anual y cuota mensual',
    precioAnual: 'Precio anual desde',
    cuotas: 'O en 12 cuotas de',
    alMes: 'al mes',
    aparte: 'Aparte',
    /** Se lee entre los planes: cada uno suma lo del anterior. */
    suma: 'incluye el anterior',
  },
  /** Comparador (ComparadorPlanes.astro). */
  comparador: {
    incluido: INCLUIDO,
    noIncluido: NO_INCLUIDO,
    /** Encabezado de cada grupo de filas, según el primer plan que incluye el punto. */
    grupos: PLANES.map((p, i) =>
      i === 0
        ? 'En los tres planes'
        : i === PLANES.length - 1
          ? `Solo en ${p.nombre}`
          : `En ${PLANES.slice(i).map((q) => q.nombre).join(' y ')}`,
    ),
    precioAnual: 'Precio anual desde',
    cuotas: 'O en 12 cuotas de',
    alMes: 'al mes',
    iva: 'IVA incluido',
    elegir: 'Elegir',
    solicitar: 'Solicitar',
  },
  /** Formas de pagar el precio anual con valores (SimuladorPago.astro). */
  pagos: {
    leyenda: 'Elija un plan para ver cuánto paga',
    ustedPaga: 'Usted paga',
    precioAnual: 'Precio anual',
    cuotas: '12 cuotas de',
    alMes: 'al mes',
    total: 'Total en cuotas',
    /** Va junto a cada valor del simulador. */
    iva: 'IVA incluido',
  },
};

export const contenido = {
  ruta: '/precios/',
  seo: {
    // 46 caracteres + « | VRS Digital» (Seo.astro) = 60.
    titulo: 'Precios: páginas web, Google y WhatsApp con IA',
    descripcion: `Planes web desde ${desde('esencial')} al año, o en 12 cuotas. Landing desde ${LANDING_PRECIO}, pago único. IVA incluido.`,
    // «cuánto cuesta una página web en Bogotá» (búsqueda informativa) la atiende la guía de /recursos/.
    palabraClave: 'planes y precios de páginas web VRS Digital',
    secundarias: ['precio de página web para empresa', 'precio de posicionamiento web', 'precio del agente de IA de WhatsApp Business', 'pagar página web en cuotas'],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Precios', ruta: '/precios/' },
  ],
  hero: {
    etiqueta: 'Precios publicados',
    titulo: 'Precios de páginas web, posicionamiento y atención por WhatsApp',
    subtitulo: `Landing desde ${LANDING_PRECIO}, pago único. Tres planes web con precio anual, que puede pagar de una vez o en 12 cuotas. Dominio y hosting incluidos el primer año en los planes web.`,
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Preguntar por WhatsApp', href: enlaceWhatsApp(MENSAJE_WHATSAPP) },
    puntos: ['Precios en pesos colombianos, IVA incluido', 'De una vez o en 12 cuotas', 'Dominio y hosting incluidos el primer año'],
  },
  respuestaDirecta: `${LANDING.nombre} desde ${LANDING_PRECIO}, pago único. ${esencial.nombre} desde ${desde('esencial')} al año, ${visible.nombre} desde ${desde('visible')} y ${atencion.nombre} desde ${desde('atencion')}. Cada plan web también se puede pagar en 12 cuotas mensuales, con 20 % más en total. El ${PLAN_ENTRADA.nombre} cuesta ${EMPRENDEDOR_PRECIO}. Dominio y hosting van incluidos el primer año en los planes web; para la ${LANDING.nombre}, ${DH_PRECIO}. Todo con IVA incluido.`,
  secciones: [
    {
      id: 'planes',
      etiqueta: 'Planes',
      titulo: 'Una landing y tres planes web con precio anual',
      introduccion:
        'Cada plan web tiene un precio anual. Puede pagarlo de una vez o en 12 cuotas mensuales, que suman 20 % más. La Landing Page es pago único. Los precios están en pesos colombianos, con IVA incluido, y son el punto de partida: el valor final queda por escrito antes de cualquier pago.',
      tipo: 'planes',
      compacto: false,
      // El plan Web + Atención Inteligente dice «incluso fuera de horario» (sitio.ts): aclaración obligatoria.
      nota: `El agente de WhatsApp puede responder a cualquier hora. Nuestro acompañamiento humano es de ${minuscula(CONTACTO.horario)}. ${CONTACTO.respuestaHumana}`,
    },
    {
      id: 'comparar',
      etiqueta: 'Comparar',
      titulo: 'Qué incluye cada plan, punto por punto',
      introduccion: 'Cada plan suma lo del anterior. Recorra la lista y vea en qué planes está cada punto.',
      tipo: 'tabla',
      columnas: ['Qué incluye', ...PLANES.map((p) => p.nombre)],
      filas: FILAS_COMPARAR,
      // El último plan incluye todo lo de los anteriores: lo que él no incluye no está en ningún plan.
      nota: `Lo que no incluye cada plan está en su tarjeta, arriba. Ningún plan incluye ${atencion.noIncluye.map(minuscula).join(', ').replace(/, ([^,]*)$/, ' ni $1')}.`,
    },
    {
      id: 'cuotas',
      etiqueta: 'Cuotas',
      titulo: 'Pague de una vez o en 12 cuotas',
      introduccion:
        'Si prefiere pagar en cuotas, el total sube 20 %. Los valores son «desde», con IVA incluido.',
      tipo: 'lista',
      items: [
        {
          titulo: `${esencial.nombre}: ${desde('esencial')} de una vez, o 12 cuotas de ${cuota('esencial')}`,
          texto: `Total en cuotas: ${total('esencial')}, IVA incluido.`,
        },
        {
          titulo: `${visible.nombre}: ${desde('visible')} de una vez, o 12 cuotas de ${cuota('visible')}`,
          texto: `Total en cuotas: ${total('visible')}, IVA incluido.`,
        },
        {
          titulo: `${atencion.nombre}: ${desde('atencion')} de una vez, o 12 cuotas de ${cuota('atencion')}`,
          texto: `Total en cuotas: ${total('atencion')}, IVA incluido.`,
        },
      ],
    },
    {
      id: 'aparte',
      etiqueta: 'Se paga aparte',
      titulo: 'Qué se paga aparte',
      introduccion: 'Para que no haya sorpresas, esto es lo que se paga aparte:',
      tipo: 'lista',
      items: [
        {
          titulo: `${DOMINIO_HOSTING.nombre}: ${DH_PRECIO} para la ${LANDING.nombre} y el ${PLAN_ENTRADA.nombre}`,
          texto: `La dirección de su web (por ejemplo suempresa.com.co) y el servidor donde vive, en un solo pago anual con IVA incluido. En los planes web va incluido el primer año; con la ${LANDING.nombre}, el primer año sale en ${formatoCOP(LANDING.precioConDominio)} con la página incluida.`,
        },
        {
          titulo: 'Licencias y suscripciones externas',
          texto: 'Si su web necesita algún servicio de terceros, se lo indicamos en la propuesta con su costo, antes de empezar.',
        },
        {
          titulo: 'Costos de Meta',
          texto:
            'Según Meta, hoy el agente de IA incluye un cupo mensual de respuestas sin costo. Si su empresa necesita más, Meta ofrece planes de pago (Meta One) que usted contrata y paga directamente a Meta. Ese costo no está en nuestros precios y Meta puede cambiarlo.',
        },
      ],
      enlace: { texto: 'Cómo funcionan los costos de Meta', href: '/asistente-whatsapp-business/#depende-de-meta' },
    },
    {
      id: 'factores',
      etiqueta: 'Qué cambia el precio',
      titulo: 'Por qué los precios dicen «desde»',
      introduccion: 'El precio publicado es el valor mínimo de cada plan. Estos factores lo pueden subir:',
      tipo: 'lista',
      items: [
        'El número de páginas o secciones.',
        'Los textos: si usted los entrega listos o los preparamos nosotros.',
        'La migración: trasladar el contenido de una web anterior.',
        'Los idiomas: cada idioma adicional es una versión más de la web.',
        'El catálogo: cuántos productos o servicios hay que mostrar.',
        'La información para el agente de WhatsApp: cuántos servicios, políticas y preguntas debe conocer.',
      ],
    },
    {
      id: 'pago',
      etiqueta: 'Forma de pago',
      titulo: 'Cómo se paga',
      introduccion: 'Elija un plan y vea cuánto paga de una vez o en cuotas. Los valores son «desde», con IVA incluido.',
      tipo: 'pasos',
      items: [
        {
          paso: '01',
          titulo: 'De una vez',
          texto: 'Pague el precio anual completo por cualquiera de los medios de pago de abajo.',
        },
        {
          paso: '02',
          titulo: '12 cuotas mensuales',
          texto: 'Pague cada mes una cuota de la misma cantidad. El total de las cuotas es 20 % mayor que el precio de una vez.',
        },
      ],
      medios: MEDIOS_PAGO,
    },
    {
      id: 'condiciones',
      etiqueta: 'Condiciones',
      titulo: 'Condiciones claras desde el inicio',
      tipo: 'lista',
      items: [
        'Cada plan web tiene un precio anual: se paga de una vez o en 12 cuotas mensuales, que suman 20 % más.',
        'En los planes web, el dominio y el hosting van incluidos el primer año. Para la Landing Page y el Plan Emprendedor cuestan $149.900 al año.',
        'Licencias y suscripciones externas se identifican por separado.',
        'Trabajamos con un máximo de dos proyectos al mismo tiempo; la fecha de inicio se asigna según disponibilidad.',
      ],
    },
    {
      id: 'emprendedor',
      etiqueta: 'Para empezar',
      titulo: `${PLAN_ENTRADA.nombre}: ${EMPRENDEDOR_PRECIO}`,
      tipo: 'texto',
      parrafos: [
        PLAN_ENTRADA.descripcion,
        'No se compara con los tres planes empresariales: es un producto distinto, estandarizado, para quien necesita estar en internet con lo básico.',
        `No incluye ${EMPRENDEDOR_NO_INCLUYE}. Si quiere su propio dominio, se agrega con el paquete ${DOMINIO_HOSTING.nombre} (${DH_PRECIO}). Si su empresa necesita una página por servicio, aparecer mejor en Google o el agente de WhatsApp, le conviene uno de los tres planes.`,
      ],
      enlace: { texto: `Solicitar el ${PLAN_ENTRADA.nombre}`, href: `${CTA_PRINCIPAL.href}?plan=emprendedor` },
    },
    {
      id: 'sin-acceso-whatsapp',
      etiqueta: 'WhatsApp',
      titulo: 'Si su WhatsApp aún no tiene el agente de IA',
      tipo: 'texto',
      parrafos: [
        'Meta está habilitando su agente de IA de forma gradual, por país y por cuenta. En el diagnóstico revisamos si su WhatsApp Business ya tiene acceso.',
        `Si no lo tiene, entregamos la web y el posicionamiento, y el valor del agente dentro del plan ${atencion.nombre} se descuenta o se pospone: usted no paga por algo que su cuenta no tiene. Mientras tanto, configuramos las funciones clásicas de la app: mensaje de bienvenida, mensaje de ausencia, respuestas rápidas, etiquetas y catálogo.`,
      ],
      enlace: { texto: 'Ver el servicio de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    },
  ],
  preguntas: [
    {
      pregunta: '¿Cuánto cuesta una landing page?',
      respuesta: `La ${LANDING.nombre} cuesta ${LANDING_PRECIO}, pago único, IVA incluido. Es una página de una sola sección para vender un servicio o una promoción, con botón de WhatsApp, formulario y optimización inicial para Google. Lista para publicar, con dominio y hosting del primer año, cuesta ${formatoCOP(LANDING.precioConDominio)}.`,
    },
    {
      pregunta: '¿Puedo pagar en cuotas?',
      respuesta: `Sí. Cada plan web tiene un precio anual que puede pagar de una vez o en 12 cuotas mensuales. Las cuotas suman 20 % más. Por ejemplo, ${esencial.nombre} cuesta ${desde('esencial')} de una vez, o 12 cuotas de ${cuota('esencial')} (total ${total('esencial')}), IVA incluido.`,
    },
    {
      pregunta: '¿El dominio y el hosting están incluidos?',
      respuesta: `En ${esencial.nombre}, ${visible.nombre} y ${atencion.nombre}, el dominio (.com o .com.co) y el hosting van incluidos el primer año. Para la ${LANDING.nombre} y el ${PLAN_ENTRADA.nombre} cuestan ${DH_PRECIO}, IVA incluido. El dominio queda a nombre de su empresa.`,
    },
    {
      pregunta: '¿Por qué los precios dicen «desde»?',
      respuesta:
        'Porque cada empresa necesita un alcance distinto. El precio publicado es el valor mínimo de cada plan. Lo que más lo cambia es el número de páginas, si hay que preparar los textos, la migración de una web anterior, los idiomas, el tamaño del catálogo y la cantidad de información para el agente de WhatsApp. El valor final queda por escrito antes de empezar.',
    },
    {
      pregunta: '¿Qué se paga aparte?',
      respuesta: `El dominio y el hosting de la ${LANDING.nombre} y del ${PLAN_ENTRADA.nombre} (${DH_PRECIO}). Las licencias y las suscripciones externas se identifican por separado en la propuesta. Si usa el agente de IA de WhatsApp y necesita más respuestas que el cupo gratuito de Meta, el plan de pago lo contrata y lo paga usted directamente a Meta. Los servicios que no estén en su plan se cotizan aparte.`,
    },
    {
      pregunta: '¿Cómo se paga?',
      respuesta: `Puede pagar el precio anual de una vez o en 12 cuotas mensuales. Medios de pago: ${MEDIOS_PAGO_TEXTO}. Antes del primer pago usted recibe la propuesta por escrito con el alcance y el valor.`,
    },
    {
      pregunta: `¿En qué se diferencia el ${PLAN_ENTRADA.nombre}?`,
      respuesta: `Es una página de una sola sección, estandarizada, con alojamiento (hosting) y agenda básica incluidos, por ${EMPRENDEDOR_PRECIO}. Está pensada para microempresas que empiezan. No incluye ${EMPRENDEDOR_NO_INCLUYE}. Si su empresa necesita una página por servicio, aparecer mejor en Google o atención con el agente de IA, le conviene uno de los tres planes empresariales.`,
    },
  ],
  cta: {
    titulo: '¿Qué plan necesita su empresa?',
    texto:
      'Solicite una revisión digital gratuita. Analizamos su web, su visibilidad en Google y su atención por WhatsApp, y le recomendamos el plan que tiene sentido para usted, con tres prioridades concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Diseño de páginas web en Bogotá para empresas', href: '/paginas-web-bogota/' },
    { texto: 'Posicionamiento en Google y asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
    { texto: 'Configuración del agente de IA de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Proyectos realizados por VRS Digital', href: '/proyectos/' },
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
    { texto: 'Solicitar una revisión digital', href: '/contacto/' },
  ],
  fuentes: [
    { titulo: 'Meta One on WhatsApp Business App (página oficial de WhatsApp Business)', url: URL_META_ONE, idioma: 'en' },
    {
      titulo: 'Be There for Every Customer With Meta Business Agent (Meta Newsroom, 3 de junio de 2026)',
      url: 'https://about.fb.com/news/2026/06/meta-business-agent/',
      idioma: 'en',
    },
  ],
  /** Ofertas para el JSON-LD (Service u Offer por plan). Precios idénticos a los visibles; sin AggregateRating. */
  ofertas: [
    {
      id: 'landing',
      nombre: LANDING.nombre,
      descripcion: LANDING.descripcion,
      precioDesde: LANDING.precio,
      cuotaDesde: null,
    },
    ...PLANES.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.paraQuien,
      precioDesde: p.precioAnualDesde,
      cuotaDesde: cuotaMensual(p.precioAnualDesde),
    })),
    {
      id: 'emprendedor',
      nombre: PLAN_ENTRADA.nombre,
      descripcion: PLAN_ENTRADA.descripcion,
      precioDesde: null,
      cuotaDesde: PLAN_ENTRADA.mensualidad,
    },
  ],
  actualizado: '2026-10-13',
} as const satisfies ModuloPagina;
