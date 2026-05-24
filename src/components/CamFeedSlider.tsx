import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CamFrame } from './ui/CamFrame';
import { FEEDS, FEED_CYCLE_MS } from '../lib/feeds';
import { cn } from '../lib/cn';

interface CamFeedSliderProps {
  className?: string;
}

/**
 * Auto-cycling CCTV monitor: shows one feed at a time, cross-fades to the
 * next every FEED_CYCLE_MS. Uses CSS opacity transitions on a stack of
 * <img> elements — simpler and more reliable than animating mounts.
 *
 * Pauses for users with prefers-reduced-motion.
 */
export function CamFeedSlider({ className }: CamFeedSliderProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const current = FEEDS[index];

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % FEEDS.length);
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
      {FEEDS.map((feed, i) => (
        <img
          key={feed.src}
          src={feed.src}
          alt={t(feed.altKey)}
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
    </CamFrame>
  );
}
