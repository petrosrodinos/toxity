import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import IngredientRow from "@/components/ingredient-row";
import BrandRow from "@/components/brand-row";
import { useSearch } from "@/features/search/hooks/use-search";
import { useSearchFilters, type SearchTab } from "./hooks/use-search-filters";

const SORT_OPTIONS: { value: string; label: string }[] = [
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
    const { q, set_q, sort, set_sort, tab, set_tab, query } = useSearchFilters();
    const { data, isLoading, isFetching } = useSearch(query);

    const has_query = query.q.trim().length > 0;
    const is_loading_results = has_query && (isLoading || isFetching);

    const products = data?.products.data ?? [];
    const ingredients = data?.ingredients.data ?? [];
    const brands = data?.brands.data ?? [];
    const total_results = products.length + ingredients.length + brands.length;

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

                <select
                    value={sort}
                    onChange={(event) =>
                        set_sort(event.target.value as typeof sort)
                    }
                    className="h-10 rounded-md border border-field-border bg-field px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {!has_query ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
                    Start typing to search the Toxity library.
                </p>
            ) : is_loading_results ? (
                <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : total_results === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
                    No results for "{query.q}". Try a different name, ingredient, or
                    barcode.
                </p>
            ) : (
                <div className="space-y-6">
                    {(tab === "all" || tab === "products") && products.length > 0 ? (
                        <section className="space-y-2">
                            {tab === "all" ? (
                                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                                    Products
                                </p>
                            ) : null}
                            {products.map((product) => (
                                <ProductCard key={product.uuid} product={product} />
                            ))}
                        </section>
                    ) : null}

                    {(tab === "all" || tab === "ingredients") &&
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

                    {(tab === "all" || tab === "brands") && brands.length > 0 ? (
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
