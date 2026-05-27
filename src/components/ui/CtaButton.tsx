import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { CTA_FILLED, CTA_OUTLINED } from '../../lib/ui';

interface CtaButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'filled' | 'outlined';
  external?: boolean;
  className?: string;
}

const VARIANT_CLASS = {
  filled: CTA_FILLED,
  outlined: CTA_OUTLINED,
} as const;

/** CTA-styled anchor. `external` adds target/rel for off-site links. */
export function CtaButton({
  href,
  children,
  variant = 'filled',
  external = false,
  className,
}: CtaButtonProps) {
  return (
    <a
      href={href}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className={cn(VARIANT_CLASS[variant], className)}
    >
      {children}
    </a>
  );
}
