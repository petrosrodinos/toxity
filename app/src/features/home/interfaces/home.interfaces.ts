import type { ProductListItem } from "@/features/products/interfaces/products.interfaces";
import type { Ingredient } from "@/features/ingredients/interfaces/ingredients.interfaces";

export type HomeCategory = {
    uuid: string;
    name: string;
    slug: string;
    icon_url?: string | null;
};

export type DailyTip = {
    title: string;
    body: string;
};

export type HomeFeed = {
    continue_scanning: ProductListItem[];
    recently_scanned: ProductListItem[];
    trending: ProductListItem[];
    highest_rated: ProductListItem[];
    new_products: ProductListItem[];
    recommended: ProductListItem[];
    categories: HomeCategory[];
    ingredient_spotlight: { ingredient: Ingredient } | null;
    daily_tip: DailyTip;
};
