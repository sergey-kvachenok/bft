/**
 * Source of truth for the six participants of Official. Unofficial. Belarus.
 * Photo files come from public/images/participants/<slug>.webp, generated
 * by scripts/optimize-images.mjs.
 *
 * Bio text lives in i18n locales under `participants.bios.<slug>.{role,body}`
 * so it can be translated. Keep the slug list in sync there.
 */
export interface Participant {
  /** kebab-case key; also the i18n bio key and webp filename stem. */
  slug: string;
  name: string;
  meta: string;
  photo: string;
}

const DIR = '/images/participants';
const photo = (slug: string) => `${DIR}/${slug}.webp`;

export const PARTICIPANTS: readonly Participant[] = [
  {
    slug: 'daniella-kaliada',
    name: 'Daniella Alexandra Kaliada',
    meta: 'b. 2000, Minsk',
    photo: photo('daniella-kaliada'),
  },
  {
    slug: 'nicolai-khalezin',
    name: 'Nicolai Khalezin MBE',
    meta: 'b. 1964, Minsk',
    photo: photo('nicolai-khalezin'),
  },
  {
    slug: 'sergey-grinevich',
    name: 'Sergey Grinevich',
    meta: 'b. 1960, Grodno',
    photo: photo('sergey-grinevich'),
  },
  {
    slug: 'vladimir-tsesler',
    name: 'Vladimir Tsesler',
    meta: 'b. 1951, Minsk',
    photo: photo('vladimir-tsesler'),
  },
  {
    slug: 'volha-podgaiskaya',
    name: 'Volha Podgaiskaya',
    meta: 'b. 1979, Minsk',
    photo: photo('volha-podgaiskaya'),
  },
  {
    slug: 'rasmus-munk',
    name: 'Rasmus Munk',
    meta: 'b. 1991, Randers',
    photo: photo('rasmus-munk'),
  },
] as const;
