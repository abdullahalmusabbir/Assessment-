
"use client";

import {
    Users,
    FileText,
    CreditCard,
    Trophy,
    BookOpen,
    ClipboardList,
    CalendarDays,
} from "lucide-react";
import DashboardStatCard from "./DashboardStatCard";
import { roleNames } from "@/types/dashboard";

interface DashboardOverviewProps {
    role: number;
    userName: string;
}

export default function DashboardOverview({
    role,
    userName,
}: DashboardOverviewProps) {
    const studentStats = [
        {
            title: "My Applications",
            value: "0",
            description: "Your submitted admission applications",
            icon: FileText,
        },
        {
            title: "Payment Status",
            value: "Pending",
            description: "Your latest admission payment",
            icon: CreditCard,
        },
        {
            title: "Lottery Status",
            value: "Waiting",
            description: "Admission lottery result status",
            icon: Trophy,
        },
    ];

    const admissionStats = [
        {
            title: "Total Applications",
            value: "0",
            description: "Applications received",
            icon: ClipboardList,
        },
        {
            title: "Pending Review",
            value: "0",
            description: "Applications awaiting review",
            icon: FileText,
        },
        {
            title: "Active Circulars",
            value: "0",
            description: "Currently published circulars",
            icon: CalendarDays,
        },
    ];

    const adminStats = [
        {
            title: "Total Users",
            value: "0",
            description: "Registered users in the system",
            icon: Users,
        },
        {
            title: "Total Applications",
            value: "0",
            description: "All admission applications",
            icon: FileText,
        },
        {
            title: "Total Classes",
            value: "0",
            description: "Configured school classes",
            icon: BookOpen,
        },
        {
            title: "Academic Years",
            value: "0",
            description: "Configured academic years",
            icon: CalendarDays,
        },
    ];

    const stats =
        role === 1
            ? studentStats
            : role === 2
                ? admissionStats
                : adminStats;

    return (
        <div className="space-y-8">
            <section>
                <p className="text-sm font-medium text-cyan-300">
                    {roleNames[role] ?? "Dashboard"}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    Hello, {userName}!
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Welcome to your EduBridge dashboard. Manage your activities and
                    access the services available in your account.
                </p>
            </section>

            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                        Overview
                    </h3>
                    <span className="text-xs text-slate-500">
                        Dashboard Summary
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <DashboardStatCard key={stat.title} {...stat} />
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#102b46] to-[#0d2035] p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-xs font-semibold tracking-[2px] text-cyan-300">
                            EDUBRIDGE PORTAL
                        </p>

                        <h3 className="mt-3 text-xl font-bold text-white">
                            Your admission journey starts here.
                        </h3>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                            Keep track of your activities, review important information,
                            and use the dashboard tools assigned to your role.
                        </p>
                    </div>

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                        {role === 1 ? (
                            <Trophy size={30} />
                        ) : role === 2 ? (
                            <ClipboardList size={30} />
                        ) : (
                            <Users size={30} />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
