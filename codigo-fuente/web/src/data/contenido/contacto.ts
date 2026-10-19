// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /contacto/.
//  Fuentes: informe del Director (2026-10-05: "Oferta de entrada", "Embudo sencillo",
//  "Proceso de entrega", "Capacidad y límites") y src/data/sitio.ts (CONTACTO, FORMA_DE_PAGO).
//  El formulario es la isla src/components/islas/Formulario.tsx (Formspree).
//
//  PENDIENTE DE LA DIRECCIÓN antes de publicar:
//  - Confirmar en cuánto tiempo se entrega la revisión (hoy solo se promete la primera
//    respuesta en uno o dos días hábiles, como dice CONTACTO.respuestaHumana).
//  - Confirmar si el WhatsApp de VRS Digital tendrá activo el agente de Meta. Si se activa,
//    hay que decirlo en esta página (el visitante debe saber que le responde una IA).
//  - El formulario enlaza /politica-de-privacidad/, que sigue en borrador (falta la validación
//    del abogado y los datos de identificación).
//  2026-10-19 (claridad): textos simples; el plazo de respuesta va una vez (respuesta directa) y el
//  horario una vez (canales). Se quitaron preguntas que repetían las partes de la página.
//  EDICIÓN FINAL (2026-10-06): se quitó «¿Trabajan con empresas fuera de Bogotá?» porque
//  repetía «¿Dónde está ubicado VRS Digital?» de /nosotros/. El formulario también pide el plan.
// ─────────────────────────────────────────────────────────────────────────────
import { CONTACTO, CTA_PRINCIPAL, FORMA_DE_PAGO, enlaceWhatsApp } from '@/data/sitio';
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { ModuloPagina } from './tipos';

/** Valida en compilación que el icono exista en el set de tarjetas. */
const icono = (nombre: NombreIconoTarjeta) => nombre;
const anticipo = FORMA_DE_PAGO[0].porcentaje;

const MENSAJE_WHATSAPP = 'Hola, quiero solicitar una revisión digital gratuita para mi empresa.';

