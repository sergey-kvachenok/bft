/**
 * Single source of truth for the CCTV feed roster — used by the slider in
 * the Hero and the camera count shown in the SurveillanceBand.
 * Order is the playback order of the auto-cycle.
 */
export interface Feed {
  src: string;
  altKey: string;
  camId: string;
  location?: string;
}

export const FEEDS: readonly Feed[] = [
  {
    src: '/exhibition/entrance.webp',
    altKey: 'feeds.entrance',
    camId: 'CAM 01',
    location: 'УВАХОД',
  },
  {
    src: '/exhibition/cross.webp',
    altKey: 'feeds.cross',
    camId: 'CAM 02',
    location: 'CHAPEL',
  },
  {
    src: '/exhibition/sphere.jpg',
    altKey: 'feeds.sphere',
    camId: 'CAM 03',
    location: 'CHAPEL',
  },
  {
    src: '/exhibition/chapel.jpg',
    altKey: 'feeds.chapel',
    camId: 'CAM 04',
    location: 'NAVE',
  },
  {
    src: '/exhibition/wheat.webp',
    altKey: 'feeds.wheat',
    camId: 'CAM 05',
    location: 'HALL',
  },
  {
    src: '/exhibition/wheat-wide.jpg',
    altKey: 'feeds.wheatWide',
    camId: 'CAM 06',
    location: 'HALL',
  },
] as const;

export const CAM_COUNT_LABEL = `CAM 01–${String(FEEDS.length).padStart(2, '0')}`;
export const CAM_COUNT_TOTAL = String(FEEDS.length).padStart(3, '0');
export const FEED_CYCLE_MS = 5500;
