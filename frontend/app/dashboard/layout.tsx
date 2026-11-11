
"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/hooks/useAuth";
import { resolveRoleNumber } from "@/types/dashboard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    const role = resolveRoleNumber(user?.role);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#081a2d]">
                <DashboardSidebar
                    role={role}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <div className="min-h-screen lg:pl-[270px]">
                    <DashboardHeader
                        role={role}
                        onMenuClick={() => setSidebarOpen(true)}
                    />

                    <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-7 lg:p-9">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}