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
//  2026-10-19 (claridad): textos simples y más cortos. Se quitaron las tarjetas «Claridad» y
//  «Calidad antes que volumen» y las preguntas que repetían el perfil y la capacidad. El aval
//  MinTIC queda igual (pendiente de confirmar).
// ─────────────────────────────────────────────────────────────────────────────
import { AVAL, CIFRAS, CONTACTO, CTA_PRINCIPAL, FUNDADOR, enlaceWhatsApp } from '@/data/sitio';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;

const MENSAJE_WHATSAPP = 'Hola, Víctor. Quiero una revisión digital gratuita para mi empresa.';

export const contenido = {
  ruta: '/nosotros/',
  seo: {
    // 32 caracteres + « | VRS Digital» = 46.
    titulo: 'Quién está detrás de VRS Digital',
    descripcion:
      'Víctor Ramírez fundó VRS Digital y responde por cada proyecto. Atiende máximo dos a la vez. Vea lo que hacemos, lo que no y el aval MinTIC.',
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
    subtitulo: 'VRS Digital es un estudio digital de Bogotá, dirigido por su fundador.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver proyectos', href: '/proyectos/' },
  },
  respuestaDirecta:
    'Quién está detrás de VRS Digital: Víctor Alfonso Ramírez Sepúlveda, su fundador. Atiende máximo dos proyectos a la vez y revisa él mismo cada entrega.',
  secciones: [
    {
      id: 'responsable',
      etiqueta: 'El fundador',
      titulo: 'Una sola persona responde por su proyecto',
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
        `${FUNDADOR.nombre} fundó VRS Digital. Él hace el diagnóstico, planea, diseña, construye, revisa y presenta cada entrega.`,
        'En la página de proyectos puede ver sus trabajos: webs, páginas de venta y plataformas. También Beauty Manager, un producto propio para centros de estética.',
        'VRS Digital no tiene departamentos ni empleados. Así usted sabe desde el principio quién responde por el resultado.',
      ],
      cifras: CIFRAS,
    },
    {
      id: 'capacidad',
      etiqueta: 'Capacidad',
      titulo: 'Pocos proyectos a la vez, a propósito',
      introduccion: 'Son límites claros. Cuidan la calidad y los plazos de su proyecto.',
      tipo: 'lista',
      items: [
        {
          titulo: 'Máximo dos proyectos a la vez',
          texto: 'Si no hay cupo, le damos una fecha de inicio. No aceptamos lo que no podemos atender bien.',
        },
        {
          titulo: 'Dos rondas de cambios',
          texto: 'Puede pedir cambios dos veces. Lo adicional se cotiza antes de hacerlo.',
        },
        {
          titulo: 'Un formulario y dos reuniones',
          texto: 'Un formulario para reunir la información, una reunión al inicio y otra para presentarle el trabajo.',
        },
        {
          titulo: 'Horario definido',
          texto: `${CONTACTO.horario}.`,
        },
        {
          titulo: 'Sin soporte ilimitado',
          texto: 'Cada mensualidad dice cuántos cambios incluye. Así sabe qué paga y qué recibe.',
        },
      ],
      nota: 'Su web y las respuestas automáticas de WhatsApp funcionan a toda hora. Nuestra atención personal sigue el horario de arriba.',
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
      etiqueta: 'Compromisos',
      titulo: 'Lo que cumplimos',
      tipo: 'tarjetas',
      columnas: 2,
      items: [
        {
          titulo: 'Sin promesas falsas',
          texto: 'No prometemos el primer lugar en Google ni respuestas perfectas. Le decimos qué depende de nosotros y qué depende de Google o WhatsApp.',
          icono: icono('shield'),
        },
        {
          titulo: 'Cuidado de sus datos',
          texto: 'Pedimos solo los datos necesarios y su autorización para usarlos. No recomendamos usar las respuestas automáticas con información sensible.',
          icono: icono('lock'),
        },
      ],
    },
    {
      id: 'fuera-de-alcance',
      etiqueta: 'No hacemos',
      titulo: 'Lo que no hacemos',
      introduccion: 'Hoy no ofrecemos:',
      tipo: 'lista',
      variante: 'excluye',
      items: [
        'Chatbots hechos a la medida.',
        'Conexión con otros programas de su empresa (ventas, facturación, inventario).',
        'Envío de mensajes masivos por WhatsApp.',
        'Soporte técnico de WhatsApp ni recuperación de cuentas suspendidas.',
      ],
      nota: 'Si lo que necesita no está en esta página, se lo decimos en la primera conversación.',
    },
  ],
  preguntas: [
    {
      pregunta: '¿Qué significa que VRS Digital sea empresa aliada MinTIC?',
      respuesta:
        `${AVAL.texto} Usted puede consultar esa verificación en la tienda institucional de VRS Digital en la plataforma Cercia, enlazada en esta página.`,
    },
    {
      pregunta: '¿Dónde está ubicado VRS Digital?',
      respuesta:
        'En Bogotá. Trabajamos a distancia, por WhatsApp y correo, con empresas de Bogotá y de otras ciudades de Colombia.',
    },
  ],
  cta: {
    titulo: 'Pida una revisión digital gratuita',
    texto: 'Víctor revisa su web, cómo aparece en Google y su WhatsApp. Le entrega tres mejoras concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
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
  actualizado: '2026-10-19',
} as const satisfies ModuloPagina;

// ── Presentación propia de /nosotros/ ───────────────────────────────────────
/**
 * Pasos que hace el fundador en cada proyecto. Resumen visual del primer párrafo de
 * «responsable» («hace el diagnóstico, planea, diseña, construye, revisa y presenta cada
 * entrega»): si cambia ese párrafo, cambie también esta lista.
 */
export const etapasFundador = {
  titulo: 'Quién hace cada paso de su proyecto',
  etapas: ['Diagnóstico', 'Plan', 'Diseño', 'Construcción', 'Revisión', 'Presentación'],
} as const;
