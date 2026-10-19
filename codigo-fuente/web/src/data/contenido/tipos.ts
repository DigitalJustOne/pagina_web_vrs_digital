// ─────────────────────────────────────────────────────────────────────────────
//  Tipos de los módulos de contenido (src/data/contenido/*.ts).
//  Cada módulo exporta `contenido` con `as const satisfies ModuloPagina`: así el
//  compilador avisa si una sección no tiene los campos que su plantilla necesita.
//  Las listas son `readonly` porque los módulos usan `as const`.
//
//  Este archivo solo exporta tipos: en tiempo de ejecución queda vacío, y
//  src/lib/llms.ts (que recorre la carpeta) lo ignora porque no tiene `ruta`.
//  Plantilla que los usa: src/components/pagina/PlantillaPagina.astro y Seccion.astro.
// ─────────────────────────────────────────────────────────────────────────────
import type { NombreIconoTarjeta } from '@/components/ui/iconos';
import type { IdPlan } from '@/data/sitio';

type Lista<T> = readonly T[];

// ── Piezas comunes ───────────────────────────────────────────────────────────
export interface Enlace {
  readonly texto: string;
  /** Interna con barra final (/precios/), ancla (#formulario) o externa (https://…). */
  readonly href: string;
}

export interface Fuente {
  readonly titulo: string;
  readonly url: string;
  /** 'en' si el título está en inglés: se marca con lang para que el lector de pantalla lo pronuncie bien. */
  readonly idioma?: 'en';
}

export interface Miga {
  readonly nombre: string;
  readonly ruta: string;
}

export interface Pregunta {
  readonly pregunta: string;
  readonly respuesta: string;
}

/** Bloque con título y texto (aclaraciones, destacados, ítems de lista con título). */
export interface BloqueTitulado {
  readonly titulo: string;
  readonly texto: string;
}

/** Cifra verificada (CIFRAS de sitio.ts). Solo estas se animan con data-contar. */
export interface Cifra {
  readonly valor: string;
  readonly etiqueta: string;
}

export interface ItemTarjeta {
  readonly titulo: string;
  readonly texto: string;
  readonly icono?: NombreIconoTarjeta;
  readonly href?: string;
  /** Texto corto sobre el título (ej. «SEO»). */
  readonly antetitulo?: string;
}

export interface Paso {
  readonly paso: string;
  readonly titulo: string;
  readonly texto: string;
}

export interface MensajeConversacion {
  readonly de: 'cliente' | 'asistente' | 'persona';
  readonly texto: string;
  readonly hora: string;
  /** Rótulo centrado antes del mensaje (ej. «Lunes»). */
  readonly separador?: string;
}

export interface Conversacion {
  /** Nombre de la empresa (ficticia) en la cabecera del teléfono. */
  readonly titulo: string;
  readonly estado?: string;
  readonly mensajes: Lista<MensajeConversacion>;
  /** Aclaración obligatoria bajo el teléfono (ejemplo ficticio). */
  readonly nota?: string;
}

export interface AvalSeccion {
  readonly titulo: string;
  readonly texto: string;
  readonly enlace?: Enlace;
}

export interface EjemploRespuesta {
  readonly titulo: string;
  readonly pregunta: string;
  readonly respuesta: string;
  readonly fuente?: Enlace;
}

export interface Cita {
  /** Traducción al español (visible). */
  readonly texto: string;
  /** Texto original, tal cual (inglés). */
  readonly original?: string;
  readonly fuente: string;
  /** Fragmento exacto de `fuente` que está en inglés (título original): se marca con lang="en". */
  readonly fuenteEn?: string;
  readonly url: string;
}

export interface Persona {
  readonly nombre: string;
  readonly nombreCorto?: string;
  readonly cargo: string;
  /** Ruta en public/ (ej. /img/hero-image.png). Si existe el .webp hermano, se sirve primero. */
  readonly foto: string;
  readonly altFoto: string;
  readonly enlaces?: Lista<Enlace>;
}

export interface ResumenGuia {
  readonly slug: string;
  readonly href: string;
  readonly etiqueta: string;
  readonly titulo: string;
  readonly resumen: string;
  readonly icono?: NombreIconoTarjeta;
  /** AAAA-MM-DD */
  readonly actualizado?: string;
}

