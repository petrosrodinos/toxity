import { useState, type FC } from "react";
import type { ProductIngredientItem } from "@/features/products/interfaces/products.interfaces";
import { IngredientAccordion } from "./ingredient-accordion";

interface IngredientAccordionListProps {
    ingredients: ProductIngredientItem[];
}

export const IngredientAccordionList: FC<IngredientAccordionListProps> = ({
    ingredients,
}) => {
    const [expanded_uuid, set_expanded_uuid] = useState<string | null>(null);

    if (ingredients.length === 0) {
        return null;
    }

    return (
        <section className="space-y-3">
            <h2
                className="text-xl font-bold uppercase tracking-wide text-accent sm:text-2xl"
                style={{ fontFamily: "var(--heading)" }}
            >
                Ingredients
            </h2>
            <div className="space-y-2">
                {ingredients.map((item) => (
                    <IngredientAccordion
                        key={item.ingredient.uuid}
                        position={item.position}
                        ingredient={item.ingredient}
                        is_expanded={expanded_uuid === item.ingredient.uuid}
                        on_toggle={() =>
                            set_expanded_uuid((current) =>
                                current === item.ingredient.uuid
                                    ? null
                                    : item.ingredient.uuid,
                            )
                        }
                    />
                ))}
            </div>
        </section>
    );
};
