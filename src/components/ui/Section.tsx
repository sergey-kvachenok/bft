import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { SectionHeader } from './SectionHeader';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Tone reverses ink/paper — useful for breaking the page rhythm. */
  tone?: 'ink' | 'paper';
  /** Drop the default vertical padding. */
  bare?: boolean;
  eyebrow?: string;
  title?: string;
  headerSize?: 'md' | 'lg';
  headerAlign?: 'left' | 'center';
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
  eyebrow,
  title,
  headerSize,
  headerAlign,
}: SectionProps) {
  const headingId = title ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      tabIndex={-1}
      className={cn(
        TONES[tone],
        !bare && 'py-20 sm:py-28 md:py-36',
        'relative',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        {eyebrow && title && (
          <SectionHeader
            titleId={headingId}
            eyebrow={eyebrow}
            title={title}
            size={headerSize}
            align={headerAlign}
          />
        )}
        {children}
      </div>
    </section>
  );
}
