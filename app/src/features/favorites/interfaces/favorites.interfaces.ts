import type { ColorIndicator } from "@/components/ui/safety-badge";
import type { ProductListItem } from "@/features/products/interfaces/products.interfaces";
import type { Brand } from "@/features/brands/interfaces/brands.interfaces";
import type { PaginatedResponse } from "@/features/ingredients/interfaces/ingredients.interfaces";

export const FavoriteEntityTypes = {
    PRODUCT: "PRODUCT",
    INGREDIENT: "INGREDIENT",
    BRAND: "BRAND",
} as const;

export type FavoriteEntityType =
    (typeof FavoriteEntityTypes)[keyof typeof FavoriteEntityTypes];

export type FavoriteIngredientSummary = {
    uuid: string;
    name: string;
    color_indicator: ColorIndicator;
    overall_score?: string | null;
    ai_summary?: string | null;
    synonyms?: string[];
};

export type Favorite = {
    uuid: string;
    entity_type: FavoriteEntityType;
    entity_uuid: string;
    created_at: string;
    product: ProductListItem | null;
    ingredient: FavoriteIngredientSummary | null;
    brand: Brand | null;
};

export type CreateFavoriteDto = {
    entity_type: FavoriteEntityType;
    entity_uuid: string;
};

export type FavoritesQuery = {
    type?: FavoriteEntityType;
    page?: number;
    limit?: number;
};

export type { PaginatedResponse };
