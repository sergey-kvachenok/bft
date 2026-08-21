# Code Conventions

These are enforced by the project owner. Violating any of them is grounds for rework — `DRY` and `no duplicated photo display` in particular have come up explicitly in this codebase's history.

---

## 1. DRY — most important

**Rule**: If a literal, expression, or class string appears twice and the second occurrence is a copy, extract it. Wait for the second occurrence — don't pre-extract. Act decisively on the third.

### What "duplication" means here

- **String literals** repeated in multiple places → `const` at the top of the file or in `lib/constants.ts`.
- **Path templates** like `/images/artworks/${id}.webp` → factor the base into a constant, build the path from it.
- **Repeated math** like `(i + delta + total) % total` written multiple times → a named function.
- **Tailwind class strings** that share most of their classes between buttons or cards → a base constant + the per-variant difference.
- **Numeric values** that drive layout in more than one place (e.g., tile size used in `gridAutoColumns`, `width`, `height`) → a named constant; compute derivatives from it.
- **i18n keys** referenced in code → if used in >1 place, hoist into a constant. (We currently use the literal `'feeds.artwork'` inside `artworks.ts` only — borderline acceptable since it's confined.)

### Concrete examples already in this repo

`src/lib/artworks.ts`:

```ts
const ARTWORK_DIR = '/images/artworks';
const CAM_PREFIX = 'CAM';
const pad = (n: number, w: number) => String(n).padStart(w, '0');
const camLabel = (n: number) => `${CAM_PREFIX} ${pad(n, 2)}`;
```

`src/components/CamPopup.tsx`:

```ts
const POPUP_BUTTON_BASE = `absolute z-30 flex items-center justify-center font-mono leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-signal)] transition-colors`;
const NAV_BUTTON_CLASS = `${POPUP_BUTTON_BASE} ...nav-specific...`;
const CLOSE_BUTTON_CLASS = `${POPUP_BUTTON_BASE} ...close-specific...`;

const step = (i, delta, total) => (i + delta + total) % total;
```

`src/components/CamGrid.tsx`:

```ts
const TILE_PX = 100;
const GRID_ROWS = 2;
const TILE_SIZE = `${TILE_PX}px`;
const GRID_HEIGHT = `${TILE_PX * GRID_ROWS}px`;
```

### Where to put extracted things

- **Used only inside one file** → top of that file.
- **Used in >1 file** → `lib/constants.ts` (string literals, IDs, storage keys), `lib/motion.ts` (easing/durations), or a dedicated module like `lib/artworks.ts`.
- **Used in JSX in >1 component** → consider a small shared component in `components/ui/`.

---

## 2. No duplicated photo display

Every artwork photo appears in exactly **one** of `HERO_ARTWORKS` or `GRID_ARTWORKS`. Never the same photo in both. The original codebase reused 6 photos with rotation/zoom variants to fill 40 grid tiles — that variant pattern has been removed.

If you need more visual variety, add more photos to `IDS` in `artworks.ts` — don't add transforms or re-cycle the existing list.

---

## 3. Comments

**Default: no comments.** Add one only when the **why** is non-obvious to a future reader:

- Hidden constraint (a third-party API quirk, a browser bug workaround).
- A subtle invariant the type system can't express.
- A counter-intuitive choice the reader will want to second-guess.

Never write:

- WHAT the code does (well-named identifiers already do that).
- References to tasks/PRs/issues/incidents (rot quickly; belongs in PR description).
- "Added for feature X" or "Fixes bug Y" (use git log).
- Multi-paragraph docstrings or boilerplate JSDoc — one short line max.

Existing top-of-file comments in this repo describe **the role of the file in the overall design** — that's the bar. They are short and explain why the file exists, not what each function does line-by-line.

---

## 4. TypeScript

- Strict mode on; no `any`. Use `unknown` if the type is genuinely uncertain at a boundary.
- Prefer type inference; annotate at function signatures and module boundaries.
- Use `readonly` and `as const` for static data tables (the `IDS` list, `STORAGE_KEYS`, `SECTION_IDS`).
- `type` vs `interface`: prefer `interface` for object shapes that may be extended; `type` for unions and computed types.
- Don't add backwards-compat shims, deprecated aliases, or `_unused`-prefixed exports. Delete dead code.

---

## 5. React patterns (React 19)

- **Function components only.** No class components.
- **Hooks at top of component.** No conditional hook calls.
- **State**: `useState` for component-local, `useEffect` for side effects (DOM listeners, localStorage, intervals). No Redux/Zustand/Context for this project — data is small and static.
- **Memoization**: don't reach for `useMemo`/`useCallback` reflexively. Add them only when there's a measured perf problem or a referential-stability requirement (e.g., dep arrays of `useEffect`).
- **Don't render what you don't need**: see `CamFeedSlider` — only the current frame is mounted (via `AnimatePresence`), not all 8 stacked. With 55 frames, eagerly stacking `<img>` elements with `opacity: 0` would force the browser to preload all of them.
- **`motion`** is the animation library. Shared easing curves live in `lib/motion.ts` (e.g., `EASE_EDITORIAL`).
- **Render must be safe at build time.** Components are rendered in Node by `entry-server.tsx`. Never touch `window`, `document`, `localStorage`, `matchMedia`, or `Date` during render — guard with `typeof window === 'undefined'` or move it into an effect. A value that legitimately differs (a clock) renders a fixed placeholder until mount; see `useSurveillanceClock`.

