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
 * Pauses for users with prefers-reduced-motion.
 */
export function CamFeedSlider({ className }: CamFeedSliderProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const current = HERO_ARTWORKS[index];

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % HERO_ARTWORKS.length);
    }, FEED_CYCLE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <CamFrame
      camId={current.camId}
      location={current.location}
      className={cn('h-full w-full', className)}
      progress={{ cycleKey: index, durationMs: FEED_CYCLE_MS }}
      offsetTopForHeader
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={current.src}
          src={current.src}
          alt={t(current.altKey)}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
    </CamFrame>
  );
}
