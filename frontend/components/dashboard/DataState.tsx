
import { AlertCircle, Inbox } from "lucide-react";

interface DataStateProps {
    loading?: boolean;
    error?: string;
    empty?: boolean;
    onRetry?: () => void;
}

export default function DataState({
    loading,
    error,
    empty,
    onRetry,
}: DataStateProps) {
    if (loading) {
        return (
            <div className="rounded-xl border border-white/10 bg-[#091a2c] p-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />
                <p className="mt-4 text-sm text-slate-400">Loading data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-7 text-center">
                <AlertCircle className="mx-auto text-red-300" size={28} />
                <p className="mt-3 text-sm text-red-200">{error}</p>
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-4 rounded-lg bg-red-400/10 px-4 py-2 text-sm text-red-200 hover:bg-red-400/20"
                    >
                        Try Again
                    </button>
                )}
            </div>
        );
    }

    if (empty) {
        return (
            <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
                <Inbox className="mx-auto text-slate-500" size={30} />
                <p className="mt-3 text-sm text-slate-400">No data available.</p>
            </div>
        );
    }

    return null;
}
