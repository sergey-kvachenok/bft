import { useEffect, useRef, useState } from 'react';
import { pad } from './format';

// The exhibition is in Venice — render every CCTV timestamp in local Venice
// time (Europe/Rome), regardless of where the visitor is browsing from.
const VENICE_TZ = 'Europe/Rome';

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

// `sv-SE` formats as `YYYY-MM-DD HH:MM:SS` (24-hour, ISO-ish with a space) —
// the cheapest way to get the layout we want in an arbitrary IANA zone.
export function formatTimestamp(d: Date): string {
  return d.toLocaleString('sv-SE', { timeZone: VENICE_TZ });
}

export function formatRecElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}`;
}
