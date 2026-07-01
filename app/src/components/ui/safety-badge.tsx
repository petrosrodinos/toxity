import { cn } from '@/lib/utils';

export const ColorIndicators = {
  VERY_SAFE: 'VERY_SAFE',
  SAFE: 'SAFE',
  MODERATE: 'MODERATE',
  CAUTION: 'CAUTION',
  HIGH_RISK: 'HIGH_RISK',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ColorIndicator = (typeof ColorIndicators)[keyof typeof ColorIndicators];

const indicator_config: Record<
  ColorIndicator,
  { label: string; css_var: string; bg_mix: string }
> = {
  VERY_SAFE: { label: 'Very safe', css_var: 'var(--safety-very-safe)', bg_mix: '12%' },
  SAFE: { label: 'Safe', css_var: 'var(--safety-safe)', bg_mix: '12%' },
  MODERATE: { label: 'Moderate', css_var: 'var(--safety-moderate)', bg_mix: '14%' },
  CAUTION: { label: 'Caution', css_var: 'var(--safety-caution)', bg_mix: '14%' },
  HIGH_RISK: { label: 'High risk', css_var: 'var(--safety-high-risk)', bg_mix: '14%' },
  UNKNOWN: { label: 'Unknown', css_var: 'var(--safety-unknown)', bg_mix: '10%' },
};

interface SafetyBadgeProps {
  indicator: ColorIndicator;
  className?: string;
  compact?: boolean;
}

export function SafetyBadge({ indicator, className, compact = false }: SafetyBadgeProps) {
  const config = indicator_config[indicator];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        className,
      )}
      style={{
        color: config.css_var,
        background: `color-mix(in oklch, ${config.css_var} ${config.bg_mix}, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${config.css_var} 28%, transparent)`,
      }}
    >
      <span
        className="shrink-0 rounded-full"
        style={{
          width: compact ? 6 : 7,
          height: compact ? 6 : 7,
          background: config.css_var,
        }}
        aria-hidden
      />
      {config.label}
    </span>
  );
}
