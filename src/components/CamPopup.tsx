import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { CamFrame } from './ui/CamFrame';
import { EASE_EDITORIAL } from '../lib/motion';
import { Key } from '../lib/keys';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/** Image data the popup needs. alt is already-resolved text, not an i18n key. */
export interface PopupImage {
  src: string;
  alt: string;
  camId: string;
  location: string;
}

interface CamPopupProps {
  images: readonly PopupImage[];
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
  images,
  index,
  onClose,
  onIndexChange,
}: CamPopupProps) {
  const { t } = useTranslation();
  const open = index !== null;
  const image = open ? images[index] : null;
  const total = images.length;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const go = (delta: number) =>
    open && onIndexChange(step(index, delta, total));

  // Capture opener on transition into open; restore on close. Kept separate
  // from the keydown effect so navigation steps don't re-capture mid-cycle.
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    return () => {
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === Key.Escape) {
        onClose();
        return;
      }
      if (e.key === Key.ArrowLeft) {
        onIndexChange(step(index, -1, total));
        return;
      }
      if (e.key === Key.ArrowRight) {
        onIndexChange(step(index, +1, total));
        return;
      }
      if (e.key === Key.Tab && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
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
      {image && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center sm:p-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${image.camId} — ${image.location}`}
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
                camId={image.camId}
                location={image.location}
                className="absolute inset-0 h-full w-full"
              >
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain"
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
