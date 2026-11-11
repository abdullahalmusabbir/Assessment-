
import ReadOnlyDataPage from "@/components/dashboard/ReadOnlyDataPage";
import RoleDashboardSection from "@/components/dashboard/RoleDashboardSection";
import { dashboardEndpoints } from "@/lib/dashboard-api";

export default function AdmissionOfficeCircularsPage() {
    return (
        <RoleDashboardSection
            allowedRoles={[2]}
            title="Admission Circulars"
            description="View admission circulars and their application periods."
        >
            <ReadOnlyDataPage
                title="Available Circulars"
                description="Published admission circulars."
                endpoint={dashboardEndpoints.admissionCirculars}
                columns={[
                    { key: "title", label: "Circular Title" },
                    { key: "academicYearName", label: "Academic Year" },
                    { key: "applicationStartDate", label: "Start Date" },
                    { key: "applicationEndDate", label: "End Date" },
                    { key: "isPublished", label: "Published" },
                    { key: "isActive", label: "Active" },
                ]}
                searchableFields={["title", "academicYearName"]}
            />
        </RoleDashboardSection>
    );
}
