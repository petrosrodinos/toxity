import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { SignUpSchema, type SignUpFormValues } from "../../../validation-schemas/auth";
import { useSignup } from "@/features/auth/hooks/use-auth";

export function SignUpForm() {
  const { mutate, isPending } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { email: "", password: "", confirm_password: "" },
  });

  function onSubmit(data: SignUpFormValues) {
    mutate({ email: data.email, password: data.password });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 text-left">
      <div className="flex flex-col gap-1">
        <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="signup-email"
          {...register("email")}
          placeholder="name@example.com"
          type="email"
        />
        {errors.email && (
          <p className="text-sm text-danger">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <PasswordInput
          id="signup-password"
          {...register("password")}
          placeholder="********"
        />
        {errors.password && (
          <p className="text-sm text-danger">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="signup-confirm" className="text-sm font-medium text-foreground">
          Confirm Password
        </label>
        <PasswordInput
          id="signup-confirm"
          {...register("confirm_password")}
          placeholder="********"
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
        Create Account
      </ActionButtonWithPending>
    </form>
  );
}
