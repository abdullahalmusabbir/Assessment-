
import Container from "@/components/common/Container";
import {
    Users,
    GraduationCap,
    BookOpen,
    Trophy,
} from "lucide-react";

const stats = [
    {
        icon: Users,
        value: "1,200+",
        label: "Happy Students",
    },
    {
        icon: GraduationCap,
        value: "80+",
        label: "Dedicated Teachers",
    },
    {
        icon: BookOpen,
        value: "25+",
        label: "Learning Programs",
    },
    {
        icon: Trophy,
        value: "15+",
        label: "Years of Excellence",
    },
];

export default function StatsSection() {
    return (
        <section className="relative z-10 -mt-1 border-y border-white/10 bg-[#102a43]">
            <Container>
                <div className="grid grid-cols-2 divide-x divide-y divide-white/10 md:grid-cols-4 md:divide-y-0">
                    {stats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className="flex flex-col items-center px-3 py-9 text-center"
                            >
                                <Icon className="mb-4 text-[#e5b85c]" size={27} />

                                <h3 className="text-3xl font-extrabold text-[#e7edf5]">
                                    {item.value}
                                </h3>

                                <p className="mt-2 text-sm text-[#9eb1c4]">
                                    {item.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
