import type { PaginatedResponse } from "@/features/ingredients/interfaces/ingredients.interfaces";
import type { ProductListItem } from "@/features/products/interfaces/products.interfaces";
import type { Ingredient } from "@/features/ingredients/interfaces/ingredients.interfaces";
import type { Brand } from "@/features/brands/interfaces/brands.interfaces";

export type SearchSort =
    | "highest_rated"
    | "lowest_rated"
    | "newest"
    | "most_popular";

export type SearchQuery = {
    q: string;
    category_uuid?: string;
    subcategory_uuid?: string;
    sort?: SearchSort;
    page?: number;
    limit?: number;
};

export type SearchResult = {
    products: PaginatedResponse<ProductListItem>;
    ingredients: PaginatedResponse<Ingredient>;
    brands: PaginatedResponse<Brand>;
};
