
import ReadOnlyDataPage from "@/components/dashboard/ReadOnlyDataPage";
import RoleDashboardSection from "@/components/dashboard/RoleDashboardSection";
import { dashboardEndpoints } from "@/lib/dashboard-api";

export default function AdmissionApplicationsPage() {
    return (
        <RoleDashboardSection
            allowedRoles={[2]}
            title="Manage Applications"
            description="Review student admission applications."
        >
            <ReadOnlyDataPage
                title="Student Applications"
                description="Applications submitted by students."
                endpoint={dashboardEndpoints.admissionApplications}
                columns={[
                    { key: "studentId", label: "Student ID" },
                    { key: "studentName", label: "Student Name" },
                    { key: "className", label: "Class" },
                    { key: "circularTitle", label: "Circular" },
                    { key: "paymentStatus", label: "Payment" },
                    { key: "status", label: "Status" },
                ]}
                searchableFields={[
                    "studentId",
                    "studentName",
                    "className",
                    "circularTitle",
                ]}
            />
        </RoleDashboardSection>
    );
}
