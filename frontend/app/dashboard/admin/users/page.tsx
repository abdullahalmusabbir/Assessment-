
export const instant = false;

import RoleDashboardSection from "@/components/dashboard/RoleDashboardSection";
import ResourceManager from "@/components/dashboard/ResourceManager";
import { resourceConfigs } from "@/lib/dashboard-api";

export default function AdminUsersPage() {
    return (
        <RoleDashboardSection
            allowedRoles={[3]}
            title="User Management"
            description="Manage users and their account information."
        >
            <ResourceManager config={resourceConfigs.users} />
        </RoleDashboardSection>
    );
}