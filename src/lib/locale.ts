/**
 * Locale ↔ URL mapping. Each language is prerendered to its own static file
 * (`/`, `/it/`, `/be/`) so crawlers and shared links get real, indexable HTML
 * in the right language. The path is the single source of truth: an already
 * loaded page switches language with `history.pushState` and never reloads.
 *
 * English is served from the root — no `/en/` — so the canonical URL of the
 * site stays `https://…/`.
 */
export const SUPPORTED_LANGUAGES = ['en', 'it', 'be'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

/** The non-default languages, i.e. the ones that own a path prefix. */
export const PREFIXED_LANGUAGES = SUPPORTED_LANGUAGES.filter(
  (lng): lng is Exclude<Language, typeof DEFAULT_LANGUAGE> =>
    lng !== DEFAULT_LANGUAGE,
);

const isLanguage = (value: string): value is Language =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

/** `/it/` → `it`; anything unrecognised → the default language. */
export function localeFromPath(pathname: string): Language {
  const first = pathname.split('/')[1] ?? '';
  return isLanguage(first) && first !== DEFAULT_LANGUAGE
    ? first
    : DEFAULT_LANGUAGE;
}

/** Root-relative path a language lives at, always with a trailing slash. */
export function pathForLocale(lng: Language): string {
  return lng === DEFAULT_LANGUAGE ? '/' : `/${lng}/`;
}

/** `en_GB`-style tags for `og:locale`. */
export const OG_LOCALES: Record<Language, string> = {
  en: 'en_GB',
  it: 'it_IT',
  be: 'be_BY',
};
