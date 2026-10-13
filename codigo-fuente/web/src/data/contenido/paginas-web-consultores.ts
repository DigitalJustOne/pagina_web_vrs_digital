// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /paginas-web-consultores/ (sector: consultores, capacitadores y asesores SST).
//  Palabra clave principal: «páginas web para consultores».
//  «Web para empresas SST» se atiende aquí como sección (id 'sst'): no se crea una página
//  /paginas-web-sst/ hasta tener una demostración o un caso real del sector.
//  Fuentes: informe del Director (2026-10-05: verticales, demostraciones estándar, servicio
//  de WhatsApp), src/data/sitio.ts e investigación verificada el 2026-10-06 (MinEducación,
//  Mintrabajo vía INCP, Meta; al final). Precios y contacto salen de sitio.ts.
//
//  REGLAS DE ESTA PÁGINA:
//  - Casos solo reales y autorizados; anonimizados si hay confidencialidad. Nunca inventados.
//  - No usar «certificado» para cursos de educación informal (Decreto 1075 de 2015).
//  - El agendamiento de reuniones por el agente depende de lo que Meta habilite en la cuenta.
//  - Fechas y normas de SST cambian: verificar en fuentes oficiales antes de cada temporada.
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Confirmar si la demostración estándar de consultoría empresarial ya existe (el informe la
//    pide en los días 1 a 30). Mientras no se confirme, la página NO la ofrece: el botón del
//    hero lleva a la estructura recomendada (#estructura), la sección «demostracion» es solo
//    una conversación de ejemplo y la pregunta frecuente habla de «un ejemplo».
//  EDICIÓN FINAL (2026-10-06): la pregunta de precio recomienda primero Web Visible, igual que
//  la sección de precio, para no repetir la respuesta de las otras páginas de sector.
// ─────────────────────────────────────────────────────────────────────────────
import { CONTACTO, CTA_PRINCIPAL, PLANES, enlaceWhatsApp, formatoCOP, type IdPlan, cuotaMensual } from '@/data/sitio';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;
const plan = (id: IdPlan) => PLANES.find((p) => p.id === id)!;
const desde = (id: IdPlan) => formatoCOP(plan(id).precioAnualDesde);
const cuotaDesde = (id: IdPlan) => formatoCOP(cuotaMensual(plan(id).precioAnualDesde));
/** Pasa a minúscula la primera letra, salvo en siglas (PSE, SST). */
const minuscula = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

const esencial = plan('esencial');
const visible = plan('visible');
const atencion = plan('atencion');

/** Aclaración obligatoria cerca de cualquier mención de «a cualquier hora» o «fuera de horario». */
const ACLARACION_HORARIO = `El agente puede responder a cualquier hora. Nuestro acompañamiento humano es de ${minuscula(CONTACTO.horario)}. ${CONTACTO.respuestaHumana}`;

const URL_MINEDUCACION = 'https://www.mineducacion.gov.co/1780/articles-354332_archivo_pdf_Consulta.pdf';
const URL_SST_AUTOEVALUACION =
  'https://incp.org.co/publicaciones/infoincp-publicaciones/informacion-para-empresas/laboral/2026/03/mintrabajo-fecha-limite-para-el-registro-de-la-autoevaluacion-del-sg-sst/';
const URL_META_PRODUCTO_ES = 'https://whatsappbusiness.com/es-la/products/business-app-ai-agent/';
const URL_META_ANUNCIO = 'https://about.fb.com/news/2026/06/meta-business-agent/';

const MENSAJE_WHATSAPP = 'Hola, soy consultor y quiero una revisión digital de mi web.';

const PUNTO_SOLICITUDES = 'Solicitudes de propuesta ordenadas';

/**
 * Visual de la portada (MetodoConsultor.astro). Las palabras salen de esta misma página: los pasos
 * del método (tarjeta «Método») y los datos del formulario corto (ítem «Solicitar propuesta»).
 */
export const visualConsultores = {
  etiqueta:
    'Ilustración: la web de un consultor muestra su método en cuatro pasos (diagnóstico, plan, ejecución y seguimiento) y recibe una solicitud de propuesta con sector, tamaño, necesidad y fecha.',
  metodo: 'Método',
  pasos: ['Diagnóstico', 'Plan', 'Ejecución', 'Seguimiento'],
  solicitud: 'Solicitud de propuesta',
  campos: ['Sector', 'Tamaño', 'Necesidad', 'Fecha'],
  ficha: PUNTO_SOLICITUDES,
} as const;

export const contenido = {
  ruta: '/paginas-web-consultores/',
  seo: {
    // 44 caracteres + « | VRS Digital» (Seo.astro) = 58.
    titulo: 'Páginas web para consultores y capacitadores',
    descripcion:
      'Páginas web para consultores, capacitadores y asesores SST: explique su método, muestre casos reales y reciba solicitudes de propuesta claras por WhatsApp.',
    palabraClave: 'páginas web para consultores',
    secundarias: [
      'página web para consultor',
      'página web para capacitadores',
      'web para empresas SST',
      'página web para asesores de seguridad y salud en el trabajo',
      'página web para consultoría empresarial',
    ],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Empresas de servicios', ruta: '/paginas-web-empresas-servicios/' },
    { nombre: 'Consultores y capacitadores', ruta: '/paginas-web-consultores/' },
  ],
  hero: {
    etiqueta: 'Sector: consultores y capacitadores',
    titulo: 'Páginas web para consultores, capacitadores y asesores SST',
    subtitulo:
      'Una web que muestra en qué problema se especializa, cómo trabaja y qué entrega, con casos reales y una forma sencilla de pedirle una propuesta. WhatsApp ordena las solicitudes antes de que usted intervenga.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver la estructura recomendada', href: '#estructura' },
    precio: `Desde ${desde('esencial')}`,
    puntos: ['Su método explicado paso a paso', 'Casos reales, nunca inventados', PUNTO_SOLICITUDES],
  },
  respuestaDirecta:
    'Un consultor vende confianza antes que horas. Su web debe mostrar en qué problema se especializa, cómo trabaja paso a paso, qué entrega, casos reales autorizados y cómo pedir una propuesta. VRS Digital crea esa web, la prepara para Google y configura WhatsApp Business para ordenar las solicitudes antes de que usted intervenga.',
  secciones: [
    {
      id: 'que-necesita-ver',
      etiqueta: 'Lo que su cliente necesita ver',
      titulo: 'Lo que su cliente revisa antes de pedirle una propuesta',
      introduccion:
        'Quien contrata un consultor o una capacitación compara antes de escribir. Su web debe responder estas preguntas sin que el cliente tenga que llamar:',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Especialidad',
          texto: 'Qué problema resuelve, en qué sector y para qué tamaño de empresa. Mejor una especialidad clara que una lista larga.',
          icono: icono('search'),
        },
        {
          titulo: 'Método',
          texto: 'Cómo trabaja paso a paso: diagnóstico, plan, ejecución y seguimiento. Un método visible reduce la incertidumbre.',
          icono: icono('refresh'),
        },
        {
          titulo: 'Entregables',
          texto: 'Qué recibe el cliente al final: informe, plan de trabajo, sesiones, materiales o acompañamiento.',
          icono: icono('file'),
        },
        {
          titulo: 'Duración y modalidad',
          texto: 'Cuánto tarda, si es presencial, virtual o mixto, y cuánto tiempo debe dedicar el equipo del cliente.',
          icono: icono('clock'),
        },
        {
          titulo: 'Credenciales verificables',
          texto: 'Formación, licencias y membresías con un dato que se pueda comprobar, como el número de la licencia.',
          icono: icono('shield'),
        },
        {
          titulo: 'Casos y modelo de precio',
          texto: 'Casos reales autorizados y cómo cobra: por proyecto, por hora o por mes, con un valor «desde» si decide publicarlo.',
          icono: icono('chart'),
        },
      ],
    },
    {
      id: 'estructura',
      etiqueta: 'Estructura',
      titulo: 'Estructura recomendada para la web de un consultor',
      introduccion: 'Cada página tiene un solo tema. Así la entienden sus clientes, Google y los asistentes de inteligencia artificial (IA).',
      tipo: 'lista',
      items: [
        { titulo: 'Inicio', texto: 'Su especialidad y para quién trabaja, en una respuesta corta arriba de todo.' },
        { titulo: 'Una página por servicio o programa', texto: 'Problema, método, entregables, duración, modalidad y cómo se cotiza.' },
        { titulo: 'Método', texto: 'Los pasos de su forma de trabajar, con lo que el cliente aporta en cada uno.' },
        { titulo: 'Casos', texto: 'Problema, qué se hizo y resultado, con el periodo y la forma en que se midió.' },
        { titulo: 'Perfil', texto: 'Trayectoria, formación y credenciales verificables de quien presta el servicio.' },
        { titulo: 'Artículos propios', texto: 'Contenido con su experiencia, autor y fecha. No textos genéricos de «7 consejos».' },
        { titulo: 'Agenda de cursos', texto: 'Si capacita: fechas, modalidad, duración en horas y lo que entrega al terminar.' },
        { titulo: 'Solicitar propuesta', texto: 'Un formulario corto (sector, tamaño, necesidad y fecha) con autorización de datos.' },
      ],
    },
    {
      id: 'capacitadores',
      etiqueta: 'Si usted capacita',
      titulo: 'Si usted capacita: diga con claridad qué entrega su curso',
      tipo: 'texto',
      parrafos: [
        'Según el Ministerio de Educación Nacional, con base en el Decreto 1075 de 2015, la educación informal comprende cursos de menos de 160 horas. No requiere registro y solo da lugar a una constancia de asistencia. Su publicidad debe indicar que es educación informal y que no conduce a título alguno ni a certificado de aptitud ocupacional.',
        'Por eso, en su web revisamos con usted cómo nombrar lo que entrega. Si su curso da una constancia de asistencia, no lo llamamos «certificado». Si su programa es de otro tipo, usted nos indica cómo describirlo y con qué soporte.',
        'Esta claridad también protege a sus alumnos: la Ley 1480 de 2011 exige que la información sobre un servicio sea clara, veraz y verificable.',
      ],
      enlace: { texto: 'Ver el concepto del Ministerio de Educación', href: URL_MINEDUCACION },
    },
    {
      id: 'sst',
      etiqueta: 'Seguridad y salud en el trabajo',
      titulo: 'Para asesores y empresas de seguridad y salud en el trabajo (SST)',
      introduccion:
        'Las empresas contratan asesoría en SST para cumplir obligaciones con fecha. Su web debe mostrar que usted conoce esas fechas y que su licencia se puede verificar:',
      tipo: 'lista',
      items: [
        {
          titulo: 'Licencia visible',
          texto:
            'Número de su licencia en SST y la entidad que la expidió, para que el cliente la pueda verificar. La licencia está regulada por la Resolución 754 de 2021, modificada por la 1151 de 2022.',
        },
        {
          titulo: 'Contenido de temporada',
          texto:
            'La autoevaluación de estándares mínimos del Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) y su plan de mejoramiento se registran cada año en sgrl.mintrabajo.gov.co. En 2026, la fecha límite fue el 31 de julio (Circular 0027 de 2026 del Ministerio del Trabajo).',
        },
        {
          titulo: 'Qué estándares aplican',
          texto:
            'La Resolución 0312 de 2019 define estándares mínimos según el número de trabajadores. Una sección que lo explique ayuda a cada empresa a entender qué necesita.',
        },
        {
          titulo: 'Preguntas para calificar por WhatsApp',
          texto: 'Número de trabajadores, sector, qué necesita (diseño, auditoría, capacitación) y para cuándo. Con eso usted prepara la propuesta.',
        },
      ],
      nota: 'Las normas y fechas de SST cambian. Las verificamos en fuentes oficiales antes de publicarlas y usted las aprueba.',
      enlace: { texto: 'Ver la nota sobre la Circular 0027 de 2026 (INCP)', href: URL_SST_AUTOEVALUACION },
    },
    {
      id: 'whatsapp',
      etiqueta: 'WhatsApp para consultores',
      titulo: 'WhatsApp para consultores: ordenar solicitudes, no cerrar ventas por su cuenta',
      introduccion:
        'El agente de IA de WhatsApp Business es una función de Meta dentro de la app. Para un consultor, su mejor uso es responder lo básico y reunir los datos de la solicitud. La propuesta y el diagnóstico siguen siendo suyos.',
      tipo: 'comparacion',
      etiquetaIncluye: 'El agente puede hacer',
      etiquetaNoIncluye: 'Siempre pasa a usted',
      incluye: [
        'Explicar sus servicios, programas y modalidades con la información que usted aprobó.',
        'Compartir la agenda de cursos publicada y la duración de cada uno.',
        'Recomendar el programa de su catálogo que corresponde a lo que pide el cliente.',
        'Preguntar sector, tamaño de la empresa, necesidad y fecha.',
        'Pedir nombre y datos de contacto, y pasarle la conversación a usted.',
      ],
      noIncluye: [
        'La propuesta y el precio final.',
        'El diagnóstico de la situación de una empresa.',
        'Información confidencial que el cliente quiera compartir.',
        'Negociaciones, descuentos y condiciones especiales.',
        'Quejas y clientes que piden hablar con una persona.',
      ],
      parrafos: [
        'Meta anunció que el agente puede agendar citas. Esa función depende de lo que Meta habilite en su cuenta: la verificamos en el diagnóstico antes de incluirla. Si no está disponible, el agente toma los datos y usted confirma la reunión.',
        ACLARACION_HORARIO,
      ],
      enlace: { texto: 'Ver cómo configuramos el agente de IA de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    },
    {
      id: 'demostracion',
      etiqueta: 'Ejemplo de atención',
      titulo: 'Estructura recomendada y un ejemplo de atención por WhatsApp',
      introduccion:
        'La web que proponemos sigue la estructura de esta página: especialidad, método, programas, casos y solicitud de propuesta. Así atendería el agente de WhatsApp una solicitud, con una consultoría ficticia:',
      tipo: 'conversacion',
      conversacion: {
        titulo: 'Consultoría (ejemplo)',
        estado: 'Cuenta de empresa',
        mensajes: [
          {
            de: 'cliente',
            separador: 'Martes',
            hora: '7:15\u00a0p.\u00a0m.',
            texto: 'Buenas tardes. Necesito una capacitación en liderazgo para 25 supervisores. ¿La hacen presencial?',
          },
          {
            de: 'asistente',
            hora: '7:15\u00a0p.\u00a0m.',
            texto:
              'Buenas tardes. Sí, el programa de liderazgo para mandos medios se dicta presencial o virtual, en 4 sesiones de 4 horas. ¿En qué ciudad sería y para qué mes lo necesita?',
          },
          {
            de: 'cliente',
            hora: '7:17\u00a0p.\u00a0m.',
            texto: 'En Bogotá, para noviembre. dan certificado?',
          },
          {
            de: 'asistente',
            hora: '7:17\u00a0p.\u00a0m.',
            texto:
              'Al terminar, cada participante recibe una constancia de asistencia. Es un curso de educación informal: no conduce a título ni a certificado de aptitud ocupacional.',
          },
          {
            de: 'cliente',
            hora: '7:18\u00a0p.\u00a0m.',
            texto: 'ok. cuanto vale para 25 personas?',
          },
          {
            de: 'asistente',
            hora: '7:18\u00a0p.\u00a0m.',
            texto:
              'El valor depende del número de participantes, la modalidad y la ciudad. El consultor le envía una propuesta por escrito. ¿Me indica su nombre, su cargo y el nombre de la empresa?',
          },
          {
            de: 'cliente',
            hora: '7:20\u00a0p.\u00a0m.',
            texto: 'Diana Rojas, jefe de talento humano, Logística Andina SAS',
          },
          {
            de: 'asistente',
            hora: '7:20\u00a0p.\u00a0m.',
            texto: 'Gracias, Diana. Le paso su solicitud al consultor, que le escribe mañana en horario de oficina.',
          },
          {
            de: 'persona',
            separador: 'Miércoles',
            hora: '9:00\u00a0a.\u00a0m.',
            texto:
              'Buenos días, Diana. Soy Andrés, consultor del programa. ¿Tiene 20 minutos hoy para entender qué necesitan sus supervisores? Con eso le envío la propuesta.',
          },
          {
            de: 'cliente',
            hora: '9:12\u00a0a.\u00a0m.',
            texto: 'Sí, a las 3:00\u00a0p.\u00a0m. le parece?',
          },
        ],
        nota: 'Ejemplo ilustrativo con una consultoría, una empresa y una clienta ficticias. Las respuestas reales dependen de la información que usted apruebe y de las funciones que Meta habilite en su cuenta.',
      },
    },
    {
      id: 'casos',
      etiqueta: 'Casos y confidencialidad',
      titulo: 'Cómo mostrar casos si sus clientes piden confidencialidad',
      tipo: 'texto',
      parrafos: [
        'Muchos consultores no pueden nombrar a sus clientes. No hace falta: un caso anonimizado también genera confianza si es concreto. Describa el sector, el tamaño de la empresa, el problema, qué hizo y qué cambió.',
        'Si publica una cifra, diga cómo y en qué periodo se midió. Pida autorización por escrito, aunque el caso no lleve nombre, y conserve la evidencia.',
        'Lo que nunca hacemos: inventar casos, testimonios o resultados. La Ley 1480 de 2011 exige que la información sea veraz y verificable, y su reputación depende de ello.',
      ],
    },
    {
      id: 'precio',
      etiqueta: 'Precio',
      titulo: 'Cuánto cuesta la web de un consultor',
      introduccion: `Si quiere que lo encuentren en Google con una página por servicio o programa, el plan ${visible.nombre} cuesta desde ${desde('visible')} al año, o en 12 cuotas de ${cuotaDesde('visible')} al mes, IVA incluido. Si además quiere ordenar las solicitudes por WhatsApp, ${atencion.nombre} empieza en ${desde('atencion')}. Una web más sencilla, ${esencial.nombre}, empieza en ${desde('esencial')}.`,
      tipo: 'planes',
      compacto: true,
      recomendado: 'visible' satisfies IdPlan,
      nota: 'Licencias y suscripciones externas, incluidos los costos de Meta, se identifican por separado. El valor final depende del alcance y queda por escrito antes de empezar.',
      enlace: { texto: 'Ver precios completos y condiciones', href: '/precios/' },
    },
  ],
  preguntas: [
    {
      pregunta: '¿Qué debe tener la página web de un consultor?',
      respuesta:
        'Debe mostrar en qué problema se especializa, para quién trabaja, cómo es su método paso a paso, qué entrega, cuánto tarda y en qué modalidad. También casos reales autorizados, credenciales que se puedan verificar y una forma sencilla de pedir propuesta: un formulario corto o WhatsApp. Lo ideal es una página por cada servicio o programa.',
    },
    {
      pregunta: '¿Debo publicar mis precios de consultoría?',
      respuesta:
        'Es su decisión. Muchos consultores cotizan cada proyecto, pero un valor «desde» o un rango, con lo que lo hace variar, filtra solicitudes y ahorra reuniones. Si prefiere no publicar cifras, explique su modelo de cobro, por proyecto, por hora o por mes, y cuánto tarda en enviar una propuesta.',
    },
    {
      pregunta: '¿Cómo muestro casos si mis clientes piden confidencialidad?',
      respuesta:
        'Con casos anonimizados: sector, tamaño de la empresa, problema, qué hizo y qué cambió, sin nombres. Si incluye una cifra, indique cómo y en qué periodo se midió. Pida autorización por escrito y conserve la evidencia. Nunca publique casos o testimonios inventados: la ley exige información veraz y verificable.',
    },
    {
      pregunta: '¿Puedo decir que mis cursos dan certificado?',
      respuesta:
        'Depende del tipo de curso. Según el Ministerio de Educación, los cursos de educación informal, de menos de 160 horas, solo dan lugar a una constancia de asistencia, y su publicidad debe aclarar que no conducen a título ni a certificado de aptitud ocupacional. En ese caso, en su web escribimos «constancia de asistencia», no «certificado».',
    },
    {
      pregunta: '¿Sirve para asesores y empresas de seguridad y salud en el trabajo?',
      respuesta:
        'Sí. La web puede mostrar su licencia en SST y la entidad que la expidió, explicar los estándares mínimos que aplican según el número de trabajadores y publicar contenido antes de cada fecha de registro de la autoevaluación del SG-SST. Por WhatsApp, el agente puede preguntar tamaño, sector y necesidad antes de pasarle la solicitud.',
    },
    {
      pregunta: '¿El agente de WhatsApp puede agendar reuniones con mis clientes?',
      respuesta:
        'Meta anunció que el agente puede agendar citas, pero esa función depende de lo que Meta habilite en cada cuenta. La verificamos en el diagnóstico antes de incluirla. Si no está disponible, el agente pide los datos del cliente y la fecha que prefiere, y usted confirma la reunión personalmente en su horario.',
    },
    {
      pregunta: '¿Cuánto cuesta una página web para un consultor?',
      respuesta: `Para que lo encuentren en Google con una página por servicio o programa, recomendamos ${visible.nombre}: desde ${desde('visible')} al año, o en 12 cuotas de ${cuotaDesde('visible')} al mes, con seguimiento mensual. Si además quiere ordenar las solicitudes por WhatsApp con el agente de IA, ${atencion.nombre} empieza en ${desde('atencion')}. Una web más sencilla, ${esencial.nombre}, desde ${desde('esencial')}. Los costos de Meta van aparte.`,
    },
    {
      pregunta: '¿Puedo ver un ejemplo antes de contratar?',
      respuesta:
        'Sí. En esta página está la estructura que proponemos y una conversación de ejemplo. En la revisión digital le explicamos cómo se aplicaría a su web y le entregamos tres prioridades concretas.',
    },
  ],
  cta: {
    titulo: 'Muestre su método antes de la primera reunión',
    texto:
      'Solicite una revisión digital gratuita. Revisamos su web, su visibilidad en Google y su atención por WhatsApp, y le entregamos tres prioridades concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Posicionamiento en Google y asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
    { texto: 'Configuración del agente de IA de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Precios, condiciones y formas de pago', href: '/precios/' },
    { texto: 'Páginas web para contadores y firmas contables', href: '/paginas-web-contadores/' },
    { texto: 'Guía: cuánto cuesta una página web en Bogotá', href: '/recursos/cuanto-cuesta-una-pagina-web-en-bogota/' },
  ],
  fuentes: [
    { titulo: 'Concepto sobre educación informal (Ministerio de Educación Nacional)', url: URL_MINEDUCACION },
    { titulo: 'Mintrabajo: fecha límite para el registro de la autoevaluación del SG-SST (INCP)', url: URL_SST_AUTOEVALUACION },
    { titulo: 'Be There for Every Customer With Meta Business Agent (Meta Newsroom)', url: URL_META_ANUNCIO, idioma: 'en' },
    { titulo: 'Meta Business Agent en WhatsApp (página oficial, español)', url: URL_META_PRODUCTO_ES },
    { titulo: 'Estatuto del Consumidor, Ley 1480 de 2011 (Secretaría del Senado)', url: 'https://www.secretariasenado.gov.co/senado/basedoc/ley_1480_2011.html' },
  ],
  /** Datos para servicio() de @/lib/schema. El precio sale de sitio.ts. */
  servicio: {
    nombre: 'Páginas web para consultores, capacitadores y asesores SST',
    tipo: 'Diseño de páginas web para consultores',
    descripcion:
      'Páginas web para consultores y capacitadores: especialidad, método, entregables, casos reales autorizados y solicitudes de propuesta ordenadas por WhatsApp.',
    precioDesde: esencial.precioAnualDesde,
    audiencia: 'Consultores, capacitadores y asesores en seguridad y salud en el trabajo',
  },
  actualizado: '2026-10-11',
} as const satisfies ModuloPagina;
