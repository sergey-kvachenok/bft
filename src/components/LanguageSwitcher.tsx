import { useTranslation } from 'react-i18next';
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  type Language,
} from '../i18n/config';
import { cn } from '../lib/cn';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage ?? 'en') as Language;

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
            <button
              type="button"
              onClick={() => void i18n.changeLanguage(lng)}
              aria-pressed={isActive}
              className={cn(
                'px-1.5 py-1 transition-colors',
                isActive
                  ? 'text-[var(--color-signal)]'
                  : 'text-[var(--color-mute)] hover:text-[var(--color-paper)]',
              )}
            >
              {LANGUAGE_LABELS[lng]}
            </button>
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
