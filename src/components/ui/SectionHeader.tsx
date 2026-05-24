import { motion } from 'motion/react';
import { fadeUp, whileInViewProps } from '../../lib/motion';
import { cn } from '../../lib/cn';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  className?: string;
  align?: 'left' | 'center';
  size?: 'md' | 'lg';
}

export function SectionHeader({
  eyebrow,
  title,
  className,
  align = 'left',
  size = 'md',
}: SectionHeaderProps) {
  const titleSize =
    size === 'lg' ? 'text-display-lg' : 'text-display-md';

  return (
    <motion.header
      {...whileInViewProps}
      variants={fadeUp}
      className={cn(
        'mb-10 sm:mb-14 md:mb-16',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[var(--color-signal)] mb-4">
        — {eyebrow}
      </p>
      <h2
        className="font-display whitespace-pre-line"
        style={{ fontSize: `var(--${titleSize})`, lineHeight: 0.9 }}
      >
        {title}
      </h2>
    </motion.header>
  );
}
