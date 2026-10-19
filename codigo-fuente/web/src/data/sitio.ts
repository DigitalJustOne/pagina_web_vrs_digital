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
    'VRS Digital hace páginas web para empresas, las deja listas para aparecer en Google y asistentes de IA, y ofrece respuestas automáticas en WhatsApp Business.',
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
  // Víctor (2026-10-18): el número se muestra sin indicativo de país. Los enlaces (wa.me, tel:) sí lo llevan.
  whatsappVisible: '305 912 9692',
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

// ── Ficha de cada oferta (Víctor, 2026-10-18: «la información no es clara») ─────────────────
// Toda oferta (Landing Page, Plan Emprendedor y los tres planes web) responde las mismas preguntas,
// en el mismo orden y con palabras simples: regla de claridad (LEEME-WEB-NUEVA.md, sección 1, y
// GUIA-CLARIDAD.md). Las tarjetas, la tabla de /precios/, el formulario y llms.txt leen estas fichas.
// Un dato que Víctor no ha confirmado no se escribe: esa fila queda sin respuesta y no se muestra.

export type IdFila = 'paginas' | 'dominio' | 'hosting' | 'contacto' | 'google' | 'respuestas';

export interface Respuesta {
  /** true: la oferta lo trae (marca ✓). false: no lo trae (marca –). */
  si: boolean;
  /** Respuesta corta: un número o pocas palabras. */
  texto: string;
}

export type Ficha = Partial<Record<IdFila, Respuesta>>;

/** Las preguntas de la ficha, en orden. «explicacion» aclara la palabra técnica (se muestra una vez). */
export const FILAS_FICHA: readonly { id: IdFila; pregunta: string; explicacion?: string }[] = [
  { id: 'paginas', pregunta: 'Páginas' },
  { id: 'dominio', pregunta: 'Dominio', explicacion: 'el nombre de su web, como suempresa.com' },
  { id: 'hosting', pregunta: 'Hosting', explicacion: 'el espacio en internet donde queda guardada su web' },
  { id: 'contacto', pregunta: 'Botón de WhatsApp y formulario' },
  { id: 'google', pregunta: 'Google' },
  { id: 'respuestas', pregunta: 'Respuestas automáticas en WhatsApp' },
];

export interface Plan {
  id: IdPlan;
  nombre: string;
  /** Qué recibe el cliente, en una frase y con números (no «para quién es»). */
  queEs: string;
  /** Precio anual «desde», IVA incluido: se paga de una vez o en 12 cuotas (ver cuotaMensual). */
  precioAnualDesde: number;
  precioAnualHasta: number;
  ficha: Ficha;
  /** Todo lo que incluye, en palabras simples. */
  incluye: string[];
  noIncluye: string[];
  incluyeAnterior?: string;
  destacado?: boolean;
  etiqueta?: string;
}

/** Precio anual del paquete de dominio y hosting (más abajo, DOMINIO_HOSTING). */
const PRECIO_DOMINIO_HOSTING = 149_900;

/** Lo que tienen igual los tres planes web. */
const FICHA_PLANES_WEB = {
  dominio: { si: true, texto: 'Incluido el primer año, a nombre de su empresa' },
  hosting: { si: true, texto: 'Incluido el primer año' },
  contacto: { si: true, texto: 'Sí' },
} as const satisfies Ficha;

/** Web Visible y Web + Atención Inteligente: una página por servicio y trabajo mensual en Google. */
const FICHA_VISIBLE = {
  paginas: { si: true, texto: 'Hasta 5, más una por cada servicio' },
  google: { si: true, texto: 'Investigamos qué buscan sus clientes y cada mes revisamos cómo aparece' },
} as const satisfies Ficha;

