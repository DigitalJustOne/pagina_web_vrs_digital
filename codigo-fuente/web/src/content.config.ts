// ─────────────────────────────────────────────────────────────────────────────
//  Colecciones de contenido (Astro Content Layer).
//
//  recursos: las guías de src/content/recursos/<slug>.md. El nombre del archivo es el
//  slug y la ruta pública es /recursos/<slug>/ (src/pages/recursos/[slug].astro).
//  El esquema refleja el frontmatter que ya usan las guías; si falta un campo obligatorio
//  o una fecha no es válida, `astro check` y `astro build` fallan con el nombre del campo.
//
//  src/lib/llms.ts lee los mismos archivos con import.meta.glob (llms.txt y llms-full.txt):
//  no hace falta registrarlos en otro lugar.
// ─────────────────────────────────────────────────────────────────────────────
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { rellenarMarcadores } from './lib/marcadores';

/** Texto del frontmatter: los marcadores ({{implementacion:esencial}}, {{pago}}…) toman el valor de sitio.ts. */
const texto = z.string().trim().min(1).transform(rellenarMarcadores);

const recursos = defineCollection({
  loader: glob({ base: './src/content/recursos', pattern: '**/*.md' }),
  schema: z.object({
    /** Título SEO (Seo.astro agrega « | VRS Digital»). */
    titulo: texto,
    /** H1 visible de la guía (pregunta principal). */
    h1: texto,
    /** Meta descripción (140-160 caracteres). */
    descripcion: texto,
    /** YAML convierte AAAA-MM-DD en fecha. */
    publicado: z.coerce.date(),
    actualizado: z.coerce.date(),
    autor: texto,
    palabraClave: texto,
    secundarias: z.array(texto).default([]),
    /** Respuesta directa (2 a 4 frases): bloque «En resumen» bajo el H1. */
    resumen: texto,
    preguntas: z.array(z.object({ pregunta: texto, respuesta: texto })).default([]),
    fuentes: z.array(z.object({ titulo: texto, url: z.url(), idioma: z.literal('en').optional() })).default([]),
    /** Opcional: true deja la guía fuera de la compilación (y de llms.txt, que ya lo respeta). */
    borrador: z.boolean().optional(),
  }),
});

export const collections = { recursos };
