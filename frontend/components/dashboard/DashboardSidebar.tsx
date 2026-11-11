
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, GraduationCap, ChevronLeft } from "lucide-react";
import { dashboardMenus, roleNames } from "@/types/dashboard";

interface DashboardSidebarProps {
    role: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function DashboardSidebar({
    role,
    isOpen,
    onClose,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const menuGroups = dashboardMenus[role] ?? [];

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/10 bg-[#091a2c] transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                        onClick={onClose}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                            <GraduationCap size={25} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-white">EduBridge</h2>
                            <p className="text-[10px] tracking-[2px] text-slate-400">
                                SCHOOL PORTAL
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={21} />
                    </button>
                </div>

                <div className="border-b border-white/10 px-6 py-5">
                    <p className="text-xs text-slate-500">CURRENT WORKSPACE</p>
                    <p className="mt-1 font-semibold text-cyan-300">
                        {roleNames[role] ?? "User"}
                    </p>
                </div>

                <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
                    {menuGroups.map((group) => (
                        <div key={group.title}>
                            <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.8px] text-slate-500">
                                {group.title}
                            </p>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive =
                                        pathname === item.href ||
                                        (item.href !== "/dashboard" &&
                                            pathname.startsWith(item.href + "/"));

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${isActive
                                                    ? "bg-cyan-400/10 font-semibold text-cyan-300"
                                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                }`}
                                        >
                                            <Icon size={18} />
                                            <span>{item.title}</span>

                                            {isActive && (
                                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="border-t border-white/10 p-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <ChevronLeft size={18} />
                        Back to Website
                    </Link>
                </div>
            </aside>
        </>
    );
}
