import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { SearchSort } from "@/features/search/interfaces/search.interfaces";

export type SearchTab = "all" | "products" | "ingredients" | "brands";

export const useSearchFilters = () => {
    const [search_params] = useSearchParams();
    const category_uuid = search_params.get("category_uuid") ?? undefined;

    const [q, set_q] = useState("");
    const [sort, set_sort] = useState<SearchSort>("newest");
    const [tab, set_tab] = useState<SearchTab>("all");

    const debounced_q = useDebouncedValue(q);

    const query = useMemo(
        () => ({
            q: debounced_q,
            sort,
            category_uuid,
        }),
        [debounced_q, sort, category_uuid],
    );

    return { q, set_q, sort, set_sort, tab, set_tab, category_uuid, query };
};
