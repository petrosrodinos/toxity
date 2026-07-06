import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
    delete_product,
    get_all_products,
    get_ingredient_versions,
    get_product_versions,
    merge_brands,
    merge_ingredients,
    merge_products,
    reanalyze_ingredient,
    reanalyze_product,
    toggle_feature_product,
    update_product,
} from "../services/admin.services";
import type {
    AdminProductQuery,
    FeatureProductDto,
    MergeEntitiesDto,
    UpdateProductDto,
} from "../interfaces/admin.interfaces";

export const useGetAllProducts = (query?: AdminProductQuery) => {
    return useQuery({
        queryKey: ["admin-products", query],
        queryFn: () => get_all_products(query),
    });
};

export const useUpdateProduct = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: ({
            product_uuid,
            dto,
        }: {
            product_uuid: string;
            dto: UpdateProductDto;
        }) => update_product(product_uuid, dto),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: ["admin-products"] });
            query_client.invalidateQueries({ queryKey: ["product"] });
            toast({ title: "Product updated", duration: 2000 });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not update product",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useDeleteProduct = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: (product_uuid: string) => delete_product(product_uuid),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: ["admin-products"] });
            toast({ title: "Product removed", duration: 2000 });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not remove product",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useToggleFeatureProduct = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: ({
            product_uuid,
            dto,
        }: {
            product_uuid: string;
            dto: FeatureProductDto;
        }) => toggle_feature_product(product_uuid, dto),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: ["product"] });
            toast({ title: "Featured status updated", duration: 2000 });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not update featured status",
                description: error.message,
                variant: "error",
            });
        },
    });
};

const useMergeMutation = (
    mutationFn: (dto: MergeEntitiesDto) => Promise<unknown>,
    label: string,
) => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: ["admin-products"] });
            toast({ title: `${label} merged`, duration: 2000 });
        },
        onError: (error: Error) => {
            toast({
                title: `Could not merge ${label.toLowerCase()}`,
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useMergeProducts = () => useMergeMutation(merge_products, "Products");
export const useMergeIngredients = () =>
    useMergeMutation(merge_ingredients, "Ingredients");
export const useMergeBrands = () => useMergeMutation(merge_brands, "Brands");

export const useReanalyzeProduct = () => {
    return useMutation({
        mutationFn: (product_uuid: string) => reanalyze_product(product_uuid),
        onSuccess: () => {
            toast({
                title: "Reanalysis started",
                description: "This may take up to a minute.",
                duration: 2500,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not start reanalysis",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useReanalyzeIngredient = () => {
    return useMutation({
        mutationFn: (ingredient_uuid: string) => reanalyze_ingredient(ingredient_uuid),
        onSuccess: () => {
            toast({
                title: "Reanalysis started",
                description: "This may take up to a minute.",
                duration: 2500,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not start reanalysis",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useGetProductVersions = (product_uuid: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["admin-product-versions", product_uuid],
        queryFn: () => get_product_versions(product_uuid),
        enabled: enabled && !!product_uuid,
    });
};

export const useGetIngredientVersions = (
    ingredient_uuid: string,
    enabled: boolean,
) => {
    return useQuery({
        queryKey: ["admin-ingredient-versions", ingredient_uuid],
        queryFn: () => get_ingredient_versions(ingredient_uuid),
        enabled: enabled && !!ingredient_uuid,
    });
};
