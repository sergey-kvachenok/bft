import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';
import { SECTION_IDS } from '../../lib/constants';
import { PARTICIPANTS } from '../../lib/participants';
import { pad } from '../../lib/format';
import { fadeUp, whileInViewProps } from '../../lib/motion';

export function Participants() {
  const { t } = useTranslation();

  return (
    <Section id={SECTION_IDS.participants} tone="ink">
      <SectionHeader
        eyebrow={t('participants.eyebrow')}
        title={t('participants.title')}
        size="lg"
      />

      <motion.p
        {...whileInViewProps}
        variants={fadeUp}
        className="max-w-3xl text-lg sm:text-xl leading-relaxed text-[var(--color-paper)] mb-16 sm:mb-20"
      >
        {t('participants.intro')}
      </motion.p>

      <ol className="grid gap-12 sm:gap-14 md:grid-cols-2 md:gap-x-10 md:gap-y-20">
        {PARTICIPANTS.map((p, i) => {
          const dossier = `DOSSIER ${pad(i + 1, 2)}`;
          const role = t(`participants.bios.${p.slug}.role`);
          const body = t(`participants.bios.${p.slug}.body`);
          return (
            <motion.li
              key={p.slug}
              {...whileInViewProps}
              variants={fadeUp}
              className="flex flex-col"
            >
              <div className="cctv-feed scanlines relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-ink-2)] border border-[var(--color-rule)]">
                {p.photo ? (
                  <img
                    src={p.photo.src}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <NoSignal label={t('participants.noPortrait')} />
                )}

                <span
                  className="
                    absolute top-2 left-2 z-10
                    flex items-center gap-1.5
                    font-mono text-[10px] uppercase tracking-[0.2em]
                    text-[var(--color-paper)]
                    drop-shadow-[0_1px_2px_rgba(0,0,0,1)]
                  "
                >
                  <span
                    aria-hidden
                    className="rec-dot inline-block w-1.5 h-1.5 bg-[var(--color-signal)]"
                  />
                  <span>{dossier}</span>
                </span>

                {p.photo && (
                  <span
                    className="
                      absolute bottom-2 right-2 z-10
                      font-mono text-[9px] uppercase tracking-[0.18em]
                      text-[var(--color-paper-2)]
                      drop-shadow-[0_1px_2px_rgba(0,0,0,1)]
                    "
                  >
                    {p.photo.credit}
                  </span>
                )}
              </div>

              <div className="mt-5 sm:mt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-signal)] mb-3">
                  — {role}
                </p>
                <h3
                  className="font-display text-[var(--color-paper)] mb-2"
                  style={{ fontSize: 'var(--text-display-sm)', lineHeight: 0.95 }}
                >
                  {p.name}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mute)] mb-5">
                  {p.meta}
                </p>
                <p className="text-base sm:text-lg leading-relaxed text-[var(--color-paper)]">
                  {body}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </Section>
  );
}

function NoSignal({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,var(--color-ink-3)_0%,var(--color-ink)_100%)]">
      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[var(--color-signal)] text-center px-6">
        {label}
      </span>
    </div>
  );
}
