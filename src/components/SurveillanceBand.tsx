import { useTranslation } from 'react-i18next';
import {
  formatTimestamp,
  useSurveillanceClock,
} from '../lib/useSurveillanceClock';
import { CAM_COUNT_LABEL, CAM_COUNT_TOTAL } from '../lib/artworks';
import { SignalBars } from './ui/SignalBars';

export function SurveillanceBand() {
  const { t } = useTranslation();
  const { now } = useSurveillanceClock();
  const ts = formatTimestamp(now);

  return (
    <div
      aria-hidden="true"
      className="
        fixed top-0 inset-x-0 z-[60]
        h-7 flex items-center
        bg-black border-b border-[var(--color-rule)]
        font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.18em]
        text-[var(--color-paper)]
      "
    >
      <div className="mx-auto max-w-6xl w-full px-3 sm:px-6 lg:px-12 flex items-center gap-2 sm:gap-4">
        <span className="flex items-center gap-1.5 sm:gap-2 text-[var(--color-signal)] shrink-0">
          <span
            aria-hidden
            className="rec-dot inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--color-signal)]"
          />
          <span className="font-medium">{t('surveillance.monitored')}</span>
        </span>

        <span className="hidden sm:inline text-[var(--color-mute)]">|</span>

        <span className="hidden sm:flex items-center gap-2 text-[var(--color-paper)]">
          <span>{CAM_COUNT_LABEL}</span>
          <span className="text-[var(--color-mute)]">/</span>
          <span className="text-[var(--color-mute)]">{CAM_COUNT_TOTAL}</span>
        </span>

        <span className="hidden lg:inline text-[var(--color-mute)]">|</span>

        <span className="hidden lg:inline text-[var(--color-paper)] truncate">
          {t('surveillance.location')}
        </span>

        <span className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
          <SignalBars size="sm" className="hidden md:inline-flex" />
          <span className="text-[var(--color-paper)] tabular-nums">
            <span className="sm:hidden">{ts.slice(11)}</span>
            <span className="hidden sm:inline">{ts}</span>
          </span>
          <span className="hidden sm:inline text-[var(--color-signal)] font-medium">
            {t('surveillance.live')}
          </span>
        </span>
      </div>
    </div>
  );
}
