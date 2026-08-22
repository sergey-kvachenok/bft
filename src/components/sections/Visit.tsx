import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { CtaButton } from '../ui/CtaButton';
import { EXTERNAL_LINKS, SECTION_IDS } from '../../lib/constants';
import { LINK_BORDERED, MONO_LABEL } from '../../lib/ui';
import { fadeUp, whileInViewProps } from '../../lib/motion';

const DETAIL_KEYS = ['dates', 'hours', 'admission', 'location', 'address'] as const;

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
        <dl className="mb-10 border-t border-[var(--color-rule)]">
          {DETAIL_KEYS.map((key) => (
            <div
              key={key}
              className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6 py-4 border-b border-[var(--color-rule)]"
            >
              <dt className={`${MONO_LABEL} text-[var(--color-signal)] pt-1`}>
                {t(`visit.labels.${key}`)}
              </dt>
              <dd className="text-lg sm:text-xl leading-relaxed text-[var(--color-paper)]">
                {t(`visit.${key}`)}
                {key === 'hours' && (
                  <span className="block text-[var(--color-paper-2)]">
                    {t('visit.closed')}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <CtaButton href={EXTERNAL_LINKS.venueMap} external className="gap-2">
          {t('visit.cta')}
          <span aria-hidden>→</span>
        </CtaButton>
        <p className="mt-8 text-sm sm:text-base text-[var(--color-paper)]">
          {t('visit.ticketsNote')}{' '}
          <a
            href={EXTERNAL_LINKS.biennale}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_BORDERED}
          >
            labiennale.org
          </a>
        </p>
      </motion.div>
    </Section>
  );
}
