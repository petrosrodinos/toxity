import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-border bg-surface text-foreground',
        'shadow-[0_1px_2px_color-mix(in_oklch,black_6%,transparent)]',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export { Card };
