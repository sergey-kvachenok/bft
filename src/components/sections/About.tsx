import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';
import { SECTION_IDS, EXTERNAL_LINKS } from '../../lib/constants';
import { fadeUp, whileInViewProps } from '../../lib/motion';

export function About() {
  const { t } = useTranslation();

  return (
    <Section id={SECTION_IDS.about} tone="ink">
      <SectionHeader
        eyebrow={t('about.eyebrow')}
        title={t('about.title')}
        size="lg"
      />

      <motion.div
        {...whileInViewProps}
        variants={fadeUp}
        className="grid gap-10 md:grid-cols-12 md:gap-x-16"
      >
        <p className="md:col-span-8 text-lg sm:text-xl leading-relaxed text-[var(--color-paper)]">
          {t('about.body')}
        </p>
        <div className="md:col-span-4 md:pt-2 flex flex-col gap-3 self-start font-mono text-xs uppercase tracking-[0.18em]">
          <a
            href={EXTERNAL_LINKS.bft}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-b border-[var(--color-rule)] pb-2 text-[var(--color-paper)] hover:text-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors"
          >
            <span>{t('about.linkBft')}</span>
            <span aria-hidden className="ml-auto">→</span>
          </a>
          <a
            href={EXTERNAL_LINKS.biennale}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-b border-[var(--color-rule)] pb-2 text-[var(--color-paper)] hover:text-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors"
          >
            <span>{t('about.linkBiennale')}</span>
            <span aria-hidden className="ml-auto">→</span>
          </a>
        </div>
      </motion.div>
    </Section>
  );
}
