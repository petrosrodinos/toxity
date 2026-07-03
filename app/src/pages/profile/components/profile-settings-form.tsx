import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { useGetMe, useUpdateProfile } from "@/features/user/hooks/use-user";
import { useThemeContext } from "@/components/providers/theme-provider";
import { ProfileSettingsFormSkeleton } from "./profile-settings-form-skeleton";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name must be 100 characters or less" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSettingsForm() {
    const { data: profile, isLoading, isError } = useGetMe();
    const { mutate, isPending } = useUpdateProfile();
    const { theme, toggleTheme } = useThemeContext();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: "" },
    });

    useEffect(() => {
        if (profile) {
            reset({ name: profile.name ?? "" });
        }
    }, [profile, reset]);

    function onSubmit(data: ProfileFormValues) {
        mutate({ name: data.name.trim() });
    }

    if (isLoading) {
        return <ProfileSettingsFormSkeleton />;
    }

    if (isError) {
        return <p className="text-sm text-danger">Could not load your profile. Please try again.</p>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 max-w-md">
            <div className="flex flex-col gap-1">
                <label htmlFor="profile-email" className="text-sm font-medium text-foreground">
                    Email
                </label>
                <Input id="profile-email" value={profile?.email ?? ""} disabled readOnly />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="profile-name" className="text-sm font-medium text-foreground">
                    Display name
                </label>
                <Input
                    id="profile-name"
                    {...register("name")}
                    placeholder="Your name"
                    autoComplete="name"
                />
                {errors.name && <p className="text-sm text-danger">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Appearance</span>
                <div className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary/40 px-3 py-2.5">
                    <span className="text-sm text-muted">Theme</span>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium",
                            "text-foreground hover:bg-surface-secondary transition-colors duration-200",
                        )}
                    >
                        {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        {theme === "dark" ? "Dark" : "Light"}
                    </button>
                </div>
            </div>

            <ActionButtonWithPending type="submit" isDisabled={isPending} isPending={isPending} className="w-fit">
                Save changes
            </ActionButtonWithPending>
        </form>
    );
}
