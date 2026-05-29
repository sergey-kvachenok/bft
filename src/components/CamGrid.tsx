import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GRID_ARTWORKS } from '../lib/artworks';
import { STORAGE_KEYS } from '../lib/constants';
import { cn } from '../lib/cn';
import { CamPopup } from './CamPopup';

const TILE_PX = 100;
const GRID_ROWS = 2;
const TILE_SIZE = `${TILE_PX}px`;
const GRID_HEIGHT = `${TILE_PX * GRID_ROWS}px`;
const STORAGE_KEY = STORAGE_KEYS.lastViewedArtwork;

const readLastViewed = (max: number): number | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 && n < max ? n : null;
};

/**
 * Multi-view CCTV wall. 2 rows of TILE_PX-square tiles, horizontally
 * scrollable, with enough tiles to span any viewport width. Each tile is a
 * button that opens the CamPopup.
 *
 * The most recently opened tile is highlighted (signal ring + REVIEWED tag)
 * and persisted to localStorage, so an accidental popup-close still leaves
 * the user a way back to where they were.
 */
export function CamGrid() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lastViewed, setLastViewed] = useState<number | null>(() =>
    readLastViewed(GRID_ARTWORKS.length),
  );
  const lastTileRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (lastViewed === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, String(lastViewed));
  }, [lastViewed]);

  const openAt = (i: number) => {
    setActiveIndex(i);
    setLastViewed(i);
  };

  // On first paint, if a tile is remembered, scroll it into view so the user
  // can spot it without scanning the whole grid.
  useEffect(() => {
    lastTileRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'center',
    });
  }, []);

  return (
    <>
      <section
        aria-label={t('camGrid.aria')}
        className="bg-black border-y border-[var(--color-rule)] relative"
      >
        <div className="overflow-x-auto no-scrollbar flex">
          <div
            className="grid grid-rows-2 grid-flow-col gap-px mx-auto shrink-0"
            style={{ gridAutoColumns: TILE_SIZE, height: GRID_HEIGHT }}
          >
            {GRID_ARTWORKS.map((artwork, i) => {
              const isLast = i === lastViewed;
              return (
                <button
                  key={artwork.camId}
                  ref={isLast ? lastTileRef : undefined}
                  type="button"
                  onClick={() => openAt(i)}
                  aria-label={`${artwork.camId} · ${artwork.location}${
                    isLast ? ` · ${t('camGrid.resume')}` : ''
                  }`}
                  aria-current={isLast ? 'true' : undefined}
                  style={{ width: TILE_SIZE, height: TILE_SIZE }}
                  className={cn(
                    'cctv-feed relative overflow-hidden bg-[var(--color-ink-2)]',
                    'cursor-crosshair scanlines outline-none',
                    'focus-visible:ring-2 focus-visible:ring-[var(--color-signal)]',
                    isLast &&
                      'ring-2 ring-[var(--color-signal)] ring-inset z-10',
                  )}
                >
                  <img
                    src={artwork.thumbSrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <span
                    aria-hidden="true"
                    className="
                      absolute top-1 left-1 z-10
                      flex items-center gap-1
                      font-mono text-[8px] uppercase tracking-[0.15em]
                      text-[var(--color-paper)]
                      drop-shadow-[0_1px_2px_rgba(0,0,0,1)]
                    "
                  >
                    <span className="rec-dot inline-block w-1 h-1 bg-[var(--color-signal)]" />
                    <span>{artwork.camId}</span>
                  </span>

                  {isLast && (
                    <span
                      aria-hidden
                      className="
                        absolute bottom-1 right-1 z-10
                        px-1 py-px
                        bg-[var(--color-signal)] text-[var(--color-paper)]
                        font-mono text-[8px] uppercase tracking-[0.15em] leading-none
                      "
                    >
                      {t('camGrid.last')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* edge fades to imply more cameras beyond the visible viewport */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black to-transparent"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black to-transparent"
        />
      </section>

      <CamPopup
        artworks={GRID_ARTWORKS}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={(i) => {
          setActiveIndex(i);
          setLastViewed(i);
        }}
      />
    </>
  );
}
