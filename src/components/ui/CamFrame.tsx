import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  formatRecElapsed,
  formatTimestamp,
  useSurveillanceClock,
} from '../../lib/useSurveillanceClock';
import { cn } from '../../lib/cn';

interface CamFrameProps {
  camId: string;
  location?: string;
  children: ReactNode;
  className?: string;
  bw?: boolean;
  /** Optional auto-progress bar at the bottom of the frame. */
  progress?: { cycleKey: number | string; durationMs: number };
  /**
   * When true, the top chrome (corner brackets, cam id, REC timer) is offset
   * downward to clear the fixed SurveillanceBand (28px) + Header (48px).
   * Set this on hero-level instances so the chrome never collides with the
   * page-level navigation.
   */
  offsetTopForHeader?: boolean;
}

const corner = 'absolute w-3 h-3 sm:w-4 sm:h-4 border-[var(--color-paper)] z-20';

function CornerBrackets({ topOffset }: { topOffset: string }) {
  return (
    <>
      <span aria-hidden className={cn(corner, topOffset, 'left-2 sm:left-3 border-l border-t')} />
      <span aria-hidden className={cn(corner, topOffset, 'right-2 sm:right-3 border-r border-t')} />
      <span aria-hidden className={cn(corner, 'bottom-2 sm:bottom-3 left-2 sm:left-3 border-l border-b')} />
      <span aria-hidden className={cn(corner, 'bottom-2 sm:bottom-3 right-2 sm:right-3 border-r border-b')} />
    </>
  );
}

function SignalBars() {
  return (
    <span aria-hidden className="inline-flex items-end gap-px h-3">
      {[3, 5, 7, 9, 11].map((h) => (
        <span
          key={h}
          className="w-px bg-[var(--color-paper)]"
          style={{ height: `${h}px` }}
        />
      ))}
    </span>
  );
}

const burnIn =
  'absolute z-20 font-mono uppercase tracking-[0.18em] text-[var(--color-paper)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]';
const burnInSize = 'text-[9px] sm:text-[11px]';

export function CamFrame({
  camId,
  location,
  children,
  className,
  bw = true,
  progress,
  offsetTopForHeader = false,
}: CamFrameProps) {
  const { now, elapsed } = useSurveillanceClock();

  // Clear SurveillanceBand (h-7 = 28px) + Header (h-12 = 48px) = 76px.
  // top-20 = 80px, top-24 = 96px → safely below.
  const cornerTop = offsetTopForHeader ? 'top-20 sm:top-24' : 'top-2 sm:top-3';
  const labelTop = offsetTopForHeader ? 'top-20 sm:top-24' : 'top-3 sm:top-5';

  return (
    <div
      className={cn(
        'overflow-hidden bg-black scanlines cursor-crosshair',
        className,
      )}
    >
      <div className={cn('relative z-0 h-full w-full', bw && 'cctv-feed')}>
        {children}
      </div>

      <CornerBrackets topOffset={cornerTop} />

      <div
        className={cn(
          burnIn,
          burnInSize,
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
          burnIn,
          burnInSize,
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
          burnIn,
          'text-[9px] sm:text-[10px]',
          'bottom-3 sm:bottom-5 left-3 sm:left-5 tabular-nums',
        )}
      >
        <span className="hidden sm:inline">{formatTimestamp(now)}</span>
        <span className="sm:hidden">{formatTimestamp(now).slice(11)}</span>
      </div>

      <div
        className={cn(
          burnIn,
          'text-[9px] sm:text-[10px]',
          'bottom-3 sm:bottom-5 right-3 sm:right-5 flex items-center gap-1.5 sm:gap-2',
        )}
      >
        <SignalBars />
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
