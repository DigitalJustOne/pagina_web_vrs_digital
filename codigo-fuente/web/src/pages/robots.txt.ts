// ─────────────────────────────────────────────────────────────────────────────
//  /robots.txt generado al compilar. La dirección del sitemap sale de SITIO.url
//  (src/data/sitio.ts): al cambiar de dominio se actualiza sola.
//  No cree public/robots.txt: pisaría a este archivo.
//
//  Ojo con la regla de grupos (RFC 9309): un rastreador obedece SOLO el grupo
//  más específico que lo nombra. Por eso los rastreadores nombrados repiten
//  los mismos Disallow que el grupo general.
// ─────────────────────────────────────────────────────────────────────────────
import type { APIRoute } from 'astro';
import { SITIO } from '@/data/sitio';
import { RUTAS_PRIVADAS } from '@/data/rutas';

/** Buscadores y rastreadores de IA que queremos que lean y citen el sitio. */
const RASTREADORES = [
  // Buscadores
  'Googlebot',
  'Bingbot',
  'Applebot',
  'DuckDuckBot',
  // Permisos de uso para IA (tokens de control de Google y Apple)
  'Google-Extended',
  'Applebot-Extended',
  // OpenAI: entrenamiento, búsqueda de ChatGPT y visitas pedidas por personas
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Anthropic: entrenamiento, búsqueda y visitas pedidas por personas
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Common Crawl (base de muchos modelos abiertos)
  'CCBot',
] as const;

const bloqueos = RUTAS_PRIVADAS.map((r) => `Disallow: ${r}`).join('\n');
const base = SITIO.url.replace(/\/$/, '');

const cuerpo = `# robots.txt de ${SITIO.nombre}
# Todo el sitio es público, salvo las páginas internas de abajo.
# (Las páginas en borrador no se bloquean aquí: llevan noindex y no están en el sitemap.)

User-agent: *
Allow: /
${bloqueos}

# Buscadores y asistentes de IA: acceso explícito al contenido público.
${RASTREADORES.map((r) => `User-agent: ${r}`).join('\n')}
Allow: /
${bloqueos}

# Resumen del sitio para modelos de lenguaje (llmstxt.org)
# ${base}/llms.txt
# ${base}/llms-full.txt

Sitemap: ${base}/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(cuerpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
