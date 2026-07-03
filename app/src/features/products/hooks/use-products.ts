import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
    get_product,
    get_product_by_barcode,
    get_products,
} from "../services/products.services";
import type { ProductQuery } from "../interfaces/products.interfaces";

export const useGetProducts = (query?: ProductQuery) => {
    return useQuery({
        queryKey: ["products", query],
        queryFn: () => get_products(query),
    });
};

export const useGetProduct = (product_uuid: string) => {
    return useQuery({
        queryKey: ["product", product_uuid],
        queryFn: () => get_product(product_uuid),
        enabled: !!product_uuid,
    });
};

export const useLookupProductByBarcode = () => {
    return useMutation({
        mutationFn: get_product_by_barcode,
        onError: (error: Error) => {
            toast({
                title: "Lookup failed",
                description: error.message,
                variant: "error",
            });
        },
    });
};
