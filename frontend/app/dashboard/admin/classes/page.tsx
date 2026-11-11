
export const instant = false;

import RoleDashboardSection from "@/components/dashboard/RoleDashboardSection";
import ResourceManager from "@/components/dashboard/ResourceManager";
import { resourceConfigs } from "@/lib/dashboard-api";

export default function AdminClassesPage() {
    return (
        <RoleDashboardSection
            allowedRoles={[3]}
            title="Class Management"
            description="Create and manage school classes."
        >
            <ResourceManager config={resourceConfigs.classes} />
        </RoleDashboardSection>
    );
}