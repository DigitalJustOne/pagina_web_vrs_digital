// Datos estructurados (schema.org, JSON-LD) coherentes con el contenido visible.
// Google: el marcado debe describir lo que la persona ve en la página.
import { SITIO, FUNDADOR, CONTACTO, AVAL } from '@/data/sitio';
import { imagenPublica } from '@/lib/casos';

export const urlAbsoluta = (ruta: string) => new URL(ruta, SITIO.url).toString();

/** URL absoluta de una imagen de public/, en su versión .webp si existe (pesa mucho menos que el PNG). */
export const imagenAbsoluta = (ruta: string) => urlAbsoluta(imagenPublica(ruta).webp ?? ruta);

const ID_ORG = urlAbsoluta('/#organizacion');
const ID_WEB = urlAbsoluta('/#sitio');
const ID_FUNDADOR = urlAbsoluta('/nosotros/#victor');

export function organizacion() {
  return {
    '@type': ['ProfessionalService', 'Organization'],
    '@id': ID_ORG,
    name: SITIO.nombre,
    description: SITIO.propuesta,
    slogan: SITIO.eslogan,
    url: urlAbsoluta('/'),
    logo: urlAbsoluta(SITIO.logo),
    image: urlAbsoluta(SITIO.imagenSocial),
    email: CONTACTO.correo,
    telephone: CONTACTO.telefonoE164,
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressLocality: 'Bogotá', addressRegion: 'Bogotá D.C.', addressCountry: 'CO' },
    areaServed: [{ '@type': 'City', name: 'Bogotá' }, { '@type': 'Country', name: 'Colombia' }],
    knowsLanguage: 'es',
    founder: { '@id': ID_FUNDADOR },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: CONTACTO.horarioSchema.dias,
      opens: CONTACTO.horarioSchema.abre,
      closes: CONTACTO.horarioSchema.cierra,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: CONTACTO.telefonoE164,
      email: CONTACTO.correo,
      areaServed: 'CO',
      availableLanguage: 'es',
    },
    // Solo perfiles de la empresa: el LinkedIn y el GitHub de Víctor van en fundador().
    sameAs: [CONTACTO.redes.instagram, CONTACTO.redes.facebook, AVAL.enlace],
  };
}

export function fundador() {
  return {
    '@type': 'Person',
    '@id': ID_FUNDADOR,
    name: FUNDADOR.nombre,
    jobTitle: FUNDADOR.cargo,
    worksFor: { '@id': ID_ORG },
    image: imagenAbsoluta(FUNDADOR.foto),
    url: urlAbsoluta('/nosotros/'),
    sameAs: [FUNDADOR.linkedin, FUNDADOR.github],
  };
}

export function sitioWeb() {
  return { '@type': 'WebSite', '@id': ID_WEB, url: urlAbsoluta('/'), name: SITIO.nombre, inLanguage: SITIO.idioma, publisher: { '@id': ID_ORG } };
}

export function pagina(opts: { ruta: string; titulo: string; descripcion: string; tipo?: string; fechaModificacion?: string }) {
  return {
    '@type': opts.tipo ?? 'WebPage',
    '@id': urlAbsoluta(opts.ruta) + '#pagina',
    url: urlAbsoluta(opts.ruta),
    name: opts.titulo,
    description: opts.descripcion,
    inLanguage: SITIO.idioma,
    isPartOf: { '@id': ID_WEB },
    about: { '@id': ID_ORG },
    ...(opts.fechaModificacion ? { dateModified: opts.fechaModificacion } : {}),
  };
}

export function migas(items: { nombre: string; ruta: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.nombre, item: urlAbsoluta(it.ruta) })),
  };
}

export function preguntasFrecuentes(preguntas: readonly { pregunta: string; respuesta: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: preguntas.map((p) => ({ '@type': 'Question', name: p.pregunta, acceptedAnswer: { '@type': 'Answer', text: p.respuesta } })),
  };
}

/**
 * Especificación de precio de un plan (precio anual o cuota mensual) con IVA incluido
 * (NOTA_PRECIOS en sitio.ts). desde: true → minPrice (precio «desde»); false → price fijo.
 * mensual: true → UnitPriceSpecification por mes.
 */
export function especificacionPrecio(nombre: string, valor: number, { desde = true, mensual = false }: { desde?: boolean; mensual?: boolean } = {}) {
  return {
    '@type': mensual ? 'UnitPriceSpecification' : 'PriceSpecification',
    name: nombre,
    ...(desde ? { minPrice: valor } : { price: valor }),
    priceCurrency: 'COP',
    valueAddedTaxIncluded: true,
    ...(mensual ? { unitCode: 'MON', referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' } } : {}),
  };
}

export function servicio(opts: { nombre: string; descripcion: string; ruta: string; tipo: string; precioDesde?: number; audiencia?: string }) {
  return {
    '@type': 'Service',
    '@id': urlAbsoluta(opts.ruta) + '#servicio',
    name: opts.nombre,
    serviceType: opts.tipo,
    description: opts.descripcion,
    url: urlAbsoluta(opts.ruta),
    provider: { '@id': ID_ORG },
    areaServed: { '@type': 'City', name: 'Bogotá' },
    ...(opts.audiencia ? { audience: { '@type': 'BusinessAudience', name: opts.audiencia } } : {}),
    ...(opts.precioDesde
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'COP',
            // Los precios publicados incluyen IVA (NOTA_PRECIOS en sitio.ts).
            priceSpecification: { '@type': 'PriceSpecification', minPrice: opts.precioDesde, priceCurrency: 'COP', valueAddedTaxIncluded: true },
          },
        }
      : {}),
  };
}

export function articulo(opts: { ruta: string; titulo: string; descripcion: string; publicado: string; modificado: string; imagen?: string }) {
  return {
    '@type': 'Article',
    '@id': urlAbsoluta(opts.ruta) + '#articulo',
    headline: opts.titulo,
    description: opts.descripcion,
    datePublished: opts.publicado,
    dateModified: opts.modificado,
    inLanguage: SITIO.idioma,
    author: { '@id': ID_FUNDADOR },
    publisher: { '@id': ID_ORG },
    mainEntityOfPage: urlAbsoluta(opts.ruta),
    image: urlAbsoluta(opts.imagen ?? SITIO.imagenSocial),
  };
}

/** Une nodos en un solo grafo JSON-LD. Organización, fundador y sitio van en todas las páginas. */
export function grafo(...nodos: object[]) {
  return { '@context': 'https://schema.org', '@graph': [organizacion(), fundador(), sitioWeb(), ...nodos] };
}
