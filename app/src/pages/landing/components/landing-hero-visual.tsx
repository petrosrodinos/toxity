import { ScanLine, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SafetyBadge, ColorIndicators } from "@/components/ui/safety-badge";
import { cn } from "@/lib/utils";

const mock_ingredients = [
    { name: "Aqua", indicator: ColorIndicators.VERY_SAFE },
    { name: "Glycerin", indicator: ColorIndicators.SAFE },
    { name: "Phenoxyethanol", indicator: ColorIndicators.MODERATE },
    { name: "Fragrance", indicator: ColorIndicators.CAUTION },
] as const;

export function LandingHeroVisual({
    className,
    style,
}: {
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div className={cn("relative mx-auto w-full max-w-md", className)} style={style}>
            <div
                aria-hidden
                className="landing-glow pointer-events-none absolute -inset-8 rounded-full opacity-70"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/40"
            >
                Specimen · 04
            </div>

            <Card variant="tag" className="landing-card-rise relative overflow-hidden p-0 shadow-[0_24px_48px_color-mix(in_oklch,black_28%,transparent)]">
                <div className="border-b border-border bg-surface-secondary/80 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                                Analysis ready
                            </p>
                            <p className="truncate text-sm font-semibold text-foreground">
                                Daily Moisture Cream
                            </p>
                        </div>
                        <SafetyBadge indicator={ColorIndicators.MODERATE} compact />
                    </div>
                </div>

                <div className="space-y-3 p-4">
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-secondary/50 px-3 py-2">
                        <ScanLine className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                        <span className="font-mono text-xs text-muted">Barcode · 5901234123457</span>
                    </div>

                    <ul className="space-y-2">
                        {mock_ingredients.map((ingredient, index) => (
                            <li
                                key={ingredient.name}
                                className="landing-ingredient-row flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-surface-secondary/30 px-3 py-2"
                                style={{ animationDelay: `${240 + index * 80}ms` }}
                            >
                                <span className="text-sm text-foreground">{ingredient.name}</span>
                                <SafetyBadge indicator={ingredient.indicator} compact />
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-start gap-2 rounded-lg border border-accent/25 bg-accent/10 px-3 py-2.5">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                        <p className="text-xs leading-relaxed text-muted">
                            AI flagged fragrance as a potential irritant for sensitive skin. Other
                            ingredients look acceptable for daily use.
                        </p>
                    </div>
                </div>
            </Card>

            <div
                aria-hidden
                className="landing-card-rise absolute -bottom-4 -left-4 hidden rounded-lg border border-border bg-surface px-3 py-2 shadow-lg sm:block"
                style={{ animationDelay: "520ms" }}
            >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    12 ingredients
                </p>
                <p className="text-sm font-semibold text-foreground">2 flagged</p>
            </div>
        </div>
    );
}
