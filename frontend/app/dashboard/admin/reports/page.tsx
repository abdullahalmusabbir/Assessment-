
export const instant = false;

import RoleDashboardSection from "@/components/dashboard/RoleDashboardSection";
import ResourceManager from "@/components/dashboard/ResourceManager";
import { resourceConfigs } from "@/lib/dashboard-api";

export default function AdminReportsPage() {
    return (
        <RoleDashboardSection
            allowedRoles={[3]}
            title="Reports"
            description="View dashboard reports."
        >
            <ResourceManager config={resourceConfigs.reports} />
        </RoleDashboardSection>
    );
}