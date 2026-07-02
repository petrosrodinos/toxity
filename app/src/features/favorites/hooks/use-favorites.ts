import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
    check_favorite,
    create_favorite,
    get_favorites,
    remove_favorite,
} from "../services/favorites.services";
import type {
    CreateFavoriteDto,
    FavoritesQuery,
} from "../interfaces/favorites.interfaces";

export const useGetFavorites = (query?: FavoritesQuery) => {
    return useQuery({
        queryKey: ["favorites", query],
        queryFn: () => get_favorites(query),
    });
};

export const useCheckFavorite = (
    entity_type: CreateFavoriteDto["entity_type"],
    entity_uuid: string,
) => {
    return useQuery({
        queryKey: ["favorites", "check", entity_type, entity_uuid],
        queryFn: () => check_favorite(entity_type, entity_uuid),
        enabled: !!entity_uuid,
    });
};

export const useAddFavorite = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateFavoriteDto) => create_favorite(dto),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: ["favorites"] });
            toast({
                title: "Added to favorites",
                duration: 1500,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not favorite",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useRemoveFavorite = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: (favorite_uuid: string) => remove_favorite(favorite_uuid),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: ["favorites"] });
            toast({
                title: "Removed from favorites",
                duration: 1500,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not remove favorite",
                description: error.message,
                variant: "error",
            });
        },
    });
};
