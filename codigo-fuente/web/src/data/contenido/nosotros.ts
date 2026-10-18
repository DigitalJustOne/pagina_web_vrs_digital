// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /nosotros/.
//  Fuentes: informe del Director (2026-10-05: modelo operativo, capacidad y límites,
//  confidencialidad del método), contexto/negocio.md y memoria/MEMORIA.md.
//  No se inventa biografía: solo datos de negocio.md, MEMORIA.md y sitio.ts.
//  No se publican: "equipo de 10 especialistas", retención de clientes, herramientas
//  o modelos internos, "Agencia de Inteligencia Artificial" (decisión del informe).
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Confirmar que el enlace de Cercia muestra la verificación MinTIC y el nombre exacto del programa.
//  - Confirmar si las reuniones son solo virtuales o también presenciales (hoy no se menciona).
//  EDICIÓN FINAL (2026-10-06): se quitó «¿La IA escribe los textos de mi página?» porque
//  repetía «¿Usan inteligencia artificial para hacer las páginas?» de la página de inicio.
//  2026-10-18 (Víctor): la web no explica cómo se hace el trabajo. Se quitaron la sección
//  «Cómo usamos la inteligencia artificial», las preguntas sobre herramientas de IA y la frase
//  «usted habla directamente con quien hace el trabajo» y sus variantes.
// ─────────────────────────────────────────────────────────────────────────────
import { AVAL, CIFRAS, CONTACTO, CTA_PRINCIPAL, FUNDADOR, enlaceWhatsApp } from '@/data/sitio';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;
const minuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

