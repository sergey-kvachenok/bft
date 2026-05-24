import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Tone reverses ink/paper — useful for breaking the page rhythm. */
  tone?: 'ink' | 'paper';
  /** Drop the default vertical padding. */
  bare?: boolean;
}

const TONES: Record<NonNullable<SectionProps['tone']>, string> = {
  ink: 'bg-[var(--color-ink)] text-[var(--color-paper)]',
  paper: 'bg-[var(--color-paper)] text-[var(--color-ink)]',
};

export function Section({
  id,
  children,
  className,
  tone = 'ink',
  bare = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        TONES[tone],
        !bare && 'py-20 sm:py-28 md:py-36',
        'relative',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}
