import type { FC } from "react";
import { Card } from "@/components/ui/card";
import type { ProductDetail } from "@/features/products/interfaces/products.interfaces";
import {
    IngredientDetailField,
    IngredientDetailSection,
} from "@/pages/ingredients/components/ingredient-detail-parts";

interface ProductSummaryProps {
    product: ProductDetail;
}

export const ProductSummary: FC<ProductSummaryProps> = ({ product }) => {
    const has_content =
        product.ai_summary ||
        product.benefits ||
        product.risks ||
        product.warnings;

    if (!has_content) {
        return null;
    }

    return (
        <section className="space-y-3">
            <h2
                className="text-lg font-semibold text-foreground"
                style={{ fontFamily: "var(--heading)" }}
            >
                Product summary
            </h2>
            <Card className="divide-y divide-border p-5">
                {product.ai_summary ? (
                    <div className="pb-5">
                        <p className="text-sm leading-relaxed text-foreground">
                            {product.ai_summary}
                        </p>
                    </div>
                ) : null}
                <div className={product.ai_summary ? "pt-5" : ""}>
                    <IngredientDetailSection title="Analysis">
                        <IngredientDetailField
                            label="Benefits"
                            value={product.benefits}
                        />
                        <IngredientDetailField label="Risks" value={product.risks} />
                        <IngredientDetailField
                            label="Warnings"
                            value={product.warnings}
                        />
                    </IngredientDetailSection>
                </div>
            </Card>
        </section>
    );
};
