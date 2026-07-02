import type { FC } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SafetyBadge } from "@/components/ui/safety-badge";
import type { Ingredient } from "@/features/ingredients/interfaces/ingredients.interfaces";
import {
    IngredientDetailField,
    IngredientLink,
} from "@/pages/ingredients/components/ingredient-detail-parts";
import { cn } from "@/lib/utils";
import {
    format_score,
    to_color_indicator,
} from "../utils/product-detail.utils";

interface IngredientAccordionProps {
    position: number;
    ingredient: Ingredient;
    is_expanded: boolean;
    on_toggle: () => void;
}

export const IngredientAccordion: FC<IngredientAccordionProps> = ({
    position,
    ingredient,
    is_expanded,
    on_toggle,
}) => {
    const color_indicator = to_color_indicator(ingredient.color_indicator);
    const panel_id = `ingredient-panel-${ingredient.uuid}`;
    const header_id = `ingredient-header-${ingredient.uuid}`;

    return (
        <Card className="overflow-hidden p-0">
            <button
                type="button"
                id={header_id}
                aria-expanded={is_expanded}
                aria-controls={panel_id}
                onClick={on_toggle}
                className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-surface-secondary/60"
            >
                <SafetyBadge indicator={color_indicator} compact />
                <span className="min-w-0 flex-1 font-medium text-foreground">
                    {position}. {ingredient.name}
                </span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 shrink-0 text-muted transition-transform duration-200",
                        is_expanded && "rotate-180",
                    )}
                    aria-hidden
                />
            </button>

            {is_expanded ? (
                <div
                    id={panel_id}
                    role="region"
                    aria-labelledby={header_id}
                    className="border-t border-border px-4 pb-5 pt-4"
                >
                    <div className="mb-4">
                        <IngredientLink
                            ingredient_uuid={ingredient.uuid}
                            name={`View full ${ingredient.name} profile`}
                        />
                    </div>

                    <div className="space-y-3 text-sm text-foreground/90">
                        <IngredientDetailField
                            label="Risk explanation"
                            value={ingredient.safety_explanation}
                        />
                        <IngredientDetailField
                            label="Short summary"
                            value={ingredient.ai_summary}
                        />
                        <IngredientDetailField
                            label="Scientific description"
                            value={
                                ingredient.full_description ??
                                ingredient.description
                            }
                        />
                        <IngredientDetailField
                            label="Benefits"
                            value={ingredient.benefits}
                        />
                        <IngredientDetailField label="Risks" value={ingredient.risks} />
                        <IngredientDetailField
                            label="Purpose in product"
                            value={ingredient.purpose}
                        />
                        <IngredientDetailField
                            label="Common uses"
                            value={ingredient.common_uses}
                        />
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted">
                                Safety rating
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <SafetyBadge indicator={color_indicator} compact />
                                {ingredient.overall_score ? (
                                    <span className="text-sm">
                                        {format_score(ingredient.overall_score)}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                        <IngredientDetailField
                            label="Environmental impact"
                            value={ingredient.environmental_impact}
                        />
                        <IngredientDetailField
                            label="Pregnancy safety"
                            value={ingredient.pregnancy_safety}
                        />
                        <IngredientDetailField
                            label="Children safety"
                            value={ingredient.child_safety}
                        />
                        <IngredientDetailField
                            label="Allergy information"
                            value={ingredient.allergy_risk}
                        />
                        <IngredientDetailField
                            label="Comedogenic rating"
                            value={ingredient.comedogenic_rating}
                        />
                        <IngredientDetailField
                            label="Acne suitability"
                            value={ingredient.acne_rating}
                        />
                        <IngredientDetailField
                            label="Sensitive skin suitability"
                            value={ingredient.sensitive_skin_suitability}
                        />
                        <IngredientDetailField
                            label="Confidence score"
                            value={format_score(ingredient.confidence_score)}
                        />
                        {ingredient.references && ingredient.references.length > 0 ? (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                                    Scientific references
                                </p>
                                <ul className="mt-2 space-y-2">
                                    {ingredient.references.map((reference) => (
                                        <li key={reference.url}>
                                            <a
                                                href={reference.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-accent underline-offset-4 hover:underline"
                                            >
                                                {reference.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </Card>
    );
};
