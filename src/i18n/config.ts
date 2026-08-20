import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import it from './locales/it.json';
import be from './locales/be.json';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  localeFromPath,
  type Language,
} from '../lib/locale';

export {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  type Language,
} from '../lib/locale';

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'EN',
  it: 'IT',
  be: 'BY',
};

/**
 * The URL decides the language — see `lib/locale.ts`. No browser-language or
 * localStorage detection: each locale is a prerendered file, so the language
 * baked into the served HTML has to be the one i18n starts in, or hydration
 * would mismatch on every translated string.
 */
const initialLanguage = (): Language =>
  typeof window === 'undefined'
    ? DEFAULT_LANGUAGE
    : localeFromPath(window.location.pathname);

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    it: { translation: it },
    be: { translation: be },
  },
  lng: initialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
  interpolation: { escapeValue: false },
});

export default i18n;