export const contenido = {
  ruta: '/contacto/',
  seo: {
    // 41 caracteres + « | VRS Digital» = 55.
    titulo: 'Revisión digital gratuita para su empresa',
    descripcion:
      'Revisamos gratis su web, cómo aparece en Google y su WhatsApp. Le enviamos las tres mejoras que más le ayudan. Sin compromiso de contratar.',
    palabraClave: 'revisión digital gratuita',
    secundarias: [
      'contacto VRS Digital',
      'diagnóstico de página web',
      'revisión de página web Bogotá',
      'mejorar atención por WhatsApp',
    ],
  },
  migas: [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Contacto', ruta: '/contacto/' },
  ],
  hero: {
    etiqueta: 'Contacto',
    titulo: 'Solicite su revisión digital gratuita',
    subtitulo: 'Revisamos gratis su web, cómo aparece en Google y su WhatsApp. No lo obliga a contratar.',
    ctaPrincipal: { texto: 'Ir al formulario', href: '#formulario' },
    ctaSecundario: { texto: 'Escribir por WhatsApp', href: enlaceWhatsApp(MENSAJE_WHATSAPP) },
  },
  respuestaDirecta: `Usted recibe las tres mejoras que más le conviene hacer primero, explicadas en palabras sencillas. ${CONTACTO.respuestaHumana}`,
  secciones: [
    {
      id: 'que-revisamos',
      etiqueta: 'Qué revisamos',
      titulo: 'Qué revisamos de su empresa',
      tipo: 'tarjetas',
      columnas: 3,
      items: [
        {
          titulo: 'Su web',
          texto: 'Si dice en pocos segundos qué hace, dónde está y cómo contactarlo.',
          icono: icono('eye'),
        },
        {
          titulo: 'Google',
          texto: 'Cómo aparece su empresa en Google y en asistentes como ChatGPT.',
          icono: icono('search'),
        },
        {
          titulo: 'Celular',
          texto: 'Si su web se lee bien y carga rápido en el celular.',
          icono: icono('monitor'),
        },
        {
          titulo: 'Contacto',
          texto: 'Si el botón de WhatsApp y el formulario funcionan.',
          icono: icono('check'),
        },
        {
          titulo: 'WhatsApp',
          texto: 'Cómo responde hoy las preguntas de siempre y los mensajes fuera de horario.',
          icono: icono('message'),
        },
      ],
    },
    {
      id: 'que-recibe',
      etiqueta: 'Qué recibe',
      titulo: 'Qué recibe: tres mejoras concretas',
      tipo: 'lista',
      introduccion: 'Una guía corta, no un informe largo.',
      items: [
        'Las tres mejoras que más le ayudan, en palabras sencillas.',
        'Por qué importa cada una.',
        'Por cuál empezar. Puede hacerlas usted mismo o con otro proveedor.',
      ],
    },
    {
      id: 'que-pasa-despues',
      etiqueta: 'Después',
      titulo: 'Qué pasa después de escribirnos',
      tipo: 'pasos',
      items: [
        {
          paso: '01',
          titulo: 'Usted nos escribe',
          texto: 'Por el formulario o por WhatsApp.',
        },
        {
          paso: '02',
          titulo: 'Recibe la revisión',
          texto: 'Le enviamos las tres mejoras para su empresa.',
        },
        {
          paso: '03',
          titulo: 'Reunión, si quiere avanzar',
          texto: 'Hablamos hasta 45 minutos. Acordamos qué incluye su proyecto y revisamos si su WhatsApp Business es compatible con las respuestas automáticas.',
        },
        {
          paso: '04',
          titulo: 'Propuesta',
          texto: `Le enviamos máximo tres opciones. Si acepta una, paga el ${anticipo} % para empezar.`,
        },
      ],
    },
    {
      id: 'formulario',
      etiqueta: 'Formulario',
      titulo: 'Cuéntenos sobre su empresa',
      introduccion:
        'Le pedimos su nombre, su empresa, su WhatsApp, el plan que le interesa y qué necesita. El correo y su web son opcionales.',
      tipo: 'formulario',
      nota: 'Usamos sus datos solo para responderle, con su autorización y según la Ley 1581 de 2012 de protección de datos personales.',
      enlacePrivacidad: { texto: 'Política de privacidad', href: '/politica-de-privacidad/' },
    },
    {
      id: 'canales',
      etiqueta: 'Canales',
      titulo: 'WhatsApp, correo y horario',
      tipo: 'contacto',
      canales: [
        {
          nombre: 'WhatsApp',
          valor: CONTACTO.whatsappVisible,
          href: enlaceWhatsApp(MENSAJE_WHATSAPP),
        },
        {
          nombre: 'Correo',
          valor: CONTACTO.correo,
          href: `mailto:${CONTACTO.correo}`,
        },
      ],
      horario: CONTACTO.horario,
      redes: CONTACTO.redes,
      parrafos: ['Si escribe de noche o el fin de semana, le respondemos desde el siguiente día hábil.'],
    },
    {
      id: 'antes-de-escribir',
      etiqueta: 'No hacemos',
      titulo: 'Antes de escribirnos',
      tipo: 'lista',
      introduccion: 'Para ahorrarle tiempo, esto no lo hacemos:',
      variante: 'excluye',
      items: [
        'Chatbots hechos a la medida.',
        'Conexión con otros programas de su empresa (ventas, facturación, inventario).',
        'Envío de mensajes masivos.',
      ],
      nota: 'Trabajamos con máximo dos proyectos a la vez. La fecha de inicio depende de cuándo haya cupo.',
    },
  ],
  preguntas: [
    {
      pregunta: '¿Necesito tener página web para pedir la revisión?',
      respuesta:
        'No. Si no tiene web, revisamos cómo lo encuentran hoy sus clientes: en Google, en redes sociales y por WhatsApp. Así sabe por dónde empezar.',
    },
  ],
  cta: {
    titulo: 'Sepa qué mejorar primero en su empresa',
    texto: 'Escríbanos por el formulario o por WhatsApp. La revisión es gratis.',
    ctaPrincipal: { texto: CTA_PRINCIPAL.texto, href: '#formulario' },
    ctaWhatsApp: MENSAJE_WHATSAPP,
    enlaceWhatsApp: enlaceWhatsApp(MENSAJE_WHATSAPP),
  },
  enlacesInternos: [
    { texto: 'Precios y qué incluye cada plan', href: '/precios/' },
    { texto: 'Atención inteligente en WhatsApp Business', href: '/asistente-whatsapp-business/' },
    { texto: 'Proyectos de páginas web y plataformas', href: '/proyectos/' },
    { texto: 'Quién está detrás de VRS Digital', href: '/nosotros/' },
  ],
  actualizado: '2026-10-19',
} as const satisfies ModuloPagina;
