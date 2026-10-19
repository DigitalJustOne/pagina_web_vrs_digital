// ─────────────────────────────────────────────────────────────────────────────
//  AVISO: BORRADOR — LA DIRECCIÓN DEBE VALIDARLO CON UN ABOGADO ANTES DE PUBLICARLO.
//  No es asesoría jurídica.
//
//  Contenido de /terminos/ (términos y condiciones del sitio y de los servicios).
//  Fuentes: informe del Director (2026-10-05: alcance, exclusiones, capacidad, forma de cobro,
//  «Confidencialidad del método» y su texto contractual recomendado sobre Meta),
//  contexto/reglas-legales-y-seguridad.md (cláusulas 1 y 3) y src/data/sitio.ts.
//  Precios, pagos, condiciones y contacto salen de sitio.ts: no los copie a mano.
//
//  ADAPTACIÓN DE LA CLÁUSULA DE IA (reglas-legales, cláusula 3): se conservó su sentido
//  (inferencia probabilística, posibles respuestas inexactas, supervisión humana obligatoria
//  en decisiones médicas, legales, contables, financieras o de alto riesgo, y exclusión de
//  responsabilidad por omitir esa supervisión). Se quitaron «RAG, guardrails, esquemas
//  estructurados» porque el agente de WhatsApp es de Meta y VRS no aplica esas técnicas en
//  él: afirmarlo sería información inexacta (Ley 1480). El abogado debe validar la redacción.
//
//  PENDIENTE DE LA DIRECCIÓN (y del abogado):
//  - Forma jurídica e identificación de VRS Digital (cédula o NIT) y dirección de notificaciones.
//  - A nombre de quién se registra el dominio y qué derechos recibe el cliente sobre diseño,
//    textos y código al terminar de pagar. Hoy el texto remite a la propuesta.
//  - Si la mensualidad tiene permanencia mínima, cómo se cancela y qué pasa con la web al cancelar.
//  - Si se pausa el trabajo por mora en un pago (hoy el texto lo permite) y si hay intereses.
//  - Tope de responsabilidad (hoy no hay cifra) y aplicación del derecho de retracto.
//  - Fecha de entrada en vigencia.
//  EDICIÓN FINAL (2026-10-06): preguntas propias del documento (qué prevalece, propiedad,
//  retraso en pagos) en lugar de las de alcance, cambios y pagos, que ya estaban en otras páginas.
// ─────────────────────────────────────────────────────────────────────────────
import { CONDICIONES, CONTACTO, FORMA_DE_PAGO, FUNDADOR, MEDIOS_PAGO, SITIO } from '@/data/sitio';
import type { ModuloPagina } from './tipos';

/** Pasa a minúscula la primera letra, salvo en siglas (PSE, SST). */
const minuscula = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

const PENDIENTE = '[pendiente de confirmar por la Dirección]';
const FORMA_PAGO_TEXTO = FORMA_DE_PAGO.map((f) => `${f.porcentaje}\u00a0% ${f.momento}`).join(', ').replace(/, ([^,]*)$/, ' y $1');
const MEDIOS_PAGO_TEXTO = MEDIOS_PAGO.map(minuscula).join(', ').replace(/, ([^,]*)$/, ' o $1');

/** Texto contractual recomendado por el informe del Director. No modificar sin aprobación.
 *  Se mantiene la mención de Meta solo aquí y en límites de responsabilidad: protege a VRS si
 *  WhatsApp cambia la función. El resto del sitio no explica cómo se presta el servicio (2026-10-18). */
const CLAUSULA_META =
  'El servicio utiliza funciones inteligentes disponibles en la cuenta de WhatsApp Business del cliente. Su activación, continuidad, características y costos futuros dependen de las condiciones de Meta. El alcance contratado no incluye chatbot desarrollado a medida, API, CRM ni integraciones con sistemas externos.';

