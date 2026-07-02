import type { FC } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SafetyBadge } from "@/components/ui/safety-badge";
import { ProductCardSkeleton } from "@/components/product-card";
import { Routes } from "@/routes/routes";
import {
    useGetPendingProducts,
    useToggleFeatureProduct,
    useVerifyProduct,
} from "@/features/admin/hooks/use-admin";
import { ProductVerificationDecisions } from "@/features/admin/interfaces/admin.interfaces";

export const PendingProductsTable: FC = () => {
    const { data, isLoading } = useGetPendingProducts({ limit: 50 });
    const verify_product = useVerifyProduct();
    const toggle_feature = useToggleFeatureProduct();

    const products = data?.data ?? [];

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
                No products are waiting for review.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {products.map((product) => (
                <Card key={product.uuid} className="flex flex-wrap items-center gap-3 p-3">
                    <div className="min-w-0 flex-1">
                        <Link
                            to={Routes.products.detail(product.uuid)}
                            className="truncate text-sm font-medium text-foreground hover:underline"
                        >
                            {product.name}
                        </Link>
                        <p className="truncate text-xs text-muted">{product.brand.name}</p>
                        <div className="mt-1.5">
                            <SafetyBadge indicator={product.color_indicator} compact />
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            loading={
                                verify_product.isPending &&
                                verify_product.variables?.product_uuid === product.uuid
                            }
                            onClick={() =>
                                verify_product.mutate({
                                    product_uuid: product.uuid,
                                    dto: { status: ProductVerificationDecisions.APPROVED },
                                })
                            }
                        >
                            Approve
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="text-danger border-danger/30 hover:bg-danger/10"
                            loading={
                                verify_product.isPending &&
                                verify_product.variables?.product_uuid === product.uuid
                            }
                            onClick={() =>
                                verify_product.mutate({
                                    product_uuid: product.uuid,
                                    dto: { status: ProductVerificationDecisions.REJECTED },
                                })
                            }
                        >
                            Reject
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            loading={
                                toggle_feature.isPending &&
                                toggle_feature.variables?.product_uuid === product.uuid
                            }
                            onClick={() =>
                                toggle_feature.mutate({
                                    product_uuid: product.uuid,
                                    dto: { is_featured: !product.is_featured },
                                })
                            }
                        >
                            {product.is_featured ? "Unfeature" : "Feature"}
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};
