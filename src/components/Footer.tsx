import { useTranslation } from 'react-i18next';
import { ASSETS, EXTERNAL_LINKS, SOCIAL_LINKS } from '../lib/constants';
import { LINK_INLINE } from '../lib/ui';
import { CtaButton } from './ui/CtaButton';
import { InstagramIcon } from './ui/InstagramIcon';

const LINKS = [
  { href: EXTERNAL_LINKS.bft, label: 'belarusfreetheatre.com' },
  { href: EXTERNAL_LINKS.biennale, label: 'labiennale.org' },
] as const;

const ARROW = ' →';

/**
 * A handle has no spaces, so a narrow phone would either overflow the box or
 * break it mid-word. Marking the dots as break opportunities keeps each
 * segment whole.
 */
const breakableHandle = (handle: string) => {
  const parts = handle.split('.');
  return parts.map((part, i) => (
    <span key={part}>
      {i === 0 ? `@${part}` : part}
      {i < parts.length - 1 && (
        <>
          .<wbr />
        </>
      )}
    </span>
  ));
};

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-ink-deep)] text-[var(--color-paper)] py-16 sm:py-20 border-t border-[var(--color-rule)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <p
            className="md:col-span-7 font-display"
            style={{ fontSize: 'var(--text-display-sm)', lineHeight: 0.9 }}
          >
            {t('footer.title')}
          </p>
          <div className="md:col-span-5 flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.2em]">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_INLINE}
              >
                {link.label}
                {ARROW}
              </a>
            ))}
            <a
              href={ASSETS.pressRelease}
              download={ASSETS.pressReleaseFilename}
              aria-label={t('footer.downloadPressReleaseAria')}
              className={LINK_INLINE}
            >
              {t('footer.downloadPressRelease')}
              {ARROW}
            </a>
          </div>
        </div>

        <div className="mt-14 sm:mt-16 pt-10 border-t border-[var(--color-rule)]">
          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[var(--color-signal)] mb-5">
            — {t('footer.follow')}
          </p>
          <ul className="flex flex-wrap gap-3 sm:gap-4">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.href} className="w-full sm:w-auto">
                <CtaButton
                  href={social.href}
                  variant="outlined"
                  external
                  ariaLabel={t('footer.instagramAria', { handle: social.handle })}
                  className="w-full sm:w-auto"
                >
                  <InstagramIcon className="w-4 h-4 shrink-0" />
                  <span>{breakableHandle(social.handle)}</span>
                </CtaButton>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-12 pt-6 border-t border-[var(--color-rule)] font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mute)]">
          © {year} {t('footer.credit')}
        </p>
      </div>
    </footer>
  );
}
