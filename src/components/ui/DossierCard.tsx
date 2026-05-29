import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { fadeUp, whileInViewProps } from '../../lib/motion';

interface DossierCardProps {
  /** Top-left REC label, e.g. "DOSSIER 01", "WORK 03". */
  tag: string;
  /** Signal-red label above the title (role, artist, etc.). */
  eyebrow: string;
  /** Display-font title (name of a person or work). */
  title: string;
  /** Photo to fill the CCTV feed. Omit to render the `fallback` instead. */
  photo?: { src: string; alt: string; credit?: string };
  /** Rendered inside the CCTV feed when `photo` is undefined. */
  fallback?: ReactNode;
  /** Variant content below the title (meta + body, BE subtitle + dl, etc.). */
  children?: ReactNode;
  /** When set with `photo`, the photo becomes a button that triggers this. */
  onPhotoClick?: () => void;
}

/**
 * One row in a "dossier wall" grid: CCTV-style photo tile on top, signal-red
 * eyebrow + display title below, and arbitrary `children` for per-section
 * detail (meta, subtitle, body). Used by Participants and Works.
 *
 * Must be rendered inside an `<ol>` — this component is an `<li>`.
 */
export function DossierCard({
  tag,
  eyebrow,
  title,
  photo,
  fallback,
  children,
  onPhotoClick,
}: DossierCardProps) {
  const { t } = useTranslation();

  return (
    <motion.li
      {...whileInViewProps}
      variants={fadeUp}
      className="flex flex-col"
    >
      <div className="cctv-feed scanlines relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-ink-2)] border border-[var(--color-rule)]">
        {photo ? (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          fallback
        )}

        <span
          className="
            absolute top-2 left-2 z-10
            flex items-center gap-1.5
            font-mono text-[10px] uppercase tracking-[0.2em]
            text-[var(--color-paper)]
            drop-shadow-[0_1px_2px_rgba(0,0,0,1)]
          "
        >
          <span
            aria-hidden
            className="rec-dot inline-block w-1.5 h-1.5 bg-[var(--color-signal)]"
          />
          <span>{tag}</span>
        </span>

        {photo?.credit && (
          <span
            aria-hidden="true"
            className="
              absolute bottom-2 right-2 z-10
              font-mono text-[9px] uppercase tracking-[0.18em]
              text-[var(--color-paper-2)]
              drop-shadow-[0_1px_2px_rgba(0,0,0,1)]
            "
          >
            {photo.credit}
          </span>
        )}

        {photo && onPhotoClick && (
          <button
            type="button"
            onClick={onPhotoClick}
            aria-label={t('a11y.enlargePhoto', { name: title })}
            className="
              absolute inset-0 z-20 cursor-zoom-in
              focus-visible:outline focus-visible:outline-2
              focus-visible:outline-[var(--color-signal)]
              focus-visible:-outline-offset-2
            "
          />
        )}
      </div>

      <div className="mt-5 sm:mt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-signal)] mb-3">
          — {eyebrow}
        </p>
        <h3
          className="font-display text-[var(--color-paper)] mb-2"
          style={{ fontSize: 'var(--text-display-sm)', lineHeight: 0.95 }}
        >
          {title}
        </h3>
        {children}
      </div>
    </motion.li>
  );
}
