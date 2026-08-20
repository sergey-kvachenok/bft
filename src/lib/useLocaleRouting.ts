import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { localeFromPath, pathForLocale, type Language } from './locale';

/**
 * Replays language changes made with the browser's back/forward buttons by
 * re-reading the language out of the path. Mount once, at the app root.
 */
export function useLocaleHistory() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const syncFromPath = () => {
      void i18n.changeLanguage(localeFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', syncFromPath);
    return () => window.removeEventListener('popstate', syncFromPath);
  }, [i18n]);
}

/**
 * Switches language without a reload: pushes `/it/` (or `/`) onto the history
 * stack and swaps the i18n language in place, so the page stays interactive and
 * scroll position survives. The hash is preserved, so switching does not jump
 * out of the section the reader is in.
 */
export function useSetLocale() {
  const { i18n } = useTranslation();

  return useCallback(
    (lng: Language) => {
      window.history.pushState(
        null,
        '',
        `${pathForLocale(lng)}${window.location.hash}`,
      );
      void i18n.changeLanguage(lng);
    },
    [i18n],
  );
}
