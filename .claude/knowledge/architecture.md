# Architecture

## What this app is

A single-page mobile-first site — a companion guide for visitors of the *Official. Unofficial. Belarus.* exhibition at the Venice Biennale. The visual concept is a CCTV surveillance feed: a treated photo slider in the hero, a horizontally-scrollable wall of "camera" tiles below, opening any tile into a full-screen viewer with prev/next navigation and swipe.

The QR code on physical posters at the Biennale points visitors here. Phone-first; tablet/desktop is a fallback layout.

It ships as **prerendered static HTML, one file per locale** (`/`, `/it/`, `/be/`), which React then hydrates. It is *not* a PWA — the service worker and `vite-plugin-pwa` were removed; there is no offline mode and no install prompt.

## Directory map

```
src/
  App.tsx                       — section composition (one section per imported component)
  main.tsx                      — hydrateRoot on prerendered HTML, createRoot in dev;
                                  also mounts <Analytics> (see Analytics)
  entry-server.tsx              — build-time render entry; must mirror main.tsx's tree
  styles.css                    — Tailwind theme tokens + CCTV CSS (scanlines, grain, .btn-key)
  components/
    Header.tsx, Footer.tsx, SurveillanceBand.tsx, LanguageSwitcher.tsx
    CamGrid.tsx                 — multi-cam tile wall (47 tiles)
    CamFeedSlider.tsx           — auto-cycling hero feed (8 photos)
    CamPopup.tsx                — full-screen viewer: buttons, keyboard, swipe
    sections/
      Hero.tsx, About.tsx, Participants.tsx, Works.tsx, Press.tsx, Faq.tsx, Visit.tsx
    ui/
      CamFrame.tsx              — chrome around any "monitor view" (cam id, timestamp, REC)
      DossierCard.tsx           — photo-tile + title card, shared by Participants and Works
                                  (photo is `{ src, alt }` — no credit overlay, removed by request)
      Section.tsx, SectionHeader.tsx, CtaButton.tsx, SignalBars.tsx, InstagramIcon.tsx
  lib/
    artworks.ts                 — single source of truth for the CCTV photos
    participants.ts             — the eight participants (bios live in i18n)
    worksList.ts                — the eighteen catalogued works
    pressList.ts                — press coverage (summaries live in i18n)
    site.ts                     — SITE.url + EXHIBITION facts. The ONLY place the origin is written
    locale.ts                   — locale <-> URL-path mapping, SUPPORTED_LANGUAGES
    constants.ts                — SECTION_IDS, EXTERNAL_LINKS, SOCIAL_LINKS, ASSETS, STORAGE_KEYS
    ui.ts                       — shared className constants (CTA_*, LINK_*, MONO_LABEL)
    cn.ts                       — minimal className combiner (no clsx dep)
    motion.ts                   — shared easing + whileInView variants
    format.ts                   — pad(), dotDate()
    keys.ts                     — KeyboardEvent.key constants
    useSurveillanceClock.ts     — ticking timestamp, SSR-safe
    useDocumentMeta.ts          — retitles the document on language switch
    useLocaleRouting.ts         — pushState language switching + popstate sync
    useHashFocus.ts             — moves focus to the hash target
  i18n/
    config.ts                   — i18next init; initial language comes from the URL path
    locales/{en,be,it}.json     — every user-facing string
public/
  images/{artworks,participants,works}/  — optimized WebPs
  og-image.jpg, apple-touch-icon.png, icon.svg, press-release.docx
scripts/
  optimize-images.mjs           — JPG/PNG→WebP pipeline (sharp)
  generate-og-image.mjs         — renders og-image.jpg + apple-touch-icon.png
  prerender.mjs                 — writes the three per-locale HTML files
  generate-qr.mjs               — QR code generator
.claude/knowledge/              — this map
```

## Component tree