export interface CanalContacto {
  readonly nombre: string;
  readonly valor: string;
  readonly href: string;
}

/** Proyecto de /proyectos/ (CASOS de sitio.ts + contexto). `tipo` es el rótulo visible. */
export interface ProyectoDetalle {
  readonly cliente: string;
  readonly sector: string;
  readonly imagen: string;
  readonly enlace: string;
  readonly destacado?: boolean;
  readonly tipo: string;
  readonly contexto: string;
  readonly queSeHizo: Lista<string>;
  readonly logros: Lista<string>;
}

/** Resumen de un plan que algunos módulos calculan (la plantilla toma los datos de PLANES). */
export interface ResumenPlan {
  readonly id: IdPlan;
  readonly nombre: string;
  readonly queEs: string;
  readonly precioAnual: string;
  readonly cuotas: string;
  readonly destacado?: boolean;
}

// ── Secciones ────────────────────────────────────────────────────────────────
/** Campos que comparten todas las secciones. */
interface SeccionBase {
  /** Ancla de la sección (#id) y base del id de su título (`${id}-titulo`). */
  readonly id: string;
  /** Rótulo corto en mayúsculas sobre el título. También se usa en el índice «En esta página». */
  readonly etiqueta: string;
  /** Título H2 de la sección. */
  readonly titulo: string;
  readonly introduccion?: string;
  /** Aclaración corta al pie de la sección. */
  readonly nota?: string;
  /** Enlace al pie de la sección (interno o externo). */
  readonly enlace?: Enlace;
  /** Párrafos adicionales (en «texto» y «perfil» son el cuerpo principal). */
  readonly parrafos?: Lista<string>;
}

/** Lista de puntos. Los ítems pueden ser texto o { titulo, texto }. */
export interface SeccionLista extends SeccionBase {
  readonly tipo: 'lista';
  readonly items: Lista<string | BloqueTitulado>;
  /** incluye: marcas de verificación · excluye: tachas · alerta: avisos. Sin variante: numerada. */
  readonly variante?: 'incluye' | 'excluye' | 'alerta';
  /** Ejemplo de respuesta clara con su fuente. */
  readonly ejemplo?: EjemploRespuesta;
}

/** Texto corrido, con destacado y cifras opcionales. */
export interface SeccionTexto extends SeccionBase {
  readonly tipo: 'texto';
  readonly parrafos: Lista<string>;
  readonly destacado?: BloqueTitulado;
  readonly cifras?: Lista<Cifra>;
}

export interface SeccionTarjetas extends SeccionBase {
  readonly tipo: 'tarjetas';
  readonly columnas?: 2 | 3 | 4;
  readonly items: Lista<ItemTarjeta>;
}

export interface SeccionPasos extends SeccionBase {
  readonly tipo: 'pasos';
  readonly items: Lista<Paso>;
  /** Medios de pago (se muestran como fichas). */
  readonly medios?: Lista<string>;
}

/** Planes y precios: siempre desde PLANES de sitio.ts (PlanesPrecios). */
export interface SeccionPlanes extends SeccionBase {
  readonly tipo: 'planes';
  /** true: resumen de 4 puntos por plan · false: versión completa con «no incluye» e id="plan-<id>". */
  readonly compacto?: boolean;
  /** Plan que se marca como recomendado para el público de la página. */
  readonly recomendado?: IdPlan;
  /** Informativo: la plantilla calcula lo mismo desde PLANES. */
  readonly items?: Lista<ResumenPlan>;
  /** Si existe, se muestra la franja del Plan Emprendedor. */
  readonly planEntrada?: { readonly nombre: string; readonly precio: string; readonly descripcion: string };
}

/** Dos columnas: lo que incluye (o puede hacer) frente a lo que no. */
export interface SeccionComparacion extends SeccionBase {
  readonly tipo: 'comparacion';
  readonly incluye: Lista<string>;
  readonly noIncluye: Lista<string>;
  /** Rótulos de cada columna. Por defecto «Qué incluye» y «Qué no incluye». */
  readonly etiquetaIncluye?: string;
  readonly etiquetaNoIncluye?: string;
  readonly aclaraciones?: Lista<BloqueTitulado>;
}

