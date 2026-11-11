import Link from "next/link";
import { GraduationCap } from "lucide-react";
import CurrentYear from "@/components/layout/CurrentYear";

export default function AuthLayout({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#081a2d] px-4 py-28">
            <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#13a89e]/10 blur-3xl" />

            <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#e5b85c]/10 blur-3xl" />

            <div className="relative w-full max-w-[480px]">
                <Link
                    href="/"
                    className="mb-8 flex items-center justify-center gap-3"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5b85c]/10 text-[#e5b85c]">
                        <GraduationCap size={27} />
                    </div>

                    <span className="text-2xl font-extrabold tracking-tight text-[#e7edf5]">
                        Edu<span className="text-[#13a89e]">Bridge</span>
                    </span>
                </Link>

                <div className="rounded-2xl border border-white/10 bg-[#10243b]/95 p-7 shadow-2xl shadow-black/20 md:p-9">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-extrabold text-[#e7edf5]">
                            {title}
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-[#9fb2c5]">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>

                <p className="mt-7 text-center text-xs text-[#70879e]">
                    © <CurrentYear /> EduBridge. All rights reserved.
                </p>
            </div>
        </main>
    );
}