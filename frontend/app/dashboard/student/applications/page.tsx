
import ReadOnlyDataPage from "@/components/dashboard/ReadOnlyDataPage";
import RoleDashboardSection from "@/components/dashboard/RoleDashboardSection";
import { dashboardEndpoints } from "@/lib/dashboard-api";

export default function StudentApplicationsPage() {
    return (
        <RoleDashboardSection
            allowedRoles={[1]}
            title="My Applications"
            description="View your admission application history."
        >
            <ReadOnlyDataPage
                title="Application History"
                description="Your submitted admission applications."
                endpoint={dashboardEndpoints.studentApplications}
                columns={[
                    { key: "studentId", label: "Student ID" },
                    { key: "circularTitle", label: "Circular" },
                    { key: "className", label: "Class" },
                    { key: "status", label: "Status" },
                    { key: "createdAt", label: "Applied Date" },
                ]}
                searchableFields={["studentId", "circularTitle", "className", "status"]}
            />
        </RoleDashboardSection>
    );
}
