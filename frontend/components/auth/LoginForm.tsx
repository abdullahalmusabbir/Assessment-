
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from "lucide-react";

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const redirectAfterLogin = () => {
        const returnUrl = searchParams.get("returnUrl");

        // Only allow internal application paths.
        if (
            returnUrl &&
            returnUrl.startsWith("/") &&
            !returnUrl.startsWith("//")
        ) {
            router.replace(returnUrl);
            return;
        }

        router.replace("/dashboard");
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(email.trim(), password);

            /*
             * Remember Me is a UI preference here.
             * For persistent sessions, backend refresh-token
             * expiry and cookie policy should control duration.
             */
            void rememberMe;

            redirectAfterLogin();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="form-label">
                        Email Address
                    </label>

                    <div className="relative">
                        <Mail
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8197ac]"
                        />

                        <input
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter your email address"
                            className="form-control pl-11"
                        />
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label className="form-label mb-0">
                            Password
                        </label>

                        <Link
                            href="/forgot-password"
                            className="text-xs font-semibold text-[#13a89e] transition hover:text-[#65d7cb]"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="relative">
                        <LockKeyhole
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8197ac]"
                        />

                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            className="form-control px-11"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((previous) => !previous)
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8197ac] hover:text-[#e7edf5]"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm text-[#9fb2c5]">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) =>
                            setRememberMe(event.target.checked)
                        }
                        className="h-4 w-4 accent-[#13a89e]"
                    />

                    Remember me
                </label>

                {error && (
                    <div
                        role="alert"
                        className="rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
                    >
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="primary-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Signing in..." : "Login to Account"}
                </button>
            </form>

            <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-[#8197ac]">
                    OR CONTINUE WITH
                </span>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <GoogleLoginButton
                onSuccess={redirectAfterLogin}
                onError={setError}
            />

            <p className="mt-7 text-center text-xs leading-6 text-[#8197ac]">
                Having trouble accessing your account?
                <br />
                Contact the school admission office for assistance.
            </p>
        </div>
    );
}
