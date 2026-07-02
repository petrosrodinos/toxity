import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { toast } from "@/hooks/use-toast";
import {
    get_product_by_barcode,
    ProductNotFoundError,
} from "@/features/products/services/products.services";
import { create_scan } from "@/features/scans/services/scans.services";
import { ScanMethods } from "@/features/scans/interfaces/scans.interfaces";

export const useBarcodeLookup = () => {
    const navigate = useNavigate();
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: async (barcode: string) => {
            const trimmed_barcode = barcode.trim();
            if (!trimmed_barcode) {
                throw new Error("Enter a valid barcode.");
            }

            try {
                const product = await get_product_by_barcode(trimmed_barcode);

                await create_scan({
                    product_uuid: product.uuid,
                    scan_method: ScanMethods.BARCODE,
                });

                query_client.invalidateQueries({ queryKey: ["scans"] });
                navigate(Routes.products.detail(product.uuid));
                return product;
            } catch (error) {
                if (error instanceof ProductNotFoundError) {
                    navigate(Routes.products.create_with_barcode(trimmed_barcode));
                    return null;
                }

                throw error;
            }
        },
        onError: (error: Error) => {
            toast({
                title: "Lookup failed",
                description: error.message,
                variant: "error",
            });
        },
    });
};
