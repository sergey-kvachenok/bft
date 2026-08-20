import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import './styles.css';
import './i18n/config';
import App from './App';

const container = document.getElementById('root')!;

const app = (
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>
);

// Production HTML is prerendered per locale by scripts/prerender.mjs, so it
// arrives with markup to hydrate. The dev server serves an empty shell.
if (container.firstChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
