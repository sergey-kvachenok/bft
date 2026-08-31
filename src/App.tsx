import { useTranslation } from 'react-i18next';
import { SurveillanceBand } from './components/SurveillanceBand';
import { Header } from './components/Header';
import { Hero } from './components/sections/Hero';
import { CamGrid } from './components/CamGrid';
import { About } from './components/sections/About';
import { Participants } from './components/sections/Participants';
import { Works } from './components/sections/Works';
import { Press } from './components/sections/Press';
import { Faq } from './components/sections/Faq';
import { Visit } from './components/sections/Visit';
import { Footer } from './components/Footer';
import { useHashFocus } from './lib/useHashFocus';
import { useDocumentMeta } from './lib/useDocumentMeta';
import { useLocaleHistory } from './lib/useLocaleRouting';

export default function App() {
  const { t } = useTranslation();

  useLocaleHistory();
  useDocumentMeta();
  useHashFocus();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-[var(--color-signal)] focus:text-[var(--color-on-signal)] focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.2em]"
      >
        {t('a11y.skipToContent')}
      </a>

      <SurveillanceBand />
      <Header />
      <main id="main">
        <Hero />
        <CamGrid />
        <About />
        <Participants />
        <Works />
        <Press />
        <Faq />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
