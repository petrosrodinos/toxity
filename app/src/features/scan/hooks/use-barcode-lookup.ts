import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { toast } from "@/hooks/use-toast";
import { get_product_by_barcode } from "@/features/products/services/products.services";
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

            const product = await get_product_by_barcode(trimmed_barcode);

            // No product for this barcode: route to the creation flow instead
            // of surfacing an error (the API returns 200 with a null body).
            if (!product) {
                navigate(Routes.products.create_with_barcode(trimmed_barcode));
                return null;
            }

            await create_scan({
                product_uuid: product.uuid,
                scan_method: ScanMethods.BARCODE,
            });

            query_client.invalidateQueries({ queryKey: ["scans"] });
            navigate(Routes.products.detail(product.uuid));
            return product;
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
