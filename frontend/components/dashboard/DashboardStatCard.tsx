
import type { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
}

export default function DashboardStatCard({
    title,
    value,
    description,
    icon: Icon,
}: DashboardStatCardProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#102740] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-400">{title}</p>
                    <h3 className="mt-3 text-3xl font-bold text-white">{value}</h3>
                </div>

                <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                    <Icon size={23} />
                </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">{description}</p>
        </div>
    );
}
