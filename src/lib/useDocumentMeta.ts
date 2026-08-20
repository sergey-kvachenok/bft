import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SITE } from './site';
import { OG_LOCALES, pathForLocale, type Language } from './locale';

const setAttr = (selector: string, attr: string, value: string) => {
  document.head.querySelector(selector)?.setAttribute(attr, value);
};

const setMeta = (selector: string, content: string) =>
  setAttr(selector, 'content', content);

/**
 * Keeps `<html lang>` and the indexable head metadata in step with the active
 * language. Each locale ships prerendered with its own correct head, so this
 * only matters after an in-place switch — but without it a reader who switched
 * to Italian and then shared the page would hand out English metadata.
 */
export function useDocumentMeta() {
  const { i18n, t } = useTranslation();
  const lang = (i18n.resolvedLanguage ?? 'en') as Language;

  useEffect(() => {
    const title = t('meta.title');
    const description = t('meta.description');
    const url = `${SITE.url}${pathForLocale(lang)}`;

    document.documentElement.lang = lang;
    document.title = title;

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[property="og:locale"]', OG_LOCALES[lang]);
    setMeta('meta[property="og:url"]', url);
    setAttr('link[rel="canonical"]', 'href', url);
  }, [lang, t]);
}
