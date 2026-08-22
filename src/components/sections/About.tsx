import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { SECTION_IDS, EXTERNAL_LINKS } from '../../lib/constants';
import { fadeUp, whileInViewProps } from '../../lib/motion';
import { LINK_BORDERED, MONO_LABEL } from '../../lib/ui';

const LINKS = [
  { href: EXTERNAL_LINKS.bft, key: 'about.linkBft' },
  { href: EXTERNAL_LINKS.biennale, key: 'about.linkBiennale' },
] as const;

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
        <div className="md:col-span-8">
          <p className="text-lg sm:text-xl leading-relaxed text-[var(--color-paper)]">
            {t('about.body')}
          </p>
          <div className="mt-10 sm:mt-12 border-l-2 border-[var(--color-signal)] bg-[var(--color-ink-2)] p-6 sm:p-8 space-y-5">
            <p className={`${MONO_LABEL} text-[var(--color-signal)]`}>
              {t('about.installation.label')}
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--color-paper)]">
              {t('about.installation.p1')}
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--color-paper)]">
              {t('about.installation.p2')}
            </p>
          </div>
        </div>
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