```
<App>
  <SurveillanceBand>            — top status bar: signal bars, "REC LIVE", CAM 01–55, timestamp
  <Header>                      — nav + LanguageSwitcher
  <main>
    <Hero>                      — full-bleed CCTV monitor with overlaid title + CTAs
      <CamFeedSlider>           — cycles HERO_ARTWORKS, one img mounted at a time
    <CamGrid>                   — 2 rows of 100px tiles using GRID_ARTWORKS
      <CamPopup>                — overlay, mounted alongside grid; opens at active index
    <About>
    <Participants>              — eight DossierCards; bios from i18n
    <Works>                     — eighteen DossierCards + its own CamPopup
    <Press>                     — six press items; summaries from i18n
    <Faq>                       — ten details/summary rows; all copy from i18n
    <Visit>
  <Footer>                      — site links, press release, Instagram keys
```

Both `CamFeedSlider` and `CamGrid` wrap their images in `<CamFrame>` chrome where needed. `CamPopup` uses `<CamFrame>` too — the popup is meant to feel like the same camera scaled up.

## Single source of truth: `lib/artworks.ts`

All photo data lives in `IDS` — a `readonly string[]` of image basenames (no `.webp` suffix). Two exported lists are derived:

- `HERO_ARTWORKS` — first `HERO_COUNT` (currently 8) photos → hero slider.
- `GRID_ARTWORKS` — remaining 47 → grid tiles + popup.

**Each photo appears in exactly one of the two lists.** No duplication, ever. Re-tune the split by changing `HERO_COUNT`; both lists re-derive automatically.

Each entry resolves to:

```ts
interface Artwork {
  src: string;       // /images/artworks/<id>.webp        (1600w — slider, popup)
  thumbSrc: string;  // /images/artworks/<id>-thumb.webp  (400w  — grid tiles)
  altKey: string;    // i18n key, currently always 'feeds.artwork'
  camId: string;     // 'CAM 01', 'CAM 02', ... uniquely numbered across both lists
  location: string;  // 'GALLERY' (placeholder — was per-room in the original 6-photo version)
}
```

Helpers extracted in `artworks.ts`:

- `ARTWORK_DIR`, `ARTWORK_ALT_KEY`, `ARTWORK_LOCATION`, `CAM_PREFIX` — string literals, used in >1 place.
- `pad(n, width)` — `String(n).padStart(width, '0')`.
- `camLabel(n)` — `${CAM_PREFIX} ${pad(n, 2)}`. Used by per-artwork `camId` and `CAM_COUNT_LABEL`.

Also exported: `DEFAULT_CCTV_FILTER`, `CAM_COUNT_LABEL`, `CAM_COUNT_TOTAL`, `FEED_CYCLE_MS`.

## State and persistence

- **Hero slider index** — local `useState` in `CamFeedSlider`. Resets each page load. Cycles every `FEED_CYCLE_MS` (5500ms).
- **Popup active index** — local `useState` in `CamGrid`, passed to `CamPopup` as `index: number | null`.
- **Last-viewed tile** — persisted to `localStorage` under `STORAGE_KEYS.lastViewedArtwork` (= `'bft.lastViewedArtwork'`). Written when popup opens or navigates. Read on mount; out-of-bounds values are ignored. The matching grid tile gets a red ring + `LAST` badge and is auto-scrolled into view on mount.
- **i18n language** — comes from the URL path, not storage. See *Locales and routing* below.

No other persistent state. No global store, no context, no Redux — the data is small and static.

## CamPopup navigation

Opened from `CamGrid` with an integer `index`. Supports:

