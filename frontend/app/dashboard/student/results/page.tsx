
import ReadOnlyDataPage from "@/components/dashboard/ReadOnlyDataPage";
import RoleDashboardSection from "@/components/dashboard/RoleDashboardSection";
import { dashboardEndpoints } from "@/lib/dashboard-api";

export default function StudentResultsPage() {
    return (
        <RoleDashboardSection
            allowedRoles={[1]}
            title="Lottery Results"
            description="Check your admission lottery result."
        >
            <ReadOnlyDataPage
                title="My Lottery Results"
                description="Lottery result information associated with your Student ID."
                endpoint={dashboardEndpoints.studentResults}
                columns={[
                    { key: "studentId", label: "Student ID" },
                    { key: "circularTitle", label: "Admission Circular" },
                    { key: "className", label: "Class" },
                    { key: "result", label: "Result" },
                    { key: "publishedAt", label: "Published Date" },
                ]}
                searchableFields={["studentId", "circularTitle", "className", "result"]}
            />
        </RoleDashboardSection>
    );
}
