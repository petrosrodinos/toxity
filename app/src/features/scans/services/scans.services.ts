import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { CreateScanDto, Scan } from "../interfaces/scans.interfaces";
import type { PaginatedResponse } from "@/features/ingredients/interfaces/ingredients.interfaces";

export const create_scan = async (dto: CreateScanDto): Promise<Scan> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.scans.prefix, dto);
        return response.data;
    } catch (error: unknown) {
        const message =
            (error as { response?: { data?: { message?: string } } })?.response
                ?.data?.message || "Failed to record scan. Please try again.";
        throw new Error(message);
    }
};

export const get_scans = async (query?: {
    page?: number;
    limit?: number;
}): Promise<PaginatedResponse<Scan>> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.scans.prefix, {
            params: query,
        });
        return response.data;
    } catch (error: unknown) {
        const message =
            (error as { response?: { data?: { message?: string } } })?.response
                ?.data?.message || "Failed to load scan history. Please try again.";
        throw new Error(message);
    }
};

export const get_recent_scans = async (limit = 5): Promise<Scan[]> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.scans.recent, {
            params: { limit },
        });
        return response.data;
    } catch (error: unknown) {
        const message =
            (error as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
            "Failed to load recent scans. Please try again.";
        throw new Error(message);
    }
};
