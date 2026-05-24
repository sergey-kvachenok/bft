import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { CamFeedSlider } from '../CamFeedSlider';
import { SECTION_IDS, EXTERNAL_LINKS } from '../../lib/constants';
import { EASE_EDITORIAL } from '../../lib/motion';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id={SECTION_IDS.hero}
      className="relative min-h-[100dvh] overflow-hidden bg-[var(--color-ink)] text-[var(--color-paper)]"
    >
      <CamFeedSlider className="absolute inset-0" />

      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/30 to-black/85 pointer-events-none"
      />

      <div className="relative z-30 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-12 min-h-[100dvh] flex flex-col justify-between pt-24 pb-20 sm:pt-32 sm:pb-24 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_EDITORIAL, delay: 0.1 }}
          className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[var(--color-paper-2)]"
        >
          {t('hero.kicker')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: EASE_EDITORIAL, delay: 0.2 }}
          className="font-display whitespace-pre-line my-6 sm:my-8"
          style={{
            fontSize: 'var(--text-display-xl)',
            lineHeight: 0.85,
            letterSpacing: '-0.01em',
            textShadow: '0 4px 30px rgba(0,0,0,0.6)',
          }}
        >
          {t('hero.title')}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_EDITORIAL, delay: 0.7 }}
          className="flex flex-wrap items-center gap-2.5 sm:gap-3 pointer-events-auto"
        >
          <a
            href={`#${SECTION_IDS.about}`}
            className="
              inline-flex items-center justify-center
              bg-[var(--color-signal)] text-[var(--color-paper)]
              px-5 sm:px-7 py-3 sm:py-4
              font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium
              hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]
              transition-colors
            "
          >
            {t('hero.ctaAbout')}
          </a>
          <a
            href={EXTERNAL_LINKS.biennale}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center gap-2
              border border-[var(--color-paper)] text-[var(--color-paper)]
              px-5 sm:px-7 py-3 sm:py-4
              font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium
              hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]
              transition-colors
            "
          >
            {t('hero.ctaBiennale')}
            <span aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
