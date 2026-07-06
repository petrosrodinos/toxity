import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import IngredientRow from "@/components/ingredient-row";
import BrandRow from "@/components/brand-row";
import { useSearch } from "@/features/search/hooks/use-search";
import { useGetCategoryProducts } from "@/features/categories/hooks/use-categories";
import { useSearchFilters, type SearchTab } from "./hooks/use-search-filters";

const SORT_OPTIONS: SelectOption[] = [
    { value: "newest", label: "Newest" },
    { value: "highest_rated", label: "Highest rated" },
    { value: "lowest_rated", label: "Lowest rated" },
    { value: "most_popular", label: "Most popular" },
];

const TABS: { value: SearchTab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "products", label: "Products" },
    { value: "ingredients", label: "Ingredients" },
    { value: "brands", label: "Brands" },
];

export default function SearchPage() {
    const { q, set_q, sort, set_sort, tab, set_tab, category_uuid, query } =
        useSearchFilters();
    const has_query = query.q.length > 0;
    const is_browsing_category = !!category_uuid && !has_query;

    const {
        data: search_data,
        isLoading: is_search_loading,
        isFetching: is_search_fetching,
        isError: is_search_error,
        error: search_error,
    } = useSearch(query);

    const {
        data: category_data,
        isLoading: is_category_loading,
        isError: is_category_error,
        error: category_error,
    } = useGetCategoryProducts(category_uuid, { limit: 50 });

    const is_loading_results =
        (has_query && (is_search_loading || is_search_fetching)) ||
        (is_browsing_category && is_category_loading);

    const products = is_browsing_category
        ? (category_data?.data ?? [])
        : (search_data?.products.data ?? []);
    const ingredients = search_data?.ingredients.data ?? [];
    const brands = search_data?.brands.data ?? [];

    const show_products = tab === "all" || tab === "products";
    const show_ingredients = tab === "all" || tab === "ingredients";
    const show_brands = tab === "all" || tab === "brands";

    const visible_product_count = show_products ? products.length : 0;
    const visible_ingredient_count = show_ingredients ? ingredients.length : 0;
    const visible_brand_count = show_brands ? brands.length : 0;
    const visible_total =
        visible_product_count + visible_ingredient_count + visible_brand_count;

    const active_error = is_browsing_category ? category_error : search_error;
    const has_error = is_browsing_category ? is_category_error : is_search_error;

    return (
        <div className="mx-auto flex max-w-lg flex-col gap-6 pb-8">
            <div>
                <h1
                    className="text-2xl font-semibold text-foreground"
                    style={{ fontFamily: "var(--heading)" }}
                >
                    Search
                </h1>
                <p className="mt-1 text-sm text-muted">
                    Find products, ingredients, and brands.
                </p>
            </div>

            <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                    value={q}
                    onChange={(event) => set_q(event.target.value)}
                    placeholder="Search by name, ingredient, or barcode"
                    className="pl-9"
                />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
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

                {has_query ? (
                    <Select
                        aria-label="Sort results"
                        value={sort}
                        options={SORT_OPTIONS}
                        onChange={(value) => set_sort(value as typeof sort)}
                        className="w-44"
                        contentClassName="w-44"
                    />
                ) : null}
            </div>

            {!has_query && !is_browsing_category ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
                    Start typing to search the Toxity library.
                </p>
            ) : has_error ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-danger">
                    {active_error?.message ?? "Search failed. Please try again."}
                </p>
            ) : is_loading_results ? (
                <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : visible_total === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
                    {is_browsing_category
                        ? "No products in this category yet."
                        : has_query
                          ? `No results for "${query.q}". Try a different name, ingredient, or barcode.`
                          : "No results found."}
                </p>
            ) : (
                <div className="space-y-6">
                    {show_products && products.length > 0 ? (
                        <section className="space-y-2">
                            {tab === "all" || is_browsing_category ? (
                                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                                    Products
                                </p>
                            ) : null}
                            {products.map((product) => (
                                <ProductCard key={product.uuid} product={product} />
                            ))}
                        </section>
                    ) : null}

                    {!is_browsing_category &&
                    show_ingredients &&
                    ingredients.length > 0 ? (
                        <section className="space-y-2">
                            {tab === "all" ? (
                                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                                    Ingredients
                                </p>
                            ) : null}
                            {ingredients.map((ingredient) => (
                                <IngredientRow
                                    key={ingredient.uuid}
                                    ingredient={ingredient}
                                />
                            ))}
                        </section>
                    ) : null}

                    {!is_browsing_category && show_brands && brands.length > 0 ? (
                        <section className="space-y-2">
                            {tab === "all" ? (
                                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                                    Brands
                                </p>
                            ) : null}
                            {brands.map((brand) => (
                                <BrandRow key={brand.uuid} brand={brand} />
                            ))}
                        </section>
                    ) : null}
                </div>
            )}
        </div>
    );
}
