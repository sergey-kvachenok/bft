import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useSurveillanceClock } from '../../lib/useSurveillanceClock';
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
  /**
   * Keeps the top-right corner clear for an overlay control that sits above the
   * frame — the popup's close button. The REC timer moves inboard and the cam
   * id gives up width, so neither ends up underneath it.
   */
  reserveTopRight?: boolean;
}

const CORNER_BASE =
  'absolute w-3 h-3 sm:w-4 sm:h-4 border-[var(--color-paper)] z-20';

const BURN_IN_BASE =
  'absolute z-20 font-mono uppercase tracking-[0.18em] text-[var(--color-paper)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]';
const BURN_IN_LABEL_SIZE = 'text-[9px] sm:text-[11px]';
const BURN_IN_TIMESTAMP_SIZE = 'text-[9px] sm:text-[10px]';

// Cleared by SurveillanceBand (h-7 = 28px) + Header (h-12 = 48px) = 76px.
const TOP_OFFSET_HERO = 'top-20 sm:top-24';

// Right inset of the top-row chrome, and how much width the cam id may take.
// The reserved variants leave room for a 44px control inset from the corner.
const RIGHT_INSET = 'right-3 sm:right-5';
const RIGHT_INSET_RESERVED = 'right-16';
const CAM_ID_WIDTH = 'max-w-[60%]';
const CAM_ID_WIDTH_RESERVED = 'max-w-[55%]';
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
  reserveTopRight = false,
}: CamFrameProps) {
  const { timestamp, recElapsed } = useSurveillanceClock();

  const cornerTop = offsetTopForHeader ? TOP_OFFSET_HERO : TOP_OFFSET_CORNER;
  const labelTop = offsetTopForHeader ? TOP_OFFSET_HERO : TOP_OFFSET_LABEL;
  const rightInset = reserveTopRight ? RIGHT_INSET_RESERVED : RIGHT_INSET;
  const camIdWidth = reserveTopRight ? CAM_ID_WIDTH_RESERVED : CAM_ID_WIDTH;

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
        aria-hidden="true"
        className={cn(
          BURN_IN_BASE,
          BURN_IN_LABEL_SIZE,
          labelTop,
          'left-3 sm:left-5 flex items-center gap-1.5 sm:gap-2',
          camIdWidth,
        )}
      >
        <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--color-signal)] rec-dot shrink-0" />
        <span className="font-medium shrink-0 whitespace-nowrap">{camId}</span>
        {location && (
          <>
            <span className="text-[var(--color-mute)] shrink-0">·</span>
            <span className="truncate">{location}</span>
          </>
        )}
      </div>

      <div
        aria-hidden="true"
        className={cn(
          BURN_IN_BASE,
          BURN_IN_LABEL_SIZE,
          labelTop,
          rightInset,
          'flex items-center gap-1.5 sm:gap-2 text-[var(--color-signal)]',
        )}
      >
        <span className="font-medium">REC</span>
        <span className="tabular-nums text-[var(--color-paper)]">
          {recElapsed}
        </span>
      </div>

      <div
        aria-hidden="true"
        className={cn(
          BURN_IN_BASE,
          BURN_IN_TIMESTAMP_SIZE,
          'bottom-3 sm:bottom-5 left-3 sm:left-5 tabular-nums',
        )}
      >
        <span className="hidden sm:inline">{timestamp}</span>
        <span className="sm:hidden">{timestamp.slice(11)}</span>
      </div>

      <div
        aria-hidden="true"
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
