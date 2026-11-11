"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
    Menu,
    X,
    GraduationCap,
    ArrowRight,
    LogIn,
    LayoutDashboard,
    LogOut,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "/our-story" },
    { label: "Admission", href: "/admission" },
    { label: "Contact", href: "/contact" },
];

function NavbarAuthActions() {
    const router = useRouter();

    const {
        user,
        isAuthenticated,
        isLoading,
        logout,
    } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    if (isLoading) {
        return (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-white/10" />
        );
    }

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-3">
                <span className="hidden text-sm text-[#c1cfdd] sm:block">
                    {user?.firstName}
                </span>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#13a89e]/10 px-4 py-2.5 text-sm font-bold text-[#55d4c6] transition hover:bg-[#13a89e]/20"
                >
                    <LayoutDashboard size={17} />
                    Dashboard
                </Link>

                <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-[#c1cfdd] transition hover:border-red-400/30 hover:text-red-300"
                >
                    <LogOut size={17} />
                    <span className="hidden sm:inline">
                        Logout
                    </span>
                </button>
            </div>
        );
    }

    return (
        <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-[#e5b85c] px-5 py-2.5 text-sm font-extrabold text-[#10243b] transition hover:bg-[#f0ca79]"
        >
            <LogIn size={17} />
            Login
        </Link>
    );
}

export default function Navbar() {
    const pathname = usePathname();

    const [visible, setVisible] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        let previousScroll = window.scrollY;

        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const difference = currentScroll - previousScroll;

            if (currentScroll < 80) {
                setVisible(true);
            } else if (difference > 5) {
                setVisible(false);
                setMobileOpen(false);
            } else if (difference < -5) {
                setVisible(true);
            }

            previousScroll = currentScroll;
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <motion.header
            initial={{ y: 0 }}
            animate={{ y: visible ? 0 : "-110%" }}
            transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#091a2dcc] shadow-lg shadow-black/10 backdrop-blur-xl"
        >
            <div className="site-container flex h-[78px] items-center justify-between">
                {/* LOGO */}
                <Link
                    href="/"
                    className="flex shrink-0 items-center gap-2.5"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a91a0] to-[#0e5b79] text-[#f4d78f]">
                        <GraduationCap size={26} />
                    </div>

                    <div>
                        <h2 className="text-lg font-extrabold tracking-wide text-[#e7edf5]">
                            Edu<span className="text-[#e5b85c]">Bridge</span>
                        </h2>
                        <p className="text-[9px] font-semibold tracking-[2px] text-[#8da7bd]">
                            SCHOOL ADMISSION
                        </p>
                    </div>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden items-center gap-8 lg:flex">
                    {navLinks.map((link) => {
                        const active = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative py-2 text-sm font-semibold transition-colors ${active
                                        ? "text-[#e5b85c]"
                                        : "text-[#c0cede] hover:text-[#21b7aa]"
                                    }`}
                            >
                                {link.label}

                                {active && (
                                    <motion.span
                                        layoutId="navbar-active"
                                        className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-[#e5b85c]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* AUTH ACTIONS (desktop) */}
                <div className="hidden lg:block">
                    <NavbarAuthActions />
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    onClick={() => setMobileOpen((value) => !value)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#e7edf5] lg:hidden"
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={23} /> : <Menu size={23} />}
                </button>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-white/10 bg-[#0c2036] lg:hidden"
                    >
                        <nav className="site-container flex flex-col gap-1 py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`rounded-lg px-4 py-3 text-sm font-semibold ${pathname === link.href
                                            ? "bg-[#13a89e]/10 text-[#e5b85c]"
                                            : "text-[#c0cede] hover:bg-white/5"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* AUTH ACTIONS (mobile) */}
                            <NavbarAuthActions />
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}