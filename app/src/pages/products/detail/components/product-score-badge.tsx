import type { FC } from "react";
import { SafetyBadge, type ColorIndicator } from "@/components/ui/safety-badge";
import { cn } from "@/lib/utils";
import { format_score } from "../utils/product-detail.utils";

interface ProductScoreBadgeProps {
    indicator: ColorIndicator;
    overall_score?: string | null;
    className?: string;
}

export const ProductScoreBadge: FC<ProductScoreBadgeProps> = ({
    indicator,
    overall_score,
    className,
}) => {
    const score_label = format_score(overall_score);

    return (
        <div className={cn("flex flex-wrap items-center gap-3", className)}>
            <SafetyBadge indicator={indicator} />
            {score_label ? (
                <span className="text-sm font-semibold text-foreground">
                    Score {score_label}
                </span>
            ) : null}
        </div>
    );
};
