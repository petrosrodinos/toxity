import { useQuery } from "@tanstack/react-query";
import { get_ingredient, get_ingredients } from "../services/ingredients.services";
import type { IngredientQuery } from "../interfaces/ingredients.interfaces";

export const useGetIngredients = (query?: IngredientQuery) => {
    return useQuery({
        queryKey: ["ingredients", query],
        queryFn: () => get_ingredients(query),
    });
};

export const useGetIngredient = (ingredient_uuid: string) => {
    return useQuery({
        queryKey: ["ingredient", ingredient_uuid],
        queryFn: () => get_ingredient(ingredient_uuid),
        enabled: !!ingredient_uuid,
    });
};
