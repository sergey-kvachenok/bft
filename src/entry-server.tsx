import { renderToString } from 'react-dom/server';
import { MotionConfig } from 'motion/react';
import i18n from './i18n/config';
import App from './App';
import type { Language } from './lib/locale';

/**
 * Build-time entry point used by `scripts/prerender.mjs`. Renders the page once
 * per language so each locale ships as real static HTML. Must mirror the tree
 * in `main.tsx` exactly, or hydration will mismatch.
 */
export async function render(locale: Language): Promise<string> {
  await i18n.changeLanguage(locale);

  return renderToString(
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>,
  );
}
