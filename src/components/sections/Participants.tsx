import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { DossierCard } from '../ui/DossierCard';
import { CamPopup, type PopupImage } from '../CamPopup';
import { SECTION_IDS } from '../../lib/constants';
import { PARTICIPANTS } from '../../lib/participants';
import { pad } from '../../lib/format';
import { fadeUp, whileInViewProps } from '../../lib/motion';

const dossierTag = (i: number) => `DOSSIER ${pad(i + 1, 2)}`;

// Only participants with photos can open the popup. Filter once, then map the
// participant's slug to the popup-array index so click handlers stay simple.
const PARTICIPANT_POPUP_IMAGES: readonly PopupImage[] = PARTICIPANTS.flatMap(
  (p, i) =>
    p.photo
      ? [
          {
            src: p.photo.src,
            alt: p.name,
            camId: dossierTag(i),
            location: p.name,
          },
        ]
      : [],
);

const POPUP_INDEX_BY_SLUG: ReadonlyMap<string, number> = new Map(
  PARTICIPANTS.filter((p) => p.photo).map((p, i) => [p.slug, i]),
);

export function Participants() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Section
      id={SECTION_IDS.participants}
      tone="ink"
      eyebrow={t('participants.eyebrow')}
      title={t('participants.title')}
      headerSize="lg"
    >
      <motion.p
        {...whileInViewProps}
        variants={fadeUp}
        className="max-w-3xl text-lg sm:text-xl leading-relaxed text-[var(--color-paper)] mb-16 sm:mb-20"
      >
        {t('participants.intro')}
      </motion.p>

      <ol className="grid gap-12 sm:gap-14 md:grid-cols-2 md:gap-x-10 md:gap-y-20">
        {PARTICIPANTS.map((p, i) => {
          const popupIndex = POPUP_INDEX_BY_SLUG.get(p.slug);
          return (
            <DossierCard
              key={p.slug}
              tag={dossierTag(i)}
              eyebrow={t(`participants.bios.${p.slug}.role`)}
              title={p.name}
              photo={
                p.photo
                  ? { src: p.photo.src, alt: p.name, credit: p.photo.credit }
                  : undefined
              }
              fallback={<NoSignal label={t('participants.noPortrait')} />}
              onPhotoClick={
                popupIndex !== undefined
                  ? () => setActiveIndex(popupIndex)
                  : undefined
              }
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mute)] mb-5">
                {p.meta}
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-[var(--color-paper)]">
                {t(`participants.bios.${p.slug}.body`)}
              </p>
            </DossierCard>
          );
        })}
      </ol>

      <CamPopup
        images={PARTICIPANT_POPUP_IMAGES}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
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
