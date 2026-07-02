import { ScanBarcode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

const size_map = {
  sm: { icon: 18, text: 'text-xs' },
  md: { icon: 24, text: 'text-sm' },
  lg: { icon: 28, text: 'text-base' },
} as const;

export function BrandMark({ size = 'md', showWordmark = true, className }: BrandMarkProps) {
  const { icon, text } = size_map[size];

  return (
    <span className={cn('inline-flex items-center gap-2 min-w-0', className)}>
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-md"
        style={{
          width: icon + 10,
          height: icon + 10,
          background: 'linear-gradient(145deg, color-mix(in oklch, var(--accent) 88%, white), color-mix(in oklch, var(--accent) 65%, black))',
          boxShadow: '0 2px 8px color-mix(in oklch, var(--accent) 32%, transparent)',
        }}
      >
        <ScanBarcode
          style={{ width: icon, height: icon }}
          className="text-accent-foreground"
          strokeWidth={2.25}
        />
      </span>
      {showWordmark && (
        <span className={cn('font-semibold text-foreground truncate tracking-tight', text)} style={{ fontFamily: 'var(--heading)' }}>
          Toxity
        </span>
      )}
    </span>
  );
}
