
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import {
    BookOpen,
    FlaskConical,
    Monitor,
    HeartHandshake,
    Palette,
    Trophy,
} from "lucide-react";

const features = [
    {
        icon: BookOpen,
        title: "Strong Academics",
        description:
            "A structured academic environment that builds strong foundations and encourages independent thinking.",
    },
    {
        icon: FlaskConical,
        title: "Practical Learning",
        description:
            "Learning opportunities that connect classroom knowledge with practical understanding.",
    },
    {
        icon: Monitor,
        title: "Digital Education",
        description:
            "Technology-supported learning experiences to prepare students for a changing world.",
    },
    {
        icon: HeartHandshake,
        title: "Student Support",
        description:
            "Guidance and encouragement that help students develop confidence and responsibility.",
    },
    {
        icon: Palette,
        title: "Creative Activities",
        description:
            "Opportunities to explore art, culture, creativity and personal interests.",
    },
    {
        icon: Trophy,
        title: "Beyond Academics",
        description:
            "Sports, teamwork and co-curricular activities that support balanced development.",
    },
];

export default function FeaturesSection() {
    return (
        <section className="section-padding bg-[#0e2339]">
            <Container>
                <SectionHeading
                    eyebrow="WHAT WE OFFER"
                    title="An Environment Where Students Thrive"
                    description="We focus on academic excellence, personal growth and meaningful learning experiences."
                />

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="surface-card group p-7 transition duration-300 hover:-translate-y-2 hover:border-[#13a89e]/50"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#13a89e]/10 text-[#28c0b1] transition group-hover:bg-[#13a89e] group-hover:text-[#06212d]">
                                    <Icon size={27} />
                                </div>

                                <p className="mt-6 text-xs font-bold tracking-widest text-[#e5b85c]">
                                    0{index + 1}
                                </p>

                                <h3 className="mt-2 text-xl font-bold text-[#e7edf5]">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-[#9fb2c5]">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
