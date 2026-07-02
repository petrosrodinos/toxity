import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Routes } from "@/routes/routes";
import {
    useAnalyzeProductCreationJob,
    useCreateProductCreationJob,
    useProductCreationJob,
    useStartProductAnalysis,
    useUploadFrontLabel,
    useUploadIngredientLabel,
} from "@/features/product-creation/hooks/use-product-creation";
import { ProductCreationJobStatuses } from "@/features/product-creation/interfaces/product-creation.interfaces";
import { compress_image_file } from "../utils/compress-image.utils";

export type CreationWizardStep =
    | "initializing"
    | "ingredient_label"
    | "front_label"
    | "processing"
    | "failed";

export type ProcessingPhase = "ocr" | "starting" | "analyzing";

export const useCreationWizard = (barcode: string | null) => {
    const navigate = useNavigate();
    const query_client = useQueryClient();

    const [step, set_step] = useState<CreationWizardStep>("initializing");
    const [processing_phase, set_processing_phase] =
        useState<ProcessingPhase>("ocr");
    const [job_uuid, set_job_uuid] = useState<string | null>(null);
    const [error_message, set_error_message] = useState<string | null>(null);

    const has_started_ref = useRef(false);

    const create_job_mutation = useCreateProductCreationJob();
    const upload_ingredient_label_mutation = useUploadIngredientLabel();
    const upload_front_label_mutation = useUploadFrontLabel();
    const analyze_mutation = useAnalyzeProductCreationJob();
    const start_analysis_mutation = useStartProductAnalysis();

    const job_query = useProductCreationJob(job_uuid, {
        poll: step === "processing" && processing_phase === "analyzing",
    });

    const start_new_job = useCallback(() => {
        set_step("initializing");
        set_error_message(null);
        set_job_uuid(null);

        create_job_mutation.mutate(
            { barcode: barcode ?? undefined },
            {
                onSuccess: (job) => {
                    set_job_uuid(job.uuid);
                    set_step("ingredient_label");
                },
                onError: (error: Error) => {
                    set_error_message(error.message);
                    set_step("failed");
                },
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [barcode]);

    useEffect(() => {
        if (has_started_ref.current) return;
        has_started_ref.current = true;
        start_new_job();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handle_ingredient_label = useCallback(
        async (file: File) => {
            if (!job_uuid) return;
            const compressed = await compress_image_file(file);

            upload_ingredient_label_mutation.mutate(
                { job_uuid, file: compressed },
                { onSuccess: () => set_step("front_label") },
            );
        },
        [job_uuid, upload_ingredient_label_mutation],
    );

    const handle_front_label = useCallback(
        async (file: File) => {
            if (!job_uuid) return;
            const compressed = await compress_image_file(file);

            upload_front_label_mutation.mutate(
                { job_uuid, file: compressed },
                {
                    onSuccess: () => {
                        set_step("processing");
                        set_processing_phase("ocr");

                        analyze_mutation.mutate(job_uuid, {
                            onSuccess: () => {
                                set_processing_phase("starting");

                                start_analysis_mutation.mutate(job_uuid, {
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
                },
            );
        },
        [
            job_uuid,
            upload_front_label_mutation,
            analyze_mutation,
            start_analysis_mutation,
        ],
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
        is_uploading_ingredient_label: upload_ingredient_label_mutation.isPending,
        is_uploading_front_label: upload_front_label_mutation.isPending,
        handle_ingredient_label,
        handle_front_label,
        start_over: start_new_job,
    };
};
