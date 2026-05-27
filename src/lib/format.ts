/** Zero-pad an integer to a given width. */
export const pad = (n: number, width: number): string =>
  String(n).padStart(width, '0');
