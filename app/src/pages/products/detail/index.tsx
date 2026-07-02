import type { FC } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetProduct } from "@/features/products/hooks/use-products";
import { Routes } from "@/routes/routes";
import { IngredientAccordionList } from "./components/ingredient-accordion-list";
import { ProductDetailToolbar } from "./components/product-detail-toolbar";
import { ProductHero } from "./components/product-hero";
import { ProductSummary } from "./components/product-summary";

const ProductDetailLoading: FC = () => (
    <div className="mx-auto max-w-2xl space-y-4 pb-8">
        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="aspect-[4/3] animate-pulse rounded-xl bg-surface-secondary" />
        <div className="h-20 animate-pulse rounded-xl bg-surface-secondary" />
        <div className="h-40 animate-pulse rounded-xl bg-surface-secondary" />
        <div className="h-64 animate-pulse rounded-xl bg-surface-secondary" />
    </div>
);

const ProductDetailPage: FC = () => {
    const { product_uuid = "" } = useParams<{ product_uuid: string }>();
    const { data: product, isLoading, isError, error } = useGetProduct(product_uuid);

    if (isLoading) {
        return <ProductDetailLoading />;
    }

    if (isError || !product) {
        return (
            <div className="mx-auto max-w-2xl">
                <Card className="p-8 text-center">
                    <p className="text-sm font-medium text-foreground">
                        Could not load product
                    </p>
                    <p className="mt-1 text-xs text-muted">
                        {error?.message ?? "This product may not exist."}
                    </p>
                    <Link to={Routes.scan.root}>
                        <Button variant="outline" className="mt-4">
                            Back to scan
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6 pb-8">
            <div className="flex items-center gap-3">
                <Link
                    to={Routes.scan.root}
                    aria-label="Back to scan"
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-2 text-foreground transition-colors hover:bg-surface-secondary"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <ProductDetailToolbar />
            </div>

            <ProductHero product={product} />
            <ProductSummary product={product} />
            <IngredientAccordionList ingredients={product.ingredients} />
        </div>
    );
};

export default ProductDetailPage;
