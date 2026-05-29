/**
 * Source of truth for the seven participants of Official. Unofficial. Belarus.
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
  /** Omitted for Pushkin (died in custody, 2023) — card renders SIGNAL LOST. */
  photo?: {
    src: string;
    credit: string;
  };
}

const DIR = '/images/participants';
const photo = (slug: string, credit: string) => ({
  src: `${DIR}/${slug}.webp`,
  credit,
});

export const PARTICIPANTS: readonly Participant[] = [
  {
    slug: 'daniella-kaliada',
    name: 'Daniella Alexandra Kaliada',
    meta: 'b. 2000, Minsk',
    photo: photo('daniella-kaliada', 'Photo Francesco Barasciutti'),
  },
  {
    slug: 'nicolai-khalezin',
    name: 'Nicolai Khalezin MBE',
    meta: 'b. 1964, Minsk',
    photo: photo('nicolai-khalezin', 'Photo Anna Goltsberg, 2023'),
  },
  {
    slug: 'sergey-grinevich',
    name: 'Sergey Grinevich',
    meta: 'b. 1960, Grodno',
    photo: photo('sergey-grinevich', 'Photo Francesco Barasciutti'),
  },
  {
    slug: 'vladimir-tsesler',
    name: 'Vladimir Tsesler',
    meta: 'b. 1951, Minsk',
    photo: photo('vladimir-tsesler', 'Photo KANAPLEV+LEIDIK, 2025'),
  },
  {
    slug: 'volha-podgaiskaya',
    name: 'Volha Podgaiskaya',
    meta: 'b. 1979, Minsk',
    photo: photo('volha-podgaiskaya', 'Photo Francesco Barasciutti'),
  },
  {
    slug: 'rasmus-munk',
    name: 'Rasmus Munk',
    meta: 'b. 1991, Randers',
    photo: photo('rasmus-munk', 'Copyright Mathias Eis'),
  },
  {
    slug: 'ales-pushkin',
    name: 'Ales Pushkin',
    meta: '1965–2023, Bobruisk',
    // No portrait — Pushkin died in custody in 2023. Card renders as an
    // empty CCTV feed (signal lost) to honour the absence.
  },
] as const;
