
interface StatusBadgeProps {
    status: string | boolean | null | undefined;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const value =
        typeof status === "boolean"
            ? status
                ? "Active"
                : "Inactive"
            : String(status ?? "Unknown");

    const normalized = value.toLowerCase();

    let className = "border-slate-500/20 bg-slate-500/10 text-slate-300";

    if (
        ["active", "paid", "selected", "published", "confirmed", "approved"].includes(
            normalized
        )
    ) {
        className = "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    } else if (
        ["pending", "held", "processing", "waiting"].includes(normalized)
    ) {
        className = "border-amber-400/20 bg-amber-400/10 text-amber-300";
    } else if (
        ["rejected", "failed", "cancelled", "inactive", "unpaid"].includes(
            normalized
        )
    ) {
        className = "border-red-400/20 bg-red-400/10 text-red-300";
    }

    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${className}`}
        >
            {value}
        </span>
    );
}
