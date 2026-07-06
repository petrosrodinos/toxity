import { useEffect, useState, type FC } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SafetyBadge } from "@/components/ui/safety-badge";
import { Routes } from "@/routes/routes";
import { RowActionsMenu } from "./row-actions-menu";
import { EditProductModal } from "./edit-product-modal";
import { AllProductsTableSkeleton } from "./all-products-table-skeleton";
import {
    useDeleteProduct,
    useGetAllProducts,
} from "@/features/admin/hooks/use-admin";
import type { AdminProductListItem } from "@/features/admin/interfaces/admin.interfaces";

const PAGE_LIMIT = 20;

const ProductRow: FC<{ product: AdminProductListItem }> = ({ product }) => {
    const [is_editing, set_is_editing] = useState(false);
    const delete_product = useDeleteProduct();

    return (
        <>
            <tr className="border-t border-border align-top">
                <td className="px-3 py-3">
                    <Link
                        to={Routes.products.detail(product.uuid)}
                        className="text-sm font-medium text-foreground hover:underline"
                    >
                        {product.name}
                    </Link>
                    <p className="text-xs text-muted">{product.brand.name}</p>
                    {product.is_featured && (
                        <span className="mt-1 inline-block text-[11px] font-medium text-accent">
                            Featured
                        </span>
                    )}
                </td>

                <td className="px-3 py-3 text-xs text-muted">
                    {product.barcode || "—"}
                </td>

                <td className="px-3 py-3">
                    <SafetyBadge indicator={product.color_indicator} compact />
                </td>

                <td className="px-3 py-3">
                    {product.ingredients.length === 0 ? (
                        <span className="text-xs text-muted">No ingredients</span>
                    ) : (
                        <div className="flex flex-wrap gap-1">
                            {product.ingredients.map((ingredient) => (
                                <Link
                                    key={ingredient.uuid}
                                    to={Routes.ingredients.detail(ingredient.uuid)}
                                    className="rounded-md border border-border bg-surface-secondary px-1.5 py-0.5 text-[11px] text-foreground hover:border-accent"
                                >
                                    {ingredient.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </td>

                <td className="px-3 py-3">
                    <div className="flex justify-end">
                        <RowActionsMenu
                            onEdit={() => set_is_editing(true)}
                            onDelete={() => delete_product.mutate(product.uuid)}
                            is_deleting={delete_product.isPending}
                        />
                    </div>
                </td>
            </tr>

            <EditProductModal
                product={product}
                isOpen={is_editing}
                onClose={() => set_is_editing(false)}
            />
        </>
    );
};

export const AllProductsTable: FC = () => {
    const [page, set_page] = useState(1);
    const [search_input, set_search_input] = useState("");
    const [search, set_search] = useState("");

    // Debounce the search box so typing doesn't fire a request per keystroke.
    useEffect(() => {
        const timeout = setTimeout(() => {
            set_search(search_input.trim());
            set_page(1);
        }, 350);

        return () => clearTimeout(timeout);
    }, [search_input]);

    const { data, isLoading, isError } = useGetAllProducts({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
    });

    const products = data?.data ?? [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-4">
            <Input
                type="search"
                placeholder="Search by product, brand, or barcode…"
                value={search_input}
                onChange={(event) => set_search_input(event.target.value)}
            />

            {isLoading ? (
                <AllProductsTableSkeleton />
            ) : isError ? (
                <p className="rounded-lg border border-dashed border-danger/40 p-6 text-center text-sm text-danger">
                    Could not load products. Please try again.
                </p>
            ) : products.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
                    {search
                        ? "No products match your search."
                        : "No products yet."}
                </p>
            ) : (
                <Card className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-left">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-muted">
                                <th className="px-3 py-2 font-medium">Product</th>
                                <th className="px-3 py-2 font-medium">Barcode</th>
                                <th className="px-3 py-2 font-medium">Safety</th>
                                <th className="px-3 py-2 font-medium">Ingredients</th>
                                <th className="px-3 py-2 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <ProductRow key={product.uuid} product={product} />
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}

            {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={!pagination.has_prev}
                        onClick={() => set_page((prev) => Math.max(1, prev - 1))}
                    >
                        Previous
                    </Button>
                    <span className="text-xs text-muted">
                        Page {pagination.page} of {pagination.total_pages}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={!pagination.has_next}
                        onClick={() => set_page((prev) => prev + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};
