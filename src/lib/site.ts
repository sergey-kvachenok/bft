/**
 * Single source of truth for the deployed origin and the exhibition facts that
 * appear in metadata. `vite.config.ts` substitutes `%SITE_URL%` in index.html
 * — canonical, og:url, JSON-LD @ids — and emits robots.txt / sitemap.xml from
 * it, so this is the only place the domain is written.
 *
 * `url` is the final production domain, set ahead of the DNS cutover on
 * purpose: metadata should name the domain the site will live on, not the
 * deployment it happens to be served from.
 */
export const SITE = {
  url: 'https://unofficial-official.com',
  name: 'Official. Unofficial. Belarus.',
  ogImage: '/og-image.jpg',
} as const;

/** Venue and run dates, mirrored into the JSON-LD ExhibitionEvent. */
export const EXHIBITION = {
  startDate: '2026-05-09',
  endDate: '2026-11-22',
  venue: 'Chiesa di San Giovanni Evangelista',
  locality: 'Venezia',
  region: 'Veneto',
  postalCode: '30125',
  street: 'San Polo 2454',
  country: 'IT',
} as const;
