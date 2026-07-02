import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    CreateFavoriteDto,
    Favorite,
    FavoriteEntityType,
    FavoritesQuery,
    PaginatedResponse,
} from "../interfaces/favorites.interfaces";

export const get_favorites = async (
    query?: FavoritesQuery,
): Promise<PaginatedResponse<Favorite>> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.favorites.prefix, {
            params: query,
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to load favorites. Please try again.");
    }
};

export const check_favorite = async (
    entity_type: FavoriteEntityType,
    entity_uuid: string,
): Promise<{ is_favorited: boolean; favorite_uuid: string | null }> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.favorites.check, {
            params: { entity_type, entity_uuid },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to check favorite status.");
    }
};

export const create_favorite = async (
    dto: CreateFavoriteDto,
): Promise<Favorite> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.favorites.prefix, dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to add favorite. Please try again.");
    }
};

export const remove_favorite = async (favorite_uuid: string): Promise<void> => {
    try {
        await axiosInstance.delete(ApiRoutes.favorites.by_uuid(favorite_uuid));
    } catch (error) {
        throw new Error("Failed to remove favorite. Please try again.");
    }
};
