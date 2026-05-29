import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { CtaButton } from '../ui/CtaButton';
import { EXTERNAL_LINKS, SECTION_IDS } from '../../lib/constants';
import { fadeUp, whileInViewProps } from '../../lib/motion';

export function Visit() {
  const { t } = useTranslation();

  return (
    <Section
      id={SECTION_IDS.visit}
      tone="ink"
      eyebrow={t('visit.eyebrow')}
      title={t('visit.title')}
    >
      <motion.div
        {...whileInViewProps}
        variants={fadeUp}
        className="max-w-2xl"
      >
        <p className="text-lg sm:text-xl leading-relaxed text-[var(--color-paper)] mb-8">
          {t('visit.body')}
        </p>
        <CtaButton href={EXTERNAL_LINKS.biennale} external className="gap-2">
          {t('visit.cta')}
          <span aria-hidden>→</span>
        </CtaButton>
      </motion.div>
    </Section>
  );
}
