import type { Variants } from 'motion/react';

export const EASE_EDITORIAL = [0.2, 0.8, 0.2, 1] as const;

/** Reveal a block from below with a soft fade. Good for section headers. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_EDITORIAL },
  },
};

/** Standard whileInView config — only fire once, with a sane margin. */
export const whileInViewProps = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '0px 0px -10% 0px' },
} as const;
