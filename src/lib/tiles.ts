/**
 * The "multi-view" CCTV wall. Reuses the 6 source photos with different
 * zoom levels, crops, and exposure to simulate cameras mounted at different
 * positions in the same rooms — close-up cameras, wide cameras, dimly-lit
 * night cameras, slightly-out-of-focus cameras, etc.
 *
 * No rotation effects — real CCTV cameras aren't mounted upside-down.
 */
export interface Tile {
  src: string;
  altKey: string;
  camId: string;
  location: string;
  /** CSS transform applied to the <img>. Default: none. */
  transform?: string;
  /** Where the image is anchored within its frame. Default: center. */
  objectPosition?: string;
  /** Overrides the default B&W CCTV filter. Default: DEFAULT_CCTV_FILTER. */
  filter?: string;
}

/** The standard CCTV monitor look — applied to every tile unless overridden. */
export const DEFAULT_CCTV_FILTER =
  'grayscale(1) contrast(1.08) brightness(0.92)';

/**
 * 18 distinct camera angles built from the 6 source images. The CamGrid
 * cycles through these to fill any screen width — each tile gets a unique
 * CAM ID (07, 08, 09…) but reuses one of these underlying configurations.
 */
const BASE_TILES: Array<Omit<Tile, 'camId'>> = [
  // entrance — wide, zoomed-on-sign, dimly-lit
  { src: '/exhibition/entrance.webp', altKey: 'feeds.entrance', location: 'УВАХОД' },
  {
    src: '/exhibition/entrance.webp',
    altKey: 'feeds.entrance',
    location: 'УВАХОД',
    transform: 'scale(2.2)',
    objectPosition: '50% 35%',
  },
  {
    src: '/exhibition/entrance.webp',
    altKey: 'feeds.entrance',
    location: 'УВАХОД',
    filter: 'grayscale(1) brightness(0.55) contrast(1.55)',
  },

  // cross — wide, zoomed-on-top, dim+OOF
  { src: '/exhibition/cross.webp', altKey: 'feeds.cross', location: 'CHAPEL' },
  {
    src: '/exhibition/cross.webp',
    altKey: 'feeds.cross',
    location: 'CHAPEL',
    transform: 'scale(1.8)',
    objectPosition: '50% 30%',
  },
  {
    src: '/exhibition/cross.webp',
    altKey: 'feeds.cross',
    location: 'CHAPEL',
    filter: 'grayscale(1) brightness(0.5) contrast(1.6) blur(0.4px)',
  },

  // sphere — wide, side-zoom, dim
  { src: '/exhibition/sphere.jpg', altKey: 'feeds.sphere', location: 'CHAPEL' },
  {
    src: '/exhibition/sphere.jpg',
    altKey: 'feeds.sphere',
    location: 'CHAPEL',
    transform: 'scale(1.7)',
    objectPosition: '65% 50%',
  },
  {
    src: '/exhibition/sphere.jpg',
    altKey: 'feeds.sphere',
    location: 'CHAPEL',
    filter: 'grayscale(1) brightness(0.6) contrast(1.45)',
  },

  // chapel — wide, side-zoom, deep night
  { src: '/exhibition/chapel.jpg', altKey: 'feeds.chapel', location: 'NAVE' },
  {
    src: '/exhibition/chapel.jpg',
    altKey: 'feeds.chapel',
    location: 'NAVE',
    transform: 'scale(1.8)',
    objectPosition: '35% 50%',
  },
  {
    src: '/exhibition/chapel.jpg',
    altKey: 'feeds.chapel',
    location: 'NAVE',
    filter: 'grayscale(1) brightness(0.45) contrast(1.65)',
  },

  // wheat — wide, zoom-center, OOF dim
  { src: '/exhibition/wheat.webp', altKey: 'feeds.wheat', location: 'HALL' },
  {
    src: '/exhibition/wheat.webp',
    altKey: 'feeds.wheat',
    location: 'HALL',
    transform: 'scale(2.0)',
    objectPosition: '50% 40%',
  },
  {
    src: '/exhibition/wheat.webp',
    altKey: 'feeds.wheat',
    location: 'HALL',
    filter: 'grayscale(1) brightness(0.7) contrast(1.4) blur(0.5px)',
  },

  // wheat-wide — wide, zoom-left, dim
  { src: '/exhibition/wheat-wide.jpg', altKey: 'feeds.wheatWide', location: 'HALL' },
  {
    src: '/exhibition/wheat-wide.jpg',
    altKey: 'feeds.wheatWide',
    location: 'HALL',
    transform: 'scale(1.6)',
    objectPosition: '30% 60%',
  },
  {
    src: '/exhibition/wheat-wide.jpg',
    altKey: 'feeds.wheatWide',
    location: 'HALL',
    filter: 'grayscale(1) brightness(0.55) contrast(1.55)',
  },
];

/**
 * Generated tile roster. Cycles the 18 base configurations to fill ~4000px
 * of horizontal space so the CamGrid spans full-width on any reasonable
 * viewport (mobile through ultra-wide).
 */
export const TILES: readonly Tile[] = Array.from({ length: 40 }, (_, i) => {
  const base = BASE_TILES[i % BASE_TILES.length];
  return {
    ...base,
    camId: `CAM ${String(i + 7).padStart(2, '0')}`,
  };
});