/** Tabla de datos. En celular cada fila se vuelve una tarjeta (sin desbordar la página). */
export interface SeccionTabla extends SeccionBase {
  readonly tipo: 'tabla';
  readonly columnas: Lista<string>;
  /** Cada fila tiene una celda por columna. La primera celda es el encabezado de la fila. */
  readonly filas: Lista<Lista<string>>;
}

/** Conversación de ejemplo en un teléfono, con puntos y aclaraciones. */
export interface SeccionConversacion extends SeccionBase {
  readonly tipo: 'conversacion';
  readonly conversacion: Conversacion;
  readonly puntos?: Lista<string>;
  readonly aclaraciones?: Lista<BloqueTitulado>;
  /** Fecha de verificación de la información de terceros (Meta). */
  readonly verificado?: string;
}

/** Galería de casos de CASOS (sitio.ts). */
export interface SeccionCasos extends SeccionBase {
  readonly tipo: 'casos';
  /** Nombres exactos de CASOS[].cliente, en el orden en que se muestran. */
  readonly clientes?: Lista<string>;
  /** Número máximo de casos (incluido el destacado). */
  readonly limite?: number;
  readonly cifras?: Lista<Cifra>;
  readonly aval?: AvalSeccion;
}

/** Casos completos de /proyectos/: contexto, qué se hizo y logros. */
export interface SeccionCasosDetalle extends SeccionBase {
  readonly tipo: 'casos-detalle';
  readonly rotulos: { readonly contexto: string; readonly queSeHizo: string; readonly logros: string; readonly enlace: string };
  readonly items: Lista<ProyectoDetalle>;
}

/** Citas textuales de fuentes oficiales, con traducción y original. */
export interface SeccionCitas extends SeccionBase {
  readonly tipo: 'citas';
  readonly items: Lista<Cita>;
}

export interface SeccionAval extends SeccionBase {
  readonly tipo: 'aval';
  readonly aval: AvalSeccion;
}

/** Señales de confianza (componente Insignias, datos de sitio.ts). */
export interface SeccionInsignias extends SeccionBase {
  readonly tipo: 'insignias';
}

export interface SeccionPerfil extends SeccionBase {
  readonly tipo: 'perfil';
  readonly persona: Persona;
  readonly parrafos: Lista<string>;
  readonly cifras?: Lista<Cifra>;
}

export interface SeccionGuias extends SeccionBase {
  readonly tipo: 'guias';
  readonly items: Lista<ResumenGuia>;
}

export interface SeccionContacto extends SeccionBase {
  readonly tipo: 'contacto';
  readonly canales: Lista<CanalContacto>;
  readonly horario?: string;
  readonly respuestaHumana?: string;
  readonly redes?: Readonly<Record<string, string>>;
}

/** Formulario de contacto (isla Formulario.tsx). La sección siempre lleva id="formulario". */
export interface SeccionFormulario extends SeccionBase {
  readonly tipo: 'formulario';
  readonly enlacePrivacidad?: Enlace;
  /** Plan preseleccionado si la URL no trae ?plan=. */
  readonly planInicial?: IdPlan | 'emprendedor' | 'no-se';
}

export type Seccion =
  | SeccionLista
  | SeccionTexto
  | SeccionTarjetas
  | SeccionPasos
  | SeccionPlanes
  | SeccionComparacion
  | SeccionTabla
  | SeccionConversacion
  | SeccionCasos
  | SeccionCasosDetalle
  | SeccionCitas
  | SeccionAval
  | SeccionInsignias
  | SeccionPerfil
  | SeccionGuias
  | SeccionContacto
  | SeccionFormulario;

export type TipoSeccion = Seccion['tipo'];

