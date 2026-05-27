# BFT Biennale — Knowledge Map

> **Project**: Official. Unofficial. Belarus. — Belarus Free Theatre at La Biennale di Venezia.
> **What**: Mobile-first PWA QR landing page / companion guide.
> **Stack**: React 19 + Vite 6 + TypeScript 5 + Tailwind 4 + motion + i18next + vite-plugin-pwa.
> **Working directory**: repo root.

This map exists so any future agent can get oriented in minutes. Read `architecture.md` for **what the code is**; read `conventions.md` for **how to write code in it**.

---

## Where to look

| Task involves...                                          | Read                                          |
| --------------------------------------------------------- | --------------------------------------------- |
| Adding/removing photos, changing the gallery, asset paths | `architecture.md` → Data + `assets` section   |
| Tweaking the CCTV slider, grid, or popup                  | `architecture.md` → Components                |
| New translation, locale fix, alt-text                     | `architecture.md` → i18n                      |
| Service worker, caching, install size                     | `architecture.md` → PWA                       |
| Writing or refactoring any code at all                    | `conventions.md` (DRY, comments, a11y, etc.)  |
| Component patterns, Tailwind reuse, motion conventions    | `conventions.md` → React + Styling            |

---

## Entry points (read these files first)

- `src/App.tsx` — section composition (`SurveillanceBand`, `Header`, `Hero`, `CamGrid`, `About`, `Visit`, `Footer`).
- `src/lib/artworks.ts` — **single source of truth** for all photo data. Drives the hero slider and the grid.
- `src/lib/constants.ts` — section IDs, external links, localStorage keys.
- `src/i18n/locales/{en,be,it}.json` — every user-facing string. No literal strings in components.
- `vite.config.ts` — PWA cache strategy. App-shell precached; artwork WebPs cached at runtime.
- `scripts/optimize-images.mjs` — JPG→WebP pipeline. Run with `npm run optimize-images`.

---

## Hard rules (non-negotiable)

1. **DRY** — extract repeated literals, logic, and class strings into shared constants/helpers. Wait for the second occurrence to abstract; act on the third. See `conventions.md` → DRY for examples from this codebase.
2. **No duplicated photo display** — each photo appears in exactly one place (hero slider XOR grid). Controlled by `HERO_COUNT` in `artworks.ts`.
3. **Mobile-first** — every change is judged at narrow viewport + slow network first.
4. **Comments only when WHY is non-obvious** — never explain WHAT the code does. Never reference tasks/PRs/issues. See `conventions.md` → Comments.
5. **Every user-facing string lives in `i18n/locales/*.json`** — three locales: `en`, `be`, `it`. Adding a string means adding it to all three.

---

## Quick commands

```bash
npm run dev              # vite dev server
npm run build            # tsc -b + vite build
npm run typecheck        # tsc -b --noEmit
npm run optimize-images  # regenerate WebPs from JPGs in public/images/artworks/
npm run qr               # regenerate the QR landing image
```

## Last-known image footprint

- Source artworks: 55 photos at `public/images/artworks/<id>.webp` (1600w) + `<id>-thumb.webp` (400w).
- Pre-optimization JPGs were 406MB total; current WebP set is ~13MB.
- PWA precache stays small (~430KB shell) — artworks are runtime-cached on first view.
