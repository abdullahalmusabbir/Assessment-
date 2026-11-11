
"use client";

import { useState } from "react";
import { Menu, Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { roleNames } from "@/types/dashboard";

interface DashboardHeaderProps {
    role: number;
    onMenuClick: () => void;
}

export default function DashboardHeader({
    role,
    onMenuClick,
}: DashboardHeaderProps) {
    const { user, logout } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);

    const fullName =
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
        "Dashboard User";

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#0b1e32]/95 px-4 backdrop-blur-xl sm:px-7">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5 lg:hidden"
                >
                    <Menu size={21} />
                </button>

                <div>
                    <p className="text-xs text-slate-500">WELCOME BACK</p>
                    <h1 className="text-sm font-semibold text-white sm:text-base">
                        {fullName}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300 sm:inline-block">
                    {roleNames[role] ?? "User"}
                </span>

                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                    <Bell size={19} />
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                </button>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setProfileOpen((value) => !value)}
                        className="flex items-center gap-2 rounded-xl border border-white/10 p-2 transition hover:bg-white/5"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                            <User size={18} />
                        </div>

                        <ChevronDown size={16} className="text-slate-400" />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-14 w-52 rounded-xl border border-white/10 bg-[#102740] p-2 shadow-2xl">
                            <div className="border-b border-white/10 px-3 py-2">
                                <p className="truncate text-sm font-semibold text-white">
                                    {fullName}
                                </p>
                                <p className="truncate text-xs text-slate-400">
                                    {user?.email}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={async () => {
                                    setProfileOpen(false);
                                    await logout();
                                }}
                                className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-300 transition hover:bg-red-400/10"
                            >
                                <LogOut size={17} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