// ── Módulo de página ─────────────────────────────────────────────────────────
export interface HeroPagina {
  readonly etiqueta: string;
  /** H1 de la página (el único). */
  readonly titulo: string;
  readonly subtitulo: string;
  readonly ctaPrincipal?: Enlace;
  readonly ctaSecundario?: Enlace;
  /** 2 o 3 datos cortos bajo los botones (en celular se ocultan: repiten el aval de más abajo). */
  readonly puntos?: Lista<string>;
  /**
   * Precio «desde» visible en la primera pantalla, calculado desde sitio.ts (ej. «Desde $1.200.000»).
   * HeroPagina agrega «IVA incluido» al lado.
   */
  readonly precio?: string;
}

export interface CtaPagina {
  readonly titulo: string;
  readonly texto: string;
  readonly ctaPrincipal: Enlace;
  /** Mensaje prellenado de WhatsApp (BandaCta arma el enlace). */
  readonly ctaWhatsApp?: string;
  readonly enlaceWhatsApp?: string;
}

/** Datos para servicio() de @/lib/schema. */
export interface ServicioSchema {
  readonly nombre: string;
  readonly tipo: string;
  readonly descripcion: string;
  readonly precioDesde?: number;
  readonly audiencia?: string;
}

export interface OfertaSchema {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly precioDesde: number | null;
  /** Cuota mensual si paga en 12 cuotas (o mensualidad fija del Plan Emprendedor). */
  readonly cuotaDesde: number | null;
}

export interface ModuloPagina {
  /** Ruta canónica con barra final. */
  readonly ruta: string;
  readonly seo: {
    /** 50-60 caracteres con « | VRS Digital» (Seo.astro la agrega salvo en /). */
    readonly titulo: string;
    readonly descripcion: string;
    readonly palabraClave?: string;
    readonly secundarias?: Lista<string>;
  };
  /** Migas visibles y del JSON-LD (la última es la página actual). */
  readonly migas: Lista<Miga>;
  readonly hero: HeroPagina;
  /** Respuesta directa de 2 a 4 frases (bloque AEO bajo el hero). */
  readonly respuestaDirecta: string;
  /** Fecha de verificación de datos de terceros, visible bajo la respuesta directa. */
  readonly verificado?: string;
  readonly secciones: Lista<Seccion>;
  readonly preguntas?: Lista<Pregunta>;
  readonly cta?: CtaPagina;
  readonly enlacesInternos?: Lista<Enlace>;
  readonly fuentes?: Lista<Fuente>;
  readonly servicio?: ServicioSchema;
  /** Ofertas para JSON-LD (solo /precios/). */
  readonly ofertas?: Lista<OfertaSchema>;
  /** AAAA-MM-DD */
  readonly actualizado?: string;
  /** Borrador: se muestra el aviso y la página no se indexa. */
  readonly borrador?: boolean;
  readonly avisoBorrador?: string;
  readonly vigencia?: { readonly desde: string; readonly version: string };
}

// ── Opciones de presentación (las da cada página, no el contenido) ──────────
export type FondoSeccion = 'base' | 'bajo' | 'brillo';

export interface OpcionesSeccion {
  /** Superficie: base (#131315), bajo (surface-low) o brillo (base con luz de marca). Por defecto alterna. */
  readonly fondo?: FondoSeccion;
  /** Fragmento exacto del título que se pinta con el degradado de la marca. */
  readonly resaltado?: string;
  /** dividido: título fijo a la izquierda y contenido a la derecha · apilado: uno debajo del otro. */
  readonly disposicion?: 'dividido' | 'apilado';
  /** texto: el primer párrafo se ilumina palabra por palabra al desplazarse. */
  readonly iluminar?: boolean;
  /** texto: muestra el retrato del fundador junto al texto. */
  readonly retrato?: boolean;
  /** planes: oculta (true) o fuerza (false) la franja del Plan Emprendedor. */
  readonly sinEmprendedor?: boolean;
  /** tarjetas: desplaza la columna central en computador (3 columnas). */
  readonly escalonado?: boolean;
  /**
   * Celular: el cuerpo de la sección (todo menos etiqueta, título e introducción) se pliega en un
   * <details> con este texto en el botón. Desde 1024 px se ve abierto (Plegable.astro). Para
   * secciones de consulta que repiten o amplían lo que ya dice la página.
   */
  readonly plegar?: string;
}
