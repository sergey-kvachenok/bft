import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { SECTION_IDS } from '../../lib/constants';
import { FAQ_SLUGS, type FaqBulletList } from '../../lib/faqList';
import { pad } from '../../lib/format';
import { fadeUp, whileInViewProps } from '../../lib/motion';

const SUMMARY_MARKER_HIDDEN =
  'list-none [&::-webkit-details-marker]:hidden [&::marker]:content-none';

export function Faq() {
  const { t } = useTranslation();

  return (
    <Section
      id={SECTION_IDS.faq}
      tone="ink"
      eyebrow={t('faq.eyebrow')}
      title={t('faq.title')}
      headerSize="lg"
    >
      <motion.p
        {...whileInViewProps}
        variants={fadeUp}
        className="max-w-3xl text-lg sm:text-xl leading-relaxed text-[var(--color-paper)] mb-16 sm:mb-20"
      >
        {t('faq.intro')}
      </motion.p>

      <ul className="border-t border-[var(--color-rule)]">
        {FAQ_SLUGS.map((slug, i) => {
          const paragraphs = t(`faq.items.${slug}.a`, {
            returnObjects: true,
          }) as string[];
          const lists = t(`faq.items.${slug}.lists`, {
            returnObjects: true,
            defaultValue: [],
          }) as FaqBulletList[];

          return (
            <motion.li
              key={slug}
              {...whileInViewProps}
              variants={fadeUp}
              className="border-b border-[var(--color-rule)]"
            >
              <details className="group">
                <summary
                  className={`
                    ${SUMMARY_MARKER_HIDDEN}
                    flex items-start justify-between gap-4 cursor-pointer py-7 sm:py-8
                    md:grid md:grid-cols-12 md:gap-x-10
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-[var(--color-signal)]
                    focus-visible:outline-offset-4
                  `}
                >
                  <span
                    aria-hidden
                    className="md:col-span-1 shrink-0 pt-1 md:pt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-signal)]"
                  >
                    {pad(i + 1, 2)}
                  </span>
                  <h3
                    className="flex-1 md:col-span-10 font-display text-[var(--color-paper)] group-hover:text-[var(--color-signal)] transition-colors"
                    style={{ fontSize: 'var(--text-display-sm)', lineHeight: 1.05 }}
                  >
                    {t(`faq.items.${slug}.q`)}
                  </h3>
                  <span
                    aria-hidden
                    className="md:col-span-1 shrink-0 justify-self-end pt-1 md:pt-2 font-mono text-lg leading-none text-[var(--color-signal)] transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>

                <div className="pb-10 md:grid md:grid-cols-12 md:gap-x-10">
                  <div className="md:col-start-2 md:col-span-10 max-w-3xl space-y-5">
                    {paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base sm:text-lg leading-relaxed text-[var(--color-paper-2)]"
                      >
                        {paragraph}
                      </p>
                    ))}

                    {lists.map((list) => (
                      <div key={list.label ?? list.items[0]} className="pt-1">
                        {list.label && (
                          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-signal)] mb-3">
                            {list.label}
                          </p>
                        )}
                        <ul className="space-y-2">
                          {list.items.map((item) => (
                            <li
                              key={item}
                              className="pl-5 -indent-5 text-base sm:text-lg leading-relaxed text-[var(--color-paper-2)]"
                            >
                              <span aria-hidden className="text-[var(--color-mute)]">
                                —{' '}
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </motion.li>
          );
        })}
      </ul>
    </Section>
  );
}
