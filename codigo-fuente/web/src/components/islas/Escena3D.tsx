/**
 * Escena 3D del inicio como isla React (opcional).
 *
 * En las páginas Astro use HeroVisual.astro: pinta el póster primero y monta la
 * escena con un cargador propio, sin descargar React. Esta isla existe para
 * contextos que ya son React:
 *
 *   import Escena3D from '@/components/islas/Escena3D';
 *   <div class="relative aspect-square">
 *     <Escena3D client:idle className="absolute inset-0" />
 *   </div>
 *
 * - No descarga three.js si hay movimiento reducido, no hay WebGL 2, el equipo es
 *   de gama baja o la persona activó el ahorro de datos (Escena3DSoporte.ts).
 * - El lienzo aparece con una transición de opacidad cuando el primer cuadro está listo.
 * - Al desmontar se cancela la carga o se destruye todo (geometrías, materiales, contexto).
 */
import { useEffect, useRef, useState } from 'react';
import { puedeMontarEscena } from './Escena3DSoporte';
import type { MetricasEscena } from './Escena3DMotor';

interface Props {
  className?: string;
  /** Se llama cuando el primer cuadro está pintado, con las métricas de montaje. */
  alEstarLista?: (metricas: MetricasEscena) => void;
  /** Solo pruebas: permite WebGL por software y equipos de gama baja. */
  forzar?: boolean;
}

export default function Escena3D({ className, alEstarLista, forzar = false }: Props) {
  const anfitrion = useRef<HTMLDivElement>(null);
  const [lista, setLista] = useState(false);

  useEffect(() => {
    const nodo = anfitrion.current;
    if (!nodo || !puedeMontarEscena({ forzar })) return;
    const control = new AbortController();
    import('./Escena3DMotor')
      .then(({ montarEscena }) => montarEscena(nodo, { forzar, senal: control.signal, alPerderContexto: () => setLista(false) }))
      .then((escena) => {
        if (control.signal.aborted) return escena.destruir();
        setLista(true);
        alEstarLista?.(escena.metricas);
      })
      .catch(() => {
        /* Sin escena: queda lo que haya detrás (póster). */
      });
    return () => control.abort();
    // Se monta una sola vez por instancia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={anfitrion}
      aria-hidden="true"
      className={className}
      style={{ opacity: lista ? 1 : 0, transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)', pointerEvents: 'none' }}
    />
  );
}
