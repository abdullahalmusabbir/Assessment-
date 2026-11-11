
"use client";

import { useAuth } from "@/hooks/useAuth";
import DashboardSection from "@/components/dashboard/DashboardSection";

export default function StudentProfilePage() {
    const { user } = useAuth();

    const fields = [
        { label: "First Name", value: user?.firstName },
        { label: "Last Name", value: user?.lastName },
        { label: "Email Address", value: user?.email },
        { label: "Phone Number", value: user?.phoneNumber },
        { label: "Account Role", value: "Student" },
        { label: "Account Status", value: user?.status },
    ];

    return (
        <DashboardSection
            title="My Profile"
            description="View your registered account information."
        >
            <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                    <div
                        key={field.label}
                        className="rounded-xl border border-white/10 bg-[#091a2c] p-5"
                    >
                        <p className="text-xs text-slate-500">{field.label}</p>
                        <p className="mt-2 break-words text-sm font-medium text-white">
                            {field.value || "Not provided"}
                        </p>
                    </div>
                ))}
            </div>

            <p className="mt-5 text-xs text-slate-500">
                Profile editing is not enabled in this version.
            </p>
        </DashboardSection>
    );
}
