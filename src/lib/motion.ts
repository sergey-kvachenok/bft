import type { Transition, Variants } from 'motion/react';

export const EASE_EDITORIAL = [0.2, 0.8, 0.2, 1] as const;

export const transition: Transition = {
  duration: 0.8,
  ease: EASE_EDITORIAL,
};

/** Reveal a block from below with a soft fade. Good for section headers. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition },
};

/** Pure fade — for elements where vertical movement would feel out of place. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_EDITORIAL } },
};

/** Stagger children — apply to a parent <motion.div>. */
export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/** Smaller, faster reveal for list items. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_EDITORIAL },
  },
};

/** Standard whileInView config — only fire once, with a sane margin. */
export const whileInViewProps = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '0px 0px -10% 0px' },
} as const;
