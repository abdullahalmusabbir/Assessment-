
export const instant = false;

import RoleDashboardSection from "@/components/dashboard/RoleDashboardSection";
import ResourceManager from "@/components/dashboard/ResourceManager";
import { resourceConfigs } from "@/lib/dashboard-api";

export default function AdminAcademicYearsPage() {
    return (
        <RoleDashboardSection
            allowedRoles={[3]}
            title="Academic Years"
            description="Manage academic sessions."
        >
            <ResourceManager config={resourceConfigs.academicYears} />
        </RoleDashboardSection>
    );
}