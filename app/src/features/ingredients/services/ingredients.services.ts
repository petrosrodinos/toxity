import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    Ingredient,
    IngredientQuery,
    PaginatedResponse,
} from "../interfaces/ingredients.interfaces";

export const get_ingredients = async (
    query?: IngredientQuery,
): Promise<PaginatedResponse<Ingredient>> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.ingredients.prefix, {
            params: query,
        });
        return response.data;
    } catch (error: unknown) {
        const message =
            (error as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
            "Failed to load ingredients. Please try again.";
        throw new Error(message);
    }
};

export const get_ingredient = async (
    ingredient_uuid: string,
): Promise<Ingredient> => {
    try {
        const response = await axiosInstance.get(
            ApiRoutes.ingredients.by_uuid(ingredient_uuid),
        );
        return response.data;
    } catch (error: unknown) {
        const message =
            (error as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
            "Failed to load ingredient. Please try again.";
        throw new Error(message);
    }
};
