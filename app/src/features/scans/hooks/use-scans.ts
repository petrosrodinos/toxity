import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
    create_scan,
    get_recent_scans,
    get_scans,
} from "../services/scans.services";
import type { CreateScanDto } from "../interfaces/scans.interfaces";

export const useGetScans = (query?: { page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ["scans", query],
        queryFn: () => get_scans(query),
    });
};

export const useGetRecentScans = (limit = 5) => {
    return useQuery({
        queryKey: ["scans", "recent", limit],
        queryFn: () => get_recent_scans(limit),
    });
};

export const useRecordScan = () => {
    const query_client = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateScanDto) => create_scan(dto),
        onSuccess: () => {
            query_client.invalidateQueries({ queryKey: ["scans"] });
            toast({
                title: "Scan saved",
                description: "Product added to your scan history.",
                duration: 2000,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not save scan",
                description: error.message,
                variant: "error",
            });
        },
    });
};
