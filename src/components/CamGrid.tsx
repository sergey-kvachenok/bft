import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TILES, type Tile, DEFAULT_CCTV_FILTER } from '../lib/tiles';
import { CamPopup } from './CamPopup';

/**
 * Multi-view CCTV wall. 200px tall, 2 rows of 100px square tiles,
 * horizontally scrollable, with enough tiles to span any viewport width.
 * Each tile is a button that opens the scaled-up CamPopup with the same
 * camera framing applied.
 */
export function CamGrid() {
  const { t } = useTranslation();
  const [active, setActive] = useState<Tile | null>(null);

  return (
    <>
      <section
        aria-label={t('camGrid.aria')}
        className="bg-black border-y border-[var(--color-rule)] relative"
      >
        <div className="overflow-x-auto no-scrollbar">
          <div
            className="grid grid-rows-2 grid-flow-col gap-px"
            style={{ gridAutoColumns: '100px', height: '200px' }}
          >
            {TILES.map((tile) => (
              <button
                key={tile.camId}
                type="button"
                onClick={() => setActive(tile)}
                aria-label={`${tile.camId} · ${tile.location}`}
                className="
                  relative w-[100px] h-[100px] overflow-hidden bg-[var(--color-ink-2)]
                  cursor-crosshair scanlines
                  outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-signal)]
                "
              >
                <img
                  src={tile.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{
                    transform: tile.transform,
                    objectPosition: tile.objectPosition,
                    filter: tile.filter ?? DEFAULT_CCTV_FILTER,
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* mini burn-in: rec dot + cam id */}
                <span
                  className="
                    absolute top-1 left-1 z-10
                    flex items-center gap-1
                    font-mono text-[8px] uppercase tracking-[0.15em]
                    text-[var(--color-paper)]
                    drop-shadow-[0_1px_2px_rgba(0,0,0,1)]
                  "
                >
                  <span
                    aria-hidden
                    className="rec-dot inline-block w-1 h-1 bg-[var(--color-signal)]"
                  />
                  <span>{tile.camId}</span>
                </span>
              </button>
            ))}
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

      <CamPopup tile={active} onClose={() => setActive(null)} />
    </>
  );
}
