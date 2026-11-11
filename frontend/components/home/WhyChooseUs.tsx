
import Container from "@/components/common/Container";
import {
    ShieldCheck,
    Users,
    Lightbulb,
    Target,
} from "lucide-react";

const reasons = [
    {
        icon: ShieldCheck,
        title: "Safe Learning Environment",
        description:
            "A respectful and supportive environment where students can focus on learning.",
    },
    {
        icon: Users,
        title: "Dedicated Educators",
        description:
            "Teachers who guide students through academic and personal development.",
    },
    {
        icon: Lightbulb,
        title: "Creative Thinking",
        description:
            "Encouraging students to ask questions, explore ideas and solve problems.",
    },
    {
        icon: Target,
        title: "Future Ready",
        description:
            "Developing skills, confidence and values that support lifelong learning.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="section-padding bg-[#091a2d]">
            <Container>
                <div className="grid items-center gap-14 lg:grid-cols-2">
                    <div>
                        <span className="section-eyebrow">
                            WHY CHOOSE US
                        </span>

                        <h2 className="mt-5 text-4xl font-extrabold leading-tight text-[#e7edf5] md:text-5xl">
                            More Than a
                            <span className="text-gradient">
                                {" "}School
                            </span>
                            <br />
                            A Place to Grow
                        </h2>

                        <p className="mt-6 text-base leading-8 text-[#a7b7c9]">
                            Every child has unique potential. Our goal
                            is to create opportunities for students to
                            explore their interests, strengthen their
                            abilities and become responsible members
                            of society.
                        </p>

                        <div className="mt-8 grid gap-5 sm:grid-cols-2">
                            {reasons.map((reason) => {
                                const Icon = reason.icon;

                                return (
                                    <div
                                        key={reason.title}
                                        className="flex gap-4"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5b85c]/10 text-[#e5b85c]">
                                            <Icon size={22} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-[#e7edf5]">
                                                {reason.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-[#8fa5ba]">
                                                {reason.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div
                        className="min-h-[480px] rounded-[26px] border border-white/10 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "linear-gradient(0deg,rgba(5,20,35,.25),rgba(5,20,35,.05)),url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1100&q=85')",
                        }}
                    />
                </div>
            </Container>
        </section>
    );
}
