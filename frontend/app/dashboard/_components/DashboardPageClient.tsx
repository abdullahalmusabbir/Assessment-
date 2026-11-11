"use client";

import { useAuth } from "@/hooks/useAuth";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { resolveRoleNumber } from "@/types/dashboard";

export default function DashboardPageClient() {
    const { user } = useAuth();

    const role = resolveRoleNumber(user?.role);

    const userName =
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
        "User";

    return (
        <DashboardOverview
            role={role}
            userName={userName}
        />
    );
}