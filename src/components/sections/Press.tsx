import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { SECTION_IDS } from '../../lib/constants';
import { PRESS } from '../../lib/pressList';
import { dotDate, pad } from '../../lib/format';
import { fadeUp, whileInViewProps } from '../../lib/motion';

const META_SEPARATOR = '·';

export function Press() {
  const { t } = useTranslation();

  return (
    <Section
      id={SECTION_IDS.press}
      tone="ink"
      eyebrow={t('press.eyebrow')}
      title={t('press.title')}
      headerSize="lg"
    >
      <motion.p
        {...whileInViewProps}
        variants={fadeUp}
        className="max-w-3xl text-lg sm:text-xl leading-relaxed text-[var(--color-paper)] mb-16 sm:mb-20"
      >
        {t('press.intro')}
      </motion.p>

      <ol className="border-t border-[var(--color-rule)]">
        {PRESS.map((item, i) => (
          <motion.li
            key={item.slug}
            {...whileInViewProps}
            variants={fadeUp}
            className="border-b border-[var(--color-rule)]"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group grid gap-4 py-8 sm:py-10 md:grid-cols-12 md:gap-x-10
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-[var(--color-signal)]
                focus-visible:outline-offset-4
              "
            >
              <div className="md:col-span-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-paper-2)] flex flex-wrap items-center gap-x-2 gap-y-1">
                <span aria-hidden className="text-[var(--color-signal)]">
                  {pad(i + 1, 2)}
                </span>
                <span className="text-[var(--color-paper)]">{item.outlet}</span>
                <span aria-hidden className="text-[var(--color-mute)]">
                  {META_SEPARATOR}
                </span>
                <span>{t(`press.kinds.${item.kind}`)}</span>
                {item.date && (
                  <>
                    <span aria-hidden className="text-[var(--color-mute)]">
                      {META_SEPARATOR}
                    </span>
                    <time dateTime={item.date} className="text-[var(--color-mute)]">
                      {dotDate(item.date)}
                    </time>
                  </>
                )}
              </div>

              <div className="md:col-span-8">
                <h3
                  className="font-display text-[var(--color-paper)] group-hover:text-[var(--color-signal)] transition-colors mb-3"
                  style={{ fontSize: 'var(--text-display-sm)', lineHeight: 1 }}
                >
                  {item.headline}
                </h3>
                <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--color-paper-2)]">
                  {t(`press.items.${item.slug}.summary`)}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-signal)]">
                  {t('press.read', { outlet: item.outlet })}
                  <span aria-hidden>→</span>
                </span>
              </div>
            </a>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