---

## 6. Styling — Tailwind 4

- Use Tailwind utility classes in JSX.
- For repeated combinations, extract a string `const` outside the component (see button base classes in `CamPopup.tsx`).
- Use `cn()` from `lib/cn.ts` to compose conditional classes — don't pull in `clsx` or `tailwind-merge`.
- **`cn()` is a plain join, so it does not resolve conflicts.** Two competing utilities are settled by stylesheet order, not by which you passed last. To change a `lib/ui.ts` constant's look, edit or add a variant there — don't append an override at the call site and assume it wins.
- **Custom classes in `styles.css` sit outside `@layer` and therefore beat Tailwind utilities.** `.btn-key` is the live example: it owns `transform` (so its users must not centre with a translate utility) and deliberately declares no `position` (which would override `absolute`). Getting this wrong silently relocates elements — it already did once.
- CSS custom properties (`var(--color-signal)`, `var(--color-ink)`, etc.) are defined in `styles.css` for the brand palette. Use them for colors instead of hardcoded hex.
- Avoid inline styles unless dynamic (e.g., a value derived from a constant like `TILE_SIZE`, or `filter` from an artwork property).

---

## 7. Accessibility

- **Every interactive element has a discernible name.** Use `aria-label` (often translated via `t('a11y.*')`) for icon-only buttons.
- **Keyboard support is mandatory** for any custom interaction. The popup binds `Escape`, `ArrowLeft`, `ArrowRight` — don't ship modal-like UIs without keyboard handlers.
- **Focus management**: dialogs use `role="dialog"` + `aria-modal="true"` + autofocus on the close button. The current code does this; preserve it.
- **Touch targets ≥ 44×44px** on mobile. Nav buttons in the popup are 44px on phones, 48px on `sm+`.
- **`aria-current="true"`** on the "last viewed" tile so screen readers announce it.
- **Skip-to-content link** is in `App.tsx`. Keep it as the first focusable element.

---

## 8. Mobile-first

This is a phone-first app. Every change should be tested at narrow viewport (~375px) first.

- **Bandwidth matters.** There is no offline cache to fall back on — every visitor pays for what you add, often on Venice mobile data. Justify new media, and run it through `npm run optimize-images`.
- **Lazy-load images** that are off-screen. The grid uses `loading="lazy"`.
- **Don't stack 55 `<img>` elements** with opacity tricks — see point 5.
- **Touch first, hover second.** Hover styles are a bonus, not a requirement to discover functionality.

---

## 9. i18n

- **Every user-facing string** goes in `src/i18n/locales/{en,be,it}.json`. No literal English strings in JSX.
- Add the key to **all three locales** in the same commit. If you don't know Belarusian or Italian, copy the English and flag it.
- Key naming follows the top-level groups: `meta.*`, `nav.*`, `hero.*`, `feeds.*`, `participants.*`, `works.*`, `press.*`, `camGrid.*`, `a11y.*`, etc. Group by section, not by component.
- **Citations and bilingual titles stay out of i18n.** Press headlines are quoted in the outlet's own language; work titles show EN + BE regardless of locale. Translating either would misrepresent the source.
- **A new section needs `meta.*` too** if it changes what the page is about — that's the indexable title and description, prerendered per locale.
- Alt text for images uses `feeds.artwork` — one shared string. Don't add per-photo alt keys (would need 55 translations × 3 locales).

---

## 10. File organization

- Components go in `src/components/`; section-level wrappers in `src/components/sections/`; shared chrome (frames, frames, primitives) in `src/components/ui/`.
- Shared utilities and data go in `src/lib/`. One concern per file (`artworks.ts`, `constants.ts`, `cn.ts`, `motion.ts`, `site.ts`, `locale.ts`).
- `vite.config.ts` may import from `src/lib/` — that's how `site.ts` and `locale.ts` stay the single source for the origin and the locale list. Those files must therefore stay free of DOM types; they're compiled by `tsconfig.node.json`, which has no `DOM` lib.
- Co-located component-specific helpers can live inside the component file if not reused.
- No `index.ts` barrel files — they bloat the bundle and hide imports.

---

## 11. Before declaring "done"

- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes — **all four stages**, prerender included.
- [ ] If UI changed: verified in a real browser at narrow viewport. Prefer `npm run preview` over `npm run dev` — the dev shell can't reveal a hydration mismatch. If you couldn't test the UI, say so — don't assume.
- [ ] Browser console clean on load: a hydration warning means prerender and client disagree.
- [ ] All new user-facing strings exist in `en`, `be`, `it` — and all three prerendered pages still show them (`dist/{,it/,be/}index.html`).
- [ ] No new duplication (literals, class strings, magic numbers).
- [ ] No new comments that just describe WHAT.
- [ ] No new dead code, `_unused` vars, or deprecation shims.

---

## 12. When in doubt

- Read `architecture.md` to understand which file owns the concern.
- Re-read this file's DRY section before extracting OR before leaving duplication in place.
- Prefer the smallest change that satisfies the task. Don't refactor adjacent code unless asked or it's directly blocking the task.
- For exploratory questions ("what should we do about X?") respond with options and tradeoffs in 2–3 sentences. Don't implement before alignment.
