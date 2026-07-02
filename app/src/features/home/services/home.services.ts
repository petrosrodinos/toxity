import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { HomeFeed } from "../interfaces/home.interfaces";

export const get_home_feed = async (): Promise<HomeFeed> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.home.root);
        return response.data;
    } catch (error) {
        throw new Error("Failed to load home feed. Please try again.");
    }
};
