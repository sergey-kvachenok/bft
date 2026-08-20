import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_LABELS } from '../i18n/config';
import {
  SUPPORTED_LANGUAGES,
  pathForLocale,
  type Language,
} from '../lib/locale';
import { useSetLocale } from '../lib/useLocaleRouting';
import { cn } from '../lib/cn';

interface LanguageSwitcherProps {
  className?: string;
}

/**
 * Real links to the prerendered per-locale pages, intercepted so a loaded page
 * switches in place instead of navigating. Anchors rather than buttons so
 * crawlers can follow them, middle-click opens a new tab, and the switcher
 * still works if the JavaScript never arrives.
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const setLocale = useSetLocale();
  const current = (i18n.resolvedLanguage ?? 'en') as Language;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, lng: Language) => {
    // Let the browser handle modified clicks (new tab, download, …).
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setLocale(lng);
  };

  return (
    <div
      role="group"
      aria-label={t('a11y.switchLanguage')}
      className={cn(
        'flex items-center gap-1 font-mono text-[11px] tracking-[0.18em]',
        className,
      )}
    >
      {SUPPORTED_LANGUAGES.map((lng, idx) => {
        const isActive = current === lng;
        return (
          <span key={lng} className="flex items-center">
            <a
              href={pathForLocale(lng)}
              hrefLang={lng}
              onClick={(e) => handleClick(e, lng)}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'inline-flex items-center justify-center min-w-7 min-h-7 px-2 py-1.5 transition-colors',
                isActive
                  ? 'text-[var(--color-signal)]'
                  : 'text-[var(--color-mute)] hover:text-[var(--color-paper)]',
              )}
            >
              {LANGUAGE_LABELS[lng]}
            </a>
            {idx < SUPPORTED_LANGUAGES.length - 1 && (
              <span aria-hidden className="text-[var(--color-rule)]">
                /
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
