// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /proyectos/.
//  Fuentes: CASOS de src/data/sitio.ts y memoria/MEMORIA.md (portafolio histórico).
//  Regla: no se agregan resultados, testimonios, reseñas ni cifras que no estén en sitio.ts.
//  "contexto" y "queSeHizo" reformulan el resumen de cada caso (sitio.ts y MEMORIA.md);
//  los logros se toman tal cual de CASOS.
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Confirmar la autorización de cada cliente para mostrar su nombre, captura y enlace.
//  - Confirmar que cada caso es un trabajo entregado a un cliente: Longevity Therapy se aloja
//    en el GitHub Pages del fundador y Belleza Profesional figura como «Software para estética».
//    Si alguno es demostración o producto propio, debe rotularse así (Ley 1480, art. 23).
//  - Confirmar el compromiso de publicar casos nuevos solo con autorización escrita del cliente
//    (lo afirman la sección «resultados» y la pregunta «¿Publicarán mi proyecto…?»).
//  EDICIÓN FINAL (2026-10-06): «¿Cuánto cuesta un proyecto?» se cambió por «¿Publicarán mi
//  proyecto en esta página?»: el precio ya se responde en /precios/ y en /paginas-web-bogota/.
// ─────────────────────────────────────────────────────────────────────────────
import { CASOS, CTA_PRINCIPAL, enlaceWhatsApp } from '@/data/sitio';
import { rotuloCaso } from '@/lib/casos';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;

const PROYECTOS = CASOS.map((c) => ({
  cliente: c.cliente,
  sector: c.sector,
  enlace: c.enlace,
  tipo: rotuloCaso(c.cliente),
}));

const MENSAJE_WHATSAPP = 'Hola, vi sus proyectos y quiero una revisión digital gratuita para mi empresa.';

/** Textos de los bloques propios de /proyectos/ (mosaico de la portada y cifras). */
export const textosProyectos = {
  /** Nombre del índice visual de la portada: cada captura lleva a su proyecto en la página. */
  mosaico: 'Proyectos en esta página',
  /** Nombre accesible de la franja de cifras verificadas (CIFRAS de sitio.ts). */
  cifras: 'VRS Digital en cifras',
};

export const contenido = {
  ruta: '/proyectos/',
  seo: {
    titulo: 'Proyectos de páginas web y plataformas',
    descripcion:
      'Proyectos de VRS Digital con enlace público: web corporativa y landing pages para Google Ads, webs y plataformas, y productos propios. Revise qué se hizo.',
    palabraClave: 'proyectos de páginas web',
    secundarias: [
      'portafolio de páginas web Bogotá',
      'ejemplos de páginas web para empresas',
      'casos de diseño web',
    ],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Proyectos', ruta: '/proyectos/' },
  ],
  hero: {
    etiqueta: 'Proyectos',
    titulo: 'Proyectos de páginas web y plataformas digitales',
    subtitulo:
      'Proyectos desarrollados por Víctor Ramírez y productos propios de VRS Digital. Cada uno tiene su enlace público para que usted lo revise.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver planes y precios', href: '/precios/' },
  },
  respuestaDirecta: `Estos son los proyectos de VRS Digital con enlace público: una web corporativa y landing pages para campañas de Google Ads de una empresa de tejas y cubiertas, y webs y plataformas para industria, restaurantes, logística, bienestar y belleza, además de un producto propio. Cada uno tiene su enlace para revisarlo.`,
  secciones: [
    {
      id: 'portafolio',
      etiqueta: 'Portafolio',
      titulo: 'Proyectos con enlace público',
      introduccion: 'Cada proyecto tiene un enlace para que usted lo revise. Al lado está el sector de cada uno.',
      tipo: 'tarjetas',
      columnas: 3,
      items: PROYECTOS.map((p) => ({
        titulo: p.cliente,
        texto: `${p.sector} · ${p.tipo}`,
        icono: icono('monitor'),
        href: p.enlace,
      })),
    },
  ],
  preguntas: [
    {
      pregunta: '¿Puedo ver estos proyectos funcionando?',
      respuesta:
        'Sí. Cada uno tiene un enlace público para que usted lo revise.',
    },
    {
      pregunta: '¿Todavía desarrollan plataformas a medida?',
      respuesta:
        'No forman parte de nuestra oferta actual. Beauty Manager es un producto propio para centros de estética que se puede adquirir; las demás son proyectos anteriores de diseño y desarrollo. Hoy nos concentramos en páginas web, posicionamiento en Google y asistentes de IA, configuración del agente de IA de WhatsApp Business y mantenimiento. Un desarrollo a medida solo se evalúa de forma excepcional y con un alcance controlado.',
    },
    {
      pregunta: '¿Mi empresa obtendrá los mismos resultados que estos proyectos?',
      respuesta:
        'No podemos garantizarlo. Los resultados dependen de su negocio, su mercado, su operación y el tiempo. Lo que sí definimos con usted es el alcance, lo que se entrega y cómo se revisa el avance. Si contrata el seguimiento mensual, revisamos datos reales cada mes para decidir las siguientes mejoras.',
    },
    {
      pregunta: '¿Publicarán mi proyecto en esta página?',
      respuesta:
        'Solo con su autorización por escrito. Si prefiere confidencialidad, no lo publicamos.',
    },
  ],
  cta: {
    titulo: 'Veamos qué necesita su empresa',
    texto:
      'Solicite una revisión digital gratuita. Analizamos su web, su visibilidad en Google y su atención por WhatsApp, y le entregamos tres prioridades concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Diseño de páginas web en Bogotá para empresas', href: '/paginas-web-bogota/' },
    { texto: 'Páginas web para empresas de servicios', href: '/paginas-web-empresas-servicios/' },
    { texto: 'Precios y qué incluye cada plan', href: '/precios/' },
    { texto: 'Quién está detrás de VRS Digital', href: '/nosotros/' },
  ],
  actualizado: '2026-10-11',
} as const satisfies ModuloPagina;
