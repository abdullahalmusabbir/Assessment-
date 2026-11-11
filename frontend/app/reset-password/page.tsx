"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

import {
    Eye,
    EyeOff,
    LockKeyhole,
    CheckCircle2,
    ArrowLeft,
} from "lucide-react";

function ResetPasswordContent() {
    const searchParams = useSearchParams();

    const email = searchParams.get("email") ?? "";
    const token = searchParams.get("token") ?? "";

    const { resetPassword } = useAuth();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        if (!email || !token) {
            setError(
                "The password reset link is invalid or incomplete."
            );
            return;
        }

        if (password.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await resetPassword({
                email,
                token,
                newPassword: password,
                confirmPassword,
            });

            setSuccess(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to reset your password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            description="Create a new password for your account."
        >
            {success ? (
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#13a89e]/10 text-[#13a89e]">
                        <CheckCircle2 size={34} />
                    </div>

                    <h2 className="mt-6 text-xl font-bold text-[#e7edf5]">
                        Password Updated
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-[#9fb2c5]">
                        Your password has been changed successfully.
                        You can now login using your new password.
                    </p>

                    <Link
                        href="/login"
                        className="primary-button mt-7 w-full justify-center"
                    >
                        Go to Login
                    </Link>
                </div>
            ) : (
                <>
                    {!email || !token ? (
                        <div>
                            <p className="rounded-lg border border-red-400/20 bg-red-400/5 p-4 text-sm leading-7 text-red-300">
                                Your reset link is missing its email or
                                token. Please request a new password
                                reset link.
                            </p>

                            <Link
                                href="/forgot-password"
                                className="primary-button mt-6 w-full justify-center"
                            >
                                Request New Reset Link
                            </Link>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            <div>
                                <label className="form-label">
                                    New Password
                                </label>

                                <div className="relative">
                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8197ac]"
                                    />

                                    <input
                                        required
                                        minLength={8}
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Enter new password"
                                        className="form-control px-11"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((value) => !value)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8197ac]"
                                        aria-label="Toggle new password visibility"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                <p className="mt-2 text-xs text-[#8197ac]">
                                    Use at least 8 characters.
                                </p>
                            </div>

                            <div>
                                <label className="form-label">
                                    Confirm New Password
                                </label>

                                <div className="relative">
                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8197ac]"
                                    />

                                    <input
                                        required
                                        minLength={8}
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(event) =>
                                            setConfirmPassword(event.target.value)
                                        }
                                        placeholder="Confirm new password"
                                        className="form-control px-11"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (value) => !value
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8197ac]"
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p
                                    role="alert"
                                    className="rounded-lg border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300"
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="primary-button w-full justify-center disabled:opacity-50"
                            >
                                {loading
                                    ? "Updating Password..."
                                    : "Update Password"}
                            </button>
                        </form>
                    )}
                </>
            )}

            <Link
                href="/login"
                className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-[#13a89e] hover:text-[#65d7cb]"
            >
                <ArrowLeft size={16} />
                Back to Login
            </Link>
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#081a2d]" />
            }
        >
            <ResetPasswordContent />
        </Suspense>
    );
}