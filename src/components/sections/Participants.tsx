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

const PARTICIPANT_POPUP_IMAGES: readonly PopupImage[] = PARTICIPANTS.map(
  (p, i) => ({
    src: p.photo.src,
    alt: p.name,
    camId: dossierTag(i),
    location: p.name,
  }),
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
        {PARTICIPANTS.map((p, i) => (
          <DossierCard
            key={p.slug}
            tag={dossierTag(i)}
            eyebrow={t(`participants.bios.${p.slug}.role`)}
            title={p.name}
            photo={{ src: p.photo.src, alt: p.name, credit: p.photo.credit }}
            onPhotoClick={() => setActiveIndex(i)}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mute)] mb-5">
              {p.meta}
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--color-paper)]">
              {t(`participants.bios.${p.slug}.body`)}
            </p>
          </DossierCard>
        ))}
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
