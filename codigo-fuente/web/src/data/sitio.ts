// ─────────────────────────────────────────────────────────────────────────────
//  Datos maestros de la web de VRS Digital. Única fuente de verdad para
//  precios, planes, contacto y casos. Fuentes:
//  - Informe "Estrategia integral para VRS Digital" (2026-10-05), decisiones definitivas.
//  - contexto/negocio.md y memoria/MEMORIA.md (contacto, aval MinTIC, portafolio).
//  Para cambiar un precio o un dato de contacto, edite solo este archivo.
// ─────────────────────────────────────────────────────────────────────────────

/** Dirección pública del sitio. Cambie esta línea cuando tenga dominio propio (ej. https://vrsdigital.co). */
export const SITIO = {
  url: 'https://goldenrod-bee-973005.hostingersite.com',
  nombre: 'VRS Digital',
  idioma: 'es-CO',
  categoria: 'Páginas web, posicionamiento y atención por WhatsApp para empresas de servicios',
  eslogan: 'Más visible. Mejor atendido.',
  propuesta:
    'VRS Digital crea páginas web para empresas de servicios, las prepara para Google y asistentes de IA, y configura el agente de IA que Meta ofrece en WhatsApp Business.',
  ciudad: 'Bogotá',
  pais: 'CO',
  imagenSocial: '/img/og-vrs-digital.png',
  /** Logo para Google (JSON-LD): 512 x 512, marca completa (símbolo y nombre) con 20 % de margen y fondo
   *  oscuro sólido, para que se vea sobre blanco. Se genera con herramientas/iconos.cjs. */
  logo: '/img/logo-schema.png',
} as const;

export const FUNDADOR = {
  nombre: 'Víctor Alfonso Ramírez Sepúlveda',
  nombreCorto: 'Víctor Ramírez',
  cargo: 'Fundador y responsable de cada proyecto',
  foto: '/img/hero-image.png',
  linkedin: 'https://www.linkedin.com/in/victor-alfonso-ramirez-sepulveda/',
  github: 'https://github.com/DigitalJustOne',
} as const;

export const CONTACTO = {
  whatsappNumero: '573059129692',
  whatsappVisible: '+57 305 912 9692',
  telefonoE164: '+573059129692',
  correo: 'vrsdigitalcol@gmail.com',
  // Espacios de no separación en «a. m.» y «p. m.»: la hora no se parte entre dos líneas.
  horario: 'Lunes a viernes, de 9:00\u00a0a.\u00a0m. a 6:00\u00a0p.\u00a0m. (hora de Colombia)',
  horarioSchema: { dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], abre: '09:00', cierra: '18:00' },
  respuestaHumana: 'Respondemos en uno o dos días hábiles.',
  formspreeId: 'xnjbnyvb',
  redes: {
    instagram: 'https://www.instagram.com/vrs.digital.col',
    facebook: 'https://www.facebook.com/VRS.Digital.colombia/',
    linkedin: 'https://www.linkedin.com/in/victor-alfonso-ramirez-sepulveda/',
    github: 'https://github.com/DigitalJustOne',
  },
  tiendaMintic: 'https://vrs-digital.cercia.co',
} as const;

/** Enlace a WhatsApp con un mensaje prellenado. */
export function enlaceWhatsApp(mensaje = 'Hola, quiero solicitar una revisión digital de mi empresa con VRS Digital.') {
  return `https://wa.me/${CONTACTO.whatsappNumero}?text=${encodeURIComponent(mensaje)}`;
}

/** Cifras confirmadas. Víctor (2026-10-18): está empezando; no publicar años de experiencia ni número de clientes. */
export const CIFRAS = [
  { valor: '2', etiqueta: 'proyectos activos como máximo, para cuidar la calidad' },
] as const;

