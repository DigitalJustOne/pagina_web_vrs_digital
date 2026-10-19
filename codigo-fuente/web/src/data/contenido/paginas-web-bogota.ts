// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /paginas-web-bogota/ (servicio: páginas web).
//  Palabra clave principal: «diseño de páginas web Bogotá».
//  Precios, qué incluye, proceso y condiciones salen de sitio.ts: no los copie a mano.
//  Reglas de texto: GUIA-CLARIDAD.md (palabras simples, frases cortas, un dato en un lugar).
//
//  REPARTO CON /paginas-web-empresas-servicios/ (2026-10-19): esta página dice qué trae la web,
//  cuánto cuesta, de qué depende el tiempo, los pasos y los proyectos. La otra dice qué debe
//  tener la web de una empresa de servicios y cómo se atiende por WhatsApp. No repetir.
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Tiempos de entrega por plan. Hoy solo se dice de qué depende y que la fecha queda por
//    escrito en la propuesta.
//  - Quién hace los cambios de textos después de publicar y cómo se piden. Sin confirmar,
//    no se publica (se quitó la pregunta «¿Puedo cambiar yo mismo los textos?»).
// ─────────────────────────────────────────────────────────────────────────────
import {
  CIFRAS,
  CONDICIONES,
  CTA_PRINCIPAL,
  FILAS_FICHA,
  MEDIOS_PAGO,
  FUNDADOR,
  PLANES,
  PROCESO,
  enlaceWhatsApp,
  formatoCOP,
  type IdFila,
  type IdPlan,
  cuotaMensual,
} from '@/data/sitio';
import type { ModuloPagina } from './tipos';

const plan = (id: IdPlan) => PLANES.find((p) => p.id === id)!;
const desde = (id: IdPlan) => formatoCOP(plan(id).precioAnualDesde);
const cuotaDesde = (id: IdPlan) => formatoCOP(cuotaMensual(plan(id).precioAnualDesde));
/** Explicación corta de una palabra técnica de la ficha (dominio, hosting). */
const explica = (id: IdFila) => FILAS_FICHA.find((f) => f.id === id)!.explicacion!;

const esencial = plan('esencial');

const MEDIOS_PAGO_TEXTO = MEDIOS_PAGO.map((m) => (/^\p{Lu}\p{Ll}/u.test(m) ? m.charAt(0).toLowerCase() + m.slice(1) : m)).join(', ').replace(/, ([^,]*)$/, ' o $1');
const CAPACIDAD = CONDICIONES.find((c) => c.includes('dos proyectos'))!;
const LICENCIAS = CONDICIONES.find((c) => c.includes('licencia'))!;

const MENSAJE_WHATSAPP = 'Hola, vi la página de diseño web de VRS Digital y quiero una revisión digital de mi empresa.';

