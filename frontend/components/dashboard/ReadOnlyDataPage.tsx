
"use client";

import DashboardSection from "./DashboardSection";
import DataTable from "./DataTable";
import { useApiData } from "@/hooks/useApiData";
import type { ResourceColumn } from "@/lib/dashboard-api";

interface ReadOnlyDataPageProps {
    title: string;
    description: string;
    endpoint: string;
    columns: ResourceColumn[];
    searchableFields?: string[];
}

export default function ReadOnlyDataPage({
    title,
    description,
    endpoint,
    columns,
    searchableFields = [],
}: ReadOnlyDataPageProps) {
    const { data, isLoading, error, refetch } =
        useApiData<Record<string, unknown>>(endpoint);

    return (
        <DashboardSection title={title} description={description}>
            <DataTable
                columns={columns}
                data={data}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                searchableFields={searchableFields}
            />
        </DashboardSection>
    );
}
