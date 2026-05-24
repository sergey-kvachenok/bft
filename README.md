# Official. Unofficial. Belarus.

Mobile-first PWA for the Belarus Free Theatre exhibition at La Biennale di Venezia. The site is a single-page QR-target landing page with EN / IT / BE translations.

## Stack

| Layer | Choice |
|---|---|
| Build | Vite 6 + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config) |
| PWA | vite-plugin-pwa v1 (autoUpdate) |
| Animation | Motion (formerly Framer Motion) |
| i18n | react-i18next |
| Hosting | Vercel (target — not yet deployed) |

## Local development

```bash
npm install
npm run dev          # → http://localhost:5173
npm run build        # production build to ./dist
npm run preview      # serve the built bundle
npm run typecheck    # TypeScript only
```

## Editing content

There is no CMS. All copy lives in JSON locale files; structure (which works appear, in what order) lives in TypeScript constants. Edit, commit, redeploy.

| What | Where |
|---|---|
| All visible text (EN/IT/BE) | `src/i18n/locales/{en,it,be}.json` |
| Order and IDs of key works | `src/lib/constants.ts` (`WORK_IDS`) |
| Section anchors / nav order | `src/lib/constants.ts` (`SECTION_IDS`) |
| Outbound URLs (press kit, contact, etc.) | `src/lib/constants.ts` (`EXTERNAL_LINKS`) |
| Visual treatment of each work | `src/components/ui/WorkVisual.tsx` |
| Design tokens (colors, fonts, scale) | `src/styles.css` (`@theme` block) |
| Page meta / SEO / OG tags | `index.html` |

## Replacing the visual placeholders

Today every "Key Work" tile is a CSS gradient with the work's title overlaid (clearly intentional, not a broken image). When you have real photography:

1. Drop optimized images into `public/works/<id>.webp` (e.g. `minskTimeline.webp`). Keep them under ~200 KB each — use [Squoosh](https://squoosh.app) at quality 75–80.
2. In `src/components/ui/WorkVisual.tsx`, swap the gradient `<div>` for an `<img>` (loading="lazy", a meaningful `alt`).

The same pattern applies to the OG image — replace `public/og-image.jpg` (1200×630) and the press-kit assets under `public/press/`.

## PWA icons

`public/icon.svg` is the source. Most modern browsers accept SVG manifest icons, **but iOS still wants a rasterized PNG for homescreen install**. Before launch:

```bash
# One option — install pwa-asset-generator and regenerate
npx pwa-asset-generator public/icon.svg public --background "#0a0a0a"
```

Then update `vite.config.ts`'s `manifest.icons` to point at the generated `pwa-192-192.png` / `pwa-512-512.png`.

## Adding a new translation

1. Copy `src/i18n/locales/en.json` to `xx.json` and translate.
2. Register the locale in `src/i18n/config.ts` (`SUPPORTED_LANGUAGES` and `LANGUAGE_LABELS`).
3. Import the file in `config.ts` and add it to the `resources` map.

## Deployment (Vercel — pending approval)

```bash
# One-time
npm i -g vercel
vercel login

# Deploy preview
vercel

# Promote to production
vercel --prod
```

After the first production deploy, point the QR code at the Vercel URL (or your custom domain). **Buy a custom domain before printing QRs** so the URL never has to change.

## Outstanding before launch

- [ ] Replace placeholder copy in all three locale files (curatorial text, work descriptions, dates, address, hours).
- [ ] Provide real photography for the six key works and OG image.
- [ ] Generate raster PNG icons (see above).
- [ ] Drop the real press kit PDF + images zip into `public/press/`.
- [ ] Confirm exhibition dates, pavilion address, and accessibility info.
- [ ] Decide on analytics (Plausible recommended) and add the snippet.
- [ ] Buy QR-target domain and configure on Vercel.
