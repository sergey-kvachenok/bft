# BFT Biennale — Knowledge Map

> **Project**: Official. Unofficial. Belarus. — Belarus Free Theatre at La Biennale di Venezia.
> **What**: Mobile-first QR landing page / companion guide. Prerendered static HTML, one file per locale, hydrated by React. Not a PWA.
> **Stack**: React 19 + Vite 6 + TypeScript 5 + Tailwind 4 + motion + i18next.
> **Working directory**: repo root.

This map exists so any future agent can get oriented in minutes. Read `architecture.md` for **what the code is**; read `conventions.md` for **how to write code in it**.

---

## Where to look

| Task involves...                                          | Read                                          |
| --------------------------------------------------------- | --------------------------------------------- |
| Adding/removing photos, changing the gallery, asset paths | `architecture.md` → Data + `assets` section   |
| Tweaking the CCTV slider, grid, or popup                  | `architecture.md` → Components                |
| Participants, Works, or Press content                     | `architecture.md` → The other data lists      |
| New translation, locale fix, alt-text                     | `architecture.md` → i18n                      |
| Anything that must survive prerender/hydration            | `architecture.md` → Prerendering and hydration|
| URLs, language switching, `hreflang`                      | `architecture.md` → Locales and routing       |
| Metadata, canonical, sitemap, share image                 | `architecture.md` → SEO                       |
| Colors, buttons, the `.btn-key` footguns                  | `architecture.md` → Styling notes             |
| Writing or refactoring any code at all                    | `conventions.md` (DRY, comments, a11y, etc.)  |
| Component patterns, Tailwind reuse, motion conventions    | `conventions.md` → React + Styling            |

---

## Entry points (read these files first)

- `src/App.tsx` — section composition (`SurveillanceBand`, `Header`, `Hero`, `CamGrid`, `About`, `Participants`, `Works`, `Press`, `Visit`, `Footer`).
- `src/lib/artworks.ts` — **single source of truth** for all CCTV photo data. Drives the hero slider and the grid.
- `src/lib/{participants,worksList,pressList}.ts` — the Participants, Works, and Press content.
- `src/lib/site.ts` — **the only place the deployed origin is written.** Flows into canonical, `og:*`, JSON-LD, `robots.txt`, `sitemap.xml`.
- `src/lib/locale.ts` — locale ↔ URL-path mapping. The URL decides the language.
- `src/lib/constants.ts` — section IDs, external + social links, assets, localStorage keys.
- `src/i18n/locales/{en,be,it}.json` — every user-facing string. No literal strings in components.
- `vite.config.ts` — the `seo()` plugin (`%SITE_URL%` substitution, `robots.txt`, `sitemap.xml`) and client-only `manualChunks`.
- `scripts/prerender.mjs` — writes the three per-locale HTML files. Runs last in `npm run build`.
- `scripts/optimize-images.mjs` — JPG→WebP pipeline. Run with `npm run optimize-images`.

---

## Hard rules (non-negotiable)

1. **DRY** — extract repeated literals, logic, and class strings into shared constants/helpers. Wait for the second occurrence to abstract; act on the third. See `conventions.md` → DRY for examples from this codebase.
2. **No duplicated photo display** — each photo appears in exactly one place (hero slider XOR grid). Controlled by `HERO_COUNT` in `artworks.ts`.
3. **Mobile-first** — every change is judged at narrow viewport + slow network first.
4. **Comments only when WHY is non-obvious** — never explain WHAT the code does. Never reference tasks/PRs/issues. See `conventions.md` → Comments.
5. **Every user-facing string lives in `i18n/locales/*.json`** — three locales: `en`, `be`, `it`. Adding a string means adding it to all three, `meta.*` included.
6. **The URL owns the language.** No `localStorage`, no browser-language detection. A locale is a prerendered file; switching is `pushState`, never a reload.
7. **Nothing may differ between prerender and first client render.** No `Date`, `window`, or `localStorage` read during render — guard it or move it into an effect, or hydration mismatches.
8. **The origin is written once**, in `src/lib/site.ts`. Never hardcode the domain anywhere else.

---

## Quick commands

```bash
npm run dev              # vite dev server (empty shell — createRoot, not hydrate)
npm run build            # tsc -b → vite build → SSR bundle → prerender. All four must pass.
npm run typecheck        # tsc -b --noEmit
npm run preview          # serve dist/ — the only way to see the prerendered output
npm run prerender        # re-run just the prerender step against an existing dist/
npm run og-image         # regenerate og-image.jpg + apple-touch-icon.png
npm run optimize-images  # regenerate WebPs from JPGs in public/images/artworks/
npm run qr               # regenerate the QR landing image
```

`npm run dev` cannot show you a hydration mismatch — the dev shell is empty, so there is nothing to hydrate. Use `npm run build && npm run preview` and watch the console.

## Last-known image footprint

- Source artworks: 55 photos at `public/images/artworks/<id>.webp` (1600w) + `<id>-thumb.webp` (400w).
- Plus `participants/` (7) and `works/` (18).
- Pre-optimization JPGs were 406MB total; current WebP set is ~13MB.
- Prerendered HTML is ~133–139KB per locale — the body markup is inlined, which is the point.

## Outstanding

- `SITE.url` points at `https://unofficial-official.com`, set before the DNS cutover. Until that domain is attached the canonical names a host that does not resolve.
- An Italian visitor landing on `/` gets English. See `architecture.md` → Locales and routing.
