// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /precios/.
//  Palabra clave principal: «precios de páginas web en Bogotá».
//  Fuentes: informe del Director (2026-10-05: «Precios orientativos», decisión 14 sobre el Plan
//  Emprendedor) y src/data/sitio.ts (PLANES, PLAN_ENTRADA, LANDING, DOMINIO_HOSTING, CUOTAS,
//  MEDIOS_PAGO). Desde 2026-10-18 no se nombra a Meta ni se explica cómo se presta el servicio (Víctor).
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
//  2026-10-19 (Víctor: «la información no es clara»): página reescrita con la regla de claridad
//  (LEEME, sección 1). Cada oferta responde la misma ficha (FILAS_FICHA de sitio.ts). Se quitaron
//  las secciones que repetían lo de las tarjetas: cuotas, condiciones, factores y Plan Emprendedor.
//  PENDIENTE DE VÍCTOR: tiempos de entrega;
//  páginas máximas de Web Visible y Web + Atención Inteligente.
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
const EMPRENDEDOR_PRECIO = `${formatoCOP(PLAN_ENTRADA.mensualidad)} al mes`;

const LANDING_PRECIO = formatoCOP(LANDING.precio);
const DH_PRECIO = `${formatoCOP(DOMINIO_HOSTING.precioAnual)} al año`;

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
    /** Encabezado de cada grupo de filas: la base común y lo que agrega cada plan. */
    grupos: PLANES.map((p, i) => (i === 0 ? 'Lo que traen los tres planes' : `Lo que agrega ${p.nombre}`)),
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
    // 44 caracteres + « | VRS Digital» (Seo.astro).
    titulo: 'Precios de páginas web, Google y WhatsApp',
    descripcion: `Landing Page por ${LANDING_PRECIO}, pago único. Planes web desde ${desde('esencial')} al año o en 12 cuotas. Plan Emprendedor: ${EMPRENDEDOR_PRECIO}. IVA incluido.`,
    // «cuánto cuesta una página web en Bogotá» (búsqueda informativa) la atiende la guía de /recursos/.
    palabraClave: 'planes y precios de páginas web VRS Digital',
    secundarias: ['precio de página web para empresa', 'precio de posicionamiento web', 'precio de atención inteligente en WhatsApp', 'pagar página web en cuotas'],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Precios', ruta: '/precios/' },
  ],
  hero: {
    etiqueta: 'Precios publicados',
    titulo: 'Precios de páginas web, Google y WhatsApp',
    subtitulo: `Landing Page: ${LANDING_PRECIO}, un solo pago. Planes web desde ${desde('esencial')} al año, que puede pagar de una vez o en 12 cuotas. Plan Emprendedor: ${EMPRENDEDOR_PRECIO}.`,
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Preguntar por WhatsApp', href: enlaceWhatsApp(MENSAJE_WHATSAPP) },
    puntos: ['IVA incluido', 'De una vez o en 12 cuotas', 'Dominio y hosting del primer año en los planes web'],
  },
  respuestaDirecta: `${LANDING.nombre}: ${LANDING_PRECIO}, un solo pago. ${esencial.nombre} desde ${desde('esencial')} al año, ${visible.nombre} desde ${desde('visible')} y ${atencion.nombre} desde ${desde('atencion')}. Los planes web también se pagan en 12 cuotas, que suman 20 % más. ${PLAN_ENTRADA.nombre}: ${EMPRENDEDOR_PRECIO}. Todo con IVA incluido.`,
  secciones: [
    {
      id: 'planes',
      etiqueta: 'Planes',
      titulo: 'Tres planes web y dos opciones para empezar',
      introduccion:
        'Cada opción responde lo mismo, en el mismo orden: cuántas páginas trae, si trae dominio y hosting, si trae botón de WhatsApp, qué hacemos en Google y si trae respuestas automáticas.',
      tipo: 'planes',
      compacto: false,
      // Web + Atención Inteligente dice «a cualquier hora»: aclaración obligatoria (Ley 1480).
      nota: `Las respuestas automáticas funcionan a cualquier hora. Nosotros atendemos ${minuscula(CONTACTO.horario)}.`,
    },
    {
      id: 'comparar',
      etiqueta: 'Comparar',
      titulo: 'Compare los tres planes web',
      introduccion: `Cada plan trae todo lo del anterior. ${atencion.nombre} lo trae todo.`,
      tipo: 'tabla',
      columnas: ['Qué trae', ...PLANES.map((p) => p.nombre)],
      filas: FILAS_COMPARAR,
      // El último plan incluye todo lo de los anteriores: lo que él no incluye no está en ningún plan.
      nota: `Ningún plan trae ${atencion.noIncluye.map(minuscula).join(', ').replace(/, ([^,]*)$/, ' ni $1')}.`,
    },
    {
      id: 'aparte',
      etiqueta: 'Se paga aparte',
      titulo: 'Qué se paga aparte',
      tipo: 'lista',
      items: [
        {
          titulo: `Dominio y hosting: ${DH_PRECIO}`,
          texto: DOMINIO_HOSTING.aparte,
        },
        {
          titulo: 'Servicios de otras empresas',
          texto: 'Si su web necesita un servicio de otra empresa con costo, como una licencia, se lo decimos con su precio antes de empezar.',
        },
        {
          titulo: 'El plan de pago de WhatsApp, si lo necesita',
          texto:
            'WhatsApp da cada mes un cupo de respuestas automáticas sin costo. Si su empresa necesita más, WhatsApp cobra un plan aparte y usted lo paga directamente. Se lo decimos antes.',
        },
      ],
      enlace: { texto: 'Lo que debe saber antes de contratar', href: '/asistente-whatsapp-business/#antes-de-contratar' },
    },
    {
      id: 'pago',
      etiqueta: 'Forma de pago',
      titulo: 'Cómo se paga',
      introduccion: 'Elija un plan y vea cuánto paga de una vez o en cuotas.',
      tipo: 'pasos',
      items: [
        {
          paso: '01',
          titulo: 'De una vez',
          texto: 'Paga el precio del año completo.',
        },
        {
          paso: '02',
          titulo: '12 cuotas mensuales',
          texto: 'Paga cada mes la misma cuota. En total paga 20 % más.',
        },
      ],
      medios: MEDIOS_PAGO,
    },
    {
      id: 'sin-acceso-whatsapp',
      etiqueta: 'WhatsApp',
      titulo: 'Si su WhatsApp aún no es compatible',
      tipo: 'texto',
      parrafos: [
        'No todas las cuentas de WhatsApp Business pueden tener respuestas automáticas todavía. En el diagnóstico revisamos la suya.',
        `Si la suya aún no puede, le entregamos la web y el trabajo en Google. Lo que cuestan las respuestas automáticas dentro de ${atencion.nombre} se descuenta o se deja para después: no paga por algo que su cuenta no tiene.`,
        'Mientras tanto, le dejamos listos el mensaje de bienvenida, el mensaje para fuera de horario, las respuestas rápidas, las etiquetas y el catálogo.',
      ],
      enlace: { texto: 'Ver el servicio de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    },
  ],
  preguntas: [
    {
      pregunta: '¿El dominio y el hosting están incluidos?',
      respuesta: `En ${esencial.nombre}, ${visible.nombre} y ${atencion.nombre}, sí: van incluidos el primer año, y el dominio queda a nombre de su empresa. ${DOMINIO_HOSTING.aparte}`,
    },
    {
      pregunta: '¿Por qué los precios dicen «desde»?',
      respuesta:
        '«Desde» es el precio más bajo de cada plan. Sube si necesita más páginas, muchos textos, otro idioma, un catálogo grande o pasar el contenido de una web anterior. Antes de pagar, usted recibe el valor exacto por escrito.',
    },
    {
      pregunta: '¿Puedo pagar en cuotas?',
      respuesta: `Sí, los planes web. Por ejemplo, ${esencial.nombre}: ${desde('esencial')} de una vez, o 12 cuotas de ${cuota('esencial')}. En cuotas paga ${total('esencial')} en total. Medios de pago: ${MEDIOS_PAGO_TEXTO}.`,
    },
    {
      pregunta: '¿Cuánto cuesta una landing page?',
      respuesta: `${LANDING_PRECIO}, un solo pago. Es una página para vender un servicio o una promoción, con botón de WhatsApp y formulario. Con dominio y hosting del primer año: ${formatoCOP(LANDING.precioConDominio)}.`,
    },
    {
      pregunta: `¿Qué es el ${PLAN_ENTRADA.nombre}?`,
      respuesta: `${PLAN_ENTRADA.queEs} Trae el hosting y una dirección web temporal gratis. No trae revisión mensual en Google ni respuestas automáticas en WhatsApp.`,
    },
    {
      pregunta: '¿Cuándo pueden empezar?',
      respuesta: 'Trabajamos con máximo dos proyectos al mismo tiempo. Por eso la fecha de inicio depende de cuándo haya cupo, y queda por escrito en la propuesta.',
    },
  ],
  cta: {
    titulo: '¿No sabe qué plan necesita?',
    texto:
      'Pida la revisión gratuita. Miramos su web, cómo sale en Google y su WhatsApp, y le decimos qué plan le sirve, con tres mejoras concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Páginas web para empresas', href: '/paginas-web-bogota/' },
    { texto: 'Aparecer en Google y en asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
    { texto: 'Atención inteligente en WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Proyectos de VRS Digital', href: '/proyectos/' },
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
    { texto: 'Pedir la revisión gratuita', href: '/contacto/' },
  ],
  /** Ofertas para el JSON-LD (Service u Offer por plan). Precios idénticos a los visibles; sin AggregateRating. */
  ofertas: [
    { id: 'landing', nombre: LANDING.nombre, descripcion: LANDING.queEs, precioDesde: LANDING.precio, cuotaDesde: null },
    ...PLANES.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.queEs,
      precioDesde: p.precioAnualDesde,
      cuotaDesde: cuotaMensual(p.precioAnualDesde),
    })),
    { id: 'emprendedor', nombre: PLAN_ENTRADA.nombre, descripcion: PLAN_ENTRADA.queEs, precioDesde: null, cuotaDesde: PLAN_ENTRADA.mensualidad },
  ],
  actualizado: '2026-10-19',
} as const satisfies ModuloPagina;
