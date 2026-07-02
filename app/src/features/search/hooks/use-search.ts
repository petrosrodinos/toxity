import { useQuery } from "@tanstack/react-query";
import { search } from "../services/search.services";
import type { SearchQuery } from "../interfaces/search.interfaces";

export const useSearch = (query: SearchQuery) => {
    return useQuery({
        queryKey: ["search", query],
        queryFn: () => search(query),
        enabled: query.q.trim().length > 0,
    });
};
