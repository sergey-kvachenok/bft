import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';
import { SECTION_IDS, EXTERNAL_LINKS } from '../../lib/constants';
import { fadeUp, whileInViewProps } from '../../lib/motion';
import { LINK_BORDERED } from '../../lib/ui';

const LINKS = [
  { href: EXTERNAL_LINKS.bft, key: 'about.linkBft' },
  { href: EXTERNAL_LINKS.biennale, key: 'about.linkBiennale' },
] as const;

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
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_BORDERED}
            >
              <span>{t(link.key)}</span>
              <span aria-hidden className="ml-auto">→</span>
            </a>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
