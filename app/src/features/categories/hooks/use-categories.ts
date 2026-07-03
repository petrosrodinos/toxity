import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
    create_category,
    create_subcategory,
    delete_category,
    delete_subcategory,
    get_categories,
    update_category,
    update_subcategory,
} from "../services/categories.services";
import type {
    CreateCategoryDto,
    CreateSubcategoryDto,
    UpdateCategoryDto,
    UpdateSubcategoryDto,
} from "../interfaces/categories.interfaces";

const CATEGORIES_KEY = ["categories"];

export const useGetCategories = () => {
    return useQuery({
        queryKey: CATEGORIES_KEY,
        queryFn: () => get_categories(),
    });
};

export const useCreateCategory = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateCategoryDto) => create_category(dto),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: CATEGORIES_KEY });
            toast({ title: "Category created", duration: 2000 });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not create category",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useUpdateCategory = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: ({
            category_uuid,
            dto,
        }: {
            category_uuid: string;
            dto: UpdateCategoryDto;
        }) => update_category(category_uuid, dto),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: CATEGORIES_KEY });
            toast({ title: "Category updated", duration: 2000 });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not update category",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useDeleteCategory = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: (category_uuid: string) => delete_category(category_uuid),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: CATEGORIES_KEY });
            toast({ title: "Category removed", duration: 2000 });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not remove category",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useCreateSubcategory = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateSubcategoryDto) => create_subcategory(dto),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: CATEGORIES_KEY });
            toast({ title: "Subcategory created", duration: 2000 });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not create subcategory",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useUpdateSubcategory = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: ({
            subcategory_uuid,
            dto,
        }: {
            subcategory_uuid: string;
            dto: UpdateSubcategoryDto;
        }) => update_subcategory(subcategory_uuid, dto),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: CATEGORIES_KEY });
            toast({ title: "Subcategory updated", duration: 2000 });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not update subcategory",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useDeleteSubcategory = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: (subcategory_uuid: string) =>
            delete_subcategory(subcategory_uuid),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: CATEGORIES_KEY });
            toast({ title: "Subcategory removed", duration: 2000 });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not remove subcategory",
                description: error.message,
                variant: "error",
            });
        },
    });
};
