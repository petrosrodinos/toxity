import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/features/ingredients/interfaces/ingredients.interfaces";
import type { ProductListItem } from "@/features/products/interfaces/products.interfaces";
import type {
    AdminProductListItem,
    AdminProductQuery,
    AnalysisVersion,
    FeatureProductDto,
    MergeEntitiesDto,
    UpdateProductDto,
    VerifyProductDto,
} from "../interfaces/admin.interfaces";

const get_error_message = (error: unknown, fallback: string): string => {
    const response_message = (
        error as { response?: { data?: { message?: string } } }
    )?.response?.data?.message;

    return typeof response_message === "string" ? response_message : fallback;
};

export const get_pending_products = async (query?: {
    page?: number;
    limit?: number;
}): Promise<PaginatedResponse<ProductListItem>> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.admin.products.pending, {
            params: query,
        });
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to load pending products."));
    }
};

export const get_all_products = async (
    query?: AdminProductQuery,
): Promise<PaginatedResponse<AdminProductListItem>> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.admin.products.prefix, {
            params: query,
        });
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to load products."));
    }
};

export const update_product = async (
    product_uuid: string,
    dto: UpdateProductDto,
): Promise<AdminProductListItem> => {
    try {
        const response = await axiosInstance.patch(
            ApiRoutes.admin.products.by_uuid(product_uuid),
            dto,
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to update product."));
    }
};

export const delete_product = async (product_uuid: string): Promise<void> => {
    try {
        await axiosInstance.delete(ApiRoutes.admin.products.by_uuid(product_uuid));
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to delete product."));
    }
};

export const verify_product = async (
    product_uuid: string,
    dto: VerifyProductDto,
) => {
    try {
        const response = await axiosInstance.patch(
            ApiRoutes.admin.products.verify(product_uuid),
            dto,
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to update product status."));
    }
};

export const toggle_feature_product = async (
    product_uuid: string,
    dto: FeatureProductDto,
) => {
    try {
        const response = await axiosInstance.patch(
            ApiRoutes.admin.products.feature(product_uuid),
            dto,
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to update featured status."));
    }
};

export const merge_products = async (dto: MergeEntitiesDto) => {
    try {
        const response = await axiosInstance.post(ApiRoutes.admin.products.merge, dto);
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to merge products."));
    }
};

export const merge_ingredients = async (dto: MergeEntitiesDto) => {
    try {
        const response = await axiosInstance.post(
            ApiRoutes.admin.ingredients.merge,
            dto,
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to merge ingredients."));
    }
};

export const merge_brands = async (dto: MergeEntitiesDto) => {
    try {
        const response = await axiosInstance.post(ApiRoutes.admin.brands.merge, dto);
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to merge brands."));
    }
};

export const reanalyze_product = async (product_uuid: string) => {
    try {
        const response = await axiosInstance.post(
            ApiRoutes.admin.products.reanalyze(product_uuid),
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to start reanalysis."));
    }
};

export const reanalyze_ingredient = async (ingredient_uuid: string) => {
    try {
        const response = await axiosInstance.post(
            ApiRoutes.admin.ingredients.reanalyze(ingredient_uuid),
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to start reanalysis."));
    }
};

export const get_product_versions = async (
    product_uuid: string,
): Promise<PaginatedResponse<AnalysisVersion>> => {
    try {
        const response = await axiosInstance.get(
            ApiRoutes.admin.products.versions(product_uuid),
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to load version history."));
    }
};

export const get_ingredient_versions = async (
    ingredient_uuid: string,
): Promise<PaginatedResponse<AnalysisVersion>> => {
    try {
        const response = await axiosInstance.get(
            ApiRoutes.admin.ingredients.versions(ingredient_uuid),
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to load version history."));
    }
};
