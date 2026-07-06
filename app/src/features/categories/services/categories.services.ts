import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { ProductListItem } from "@/features/products/interfaces/products.interfaces";
import type { PaginatedResponse } from "@/features/ingredients/interfaces/ingredients.interfaces";
import type {
    Category,
    CreateCategoryDto,
    CreateSubcategoryDto,
    Subcategory,
    UpdateCategoryDto,
    UpdateSubcategoryDto,
} from "../interfaces/categories.interfaces";

const get_error_message = (error: unknown, fallback: string): string => {
    const response_message = (
        error as { response?: { data?: { message?: string } } }
    )?.response?.data?.message;

    return typeof response_message === "string" ? response_message : fallback;
};

export const get_categories = async (): Promise<Category[]> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.categories.prefix);
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to load categories."));
    }
};

export const get_category_products = async (
    category_uuid: string,
    query?: { page?: number; limit?: number },
): Promise<PaginatedResponse<ProductListItem>> => {
    try {
        const response = await axiosInstance.get(
            ApiRoutes.categories.products(category_uuid),
            { params: query },
        );
        return response.data;
    } catch (error) {
        throw new Error(
            get_error_message(error, "Failed to load category products."),
        );
    }
};

export const create_category = async (
    dto: CreateCategoryDto,
): Promise<Category> => {
    try {
        const response = await axiosInstance.post(
            ApiRoutes.admin.categories.prefix,
            dto,
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to create category."));
    }
};

export const update_category = async (
    category_uuid: string,
    dto: UpdateCategoryDto,
): Promise<Category> => {
    try {
        const response = await axiosInstance.patch(
            ApiRoutes.admin.categories.by_uuid(category_uuid),
            dto,
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to update category."));
    }
};

export const delete_category = async (category_uuid: string): Promise<void> => {
    try {
        await axiosInstance.delete(
            ApiRoutes.admin.categories.by_uuid(category_uuid),
        );
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to delete category."));
    }
};

export const create_subcategory = async (
    dto: CreateSubcategoryDto,
): Promise<Subcategory> => {
    try {
        const response = await axiosInstance.post(
            ApiRoutes.admin.subcategories.prefix,
            dto,
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to create subcategory."));
    }
};

export const update_subcategory = async (
    subcategory_uuid: string,
    dto: UpdateSubcategoryDto,
): Promise<Subcategory> => {
    try {
        const response = await axiosInstance.patch(
            ApiRoutes.admin.subcategories.by_uuid(subcategory_uuid),
            dto,
        );
        return response.data;
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to update subcategory."));
    }
};

export const delete_subcategory = async (
    subcategory_uuid: string,
): Promise<void> => {
    try {
        await axiosInstance.delete(
            ApiRoutes.admin.subcategories.by_uuid(subcategory_uuid),
        );
    } catch (error) {
        throw new Error(get_error_message(error, "Failed to delete subcategory."));
    }
};
