import type { FC } from "react";
import { Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Brand } from "@/features/brands/interfaces/brands.interfaces";

const BrandRow: FC<{ brand: Brand }> = ({ brand }) => {
    return (
        <Card className="flex items-center gap-3 p-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-secondary">
                {brand.logo_url ? (
                    <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <Tag className="h-5 w-5 text-muted" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                    {brand.name}
                </p>
                {brand.country ? (
                    <p className="truncate text-xs text-muted">{brand.country}</p>
                ) : null}
            </div>
        </Card>
    );
};

export default BrandRow;
