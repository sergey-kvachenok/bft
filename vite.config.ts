import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { SITE, EXHIBITION } from './src/lib/site';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  pathForLocale,
  type Language,
} from './src/lib/locale';

const SITE_URL_TOKEN = '%SITE_URL%';

const robotsTxt = () =>
  [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE.url}/sitemap.xml`,
    '',
  ].join('\n');

const absolute = (lng: Language) => `${SITE.url}${pathForLocale(lng)}`;

/**
 * One entry per prerendered locale, each declaring the full alternate set —
 * the form Google asks for when the same page exists in several languages.
 */
const sitemapXml = () => {
  const alternates = SUPPORTED_LANGUAGES.map(
    (lng) =>
      `      <xhtml:link rel="alternate" hreflang="${lng}" href="${absolute(lng)}"/>`,
  );

  const entries = SUPPORTED_LANGUAGES.flatMap((lng) => [
    '  <url>',
    `    <loc>${absolute(lng)}</loc>`,
    ...alternates,
    `      <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(DEFAULT_LANGUAGE)}"/>`,
    `    <lastmod>${EXHIBITION.startDate}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    `    <priority>${lng === DEFAULT_LANGUAGE ? '1.0' : '0.8'}</priority>`,
    '  </url>',
  ]);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
};

/**
 * Keeps the deployed origin in one place (`src/lib/site.ts`): substitutes
 * `%SITE_URL%` in index.html — canonical, og:url, JSON-LD @ids — and emits
 * robots.txt and sitemap.xml so they can never drift from it.
 */
function seo(): Plugin {
  let isSsr = false;

  return {
    name: 'bft-seo',
    configResolved(config) {
      isSsr = Boolean(config.build.ssr);
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.split(SITE_URL_TOKEN).join(SITE.url),
    },
    generateBundle() {
      if (isSsr) return;
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robotsTxt(),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: sitemapXml(),
      });
    },
    configureServer(server) {
      const serve = (path: string, type: string, body: () => string) =>
        server.middlewares.use(path, (_req, res) => {
          res.setHeader('Content-Type', type);
          res.end(body());
        });

      serve('/robots.txt', 'text/plain', robotsTxt);
      serve('/sitemap.xml', 'application/xml', sitemapXml);
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), seo()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    // Vendor splitting is a client-bundle concern; in the SSR build these are
    // externalised, and naming them in manualChunks is an error.
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              motion: ['motion'],
              i18n: ['i18next', 'react-i18next'],
            },
          },
        },
  },
}));
