import type { FC } from "react";
import { ChevronRight, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { SafetyBadge } from "@/components/ui/safety-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import type { ProductListItem } from "@/features/products/interfaces/products.interfaces";

export const ProductCardSkeleton: FC<{ className?: string }> = ({ className }) => (
    <Card className={cn("flex items-center gap-3 p-3", className)}>
        <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-16" />
        </div>
    </Card>
);

type ProductCardProps = {
    product: ProductListItem;
    subtitle?: string;
    className?: string;
};

const ProductCard: FC<ProductCardProps> = ({ product, subtitle, className }) => {
    return (
        <Link to={Routes.products.detail(product.uuid)}>
            <Card
                className={cn(
                    "flex items-center gap-3 p-3 transition-colors hover:bg-surface-secondary",
                    className,
                )}
            >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-secondary">
                    {product.hero_image_url ? (
                        <img
                            src={product.hero_image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ImageOff className="h-5 w-5 text-muted" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                        {product.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                        {product.brand.name}
                        {subtitle ? ` · ${subtitle}` : ""}
                    </p>
                    <div className="mt-1.5">
                        <SafetyBadge indicator={product.color_indicator} compact />
                    </div>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
            </Card>
        </Link>
    );
};

export default ProductCard;
