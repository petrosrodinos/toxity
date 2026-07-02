import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { SearchQuery, SearchResult } from "../interfaces/search.interfaces";

export const search = async (query: SearchQuery): Promise<SearchResult> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.search.root, {
            params: query,
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to search. Please try again.");
    }
};
