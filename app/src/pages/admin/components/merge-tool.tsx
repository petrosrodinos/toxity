import { useState, type FC } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    useMergeBrands,
    useMergeIngredients,
    useMergeProducts,
} from "@/features/admin/hooks/use-admin";

type MergeFormProps = {
    title: string;
    description: string;
    on_submit: (dto: { keep_uuid: string; merge_uuid: string }) => void;
    is_pending: boolean;
};

const MergeForm: FC<MergeFormProps> = ({ title, description, on_submit, is_pending }) => {
    const [keep_uuid, set_keep_uuid] = useState("");
    const [merge_uuid, set_merge_uuid] = useState("");

    const handle_submit = (event: React.FormEvent) => {
        event.preventDefault();
        on_submit({ keep_uuid: keep_uuid.trim(), merge_uuid: merge_uuid.trim() });
    };

    return (
        <Card className="space-y-3 p-5">
            <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted">{description}</p>
            </div>
            <form onSubmit={handle_submit} className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-foreground">
                        Keep UUID
                    </label>
                    <Input
                        value={keep_uuid}
                        onChange={(event) => set_keep_uuid(event.target.value)}
                        placeholder="uuid to keep"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-foreground">
                        Merge UUID (removed)
                    </label>
                    <Input
                        value={merge_uuid}
                        onChange={(event) => set_merge_uuid(event.target.value)}
                        placeholder="duplicate uuid"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    variant="outline"
                    className="sm:col-span-2"
                    loading={is_pending}
                    disabled={!keep_uuid.trim() || !merge_uuid.trim()}
                >
                    Merge
                </Button>
            </form>
        </Card>
    );
};

export const MergeTool: FC = () => {
    const merge_products = useMergeProducts();
    const merge_ingredients = useMergeIngredients();
    const merge_brands = useMergeBrands();

    return (
        <div className="space-y-4">
            <MergeForm
                title="Merge products"
                description="Reassigns scans and favorites, then removes the duplicate product."
                on_submit={(dto) => merge_products.mutate(dto)}
                is_pending={merge_products.isPending}
            />
            <MergeForm
                title="Merge ingredients"
                description="Reassigns product ingredient links and favorites, then removes the duplicate ingredient."
                on_submit={(dto) => merge_ingredients.mutate(dto)}
                is_pending={merge_ingredients.isPending}
            />
            <MergeForm
                title="Merge brands"
                description="Reassigns products to the target brand, then removes the duplicate brand."
                on_submit={(dto) => merge_brands.mutate(dto)}
                is_pending={merge_brands.isPending}
            />
        </div>
    );
};
