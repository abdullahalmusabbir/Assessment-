
"use client";

import type { ReactNode } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardSection from "./DashboardSection";

interface RoleDashboardSectionProps {
    allowedRoles: number[];
    title: string;
    description: string;
    children?: ReactNode;
}

export default function RoleDashboardSection({
    allowedRoles,
    title,
    description,
    children,
}: RoleDashboardSectionProps) {
    return (
        <ProtectedRoute allowedRoles={allowedRoles}>
            {children ? (
                <div className="space-y-6">{children}</div>
            ) : (
                <DashboardSection
                    title={title}
                    description={description}
                />
            )}
        </ProtectedRoute>
    );
}
