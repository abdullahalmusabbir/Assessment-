
import ReadOnlyDataPage from "@/components/dashboard/ReadOnlyDataPage";
import RoleDashboardSection from "@/components/dashboard/RoleDashboardSection";
import { dashboardEndpoints } from "@/lib/dashboard-api";

export default function StudentPaymentsPage() {
    return (
        <RoleDashboardSection
            allowedRoles={[1]}
            title="My Payments"
            description="Check your admission fee payment history."
        >
            <ReadOnlyDataPage
                title="Payment History"
                description="All payments associated with your account."
                endpoint={dashboardEndpoints.studentPayments}
                columns={[
                    { key: "transactionId", label: "Transaction ID" },
                    { key: "amount", label: "Amount" },
                    { key: "paymentMethod", label: "Payment Method" },
                    { key: "status", label: "Status" },
                    { key: "paidAt", label: "Payment Date" },
                ]}
                searchableFields={["transactionId", "paymentMethod", "status"]}
            />
        </RoleDashboardSection>
    );
}
