
"use client";

import { useState } from "react";
import Link from "next/link";

import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

import {
    ArrowLeft,
    Mail,
    CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        try {
            await forgotPassword(email.trim());

            setMessage(
                "If an account exists for this email, a password reset link will be sent."
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to process your request."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot Password?"
            description="Enter your registered email address to receive a password reset link."
        >
            <div className="mb-7 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#13a89e]/10 text-[#13a89e]">
                    <Mail size={30} />
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <div>
                    <label className="form-label">
                        Registered Email Address
                    </label>

                    <input
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Enter your registered email"
                        className="form-control"
                    />
                </div>

                {message && (
                    <div className="rounded-lg border border-[#13a89e]/20 bg-[#13a89e]/5 p-4">
                        <div className="flex items-start gap-2 text-sm font-semibold text-[#72ddd0]">
                            <CheckCircle2
                                size={18}
                                className="mt-0.5 shrink-0"
                            />
                            Request submitted
                        </div>

                        <p className="mt-2 text-sm leading-6 text-[#9fb2c5]">
                            {message}
                        </p>
                    </div>
                )}

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
                        ? "Sending Reset Link..."
                        : "Send Reset Link"}
                </button>
            </form>

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
