
"use client";

import { useMemo, useState } from "react";
import { Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface Column {
    key: string;
    label: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
    columns: Column[];
    data: T[];
    isLoading?: boolean;
    error?: string;
    searchableFields?: string[];
    onRefresh?: () => void;
    actions?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    isLoading = false,
    error = "",
    searchableFields = [],
    onRefresh,
    actions,
}: DataTableProps<T>) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const pageSize = 8;

    const filteredData = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) return data;

        return data.filter((row) =>
            searchableFields.some((field) =>
                String(row[field] ?? "")
                    .toLowerCase()
                    .includes(keyword)
            )
        );
    }, [data, search, searchableFields]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

    const currentPage = Math.min(page, totalPages);

    const visibleData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    function renderValue(value: unknown) {
        if (typeof value === "boolean") {
            return <StatusBadge status={value} />;
        }

        if (
            typeof value === "string" &&
            /^(active|inactive|pending|paid|unpaid|held|selected|rejected|approved|published|failed|cancelled|confirmed|waiting)$/i.test(
                value
            )
        ) {
            return <StatusBadge status={value} />;
        }

        if (value === null || value === undefined || value === "") {
            return <span className="text-slate-500">—</span>;
        }

        return String(value);
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                        placeholder="Search records..."
                        className="w-full rounded-xl border border-white/10 bg-[#091a2c] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
                    />
                </div>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                >
                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-[#091a2c] text-xs uppercase tracking-wider text-slate-400">
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key} className="px-5 py-4 font-semibold">
                                    {column.label}
                                </th>
                            ))}

                            {actions && (
                                <th className="px-5 py-4 font-semibold">Actions</th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-5 py-12 text-center text-slate-400"
                                >
                                    Loading records...
                                </td>
                            </tr>
                        ) : visibleData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-5 py-12 text-center text-slate-400"
                                >
                                    {error ? "Unable to load records." : "No records found."}
                                </td>
                            </tr>
                        ) : (
                            visibleData.map((row, index) => (
                                <tr
                                    key={String(row.id ?? index)}
                                    className="transition hover:bg-white/[0.025]"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-5 py-4 text-slate-300"
                                        >
                                            {renderValue(row[column.key])}
                                        </td>
                                    ))}

                                    {actions && (
                                        <td className="px-5 py-4">{actions(row)}</td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                    Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                    {" "}to {Math.min(currentPage * pageSize, filteredData.length)}
                    {" "}of {filteredData.length} records
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => setPage((value) => Math.max(1, value - 1))}
                        className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5 disabled:opacity-30"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <span className="px-3 text-xs text-slate-400">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() =>
                            setPage((value) => Math.min(totalPages, value + 1))
                        }
                        className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5 disabled:opacity-30"
                        aria-label="Next page"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
