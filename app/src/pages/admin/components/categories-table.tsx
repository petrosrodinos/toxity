import { useState, type FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    useCreateCategory,
    useCreateSubcategory,
    useDeleteCategory,
    useDeleteSubcategory,
    useGetCategories,
} from "@/features/categories/hooks/use-categories";
import type {
    Category,
    Subcategory,
} from "@/features/categories/interfaces/categories.interfaces";
import { RowActionsMenu } from "./row-actions-menu";
import { EditCategoryModal } from "./edit-category-modal";
import { EditSubcategoryModal } from "./edit-subcategory-modal";
import { CategoriesTableSkeleton } from "./categories-table-skeleton";

const to_sort_order = (value: string): number => {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
};

const SubcategoryRow: FC<{ subcategory: Subcategory }> = ({ subcategory }) => {
    const [is_editing, set_is_editing] = useState(false);
    const delete_subcategory = useDeleteSubcategory();

    return (
        <>
            <tr className="border-t border-border/60">
                <td className="py-2 pl-8 pr-3">
                    <span className="text-sm text-foreground">↳ {subcategory.name}</span>
                </td>
                <td className="px-3 py-2 text-xs text-muted">{subcategory.slug}</td>
                <td className="px-3 py-2 text-xs text-muted">
                    {subcategory.sort_order}
                </td>
                <td className="px-3 py-2">
                    <div className="flex justify-end">
                        <RowActionsMenu
                            onEdit={() => set_is_editing(true)}
                            onDelete={() =>
                                delete_subcategory.mutate(subcategory.uuid)
                            }
                            is_deleting={delete_subcategory.isPending}
                        />
                    </div>
                </td>
            </tr>

            <EditSubcategoryModal
                subcategory={subcategory}
                isOpen={is_editing}
                onClose={() => set_is_editing(false)}
            />
        </>
    );
};

const CategoryRow: FC<{ category: Category }> = ({ category }) => {
    const [is_editing, set_is_editing] = useState(false);
    const [is_adding_sub, set_is_adding_sub] = useState(false);

    const [sub_name, set_sub_name] = useState("");
    const [sub_sort_order, set_sub_sort_order] = useState("0");

    const delete_category = useDeleteCategory();
    const create_subcategory = useCreateSubcategory();

    const create_sub = () => {
        create_subcategory.mutate(
            {
                category_uuid: category.uuid,
                name: sub_name.trim(),
                sort_order: to_sort_order(sub_sort_order),
            },
            {
                onSuccess: () => {
                    set_sub_name("");
                    set_sub_sort_order("0");
                    set_is_adding_sub(false);
                },
            },
        );
    };

    return (
        <>
            <tr className="border-t-2 border-border bg-surface-secondary/30">
                <td className="px-3 py-3">
                    <span className="text-sm font-semibold text-foreground">
                        {category.name}
                    </span>
                    <span className="ml-2 text-[11px] text-muted">
                        {category.subcategories.length} sub
                    </span>
                </td>
                <td className="px-3 py-3 text-xs text-muted">{category.slug}</td>
                <td className="px-3 py-3 text-xs text-muted">{category.sort_order}</td>
                <td className="px-3 py-3">
                    <div className="flex justify-end">
                        <RowActionsMenu
                            onEdit={() => set_is_editing(true)}
                            onDelete={() => delete_category.mutate(category.uuid)}
                            is_deleting={delete_category.isPending}
                        />
                    </div>
                </td>
            </tr>

            <EditCategoryModal
                category={category}
                isOpen={is_editing}
                onClose={() => set_is_editing(false)}
            />

            {category.subcategories.map((subcategory) => (
                <SubcategoryRow key={subcategory.uuid} subcategory={subcategory} />
            ))}

            <tr className="border-t border-border/60">
                <td colSpan={4} className="px-3 py-2 pl-8">
                    {is_adding_sub ? (
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="flex flex-1 flex-col gap-1">
                                <label className="text-xs font-medium text-foreground">
                                    Subcategory name
                                </label>
                                <Input
                                    value={sub_name}
                                    onChange={(event) =>
                                        set_sub_name(event.target.value)
                                    }
                                />
                            </div>
                            <div className="flex w-24 flex-col gap-1">
                                <label className="text-xs font-medium text-foreground">
                                    Order
                                </label>
                                <Input
                                    type="number"
                                    value={sub_sort_order}
                                    onChange={(event) =>
                                        set_sub_sort_order(event.target.value)
                                    }
                                />
                            </div>
                            <Button
                                type="button"
                                loading={create_subcategory.isPending}
                                disabled={sub_name.trim().length === 0}
                                onClick={create_sub}
                            >
                                Add
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => set_is_adding_sub(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => set_is_adding_sub(true)}
                        >
                            + Add subcategory
                        </Button>
                    )}
                </td>
            </tr>
        </>
    );
};

export const CategoriesTable: FC = () => {
    const { data: categories, isLoading, isError } = useGetCategories();
    const create_category = useCreateCategory();

    const [is_adding, set_is_adding] = useState(false);
    const [name, set_name] = useState("");
    const [icon_url, set_icon_url] = useState("");
    const [sort_order, set_sort_order] = useState("0");

    const create = () => {
        create_category.mutate(
            {
                name: name.trim(),
                icon_url: icon_url.trim() || undefined,
                sort_order: to_sort_order(sort_order),
            },
            {
                onSuccess: () => {
                    set_name("");
                    set_icon_url("");
                    set_sort_order("0");
                    set_is_adding(false);
                },
            },
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                {!is_adding && (
                    <Button type="button" onClick={() => set_is_adding(true)}>
                        + New category
                    </Button>
                )}
            </div>

            {is_adding && (
                <Card className="p-4">
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="flex flex-1 flex-col gap-1">
                            <label className="text-xs font-medium text-foreground">
                                Name
                            </label>
                            <Input
                                value={name}
                                onChange={(event) => set_name(event.target.value)}
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                            <label className="text-xs font-medium text-foreground">
                                Icon URL (optional)
                            </label>
                            <Input
                                value={icon_url}
                                onChange={(event) => set_icon_url(event.target.value)}
                            />
                        </div>
                        <div className="flex w-24 flex-col gap-1">
                            <label className="text-xs font-medium text-foreground">
                                Order
                            </label>
                            <Input
                                type="number"
                                value={sort_order}
                                onChange={(event) => set_sort_order(event.target.value)}
                            />
                        </div>
                        <Button
                            type="button"
                            loading={create_category.isPending}
                            disabled={name.trim().length === 0}
                            onClick={create}
                        >
                            Create
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => set_is_adding(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </Card>
            )}

            {isLoading ? (
                <CategoriesTableSkeleton />
            ) : isError ? (
                <p className="rounded-lg border border-dashed border-danger/40 p-6 text-center text-sm text-danger">
                    Could not load categories. Please try again.
                </p>
            ) : !categories || categories.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
                    No categories yet.
                </p>
            ) : (
                <Card className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-muted">
                                <th className="px-3 py-2 font-medium">Name</th>
                                <th className="px-3 py-2 font-medium">Slug</th>
                                <th className="px-3 py-2 font-medium">Order</th>
                                <th className="px-3 py-2 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <CategoryRow key={category.uuid} category={category} />
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}
        </div>
    );
};
