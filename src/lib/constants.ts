export const SECTION_IDS = {
  hero: 'hero',
  about: 'about',
  participants: 'participants',
  works: 'works',
  press: 'press',
  visit: 'visit',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export const EXTERNAL_LINKS = {
  bft: 'https://belarusfreetheatre.com',
  biennale: 'https://www.labiennale.org',
} as const;

const INSTAGRAM = 'https://www.instagram.com';

export const SOCIAL_LINKS = [
  { handle: 'official.unofficial.belarus' },
  { handle: 'belarusfreetheatre' },
].map(({ handle }) => ({ handle, href: `${INSTAGRAM}/${handle}` }));

export const ASSETS = {
  pressRelease: '/press-release.docx',
  pressReleaseFilename: 'Press Release ENG_Official. Unofficial. Belarus.docx',
} as const;

export const STORAGE_KEYS = {
  lastViewedArtwork: 'bft.lastViewedArtwork',
} as const;
