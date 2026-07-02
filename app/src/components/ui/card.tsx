import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'tag';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `tag` adds a perforated "specimen tag" edge — reserve for product/ingredient
   *  cards where that identity matters; forms and generic surfaces stay `default`. */
  variant?: CardVariant;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative rounded-lg border border-border bg-surface text-foreground',
        'shadow-[0_1px_2px_color-mix(in_oklch,black_6%,transparent)]',
        variant === 'tag' && 'pt-4',
        className,
      )}
      {...props}
    >
      {variant === 'tag' && (
        <span aria-hidden className="tag-perforation absolute inset-x-3 top-2 h-px opacity-60" />
      )}
      {children}
    </div>
  ),
);
Card.displayName = 'Card';

export { Card };
