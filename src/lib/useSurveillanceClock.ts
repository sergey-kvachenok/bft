import { useEffect, useRef, useState } from 'react';
import { pad } from './format';

// The exhibition is in Venice — render every CCTV timestamp in local Venice
// time (Europe/Rome), regardless of where the visitor is browsing from.
const VENICE_TZ = 'Europe/Rome';

// Prerendered HTML cannot carry a real clock: the build-time value would be
// wrong by the time anyone reads it, and would mismatch on hydration. These
// placeholders are the same width as the real strings, so nothing shifts when
// the clock starts on mount.
const TIMESTAMP_PLACEHOLDER = '0000-00-00 00:00:00';
const ELAPSED_PLACEHOLDER = '00:00:00';

export interface SurveillanceClock {
  /** Venice-local wall clock, `YYYY-MM-DD HH:MM:SS`. */
  timestamp: string;
  /** Time since first paint as `HH:MM:SS` (= REC duration). */
  recElapsed: string;
}

/**
 * Single ticking clock for every CCTV element on the page, pre-formatted so
 * consumers never touch `Date` (and so the server-rendered markup is stable).
 * Pauses if the user prefers reduced motion.
 */
export function useSurveillanceClock(): SurveillanceClock {
  const [now, setNow] = useState<Date | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = Date.now();
    setNow(new Date());

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;

    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null || startRef.current === null) {
    return {
      timestamp: TIMESTAMP_PLACEHOLDER,
      recElapsed: ELAPSED_PLACEHOLDER,
    };
  }

  return {
    timestamp: formatTimestamp(now),
    recElapsed: formatElapsed(
      Math.floor((now.getTime() - startRef.current) / 1000),
    ),
  };
}

// `sv-SE` formats as `YYYY-MM-DD HH:MM:SS` (24-hour, ISO-ish with a space) —
// the cheapest way to get the layout we want in an arbitrary IANA zone.
function formatTimestamp(d: Date): string {
  return d.toLocaleString('sv-SE', { timeZone: VENICE_TZ });
}

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}`;
}
