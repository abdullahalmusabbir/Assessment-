"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { api } from "@/lib/api";
import DataTable from "./DataTable";
import { useApiData } from "@/hooks/useApiData";
import type { ResourceConfig, ResourceField } from "@/lib/dashboard-api";

interface ResourceManagerProps {
    config: ResourceConfig;
}

type FormValues = Record<string, string>;
type SelectOption = { label: string; value: string };

export default function ResourceManager({
    config,
}: ResourceManagerProps) {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useApiData<Record<string, unknown>>(config.endpoint);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);
    const [form, setForm] = useState<FormValues>({});
    const [saving, setSaving] = useState(false);
    const [actionError, setActionError] = useState("");
    const [selectOptions, setSelectOptions] = useState<
        Record<string, SelectOption[]>
    >({});

    async function loadSelectOptions(field: ResourceField) {
        if (
            field.type === "select" &&
            field.optionsEndpoint &&
            !field.options
        ) {
            try {
                const response = await api.get<unknown[]>(
                    field.optionsEndpoint
                );
                const options: SelectOption[] = response.map((item) => {
                    const obj = item as Record<string, unknown>;
                    const label =
                        obj.year !== undefined && obj.name !== undefined
                            ? `${obj.name} (${obj.year})`
                            : (obj.name ?? obj.title ?? String(obj.id));
                    return {
                        label: String(label),
                        value: String(obj.id ?? obj.value),
                    };
                });
                setSelectOptions((prev) => ({
                    ...prev,
                    [field.name]: options,
                }));
            } catch {
                // Options load failure is non-fatal; field will just be empty.
            }
        }
    }

    function openCreate() {
        setEditingId(null);
        setActionError("");
        setForm({});
        setModalOpen(true);

        config.fields.forEach((field) => {
            void loadSelectOptions(field);
        });
    }

    async function openEdit(row: Record<string, unknown>) {
        setEditingId(row.id as string | number);
        const values: FormValues = {};
        config.fields.forEach((field) => {
            const value = row[field.name];
            if (value instanceof Date) {
                values[field.name] = value.toISOString().split("T")[0];
            } else {
                values[field.name] =
                    value === null || value === undefined
                        ? ""
                        : String(value);
            }
        });
        setForm(values);
        setActionError("");
        setModalOpen(true);

        config.fields.forEach((field) => {
            void loadSelectOptions(field);
        });
    }

    function extractErrorMessage(err: unknown): string {
        if (err && typeof err === "object" && "response" in err) {
            const response = (err as any).response;
            if (response && response.data) {
                if (typeof response.data === "string") return response.data;
                if (response.data.message) return String(response.data.message);
                if (response.data.title) return String(response.data.title);
                if (response.data.error) return String(response.data.error);
                if (response.data.errors) {
                    const errors = response.data.errors;
                    if (typeof errors === "object") {
                        const messages: string[] = [];
                        for (const key of Object.keys(errors)) {
                            const val = errors[key];
                            if (Array.isArray(val)) {
                                messages.push(...val.map(String));
                            } else {
                                messages.push(`${key}: ${String(val)}`);
                            }
                        }
                        return messages.join(", ");
                    }
                    return String(errors);
                }
                return JSON.stringify(response.data);
            }
        }
        if (err instanceof Error) return err.message;
        if (typeof err === "string") return err;
        return "Unable to save record.";
    }

    function parseDateToISO(value: string): string {
        const parts = value.split("/");
        if (parts.length === 3) {
            const [d, m, y] = parts.map(Number);
            if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                return `${y}-${m.toString().padStart(2, "0")}-${d
                    .toString()
                    .padStart(2, "0")}`;
            }
        }
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split("T")[0];
        }
        return value;
    }

    async function saveRecord(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setActionError("");

        try {
            const payload: Record<string, unknown> = {};

            for (const field of config.fields) {
                let value = form[field.name] ?? "";

                if (field.type === "date" && value !== "") {
                    value = parseDateToISO(value);
                }

                if (field.name === "role") {
                    payload[field.name] = value === "" ? null : value;
                } else if (field.type === "number") {
                    payload[field.name] = value === "" ? null : Number(value);
                } else {
                    payload[field.name] = value;
                }
            }

            if (editingId !== null) {
                await api.put(
                    `${config.endpoint}/${encodeURIComponent(
                        String(editingId)
                    )}`,
                    payload
                );
            } else {
                await api.post(config.endpoint, payload);
            }

            setModalOpen(false);
            await refetch();
        } catch (err) {
            setActionError(extractErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    async function deleteRecord(id: string | number) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this record?"
        );
        if (!confirmed) return;
        try {
            await api.delete(`${config.endpoint}/${encodeURIComponent(String(id))}`);
            await refetch();
        } catch (err) {
            window.alert(extractErrorMessage(err));
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        {config.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                        {config.description}
                    </p>
                </div>
                {config.allowCreate !== false && (
                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-[#071727] transition hover:bg-cyan-300"
                    >
                        <Plus size={17} /> Add New
                    </button>
                )}
            </div>
            <DataTable
                columns={config.columns}
                data={data}
                isLoading={isLoading}
                error={error}
                searchableFields={config.searchableFields}
                onRefresh={refetch}
                actions={(row) => (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => openEdit(row)}
                            aria-label="Edit record"
                            className="rounded-lg border border-cyan-400/20 p-2 text-cyan-300 hover:bg-cyan-400/10"
                        >
                            <Pencil size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() => void deleteRecord(row.id as string | number)}
                            aria-label="Delete record"
                            className="rounded-lg border border-red-400/20 p-2 text-red-300 hover:bg-red-400/10"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                )}
            />
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4">
                    <div className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#102740] p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    {editingId !== null ? "Edit Record" : "Create Record"}
                                </h3>
                                <p className="mt-1 text-xs text-slate-400">
                                    {config.title}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={saveRecord} className="space-y-4">
                            {config.fields.map((field) => (
                                <div key={field.name}>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        {field.label}
                                        {field.required && (
                                            <span className="ml-1 text-red-300">*</span>
                                        )}
                                    </label>
                                    {field.type === "textarea" ? (
                                        <textarea
                                            required={field.required}
                                            value={form[field.name] ?? ""}
                                            onChange={(event) =>
                                                setForm((previous) => ({
                                                    ...previous,
                                                    [field.name]: event.target.value,
                                                }))
                                            }
                                            rows={3}
                                            className="w-full rounded-xl border border-white/10 bg-[#091a2c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
                                        />
                                    ) : field.type === "select" ? (
                                        <select
                                            required={field.required}
                                            value={form[field.name] ?? ""}
                                            onChange={(event) =>
                                                setForm((previous) => ({
                                                    ...previous,
                                                    [field.name]: event.target.value,
                                                }))
                                            }
                                            className="w-full rounded-xl border border-white/10 bg-[#091a2c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
                                        >
                                            <option value="">Select {field.label}</option>
                                            {(field.options ??
                                                selectOptions[field.name] ??
                                                []).map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type ?? "text"}
                                            required={field.required}
                                            value={form[field.name] ?? ""}
                                            onChange={(event) =>
                                                setForm((previous) => ({
                                                    ...previous,
                                                    [field.name]: event.target.value,
                                                }))
                                            }
                                            className="w-full rounded-xl border border-white/10 bg-[#091a2c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
                                        />
                                    )}
                                </div>
                            ))}
                            {actionError && (
                                <p className="rounded-lg bg-red-400/10 p-3 text-sm text-red-300">
                                    {actionError}
                                </p>
                            )}
                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#071727] hover:bg-cyan-300 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : editingId !== null ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}