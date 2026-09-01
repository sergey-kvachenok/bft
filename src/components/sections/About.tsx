import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { SECTION_IDS, INSTAGRAM_LINKS } from '../../lib/constants';
import { fadeUp, whileInViewProps } from '../../lib/motion';
import { LINK_BORDERED } from '../../lib/ui';
import { InstagramIcon } from '../ui/InstagramIcon';
import { InstagramHandle } from '../ui/InstagramHandle';

const LINKS = [INSTAGRAM_LINKS.bft, INSTAGRAM_LINKS.exhibition] as const;

export function About() {
  const { t } = useTranslation();

  return (
    <Section
      id={SECTION_IDS.about}
      tone="ink"
      eyebrow={t('about.eyebrow')}
      title={t('about.title')}
      headerSize="lg"
    >
      <motion.div
        {...whileInViewProps}
        variants={fadeUp}
        className="grid gap-10 md:grid-cols-12 md:gap-x-16"
      >
        <p className="md:col-span-8 text-lg sm:text-xl leading-relaxed text-[var(--color-paper)]">
          {t('about.body')}
        </p>
        <div className="md:col-span-4 md:pt-2 flex flex-col gap-3 self-start font-mono text-xs uppercase tracking-[0.18em]">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('a11y.instagramAria', { handle: link.handle })}
              className={LINK_BORDERED}
            >
              <InstagramIcon className="w-4 h-4 shrink-0" />
              <InstagramHandle handle={link.handle} />
              <span aria-hidden className="ml-auto">→</span>
            </a>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
