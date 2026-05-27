import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  formatRecElapsed,
  formatTimestamp,
  useSurveillanceClock,
} from '../../lib/useSurveillanceClock';
import { cn } from '../../lib/cn';
import { SignalBars } from './SignalBars';

interface CamFrameProps {
  camId: string;
  location?: string;
  children: ReactNode;
  className?: string;
  /** Optional auto-progress bar at the bottom of the frame. */
  progress?: { cycleKey: number | string; durationMs: number };
  /**
   * When true, the top chrome (corner brackets, cam id, REC timer) is offset
   * downward to clear the fixed SurveillanceBand + Header. Set on hero-level
   * instances so chrome never collides with page navigation.
   */
  offsetTopForHeader?: boolean;
}

const CORNER_BASE =
  'absolute w-3 h-3 sm:w-4 sm:h-4 border-[var(--color-paper)] z-20';

const BURN_IN_BASE =
  'absolute z-20 font-mono uppercase tracking-[0.18em] text-[var(--color-paper)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]';
const BURN_IN_LABEL_SIZE = 'text-[9px] sm:text-[11px]';
const BURN_IN_TIMESTAMP_SIZE = 'text-[9px] sm:text-[10px]';

// Cleared by SurveillanceBand (h-7 = 28px) + Header (h-12 = 48px) = 76px.
const TOP_OFFSET_HERO = 'top-20 sm:top-24';
const TOP_OFFSET_CORNER = 'top-2 sm:top-3';
const TOP_OFFSET_LABEL = 'top-3 sm:top-5';

function CornerBrackets({ topClass }: { topClass: string }) {
  return (
    <>
      <span aria-hidden className={cn(CORNER_BASE, topClass, 'left-2 sm:left-3 border-l border-t')} />
      <span aria-hidden className={cn(CORNER_BASE, topClass, 'right-2 sm:right-3 border-r border-t')} />
      <span aria-hidden className={cn(CORNER_BASE, 'bottom-2 sm:bottom-3 left-2 sm:left-3 border-l border-b')} />
      <span aria-hidden className={cn(CORNER_BASE, 'bottom-2 sm:bottom-3 right-2 sm:right-3 border-r border-b')} />
    </>
  );
}

export function CamFrame({
  camId,
  location,
  children,
  className,
  progress,
  offsetTopForHeader = false,
}: CamFrameProps) {
  const { now, elapsed } = useSurveillanceClock();
  const ts = formatTimestamp(now);

  const cornerTop = offsetTopForHeader ? TOP_OFFSET_HERO : TOP_OFFSET_CORNER;
  const labelTop = offsetTopForHeader ? TOP_OFFSET_HERO : TOP_OFFSET_LABEL;

  return (
    <div
      className={cn(
        'overflow-hidden bg-black scanlines cursor-crosshair',
        className,
      )}
    >
      <div className="cctv-feed relative z-0 h-full w-full">{children}</div>

      <CornerBrackets topClass={cornerTop} />

      <div
        className={cn(
          BURN_IN_BASE,
          BURN_IN_LABEL_SIZE,
          labelTop,
          'left-3 sm:left-5 flex items-center gap-1.5 sm:gap-2 max-w-[60%]',
        )}
      >
        <span
          aria-hidden
          className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--color-signal)] rec-dot shrink-0"
        />
        <span className="font-medium">{camId}</span>
        {location && (
          <>
            <span className="text-[var(--color-mute)]">·</span>
            <span className="truncate">{location}</span>
          </>
        )}
      </div>

      <div
        className={cn(
          BURN_IN_BASE,
          BURN_IN_LABEL_SIZE,
          labelTop,
          'right-3 sm:right-5 flex items-center gap-1.5 sm:gap-2 text-[var(--color-signal)]',
        )}
      >
        <span className="font-medium">REC</span>
        <span className="tabular-nums text-[var(--color-paper)]">
          {formatRecElapsed(elapsed)}
        </span>
      </div>

      <div
        className={cn(
          BURN_IN_BASE,
          BURN_IN_TIMESTAMP_SIZE,
          'bottom-3 sm:bottom-5 left-3 sm:left-5 tabular-nums',
        )}
      >
        <span className="hidden sm:inline">{ts}</span>
        <span className="sm:hidden">{ts.slice(11)}</span>
      </div>

      <div
        className={cn(
          BURN_IN_BASE,
          BURN_IN_TIMESTAMP_SIZE,
          'bottom-3 sm:bottom-5 right-3 sm:right-5 flex items-center gap-1.5 sm:gap-2',
        )}
      >
        <SignalBars size="md" />
        <span className="hidden sm:inline">SIG</span>
      </div>

      {progress && (
        <motion.span
          aria-hidden
          key={`progress-${progress.cycleKey}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: progress.durationMs / 1000, ease: 'linear' }}
          style={{ transformOrigin: 'left' }}
          className="absolute bottom-1 sm:bottom-1.5 left-10 sm:left-16 right-10 sm:right-16 h-px bg-[var(--color-paper)] z-20"
        />
      )}
    </div>
  );
}
