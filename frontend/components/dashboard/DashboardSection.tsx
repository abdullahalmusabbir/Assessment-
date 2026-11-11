
interface DashboardSectionProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

export default function DashboardSection({
    title,
    description,
    children,
}: DashboardSectionProps) {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold tracking-[2px] text-cyan-300">
                    EDUBRIDGE / DASHBOARD
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                    {title}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    {description}
                </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#102740] p-5 sm:p-7">
                {children ?? (
                    <div className="rounded-xl border border-dashed border-white/10 px-5 py-12 text-center">
                        <p className="font-medium text-slate-300">
                            {title} module
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            This feature page is ready for its API integration.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
