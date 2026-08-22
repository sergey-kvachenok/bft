import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from './constants';

export const THEMES = {
  dark: 'dark',
  light: 'light',
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

/** Dark is the exhibition's own register; light is an opt-in. */
const DEFAULT_THEME: Theme = THEMES.dark;

/** Mobile browser chrome. Matches `--color-ink` per theme. */
const BROWSER_CHROME: Record<Theme, string> = {
  dark: '#0a0a0a',
  light: '#f4f1e8',
};

/**
 * `data-theme` on <html> drives the palette (see `styles.css`). The attribute
 * is already set before first paint by the inline script in `index.html`, so
 * reading it here — rather than localStorage — keeps this hook in step with
 * what the visitor is actually looking at.
 */
const readTheme = (): Theme =>
  typeof document === 'undefined'
    ? DEFAULT_THEME
    : document.documentElement.dataset.theme === THEMES.light
      ? THEMES.light
      : DEFAULT_THEME;

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === THEMES.light) {
      root.dataset.theme = THEMES.light;
    } else {
      delete root.dataset.theme;
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', BROWSER_CHROME[theme]);

    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // Private browsing or a full quota — the theme just won't persist.
    }
  }, [theme]);

  const toggle = useCallback(
    () =>
      setTheme((current) =>
        current === THEMES.light ? THEMES.dark : THEMES.light,
      ),
    [],
  );

  return { theme, toggle };
}
