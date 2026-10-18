// ─────────────────────────────────────────────────────────────────────────────
//  /llms-full.txt (formato https://llmstxt.org): el contenido textual esencial
//  del sitio en un solo archivo para asistentes de IA.
//  Precios, planes, proceso, casos y contacto salen de src/data/sitio.ts;
//  respuestas directas y preguntas frecuentes, de src/data/contenido/*.ts;
//  guías, de src/content/recursos/*.md. No copie datos a mano aquí.
// ─────────────────────────────────────────────────────────────────────────────
import type { APIRoute } from 'astro';
import {
  SITIO,
  FUNDADOR,
  CONTACTO,
  AVAL,
  CIFRAS,
  SERVICIOS,
  SECTORES,
  PLANES,
  PLAN_ENTRADA,
  LANDING,
  DOMINIO_HOSTING,
  FORMA_DE_PAGO,
  MEDIOS_PAGO,
  NOTA_PRECIOS,
  CONDICIONES,
  PROCESO,
  CASOS,
  CTA_PRINCIPAL,
  formatoCOP,
  enlaceWhatsApp,
  cuotaMensual,
  totalEnCuotas,
} from '@/data/sitio';
import { rotuloCaso } from '@/lib/casos';
import { muestraPrecio } from '@/lib/paginas';
import { urlAbsoluta } from '@/lib/schema';
import { paginasLlms, fechaActualizacion, respuestaTexto, type PreguntaLlms } from '@/lib/llms';

const lista = (items: readonly string[]) => items.map((i) => `- ${i}`).join('\n');
const cop = (v: number) => `${formatoCOP(v)} COP`;
const normalizar = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ¿?¡!.,]/g, '').replace(/\s+/g, ' ').trim();

