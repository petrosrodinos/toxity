import { useEffect, useState, type FC } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SafetyBadge } from "@/components/ui/safety-badge";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import {
    useDeleteProduct,
    useGetAllProducts,
    useUpdateProduct,
} from "@/features/admin/hooks/use-admin";
import type { AdminProductListItem } from "@/features/admin/interfaces/admin.interfaces";
import {
    VerificationStatuses,
    type VerificationStatus,
} from "@/features/products/interfaces/products.interfaces";

const PAGE_LIMIT = 20;

const VERIFICATION_OPTIONS: VerificationStatus[] = [
    VerificationStatuses.PENDING,
    VerificationStatuses.APPROVED,
    VerificationStatuses.REJECTED,
];

const select_classes = cn(
    "h-10 w-full rounded-md border border-field-border bg-field px-3 py-2 text-sm text-foreground",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent",
);

type EditState = {
    name: string;
    barcode: string;
    package_size: string;
    is_featured: boolean;
    verification_status: VerificationStatus;
};

const to_edit_state = (product: AdminProductListItem): EditState => ({
    name: product.name,
    barcode: product.barcode ?? "",
    package_size: product.package_size ?? "",
    is_featured: product.is_featured,
    verification_status: product.verification_status,
});

const ProductRow: FC<{ product: AdminProductListItem }> = ({ product }) => {
    const [is_editing, set_is_editing] = useState(false);
    const [is_confirming_delete, set_is_confirming_delete] = useState(false);
    const [form, set_form] = useState<EditState>(() => to_edit_state(product));

    const update_product = useUpdateProduct();
    const delete_product = useDeleteProduct();

    const start_edit = () => {
        set_form(to_edit_state(product));
        set_is_editing(true);
    };

    const save = () => {
        update_product.mutate(
            {
                product_uuid: product.uuid,
                dto: {
                    name: form.name.trim(),
                    barcode: form.barcode,
                    package_size: form.package_size,
                    is_featured: form.is_featured,
                    verification_status: form.verification_status,
                },
            },
            { onSuccess: () => set_is_editing(false) },
        );
    };

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
                    <p className="mt-1 text-[11px] text-muted">
                        {product.verification_status}
                    </p>
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
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                is_editing ? set_is_editing(false) : start_edit()
                            }
                        >
                            {is_editing ? "Close" : "Edit"}
                        </Button>
                        {is_confirming_delete ? (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-danger/30 text-danger hover:bg-danger/10"
                                    loading={delete_product.isPending}
                                    onClick={() => delete_product.mutate(product.uuid)}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => set_is_confirming_delete(false)}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-danger hover:bg-danger/10"
                                onClick={() => set_is_confirming_delete(true)}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                </td>
            </tr>

            {is_editing && (
                <tr className="border-t border-border bg-surface-secondary/40">
                    <td colSpan={5} className="px-3 py-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor={`name-${product.uuid}`}
                                    className="text-xs font-medium text-foreground"
                                >
                                    Name
                                </label>
                                <Input
                                    id={`name-${product.uuid}`}
                                    value={form.name}
                                    onChange={(event) =>
                                        set_form((prev) => ({
                                            ...prev,
                                            name: event.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor={`barcode-${product.uuid}`}
                                    className="text-xs font-medium text-foreground"
                                >
                                    Barcode
                                </label>
                                <Input
                                    id={`barcode-${product.uuid}`}
                                    value={form.barcode}
                                    onChange={(event) =>
                                        set_form((prev) => ({
                                            ...prev,
                                            barcode: event.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor={`package-${product.uuid}`}
                                    className="text-xs font-medium text-foreground"
                                >
                                    Package size
                                </label>
                                <Input
                                    id={`package-${product.uuid}`}
                                    value={form.package_size}
                                    onChange={(event) =>
                                        set_form((prev) => ({
                                            ...prev,
                                            package_size: event.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor={`status-${product.uuid}`}
                                    className="text-xs font-medium text-foreground"
                                >
                                    Verification status
                                </label>
                                <select
                                    id={`status-${product.uuid}`}
                                    className={select_classes}
                                    value={form.verification_status}
                                    onChange={(event) =>
                                        set_form((prev) => ({
                                            ...prev,
                                            verification_status: event.target
                                                .value as VerificationStatus,
                                        }))
                                    }
                                >
                                    {VERIFICATION_OPTIONS.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-foreground">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-field-border"
                                    checked={form.is_featured}
                                    onChange={(event) =>
                                        set_form((prev) => ({
                                            ...prev,
                                            is_featured: event.target.checked,
                                        }))
                                    }
                                />
                                Featured product
                            </label>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Button
                                type="button"
                                loading={update_product.isPending}
                                disabled={form.name.trim().length === 0}
                                onClick={save}
                            >
                                Save changes
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => set_is_editing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </td>
                </tr>
            )}
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
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
                    Loading products…
                </p>
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
