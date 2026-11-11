
export const instant = false;

import RoleDashboardSection from "@/components/dashboard/RoleDashboardSection";
import ResourceManager from "@/components/dashboard/ResourceManager";
import { resourceConfigs } from "@/lib/dashboard-api";

export default function AdminLotteryPage() {
    return (
        <RoleDashboardSection
            allowedRoles={[3]}
            title="Lottery Management"
            description="Manage admission lottery."
        >
            <ResourceManager config={resourceConfigs.lottery} />
        </RoleDashboardSection>
    );
}