import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import {
    ForgotPasswordSchema,
    type ForgotPasswordFormValues,
} from "../../../validation-schemas/auth";
import { useForgotPassword } from "@/features/auth/hooks/use-auth";

interface ForgotPasswordFormProps {
    className?: string;
}

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
    const { mutate, isPending, isSuccess } = useForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: { email: "" },
    });

    function onSubmit(data: ForgotPasswordFormValues) {
        mutate(data.email);
    }

    if (isSuccess) {
        return (
            <p className="text-sm text-muted text-center">
                If an account exists for that email, you will receive a reset link shortly.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("grid gap-4 text-left", className)}>
            <div className="flex flex-col gap-1">
                <label htmlFor="forgot-email" className="text-sm font-medium text-foreground">
                    Email
                </label>
                <Input
                    id="forgot-email"
                    {...register("email")}
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                />
                {errors.email && (
                    <p className="text-sm text-danger">{errors.email.message}</p>
                )}
            </div>

            <ActionButtonWithPending
                type="submit"
                isDisabled={isPending}
                isPending={isPending}
                fullWidth
                className="mt-2"
            >
                Send reset link
            </ActionButtonWithPending>
        </form>
    );
}
