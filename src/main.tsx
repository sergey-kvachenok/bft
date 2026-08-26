import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/react';
import './styles.css';
import './i18n/config';
import App from './App';
import { SITE } from './lib/site';

const container = document.getElementById('root')!;

/**
 * Counts the public site only. Preview deployments and any other alias serve
 * the same bundle, so drop anything not on the production host — the numbers
 * stay a record of real visitors rather than of our own deploys.
 */
const productionOnly = (event: BeforeSendEvent) =>
  new URL(event.url).hostname === new URL(SITE.url).hostname ? event : null;

// `Analytics` lives here rather than in App so the tree in `entry-server.tsx`
// stays an exact mirror. It renders no markup — the script is injected on the
// client — so hydration sees the same DOM either way.
const app = (
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
    <Analytics beforeSend={productionOnly} />
  </StrictMode>
);

// Production HTML is prerendered per locale by scripts/prerender.mjs, so it
// arrives with markup to hydrate. The dev server serves an empty shell.
if (container.firstChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
