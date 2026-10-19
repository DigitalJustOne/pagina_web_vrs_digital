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
//  2026-10-19 (claridad): textos simples; se quitó la introducción del portafolio y la pregunta
//  «¿Puedo ver estos proyectos funcionando?» (repetían que cada uno tiene enlace) y el enlace a la
//  página por sector.
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
      'Proyectos de VRS Digital que puede abrir y revisar: webs, páginas de venta para Google Ads, plataformas y un producto propio para centros de estética.',
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
    subtitulo: 'Trabajos hechos por Víctor Ramírez y productos propios de VRS Digital. Puede abrir cada uno y revisarlo.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver planes y precios', href: '/precios/' },
  },
  respuestaDirecta:
    'Aquí están los proyectos de VRS Digital: la web de una empresa de tejas y sus páginas de venta para Google Ads, otras webs y plataformas, y Beauty Manager, un producto propio.',
  secciones: [
    {
      id: 'portafolio',
      etiqueta: 'Portafolio',
      titulo: 'Proyectos que puede abrir',
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
      pregunta: '¿Todavía desarrollan plataformas a medida?',
      respuesta:
        'No. Hoy hacemos páginas web, trabajo para aparecer en Google y respuestas automáticas en WhatsApp Business. Beauty Manager sí se puede comprar: es un producto propio para centros de estética.',
    },
    {
      pregunta: '¿Me garantizan resultados para mi empresa?',
      respuesta:
        'No podemos garantizarlo. Depende de su negocio, su mercado y el tiempo. Lo que sí acordamos por escrito es qué incluye su proyecto y qué le entregamos.',
    },
    {
      pregunta: '¿Publicarán mi proyecto en esta página?',
      respuesta:
        'Solo con su autorización por escrito. Si prefiere confidencialidad, no lo publicamos.',
    },
  ],
  cta: {
    titulo: 'Veamos qué necesita su empresa',
    texto: 'Revisamos gratis su web, cómo aparece en Google y su WhatsApp. Le entregamos tres mejoras concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Diseño de páginas web en Bogotá para empresas', href: '/paginas-web-bogota/' },
    { texto: 'Precios y qué incluye cada plan', href: '/precios/' },
    { texto: 'Quién está detrás de VRS Digital', href: '/nosotros/' },
  ],
  actualizado: '2026-10-19',
} as const satisfies ModuloPagina;
