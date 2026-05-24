import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';
import { EXTERNAL_LINKS, SECTION_IDS } from '../../lib/constants';
import { fadeUp, whileInViewProps } from '../../lib/motion';

export function Visit() {
  const { t } = useTranslation();

  return (
    <Section id={SECTION_IDS.visit} tone="ink">
      <SectionHeader
        eyebrow={t('visit.eyebrow')}
        title={t('visit.title')}
      />

      <motion.div
        {...whileInViewProps}
        variants={fadeUp}
        className="max-w-2xl"
      >
        <p className="text-lg sm:text-xl leading-relaxed text-[var(--color-paper)] mb-8">
          {t('visit.body')}
        </p>
        <a
          href={EXTERNAL_LINKS.biennale}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[var(--color-signal)] text-[var(--color-paper)] px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] font-medium hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)] transition-colors"
        >
          {t('visit.cta')}
          <span aria-hidden>→</span>
        </a>
      </motion.div>
    </Section>
  );
}
