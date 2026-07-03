import { useEffect, useState, type FC } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateCategory } from "@/features/categories/hooks/use-categories";
import type { Category } from "@/features/categories/interfaces/categories.interfaces";

const to_sort_order = (value: string): number => {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
};

type EditCategoryModalProps = {
    category: Category;
    isOpen: boolean;
    onClose: () => void;
};

export const EditCategoryModal: FC<EditCategoryModalProps> = ({
    category,
    isOpen,
    onClose,
}) => {
    const [name, set_name] = useState(category.name);
    const [icon_url, set_icon_url] = useState(category.icon_url ?? "");
    const [sort_order, set_sort_order] = useState(String(category.sort_order));

    const update_category = useUpdateCategory();

    useEffect(() => {
        if (!isOpen) return;
        set_name(category.name);
        set_icon_url(category.icon_url ?? "");
        set_sort_order(String(category.sort_order));
    }, [isOpen, category]);

    const save = () => {
        update_category.mutate(
            {
                category_uuid: category.uuid,
                dto: {
                    name: name.trim(),
                    icon_url: icon_url.trim(),
                    sort_order: to_sort_order(sort_order),
                },
            },
            { onSuccess: onClose },
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit category"
            footer={
                <>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        loading={update_category.isPending}
                        disabled={name.trim().length === 0}
                        onClick={save}
                    >
                        Save changes
                    </Button>
                </>
            }
        >
            <div className="grid gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-foreground">Name</label>
                    <Input
                        value={name}
                        onChange={(event) => set_name(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-foreground">
                        Icon URL
                    </label>
                    <Input
                        value={icon_url}
                        onChange={(event) => set_icon_url(event.target.value)}
                    />
                </div>
                <div className="flex w-28 flex-col gap-1">
                    <label className="text-xs font-medium text-foreground">Order</label>
                    <Input
                        type="number"
                        value={sort_order}
                        onChange={(event) => set_sort_order(event.target.value)}
                    />
                </div>
            </div>
        </Modal>
    );
};
