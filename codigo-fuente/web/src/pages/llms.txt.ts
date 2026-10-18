// ─────────────────────────────────────────────────────────────────────────────
//  /llms.txt (formato https://llmstxt.org): resumen del sitio para asistentes
//  de IA, con enlaces absolutos a cada página clave.
//  La lista se arma sola desde src/data/contenido/*.ts, src/pages/ y
//  src/content/recursos/*.md (ver src/lib/llms.ts).
// ─────────────────────────────────────────────────────────────────────────────
import type { APIRoute } from 'astro';
import { SITIO, FUNDADOR, CONTACTO, AVAL, PLANES, LANDING, DOMINIO_HOSTING, NOTA_PRECIOS, formatoCOP, enlaceWhatsApp, cuotaMensual } from '@/data/sitio';
import { urlAbsoluta } from '@/lib/schema';
import { paginasLlms, fechaActualizacion, respuestaTexto, type GrupoLlms, type PaginaLlms } from '@/lib/llms';

/** Encabezado de cada sección. "Optional" es la palabra reservada de llmstxt.org para lo prescindible. */
const SECCIONES: { titulo: string; grupos: GrupoLlms[] }[] = [
  { titulo: 'Empresa', grupos: ['empresa'] },
  { titulo: 'Servicios', grupos: ['servicios'] },
  { titulo: 'Empresas de servicios', grupos: ['sectores'] },
  { titulo: 'Planes y precios', grupos: ['precios'] },
  { titulo: 'Guías y recursos', grupos: ['recursos', 'guias'] },
  { titulo: 'Optional', grupos: ['otras'] },
];

const linea = (p: PaginaLlms) => `- [${p.titulo}](${p.url})${p.descripcion ? `: ${p.descripcion}` : ''}`;

export const GET: APIRoute = () => {
  const paginas = paginasLlms();
  const precioAnualMin = Math.min(...PLANES.map((p) => p.precioAnualDesde));
  const cuotaMin = Math.min(...PLANES.map((p) => cuotaMensual(p.precioAnualDesde)));

  const secciones = SECCIONES.map(({ titulo, grupos }) => {
    const lista = paginas.filter((p) => grupos.includes(p.grupo));
    return lista.length ? `## ${titulo}\n\n${lista.map(linea).join('\n')}` : '';
  }).filter(Boolean);

  const cuerpo = `# ${SITIO.nombre}

> ${SITIO.nombre} es un estudio digital de ${SITIO.ciudad}, Colombia, dirigido por su fundador, ${FUNDADOR.nombre}. ${SITIO.propuesta.replace(`${SITIO.nombre} crea`, 'Crea')} ${LANDING.nombre} desde ${formatoCOP(LANDING.precio)} COP (pago único). Planes web: precio anual desde ${formatoCOP(precioAnualMin)} COP, o 12 cuotas desde ${formatoCOP(cuotaMin)} COP al mes (20 % más en total). ${DOMINIO_HOSTING.resumen} ${NOTA_PRECIOS}

Datos clave:

- Eslogan: «${SITIO.eslogan}»
- Atención directa con el fundador, sin intermediarios. Máximo dos proyectos al mismo tiempo.
- ${AVAL.titulo}: ${AVAL.enlace}
- WhatsApp: ${CONTACTO.whatsappVisible} (${enlaceWhatsApp()})
- Correo: ${CONTACTO.correo}
- Horario de atención humana: ${CONTACTO.horario}.
- Información completa en un solo archivo: [llms-full.txt](${urlAbsoluta('/llms-full.txt')})
- Última actualización: ${fechaActualizacion()}

${secciones.join('\n\n')}
`;
  return respuestaTexto(cuerpo);
};