// ── Precios ──────────────────────────────────────────────────────────────────
// Precios del informe (2026-10-05), confirmados por la Dirección el mismo día:
// se publica el valor más bajo de cada rango como "desde" y el Plan Emprendedor aparte.
export const MONEDA = 'COP';
/** Confirmado por la Dirección (2026-10-06): todos los precios publicados incluyen IVA (Ley 1480, art. 26). */
export const NOTA_PRECIOS = 'Precios en pesos colombianos, IVA incluido.';

export function formatoCOP(valor: number) {
  return '$' + valor.toLocaleString('es-CO', { maximumFractionDigits: 0 });
}

export type IdPlan = 'esencial' | 'visible' | 'atencion';

/** Forma de pago anual: un solo pago, o 12 cuotas mensuales con un recargo de 20 %. */
export const CUOTAS = { numero: 12, recargo: 0.2 } as const;

/** Cuota mensual de un plan anual (pago en 12 cuotas), redondeada a miles de pesos. */
export function cuotaMensual(precioAnual: number) {
  return Math.round((precioAnual * (1 + CUOTAS.recargo)) / CUOTAS.numero / 1000) * 1000;
}

/** Total que suma pagar en cuotas (12 cuotas mensuales). */
export function totalEnCuotas(precioAnual: number) {
  return cuotaMensual(precioAnual) * CUOTAS.numero;
}

export interface Plan {
  id: IdPlan;
  nombre: string;
  paraQuien: string;
  /** Precio anual «desde», IVA incluido: se paga de una vez o en 12 cuotas (ver cuotaMensual). */
  precioAnualDesde: number;
  precioAnualHasta: number;
  incluye: string[];
  noIncluye: string[];
  incluyeAnterior?: string;
  destacado?: boolean;
  etiqueta?: string;
}

export const PLANES: Plan[] = [
  {
    id: 'esencial',
    nombre: 'Web Esencial',
    paraQuien: 'Para empresas que necesitan presencia profesional y un contacto claro.',
    precioAnualDesde: 1_200_000,
    precioAnualHasta: 1_900_000,
    incluye: [
      'Dominio (.com o .com.co) y hosting incluidos el primer año',
      'Sitio de hasta cinco secciones o páginas, según alcance',
      'Diseño adaptable a celular',
      `Estructura y textos preparados con apoyo de IA y revisados por ${FUNDADOR.nombreCorto}`,
      'Botón de WhatsApp',
      'Formulario de contacto',
      'Optimización inicial para Google en cada página',
      'Certificado de seguridad (SSL) y configuración técnica',
      'Manual breve de uso',
    ],
    noIncluye: ['Seguimiento mensual de posicionamiento', 'Contenido continuo', 'Atención inteligente en WhatsApp'],
  },
  {
    id: 'visible',
    nombre: 'Web Visible',
    paraQuien: 'Para empresas que quieren recibir clientes desde Google y asistentes de IA.',
    precioAnualDesde: 2_200_000,
    precioAnualHasta: 3_800_000,
    incluyeAnterior: 'Todo lo de Web Esencial, más:',
    incluye: [
      'Investigación de lo que buscan sus clientes',
      'Una página independiente por cada servicio',
      'Títulos y descripciones escritos según la investigación de búsquedas',
      'Enlaces internos entre páginas',
      'Datos estructurados (código que describe su empresa a Google)',
      'Optimización inicial de su perfil de Google (Google Business Profile)',
      'Preguntas frecuentes preparadas para respuestas de IA',
      'Seguimiento mensual en Google',
    ],
    noIncluye: ['Atención inteligente en WhatsApp', 'Primer lugar garantizado en Google'],
  },
  {
    id: 'atencion',
    nombre: 'Web + Atención Inteligente',
    paraQuien: 'Para empresas que quieren ser encontradas y responder a sus clientes incluso fuera de horario.',
    precioAnualDesde: 3_000_000,
    precioAnualHasta: 5_200_000,
    incluyeAnterior: 'Todo lo de Web Visible, más:',
    incluye: [
      'Verificación de que su cuenta tenga acceso al agente de Meta',
      'Organización de la información de su negocio',
      'Configuración del tono de las respuestas',
      'Respuestas de ejemplo y documentos de apoyo',
      'Definición de los datos que el agente puede pedir',
      'Criterios para pasar la conversación a una persona',
      'Prueba de 25 a 40 preguntas y corrección de respuestas',
      'Optimización inicial durante 30 días',
    ],
    noIncluye: ['Chatbot desarrollado a medida', 'API, CRM o integraciones con otros sistemas', 'Envíos masivos'],
    destacado: true,
    etiqueta: 'Oferta principal',
  },
];

