import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { SearchQuery, SearchResult } from "../interfaces/search.interfaces";

export const search = async (query: SearchQuery): Promise<SearchResult> => {
    try {
        const params: Record<string, string | number> = {
            q: query.q.trim(),
        };

        if (query.sort) {
            params.sort = query.sort;
        }

        if (query.category_uuid) {
            params.category_uuid = query.category_uuid;
        }

        if (query.subcategory_uuid) {
            params.subcategory_uuid = query.subcategory_uuid;
        }

        if (query.page) {
            params.page = query.page;
        }

        if (query.limit) {
            params.limit = query.limit;
        }

        const response = await axiosInstance.get(ApiRoutes.search.root, {
            params,
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to search. Please try again.");
    }
};
