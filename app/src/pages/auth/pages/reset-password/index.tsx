import type { FC } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Routes } from "@/routes/routes";
import { ResetPasswordForm } from "./components/reset-password-form";

const ResetPasswordPage: FC = () => {
    const [search_params] = useSearchParams();
    const token = search_params.get("token") ?? "";

    return (
        <Card className="w-full max-w-md mx-auto p-8">
            <div className="flex flex-col gap-1 text-left mb-6">
                <p className="text-2xl font-semibold">Reset password</p>
                <p className="text-sm text-muted">Choose a new password for your account</p>
            </div>

            {!token ? (
                <div className="space-y-4 text-center">
                    <p className="text-sm text-danger">
                        This reset link is invalid or missing a token.
                    </p>
                    <Link
                        to={Routes.auth.forgot_password}
                        className="text-sm underline underline-offset-4 hover:opacity-80"
                    >
                        Request a new reset link
                    </Link>
                </div>
            ) : (
                <ResetPasswordForm token={token} />
            )}

            <div className="text-center text-sm mt-4 text-muted">
                <Link
                    to={Routes.auth.sign_in}
                    className="underline underline-offset-4 hover:opacity-80"
                >
                    Back to sign in
                </Link>
            </div>
        </Card>
    );
};

export default ResetPasswordPage;
