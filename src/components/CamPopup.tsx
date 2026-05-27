import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { CamFrame } from './ui/CamFrame';
import { type Artwork } from '../lib/artworks';
import { EASE_EDITORIAL } from '../lib/motion';

interface CamPopupProps {
  artworks: readonly Artwork[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

const POPUP_BUTTON_BASE = `
  absolute z-30
  flex items-center justify-center
  font-mono leading-none
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-signal)]
  transition-colors
`;

const NAV_BUTTON_CLASS = `${POPUP_BUTTON_BASE}
  top-1/2 -translate-y-1/2
  w-11 h-11 sm:w-12 sm:h-12
  bg-black/60 text-[var(--color-paper)] text-2xl
  hover:bg-[var(--color-signal)]
`;

const CLOSE_BUTTON_CLASS = `${POPUP_BUTTON_BASE}
  top-3 right-3 sm:-top-3 sm:-right-3
  w-11 h-11 text-xl
  bg-[var(--color-signal)] text-[var(--color-paper)]
  hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]
`;

/** Wrap-around step. delta=-1 → previous, delta=+1 → next. */
const step = (i: number, delta: number, total: number) =>
  (i + delta + total) % total;

/**
 * Full-screen "scaled CCTV picture" dialog with prev/next navigation.
 * Dismiss via close button, Escape key, or backdrop click. Navigate via
 * left/right buttons or ArrowLeft/ArrowRight. Wraps at both ends.
 */
export function CamPopup({
  artworks,
  index,
  onClose,
  onIndexChange,
}: CamPopupProps) {
  const { t } = useTranslation();
  const open = index !== null;
  const artwork = open ? artworks[index] : null;
  const total = artworks.length;
  const go = (delta: number) =>
    open && onIndexChange(step(index, delta, total));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onIndexChange(step(index, -1, total));
      else if (e.key === 'ArrowRight') onIndexChange(step(index, +1, total));
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, index, total, onClose, onIndexChange]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center sm:p-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${artwork.camId} — ${artwork.location}`}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full sm:h-auto sm:max-w-5xl"
          >
            <div className="relative w-full h-full sm:aspect-video sm:h-auto">
              <CamFrame
                camId={artwork.camId}
                location={artwork.location}
                className="absolute inset-0 h-full w-full"
              >
                <img
                  key={artwork.src}
                  src={artwork.src}
                  alt={t(artwork.altKey)}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </CamFrame>
            </div>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t('a11y.prevCam')}
              className={`${NAV_BUTTON_CLASS} left-2 sm:-left-6`}
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => go(+1)}
              aria-label={t('a11y.nextCam')}
              className={`${NAV_BUTTON_CLASS} right-2 sm:-right-6`}
            >
              ›
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={t('a11y.closeCam')}
              autoFocus
              className={CLOSE_BUTTON_CLASS}
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
