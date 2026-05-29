import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { DossierCard } from '../ui/DossierCard';
import { CamPopup, type PopupImage } from '../CamPopup';
import { SECTION_IDS } from '../../lib/constants';
import { WORKS } from '../../lib/worksList';
import { pad } from '../../lib/format';
import { fadeUp, whileInViewProps } from '../../lib/motion';

// Every photo in this set is by the same photographer, so the credit is
// constant across cards — kept local because it lives next to its only use.
const PHOTO_CREDIT = '© Belarus Free Theatre. Photo Dasha Trofimova';

const workTag = (i: number) => `WORK ${pad(i + 1, 2)}`;
const workSrc = (slug: string) => `/images/works/${slug}.webp`;
const workAlt = (w: (typeof WORKS)[number]) =>
  `${w.titleEn} (${w.titleBe}) — ${w.artist}`;

const WORK_POPUP_IMAGES: readonly PopupImage[] = WORKS.map((w, i) => ({
  src: workSrc(w.slug),
  alt: workAlt(w),
  camId: workTag(i),
  location: w.titleEn,
}));

export function Works() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Section
      id={SECTION_IDS.works}
      tone="ink"
      eyebrow={t('works.eyebrow')}
      title={t('works.title')}
      headerSize="lg"
    >
      <motion.p
        {...whileInViewProps}
        variants={fadeUp}
        className="max-w-3xl text-lg sm:text-xl leading-relaxed text-[var(--color-paper)] mb-16 sm:mb-20"
      >
        {t('works.intro')}
      </motion.p>

      <ol className="grid gap-12 sm:gap-14 md:grid-cols-2 md:gap-x-10 md:gap-y-20">
        {WORKS.map((w, i) => (
          <DossierCard
            key={w.slug}
            tag={workTag(i)}
            eyebrow={w.artist}
            title={w.titleEn}
            photo={{
              src: workSrc(w.slug),
              alt: workAlt(w),
              credit: PHOTO_CREDIT,
            }}
            onPhotoClick={() => setActiveIndex(i)}
          >
            <p
              className="font-display text-[var(--color-mute)] mb-5"
              style={{ fontSize: '1.5rem', lineHeight: 1 }}
              lang="be"
            >
              {w.titleBe}
            </p>
            <dl className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-paper-2)] space-y-1.5">
              <div>
                <span className="text-[var(--color-mute)]">{w.year}</span>
                <span aria-hidden className="text-[var(--color-mute)] mx-2">
                  ·
                </span>
                <span>{w.medium}</span>
              </div>
              {w.dimensions && (
                <div className="text-[var(--color-mute)]">{w.dimensions}</div>
              )}
            </dl>
          </DossierCard>
        ))}
      </ol>

      <CamPopup
        images={WORK_POPUP_IMAGES}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </Section>
  );
}
