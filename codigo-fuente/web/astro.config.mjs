// @ts-check
import { readFileSync, readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { SITIO } from './src/data/sitio.ts';
import { ACTUALIZADO, fueraDeIndices } from './src/data/rutas.ts';

// <lastmod> del sitemap: fecha `actualizado` del módulo de cada página (src/data/rutas.ts) y, en las
// guías, la de la portada de src/content/recursos/<slug>.md. Nunca la fecha de compilación.
const carpetaGuias = new URL('./src/content/recursos/', import.meta.url);
const fechas = { ...ACTUALIZADO };
for (const archivo of readdirSync(carpetaGuias).filter((a) => a.endsWith('.md'))) {
  const fecha = readFileSync(new URL(archivo, carpetaGuias), 'utf8').match(/^actualizado:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1];
  if (fecha) fechas[`/recursos/${archivo.slice(0, -3)}/`] = fecha;
}

// https://astro.build/config
export default defineConfig({
  site: SITIO.url,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    react(),
    sitemap({
      // Fuera del sitemap: rutas privadas y páginas en borrador (noindex). La lista vive en
      // src/data/rutas.ts, la misma que usan llms.txt y robots.txt.
      filter: (page) => !fueraDeIndices(new URL(page).pathname),
      changefreq: 'monthly',
      serialize(item) {
        const fecha = fechas[new URL(item.url).pathname];
        if (fecha) item.lastmod = fecha;
        return item;
      },
      i18n: { defaultLocale: 'es', locales: { es: 'es-CO' } },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // three.js (~550 KB) solo se descarga dentro del Worker de la escena 3D y nunca en la ruta
    // crítica; el aviso de "chunk grande" de Vite no aplica a ese archivo.
    build: { chunkSizeWarningLimit: 600 },
  },
});
