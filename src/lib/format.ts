/** Zero-pad an integer to a given width. */
export const pad = (n: number, width: number): string =>
  String(n).padStart(width, '0');

/**
 * `2026-04-28` → `2026.04.28`. Locale-independent on purpose: the dotted form
 * reads as a surveillance timestamp and matches the mono labels around it.
 */
export const dotDate = (iso: string): string => iso.replace(/-/g, '.');
