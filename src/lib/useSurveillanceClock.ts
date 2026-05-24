import { useEffect, useRef, useState } from 'react';

export interface SurveillanceClock {
  /** Current Date — re-renders consumers every second. */
  now: Date;
  /** Seconds elapsed since the page first mounted (= REC duration). */
  elapsed: number;
}

/**
 * Single ticking clock for every CCTV element on the page. Returns the
 * current Date plus seconds-since-mount so REC timers stay in sync.
 * Pauses if the user prefers reduced motion.
 */
export function useSurveillanceClock(): SurveillanceClock {
  const [now, setNow] = useState(() => new Date());
  const startRef = useRef(Date.now());

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const elapsed = Math.floor((now.getTime() - startRef.current) / 1000);
  return { now, elapsed };
}

export function formatTimestamp(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

export function formatRecElapsed(seconds: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
