import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth";
import { getMe, updateProfile } from "../services/user.services";
import type { UpdateProfileDto } from "../interfaces/user.interface";

export const useGetMe = () => {
    const { isLoggedIn } = useAuthStore();

    return useQuery({
        queryKey: ["user"],
        queryFn: getMe,
        enabled: !!isLoggedIn,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { updateUser } = useAuthStore();

    return useMutation({
        mutationFn: (dto: UpdateProfileDto) => updateProfile(dto),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            updateUser({ full_name: data.name ?? data.email.split("@")[0] });
            toast({
                title: "Profile updated",
                description: "Your display name has been saved.",
                duration: 2000,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not update profile",
                description: error.message,
                variant: "error",
                duration: 3000,
            });
        },
    });
};