/** Plan de entrada separado de los planes empresariales (decisión 14 del informe). */
export const PLAN_ENTRADA = {
  nombre: 'Plan Emprendedor',
  mensualidad: 49_900,
  descripcion: 'Página de una sola sección, estandarizada, con alojamiento (hosting) y agenda básica incluidos. Pensado para microempresas que empiezan.',
  noIncluye: ['Posicionamiento mensual', 'Atención inteligente en WhatsApp'],
} as const;

// ── Dominio + hosting y landing (decisión de la Dirección, 2026-10-12) ──────
// Víctor: unificar dominio y hosting en un solo paquete comercial (el hosting ya no le cuesta;
// el dominio cuesta entre $70.000 y $140.000 al año) y publicar la landing en $300.000–$350.000.
// Estrategia (13-10-2026, igual en el PC de Víctor): un solo precio anual que cubre cualquier dominio
// .com o .com.co; incluido sin costo en los tres planes web mientras paguen la mensualidad (gancho de
// venta); combo landing + primer año de dominio y hosting con ahorro real.

/** Paquete anual de dominio y hosting. Un solo precio, sin letra pequeña. */
export const DOMINIO_HOSTING = {
  nombre: 'Dominio + Hosting',
  precioAnual: 149_900,
  incluye: [
    'Dominio .com o .com.co, registrado a nombre de su empresa',
    'Hosting (alojamiento) de su web',
    'Certificado de seguridad (SSL), el candado del navegador',
  ],
  /** Texto corto para notas de precios en todas las páginas. */
  resumen: 'Dominio y hosting incluidos el primer año en los planes web. Para la Landing Page y el Plan Emprendedor, $149.900 al año, IVA incluido.',
} as const;

/** Landing page: pago único, la puerta de entrada más económica. */
export const LANDING = {
  nombre: 'Landing Page',
  precio: 350_000,
  /** Landing + primer año de dominio y hosting (350.000 + 149.900 = 499.900; se ofrece en 449.900). */
  precioConDominio: 449_900,
  paraQuien: 'Para lanzar un servicio, una promoción o su negocio con una sola página que lleva a WhatsApp.',
  descripcion:
    'Una página de una sola sección, diseñada para convertir visitas en mensajes de WhatsApp. Pago único, sin mensualidad obligatoria.',
  incluye: [
    'Una página de una sola sección, con sus textos de venta',
    'Diseño adaptable a celular',
    'Botón de WhatsApp y formulario de contacto',
    'Optimización inicial para Google',
  ],
  noIncluye: ['Varias páginas o una página por servicio', 'Seguimiento mensual de posicionamiento', 'Atención inteligente en WhatsApp'],
} as const;

/** Precio más bajo publicado (para «desde» en el menú, llms.txt y datos para Google). */
export const PRECIO_MINIMO = LANDING.precio;

export const FORMA_DE_PAGO = [
  { porcentaje: 50, momento: 'para iniciar el proyecto' },
  { porcentaje: 30, momento: 'al aprobar el diseño o la versión funcional' },
  { porcentaje: 20, momento: 'antes de publicar' },
] as const;

