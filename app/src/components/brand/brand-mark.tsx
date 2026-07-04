import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

const size_map = {
  sm: { mark: 28, text: 'text-xs' },
  md: { mark: 36, text: 'text-sm' },
  lg: { mark: 48, text: 'text-base' },
} as const;

export function BrandMark({ size = 'md', showWordmark = true, className }: BrandMarkProps) {
  const { mark, text } = size_map[size];

  return (
    <span className={cn('inline-flex items-center gap-2 min-w-0', className)}>
      <img
        src={logo}
        alt=""
        width={mark}
        height={mark}
        className="shrink-0 rounded-md object-cover"
      />
      {showWordmark && (
        <span className={cn('font-semibold text-foreground truncate tracking-tight', text)} style={{ fontFamily: 'var(--heading)' }}>
          Toxity
        </span>
      )}
    </span>
  );
}
