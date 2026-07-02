import { useState, type FC } from "react";
import { Button } from "@/components/ui/button";
import { ProductCardSkeleton } from "@/components/product-card";
import ProductCard from "@/components/product-card";
import IngredientRow from "@/components/ingredient-row";
import BrandRow from "@/components/brand-row";
import { useGetFavorites } from "@/features/favorites/hooks/use-favorites";
import {
    FavoriteEntityTypes,
    type FavoriteEntityType,
} from "@/features/favorites/interfaces/favorites.interfaces";

const TABS: { value: FavoriteEntityType; label: string }[] = [
    { value: FavoriteEntityTypes.PRODUCT, label: "Products" },
    { value: FavoriteEntityTypes.INGREDIENT, label: "Ingredients" },
    { value: FavoriteEntityTypes.BRAND, label: "Brands" },
];

export const FavoritesTabs: FC = () => {
    const [tab, set_tab] = useState<FavoriteEntityType>(FavoriteEntityTypes.PRODUCT);
    const { data, isLoading } = useGetFavorites({ type: tab });
    const favorites = data?.data ?? [];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {TABS.map((option) => (
                    <Button
                        key={option.value}
                        type="button"
                        variant={tab === option.value ? "default" : "outline"}
                        onClick={() => set_tab(option.value)}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>

            {isLoading ? (
                <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
                    No favorite {TABS.find((t) => t.value === tab)?.label.toLowerCase()}{" "}
                    yet.
                </p>
            ) : (
                <div className="space-y-2">
                    {favorites.map((favorite) => {
                        if (favorite.entity_type === FavoriteEntityTypes.PRODUCT && favorite.product) {
                            return (
                                <ProductCard key={favorite.uuid} product={favorite.product} />
                            );
                        }
                        if (
                            favorite.entity_type === FavoriteEntityTypes.INGREDIENT &&
                            favorite.ingredient
                        ) {
                            return (
                                <IngredientRow
                                    key={favorite.uuid}
                                    ingredient={favorite.ingredient}
                                />
                            );
                        }
                        if (favorite.entity_type === FavoriteEntityTypes.BRAND && favorite.brand) {
                            return <BrandRow key={favorite.uuid} brand={favorite.brand} />;
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
};