export const PLANES: Plan[] = [
  {
    id: 'esencial',
    nombre: 'Web Esencial',
    queEs: 'Su web de hasta 5 páginas, con botón de WhatsApp y formulario. Trae dominio y hosting del primer año.',
    precioAnualDesde: 1_200_000,
    precioAnualHasta: 1_900_000,
    ficha: {
      paginas: { si: true, texto: 'Hasta 5' },
      ...FICHA_PLANES_WEB,
      google: { si: true, texto: 'La dejamos lista para que Google la pueda mostrar' },
      respuestas: { si: false, texto: 'No' },
    },
    incluye: [
      'Hasta 5 páginas, por ejemplo: Inicio, Servicios, Nosotros y Contacto',
      'Nosotros escribimos los textos y usted los aprueba',
      'Se ve bien en el celular y en el computador',
      'Botón de WhatsApp y formulario de contacto',
      'Cada página lista para que Google la pueda mostrar',
      'Dominio y hosting del primer año, con el candado de seguridad',
      'Un manual corto para usar su web',
    ],
    noIncluye: ['Revisión mensual en Google', 'Textos nuevos cada mes', 'Respuestas automáticas en WhatsApp'],
  },
  {
    id: 'visible',
    nombre: 'Web Visible',
    queEs: 'Todo lo de Web Esencial, más una página para cada servicio y trabajo cada mes para que su empresa salga en Google.',
    precioAnualDesde: 2_200_000,
    precioAnualHasta: 3_800_000,
    incluyeAnterior: 'Todo lo de Web Esencial, más:',
    ficha: {
      paginas: FICHA_VISIBLE.paginas,
      ...FICHA_PLANES_WEB,
      google: FICHA_VISIBLE.google,
      respuestas: { si: false, texto: 'No' },
    },
    incluye: [
      'Investigamos qué escriben en Google las personas que buscan lo que usted ofrece',
      'Una página aparte para cada servicio, escrita con esas búsquedas',
      'En cada página, el título y la descripción que Google muestra en sus resultados',
      'Páginas enlazadas entre sí, para que Google las encuentre todas',
      'Información oculta en la web que le dice a Google quién es su empresa y qué ofrece',
      'Mejoramos su ficha de empresa en Google Maps',
      'Preguntas frecuentes con respuestas cortas, que Google y asistentes como ChatGPT pueden entender',
      'Cada mes revisamos cómo aparece su web en Google',
    ],
    noIncluye: ['Respuestas automáticas en WhatsApp', 'El primer lugar en Google: nadie lo puede garantizar'],
  },
  {
    id: 'atencion',
    nombre: 'Web + Atención Inteligente',
    queEs: 'Todo lo de Web Visible, más respuestas automáticas en su WhatsApp Business, a cualquier hora.',
    precioAnualDesde: 3_000_000,
    precioAnualHasta: 5_200_000,
    incluyeAnterior: 'Todo lo de Web Visible, más:',
    ficha: {
      paginas: FICHA_VISIBLE.paginas,
      ...FICHA_PLANES_WEB,
      google: FICHA_VISIBLE.google,
      respuestas: { si: true, texto: 'Sí, a cualquier hora' },
    },
    incluye: [
      'Revisamos si su WhatsApp Business puede tener respuestas automáticas',
      'Ordenamos la información de su negocio para que responda bien',
      'Definimos el tono de las respuestas',
      'Escribimos respuestas de ejemplo y documentos de apoyo',
      'Definimos qué datos le puede pedir a su cliente',
      'Definimos cuándo pasa la conversación a una persona',
      'La probamos con 25 a 40 preguntas y corregimos lo que responda mal',
      'Durante los primeros 30 días revisamos y mejoramos las respuestas',
    ],
    noIncluye: [
      'Un chatbot hecho a la medida',
      'Conexión con otros programas de su empresa (ventas, facturación o inventario)',
      'Envío de mensajes masivos',
    ],
    destacado: true,
    etiqueta: 'Oferta principal',
  },
];

/** Plan de entrada separado de los planes web. Víctor (2026-10-19): costo fijo mensual, una página
 *  muy sencilla con dirección web temporal gratuita, sin formulario ni agenda, para quien quiere probar
 *  sin invertir mucho. Sin confirmar: si trae botón de WhatsApp (esa fila de la ficha no se muestra). */
