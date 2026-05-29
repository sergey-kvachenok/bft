import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { SurveillanceBand } from './components/SurveillanceBand';
import { Header } from './components/Header';
import { Hero } from './components/sections/Hero';
import { CamGrid } from './components/CamGrid';
import { About } from './components/sections/About';
import { Participants } from './components/sections/Participants';
import { Visit } from './components/sections/Visit';
import { Footer } from './components/Footer';

export default function App() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? 'en';
  }, [i18n.resolvedLanguage]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-[var(--color-signal)] focus:text-[var(--color-paper)] focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.2em]"
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
        <Visit />
      </main>
      <Footer />
    </>
  );
}
