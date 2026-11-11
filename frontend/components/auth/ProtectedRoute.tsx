
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { resolveRoleNumber } from "@/types/dashboard";

export default function ProtectedRoute({
    children,
    allowedRoles,
}: {
    children: ReactNode;
    allowedRoles?: number[];
}) {
    const router = useRouter();

    const {
        user,
        isAuthenticated,
        isLoading,
    } = useAuth();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        if (
            allowedRoles &&
            user &&
            !allowedRoles.includes(resolveRoleNumber(user.role))
        ) {
            router.replace("/dashboard");
        }
    }, [
        isLoading,
        isAuthenticated,
        user,
        allowedRoles,
        router,
    ]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#081a2d]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#13a89e]/20 border-t-[#13a89e]" />

                    <p className="mt-4 text-sm text-[#9fb2c5]">
                        Checking your account...
                    </p>
                </div>
            </div>
        );
    }

    if (
        allowedRoles &&
        user &&
        !allowedRoles.includes(resolveRoleNumber(user.role))
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#081a2d]">
                <p className="text-sm text-[#9fb2c5]">
                    Redirecting...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}