export const PLAN_ENTRADA = {
  nombre: 'Plan Emprendedor',
  mensualidad: 49_900,
  // Víctor, 2026-10-19: costo fijo mensual; página sencilla con dominio temporal
  // gratuito, para quien no sabe nada de esto y quiere probar sin invertir mucho.
  queEs: 'Una página muy sencilla por un pago fijo de $49.900 al mes. Para probar sin invertir mucho.',
  ficha: {
    paginas: { si: true, texto: '1' },
    dominio: { si: true, texto: `Una dirección temporal gratis. Su propio dominio se agrega por ${formatoCOP(PRECIO_DOMINIO_HOSTING)} al año` },
    hosting: { si: true, texto: 'Incluido' },
    google: { si: false, texto: 'Sin revisión mensual' },
    respuestas: { si: false, texto: 'No' },
  } satisfies Ficha as Ficha,
  incluye: ['1 página muy sencilla, con un diseño base ya hecho', 'Una dirección web temporal gratis', 'Hosting'],
  noIncluye: [`Dominio propio: se agrega por ${formatoCOP(PRECIO_DOMINIO_HOSTING)} al año`, 'Formulario de contacto', 'Agenda', 'Revisión mensual en Google', 'Respuestas automáticas en WhatsApp'],
} as const;

// ── Dominio + hosting y landing (decisión de la Dirección, 2026-10-12) ──────
// Víctor: unificar dominio y hosting en un solo paquete comercial (el hosting ya no le cuesta;
// el dominio cuesta entre $70.000 y $140.000 al año) y publicar la landing en $300.000–$350.000.
// Estrategia (13-10-2026, igual en el PC de Víctor): un solo precio anual que cubre cualquier dominio
// .com o .com.co; incluido sin costo en los tres planes web el primer año (gancho de venta); combo
// landing + primer año de dominio y hosting con ahorro real. Nada se dice de lo que pasa después del
// primer año (Víctor, 2026-10-13).

const DOMINIO_HOSTING_APARTE = `La Landing Page no los trae: se agregan por ${formatoCOP(PRECIO_DOMINIO_HOSTING)} al año. El Plan Emprendedor trae el hosting y una dirección temporal gratis; su propio dominio se agrega por ${formatoCOP(PRECIO_DOMINIO_HOSTING)} al año. IVA incluido.`;

/** Paquete anual de dominio y hosting. Un solo precio, sin letra pequeña. */
export const DOMINIO_HOSTING = {
  nombre: 'Dominio + Hosting',
  precioAnual: PRECIO_DOMINIO_HOSTING,
  incluye: [
    'Dominio .com o .com.co (el nombre de su web), a nombre de su empresa',
    'Hosting (el espacio en internet donde queda guardada su web)',
    'El candado de seguridad que muestra el navegador',
  ],
  /** Qué pasa con la Landing Page y el Plan Emprendedor, que no traen las dos cosas. */
  aparte: DOMINIO_HOSTING_APARTE,
  /** Texto corto para notas de precios en todas las páginas. */
  resumen: `En los planes web, el dominio y el hosting van incluidos el primer año. ${DOMINIO_HOSTING_APARTE}`,
} as const;

/** Landing page: pago único, la puerta de entrada más económica. */
export const LANDING = {
  nombre: 'Landing Page',
  precio: 350_000,
  /** Landing + primer año de dominio y hosting (350.000 + 149.900 = 499.900; se ofrece en 449.900). */
  precioConDominio: 449_900,
  queEs: 'Una sola página para vender un servicio o una promoción. Quien la visita le escribe por WhatsApp.',
  ficha: {
    paginas: { si: true, texto: '1' },
    dominio: { si: false, texto: 'No incluido. Con dominio y hosting del primer año: $449.900 en total' },
    hosting: { si: false, texto: 'No incluido. Va en el valor de $449.900' },
    contacto: { si: true, texto: 'Sí' },
    google: { si: true, texto: 'La dejamos lista para que Google la pueda mostrar' },
    respuestas: { si: false, texto: 'No' },
  } satisfies Ficha as Ficha,
  incluye: [
    '1 página para vender un servicio o una promoción',
    'Los textos de venta',
    'Se ve bien en el celular y en el computador',
    'Botón de WhatsApp y formulario de contacto',
    'Lista para que Google la pueda mostrar',
  ],
  noIncluye: ['Más páginas', 'Revisión mensual en Google', 'Respuestas automáticas en WhatsApp'],
} as const;

/** Precio más bajo publicado (para «desde» en el menú, llms.txt y datos para Google). */
export const PRECIO_MINIMO = LANDING.precio;

export const FORMA_DE_PAGO = [
  { porcentaje: 50, momento: 'para iniciar el proyecto' },
  { porcentaje: 30, momento: 'al aprobar el diseño o la versión funcional' },
  { porcentaje: 20, momento: 'antes de publicar' },
] as const;

