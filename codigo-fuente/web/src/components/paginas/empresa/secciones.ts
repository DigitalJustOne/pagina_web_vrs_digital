// ─────────────────────────────────────────────────────────────────────────────
//  Ayudas para reemplazar una sección de la plantilla (slot «seccion-<id>») sin romper el
//  ritmo de la página: el mismo fondo alterno y el mismo número de orden que PlantillaPagina
//  le daría a esa sección (fondo base en los índices pares y bajo en los impares, si la
//  página empieza en «base»).
// ─────────────────────────────────────────────────────────────────────────────
import type { ModuloPagina, Seccion } from '@/data/contenido/tipos';

export interface Posicion<T extends Seccion> {
  s: T;
  fondo: 'base' | 'bajo';
  numero: number;
}

/** Sección `id` del módulo, de tipo `tipo`, con su fondo y su número de orden. */
export function seccionDe<K extends Seccion['tipo']>(
  contenido: Pick<ModuloPagina, 'secciones' | 'ruta'>,
  id: string,
  tipo: K,
  fondoInicial: 'base' | 'bajo' = 'base',
): Posicion<Extract<Seccion, { tipo: K }>> {
  const secciones: readonly Seccion[] = contenido.secciones;
  const i = secciones.findIndex((s) => s.id === id);
  const s = secciones[i];
  if (!s || s.tipo !== tipo) {
    throw new Error(`[${contenido.ruta}] No existe la sección «${id}» de tipo «${tipo}» en el módulo de contenido.`);
  }
  const otro = fondoInicial === 'base' ? 'bajo' : 'base';
  return { s: s as Extract<Seccion, { tipo: K }>, fondo: i % 2 === 0 ? fondoInicial : otro, numero: i + 1 };
}
