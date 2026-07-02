import { useState, type FC } from "react";
import { History, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format_date } from "@/lib/date";
import { useAuthStore } from "@/stores/auth";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import {
    useGetIngredientVersions,
    useGetProductVersions,
    useReanalyzeIngredient,
    useReanalyzeProduct,
} from "@/features/admin/hooks/use-admin";

type AdminReanalyzePanelProps = {
    entity_type: "product" | "ingredient";
    entity_uuid: string;
};

const SNAPSHOT_PREVIEW_KEYS = [
    "name",
    "overall_score",
    "color_indicator",
    "ai_summary",
];

const AdminReanalyzePanel: FC<AdminReanalyzePanelProps> = ({
    entity_type,
    entity_uuid,
}) => {
    const { role } = useAuthStore();
    const [show_history, set_show_history] = useState(false);

    const is_admin = role === RoleTypes.ADMIN || role === RoleTypes.SUPER_ADMIN;

    const reanalyze_product = useReanalyzeProduct();
    const reanalyze_ingredient = useReanalyzeIngredient();

    const product_versions = useGetProductVersions(
        entity_type === "product" ? entity_uuid : "",
        show_history && entity_type === "product",
    );
    const ingredient_versions = useGetIngredientVersions(
        entity_type === "ingredient" ? entity_uuid : "",
        show_history && entity_type === "ingredient",
    );

    if (!is_admin) {
        return null;
    }

    const is_reanalyzing =
        entity_type === "product"
            ? reanalyze_product.isPending
            : reanalyze_ingredient.isPending;

    const versions_query =
        entity_type === "product" ? product_versions : ingredient_versions;
    const versions = versions_query.data?.data ?? [];

    const handle_reanalyze = () => {
        if (entity_type === "product") {
            reanalyze_product.mutate(entity_uuid);
        } else {
            reanalyze_ingredient.mutate(entity_uuid);
        }
    };

    return (
        <Card className="space-y-3 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                Admin
            </p>
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline"
                    loading={is_reanalyzing}
                    onClick={handle_reanalyze}
                >
                    <Sparkles className="h-4 w-4" />
                    Reanalyze
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => set_show_history((current) => !current)}
                >
                    <History className="h-4 w-4" />
                    {show_history ? "Hide version history" : "View version history"}
                </Button>
            </div>

            {show_history ? (
                <div className="space-y-2 border-t border-border pt-3">
                    {versions_query.isLoading ? (
                        <Skeleton className="h-16 w-full" />
                    ) : versions.length === 0 ? (
                        <p className="text-sm text-muted">No previous versions yet.</p>
                    ) : (
                        versions.map((version) => (
                            <div
                                key={version.uuid}
                                className="rounded-lg border border-border p-3 text-xs"
                            >
                                <p className="font-medium text-foreground">
                                    {format_date(version.created_at)}
                                    {version.ai_version ? ` · ${version.ai_version}` : ""}
                                </p>
                                <dl className="mt-1.5 space-y-0.5 text-muted">
                                    {SNAPSHOT_PREVIEW_KEYS.filter(
                                        (key) => version.snapshot[key] !== undefined,
                                    ).map((key) => (
                                        <div key={key} className="flex gap-1.5">
                                            <dt className="shrink-0 font-medium">{key}:</dt>
                                            <dd className="truncate">
                                                {String(version.snapshot[key])}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ))
                    )}
                </div>
            ) : null}
        </Card>
    );
};

export default AdminReanalyzePanel;
