import type { FC } from "react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { SafetyBadge } from "@/components/ui/safety-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Routes } from "@/routes/routes";
import type { Ingredient } from "@/features/ingredients/interfaces/ingredients.interfaces";

type IngredientSpotlightCardProps = {
    ingredient: Ingredient | undefined | null;
    is_loading: boolean;
};

const IngredientSpotlightCard: FC<IngredientSpotlightCardProps> = ({
    ingredient,
    is_loading,
}) => {
    if (is_loading) {
        return (
            <Card className="space-y-2 p-5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
            </Card>
        );
    }

    if (!ingredient) {
        return null;
    }

    return (
        <Link to={Routes.ingredients.detail(ingredient.uuid)}>
            <Card className="space-y-2 p-5 transition-colors hover:bg-surface-secondary">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ingredient spotlight
                </p>
                <p
                    className="text-lg font-semibold text-foreground"
                    style={{ fontFamily: "var(--heading)" }}
                >
                    {ingredient.name}
                </p>
                {ingredient.ai_summary ? (
                    <p className="line-clamp-2 text-sm text-muted">
                        {ingredient.ai_summary}
                    </p>
                ) : null}
                <SafetyBadge indicator={ingredient.color_indicator} compact />
            </Card>
        </Link>
    );
};

export default IngredientSpotlightCard;
