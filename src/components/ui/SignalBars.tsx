import { cn } from '../../lib/cn';

interface SignalBarsProps {
  size?: 'sm' | 'md';
  className?: string;
}

const BAR_HEIGHTS: Record<NonNullable<SignalBarsProps['size']>, readonly number[]> = {
  sm: [2, 4, 6, 8, 10],
  md: [3, 5, 7, 9, 11],
};

const CONTAINER_HEIGHT: Record<NonNullable<SignalBarsProps['size']>, string> = {
  sm: 'h-2.5',
  md: 'h-3',
};

/** Stylized cellular-signal bars used in CCTV chrome. */
export function SignalBars({ size = 'md', className }: SignalBarsProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex items-end gap-px',
        CONTAINER_HEIGHT[size],
        className,
      )}
    >
      {BAR_HEIGHTS[size].map((h) => (
        <span
          key={h}
          className="w-px bg-[var(--color-paper)]"
          style={{ height: `${h}px` }}
        />
      ))}
    </span>
  );
}
