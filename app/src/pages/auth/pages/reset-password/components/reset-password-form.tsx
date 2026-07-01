import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { PasswordInput } from "@/components/ui/password-input";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import {
    ResetPasswordSchema,
    type ResetPasswordFormValues,
} from "../../../validation-schemas/auth";
import { useResetPassword } from "@/features/auth/hooks/use-auth";

interface ResetPasswordFormProps {
    token: string;
    className?: string;
}

export function ResetPasswordForm({ token, className }: ResetPasswordFormProps) {
    const { mutate, isPending } = useResetPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: { password: "", confirm_password: "" },
    });

    function onSubmit(data: ResetPasswordFormValues) {
        mutate({ token, password: data.password });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("grid gap-4 text-left", className)}>
            <div className="flex flex-col gap-1">
                <label htmlFor="reset-password" className="text-sm font-medium text-foreground">
                    New password
                </label>
                <PasswordInput
                    id="reset-password"
                    {...register("password")}
                    placeholder="********"
                    autoComplete="new-password"
                />
                {errors.password && (
                    <p className="text-sm text-danger">{errors.password.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="reset-confirm-password" className="text-sm font-medium text-foreground">
                    Confirm password
                </label>
                <PasswordInput
                    id="reset-confirm-password"
                    {...register("confirm_password")}
                    placeholder="********"
                    autoComplete="new-password"
                />
                {errors.confirm_password && (
                    <p className="text-sm text-danger">{errors.confirm_password.message}</p>
                )}
            </div>

            <ActionButtonWithPending
                type="submit"
                isDisabled={isPending}
                isPending={isPending}
                fullWidth
                className="mt-2"
            >
                Reset password
            </ActionButtonWithPending>
        </form>
    );
}