- **Mouse/touch** — `‹` and `›` buttons on either side of the modal (44px+ touch targets).
- **Keyboard** — `ArrowLeft` / `ArrowRight` for prev/next, `Escape` to close, Tab trapped inside.
- **Swipe** — horizontal travel of `SWIPE_THRESHOLD_PX` (40) or more turns the page. Shorter travel stays a tap so button `onClick` still wins, and vertical-dominant travel is ignored (it's a scroll or a pinch). The handlers sit on the image wrapper only — the nav and close buttons are *siblings* of it, which is what keeps a gesture from ever being read as a button press.
- **Backdrop click** — closes.
- **Wrap-around** — `step(i, delta, total) = (i + delta + total) % total`. From last `→` goes to first; from first `←` goes to last.

`CamPopup` is "dumb" with respect to what it shows — it takes `images: readonly PopupImage[]` (`{src, alt, camId, location}`, with `alt` already resolved, *not* an i18n key) plus `index: number | null`, and emits `onIndexChange`. Both `CamGrid` and `Works` own an instance.

It passes `reserveTopRight` to `CamFrame` so the close button never lands on top of the frame's REC timer — both otherwise occupy the panel's top-right corner.

## Build pipeline

`npm run build` is four stages, and each depends on the one before it:

```
tsc -b
vite build                                                   → dist/ client bundle + index.html
vite build --ssr src/entry-server.tsx --outDir dist/server    → the render function
node scripts/prerender.mjs                                    → dist/{,it/,be/}index.html
```

`prerender.mjs` reads `dist/index.html` as a template, calls `render(locale)` once per locale, and rewrites the head per language. It deletes `dist/server` afterwards — that bundle is a build artefact, never deployed.

Two build-config details that are easy to trip over:

- `manualChunks` is applied **only to the client build**. In the SSR build those deps are externalised, and naming them is a hard error.
- The `seo()` plugin skips emitting `robots.txt` / `sitemap.xml` when `config.build.ssr` is set, or they land in `dist/server`.

## Prerendering and hydration

`main.tsx` calls `hydrateRoot` when `#root` already has children and `createRoot` when it doesn't, so the same entry serves the prerendered build and the empty dev shell.

`entry-server.tsx` must render the **same tree** as `main.tsx`. Anything that differs between build time and the browser is a hydration mismatch, which is why:

- **`useSurveillanceClock` returns pre-formatted strings and starts from a fixed-width placeholder** (`0000-00-00 00:00:00`). A real `new Date()` during prerender would bake the build time into the HTML, then disagree with the client on hydration. The real clock starts in an effect on mount. Consumers never touch `Date`.
- **Scroll-reveal keeps its `opacity: 0` start state in the prerendered markup.** Making it visible server-side would mismatch. Text is in the DOM either way, which is what crawlers read; a `<noscript>` rule in `index.html` forces it visible for readers without JavaScript.
- Any browser-only API must be guarded (`typeof window === 'undefined'`) or moved into an effect. `CamGrid`'s `localStorage` read and `CamFeedSlider`'s `matchMedia` already are.

## Locales and routing

The **URL is the single source of truth** for language — there is no `localStorage` or browser-language detection (`i18next-browser-languagedetector` was removed). `lib/locale.ts` owns the mapping: English at `/`, others at `/<lng>/`.

- `i18n/config.ts` takes its initial language from `window.location.pathname`, so it always matches the served file.
- The language controls are **real `<a href>` links** to the prerendered pages, with the click intercepted: `useSetLocale` does `history.pushState` + `changeLanguage`, so there's no reload and scroll position survives. Crawlers follow the hrefs; modified clicks (⌘, middle) still open a new tab.
- `useLocaleHistory` (mounted once in `App`) re-reads the language from the path on `popstate`, so back/forward work.
- `useDocumentMeta` rewrites title, description, canonical, `og:*` after an in-place switch — otherwise someone who switched to Italian would share English metadata.

**Known gap**: an Italian visitor landing on `/` gets English until they tap IT. Restoring auto-detection client-side would mean a visible English→Italian flash, since the served file has to be *some* language. The flash-free fix is an `Accept-Language` redirect at the edge.

## SEO

- **`lib/site.ts` is the only place the deployed origin is written.** The `seo()` plugin in `vite.config.ts` substitutes `%SITE_URL%` throughout `index.html` (canonical, `og:url`, JSON-LD `@id`s) and emits `robots.txt` + `sitemap.xml` from the same constant, so they cannot drift. `prerender.mjs` reads the origin back out of the built canonical rather than duplicating it.
- `index.html` carries a JSON-LD `@graph`: an `ExhibitionEvent` (run dates, venue address, artists, and the press coverage as `subjectOf`), the organising `PerformingGroup`, and a `WebSite` node.
- Full `hreflang` set including `x-default`, written per file by `prerender.mjs`; `sitemap.xml` lists all three URLs with `xhtml:link` alternates.
- `og-image.jpg` (1200×630) and `apple-touch-icon.png` are generated by `npm run og-image`, committed to `public/`. Regenerate them if the palette or the show dates change.

## Asset pipeline

Run `npm run optimize-images` to regenerate WebPs from the JPG/PNG originals sitting in `public/images/<set>/`. The script (`scripts/optimize-images.mjs`) walks a `SETS` table — one entry per folder, each with its own width/quality preset:

| Set | Full | Thumb | Why |
| --- | --- | --- | --- |
| `artworks` | 1600w, q78 | 400w, q75 | hero slider + grid tiles |
| `participants` | 1200w, q82 | — | portrait cards only; no thumb consumer |
| `works` | 1000w, q80 | — | catalogue tiles render ~500px wide |

1. For each source it emits `<name>.webp`, plus `<name>-thumb.webp` when the set's `thumbWidth > 0`.
2. Sanitizes basenames: spaces/parens → `_`. So `DSC01581 (2).jpg` becomes `DSC01581__2_.webp`.
3. Honors EXIF orientation (`sharp().rotate()`) — needed for the participant portraits, several of which arrive rotated.
4. Skips files whose WebPs already exist unless `--force`.

Adding a set means adding a row to `SETS`, not writing new sharp code.

After running, artwork originals can be deleted (`rm public/images/artworks/*.jpg`). The `IDS` list in `artworks.ts` must be updated to match the WebP basenames. Participant originals are currently **kept tracked** (~44MB) — only the WebP is served, so gitignoring them is an open question, not a settled convention.

**Typical compression**: ~3% of original size. The 55 source photos were 406MB → 13MB after pipeline.

## i18n

Three locales: `en` (English), `be` (Belarusian), `it` (Italian). Chosen by URL path, switched from the header.

Key structure (top-level groups):

```
meta, nav, surveillance, hero, about, feeds, participants, works, press, faq, visit, footer, a11y, camGrid
```

- `feeds.artwork` — alt text shared by all 55 photos (one generic description, not per-photo).
- `a11y.{closeCam, prevCam, nextCam, skipToContent, openMenu, closeMenu, switchLanguage}` — interactive control labels.
- `camGrid.{aria, last, resume}` — grid wall labels including the "last viewed" tile badge and resume hint.
- `meta.{title, description}` — the indexable `<title>` and description. Prerendered per locale *and* re-applied by `useDocumentMeta` after an in-place switch.
- `participants.bios.<slug>`, `press.items.<slug>.summary`, `press.kinds.<kind>`, `faq.items.<slug>` — keyed by the slug in `lib/participants.ts` / `lib/pressList.ts` / `lib/faqList.ts`. Keep the slug lists in sync.
- `faq.items.<slug>.a` is an **array** of paragraphs and `.lists` an optional array of `{label?, items[]}` — read with `t(key, { returnObjects: true })`, and pass `defaultValue: []` for the optional one or a missing key comes back as the key string.

Adding a string means adding it to all three locale files in the same place.

**What stays out of i18n**: work titles (shown bilingually regardless of locale), press headlines (citations, quoted in the outlet's own language), artist names, media, and dimensions.

## Surveillance band — `CAM 01–N` / total

The top band reads "CAM 01–55 · 055" derived from the total artwork count via `CAM_COUNT_LABEL` and `CAM_COUNT_TOTAL` in `artworks.ts`. If you add/remove photos, the band updates automatically.

## The other data lists

`artworks.ts` covers the CCTV photos. Four more lists follow the same shape — a `readonly` array of records whose `slug` doubles as the i18n key and the image basename:

| File | Drives | Prose in i18n | Photos |
| --- | --- | --- | --- |
| `participants.ts` | Participants (8) | `participants.bios.<slug>.{role,body}` | `/images/participants/<slug>.webp` |
| `worksList.ts` | Works (18) | — titles/medium live in the file | `/images/works/<slug>.webp` |
| `pressList.ts` | Press (6) | `press.items.<slug>.summary` | — |
| `faqList.ts` | Q&A (10) | `faq.items.<slug>.{q,a,lists}` | — |

`pressList.ts` has an optional `date`: ARTnews and Artnet publish none, so none is rendered. **Don't invent one.**

`participants.ts` holds people *and* one studio. `meta` is free text, not a
schema: people read `b. 1973, Minsk`, the Kyiv scent studio `ol.factory` reads
`Scent studio, Kyiv` because no founding year was supplied. Its tile is not a
photograph — the studio's black-on-white logo was turned into an alpha mask and
painted `--color-paper` over a `--color-ink-2` plate at 1200×1500, so it sits in
the dossier grid without a white block. Replace it wholesale if a real studio
photo ever arrives.

`faqList.ts` is only the slug order — every question, paragraph and bullet lives
in i18n. `Faq.tsx` renders native `<details>`; all rows share `name="faq"`, which
is what makes the accordion exclusive (no state, nothing to hydrate).

## Styling notes (`styles.css`)

- **Palette** is cool graphite, not black: `--color-ink: #14161a`, `--color-ink-2` for raised surfaces, `--color-ink-deep` for the band and footer. Pure black left hard shadows nothing to read against.
- **`.btn-key`** gives buttons their extruded edge and press travel. Two constraints, both of which have already caused a bug:
  - It **owns `transform`**. Anything using it must not rely on a translate utility for layout — that's why the popup's nav buttons centre with `top-0 bottom-0 my-auto` instead of `-translate-y-1/2`.
  - It deliberately sets **no `position`**. Living outside `@layer`, a `position` here would beat Tailwind's own `absolute`.
- `cn()` is a plain join with **no `tailwind-merge`**, so conflicting utilities resolve by stylesheet order, not by call order. Don't try to override a class from `lib/ui.ts` by appending another; add a variant there instead.
- CCTV media is desaturated then given a cold cast back (`sepia` + `hue-rotate`), so stills read as monitor blue-green. A fixed grain layer sits over the page at 5% overlay, disabled under `prefers-contrast: more`.

## Analytics

Vercel Web Analytics (`@vercel/analytics`), chosen over Google Analytics because the only question asked of it is *how many people visited*. It is cookieless, so an EU-facing site needs no consent banner — and no banner means no consent-declined visitors missing from the count.

- **`<Analytics>` is mounted in `main.tsx`, not `App.tsx`.** `entry-server.tsx` must mirror `App`'s tree exactly; keeping the component out of `App` means the two entries cannot drift. It renders no markup — the script is injected client-side — so hydration is unaffected either way.
- **`beforeSend` drops every event whose hostname is not the production host**, read from `SITE.url`. Preview deployments, `*.vercel.app` aliases and `npm run dev` all serve the same bundle; without the filter our own deploys would show up as visitors.
- **Collection is off until Web Analytics is enabled** in the Vercel dashboard (project → Analytics) and the project redeployed. The package alone does nothing.
- Retention is plan-bound: 1 month on Hobby.

## Deploy

Static output on Vercel; `/it/` and `/be/` are served from their directory `index.html` with no rewrite config needed. `vercel.json` only sets long-lived cache headers for hashed assets.

**Outstanding**: `SITE.url` is `https://unofficial-official.com`, set ahead of the DNS cutover on purpose. Until that domain is attached, the canonical names a host that does not resolve. `qr/qr.txt` still records the older Vercel URL — the printed QR is correct per the owner, so leave `qr/` alone.
