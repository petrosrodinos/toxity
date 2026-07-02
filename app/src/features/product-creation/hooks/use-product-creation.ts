import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
    analyze_product_creation_job,
    create_product_creation_job,
    get_product_creation_job,
    start_product_analysis,
    upload_front_label,
    upload_ingredient_label,
} from "../services/product-creation.services";
import {
    ProductCreationJobStatuses,
    type CreateProductCreationJobDto,
} from "../interfaces/product-creation.interfaces";

export const useCreateProductCreationJob = () => {
    return useMutation({
        mutationFn: (dto: CreateProductCreationJobDto) =>
            create_product_creation_job(dto),
        onError: (error: Error) => {
            toast({
                title: "Could not start product creation",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useUploadIngredientLabel = () => {
    return useMutation({
        mutationFn: ({ job_uuid, file }: { job_uuid: string; file: File }) =>
            upload_ingredient_label(job_uuid, file),
        onError: (error: Error) => {
            toast({
                title: "Upload failed",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useUploadFrontLabel = () => {
    return useMutation({
        mutationFn: ({ job_uuid, file }: { job_uuid: string; file: File }) =>
            upload_front_label(job_uuid, file),
        onError: (error: Error) => {
            toast({
                title: "Upload failed",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useAnalyzeProductCreationJob = () => {
    return useMutation({
        mutationFn: (job_uuid: string) => analyze_product_creation_job(job_uuid),
        onError: (error: Error) => {
            toast({
                title: "Could not read labels",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useStartProductAnalysis = () => {
    return useMutation({
        mutationFn: (job_uuid: string) => start_product_analysis(job_uuid),
        onError: (error: Error) => {
            toast({
                title: "Could not start AI analysis",
                description: error.message,
                variant: "error",
            });
        },
    });
};

export const useProductCreationJob = (
    job_uuid: string | null,
    options?: { poll?: boolean },
) => {
    return useQuery({
        queryKey: ["product-creation-job", job_uuid],
        queryFn: () => get_product_creation_job(job_uuid as string),
        enabled: !!job_uuid,
        refetchInterval: (query) => {
            if (!options?.poll) return false;

            const status = query.state.data?.status;
            const is_finished =
                status === ProductCreationJobStatuses.COMPLETED ||
                status === ProductCreationJobStatuses.FAILED;

            return is_finished ? false : 2000;
        },
    });
};
