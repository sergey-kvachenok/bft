/**
 * Shared className constants. Use these in JSX via `cn(...)`. Hoisted here
 * so that CTAs, link rows, and other repeated visual patterns have exactly
 * one source of truth.
 */

const MONO_LABEL =
  'font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium';
const INVERT_ON_HOVER =
  'hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)] transition-colors';

const CTA_BASE = `inline-flex items-center justify-center px-5 sm:px-7 py-3 sm:py-4 ${MONO_LABEL} ${INVERT_ON_HOVER}`;

/** Filled red CTA on dark surfaces (Hero, Visit). */
export const CTA_FILLED = `${CTA_BASE} bg-[var(--color-signal)] text-[var(--color-paper)]`;

/** Outlined paper CTA on dark surfaces (Hero secondary). */
export const CTA_OUTLINED = `${CTA_BASE} gap-2 border border-[var(--color-paper)] text-[var(--color-paper)]`;

/** Plain inline link with signal-red hover (Header nav, Footer). */
export const LINK_INLINE =
  'text-[var(--color-paper)] hover:text-[var(--color-signal)] transition-colors';

/** Bordered link row that flips border + text on hover (About section). */
export const LINK_BORDERED =
  'inline-flex items-center gap-2 border-b border-[var(--color-rule)] pb-2 text-[var(--color-paper)] hover:text-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors';