/** Adaptación de la cláusula 3 de reglas-legales-y-seguridad.md (ver nota al inicio). */
const CLAUSULA_IA = `La inteligencia artificial generativa es una tecnología basada en inferencia probabilística. Aunque ${SITIO.nombre} prueba la configuración, limita la información que usa el agente y define criterios para pasar la conversación a una persona, existe la posibilidad de que el sistema genere respuestas inexactas o imprevistas. Por tanto, el CLIENTE reconoce y acepta que toda decisión médica, legal, contable, financiera o de alto riesgo operacional que dependa de los resultados del sistema debe contar con la revisión y supervisión de una persona calificada. ${SITIO.nombre} no se hace responsable por perjuicios derivados de la omisión de dicha supervisión por parte del CLIENTE.`;

export const contenido = {
  ruta: '/terminos/',
  borrador: true,
  avisoBorrador:
    'Borrador en revisión jurídica. Este texto debe ser validado por un abogado antes de su versión definitiva.',
  seo: {
    // 44 caracteres + « | VRS Digital» (Seo.astro) = 58.
    titulo: 'Términos y condiciones de nuestros servicios',
    descripcion:
      'Condiciones de VRS Digital: qué incluye cada servicio, forma de pago, dos rondas de cambios, dependencia de terceros y límites de la inteligencia artificial.',
    palabraClave: 'términos y condiciones VRS Digital',
    secundarias: ['condiciones del servicio de páginas web', 'alcance del servicio de WhatsApp Business', 'forma de pago'],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Términos y condiciones', ruta: '/terminos/' },
  ],
  hero: {
    etiqueta: 'Documento legal',
    titulo: 'Términos y condiciones',
    subtitulo:
      'Las reglas de nuestros servicios en lenguaje claro: qué incluye y qué no, cómo se paga, cuántos cambios incluye, qué depende de terceros, y cuáles son los límites de la inteligencia artificial.',
  },
  respuestaDirecta: `${SITIO.nombre} diseña páginas web, las prepara para Google y asistentes de IA, ofrece atención inteligente en WhatsApp Business y mantenimiento mensual. El alcance y el valor final quedan en una propuesta escrita. Incluye dos rondas de cambios. No incluye CRM, API, chatbots a medida ni integraciones, y no garantiza posiciones en Google.`,
  vigencia: {
    desde: PENDIENTE,
    version: '0.1 (borrador)',
  },
  secciones: [
    {
      id: 'quienes-somos',
      etiqueta: 'Partes',
      titulo: '1. Quién presta el servicio y a qué aplican estos términos',
      tipo: 'texto',
      parrafos: [
        `Los servicios los presta ${SITIO.nombre}, dirigida por ${FUNDADOR.nombre}, con domicilio en Bogotá D. C., Colombia. Identificación: ${PENDIENTE}. Correo: ${CONTACTO.correo}. WhatsApp: ${CONTACTO.whatsappVisible}.`,
        'Estos términos aplican al uso de este sitio y a los servicios que usted contrate. Cada proyecto tiene además una propuesta escrita con su alcance, valor y fechas. Si la propuesta aceptada dice algo distinto de estos términos, prevalece la propuesta.',
      ],
    },
    {
      id: 'servicios',
      etiqueta: 'Servicios',
      titulo: '2. Qué servicios ofrecemos',
      tipo: 'lista',
      items: [
        { titulo: 'Páginas web', texto: 'Diseño, desarrollo y publicación de páginas web para empresas, según el plan y el alcance de la propuesta.' },
        {
          titulo: 'Posicionamiento en Google y asistentes de IA',
          texto: 'Estructura, contenido, datos estructurados y seguimiento para que Google y los asistentes de IA puedan entender la web del cliente.',
        },
        {
          titulo: 'Atención inteligente en WhatsApp Business',
          texto:
            'Preparación de la información, pruebas y ajustes de la atención inteligente en la cuenta de WhatsApp Business del cliente.',
        },
        {
          titulo: 'Mantenimiento mensual',
          texto: 'Actualización de información y mejoras, con el número de cambios o solicitudes que indique el plan.',
        },
      ],
    },
    {
      id: 'no-incluye',
      etiqueta: 'Exclusiones',
      titulo: '3. Qué no incluyen nuestros servicios',
      tipo: 'lista',
      variante: 'excluye',
      items: [
        'Desarrollo de chatbots propios o a medida.',
        'Programación de API (conexión técnica entre sistemas).',
        'CRM (programa para gestionar clientes y ventas).',
        'Integraciones con facturación, inventario, ERP u otro software externo.',
        'Envíos masivos de mensajes y automatización en varios canales.',
        'Garantía de respuestas perfectas del agente de IA.',
        'Garantía de que WhatsApp mantenga disponible la función.',
        'Recuperación de cuentas suspendidas y soporte técnico de WhatsApp.',
        'Garantía de posiciones en Google o de menciones en asistentes de IA.',
        'Soporte ilimitado.',
      ],
    },
    {
      id: 'precios',
      etiqueta: 'Precios',
      titulo: '4. Precios',
      tipo: 'texto',
      parrafos: [
        'Los precios publicados en este sitio son valores iniciales («desde») e incluyen IVA. El valor final depende del número de páginas, los textos, la migración, el catálogo y la cantidad de información, y queda por escrito en la propuesta, con IVA incluido, antes de cualquier pago.',
        ...CONDICIONES.filter((c) => /dominio|licencia/i.test(c)),
        'Los planes de pago de WhatsApp Business para más respuestas automáticas, cuando apliquen, los paga el cliente directamente y no están incluidos en nuestros precios.',
      ],
    },
    {
      id: 'pagos',
      etiqueta: 'Pagos',
      titulo: '5. Forma de pago',
      tipo: 'texto',
      parrafos: [
        `La implementación se paga en tres partes: ${FORMA_PAGO_TEXTO}. Medios de pago: ${MEDIOS_PAGO_TEXTO}.`,
        ...CONDICIONES.filter((c) => c.includes('dos proyectos')),
        'Si un pago se retrasa, VRS Digital puede pausar el trabajo hasta recibirlo, y las fechas acordadas se ajustan en la misma proporción.',
      ],
    },
    {
      id: 'proceso-cambios',
      etiqueta: 'Cambios',
      titulo: '6. Proceso, aprobaciones y cambios',
      tipo: 'lista',
      items: [
        'El cliente entrega la información del proyecto en un formulario único y revisa la estructura y los textos en un documento central.',
        'Cada proyecto incluye dos rondas de cambios. Las solicitudes adicionales se cotizan aparte.',
        'El diseño o la versión funcional se aprueba por escrito, y la publicación requiere aprobación escrita del cliente.',
        'La fecha estimada de entrega queda en la propuesta y depende de que el cliente entregue la información y las aprobaciones a tiempo.',
      ],
    },
    {
      id: 'obligaciones-cliente',
      etiqueta: 'Compromisos del cliente',
      titulo: '7. Compromisos del cliente',
      tipo: 'lista',
      items: [
        'Entregar información veraz, completa y actualizada, incluidos precios, horarios y políticas que se publiquen o se carguen en el agente.',
        'Tener los derechos sobre los textos, logos, fotos y documentos que entregue.',
        'Revisar que el contenido cumpla las reglas de su profesión o sector antes de aprobarlo.',
        'Cumplir sus propias obligaciones de protección de datos frente a sus clientes, incluida su política de tratamiento de datos.',
        'Mantener activa su cuenta de WhatsApp Business, cumplir sus condiciones de uso y supervisar las conversaciones que el agente le transfiera.',
      ],
    },
    {
      id: 'whatsapp',
      etiqueta: 'WhatsApp Business',
      titulo: '8. Servicio de WhatsApp Business y dependencia de terceros',
      tipo: 'texto',
      destacado: { titulo: 'Cláusula sobre WhatsApp Business', texto: CLAUSULA_META },
      parrafos: [
        'Antes de cobrar este componente, revisamos si la cuenta del cliente es compatible. Si no lo es, entregamos la web y el posicionamiento, descontamos o posponemos ese valor, dejamos listas las respuestas básicas (perfil, catálogo, mensajes de bienvenida y de ausencia, respuestas rápidas y etiquetas) y activamos la atención inteligente cuando la cuenta la tenga.',
        `El agente puede responder a cualquier hora. Esa disponibilidad es del agente y del sitio, no de nuestro soporte humano, que funciona de ${minuscula(CONTACTO.horario)}. ${CONTACTO.respuestaHumana}`,
      ],
    },
    {
      id: 'inteligencia-artificial',
      etiqueta: 'Inteligencia artificial',
      titulo: '9. Limitación de responsabilidad sobre la inteligencia artificial',
      tipo: 'texto',
      destacado: { titulo: 'Cláusula sobre inteligencia artificial', texto: CLAUSULA_IA },
      parrafos: [],
    },
    {
      id: 'posicionamiento',
      etiqueta: 'Google y asistentes de IA',
      titulo: '10. Posicionamiento en Google y asistentes de IA',
      tipo: 'texto',
      parrafos: [
        'Los resultados de Google y de los asistentes de inteligencia artificial los deciden sus propios sistemas, que cambian con frecuencia. Por eso no garantizamos posiciones, menciones, plazos ni un número de visitas o clientes. Nos comprometemos a ejecutar el trabajo descrito en la propuesta y, si el plan lo incluye, a revisar los datos cada mes.',
      ],
    },
    {
      id: 'propiedad',
      etiqueta: 'Propiedad',
      titulo: '11. Propiedad intelectual y uso del trabajo',
      tipo: 'lista',
      items: [
        'Los textos, logos, fotos y documentos que entrega el cliente siguen siendo del cliente.',
        'La propuesta indica a nombre de quién se registra el dominio y qué derechos recibe el cliente sobre el diseño, los textos y el código una vez pagado el valor total.',
        `${SITIO.nombre} conserva sus métodos de trabajo, plantillas internas y componentes reutilizables.`,
        `${SITIO.nombre} solo muestra un proyecto en su portafolio o como caso con autorización del cliente.`,
      ],
    },
    {
      id: 'confidencialidad',
      etiqueta: 'Confidencialidad',
      titulo: '12. Confidencialidad',
      tipo: 'lista',
      items: [
        `${SITIO.nombre} no divulga, copia ni usa para beneficio propio o de terceros la información sensible que el cliente le entregue.`,
        'Solo pedimos los accesos a cuentas estrictamente necesarios para el proyecto.',
        'Las claves y credenciales nunca se envían por canales de texto sin cifrar: usamos gestores de contraseñas cifrados.',
      ],
    },
    {
      id: 'datos-personales',
      etiqueta: 'Datos personales',
      titulo: '13. Datos personales',
      tipo: 'texto',
      parrafos: [
        `El cliente es responsable de los datos personales de sus propios clientes. Cuando ${SITIO.nombre} trate esos datos para prestar el servicio, lo hará por cuenta del cliente, según sus instrucciones y solo para esa finalidad.`,
        'WhatsApp informa que puede usar los mensajes de los chats donde la inteligencia artificial está activa para mejorar sus servicios. Por eso recomendamos no usar el agente en conversaciones con información de salud, financiera o jurídica sensible.',
        'El tratamiento de los datos de quienes nos contactan se rige por nuestra política de privacidad.',
      ],
      enlace: { texto: 'Ver la política de privacidad', href: '/politica-de-privacidad/' },
    },
    {
      id: 'responsabilidad',
      etiqueta: 'Responsabilidad',
      titulo: '14. Límites de responsabilidad',
      introduccion: `En la medida en que la ley lo permita, ${SITIO.nombre} no responde por:`,
      tipo: 'lista',
      items: [
        'Cambios, fallas, cobros o decisiones de terceros, como Meta, Google, los proveedores de alojamiento o los registradores de dominios.',
        'La exactitud de la información que entrega el cliente.',
        'Las decisiones que el cliente o sus usuarios tomen con base en respuestas automáticas sin la supervisión descrita en la cláusula 9.',
      ],
      parrafos: [
        'Si usted contrata como consumidor, conserva los derechos que le reconoce el Estatuto del Consumidor (Ley 1480 de 2011), incluido el derecho de retracto en los casos que la ley señala.',
      ],
    },
    {
      id: 'sitio',
      etiqueta: 'Uso del sitio',
      titulo: '15. Uso de este sitio',
      tipo: 'texto',
      parrafos: [
        'La información de este sitio, incluidas las guías, es informativa y no reemplaza la asesoría legal, contable o tributaria. Los enlaces a sitios de terceros se ofrecen como referencia; no controlamos su contenido.',
        `Los textos, el diseño y los elementos de este sitio pertenecen a ${SITIO.nombre} o se usan con autorización.`,
      ],
    },
    {
      id: 'ley-aplicable',
      etiqueta: 'Ley aplicable',
      titulo: '16. Ley aplicable, controversias y cambios',
      tipo: 'texto',
      parrafos: [
        'Estos términos se rigen por las leyes de la República de Colombia. Ante cualquier diferencia, las partes buscarán primero un arreglo directo; si no lo logran, acudirán a los jueces competentes de Colombia.',
        `Estos términos rigen desde ${PENDIENTE}. Si los cambiamos, publicaremos la nueva versión en esta página con su fecha. Los proyectos ya contratados se rigen por la versión vigente al aceptar la propuesta.`,
      ],
    },
  ],
  // Preguntas propias de este documento. Las de alcance, cambios y pagos ya se responden en
  // /, /paginas-web-bogota/ y /precios/ (no se repiten aquí).
  preguntas: [
    {
      pregunta: '¿Qué prevalece si la propuesta y estos términos dicen algo distinto?',
      respuesta:
        'Prevalece la propuesta que usted aceptó. Estos términos son las reglas generales del sitio y de los servicios; cada proyecto tiene además una propuesta escrita con su alcance, valor, fechas y condiciones. Si un punto no está en la propuesta, se aplican estos términos. Los proyectos ya contratados se rigen por la versión vigente cuando usted aceptó la propuesta.',
    },
    {
      pregunta: '¿Quién es dueño de los textos, el diseño y el dominio de mi web?',
      respuesta: `Los textos, logos, fotos y documentos que usted entrega siguen siendo suyos. La propuesta indica a nombre de quién se registra el dominio y qué derechos recibe sobre el diseño, los textos y el código una vez pagado el valor total. ${SITIO.nombre} conserva sus métodos de trabajo, plantillas internas y componentes reutilizables.`,
    },
    {
      pregunta: '¿Qué pasa si se retrasa un pago?',
      respuesta: `${SITIO.nombre} puede pausar el trabajo hasta recibir el pago, y las fechas acordadas se ajustan en la misma proporción. Por eso cada pago va ligado a un avance que usted puede ver: ${FORMA_PAGO_TEXTO}. La mensualidad empieza desde la publicación.`,
    },
    {
      pregunta: '¿Qué pasa si WhatsApp cambia o retira la atención inteligente?',
      respuesta:
        'Su activación, continuidad, características y costos dependen de las condiciones de WhatsApp Business, y así lo dice el contrato. Si la cuenta no es compatible, entregamos la web y el posicionamiento, descontamos o posponemos ese componente y dejamos listas las respuestas básicas. No ofrecemos una API como reemplazo.',
    },
    {
      pregunta: '¿VRS Digital responde por los errores del agente de IA?',
      respuesta:
        'Probamos el agente, limitamos la información que usa y definimos qué temas pasan a una persona, pero la inteligencia artificial puede dar respuestas inexactas. Por eso las decisiones médicas, legales, contables, financieras o de alto riesgo requieren revisión de una persona calificada. VRS Digital no responde por perjuicios causados por omitir esa supervisión.',
    },
  ],
  enlacesInternos: [
    { texto: 'Política de privacidad y tratamiento de datos', href: '/politica-de-privacidad/' },
    { texto: 'Precios, condiciones y formas de pago', href: '/precios/' },
    { texto: 'Atención inteligente en WhatsApp Business', href: '/asistente-whatsapp-business/' },
  ],
  fuentes: [
    { titulo: 'Estatuto del Consumidor, Ley 1480 de 2011 (Secretaría del Senado)', url: 'https://www.secretariasenado.gov.co/senado/basedoc/ley_1480_2011.html' },
  ],
  actualizado: '2026-10-11',
} as const satisfies ModuloPagina;
