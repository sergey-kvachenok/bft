# Architecture

## What this app is

A single-page mobile-first PWA — a companion guide for visitors of the *Official. Unofficial. Belarus.* exhibition at the Venice Biennale. The visual concept is a CCTV surveillance feed: a B&W treated photo slider in the hero, a horizontally-scrollable wall of "camera" tiles below, opening any tile into a full-screen viewer with prev/next navigation.

The QR code on physical posters at the Biennale points visitors here. Phone-first; tablet/desktop is a fallback layout.

## Directory map

```
src/
  App.tsx                       — section composition (one section per imported component)
  main.tsx                      — React root + i18n setup
  styles.css                    — Tailwind base + CCTV-specific CSS (scanlines, rec-dot pulse, etc.)
  components/
    Header.tsx, Footer.tsx, SurveillanceBand.tsx
    CamGrid.tsx                 — multi-cam tile wall (47 tiles)
    CamFeedSlider.tsx           — auto-cycling hero feed (8 photos)
    CamPopup.tsx                — full-screen viewer with prev/next nav, opened from CamGrid
    sections/
      Hero.tsx, About.tsx, Visit.tsx
    ui/
      CamFrame.tsx              — shared chrome around any "monitor view" (cam ID, timestamp, scanline)
  lib/
    artworks.ts                 — single source of truth for photos + cam labels + cycle constants
    constants.ts                — SECTION_IDS, EXTERNAL_LINKS, STORAGE_KEYS
    cn.ts                       — minimal className combiner (no clsx dep)
    motion.ts                   — shared easing curves
    useSurveillanceClock.ts     — ticking timestamp for the surveillance band
  i18n/
    locales/{en,be,it}.json     — every user-facing string
public/
  images/artworks/              — optimized WebPs (1600w + 400w thumb pairs)
  icon.svg, manifest assets
scripts/
  optimize-images.mjs           — JPG→WebP pipeline (sharp)
  generate-qr.mjs               — QR code generator
.claude/knowledge/              — this map
```

## Component tree

```
<App>
  <SurveillanceBand>            — top status bar: signal bars, "REC LIVE", CAM 01–55, timestamp
  <Header>
  <main>
    <Hero>                      — full-bleed CCTV monitor with overlaid title + CTAs
      <CamFeedSlider>           — cycles HERO_ARTWORKS, one img mounted at a time
    <CamGrid>                   — 2 rows of 100px tiles using GRID_ARTWORKS
      <CamPopup>                — overlay, mounted alongside grid; opens at active index
    <About>
    <Visit>
  <Footer>
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
- **i18n language** — handled by `i18next-browser-languagedetector`; persisted by the library.

No other persistent state. No global store, no context, no Redux — the data is small and static.

## CamPopup navigation

Opened from `CamGrid` with an integer `index`. Supports:

- **Mouse/touch** — `‹` and `›` buttons on either side of the modal (44px touch targets).
- **Keyboard** — `ArrowLeft` / `ArrowRight` for prev/next, `Escape` to close.
- **Backdrop click** — closes.
- **Wrap-around** — `step(i, delta, total) = (i + delta + total) % total`. From last `→` goes to first; from first `←` goes to last.

`CamPopup` is "dumb" with respect to which list it shows — it just takes `artworks: readonly Artwork[]` plus `index` and emits `onIndexChange`. The owning component (currently only `CamGrid`) decides what list to pass.

## PWA / caching strategy (`vite.config.ts`)

- **Precache** (downloaded on install): only `**/*.{js,css,html,svg,woff2}` — the app shell (~430KB).
- **Runtime cache** (`CacheFirst`):
  - `/images/artworks/*.webp` — cached on first visit, kept for 90 days, max 120 entries.
  - Google Fonts — cached for 1 year.

Rationale: 55 photos × 2 sizes = 110 assets totaling ~13MB. Precaching them would make the PWA install crushing on mobile data. Runtime caching means they download lazily, and once seen, work offline.

## Asset pipeline

Run `npm run optimize-images` to regenerate WebPs from JPGs in `public/images/artworks/`. The script (`scripts/optimize-images.mjs`):

1. For each `*.jpg` it emits two WebPs in the same folder:
   - `<name>.webp` — 1600w, q78, `effort: 5`.
   - `<name>-thumb.webp` — 400w, q75.
2. Sanitizes basenames: spaces/parens → `_`. So `DSC01581 (2).jpg` becomes `DSC01581__2_.webp`.
3. Honors EXIF orientation (`sharp().rotate()`).
4. Skips files whose WebPs already exist unless `--force`.

After running, originals can be deleted (`rm public/images/artworks/*.jpg`). The `IDS` list in `artworks.ts` must be updated to match the WebP basenames.

**Typical compression**: ~3% of original size. The 55 source photos were 406MB → 13MB after pipeline.

## i18n

Three locales: `en` (English), `be` (Belarusian), `it` (Italian). Detected by browser, language switcher in the header.

Key structure (top-level groups):

```
nav, surveillance, hero, about, feeds, visit, footer, a11y, camGrid
```

- `feeds.artwork` — alt text shared by all 55 photos (one generic description, not per-photo).
- `a11y.{closeCam, prevCam, nextCam, skipToContent, openMenu, closeMenu, switchLanguage}` — interactive control labels.
- `camGrid.{aria, last, resume}` — grid wall labels including the "last viewed" tile badge and resume hint.

Adding a string means adding it to all three locale files in the same place.

## Surveillance band — `CAM 01–N` / total

The top band reads "CAM 01–55 · 055" derived from the total artwork count via `CAM_COUNT_LABEL` and `CAM_COUNT_TOTAL` in `artworks.ts`. If you add/remove photos, the band updates automatically.
