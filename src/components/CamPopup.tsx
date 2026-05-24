import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { CamFrame } from './ui/CamFrame';
import { DEFAULT_CCTV_FILTER, type Tile } from '../lib/tiles';

interface CamPopupProps {
  tile: Tile | null;
  onClose: () => void;
}

/**
 * Full-screen "scaled CCTV picture" dialog. Opens when a tile in the
 * CamGrid is clicked. Dismiss via close button, Escape key, or backdrop click.
 * Mirrors the tile's framing (transform + filter) so the popup feels like
 * "the same camera, now full-screen."
 */
export function CamPopup({ tile, onClose }: CamPopupProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!tile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [tile, onClose]);

  return (
    <AnimatePresence>
      {tile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center sm:p-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${tile.camId} — ${tile.location}`}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full sm:h-auto sm:max-w-5xl"
          >
            <div className="relative w-full h-full sm:aspect-video sm:h-auto">
              <CamFrame
                camId={tile.camId}
                location={tile.location}
                bw={false}
                className="absolute inset-0 h-full w-full"
              >
                <img
                  src={tile.src}
                  alt={t(tile.altKey)}
                  loading="eager"
                  decoding="async"
                  style={{
                    transform: tile.transform,
                    objectPosition: tile.objectPosition,
                    filter: tile.filter ?? DEFAULT_CCTV_FILTER,
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </CamFrame>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t('a11y.closeCam')}
              autoFocus
              className="
                absolute top-3 right-3 sm:-top-3 sm:-right-3 z-30
                w-11 h-11
                flex items-center justify-center
                bg-[var(--color-signal)] text-[var(--color-paper)]
                font-mono text-xl leading-none
                hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]
                transition-colors
              "
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
