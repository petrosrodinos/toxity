import axios from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    CreateProductCreationJobDto,
    ProductCreationIdentifyResult,
    ProductCreationJob,
} from "../interfaces/product-creation.interfaces";

const get_error_message = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (typeof message === "string") {
            return message;
        }
        if (Array.isArray(message) && typeof message[0] === "string") {
            return message[0];
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
};

export const create_product_creation_job = async (
    dto: CreateProductCreationJobDto,
): Promise<ProductCreationJob> => {
    try {
        const response = await axiosInstance.post(
            ApiRoutes.product_creation.jobs,
            dto,
        );
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            get_error_message(error, "Failed to start product creation."),
        );
    }
};

export const get_product_creation_job = async (
    job_uuid: string,
): Promise<ProductCreationJob> => {
    try {
        const response = await axiosInstance.get(
            ApiRoutes.product_creation.job_by_uuid(job_uuid),
        );
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            get_error_message(error, "Failed to load product creation status."),
        );
    }
};

const upload_label_image = async (
    url: string,
    file: File,
): Promise<ProductCreationJob> => {
    const form_data = new FormData();
    form_data.append("image", file);

    try {
        // Override the instance default Content-Type (application/json). Without
        // this, axios serializes the FormData to JSON ({"image":{}}) and the
        // file never reaches the server. Setting "multipart/form-data" lets
        // axios/browser regenerate the header with the correct boundary.
        const response = await axiosInstance.post(url, form_data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(get_error_message(error, "Failed to upload photo."));
    }
};

export const upload_ingredient_label = (job_uuid: string, file: File) =>
    upload_label_image(
        ApiRoutes.product_creation.ingredient_label(job_uuid),
        file,
    );

export const upload_front_label = (job_uuid: string, file: File) =>
    upload_label_image(ApiRoutes.product_creation.front_label(job_uuid), file);

export const analyze_product_creation_job = async (
    job_uuid: string,
): Promise<ProductCreationJob> => {
    try {
        const response = await axiosInstance.post(
            ApiRoutes.product_creation.analyze(job_uuid),
        );
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            get_error_message(
                error,
                "Could not read text from the label photos. Please retake clearer pictures.",
            ),
        );
    }
};

export const start_product_analysis = async (
    job_uuid: string,
): Promise<ProductCreationJob> => {
    try {
        const response = await axiosInstance.post(
            ApiRoutes.product_creation.start_analysis(job_uuid),
        );
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            get_error_message(error, "Failed to start AI analysis."),
        );
    }
};

export const identify_product_from_front_label = async (
    job_uuid: string,
): Promise<ProductCreationIdentifyResult> => {
    try {
        const response = await axiosInstance.post(
            ApiRoutes.product_creation.identify(job_uuid),
        );
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            get_error_message(
                error,
                "Could not read the label photo. Please retake a clearer picture.",
            ),
        );
    }
};
