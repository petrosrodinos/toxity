import type { FC } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ColorIndicators,
    SafetyBadge,
    type ColorIndicator,
} from "@/components/ui/safety-badge";
import { useGetIngredient } from "@/features/ingredients/hooks/use-ingredients";
import type { Ingredient } from "@/features/ingredients/interfaces/ingredients.interfaces";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import {
    IngredientDetailField,
    IngredientDetailSection,
} from "../components/ingredient-detail-parts";

const to_color_indicator = (value: string): ColorIndicator => {
    if (value in ColorIndicators) {
        return value as ColorIndicator;
    }
    return ColorIndicators.UNKNOWN;
};

const format_score = (score?: string | null) => {
    if (!score) return null;
    return `${score} / 20`;
};

const IngredientDetailContent: FC<{ ingredient: Ingredient }> = ({
    ingredient,
}) => {
    const color_indicator = to_color_indicator(ingredient.color_indicator);

    return (
        <div className="mx-auto max-w-2xl space-y-6 pb-8">
            <div className="flex items-start gap-3">
                <Link
                    to={Routes.search.root}
                    aria-label="Back to search"
                    className="mt-0.5 inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-2 text-foreground transition-colors hover:bg-surface-secondary"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div className="min-w-0 flex-1">
                    <h1
                        className="text-2xl font-semibold text-foreground"
                        style={{ fontFamily: "var(--heading)" }}
                    >
                        {ingredient.name}
                    </h1>
                    {ingredient.scientific_name ? (
                        <p className="mt-1 text-sm italic text-muted">
                            {ingredient.scientific_name}
                        </p>
                    ) : null}
                    {ingredient.synonyms && ingredient.synonyms.length > 0 ? (
                        <p className="mt-2 text-xs text-muted">
                            Also known as: {ingredient.synonyms.join(", ")}
                        </p>
                    ) : null}
                </div>
            </div>

            <Card className="flex flex-wrap items-center gap-3 p-4">
                <SafetyBadge indicator={color_indicator} />
                {ingredient.overall_score ? (
                    <span className="text-sm font-semibold text-foreground">
                        Score {format_score(ingredient.overall_score)}
                    </span>
                ) : null}
            </Card>

            {ingredient.ai_summary ? (
                <Card className="p-5">
                    <p className="text-sm leading-relaxed text-foreground">
                        {ingredient.ai_summary}
                    </p>
                </Card>
            ) : null}

            <Card className="divide-y divide-border p-5">
                <div className="pb-5">
                    <IngredientDetailSection title="General">
                        <IngredientDetailField
                            label="Description"
                            value={ingredient.description ?? ingredient.full_description}
                        />
                        <IngredientDetailField label="Purpose" value={ingredient.purpose} />
                        <IngredientDetailField
                            label="Common uses"
                            value={ingredient.common_uses}
                        />
                    </IngredientDetailSection>
                </div>

                <div className="py-5">
                    <IngredientDetailSection title="AI analysis">
                        <IngredientDetailField label="Benefits" value={ingredient.benefits} />
                        <IngredientDetailField label="Risks" value={ingredient.risks} />
                        <IngredientDetailField
                            label="Safety explanation"
                            value={ingredient.safety_explanation}
                        />
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <IngredientDetailField
                                label="Safety score"
                                value={format_score(ingredient.safety_score)}
                            />
                            <IngredientDetailField
                                label="Risk score"
                                value={format_score(ingredient.risk_score)}
                            />
                            <IngredientDetailField
                                label="Confidence"
                                value={format_score(ingredient.confidence_score)}
                            />
                        </div>
                    </IngredientDetailSection>
                </div>

                <div className="py-5">
                    <IngredientDetailSection title="Health">
                        <IngredientDetailField
                            label="Pregnancy safety"
                            value={ingredient.pregnancy_safety}
                        />
                        <IngredientDetailField
                            label="Child safety"
                            value={ingredient.child_safety}
                        />
                        <IngredientDetailField
                            label="Allergy risk"
                            value={ingredient.allergy_risk}
                        />
                        <IngredientDetailField
                            label="Carcinogenic evidence"
                            value={ingredient.carcinogenic_evidence}
                        />
                        <IngredientDetailField
                            label="Hormone disruption"
                            value={ingredient.hormone_disruption_risk}
                        />
                        <IngredientDetailField
                            label="Irritation risk"
                            value={ingredient.irritation_risk}
                        />
                    </IngredientDetailSection>
                </div>

                <div className="py-5">
                    <IngredientDetailSection title="Cosmetic">
                        <IngredientDetailField
                            label="Acne rating"
                            value={ingredient.acne_rating}
                        />
                        <IngredientDetailField
                            label="Comedogenic rating"
                            value={ingredient.comedogenic_rating}
                        />
                        <IngredientDetailField
                            label="Sensitive skin"
                            value={ingredient.sensitive_skin_suitability}
                        />
                    </IngredientDetailSection>
                </div>

                <div className="py-5">
                    <IngredientDetailSection title="Sustainability">
                        <IngredientDetailField
                            label="Environmental impact"
                            value={ingredient.environmental_impact}
                        />
                        <IngredientDetailField label="Vegan" value={ingredient.is_vegan} />
                        <IngredientDetailField
                            label="Cruelty free"
                            value={ingredient.is_cruelty_free}
                        />
                        <IngredientDetailField
                            label="Biodegradable"
                            value={ingredient.is_biodegradable}
                        />
                    </IngredientDetailSection>
                </div>

                {(ingredient.research_summary ||
                    (ingredient.references && ingredient.references.length > 0)) && (
                    <div className="pt-5">
                        <IngredientDetailSection title="Scientific">
                            <IngredientDetailField
                                label="Research summary"
                                value={ingredient.research_summary}
                            />
                            {ingredient.references && ingredient.references.length > 0 ? (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                                        References
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
                        </IngredientDetailSection>
                    </div>
                )}
            </Card>
        </div>
    );
};

const IngredientDetailPage: FC = () => {
    const { ingredient_uuid = "" } = useParams<{ ingredient_uuid: string }>();
    const navigate = useNavigate();
    const { data, isLoading, isError, error } = useGetIngredient(ingredient_uuid);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-2xl space-y-4">
                <div className="h-8 w-2/3 animate-pulse rounded-lg bg-surface-secondary" />
                <div className="h-24 animate-pulse rounded-xl bg-surface-secondary" />
                <div className="h-64 animate-pulse rounded-xl bg-surface-secondary" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="mx-auto max-w-2xl">
                <Card className="p-8 text-center">
                    <p className="text-sm font-medium text-foreground">
                        Could not load ingredient
                    </p>
                    <p className={cn("mt-1 text-xs text-muted")}>
                        {error?.message ?? "This ingredient may not exist."}
                    </p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate(Routes.search.root)}
                    >
                        Back to search
                    </Button>
                </Card>
            </div>
        );
    }

    return <IngredientDetailContent ingredient={data} />;
};

export default IngredientDetailPage;
