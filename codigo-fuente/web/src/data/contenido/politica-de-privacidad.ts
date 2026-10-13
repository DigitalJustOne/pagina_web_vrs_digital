// ─────────────────────────────────────────────────────────────────────────────
//  AVISO: BORRADOR — LA DIRECCIÓN DEBE VALIDARLO CON UN ABOGADO ANTES DE PUBLICARLO.
//  No es asesoría jurídica. Se redactó a partir de la Ley 1581 de 2012 y del Decreto 1377
//  de 2013 (compilado en el Decreto 1074 de 2015, capítulo 25), verificados el 2026-10-06
//  en la Secretaría del Senado y en el normograma del MinTIC.
//
//  Contenido de /politica-de-privacidad/. La usan el formulario de contacto
//  (src/components/islas/Formulario.tsx), el pie de página y /contacto/: la ruta debe existir
//  aunque el texto siga en revisión. `borrador: true` muestra el aviso de borrador, pone noindex
//  y la deja fuera del sitemap y de llms.txt (src/data/rutas.ts). Al publicarla, quítelo.
//
//  Contenido mínimo del Decreto 1377, art. 13: responsable con domicilio, dirección, correo y
//  teléfono; tratamiento y finalidades; derechos; área de atención; procedimiento; vigencia.
//
//  PENDIENTE DE LA DIRECCIÓN (y del abogado):
//  - Forma jurídica de VRS Digital (persona natural con nombre comercial o sociedad) y su
//    número de identificación (cédula o NIT). Hoy: «[pendiente]».
//  - Dirección física de notificaciones (el decreto la exige). Hoy: «[pendiente]».
//  - Plazo de conservación de los datos de quien no contrata. Propuesta: 12 meses.
//  - Confirmar los proveedores que reciben datos (correo, formulario, alojamiento, WhatsApp,
//    pasarela de pagos), si almacenan fuera de Colombia y si hay contratos de transmisión.
//  - Confirmar que el sitio no usa cookies de publicidad ni analítica de terceros (hoy el
//    código no carga ninguna) y si el agente de IA de Meta está activo en el WhatsApp de VRS.
//  - Fecha de entrada en vigencia (el día que se publique la versión validada).
// ─────────────────────────────────────────────────────────────────────────────
import { CONTACTO, FUNDADOR, SITIO } from '@/data/sitio';
import type { ModuloPagina } from './tipos';

const minuscula = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

const URL_LEY_1581 = 'https://www.secretariasenado.gov.co/senado/basedoc/ley_1581_2012.html';
const URL_DECRETO_1377 = 'https://normograma.mintic.gov.co/mintic/compilacion/docs/decreto_1377_2013.htm';
const URL_CIRCULAR_SIC_IA =
  'https://sedeelectronica.sic.gov.co/sites/default/files/normativa/Circular%20Externa%20No.%20002%20del%2021%20de%20agosto%20de%202024.pdf';
const URL_AYUDA_WHATSAPP = 'https://faq.whatsapp.com/291930066973116/';

const PENDIENTE = '[pendiente de confirmar por la Dirección]';

