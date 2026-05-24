export default function App() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[var(--color-ink)] text-[var(--color-paper)]">
      <header
        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 sm:px-6 md:px-10 lg:px-16 pt-5 sm:pt-7 md:pt-9 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[var(--color-paper-2)]"
        style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}
      >
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block w-2 h-2 bg-[var(--color-signal)] rec-dot"
          />
          <span>Status: Maintenance</span>
        </span>
        <span className="whitespace-nowrap">Belarus Free Theatre</span>
      </header>

      <main className="flex-1 flex flex-col justify-center mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-14 md:py-20">
        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[var(--color-paper-2)] mb-4 sm:mb-6 md:mb-8">
          Official. Unofficial. Belarus.
        </p>

        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(2.25rem, min(13vw, 22vh), 12rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
          }}
        >
          Officially
          <br />
          <span className="text-[var(--color-signal)]">coming soon</span>
        </h1>

        <p className="mt-6 sm:mt-8 md:mt-10 max-w-prose font-sans text-sm sm:text-base md:text-lg text-[var(--color-paper-2)] leading-relaxed">
          Something is being prepared here. Check back shortly.
        </p>
      </main>

      <footer
        className="px-4 sm:px-6 md:px-10 lg:px-16 pb-5 sm:pb-7 md:pb-9 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[var(--color-mute)]"
        style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
      >
        © {new Date().getFullYear()} — All rights reserved
      </footer>
    </div>
  );
}
