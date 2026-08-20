/**
 * Press coverage of Official. Unofficial. Belarus. (Venice 2026).
 *
 * Headlines stay in the outlet's own language regardless of UI locale — they
 * are citations, not copy. Summary text lives in i18n under
 * `press.items.<slug>.summary` and the kind label under `press.kinds.<kind>`,
 * so both translate. Keep the slug list in sync there.
 */
export type PressKind = 'feature' | 'interview' | 'podcast' | 'roundup';

export interface PressItem {
  /** kebab-case key; also the i18n summary key. */
  slug: string;
  outlet: string;
  /** Verbatim headline as published. */
  headline: string;
  url: string;
  /** Publication date, ISO `YYYY-MM-DD`. Omitted when the outlet shows none. */
  date?: string;
  kind: PressKind;
}

export const PRESS: readonly PressItem[] = [
  {
    slug: 'guardian-totalitarian-terror',
    outlet: 'The Guardian',
    headline:
      '‘The doorbell went at 5am. Six masked men were outside’: Belarus Free Theatre bring totalitarian terror to the Venice Biennale',
    url: 'https://www.theguardian.com/artanddesign/2026/apr/28/belarus-free-theatre-venice-biennale',
    date: '2026-04-28',
    kind: 'feature',
  },
  {
    slug: 'artnews-what-repression-feels-like',
    outlet: 'ARTnews',
    headline:
      'Belarus Free Theatre’s Venice Exhibition Shows What Repression Feels Like',
    url: 'https://www.artnews.com/art-news/news/belarus-free-theatre-venice-exhibition-interview-1234782107/',
    kind: 'interview',
  },
  {
    slug: 'frieze-censorship-exile-politics',
    outlet: 'Frieze',
    headline:
      'Belarus Free Theatre on Censorship, Exile and the Politics of the Venice Biennale',
    url: 'https://www.frieze.com/article/belarus-free-theatre-interview-venice-biennale',
    date: '2026-05-08',
    kind: 'interview',
  },
  {
    slug: 'art-newspaper-podcast',
    outlet: 'The Art Newspaper',
    headline: 'Venice Biennale Special 2026 — podcast',
    url: 'https://www.theartnewspaper.com/2026/05/08/venice-biennale-special-2026podcast',
    date: '2026-05-08',
    kind: 'podcast',
  },
  {
    slug: 'art-newspaper-best-pavilions',
    outlet: 'The Art Newspaper',
    headline: 'Our pick of the best pavilions at the 61st Venice Biennale',
    url: 'https://www.theartnewspaper.com/2026/05/06/our-pick-of-the-best-pavilions-at-the-61st-venice-biennale',
    date: '2026-05-06',
    kind: 'roundup',
  },
  {
    slug: 'artnet-best-in-show',
    outlet: 'Artnet News',
    headline: 'Best in Show: 6 Standouts at the 2026 Venice Biennale',
    url: 'https://news.artnet.com/art-world/venice-biennale-picks-2026-2771280',
    kind: 'roundup',
  },
] as const;
