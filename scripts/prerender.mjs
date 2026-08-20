#!/usr/bin/env node
/**
 * Turns the client build into three prerendered static pages — `/`, `/it/`,
 * `/be/` — so every crawler and shared link gets real HTML in the right
 * language instead of an empty `<div id="root">`.
 *
 * Runs after `vite build`, and expects the SSR bundle produced by
 * `vite build --ssr src/entry-server.tsx --outDir dist/server`.
 *
 * Per locale it rewrites the head that `index.html` shipped: `<html lang>`,
 * title, description, canonical, og:url, og:locale, and the hreflang set that
 * cross-links the three files.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const SERVER_BUNDLE = join(DIST, 'server', 'entry-server.js');

const { render } = await import(SERVER_BUNDLE);
const locales = await Promise.all(
  ['en', 'it', 'be'].map(async (lng) => ({
    lng,
    strings: JSON.parse(
      await readFile(join(ROOT, 'src', 'i18n', 'locales', `${lng}.json`), 'utf8'),
    ),
  })),
);

const template = await readFile(join(DIST, 'index.html'), 'utf8');

// The origin is owned by src/lib/site.ts and already substituted into the built
// canonical by the seo() Vite plugin — read it back rather than duplicate it.
const canonical = template.match(/<link rel="canonical" href="([^"]+)"/);
if (!canonical) throw new Error('prerender: dist/index.html has no canonical');
const ORIGIN = canonical[1].replace(/\/$/, '');

const OG_LOCALES = { en: 'en_GB', it: 'it_IT', be: 'be_BY' };
const pathFor = (lng) => (lng === 'en' ? '/' : `/${lng}/`);
const urlFor = (lng) => `${ORIGIN}${pathFor(lng)}`;

/** Cross-links every locale, with the root as the unmatched-language default. */
const hreflangTags = () =>
  [
    ...locales.map(
      ({ lng }) =>
        `    <link rel="alternate" hreflang="${lng}" href="${urlFor(lng)}" />`,
    ),
    `    <link rel="alternate" hreflang="x-default" href="${urlFor('en')}" />`,
  ].join('\n');

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const replaceOnce = (html, pattern, replacement, label) => {
  const matches = html.match(pattern);
  if (!matches) throw new Error(`prerender: no match for ${label}`);
  return html.replace(pattern, replacement);
};

for (const { lng, strings } of locales) {
  const title = strings.meta.title;
  const description = escapeAttr(strings.meta.description);
  const url = urlFor(lng);

  let html = template;

  html = replaceOnce(html, /<html lang="[^"]*">/, `<html lang="${lng}">`, 'html lang');
  html = replaceOnce(
    html,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeAttr(title)}</title>`,
    'title',
  );
  html = replaceOnce(
    html,
    /(<meta\s+name="description"\s+content=")[\s\S]*?(")/,
    `$1${description}$2`,
    'meta description',
  );
  html = replaceOnce(
    html,
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${url}$2`,
    'canonical',
  );
  html = replaceOnce(
    html,
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${url}$2`,
    'og:url',
  );
  html = replaceOnce(
    html,
    /(<meta property="og:locale" content=")[^"]*(")/,
    `$1${OG_LOCALES[lng]}$2`,
    'og:locale',
  );
  html = replaceOnce(
    html,
    /(<meta\s+property="og:title"\s+content=")[\s\S]*?(")/,
    `$1${escapeAttr(title)}$2`,
    'og:title',
  );
  html = replaceOnce(
    html,
    /(<meta\s+property="og:description"\s+content=")[\s\S]*?(")/,
    `$1${description}$2`,
    'og:description',
  );
  html = replaceOnce(
    html,
    /(<meta\s+name="twitter:title"\s+content=")[\s\S]*?(")/,
    `$1${escapeAttr(title)}$2`,
    'twitter:title',
  );
  html = replaceOnce(
    html,
    /(<meta\s+name="twitter:description"\s+content=")[\s\S]*?(")/,
    `$1${description}$2`,
    'twitter:description',
  );
  html = replaceOnce(
    html,
    /<!-- HREFLANG -->/,
    hreflangTags().trimStart(),
    'hreflang placeholder',
  );

  const body = await render(lng);
  html = replaceOnce(
    html,
    /<div id="root"><\/div>/,
    `<div id="root">${body}</div>`,
    'root container',
  );

  const outPath = join(DIST, lng === 'en' ? 'index.html' : join(lng, 'index.html'));
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html);

  const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
  console.log(`${pathFor(lng).padEnd(6)} ${outPath.replace(`${ROOT}/`, '')}  ${kb}KB`);
}

// The SSR bundle is a build artefact, not something to deploy.
await rm(join(DIST, 'server'), { recursive: true, force: true });
