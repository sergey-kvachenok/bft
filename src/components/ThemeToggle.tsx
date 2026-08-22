import { useTranslation } from 'react-i18next';
import { cn } from '../lib/cn';
import { useTheme } from '../lib/useTheme';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Switches the palette between the default dark and the light reading theme.
 *
 * Both states are always in the DOM and CSS reveals one (`theme-dark-only` /
 * `theme-light-only`), so the server-rendered markup matches whatever the
 * pre-paint script in `index.html` already applied — including the visually
 * hidden label, which is what gives the button its accessible name.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { t } = useTranslation();
  const { toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'inline-flex items-center justify-center min-w-7 min-h-7 p-1.5',
        'text-[var(--color-mute)] hover:text-[var(--color-paper)] transition-colors',
        className,
      )}
    >
      <span className="theme-dark-only">
        <SunIcon />
        <span className="sr-only">{t('a11y.themeLight')}</span>
      </span>
      <span className="theme-light-only">
        <MoonIcon />
        <span className="sr-only">{t('a11y.themeDark')}</span>
      </span>
    </button>
  );
}

const ICON_PROPS = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

function SunIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.5v2.25M12 19.25v2.25M2.5 12h2.25M19.25 12h2.25M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M20 14.4A8.5 8.5 0 1 1 9.6 4a6.8 6.8 0 0 0 10.4 10.4Z" />
    </svg>
  );
}
