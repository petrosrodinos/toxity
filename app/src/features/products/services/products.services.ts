import axios from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    PaginatedResponse,
    ProductDetail,
    ProductListItem,
    ProductQuery,
} from "../interfaces/products.interfaces";

const get_error_message = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (typeof message === "string") {
            return message;
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
};

export const get_product_by_barcode = async (
    barcode: string,
): Promise<ProductDetail | null> => {
    try {
        const response = await axiosInstance.get(
            ApiRoutes.products.by_barcode(barcode),
        );
        // The API returns 200 with an empty/null body when no product matches.
        return response.data || null;
    } catch (error: unknown) {
        throw new Error(
            get_error_message(error, "Failed to look up product. Please try again."),
        );
    }
};

export const get_product = async (product_uuid: string): Promise<ProductDetail> => {
    try {
        const response = await axiosInstance.get(
            ApiRoutes.products.by_uuid(product_uuid),
        );
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            get_error_message(error, "Failed to load product. Please try again."),
        );
    }
};

export const get_products = async (
    query?: ProductQuery,
): Promise<PaginatedResponse<ProductListItem>> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.products.prefix, {
            params: query,
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            get_error_message(error, "Failed to load products. Please try again."),
        );
    }
};
