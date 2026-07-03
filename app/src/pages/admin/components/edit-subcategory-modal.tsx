import { useEffect, useState, type FC } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateSubcategory } from "@/features/categories/hooks/use-categories";
import type { Subcategory } from "@/features/categories/interfaces/categories.interfaces";

const to_sort_order = (value: string): number => {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
};

type EditSubcategoryModalProps = {
    subcategory: Subcategory;
    isOpen: boolean;
    onClose: () => void;
};

export const EditSubcategoryModal: FC<EditSubcategoryModalProps> = ({
    subcategory,
    isOpen,
    onClose,
}) => {
    const [name, set_name] = useState(subcategory.name);
    const [sort_order, set_sort_order] = useState(String(subcategory.sort_order));

    const update_subcategory = useUpdateSubcategory();

    useEffect(() => {
        if (!isOpen) return;
        set_name(subcategory.name);
        set_sort_order(String(subcategory.sort_order));
    }, [isOpen, subcategory]);

    const save = () => {
        update_subcategory.mutate(
            {
                subcategory_uuid: subcategory.uuid,
                dto: { name: name.trim(), sort_order: to_sort_order(sort_order) },
            },
            { onSuccess: onClose },
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit subcategory"
            footer={
                <>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        loading={update_subcategory.isPending}
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