export const CONDICIONES = [
  'Cada plan web tiene un precio al año. Puede pagarlo de una vez o en 12 cuotas mensuales, que suman 20 % más.',
  DOMINIO_HOSTING.resumen,
  'Si su web necesita un servicio de otra empresa con costo, como una licencia, se lo decimos con su precio antes de empezar.',
  'Trabajamos con máximo dos proyectos al mismo tiempo. Por eso la fecha de inicio depende de cuándo haya cupo.',
] as const;

/** Enlace de pago público de Bold (monto abierto: el cliente escribe el valor acordado). Sin claves. */
export const PAGO_EN_LINEA = {
  url: 'https://checkout.bold.co/payment/LNK_Z8LL7341LP',
  texto: 'Pagar en línea',
  ayuda: 'Escriba el valor acordado en su propuesta. Acepta tarjeta, PSE y otros medios de Bold.',
} as const;

export const MEDIOS_PAGO = ['Transferencia Bancolombia', 'PSE a través de Bold', 'Tarjeta de crédito o débito a través de Bold'] as const;

// ── Servicios (páginas de servicio) ─────────────────────────────────────────
// Sin «Mantenimiento y mejoras mensuales» (2026-10-19): no tenía página ni precio, solo enlazaba a
// /precios/, donde no se describe (Víctor, 2026-10-13). Un enlace sin información confunde.
export const SERVICIOS = [
  {
    slug: 'paginas-web-bogota',
    nombre: 'Páginas web profesionales',
    resumen: 'Su web, con botón de WhatsApp y formulario, que se ve bien en el celular.',
    icono: 'monitor',
  },
  {
    slug: 'posicionamiento-google-inteligencia-artificial',
    nombre: 'Aparecer en Google y en asistentes de IA',
    resumen: 'Trabajo para que Google y asistentes como ChatGPT entiendan su empresa y la puedan mostrar.',
    icono: 'search',
  },
  {
    slug: 'asistente-whatsapp-business',
    nombre: 'Atención inteligente en WhatsApp Business',
    resumen: 'Respuestas automáticas en su WhatsApp Business para las preguntas de siempre, también fuera de horario.',
    icono: 'message',
  },
] as const;

export const SECTORES = [
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
  { paso: '01', titulo: 'Diagnóstico', texto: 'Usted llena un formulario y hablamos hasta 45 minutos. Acordamos qué incluye su web y revisamos su WhatsApp Business.' },
  { paso: '02', titulo: 'Preparación', texto: 'Investigamos, definimos las páginas y escribimos los textos. Usted los revisa en un solo documento.' },
  { paso: '03', titulo: 'Construcción', texto: 'Hacemos el diseño y la web, la dejamos lista para Google y la probamos en celular y computador.' },
  { paso: '04', titulo: 'Aprobación', texto: 'Le mostramos todo. Puede pedir cambios dos veces. Después la aprueba por escrito.' },
  { paso: '05', titulo: 'Publicación', texto: 'Publicamos su web con el candado de seguridad y le pedimos a Google que la muestre. Si su plan lo trae, activamos las respuestas automáticas. Le entregamos un manual corto.' },
] as const;

// ── Navegación ───────────────────────────────────────────────────────────────
export const MENU = [
  {
    nombre: 'Servicios',
    href: '/paginas-web-bogota/',
    hijos: [
      { nombre: 'Páginas web profesionales', href: '/paginas-web-bogota/' },
      { nombre: 'Aparecer en Google y en asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
      { nombre: 'Atención inteligente en WhatsApp', href: '/asistente-whatsapp-business/' },
    ],
  },
  // Sin menú «Sectores» (Víctor, 2026-10-18): no quiere páginas ni menú por mercado.
  { nombre: 'Precios', href: '/precios/' },
  { nombre: 'Proyectos', href: '/proyectos/' },
  { nombre: 'Recursos', href: '/recursos/' },
  { nombre: 'Nosotros', href: '/nosotros/' },
] as const;

/** La revisión es gratuita, sencilla y sin compromiso (confirmado por la Dirección, 2026-10-06). */
export const CTA_PRINCIPAL = { texto: 'Solicitar revisión gratuita', href: '/contacto/' } as const;