export const GET: APIRoute = () => {
  const paginas = paginasLlms();
  const guias = paginas.filter((p) => p.grupo === 'guias');
  const paginasSitio = paginas.filter((p) => p.grupo !== 'guias');
  const precioAnualMin = Math.min(...PLANES.map((p) => p.precioAnualDesde));
  const cuotaMin = Math.min(...PLANES.map((p) => cuotaMensual(p.precioAnualDesde)));

  // Límites que aplican a todos los planes: lo que no incluye el plan más completo
  // y cualquier promesa de "garantizado" que ningún plan hace.
  const planMayor = [...PLANES].sort((a, b) => b.precioAnualDesde - a.precioAnualDesde)[0];
  const limites = [...new Set([...planMayor.noIncluye, ...PLANES.flatMap((p) => p.noIncluye.filter((n) => /garantiz/i.test(n)))])];

  // Preguntas frecuentes de todas las páginas, sin repetir.
  const vistas = new Set<string>();
  const preguntas: (PreguntaLlms & { url: string })[] = [];
  for (const p of paginas) {
    for (const q of p.preguntas) {
      const clave = normalizar(q.pregunta);
      if (vistas.has(clave)) continue;
      vistas.add(clave);
      preguntas.push({ ...q, url: p.url });
    }
  }

  const servicios = SERVICIOS.map(
    (s) => `### ${s.nombre}\n\nURL: ${urlAbsoluta(`/${s.slug}/`)}\n\n${s.resumen}`,
  ).join('\n\n');

  const planes = PLANES.map((p) => {
    const encabezado = `### ${p.nombre}${p.etiqueta ? ` (${p.etiqueta.toLowerCase()})` : ''}`;
    return `${encabezado}

${p.paraQuien}

- Precio anual: desde ${cop(p.precioAnualDesde)} (IVA incluido), pago de una vez
- O en 12 cuotas: ${cop(cuotaMensual(p.precioAnualDesde))} al mes, total ${cop(totalEnCuotas(p.precioAnualDesde))} (IVA incluido)

${p.incluyeAnterior ?? 'Incluye:'}

${lista(p.incluye)}

No incluye:

${lista(p.noIncluye)}`;
  }).join('\n\n');

  // Cada caso dice si es trabajo para un cliente o producto propio (CASOS[].tipo, @/lib/casos).
  const casos = CASOS.map(
    (c) => `### ${c.cliente} (${c.sector})

Tipo: ${rotuloCaso(c.cliente)}.

${c.resumen}

Qué ofrece:

${lista(c.logros)}

Enlace público: ${c.enlace}`,
  ).join('\n\n');

  const resumenPaginas = paginasSitio
    .map((p) => {
      const partes = [`### ${p.titulo}`, `URL: ${p.url}`];
      if (p.descripcion) partes.push(p.descripcion);
      if (p.respuestaDirecta) partes.push(`En resumen: ${p.respuestaDirecta}`);
      return partes.join('\n\n');
    })
    .join('\n\n');

  const textoPreguntas = preguntas.map((q) => `### ${q.pregunta}\n\n${q.respuesta}\n\nFuente: ${q.url}`).join('\n\n');

  const textoGuias = guias
    .map((g) => {
      const partes = [`### ${g.titulo}`, `URL: ${g.url}`];
      if (g.descripcion) partes.push(g.descripcion);
      if (g.respuestaDirecta) partes.push(`En resumen: ${g.respuestaDirecta}`);
      // Los títulos internos de la guía bajan dos niveles para no romper la jerarquía de este archivo.
      if (g.cuerpo) partes.push(g.cuerpo.replace(/^(#{1,4}) /gm, (_m, h: string) => `${h}## `));
      // Igual que en la página de la guía: los precios de VRS Digital llevan «IVA incluido».
      if (g.cuerpo && muestraPrecio(g.cuerpo)) partes.push(`Precios de ${SITIO.nombre} en esta guía: ${NOTA_PRECIOS}`);
      return partes.join('\n\n');
    })
    .join('\n\n');

  const cuerpo = `# ${SITIO.nombre}: información completa

> ${SITIO.nombre} es un estudio digital de ${SITIO.ciudad}, Colombia, dirigido por su fundador, ${FUNDADOR.nombre}. ${SITIO.propuesta.replace(`${SITIO.nombre} crea`, 'Crea')} ${LANDING.nombre} desde ${cop(LANDING.precio)} (pago único). Planes web: precio anual desde ${cop(precioAnualMin)}, o 12 cuotas desde ${cop(cuotaMin)} al mes (20 % más en total). ${NOTA_PRECIOS}

Este archivo reúne el contenido esencial de ${urlAbsoluta('/')} en texto plano. Todos los precios están en pesos colombianos (COP). Última actualización: ${fechaActualizacion()}. Resumen con enlaces: ${urlAbsoluta('/llms.txt')}

## Quiénes somos

- Nombre: ${SITIO.nombre}
- Qué hace: ${SITIO.categoria}
- Eslogan: «${SITIO.eslogan}»
- Ubicación: ${SITIO.ciudad}, Colombia
- Fundador: ${FUNDADOR.nombre} (${FUNDADOR.nombreCorto}), ${FUNDADOR.cargo.toLowerCase()}. Perfil profesional: ${FUNDADOR.linkedin}
${lista(CIFRAS.map((c) => `${c.valor} ${c.etiqueta}`))}

### ${AVAL.titulo}

${AVAL.texto} Verificación: ${AVAL.enlace}

## Servicios

${servicios}

## Páginas para empresas de servicios

${lista(SECTORES.map((s) => `${s.nombre}: ${urlAbsoluta(`/${s.slug}/`)}`))}

## Planes y precios

Se publica el valor inicial de cada plan («desde»). ${NOTA_PRECIOS} El precio final depende del número de páginas, los textos, la migración de una web anterior y la cantidad de información. Detalle: ${urlAbsoluta('/precios/')}

${planes}

### ${LANDING.nombre}

${LANDING.paraQuien} ${LANDING.descripcion}

- Precio: ${cop(LANDING.precio)}, pago único (IVA incluido)
- Con dominio y hosting del primer año: ${cop(LANDING.precioConDominio)} (IVA incluido)

Incluye:

${lista(LANDING.incluye)}

No incluye:

${lista(LANDING.noIncluye)}

### ${DOMINIO_HOSTING.nombre}

- ${cop(DOMINIO_HOSTING.precioAnual)} al año (IVA incluido), para la ${LANDING.nombre} y el ${PLAN_ENTRADA.nombre}
- El primer año va incluido sin costo en ${PLANES.map((p) => p.nombre).join(', ').replace(/, ([^,]*)$/, ' y $1')}

Incluye:

${lista(DOMINIO_HOSTING.incluye)}

### ${PLAN_ENTRADA.nombre}

${PLAN_ENTRADA.descripcion}

- Mensualidad: ${cop(PLAN_ENTRADA.mensualidad)} al mes (IVA incluido)

No incluye:

${lista(PLAN_ENTRADA.noIncluye)}

### Forma de pago

${lista(FORMA_DE_PAGO.map((f) => `${f.porcentaje}\u00a0% ${f.momento}`))}

### Medios de pago

${lista(MEDIOS_PAGO)}

## Proceso de trabajo

${PROCESO.map((p, i) => `${i + 1}. ${p.titulo}: ${p.texto}`).join('\n')}

## Condiciones y límites

Ningún plan incluye:

${lista(limites)}

Condiciones:

${lista(CONDICIONES)}

## Proyectos

Proyectos con enlace público. Los resultados de cada proyecto dependen del negocio, su mercado y su operación; no garantizan los mismos resultados en otra empresa.

${casos}

## Contacto

- ${CTA_PRINCIPAL.texto}: ${urlAbsoluta(CTA_PRINCIPAL.href)}
- WhatsApp: ${CONTACTO.whatsappVisible} (${enlaceWhatsApp()})
- Correo: ${CONTACTO.correo}
- Horario de atención humana: ${CONTACTO.horario}. ${CONTACTO.respuestaHumana}
- Instagram: ${CONTACTO.redes.instagram}
- Facebook: ${CONTACTO.redes.facebook}
- LinkedIn: ${CONTACTO.redes.linkedin}

${resumenPaginas ? `## Páginas del sitio\n\n${resumenPaginas}` : ''}

${textoPreguntas ? `## Preguntas frecuentes\n\n${textoPreguntas}` : ''}

${textoGuias ? `## Guías\n\n${textoGuias}` : ''}
`;
  return respuestaTexto(cuerpo);
};
