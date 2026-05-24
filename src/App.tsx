export default function App() {
  return (
    <main className="relative min-h-[100dvh] flex flex-col bg-[var(--color-ink)] text-[var(--color-paper)] overflow-hidden">
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8 font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[var(--color-paper-2)]">
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block w-2 h-2 bg-[var(--color-signal)] rec-dot"
          />
          Status: Maintenance
        </span>
        <span>Belarus Free Theatre</span>
      </header>

      <section className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-16 mx-auto w-full max-w-6xl">
        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[var(--color-paper-2)] mb-6 sm:mb-8">
          Official. Unofficial. Belarus.
        </p>

        <h1
          className="font-display"
          style={{
            fontSize: 'var(--text-display-xl)',
            lineHeight: 0.85,
            letterSpacing: '-0.01em',
          }}
        >
          Officially
          <br />
          <span className="text-[var(--color-signal)]">coming soon</span>
        </h1>

        <p className="mt-8 sm:mt-10 max-w-xl font-sans text-base sm:text-lg text-[var(--color-paper-2)] leading-relaxed">
          Something is being prepared here. Check back shortly.
        </p>
      </section>

      <footer className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8 font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[var(--color-mute)]">
        © {new Date().getFullYear()} — All rights reserved
      </footer>
    </main>
  );
}
