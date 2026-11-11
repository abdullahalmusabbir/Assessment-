
import type { LucideIcon } from "lucide-react";
import {
    LayoutDashboard,
    User,
    FileText,
    CreditCard,
    Trophy,
    Users,
    BookOpen,
    CalendarDays,
    ClipboardList,
    BarChart3,
    Settings,
} from "lucide-react";

export type DashboardMenuItem = {
    title: string;
    href: string;
    icon: LucideIcon;
};

export type DashboardMenuGroup = {
    title: string;
    items: DashboardMenuItem[];
};

export const dashboardMenus: Record<number, DashboardMenuGroup[]> = {
    // Student
    1: [
        {
            title: "MY ACCOUNT",
            items: [
                {
                    title: "Overview",
                    href: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    title: "My Profile",
                    href: "/dashboard/student/profile",
                    icon: User,
                },
            ],
        },
        {
            title: "ADMISSION",
            items: [
                {
                    title: "My Applications",
                    href: "/dashboard/student/applications",
                    icon: FileText,
                },
                {
                    title: "Payments",
                    href: "/dashboard/student/payments",
                    icon: CreditCard,
                },
                {
                    title: "Lottery Results",
                    href: "/dashboard/student/results",
                    icon: Trophy,
                },
            ],
        },
    ],

    // Admission Office
    2: [
        {
            title: "WORKSPACE",
            items: [
                {
                    title: "Overview",
                    href: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    title: "Applications",
                    href: "/dashboard/admission-office/applications",
                    icon: ClipboardList,
                },
                {
                    title: "Admission Circulars",
                    href: "/dashboard/admission-office/circulars",
                    icon: FileText,
                },
            ],
        },
    ],

    // Admin
    3: [
        {
            title: "ADMINISTRATION",
            items: [
                {
                    title: "Overview",
                    href: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    title: "User Management",
                    href: "/dashboard/admin/users",
                    icon: Users,
                },
                {
                    title: "Class Management",
                    href: "/dashboard/admin/classes",
                    icon: BookOpen,
                },
                {
                    title: "Academic Years",
                    href: "/dashboard/admin/academic-years",
                    icon: CalendarDays,
                },
            ],
        },
        {
            title: "ADMISSION MANAGEMENT",
            items: [
                {
                    title: "Admission Circulars",
                    href: "/dashboard/admin/circulars",
                    icon: FileText,
                },
                {
                    title: "Lottery Management",
                    href: "/dashboard/admin/lottery",
                    icon: Trophy,
                },
                {
                    title: "Reports",
                    href: "/dashboard/admin/reports",
                    icon: BarChart3,
                },
            ],
        },
    ],
};

export const roleNames: Record<number, string> = {
    1: "Student",
    2: "Admission Office",
    3: "Administrator",
};

/**
 * Resolves a user role to its canonical numeric value (1 = Student, 2 = Admission
 * Office, 3 = Admin). Accepts either a numeric role or a role name string so the
 * sidebar/header and page content always agree on the active role.
 */
export function resolveRoleNumber(
    role: number | string | null | undefined
): number {
    if (typeof role === "number") {
        return role;
    }

    if (typeof role === "string" && role.length > 0) {
        const roleMap: Record<string, number> = {
            student: 1,
            admissionoffice: 2,
            admin: 3,
        };

        return roleMap[role.toLowerCase()] ?? 0;
    }

    return 0;
}