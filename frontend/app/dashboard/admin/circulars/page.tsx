
export const instant = false;

import RoleDashboardSection from "@/components/dashboard/RoleDashboardSection";
import ResourceManager from "@/components/dashboard/ResourceManager";
import { resourceConfigs } from "@/lib/dashboard-api";

export default function AdminCircularsPage() {
    return (
        <RoleDashboardSection
            allowedRoles={[3]}
            title="Admission Circulars"
            description="Create and manage admission circulars."
        >
            <ResourceManager config={resourceConfigs.circulars} />
        </RoleDashboardSection>
    );
}