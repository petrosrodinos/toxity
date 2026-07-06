import type { FC } from "react";
import { Card } from "@/components/ui/card";
import type { ProductDetail } from "@/features/products/interfaces/products.interfaces";
import { ProductScoreBadge } from "./product-score-badge";
import { to_color_indicator } from "../utils/product-detail.utils";

interface ProductHeroProps {
    product: ProductDetail;
}

export const ProductHero: FC<ProductHeroProps> = ({ product }) => {
    const color_indicator = to_color_indicator(product.color_indicator);
    const category_label = [
        product.subcategory.category.name,
        product.subcategory.name,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <section className="space-y-4">
            {product.hero_image_url ? (
                <Card className="overflow-hidden p-0">
                    <img
                        src={product.hero_image_url}
                        alt={product.name}
                        className="aspect-[4/3] w-full object-cover"
                    />
                </Card>
            ) : null}

            <div className="space-y-2">
                <h1
                    className="text-2xl font-semibold text-foreground sm:text-3xl"
                    style={{ fontFamily: "var(--heading)" }}
                >
                    {product.name}
                </h1>
                <p className="text-sm text-muted">
                    {product.brand.name}
                    {product.package_size ? ` · ${product.package_size}` : ""}
                </p>
                {product.barcode ? (
                    <p className="font-mono text-xs text-muted">
                        Barcode {product.barcode}
                    </p>
                ) : null}
                {category_label ? (
                    <p className="text-xs font-mono font-medium uppercase tracking-wide text-muted">
                        {category_label}
                    </p>
                ) : null}
            </div>

            <Card className="p-4">
                <ProductScoreBadge
                    indicator={color_indicator}
                    overall_score={product.overall_score}
                />
            </Card>
        </section>
    );
};
