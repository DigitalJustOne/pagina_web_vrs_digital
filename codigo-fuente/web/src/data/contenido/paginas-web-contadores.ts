// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /paginas-web-contadores/ (sector: firmas contables y tributarias).
//  Palabra clave principal: «páginas web para contadores».
//  Fuentes: informe del Director (2026-10-05: verticales prioritarias, demostraciones
//  estándar, servicio de WhatsApp, protección de datos), src/data/sitio.ts e investigación
//  verificada el 2026-10-06 (DIAN, INCP, Junta Central de Contadores, Meta; al final).
//  Precios, proceso y contacto salen de sitio.ts: no los copie a mano.
//
//  REGLAS DE ESTA PÁGINA:
//  - VRS Digital no es asesor tributario. Las fechas y valores tributarios son ejemplos
//    de contenido, con enlace a la fuente oficial. Son temas financieros: Google los evalúa
//    con más rigor. Verifique en la DIAN cada diciembre (UVT) y cada julio (renta).
//  - El agente de WhatsApp de una firma contable no da asesoría tributaria ni recibe
//    documentos financieros: Meta usa los mensajes de los chats con IA para mejorar su IA.
//  - La conversación de ejemplo es ficticia y va rotulada como ejemplo.
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Confirmar si la demostración estándar de firma contable ya existe (el informe la pide en
//    los días 1 a 30). Mientras no se confirme, la página NO la ofrece: la sección #demostracion
//    presenta la «estructura recomendada» y el cierre promete solo la revisión digital.
//  - Fechas del calendario 2027: actualizar la tabla de temporadas cuando la DIAN las publique.
//  EDICIÓN FINAL (2026-10-06): mientras no se confirme la demostración, la descripción y el
//  botón dicen «estructura» en lugar de «demostración». La pregunta «sin acceso al agente» se
//  cambió por «¿Quién escribe y revisa el contenido tributario?» (la otra ya está en el servicio).
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

const URL_DIAN_CALENDARIO = 'https://www.dian.gov.co/Prensa/Paginas/NG-Comunicado-de-Prensa-128-2025.aspx';
const URL_UVT = 'https://incp.org.co/publicaciones/infoincp-publicaciones/impuestos/2025/12/dian-fijo-en-52-374-en-valor-de-la-uvt-para-el-ano-gravable-2026/';
const URL_JCC =
  'https://www.ambitojuridico.com/sites/default/files/BancoMedios/Archivos/comunicadorecuerdeverificarantecedentesdecontador.pdf';
const URL_AYUDA_WHATSAPP = 'https://faq.whatsapp.com/291930066973116/';

const MENSAJE_WHATSAPP = 'Hola, tengo una firma contable y quiero una revisión digital de mi web.';

/** Temporadas tributarias de 2026 según la DIAN (tabla «temporadas» y visual de la portada). */
const TEMPORADAS = [
  [
    'Régimen Simple: declaración anual',
    'Del 17 al 23 de abril',
    '¿Me conviene? ¿Qué debo presentar?',
    'En marzo',
  ],
  [
    'Renta de personas jurídicas',
    'Declaración y primera cuota del 12 al 26 de mayo; segunda cuota del 9 al 23 de julio',
    '¿Qué necesita la firma de mi empresa? ¿Cuánto cuesta?',
    'En abril',
  ],
  [
    'Renta de personas naturales',
    'Del 12 de agosto al 26 de octubre, según los dos últimos dígitos del NIT',
    '¿Estoy obligado? ¿Cuándo vence? ¿Qué documentos necesito? ¿Cuánto cobran?',
    'En julio',
  ],
  [
    'Retención en la fuente e IVA',
    'Retención: cada mes. IVA: cada dos o cada cuatro meses, según el caso',
    '¿Quién me lleva las declaraciones periódicas?',
    'Todo el año',
  ],
  [
    'Nuevo valor de la UVT',
    'La DIAN lo fija en diciembre (para 2026: $52.374)',
    'Topes y valores del año siguiente',
    'En diciembre',
  ],
] as const;

/** Pregunta de clientes que se usa como ejemplo en la portada (está en la lista «preguntas-clientes»). */
const PREGUNTA_VENCE = '¿Cuándo vence mi declaración?';

/**
 * Visual de la portada (CalendarioTributario.astro): las mismas filas de TEMPORADAS ubicadas por
 * mes (0 = enero). meses: tramos [desde, hasta] de las fechas de la DIAN; preparar: el mes de
 * «Cuándo preparar la web» (null si es todo el año). Si cambia la tabla, cambie también esto.
 */
export const visualContadores = {
  etiqueta:
    'Ilustración: calendario tributario 2026 según la DIAN, con los meses de cada obligación y el mes para preparar la web. Un cliente pregunta por WhatsApp cuándo vence su declaración y recibe las fechas de la DIAN.',
  titulo: 'Temporadas tributarias 2026',
  fuente: 'Fechas: DIAN',
  leyendaFechas: 'Fechas de la DIAN',
  leyendaPreparar: 'Preparar la web',
  filas: [
    { nombre: TEMPORADAS[0][0], meses: [[3, 3]], preparar: 2 },
    { nombre: TEMPORADAS[1][0], meses: [[4, 4], [6, 6]], preparar: 3 },
    { nombre: TEMPORADAS[2][0], meses: [[7, 9]], preparar: 6, destacada: true },
    { nombre: TEMPORADAS[3][0], meses: [[0, 11]], preparar: null, tenue: true },
    { nombre: TEMPORADAS[4][0], meses: [[11, 11]], preparar: 11 },
  ],
  pregunta: PREGUNTA_VENCE,
  respuesta: TEMPORADAS[2][1],
  fuenteRespuesta: 'Fuente: DIAN',
} as const;

export const contenido = {
  ruta: '/paginas-web-contadores/',
  seo: {
    // 46 caracteres + « | VRS Digital» (Seo.astro) = 60.
    titulo: 'Páginas web para contadores y firmas contables',
    descripcion:
      'Páginas web para contadores en Bogotá: servicios claros, contenido para cada temporada tributaria y consultas por WhatsApp ordenadas. Vea la estructura.',
    palabraClave: 'páginas web para contadores',
    secundarias: [
      'página web para firma contable',
      'diseño web para contadores en Bogotá',
      'página web para contador público',
      'WhatsApp para firmas contables',
      'página web para asesoría tributaria',
    ],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Empresas de servicios', ruta: '/paginas-web-empresas-servicios/' },
    { nombre: 'Firmas contables', ruta: '/paginas-web-contadores/' },
  ],
  hero: {
    etiqueta: 'Sector: firmas contables y tributarias',
    titulo: 'Páginas web para contadores y firmas contables en Bogotá',
    subtitulo:
      'Una web que explica sus servicios a personas y a empresas, responde las preguntas de cada temporada tributaria y ordena las consultas que llegan por WhatsApp. La asesoría sigue siendo suya; la web y el agente atienden lo repetitivo.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaSecundario: { texto: 'Ver la estructura recomendada', href: '#demostracion' },
    precio: `Desde ${desde('esencial')}`,
    puntos: [
      'Contenido para cada temporada tributaria',
      'Preguntas repetidas atendidas por WhatsApp',
      'Los casos tributarios siempre pasan a un contador',
    ],
  },
  respuestaDirecta:
    'La web de una firma contable debe responder rápido tres cosas: qué servicios ofrece a personas y a empresas, cuándo vencen las obligaciones de sus clientes y cómo empezar. VRS Digital crea ese sitio, lo prepara para Google y configura el agente de IA de WhatsApp Business para las preguntas repetidas. La asesoría tributaria siempre pasa a un contador.',
  secciones: [
    {
      id: 'servicios',
      etiqueta: 'Servicios',
      titulo: 'Los servicios que la web de su firma debe explicar',
      introduccion:
        'Sus clientes no buscan «servicios contables»: buscan resolver algo concreto. Cada servicio debe tener su página o su sección, con para quién es, qué incluye, qué documentos se necesitan y cómo se cotiza. Estos son los más comunes:',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Declaración de renta de personas naturales',
          texto: 'Para empleados, independientes, contratistas y pensionados. Es el servicio con más consultas en temporada.',
          icono: icono('file'),
        },
        {
          titulo: 'Contabilidad mensual para empresas',
          texto: 'Registro contable, estados financieros y acompañamiento para sociedades y personas con negocio.',
          icono: icono('calculator'),
        },
        {
          titulo: 'Impuestos de empresas',
          texto: 'Renta de personas jurídicas, IVA, retención en la fuente e información exógena (reportes anuales a la DIAN).',
          icono: icono('chart'),
        },
        {
          titulo: 'Facturación y nómina electrónica',
          texto: 'Acompañamiento para cumplir lo que exige la DIAN en facturas y nómina, explicado sin tecnicismos.',
          icono: icono('check'),
        },
        {
          titulo: 'Régimen Simple de Tributación',
          texto: 'Para quien evalúa si le conviene o ya está inscrito y necesita cumplir sus declaraciones.',
          icono: icono('briefcase'),
        },
        {
          titulo: 'Revisoría fiscal y auditoría',
          texto: 'Para empresas obligadas o que la necesitan por decisión propia. Requiere explicar alcance y experiencia.',
          icono: icono('eye'),
        },
      ],
      nota: 'Usted decide qué servicios publicar. No mostramos servicios que su firma no presta.',
    },
    {
      id: 'preguntas-clientes',
      etiqueta: 'Lo que buscan sus clientes',
      titulo: 'Las preguntas que la web de un contador debe responder',
      introduccion:
        'Sus clientes llegan con las mismas dudas cada año. Si su web las responde con claridad, usted recibe consultas mejor preparadas, y Google y los asistentes de inteligencia artificial (IA) entienden qué hace su firma. Estas son las más comunes:',
      tipo: 'lista',
      items: [
        '¿Estoy obligado a declarar renta este año?',
        PREGUNTA_VENCE,
        '¿Qué documentos necesito para la declaración?',
        '¿Cuánto cobran por la declaración de renta?',
        '¿Cómo verifico que el contador esté inscrito?',
        '¿Qué datos me pueden pedir para la factura electrónica?',
        '¿Me conviene el Régimen Simple de Tributación?',
        '¿Llevan la contabilidad mensual de mi empresa y qué incluye?',
      ],
      ejemplo: {
        titulo: 'Ejemplo de respuesta clara y verificable',
        pregunta: '¿Cuándo vence la declaración de renta de personas naturales en 2026?',
        respuesta:
          'Según la DIAN, en 2026 las personas naturales declaran renta entre el 12 de agosto y el 26 de octubre. La fecha exacta depende de los dos últimos dígitos del NIT. Consulte el calendario oficial o escríbanos para revisar su caso.',
        fuente: { texto: 'Comunicado de prensa 128 de 2025, DIAN', href: URL_DIAN_CALENDARIO },
      },
      nota: 'La web orienta y enlaza fuentes oficiales. Si una persona debe declarar o cuánto pagará depende de su caso: eso lo responde un contador de su firma.',
    },
    {
      id: 'temporadas',
      etiqueta: 'Temporadas tributarias',
      titulo: 'Temporadas tributarias: cuándo preparar cada contenido',
      introduccion:
        'El calendario cambia cada año, pero sigue un patrón. Estas son las fechas de 2026 según la DIAN. Publicar el contenido antes de cada temporada le da tiempo a Google para encontrarlo y a sus clientes para escribirle con calma.',
      tipo: 'tabla',
      columnas: ['Obligación', 'Fechas en 2026 (DIAN)', 'Qué preguntan sus clientes', 'Cuándo preparar la web'],
      filas: TEMPORADAS,
      nota: 'Fuentes: comunicado de prensa 128 de 2025 de la DIAN y Resolución DIAN 000238 de 2025 (UVT). La UVT es la unidad de valor tributario que la DIAN usa para fijar topes. Las fechas se verifican cada año antes de publicarlas.',
      enlace: { texto: 'Ver el comunicado de la DIAN', href: URL_DIAN_CALENDARIO },
    },
    {
      id: 'whatsapp',
      etiqueta: 'WhatsApp en temporada',
      titulo: 'WhatsApp en temporada: el agente atiende lo repetitivo, el contador asesora',
      introduccion:
        'En temporada de renta, muchas preguntas se repiten: qué servicios ofrece, qué documentos pide, en qué horario atiende. El agente de IA de WhatsApp Business, una función de Meta dentro de la app, puede responderlas con la información que su firma apruebe. Lo que exige criterio profesional pasa siempre a una persona.',
      tipo: 'comparacion',
      etiquetaIncluye: 'El agente puede responder',
      etiquetaNoIncluye: 'Siempre pasa a un contador',
      incluye: [
        'Qué servicios presta la firma, a quién y en qué modalidad.',
        'Las fechas generales del calendario de la DIAN que su firma cargó, con el enlace oficial.',
        'Qué documentos suele pedir la firma para empezar.',
        'Horarios, ubicación y formas de pago.',
        'Honorarios «desde», si su firma decide publicarlos.',
        'El nombre del cliente y si es persona o empresa, para pasar la consulta.',
      ],
      noIncluye: [
        'Si una persona está obligada a declarar o cuánto pagará.',
        'Cualquier asesoría tributaria, contable o laboral sobre un caso concreto.',
        'Requerimientos, sanciones o procesos con la DIAN.',
        'Recibir extractos, certificados, estados financieros u otros documentos.',
        'Cotizaciones finales y negociación de honorarios.',
        'Quejas y clientes que piden hablar con una persona.',
      ],
      parrafos: [
        'Definimos estos límites con usted antes de activar el agente. Lo probamos con 25 a 40 preguntas, incluidas preguntas tributarias que debe pasarle a usted. Además, usted puede responder personalmente en cualquier chat: cuando lo hace, el agente deja de responder en esa conversación.',
        ACLARACION_HORARIO,
      ],
      aclaraciones: [
        {
          titulo: 'Documentos y datos financieros',
          texto:
            'Meta informa que usa los mensajes de los chats donde el agente está activo para mejorar su inteligencia artificial. Por eso, en una firma contable, el agente no debe recibir documentos ni datos financieros: el contador le indica al cliente un canal adecuado.',
        },
        {
          titulo: 'Depende de su cuenta',
          texto:
            'Meta habilita el agente de forma gradual, por país y por cuenta. Lo verificamos en el diagnóstico. Si su cuenta aún no tiene acceso, configuramos las funciones clásicas de la app: bienvenida, ausencia, respuestas rápidas, etiquetas y catálogo.',
        },
        {
          titulo: 'Puede equivocarse',
          texto:
            'WhatsApp advierte que los mensajes generados por IA pueden no ser precisos ni apropiados. Por eso el agente solo usa información aprobada y los temas tributarios pasan a una persona.',
        },
      ],
      enlace: { texto: 'Ver cómo configuramos el agente de IA de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    },
    {
      id: 'demostracion',
      etiqueta: 'Estructura recomendada',
      titulo: 'Estructura recomendada para la web de una firma contable',
      introduccion:
        'Esta es la estructura que proponemos para una firma contable. En la revisión digital le explicamos cómo se aplicaría a la suya.',
      tipo: 'lista',
      items: [
        {
          titulo: 'Inicio',
          texto: 'Qué hace la firma, para quién y cómo empezar, en una respuesta corta arriba de todo.',
        },
        {
          titulo: 'Personas naturales',
          texto: 'Declaración de renta: quién debe declarar, documentos, fechas con enlace a la DIAN y cómo se cotiza.',
        },
        {
          titulo: 'Empresas',
          texto: 'Contabilidad mensual, impuestos, facturación y nómina electrónica, cada uno con su propia sección.',
        },
        {
          titulo: 'Revisoría fiscal',
          texto: 'Alcance del servicio, a qué empresas aplica y experiencia del equipo.',
        },
        {
          titulo: 'Honorarios y forma de trabajo',
          texto: 'Valores «desde», qué los hace variar y los pasos para empezar.',
        },
        {
          titulo: 'Equipo',
          texto: 'Nombre y número de tarjeta profesional de cada contador, con el enlace para verificar su inscripción.',
        },
        {
          titulo: 'Calendario y guías',
          texto: 'Contenido de temporada con autor y fecha de actualización, enlazado a fuentes oficiales.',
        },
        {
          titulo: 'Contacto',
          texto: 'WhatsApp visible y un formulario corto que pide solo los datos necesarios, con autorización de tratamiento.',
        },
      ],
    },
    {
      id: 'conversacion',
      etiqueta: 'Conversación de ejemplo',
      titulo: 'Así atiende el agente una consulta de una empresa',
      introduccion:
        'La dueña de una empresa pequeña escribe un jueves en la noche. El agente responde con la información aprobada, no opina sobre un requerimiento de la DIAN y deja el caso listo para que un contador lo retome al día siguiente.',
      tipo: 'conversacion',
      conversacion: {
        titulo: 'Firma contable (ejemplo)',
        estado: 'Cuenta de empresa',
        mensajes: [
          {
            de: 'cliente',
            separador: 'Jueves',
            hora: '9:05\u00a0p.\u00a0m.',
            texto: 'Hola, tengo una SAS pequeña con 3 empleados. ¿Ustedes llevan la contabilidad mensual?',
          },
          {
            de: 'asistente',
            hora: '9:05\u00a0p.\u00a0m.',
            texto:
              'Hola. Sí, la firma lleva contabilidad mensual para empresas: registro contable, declaraciones de IVA y retención en la fuente, y nómina electrónica. ¿Su empresa ya emite factura electrónica?',
          },
          {
            de: 'cliente',
            hora: '9:07\u00a0p.\u00a0m.',
            texto: 'si ya facturamos. cuanto cobran al mes?',
          },
          {
            de: 'asistente',
            hora: '9:07\u00a0p.\u00a0m.',
            texto:
              'El valor mensual depende del número de facturas y de empleados. Un contador se lo confirma por escrito después de una reunión corta. ¿Quiere que lo contacten?',
          },
          {
            de: 'cliente',
            hora: '9:08\u00a0p.\u00a0m.',
            texto: 'si. otra cosa, me llego un requerimiento de la DIAN, que hago?',
          },
          {
            de: 'asistente',
            hora: '9:08\u00a0p.\u00a0m.',
            texto:
              'Un requerimiento de la DIAN debe revisarlo un contador, porque depende de su caso. Por seguridad, no envíe el documento por este chat. ¿Me indica su nombre y el de su empresa para pasarle la consulta?',
          },
          {
            de: 'cliente',
            hora: '9:09\u00a0p.\u00a0m.',
            texto: 'Laura Méndez, Estudio LM SAS',
          },
          {
            de: 'asistente',
            hora: '9:09\u00a0p.\u00a0m.',
            texto: 'Gracias, Laura. Le paso su consulta a un contador de la firma, que le escribe mañana en horario de oficina.',
          },
          {
            de: 'persona',
            separador: 'Viernes',
            hora: '8:20\u00a0a.\u00a0m.',
            texto:
              'Buenos días, Laura. Soy Julián, contador de la firma. Vi su consulta. ¿Hablamos hoy a las 11:00\u00a0a.\u00a0m.? Le indico cómo compartir el requerimiento de forma segura.',
          },
          {
            de: 'cliente',
            hora: '8:24\u00a0a.\u00a0m.',
            texto: 'Perfecto, a las 11. Gracias.',
          },
        ],
        nota: 'Ejemplo ilustrativo con una firma contable y una clienta ficticias. Las respuestas reales dependen de la información que su firma apruebe y de las funciones que Meta habilite en su cuenta.',
      },
    },
    {
      id: 'confianza',
      etiqueta: 'Confianza',
      titulo: 'Lo que un cliente revisa antes de escribirle a un contador',
      introduccion:
        'Las decisiones sobre impuestos y dinero se toman con cuidado. Su web debe dar señales que el cliente pueda comprobar:',
      tipo: 'tarjetas',
      columnas: 2,
      items: [
        {
          titulo: 'Inscripción verificable',
          texto:
            'Publique el número de tarjeta profesional de cada contador. La Junta Central de Contadores permite verificar la inscripción y expide certificados de antecedentes.',
          icono: icono('shield'),
        },
        {
          titulo: 'Autor y fecha en cada guía',
          texto:
            'Los temas financieros exigen más confianza. Cada contenido lleva quién lo escribió, cuándo se actualizó y enlaces a la DIAN.',
          icono: icono('file'),
        },
        {
          titulo: 'Honorarios y proceso claros',
          texto: 'Un valor «desde», qué lo hace variar y los pasos para empezar. Así llegan consultas de personas que ya saben qué esperar.',
          icono: icono('calculator'),
        },
        {
          titulo: 'Casos y reseñas reales',
          texto: 'Solo con autorización del cliente. Nunca publicamos testimonios, reseñas ni cifras inventadas.',
          icono: icono('users'),
        },
        {
          titulo: 'Datos personales bien tratados',
          texto:
            'Política de tratamiento de datos publicada (Ley 1581 de 2012) y formularios que piden solo lo necesario.',
          icono: icono('lock'),
        },
        {
          titulo: 'Respuesta oportuna',
          texto: 'WhatsApp visible, mensaje de ausencia fuera de horario y un tiempo de respuesta que su firma pueda cumplir.',
          icono: icono('clock'),
        },
      ],
    },
    {
      id: 'precio',
      etiqueta: 'Precio',
      titulo: 'Cuánto cuesta la web de una firma contable',
      introduccion: `Si su firma recibe muchas preguntas repetidas en temporada, el plan ${atencion.nombre} cuesta desde ${desde('atencion')} al año, o en 12 cuotas de ${cuotaDesde('atencion')} al mes, IVA incluido. Si su prioridad es aparecer en Google con una página por servicio, el plan ${visible.nombre} empieza en ${desde('visible')}. La web sola, ${esencial.nombre}, empieza en ${desde('esencial')}.`,
      tipo: 'planes',
      compacto: true,
      recomendado: 'atencion' satisfies IdPlan,
      nota: 'Licencias y suscripciones externas, incluidos los costos de Meta, se identifican por separado. El valor final depende del alcance y queda por escrito antes de empezar.',
      enlace: { texto: 'Ver precios completos y condiciones', href: '/precios/' },
    },
    {
      id: 'que-no-hacemos',
      etiqueta: 'Límites',
      titulo: 'Lo que no hacemos',
      tipo: 'lista',
      variante: 'excluye',
      items: [
        'Dar asesoría tributaria o contable: el contenido técnico lo valida su firma.',
        'Conectar la web o WhatsApp con su programa contable o de facturación electrónica.',
        'Configurar el agente para recibir documentos financieros de sus clientes.',
        'Publicar testimonios, reseñas o cifras que no existan.',
        'Prometer el primer lugar en Google o que un asistente de IA recomiende su firma.',
      ],
    },
  ],
  preguntas: [
    {
      pregunta: '¿Qué debe tener la página web de un contador o una firma contable?',
      respuesta:
        'Debe explicar sus servicios para personas y para empresas, cada uno con su página o sección; mostrar cómo se cotiza y qué documentos se necesitan; publicar el equipo con número de tarjeta profesional; tener contenido para cada temporada tributaria con enlaces a la DIAN, y facilitar el contacto por WhatsApp y por un formulario corto, con política de tratamiento de datos.',
    },
    {
      pregunta: '¿Pueden tener la web lista antes de la temporada de renta?',
      respuesta:
        'Depende del alcance y de nuestra disponibilidad: trabajamos con máximo dos proyectos a la vez y asignamos la fecha de inicio según cupo. Para la renta de personas naturales, que en 2026 va del 12 de agosto al 26 de octubre, conviene empezar con varios meses de anticipación para publicar en julio. La fecha estimada de entrega queda por escrito en la propuesta.',
    },
    {
      pregunta: '¿El agente de WhatsApp puede responder preguntas tributarias?',
      respuesta:
        'Solo información general que su firma apruebe, como servicios, documentos que suele pedir, horarios o fechas del calendario de la DIAN con su enlace. No da asesoría: si alguien pregunta si debe declarar, cuánto pagará o qué hacer con un requerimiento, el agente le pasa la conversación a un contador. Probamos esos límites antes de activarlo.',
    },
    {
      pregunta: '¿Es seguro que mis clientes envíen documentos por WhatsApp si el agente está activo?',
      respuesta:
        'No lo recomendamos. Meta informa que usa los mensajes de los chats donde el agente está activo para mejorar su inteligencia artificial, incluso si usted lo silencia. Por eso configuramos el agente para pedir que no se envíen extractos, certificados ni estados financieros por ese chat. El contador le indica al cliente un canal adecuado.',
    },
    {
      pregunta: '¿Debo publicar mis honorarios en la web?',
      respuesta:
        'Es su decisión. Un valor «desde» y la explicación de qué lo hace variar, como el tipo de cliente, los ingresos o el número de soportes, ayudan a que le escriban personas que ya saben qué esperar. Si prefiere no publicar cifras, la web puede explicar cómo se cotiza y cuánto tarda en recibir una propuesta.',
    },
    {
      pregunta: '¿Cuánto cuesta una página web para una firma contable?',
      respuesta: `Para una firma con muchas preguntas repetidas en temporada, recomendamos ${atencion.nombre}: desde ${desde('atencion')} al año, o en 12 cuotas de ${cuotaDesde('atencion')} al mes, con la configuración del agente de IA de WhatsApp Business. Si su prioridad es aparecer en Google con una página por servicio, ${visible.nombre} empieza en ${desde('visible')}. La web sola, ${esencial.nombre}, desde ${desde('esencial')}. Los costos de Meta van aparte.`,
    },
    {
      pregunta: '¿La web o el agente se conectan con mi programa contable o de facturación?',
      respuesta:
        'No. Las integraciones con programas contables, de facturación electrónica, inventario u otros sistemas están fuera de nuestro alcance. La web y el agente de WhatsApp Business trabajan con la información que su firma aprueba: servicios, horarios, documentos que suele pedir y honorarios «desde». Así el servicio es más simple, más rápido de entregar y más fácil de mantener.',
    },
    {
      pregunta: '¿Quién escribe y revisa el contenido tributario de la web?',
      respuesta:
        'Preparamos los borradores con la información de su firma y con fuentes oficiales, como la DIAN. Pero VRS Digital no es asesor tributario: un contador de su firma revisa y aprueba cada dato técnico antes de publicarlo. Cada guía lleva autor, fecha de actualización y enlace a la fuente, y las fechas y la UVT se verifican de nuevo cada año.',
    },
  ],
  cta: {
    titulo: 'Prepare la web de su firma antes de la próxima temporada',
    texto:
      'Solicite una revisión digital gratuita. Revisamos su web, su visibilidad en Google y su atención por WhatsApp, y le entregamos tres prioridades concretas.',
    ctaPrincipal: CTA_PRINCIPAL,
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Configuración del agente de IA de WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Precios, condiciones y formas de pago', href: '/precios/' },
    { texto: 'Guía: qué puede hacer el agente de IA de WhatsApp Business', href: '/recursos/agente-ia-whatsapp-business/' },
    { texto: 'Posicionamiento en Google y asistentes de IA', href: '/posicionamiento-google-inteligencia-artificial/' },
    { texto: 'Páginas web para consultores y capacitadores', href: '/paginas-web-consultores/' },
  ],
  fuentes: [
    { titulo: 'Comunicado de prensa No. 128 de 2025: calendario tributario 2026 (DIAN)', url: URL_DIAN_CALENDARIO },
    { titulo: 'DIAN fijó en $52.374 el valor de la UVT para 2026 (INCP)', url: URL_UVT },
    { titulo: 'Recuerde verificar antecedentes del contador (Junta Central de Contadores, vía Ámbito Jurídico)', url: URL_JCC },
    { titulo: 'About using business AI to chat with customers (Centro de ayuda de WhatsApp)', url: URL_AYUDA_WHATSAPP, idioma: 'en' },
    {
      titulo: 'Creating helpful, reliable, people-first content (Google Search Central)',
      url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      idioma: 'en',
    },
  ],
  /** Datos para servicio() de @/lib/schema. El precio sale de sitio.ts. */
  servicio: {
    nombre: 'Páginas web para contadores y firmas contables',
    tipo: 'Diseño de páginas web para firmas contables',
    descripcion:
      'Páginas web para firmas contables: servicios para personas y empresas, contenido de temporada tributaria con fuentes oficiales y consultas por WhatsApp ordenadas, sin asesoría tributaria automatizada.',
    precioDesde: esencial.precioAnualDesde,
    audiencia: 'Firmas contables y contadores públicos',
  },
  actualizado: '2026-10-11',
} as const satisfies ModuloPagina;
