export const SECTION_IDS = {
  hero: 'hero',
  about: 'about',
  visit: 'visit',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export const EXTERNAL_LINKS = {
  bft: 'https://belarusfreetheatre.com',
  biennale: 'https://www.labiennale.org',
} as const;
