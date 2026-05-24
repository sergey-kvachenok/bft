/**
 * Minimal className combiner. Filters falsy values and joins with a space.
 * No dependency on clsx/tailwind-merge — keep the bundle lean.
 */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(' ');
}