export const contenido = {
  ruta: '/nosotros/',
  seo: {
    titulo: 'Quién está detrás de VRS Digital: Víctor Ramírez',
    descripcion:
      'Conozca a Víctor Ramírez, fundador y responsable de VRS Digital: por qué atiende pocos proyectos, lo que hace y lo que no, y su aval MinTIC.',
    palabraClave: 'quién está detrás de VRS Digital',
    secundarias: [
      'Víctor Ramírez VRS Digital',
      'estudio digital en Bogotá',
      'empresa aliada MinTIC',
    ],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Nosotros', ruta: '/nosotros/' },
  ],
  hero: {
    etiqueta: 'Nosotros',
    titulo: 'Víctor Ramírez, el responsable de cada proyecto de VRS Digital',
    subtitulo:
      'VRS Digital es un estudio digital de Bogotá dirigido por su fundador, responsable de cada proyecto de principio a fin.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver proyectos', href: '/proyectos/' },
  },
  respuestaDirecta:
    'VRS Digital es un estudio digital de Bogotá dirigido por Víctor Alfonso Ramírez Sepúlveda, su fundador y responsable de cada proyecto. Atiende máximo dos proyectos a la vez y revisa personalmente cada entrega.',
  secciones: [
    {
      id: 'responsable',
      etiqueta: 'El fundador',
      titulo: 'Una persona responsable de principio a fin',
      tipo: 'perfil',
      persona: {
        nombre: FUNDADOR.nombre,
        nombreCorto: FUNDADOR.nombreCorto,
        cargo: FUNDADOR.cargo,
        foto: FUNDADOR.foto,
        altFoto: `Retrato de ${FUNDADOR.nombreCorto}, fundador de VRS Digital`,
        enlaces: [
          { texto: 'LinkedIn', href: FUNDADOR.linkedin },
          { texto: 'GitHub', href: FUNDADOR.github },
        ],
      },
      parrafos: [
        `${FUNDADOR.nombre} fundó VRS Digital y es el responsable de cada proyecto. Atiende el diagnóstico, define la estrategia, diseña, desarrolla, revisa y presenta las entregas.`,
        'Ha desarrollado una web corporativa de 54 páginas y landing pages para campañas de Google Ads para una empresa de tejas y cubiertas, además de sitios y plataformas de restaurantes, logística, bienestar e industria eléctrica, que puede revisar en la página de proyectos, y Beauty Manager, el producto propio de VRS Digital para centros de estética.',
        'VRS Digital no tiene departamentos ni empleados, y no los aparenta. Preferimos que usted sepa desde el principio con quién trabaja y quién responde por el resultado.',
      ],
      cifras: CIFRAS,
    },
    {
      id: 'capacidad',
      etiqueta: 'Capacidad',
      titulo: 'Pocos proyectos a la vez, a propósito',
      introduccion:
        'Trabajar con una sola persona responsable tiene límites. Los publicamos porque protegen la calidad de su proyecto y los plazos que acordamos con usted.',
      tipo: 'lista',
      items: [
        {
          titulo: 'Máximo dos proyectos activos',
          texto: 'Su proyecto recibe atención real. Si no hay cupo, le damos una fecha de inicio según disponibilidad en lugar de aceptar algo que no podemos atender bien.',
        },
        {
          titulo: 'Dos rondas de cambios incluidas',
          texto: 'Ajustes ordenados y a tiempo. Las solicitudes adicionales se cotizan aparte y antes de hacerlas.',
        },
        {
          titulo: 'Un formulario y dos reuniones',
          texto: 'Un formulario único para reunir la información, una reunión inicial y una de presentación. Su tiempo se usa para decidir, no para repetir datos.',
        },
        {
          titulo: 'Horario definido',
          texto: `${CONTACTO.horario}. ${CONTACTO.respuestaHumana}`,
        },
        {
          titulo: 'Sin soporte ilimitado',
          texto: 'Cada mensualidad indica cuántos cambios o solicitudes incluye. Usted sabe qué paga y qué recibe.',
        },
      ],
      nota: 'La disponibilidad las 24 horas corresponde a su sitio web y a la atención inteligente de su WhatsApp, no al soporte personal de VRS Digital.',
    },
    {
      id: 'aval',
      etiqueta: 'Respaldo',
      titulo: 'Respaldo verificable del MinTIC',
      tipo: 'aval',
      aval: {
        titulo: AVAL.titulo,
        texto: AVAL.texto,
        enlace: { texto: 'Ver verificación en Cercia', href: AVAL.enlace },
      },
      parrafos: [
        'El MinTIC es el Ministerio de Tecnologías de la Información y las Comunicaciones de Colombia. La verificación puede consultarse en la tienda institucional de VRS Digital en la plataforma Cercia.',
      ],
    },
    {
      id: 'valores',
      etiqueta: 'Valores',
      titulo: 'Lo que guía nuestro trabajo',
      tipo: 'tarjetas',
      columnas: 2,
      items: [
        {
          titulo: 'Claridad',
          texto: 'Precios publicados, alcances por escrito y lenguaje sencillo. Si algo no está incluido, se lo decimos antes de empezar.',
          icono: icono('eye'),
        },
        {
          titulo: 'Honestidad',
          texto: 'No prometemos el primer lugar en Google ni respuestas perfectas. Decimos qué depende de nosotros y qué depende de terceros, como Google o WhatsApp.',
          icono: icono('shield'),
        },
        {
          titulo: 'Calidad antes que volumen',
          texto: 'Preferimos pocos proyectos bien hechos a muchos clientes mal atendidos.',
          icono: icono('check'),
        },
        {
          titulo: 'Cuidado de los datos',
          texto: 'Pedimos solo los datos necesarios, incluimos la autorización de tratamiento de datos en los formularios y no recomendamos usar la atención inteligente de WhatsApp con información sensible.',
          icono: icono('lock'),
        },
      ],
    },
    {
      id: 'fuera-de-alcance',
      etiqueta: 'Alcance',
      titulo: 'Lo que no hacemos',
      introduccion:
        'Una oferta pequeña y bien ejecutada vale más que un catálogo que una persona no puede sostener. Por eso hoy no ofrecemos:',
      tipo: 'lista',
      variante: 'excluye',
      items: [
        'Chatbots desarrollados a medida.',
        'Sistemas de gestión de clientes (CRM).',
        'Conexiones técnicas entre programas (API) ni integraciones con facturación, inventario o programas de gestión empresarial (ERP).',
        'Envíos masivos de mensajes por WhatsApp.',
        'Soporte técnico de WhatsApp ni recuperación de cuentas suspendidas.',
      ],
      nota: 'Si su necesidad está fuera de este alcance, se lo decimos desde la primera conversación.',
    },
  ],
  preguntas: [
    {
      pregunta: '¿VRS Digital es una agencia o una sola persona?',
      respuesta:
        'VRS Digital es un estudio digital dirigido por su fundador, Víctor Ramírez, responsable de cada proyecto. No tiene departamentos ni equipo de ventas, y trabaja con un máximo de dos proyectos al mismo tiempo.',
    },
    {
      pregunta: '¿Por qué trabajan con un máximo de dos proyectos al mismo tiempo?',
      respuesta:
        'Porque una sola persona responde por cada entrega. Con dos proyectos activos, Víctor puede atender reuniones, cambios y pruebas sin descuidar la calidad ni los plazos. Si en este momento no hay cupo, le damos una fecha de inicio según disponibilidad, en lugar de aceptar un proyecto que no podemos atender bien.',
    },
    {
      pregunta: '¿Qué significa que VRS Digital sea empresa aliada MinTIC?',
      respuesta:
        `${AVAL.texto} Usted puede consultar esa verificación en la tienda institucional de VRS Digital en la plataforma Cercia, enlazada en esta página.`,
    },
    {
      pregunta: '¿Dónde está ubicado VRS Digital?',
      respuesta: `VRS Digital es un estudio de Bogotá que trabaja de forma remota. Nuestro enfoque son las empresas de servicios de Bogotá, pero también atendemos empresas de otras ciudades de Colombia. La atención es por WhatsApp y correo, de ${minuscula(CONTACTO.horario)}.`,
    },
  ],
  cta: {
    titulo: 'Pida una revisión digital gratuita',
    texto:
      'Solicite una revisión digital gratuita. Víctor Ramírez revisa su web, su visibilidad en Google y su atención por WhatsApp, y le entrega tres prioridades concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: 'Hola, Víctor. Quiero una revisión digital gratuita para mi empresa.',
    enlaceWhatsApp: enlaceWhatsApp('Hola, Víctor. Quiero una revisión digital gratuita para mi empresa.'),
  },
  enlacesInternos: [
    { texto: 'Proyectos de páginas web y plataformas', href: '/proyectos/' },
    { texto: 'Precios y qué incluye cada plan', href: '/precios/' },
    { texto: 'Atención inteligente en WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Solicitar una revisión digital gratuita', href: '/contacto/' },
  ],
  fuentes: [
    { titulo: 'Tienda institucional de VRS Digital en Cercia (verificación MinTIC)', url: AVAL.enlace },
  ],
  actualizado: '2026-10-11',
} as const satisfies ModuloPagina;

// ── Presentación propia de /nosotros/ ───────────────────────────────────────
/**
 * Etapas que atiende el fundador en cada proyecto. Resumen visual del primer párrafo de
 * «responsable» («Atiende el diagnóstico, define la estrategia, diseña, desarrolla, revisa y
 * presenta las entregas»): si cambia ese párrafo, cambie también esta lista.
 */
export const etapasFundador = {
  titulo: 'Quién atiende cada etapa de su proyecto',
  etapas: ['Diagnóstico', 'Estrategia', 'Diseño', 'Desarrollo', 'Revisión', 'Presentación'],
} as const;
