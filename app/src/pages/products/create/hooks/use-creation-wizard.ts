import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Routes } from "@/routes/routes";
import { toast } from "@/hooks/use-toast";
import { normalize_barcode } from "@/lib/barcode";
import { get_product_by_barcode } from "@/features/products/services/products.services";
import { create_product_creation_job } from "@/features/product-creation/services/product-creation.services";
import {
    useAnalyzeProductCreationJob,
    useIdentifyProductFromFrontLabel,
    useProductCreationJob,
    useStartProductAnalysis,
    useUploadFrontLabel,
    useUploadIngredientLabel,
} from "@/features/product-creation/hooks/use-product-creation";
import { ProductCreationJobStatuses } from "@/features/product-creation/interfaces/product-creation.interfaces";
import { create_scan } from "@/features/scans/services/scans.services";
import { ScanMethods } from "@/features/scans/interfaces/scans.interfaces";
import { compress_image_file } from "../utils/compress-image.utils";

export type CreationWizardStep =
    | "initializing"
    | "front_label"
    | "identifying"
    | "ingredient_label"
    | "processing"
    | "failed";

export type ProcessingPhase = "ocr" | "starting" | "analyzing";

export const useCreationWizard = (barcode: string | null) => {
    const normalized_barcode = barcode?.trim()
        ? normalize_barcode(barcode.trim()) || null
        : null;
    const navigate = useNavigate();
    const query_client = useQueryClient();

    const [step, set_step] = useState<CreationWizardStep>("initializing");
    const [processing_phase, set_processing_phase] =
        useState<ProcessingPhase>("ocr");
    const [job_uuid, set_job_uuid] = useState<string | null>(null);
    const [error_message, set_error_message] = useState<string | null>(null);

    const upload_front_label_mutation = useUploadFrontLabel();
    const identify_front_label_mutation = useIdentifyProductFromFrontLabel();
    const upload_ingredient_label_mutation = useUploadIngredientLabel();
    const analyze_mutation = useAnalyzeProductCreationJob();
    const start_analysis_mutation = useStartProductAnalysis();

    const job_query = useProductCreationJob(job_uuid, {
        poll: step === "processing" && processing_phase === "analyzing",
    });

    const navigate_to_existing_product = useCallback(
        async (product_uuid: string) => {
            try {
                await create_scan({
                    product_uuid,
                    scan_method: ScanMethods.OCR,
                });
            } catch {
            }

            query_client.invalidateQueries({ queryKey: ["scans"] });
            navigate(Routes.products.detail(product_uuid), { replace: true });
        },
        [navigate, query_client],
    );

    const init_job = useCallback(
        async (is_cancelled: () => boolean) => {
            set_step("initializing");
            set_error_message(null);
            set_job_uuid(null);

            try {
                if (normalized_barcode) {
                    const existing_product =
                        await get_product_by_barcode(normalized_barcode);

                    if (existing_product) {
                        await navigate_to_existing_product(existing_product.uuid);
                        return;
                    }

                    if (is_cancelled()) return;
                }

                const job = await create_product_creation_job({
                    barcode: normalized_barcode ?? undefined,
                });

                if (is_cancelled()) return;

                set_job_uuid(job.uuid);
                set_step("front_label");
            } catch (error) {
                if (is_cancelled()) return;

                if (normalized_barcode) {
                    try {
                        const existing_product =
                            await get_product_by_barcode(normalized_barcode);

                        if (existing_product) {
                            await navigate_to_existing_product(
                                existing_product.uuid,
                            );
                            return;
                        }
                    } catch {
                    }
                }

                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to start product creation.";

                set_error_message(message);
                set_step("failed");
                toast({
                    title: "Could not start product creation",
                    description: message,
                    variant: "error",
                });
            }
        },
        [normalized_barcode, navigate_to_existing_product],
    );

    useEffect(() => {
        let cancelled = false;
        void init_job(() => cancelled);
        return () => {
            cancelled = true;
        };
    }, [init_job]);

    const start_new_job = useCallback(() => {
        void init_job(() => false);
    }, [init_job]);

    const run_analysis = useCallback(
        (target_job_uuid: string) => {
            set_error_message(null);
            set_step("processing");
            set_processing_phase("ocr");

            analyze_mutation.mutate(target_job_uuid, {
                onSuccess: () => {
                    set_processing_phase("starting");

                    start_analysis_mutation.mutate(target_job_uuid, {
                        onSuccess: () => set_processing_phase("analyzing"),
                        onError: (error: Error) => {
                            set_error_message(error.message);
                            set_step("failed");
                        },
                    });
                },
                onError: (error: Error) => {
                    set_error_message(error.message);
                    set_step("failed");
                },
            });
        },
        [analyze_mutation, start_analysis_mutation],
    );

    const retry_analysis = useCallback(() => {
        if (!job_uuid) {
            start_new_job();
            return;
        }
        run_analysis(job_uuid);
    }, [job_uuid, run_analysis, start_new_job]);

    const handle_front_label = useCallback(
        async (file: File) => {
            if (!job_uuid) return;
            const compressed = await compress_image_file(file);

            upload_front_label_mutation.mutate(
                { job_uuid, file: compressed },
                {
                    onSuccess: () => {
                        set_step("identifying");

                        identify_front_label_mutation.mutate(job_uuid, {
                            onSuccess: async (result) => {
                                if (result.matched_product_uuid) {
                                    await navigate_to_existing_product(
                                        result.matched_product_uuid,
                                    );
                                    return;
                                }

                                set_step("ingredient_label");
                            },
                            onError: (error: Error) => {
                                set_error_message(error.message);
                                set_step("failed");
                            },
                        });
                    },
                },
            );
        },
        [
            job_uuid,
            upload_front_label_mutation,
            identify_front_label_mutation,
            navigate_to_existing_product,
        ],
    );

    const handle_ingredient_label = useCallback(
        async (file: File) => {
            if (!job_uuid) return;
            const compressed = await compress_image_file(file);

            upload_ingredient_label_mutation.mutate(
                { job_uuid, file: compressed },
                { onSuccess: () => run_analysis(job_uuid) },
            );
        },
        [job_uuid, upload_ingredient_label_mutation, run_analysis],
    );

    useEffect(() => {
        const job = job_query.data;
        if (!job) return;

        if (
            job.status === ProductCreationJobStatuses.COMPLETED &&
            job.product_uuid
        ) {
            query_client.invalidateQueries({ queryKey: ["scans"] });
            query_client.invalidateQueries({ queryKey: ["products"] });
            navigate(Routes.products.detail(job.product_uuid));
        }

        if (job.status === ProductCreationJobStatuses.FAILED) {
            set_error_message(
                job.error_message ?? "Something went wrong during analysis.",
            );
            set_step("failed");
        }
    }, [job_query.data, navigate, query_client]);

    return {
        step,
        processing_phase,
        error_message,
        ingredient_count: job_query.data?.ocr_result?.ingredients.length ?? null,
        is_uploading_front_label: upload_front_label_mutation.isPending,
        is_identifying_front_label: identify_front_label_mutation.isPending,
        is_uploading_ingredient_label: upload_ingredient_label_mutation.isPending,
        handle_front_label,
        handle_ingredient_label,
        start_over: start_new_job,
        retry_analysis,
    };
};
