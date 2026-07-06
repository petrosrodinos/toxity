import { useEffect, useState, type FC } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateProduct } from "@/features/admin/hooks/use-admin";
import type { AdminProductListItem } from "@/features/admin/interfaces/admin.interfaces";

type EditState = {
    name: string;
    barcode: string;
    package_size: string;
    is_featured: boolean;
};

const to_edit_state = (product: AdminProductListItem): EditState => ({
    name: product.name,
    barcode: product.barcode ?? "",
    package_size: product.package_size ?? "",
    is_featured: product.is_featured,
});

type EditProductModalProps = {
    product: AdminProductListItem;
    isOpen: boolean;
    onClose: () => void;
};

export const EditProductModal: FC<EditProductModalProps> = ({
    product,
    isOpen,
    onClose,
}) => {
    const [form, set_form] = useState<EditState>(() => to_edit_state(product));
    const update_product = useUpdateProduct();

    useEffect(() => {
        if (isOpen) set_form(to_edit_state(product));
    }, [isOpen, product]);

    const save = () => {
        update_product.mutate(
            {
                product_uuid: product.uuid,
                dto: {
                    name: form.name.trim(),
                    barcode: form.barcode,
                    package_size: form.package_size,
                    is_featured: form.is_featured,
                },
            },
            { onSuccess: onClose },
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit product"
            description={product.brand.name}
            footer={
                <>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        loading={update_product.isPending}
                        disabled={form.name.trim().length === 0}
                        onClick={save}
                    >
                        Save changes
                    </Button>
                </>
            }
        >
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
                            set_form((prev) => ({ ...prev, name: event.target.value }))
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

                <div className="flex flex-col gap-1 sm:col-span-2">
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

                <label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
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
        </Modal>
    );
};