export const CONDICIONES = [
  'Cada plan tiene un precio anual: se paga de una vez o en 12 cuotas mensuales, que suman 20 % más.',
  DOMINIO_HOSTING.resumen,
  'Licencias y suscripciones externas se identifican por separado.',
  'Trabajamos con un máximo de dos proyectos al mismo tiempo; la fecha de inicio se asigna según disponibilidad.',
] as const;

/** Enlace de pago público de Bold (monto abierto: el cliente escribe el valor acordado). Sin claves. */
export const PAGO_EN_LINEA = {
  url: 'https://checkout.bold.co/payment/LNK_Z8LL7341LP',
  texto: 'Pagar en línea',
  ayuda: 'Escriba el valor acordado en su propuesta. Acepta tarjeta, PSE y otros medios de Bold.',
} as const;

export const MEDIOS_PAGO = ['Transferencia Bancolombia', 'PSE a través de Bold', 'Tarjeta de crédito o débito a través de Bold'] as const;

// ── Servicios (páginas de servicio) ─────────────────────────────────────────
export const SERVICIOS = [
  {
    slug: 'paginas-web-bogota',
    nombre: 'Páginas web profesionales',
    resumen: 'Una web clara, rápida y adaptada a celular que explica sus servicios y facilita el contacto.',
    icono: 'monitor',
  },
  {
    slug: 'posicionamiento-google-inteligencia-artificial',
    nombre: 'Posicionamiento en Google y asistentes de IA',
    resumen: 'Estructura y contenido para que Google y los asistentes de IA entiendan y puedan mostrar su empresa.',
    icono: 'search',
  },
  {
    slug: 'asistente-whatsapp-business',
    nombre: 'Atención inteligente en WhatsApp Business',
    resumen: 'Configuramos el agente de IA disponible en WhatsApp Business para responder preguntas frecuentes, incluso fuera de horario.',
    icono: 'message',
  },
  {
    slug: 'precios',
    nombre: 'Mantenimiento y mejoras mensuales',
    resumen: 'Mantenemos su información actualizada y mejoramos la web mes a mes, con un alcance definido.',
    icono: 'refresh',
  },
] as const;

export const SECTORES = [
  { slug: 'paginas-web-contadores', nombre: 'Firmas contables y tributarias' },
  { slug: 'paginas-web-consultores', nombre: 'Consultores y capacitadores' },
  { slug: 'paginas-web-empresas-servicios', nombre: 'Empresas de servicios' },
] as const;

// ── Proyectos (memoria/MEMORIA.md) ──────────────────────────────────────────
// Víctor (2026-10-18): está empezando; solo ha tenido un par de clientes de páginas web y el resto
// son proyectos propios o personales. No confirmó cuáles fueron clientes: por eso ninguno se rotula
// como «Cliente» ni muestra resultados, solo «Proyecto» y lo que ofrece cada sitio.
export interface Caso {
  cliente: string;
  sector: string;
  imagen: string;
  resumen: string;
  logros: string[];
  enlace: string;
  destacado?: boolean;
  /** 'cliente' = trabajo para un cliente (solo si Víctor lo confirma); 'proyecto' = trabajo de Víctor sin
   *  confirmar si fue para un cliente; 'producto' = producto propio de VRS Digital. */
  tipo: 'cliente' | 'proyecto' | 'producto';
}

