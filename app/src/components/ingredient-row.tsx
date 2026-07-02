import type { FC } from "react";
import { ChevronRight, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { SafetyBadge, type ColorIndicator } from "@/components/ui/safety-badge";
import { Routes } from "@/routes/routes";

type IngredientRowItem = {
    uuid: string;
    name: string;
    color_indicator: ColorIndicator;
    ai_summary?: string | null;
};

const IngredientRow: FC<{ ingredient: IngredientRowItem }> = ({ ingredient }) => {
    return (
        <Link to={Routes.ingredients.detail(ingredient.uuid)}>
            <Card className="flex items-center gap-3 p-3 transition-colors hover:bg-surface-secondary">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
                    <FlaskConical className="h-5 w-5 text-muted" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                        {ingredient.name}
                    </p>
                    {ingredient.ai_summary ? (
                        <p className="truncate text-xs text-muted">
                            {ingredient.ai_summary}
                        </p>
                    ) : null}
                    <div className="mt-1.5">
                        <SafetyBadge indicator={ingredient.color_indicator} compact />
                    </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
            </Card>
        </Link>
    );
};

export default IngredientRow;
