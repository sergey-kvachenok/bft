import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SECTION_IDS } from '../lib/constants';
import { cn } from '../lib/cn';
import { LINK_INLINE } from '../lib/ui';
import { Key } from '../lib/keys';

const NAV_ITEMS = [
  { id: SECTION_IDS.about, key: 'nav.about' },
  { id: SECTION_IDS.participants, key: 'nav.participants' },
  { id: SECTION_IDS.works, key: 'nav.works' },
  { id: SECTION_IDS.visit, key: 'nav.visit' },
] as const;

const MOBILE_NAV_ID = 'mobile-nav';

export function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === Key.Escape) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const handleNavClick = () => setOpen(false);

  return (
    <header
      className={cn(
        // sits below the fixed SurveillanceBand (h-7 = 28px)
        'fixed top-7 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[var(--color-ink)]/85 backdrop-blur-md border-b border-[var(--color-rule)]'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12 h-12 flex items-center justify-between gap-3">
        <a
          href="#hero"
          className="font-display text-lg sm:text-xl leading-none tracking-wide text-[var(--color-paper)] shrink-0"
          aria-label="Official. Unofficial. Belarus."
        >
          BFT<span className="text-[var(--color-signal)]">.</span>
        </a>

        <nav
          aria-label={t('nav.primary')}
          className="hidden md:flex items-center gap-7 font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={LINK_INLINE}
            >
              {t(item.key)}
            </a>
          ))}
          <span className="h-3 w-px bg-[var(--color-rule)]" aria-hidden />
          <LanguageSwitcher />
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={MOBILE_NAV_ID}
            aria-haspopup="menu"
            aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
            className="p-2 -mr-2 text-[var(--color-paper)]"
          >
            <span className="block w-6 h-px bg-current mb-1.5" />
            <span
              className={cn(
                'block w-6 h-px bg-current transition-opacity',
                open && 'opacity-0',
              )}
            />
            <span className="block w-6 h-px bg-current mt-1.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id={MOBILE_NAV_ID}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[var(--color-ink)] border-t border-[var(--color-rule)] overflow-hidden"
          >
            <nav
              aria-label={t('nav.primary')}
              className="px-4 sm:px-6 py-6 flex flex-col gap-5 font-display text-3xl"
            >
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={handleNavClick}
                  className="text-[var(--color-paper)]"
                >
                  {t(item.key)}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
