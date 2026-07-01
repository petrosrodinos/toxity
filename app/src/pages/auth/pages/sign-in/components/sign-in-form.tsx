import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { SignInSchema, type SignInFormValues } from "../../../validation-schemas/auth";
import { useSignin } from "@/features/auth/hooks/use-auth";

interface SignInFormProps {
  className?: string;
}

export function SignInForm({ className }: SignInFormProps) {
  const { mutate, isPending } = useSignin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: SignInFormValues) {
    mutate({ email: data.email, password: data.password });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("grid gap-4 text-left", className)}>
      <div className="flex flex-col gap-1">
        <label htmlFor="signin-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="signin-email"
          {...register("email")}
          placeholder="username"
          type="email"
        />
        {errors.email && (
          <p className="text-sm text-danger">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="signin-password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <PasswordInput
          id="signin-password"
          {...register("password")}
          placeholder="********"
        />
        {errors.password && (
          <p className="text-sm text-danger">{errors.password.message}</p>
        )}
      </div>

      <ActionButtonWithPending
        type="submit"
        isDisabled={isPending}
        isPending={isPending}
        fullWidth
        className="mt-2"
      >
        Login
      </ActionButtonWithPending>
    </form>
  );
}