export const CASOS: Caso[] = [
  // Víctor (2026-10-18): sus últimos proyectos. Contenido de La Casa de las Tejas revisado en sus sitios
  // públicos el 2026-10-18; las 54 páginas y las campañas de Google Ads, dichas por Víctor.
  {
    cliente: 'La Casa de las Tejas',
    sector: 'Tejas y cubiertas, Bogotá',
    imagen: '/img/tejas.png',
    resumen: 'Web corporativa de 54 páginas internas para una empresa que vende e instala tejas y cubiertas, con cotizador en línea.',
    logros: ['54 páginas internas', 'Cotizador en línea que envía la solicitud por WhatsApp', 'Guías y comparador de productos'],
    enlace: 'https://lacasadelastejas.com.co/',
    tipo: 'proyecto',
    destacado: true,
  },
  {
    cliente: 'La Casa de las Tejas: teja Standing Seam',
    sector: 'Landing page para Google Ads',
    imagen: '/img/tejas-standing.png',
    resumen: 'Landing page de un producto, hecha para campañas de Google Ads, que prepara una propuesta de obra por WhatsApp.',
    logros: ['Un solo producto y un solo llamado a la acción', 'Propuesta de obra enviada por WhatsApp'],
    enlace: 'https://standing.lacasadelastejas.com.co/',
    tipo: 'proyecto',
  },
  {
    cliente: 'MG Power Electric',
    sector: 'Contratista eléctrico, Colorado (EE. UU.)',
    imagen: '/img/mg-power-electric.png',
    // Víctor (2026-10-18): lista, se publica en mgpowerelectric.com cuando el cliente confirme el pago.
    // Mientras tanto se enlaza la dirección temporal; cambiarla al dominio cuando esté en línea.
    // Contenido tomado de la captura de la web (2026-10-18).
    resumen: 'Página web en inglés para un contratista eléctrico de Colorado, Estados Unidos, lista para publicarse en mgpowerelectric.com.',
    logros: ['Web en inglés', 'Solicitud de presupuesto y llamada directa'],
    enlace: 'https://mgpowerelectric.surge.sh',
    tipo: 'cliente',
  },
  {
    cliente: 'La Casa de las Tejas: panel sándwich',
    sector: 'Landing page para Google Ads',
    imagen: '/img/tejas-panel.png',
    resumen: 'Landing page de cubiertas en panel sándwich, hecha para campañas de Google Ads, con cotizador de material y flete.',
    logros: ['Cotizador de material y flete', 'Solicitud enviada por WhatsApp a un asesor'],
    enlace: 'https://panel.lacasadelastejas.com.co/',
    tipo: 'proyecto',
  },
  // Orden y destacado: primero los casos con captura real de la web. DEC solo tiene su logo
  // (falta una captura de su sitio): no se destaca hasta tenerla.
  {
    cliente: 'Delis Broaster',
    sector: 'Restaurantes',
    imagen: '/img/delis-broaster.png',
    resumen: 'Menú digital y pedidos en línea sin pagar comisiones a aplicaciones externas.',
    logros: ['Menú digital', 'Pedidos directos desde la web'],
    enlace: 'https://delisbroastersocorro.com/',
    tipo: 'proyecto',
  },
  {
    cliente: 'Vitalcarga',
    sector: 'Transporte y logística',
    imagen: '/img/vitalcarga.png',
    resumen: 'Plataforma logística con consulta de guías nacionales e internacionales.',
    logros: ['Consulta de guías en línea', 'Información clara para clientes'],
    enlace: 'https://vitalcarga.com',
    tipo: 'proyecto',
  },
  {
    cliente: 'Longevity Therapy',
    sector: 'Salud y bienestar',
    imagen: '/img/longevity-therapy.png',
    resumen: 'Portal de programas de bienestar con agendamiento de sesiones.',
    logros: ['Programas explicados con claridad', 'Agendamiento de sesiones'],
    enlace: 'https://digitaljustone.github.io/longevity-therapy-web/',
    tipo: 'proyecto',
  },
  {
    cliente: 'Equipos y Componentes DEC',
    sector: 'Industria eléctrica',
    imagen: '/img/dec-preview.png',
    resumen: 'Catálogo técnico digital con solicitud de cotización desde la web.',
    logros: ['Catálogo industrial en línea', 'Solicitud de cotización desde la web'],
    enlace: 'https://olive-swallow-164735.hostingersite.com',
    tipo: 'proyecto',
  },
  {
    // Confirmado por la Dirección (2026-10-06): Beauty Manager no es un cliente, es un producto
    // propio de VRS Digital para el sector belleza, disponible para quien lo quiera adquirir.
    cliente: 'Beauty Manager',
    sector: 'Producto propio para el sector belleza',
    // Ilustración propia con datos de ejemplo (agenda y clientes), sin cifras de resultados.
    imagen: '/img/beautymanager-agenda.png',
    resumen: 'Plataforma de gestión para centros de estética y spas, desarrollada por VRS Digital y disponible para adquirir.',
    logros: ['Citas, clientes y métricas del negocio en un solo panel', 'Seguimiento de inasistencias a citas'],
    enlace: 'https://lightsalmon-koala-119277.hostingersite.com/login',
    tipo: 'producto',
  },
  {
    cliente: 'Belleza Profesional',
    sector: 'Software para estética',
    imagen: '/img/beauty-pro.png',
    resumen: 'Gestión de citas, clientes e inventario para centros de belleza.',
    logros: ['Citas, clientes e inventario en un solo lugar'],
    enlace: 'https://darkgreen-barracuda-813471.hostingersite.com/',
    // Sin confirmar si fue para un cliente; se rotula «Plataforma» (PRESENTACION de @/lib/casos).
    tipo: 'proyecto',
  },
];

