import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { UpdateProfileDto, UserProfile } from "../interfaces/user.interface";

export const getMe = async (): Promise<UserProfile> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.users.me);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message || "Failed to load profile. Please try again.",
        );
    }
};

export const updateProfile = async (dto: UpdateProfileDto): Promise<UserProfile> => {
    try {
        const response = await axiosInstance.patch(ApiRoutes.users.me, dto);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message || "Failed to update profile. Please try again.",
        );
    }
};
