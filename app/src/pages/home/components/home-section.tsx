import type { FC, ReactNode } from "react";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import type { ProductListItem } from "@/features/products/interfaces/products.interfaces";

type HomeSectionProps = {
    title: string;
    description?: string;
    items: ProductListItem[] | undefined;
    is_loading: boolean;
    empty_message?: string;
    limit?: number;
    action?: ReactNode;
};

const HomeSection: FC<HomeSectionProps> = ({
    title,
    description,
    items,
    is_loading,
    empty_message,
    limit = 5,
    action,
}) => {
    if (!is_loading && (!items || items.length === 0) && !empty_message) {
        return null;
    }

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h2
                        className="text-lg font-semibold text-foreground"
                        style={{ fontFamily: "var(--heading)" }}
                    >
                        {title}
                    </h2>
                    {description ? (
                        <p className="text-xs text-muted">{description}</p>
                    ) : null}
                </div>
                {action}
            </div>

            <div className="space-y-2">
                {is_loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                          <ProductCardSkeleton key={index} />
                      ))
                    : items && items.length > 0
                      ? items
                            .slice(0, limit)
                            .map((product) => (
                                <ProductCard key={product.uuid} product={product} />
                            ))
                      : (
                            <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted">
                                {empty_message}
                            </p>
                        )}
            </div>
        </section>
    );
};

export default HomeSection;
