/**
 * Q&A entries for the press-facing FAQ section. Order here is the order on the
 * page; all copy lives in i18n under `faq.items.<slug>`:
 *
 *   q      — the question
 *   a      — array of answer paragraphs
 *   lists  — optional bullet groups rendered after the paragraphs
 */
export interface FaqBulletList {
  /** Optional group heading; omit for a single unlabelled list. */
  label?: string;
  items: string[];
}

export const FAQ_SLUGS = [
  'bft',
  'politics',
  'exile',
  'curators',
  'artists',
  'munk',
  'origin',
  'confessional',
  'testimonies',
  'restoration',
] as const;