export const contenido = {
  ruta: '/paginas-web-bogota/',
  seo: {
    // 45 caracteres + « | VRS Digital» (Seo.astro) = 59.
    titulo: 'Diseño de páginas web en Bogotá para empresas',
    descripcion: `Diseño de páginas web en Bogotá: hasta 5 páginas, botón de WhatsApp, formulario, dominio y hosting el primer año. Desde ${desde('esencial')}, IVA incluido.`,
    palabraClave: 'diseño de páginas web Bogotá',
    // «página web para servicios profesionales» → /paginas-web-empresas-servicios/;
    // «cuánto cuesta una página web en Bogotá» → guía de /recursos/ (una intención por URL).
    secundarias: ['páginas web para empresas', 'diseño web Bogotá', 'página web profesional para empresa'],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Páginas web en Bogotá', ruta: '/paginas-web-bogota/' },
  ],
  hero: {
    etiqueta: 'Páginas web',
    titulo: 'Diseño de páginas web en Bogotá para su empresa',
    subtitulo: 'Su web se ve bien en el celular y tiene botón de WhatsApp. Así sus clientes le escriben fácil.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver precios y planes', href: '/precios/' },
    precio: `Desde ${desde('esencial')}`,
    puntos: [`${esencial.ficha.paginas!.texto} páginas`, 'Dominio y hosting el primer año', 'Usted aprueba los textos'],
  },
  respuestaDirecta: `${esencial.nombre}: ${esencial.queEs.charAt(0).toLowerCase()}${esencial.queEs.slice(1)} Cuesta desde ${desde('esencial')} al año, IVA incluido. El dominio es ${explica('dominio')}. El hosting es ${explica('hosting')}.`,
  secciones: [
    {
      id: 'que-incluye',
      etiqueta: 'Qué trae',
      titulo: 'Qué trae su web y qué no',
      introduccion: `Esto trae ${esencial.nombre}, el plan más sencillo.`,
      tipo: 'comparacion',
      incluye: esencial.incluye,
      noIncluye: esencial.noIncluye,
      enlace: { texto: 'Comparar los tres planes', href: '/precios/' },
    },
    {
      id: 'precios',
      etiqueta: 'Precio',
      titulo: 'Cuánto cuesta su web',
      introduccion: `${esencial.nombre} cuesta desde ${desde('esencial')} al año, IVA incluido. El precio sube si necesita más páginas o muchos textos. Puede pagarlo de una vez o en 12 cuotas desde ${cuotaDesde('esencial')} al mes, que suman 20 % más.`,
      tipo: 'planes',
      compacto: true,
      nota: LICENCIAS,
      enlace: { texto: 'Ver precios completos y formas de pago', href: '/precios/' },
    },
    {
      id: 'tiempos',
      etiqueta: 'Tiempo',
      titulo: 'Cuánto se demora su web',
      introduccion: 'El tiempo depende de estas cosas:',
      tipo: 'lista',
      items: [
        'Cuántas páginas tiene su web.',
        'Si usted ya tiene los textos o los escribimos nosotros.',
        'Si ya tiene el logo y las fotos.',
        'Si hay que pasar el contenido de una web anterior.',
        'Qué tan rápido nos envía su información y sus aprobaciones.',
      ],
      parrafos: ['La fecha de entrega queda por escrito en la propuesta, antes de empezar.', CAPACIDAD],
    },
    {
      id: 'proceso',
      etiqueta: 'Pasos',
      titulo: 'Cómo trabajamos, paso a paso',
      introduccion: 'Cinco pasos. Nada se publica sin su aprobación.',
      tipo: 'pasos',
      items: PROCESO,
      nota: `Medios de pago: ${MEDIOS_PAGO_TEXTO}.`,
    },
    {
      id: 'proyectos',
      etiqueta: 'Proyectos',
      titulo: 'Webs que hemos hecho',
      introduccion: 'Puede abrirlas y revisarlas.',
      tipo: 'casos',
      clientes: ['La Casa de las Tejas', 'La Casa de las Tejas: teja Standing Seam', 'MG Power Electric'],
      enlace: { texto: 'Ver todos los proyectos', href: '/proyectos/' },
    },
    {
      id: 'quien',
      etiqueta: 'Quién',
      titulo: 'Quién hace su web',
      tipo: 'texto',
      parrafos: [`VRS Digital es de Bogotá. Su fundador, ${FUNDADOR.nombreCorto}, revisa cada texto y aprueba cada entrega.`],
      cifras: CIFRAS,
      enlace: { texto: `Conozca a ${FUNDADOR.nombreCorto}`, href: '/nosotros/' },
    },
  ],
  preguntas: [
    {
      pregunta: 'Si ya tengo una página web, ¿qué pasa con ella?',
      respuesta:
        'En el diagnóstico revisamos su web actual y qué páginas conviene conservar. Pasar ese contenido a la nueva web es un trabajo aparte: se cotiza por escrito antes de empezar. Nadie puede garantizar que conserve su lugar en Google, pero hacerlo con un plan reduce el riesgo de perder visitas.',
    },
    {
      pregunta: '¿Qué necesito tener listo para empezar?',
      respuesta:
        'Qué hace su empresa, sus servicios, sus datos de contacto, su logo y sus fotos. Se lo pedimos en un solo formulario. Si no tiene textos, los escribimos nosotros y usted los aprueba.',
    },
  ],
  cta: {
    titulo: 'Pida una revisión gratuita de su web',
    texto: 'Revisamos su web, cómo aparece en Google y su WhatsApp. Le decimos las tres cosas que conviene arreglar primero.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Precios, condiciones y formas de pago', href: '/precios/' },
    { texto: 'Qué debe tener la web de una empresa de servicios', href: '/paginas-web-empresas-servicios/' },
    { texto: 'Aparecer en Google y en asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
    { texto: 'Atención inteligente en WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
  ],
  /** Datos para servicio() de @/lib/schema. El precio sale de sitio.ts. */
  servicio: {
    nombre: 'Diseño de páginas web para empresas en Bogotá',
    tipo: 'Diseño y desarrollo de páginas web',
    descripcion: esencial.queEs,
    precioDesde: esencial.precioAnualDesde,
    audiencia: 'Empresas de servicios',
  },
  actualizado: '2026-10-19',
} as const satisfies ModuloPagina;
