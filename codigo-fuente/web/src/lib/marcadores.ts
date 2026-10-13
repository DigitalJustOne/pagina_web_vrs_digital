// ─────────────────────────────────────────────────────────────────────────────
//  Marcadores de las guías (src/content/recursos/*.md): los precios, la forma de pago y el
//  horario de VRS Digital no se escriben a mano en el Markdown, se toman de sitio.ts al compilar.
//
//    {{precioAnual:esencial}}     → $1.200.000   (precio anual desde, por plan; pago de una vez)
//    {{cuota:visible}}            → $220.000     (cuota mensual si paga en 12 cuotas, con 20 % más)
//    {{totalCuotas:atencion}}     → $3.600.000   (total de las 12 cuotas)
//    {{emprendedor}}              → $49.900      (mensualidad del Plan Emprendedor)
//    {{pago}}                     → 50 % para iniciar…, 30 % … y 20 % … (FORMA_DE_PAGO)
//    {{horario}}                  → lunes a viernes, de 9:00 a. m. a 6:00 p. m. (hora de Colombia)
//
//  Se aplican en el HTML de la guía (prepararGuia, src/components/paginas/empresa/guias.ts), en el
//  frontmatter (esquema de src/content.config.ts) y en llms-full.txt (src/lib/llms.ts). Un
//  marcador desconocido detiene la compilación. Usa rutas relativas: también lo importa
//  src/content.config.ts.
// ─────────────────────────────────────────────────────────────────────────────
import { CONTACTO, DOMINIO_HOSTING, FORMA_DE_PAGO, LANDING, PLANES, PLAN_ENTRADA, cuotaMensual, formatoCOP, totalEnCuotas } from '../data/sitio';

const plan = (id: string) => {
  const p = PLANES.find((x) => x.id === id);
  if (!p) throw new Error(`[marcadores] El plan «${id}» no existe en PLANES (src/data/sitio.ts).`);
  return p;
};

const PAGO = FORMA_DE_PAGO.map((f) => `${f.porcentaje} % ${f.momento}`)
  .join(', ')
  .replace(/, ([^,]*)$/, ' y $1');

const HORARIO = CONTACTO.horario.charAt(0).toLowerCase() + CONTACTO.horario.slice(1);

function valor(clave: string, id?: string): string {
  switch (clave) {
    case 'precioAnual':
      return formatoCOP(plan(id ?? '').precioAnualDesde);
    case 'cuota':
      return formatoCOP(cuotaMensual(plan(id ?? '').precioAnualDesde));
    case 'totalCuotas':
      return formatoCOP(totalEnCuotas(plan(id ?? '').precioAnualDesde));
    case 'landing':
      return formatoCOP(LANDING.precio);
    case 'landingDominio':
      return formatoCOP(LANDING.precioConDominio);
    case 'dominioHosting':
      return formatoCOP(DOMINIO_HOSTING.precioAnual);
    case 'emprendedor':
      return formatoCOP(PLAN_ENTRADA.mensualidad);
    case 'pago':
      return PAGO;
    case 'horario':
      return HORARIO;
    default:
      throw new Error(`[marcadores] Marcador desconocido: {{${clave}${id ? `:${id}` : ''}}}.`);
  }
}

const PATRON = /\{\{\s*([A-Za-z]+)(?::([a-z]+))?\s*\}\}/g;

/** Reemplaza los marcadores de un texto por los datos vigentes de sitio.ts. */
export function rellenarMarcadores(texto: string): string {
  return texto.includes('{{') ? texto.replace(PATRON, (_, clave: string, id?: string) => valor(clave, id)) : texto;
}

/** Igual que rellenarMarcadores, en todos los textos de un objeto o lista (frontmatter). */
export function rellenarEnTodo<T>(dato: T): T {
  if (typeof dato === 'string') return rellenarMarcadores(dato) as T;
  if (Array.isArray(dato)) return dato.map((d) => rellenarEnTodo(d)) as T;
  if (dato && typeof dato === 'object' && !(dato instanceof Date)) {
    return Object.fromEntries(Object.entries(dato).map(([k, v]) => [k, rellenarEnTodo(v)])) as T;
  }
  return dato;
}