export const AVAL = {
  titulo: 'Empresa aliada MinTIC',
  texto: 'VRS Digital fue verificada como empresa aliada del programa de transformación digital del Ministerio de Tecnologías de la Información y las Comunicaciones de Colombia.',
  enlace: 'https://vrs-digital.cercia.co',
} as const;

// ── Proceso de entrega (informe, sección "Proceso de entrega") ──────────────
export const PROCESO = [
  { paso: '01', titulo: 'Diagnóstico', texto: 'Formulario único y reunión de hasta 45 minutos. Confirmamos el alcance y verificamos si su WhatsApp tiene acceso al agente de Meta.' },
  { paso: '02', titulo: 'Preparación', texto: 'Investigación, lista de páginas y textos iniciales. Usted revisa todo en un documento central.' },
  { paso: '03', titulo: 'Construcción', texto: 'Diseño, desarrollo, optimización para Google y configuración de WhatsApp, con pruebas en celular y computador.' },
  { paso: '04', titulo: 'Aprobación', texto: 'Presentación completa, dos rondas de ajustes y aprobación por escrito.' },
  { paso: '05', titulo: 'Publicación', texto: 'Dominio, seguridad, solicitud a Google para que muestre sus páginas, activación del agente si está disponible y manual breve.' },
] as const;

// ── Navegación ───────────────────────────────────────────────────────────────
export const MENU = [
  {
    nombre: 'Servicios',
    href: '/paginas-web-bogota/',
    hijos: [
      { nombre: 'Páginas web profesionales', href: '/paginas-web-bogota/' },
      { nombre: 'Posicionamiento en Google y asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
      { nombre: 'Atención inteligente en WhatsApp', href: '/asistente-whatsapp-business/' },
    ],
  },
  {
    nombre: 'Sectores',
    href: '/paginas-web-empresas-servicios/',
    hijos: [
      { nombre: 'Firmas contables', href: '/paginas-web-contadores/' },
      { nombre: 'Consultores', href: '/paginas-web-consultores/' },
      { nombre: 'Empresas de servicios', href: '/paginas-web-empresas-servicios/' },
    ],
  },
  { nombre: 'Precios', href: '/precios/' },
  { nombre: 'Proyectos', href: '/proyectos/' },
  { nombre: 'Recursos', href: '/recursos/' },
  { nombre: 'Nosotros', href: '/nosotros/' },
] as const;

/** La revisión es gratuita, sencilla y sin compromiso (confirmado por la Dirección, 2026-10-06). */
export const CTA_PRINCIPAL = { texto: 'Solicitar revisión gratuita', href: '/contacto/' } as const;