export const contenido = {
  ruta: '/politica-de-privacidad/',
  borrador: true,
  avisoBorrador:
    'Borrador en revisión jurídica. Este texto debe ser validado por un abogado antes de su versión definitiva.',
  seo: {
    // 45 caracteres + « | VRS Digital» (Seo.astro) = 59.
    titulo: 'Política de privacidad y tratamiento de datos',
    descripcion:
      'Cómo VRS Digital trata sus datos según la Ley 1581 de 2012: qué datos pide, para qué los usa, sus derechos y cómo consultar, corregir o borrar sus datos.',
    palabraClave: 'política de tratamiento de datos personales',
    secundarias: ['política de privacidad VRS Digital', 'Ley 1581 de 2012', 'habeas data', 'derechos del titular de datos'],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Política de privacidad', ruta: '/politica-de-privacidad/' },
  ],
  hero: {
    etiqueta: 'Documento legal',
    titulo: 'Política de privacidad y tratamiento de datos personales',
    subtitulo:
      'Qué datos le pedimos, para qué los usamos, con quién los compartimos, cuánto tiempo los guardamos y cómo puede consultarlos, corregirlos o pedir que los borremos.',
  },
  respuestaDirecta: `${SITIO.nombre}, dirigida por ${FUNDADOR.nombre}, trata los datos que usted nos da para responder su solicitud, enviarle propuestas y, si contrata, prestarle el servicio. No vendemos sus datos. Puede conocerlos, corregirlos o pedir que los borremos escribiendo a ${CONTACTO.correo}. Respondemos consultas en máximo 10 días hábiles y reclamos en máximo 15, según la Ley 1581 de 2012.`,
  vigencia: {
    desde: PENDIENTE,
    version: '0.1 (borrador)',
  },
  secciones: [
    {
      id: 'responsable',
      etiqueta: 'Responsable',
      titulo: '1. Quién es responsable de sus datos',
      tipo: 'lista',
      items: [
        { titulo: 'Responsable del tratamiento', texto: `${FUNDADOR.nombre}, quien dirige ${SITIO.nombre}.` },
        { titulo: 'Nombre comercial', texto: SITIO.nombre },
        { titulo: 'Identificación', texto: PENDIENTE },
        { titulo: 'Domicilio', texto: 'Bogotá D. C., Colombia.' },
        { titulo: 'Dirección de notificaciones', texto: PENDIENTE },
        { titulo: 'Correo electrónico', texto: CONTACTO.correo },
        { titulo: 'Teléfono y WhatsApp', texto: CONTACTO.whatsappVisible },
        { titulo: 'Horario de atención', texto: CONTACTO.horario },
      ],
      parrafos: [
        `La persona encargada de atender sus peticiones, consultas y reclamos sobre datos personales es ${FUNDADOR.nombre}, en el correo ${CONTACTO.correo}.`,
      ],
    },
    {
      id: 'alcance',
      etiqueta: 'Alcance',
      titulo: '2. A quién aplica esta política',
      tipo: 'texto',
      parrafos: [
        `Aplica a los datos personales de las personas que se comunican con ${SITIO.nombre} por el formulario de este sitio, WhatsApp, correo electrónico o redes sociales, y a los de nuestros clientes y sus contactos durante la relación comercial.`,
        'Se rige por la Ley 1581 de 2012, el Decreto 1377 de 2013 (hoy compilado en el Decreto 1074 de 2015) y las demás normas colombianas sobre protección de datos personales.',
      ],
    },
    {
      id: 'datos',
      etiqueta: 'Qué datos',
      titulo: '3. Qué datos recolectamos',
      introduccion: 'Pedimos solo los datos necesarios para atenderle:',
      tipo: 'lista',
      items: [
        'Por el formulario: nombre, empresa, número de WhatsApp, el mensaje que usted escribe y, si quiere darlos, su correo, la dirección de su sitio web y el plan que le interesa. También registramos la página del sitio desde la que envió el formulario.',
        'Por WhatsApp, correo o redes sociales: los datos y mensajes que usted decida enviarnos.',
        'Si contrata: los datos necesarios para la propuesta, el contrato, la facturación y el pago, como nombre o razón social, número de identificación y correo de facturación.',
      ],
      parrafos: [
        'No pedimos datos sensibles, como los de salud, origen étnico, orientación política, creencias religiosas, vida sexual o datos biométricos, ni datos de niñas, niños o adolescentes. Le pedimos no enviarlos. Si los recibimos sin haberlos pedido, no los usaremos para ninguna finalidad.',
      ],
    },
    {
      id: 'finalidades',
      etiqueta: 'Finalidades',
      titulo: '4. Para qué usamos sus datos',
      tipo: 'lista',
      items: [
        'Responder su solicitud y preparar la revisión digital que nos pidió.',
        'Preparar y enviarle propuestas y cotizaciones.',
        'Si contrata: comunicarnos con usted, ejecutar el contrato, facturar, cobrar y darle soporte.',
        'Cumplir nuestras obligaciones legales, contables y tributarias.',
        'Atender sus consultas y reclamos sobre el tratamiento de sus datos.',
      ],
      parrafos: [
        'No vendemos ni alquilamos sus datos, y no los usamos para enviar publicidad masiva. Si quisiéramos enviarle información comercial distinta de lo que usted nos pidió, le solicitaremos una autorización aparte.',
      ],
    },
    {
      id: 'como-los-tratamos',
      etiqueta: 'Tratamiento',
      titulo: '5. Cómo tratamos sus datos y con quién los compartimos',
      tipo: 'texto',
      parrafos: [
        `Recolectamos, guardamos, consultamos y usamos sus datos solo para las finalidades anteriores. Dentro de ${SITIO.nombre} solo tiene acceso a ellos su responsable.`,
        'Para operar usamos proveedores tecnológicos que pueden tratar sus datos por nuestra cuenta: correo electrónico, procesamiento del formulario web, alojamiento del sitio, mensajería (WhatsApp, de Meta) y pagos en línea (Bold). Algunos de ellos pueden almacenar información en servidores fuera de Colombia. Compartimos con ellos solo los datos necesarios para cada tarea.',
        'Podemos usar herramientas de inteligencia artificial para preparar borradores de la revisión digital o de la propuesta. En ese caso usamos solo la información necesaria sobre su empresa, no incluimos datos sensibles y una persona revisa el resultado, de acuerdo con los lineamientos de la Superintendencia de Industria y Comercio (Circular Externa 002 de 2024).',
        'Si nos escribe por WhatsApp, Meta también trata sus mensajes según sus propias condiciones. Cuando una cuenta de WhatsApp Business tiene activo el agente de inteligencia artificial de Meta, WhatsApp informa que Meta usa los mensajes de esos chats para mejorar su inteligencia artificial. Por eso le pedimos no enviar por WhatsApp información sensible o confidencial.',
        'Entregaremos sus datos a una autoridad solo cuando la ley lo exija o una autoridad competente lo ordene.',
      ],
    },
    {
      id: 'derechos',
      etiqueta: 'Sus derechos',
      titulo: '6. Sus derechos como titular de los datos',
      introduccion: 'Según el artículo 8 de la Ley 1581 de 2012, usted tiene derecho a:',
      tipo: 'lista',
      items: [
        'Conocer, actualizar y corregir sus datos personales.',
        'Pedir prueba de la autorización que nos dio.',
        'Saber, si lo solicita, qué uso le hemos dado a sus datos.',
        'Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley, después de haber hecho su consulta o reclamo ante nosotros.',
        'Revocar la autorización o pedir que borremos sus datos cuando no se respeten los principios, derechos y garantías de la ley.',
        'Acceder gratis a sus datos personales.',
      ],
      parrafos: [
        'La revocatoria y el borrado no proceden cuando usted tiene un deber legal o contractual de permanecer en nuestra base de datos, por ejemplo mientras está vigente un contrato o durante el tiempo que exigen las normas contables (Decreto 1377 de 2013, art. 9).',
      ],
    },
    {
      id: 'procedimiento',
      etiqueta: 'Cómo ejercerlos',
      titulo: '7. Cómo consultar, corregir o borrar sus datos',
      tipo: 'texto',
      parrafos: [
        `Escriba a ${CONTACTO.correo} con el asunto «Datos personales». Incluya su nombre, su número de identificación, lo que solicita, el medio por el que quiere recibir la respuesta y, si aplica, los documentos que la soporten. Si actúa en nombre de otra persona, adjunte el documento que lo acredite.`,
        'También puede escribirnos por WhatsApp, pero para proteger su información le pediremos confirmar la solicitud por correo.',
      ],
    },
    {
      id: 'plazos',
      etiqueta: 'Plazos',
      titulo: '8. Plazos de respuesta',
      tipo: 'tabla',
      columnas: ['Tipo de solicitud', 'Plazo máximo', 'Si no podemos cumplirlo'],
      filas: [
        [
          'Consulta: conocer qué datos tenemos y cómo los usamos (Ley 1581, art. 14)',
          '10 días hábiles desde que la recibimos',
          'Le informamos el motivo y la nueva fecha, que no superará 5 días hábiles más',
        ],
        [
          'Reclamo: corregir, actualizar o borrar datos, revocar la autorización o señalar un incumplimiento (Ley 1581, art. 15)',
          '15 días hábiles desde el día siguiente a recibirlo completo',
          'Le informamos el motivo y la nueva fecha, que no superará 8 días hábiles más',
        ],
      ],
      parrafos: [
        'Si su reclamo llega incompleto, le pediremos dentro de los 5 días siguientes que lo complete. Si pasan 2 meses desde esa solicitud sin que recibamos la información, entenderemos que desistió del reclamo.',
        'Cuando recibamos un reclamo completo, marcaremos sus datos con la leyenda «reclamo en trámite» y el motivo, en máximo 2 días hábiles, hasta que se resuelva.',
        'Antes de acudir a la Superintendencia de Industria y Comercio, la ley pide agotar este trámite ante nosotros (Ley 1581, art. 16).',
      ],
    },
    {
      id: 'conservacion',
      etiqueta: 'Conservación',
      titulo: '9. Cuánto tiempo guardamos sus datos',
      tipo: 'lista',
      items: [
        'Si nos contactó y no contrató: hasta 12 meses después de nuestra última comunicación, salvo que usted pida antes que los borremos.',
        'Si es cliente: mientras dure la relación comercial y, después, durante el tiempo que exijan las normas contables, tributarias y comerciales.',
      ],
      parrafos: ['Cuando ya no los necesitemos para estas finalidades, los borraremos o los volveremos anónimos.'],
    },
    {
      id: 'seguridad',
      etiqueta: 'Seguridad',
      titulo: '10. Cómo protegemos sus datos',
      tipo: 'texto',
      parrafos: [
        'Aplicamos medidas razonables para proteger sus datos: acceso limitado a su responsable, contraseñas seguras, gestores de contraseñas cifrados para credenciales y conexión cifrada (HTTPS) en este sitio. No enviamos claves ni credenciales por canales de texto sin cifrar.',
        'Ningún sistema es completamente seguro. Si ocurre un incidente que afecte sus datos, actuaremos según lo que exige la ley, incluida la notificación a la autoridad cuando corresponda.',
      ],
    },
    {
      id: 'sitio',
      etiqueta: 'Este sitio',
      titulo: '11. Datos técnicos del sitio web',
      tipo: 'texto',
      parrafos: [
        'Este sitio no usa cookies de publicidad ni herramientas de seguimiento de terceros. El servidor de alojamiento puede registrar datos técnicos de cada visita, como la dirección IP, el navegador y la hora, por razones de seguridad y funcionamiento.',
        'Si en el futuro agregamos herramientas de medición, actualizaremos esta política antes de activarlas.',
      ],
    },
    {
      id: 'cambios',
      etiqueta: 'Vigencia',
      titulo: '12. Vigencia y cambios de esta política',
      tipo: 'texto',
      parrafos: [
        `Esta política rige desde ${PENDIENTE} y estará vigente mientras ${SITIO.nombre} trate datos personales.`,
        'Si la cambiamos de forma importante, publicaremos la nueva versión en esta página con su fecha. Si cambian las finalidades para las que usamos sus datos, le pediremos una nueva autorización.',
      ],
    },
  ],
  preguntas: [
    {
      pregunta: '¿Quién es responsable de mis datos personales en VRS Digital?',
      respuesta: `El responsable es ${FUNDADOR.nombre}, quien dirige ${SITIO.nombre}. Él atiende las consultas y reclamos sobre datos personales en el correo ${CONTACTO.correo}, de ${minuscula(CONTACTO.horario)}. Dentro de ${SITIO.nombre}, solo él tiene acceso a sus datos.`,
    },
    {
      pregunta: '¿Para qué usa VRS Digital mis datos?',
      respuesta:
        'Para responder su solicitud, preparar la revisión digital, enviarle propuestas y cotizaciones y, si contrata, comunicarnos con usted, prestarle el servicio, facturar y cumplir obligaciones legales. No vendemos ni alquilamos sus datos, ni los usamos para publicidad masiva. Si quisiéramos enviarle otra información comercial, le pediríamos una autorización aparte.',
    },
    {
      pregunta: '¿Cómo pido que borren o corrijan mis datos?',
      respuesta: `Escriba a ${CONTACTO.correo} con el asunto «Datos personales». Incluya su nombre, su identificación, qué solicita y cómo quiere recibir la respuesta. Respondemos en máximo 15 días hábiles. El borrado no procede si usted tiene un deber legal o contractual de permanecer en la base de datos, por ejemplo durante un contrato vigente.`,
    },
    {
      pregunta: '¿Cuánto tardan en responder una consulta o un reclamo sobre mis datos?',
      respuesta:
        'Una consulta se responde en máximo 10 días hábiles desde que la recibimos; si no es posible, le avisamos y respondemos en máximo 5 días hábiles más. Un reclamo se resuelve en máximo 15 días hábiles; si no es posible, le avisamos y lo resolvemos en máximo 8 días hábiles más. Son los plazos de la Ley 1581 de 2012.',
    },
    {
      pregunta: '¿VRS Digital comparte mis datos con otras empresas?',
      respuesta:
        'Solo con los proveedores tecnológicos que necesitamos para operar, como correo electrónico, formulario web, alojamiento, WhatsApp y pagos en línea, y solo los datos necesarios para cada tarea. Algunos pueden almacenar información fuera de Colombia. También entregaríamos datos a una autoridad si la ley lo exige. No vendemos ni alquilamos sus datos.',
    },
  ],
  enlacesInternos: [
    { texto: 'Términos y condiciones del servicio', href: '/terminos/' },
    { texto: 'Contacto y canales de atención', href: '/contacto/' },
    { texto: 'Guía: qué puede hacer el agente de IA de WhatsApp Business', href: '/recursos/agente-ia-whatsapp-business/' },
  ],
  fuentes: [
    { titulo: 'Ley 1581 de 2012 (Secretaría del Senado)', url: URL_LEY_1581 },
    { titulo: 'Decreto 1377 de 2013 (normograma del MinTIC)', url: URL_DECRETO_1377 },
    { titulo: 'Circular Externa 002 de 2024 sobre datos personales e inteligencia artificial (SIC)', url: URL_CIRCULAR_SIC_IA },
    { titulo: 'About using business AI to chat with customers (Centro de ayuda de WhatsApp)', url: URL_AYUDA_WHATSAPP, idioma: 'en' },
  ],
  actualizado: '2026-10-05',
} as const satisfies ModuloPagina;
