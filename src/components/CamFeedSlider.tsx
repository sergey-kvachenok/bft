import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { CamFrame } from './ui/CamFrame';
import { HERO_ARTWORKS, FEED_CYCLE_MS } from '../lib/artworks';
import { cn } from '../lib/cn';

interface CamFeedSliderProps {
  className?: string;
}

/**
 * Auto-cycling CCTV monitor: shows one feed at a time, cross-fades to the
 * next every FEED_CYCLE_MS. Only the current frame is mounted — the browser
 * loads at most one image at a time (important with 55 frames).
 *
 * Defaults to paused for prefers-reduced-motion users.
 */
export function CamFeedSlider({ className }: CamFeedSliderProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const current = HERO_ARTWORKS[index];

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % HERO_ARTWORKS.length);
    }, FEED_CYCLE_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <CamFrame
      camId={current.camId}
      location={current.location}
      className={cn('h-full w-full', className)}
      progress={
        playing ? { cycleKey: index, durationMs: FEED_CYCLE_MS } : undefined
      }
      offsetTopForHeader
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={current.src}
          src={current.src}
          alt=""
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? t('a11y.pauseFeed') : t('a11y.playFeed')}
        aria-pressed={!playing}
        className="
          absolute z-30 bottom-6 left-1/2 -translate-x-1/2
          inline-flex items-center justify-center
          w-11 h-11 pointer-events-auto
          bg-black/70 text-[var(--color-paper)]
          font-mono text-xs leading-none
          hover:bg-[var(--color-signal)]
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-signal)]
          transition-colors
        "
      >
        <span aria-hidden="true">{playing ? '❚❚' : '►'}</span>
      </button>
    </CamFrame>
  );
}
