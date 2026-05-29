import { useEffect } from 'react';

/**
 * Move keyboard focus to the element referenced by `location.hash` on every
 * hash change. The browser scrolls but doesn't focus, so SR/keyboard users
 * would otherwise keep navigating from the header. Targets must be
 * focusable (tabindex=-1 is enough).
 */
export function useHashFocus() {
  useEffect(() => {
    const focusFromHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      el?.focus({ preventScroll: true });
    };
    window.addEventListener('hashchange', focusFromHash);
    return () => window.removeEventListener('hashchange', focusFromHash);
  }, []);
}
