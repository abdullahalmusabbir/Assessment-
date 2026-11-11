
import Container from "@/components/common/Container";
import PageHeader from "@/components/common/PageHeader";
import SectionHeading from "@/components/common/SectionHeading";
import {
    Eye,
    Target,
    Heart,
    BookOpen,
    Users,
    Lightbulb,
    ShieldCheck,
    GraduationCap,
} from "lucide-react";

const values = [
    {
        icon: Heart,
        title: "Respect",
        description:
            "We believe every student, teacher and family member deserves dignity, kindness and respect.",
    },
    {
        icon: ShieldCheck,
        title: "Integrity",
        description:
            "We encourage honesty, responsibility and ethical behavior in every aspect of school life.",
    },
    {
        icon: Lightbulb,
        title: "Curiosity",
        description:
            "We inspire students to ask questions, explore ideas and develop a lifelong love of learning.",
    },
    {
        icon: Users,
        title: "Community",
        description:
            "We value cooperation among students, teachers, families and the wider community.",
    },
];

export default function OurStoryPage() {
    return (
        <main>
            <PageHeader
                eyebrow="OUR STORY"
                title="A Journey Built on Learning, Values and Possibility"
                description="Discover the principles, purpose and educational vision that shape our school community."
            />

            {/* INTRODUCTION */}
            <section className="section-padding bg-[#0a1b2e]">
                <Container>
                    <div className="grid items-center gap-14 lg:grid-cols-2">
                        <div>
                            <span className="section-eyebrow">
                                WHO WE ARE
                            </span>

                            <h2 className="mt-5 text-4xl font-extrabold leading-tight text-[#e7edf5] md:text-5xl">
                                Education with a
                                <span className="text-gradient">
                                    {" "}Purpose
                                </span>
                            </h2>

                            <p className="mt-6 text-base leading-8 text-[#a7b7c9]">
                                Our school is built around a simple belief:
                                every student deserves the opportunity to
                                learn, grow and discover their potential.
                                We aim to provide an educational environment
                                where academic development goes hand in
                                hand with character, creativity and confidence.
                            </p>

                            <p className="mt-5 text-base leading-8 text-[#a7b7c9]">
                                We understand that every learner is different.
                                That is why we value encouragement, individual
                                attention, meaningful classroom experiences
                                and cooperation between school and family.
                            </p>

                            <p className="mt-5 text-base leading-8 text-[#a7b7c9]">
                                Our commitment is to help students develop
                                the knowledge, skills and values they need
                                to contribute positively to society.
                            </p>
                        </div>

                        <div
                            className="min-h-[440px] rounded-[25px] border border-white/10 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "linear-gradient(0deg,rgba(5,20,35,.2),rgba(5,20,35,.05)),url('https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1100&q=85')",
                            }}
                        />
                    </div>
                </Container>
            </section>

            {/* VISION AND MISSION */}
            <section className="section-padding bg-[#10243b]">
                <Container>
                    <SectionHeading
                        eyebrow="OUR DIRECTION"
                        title="Vision and Mission"
                        description="Our vision gives us direction. Our mission guides the work we do every day."
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="surface-card p-8 md:p-10">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5b85c]/10 text-[#e5b85c]">
                                <Eye size={29} />
                            </div>

                            <h3 className="mt-7 text-2xl font-extrabold text-[#e7edf5]">
                                Our Vision
                            </h3>

                            <p className="mt-4 text-base leading-8 text-[#a7b7c9]">
                                To create a learning community where every
                                student is encouraged to reach their potential,
                                become a thoughtful individual and contribute
                                to a better and more responsible society.
                            </p>
                        </div>

                        <div className="surface-card p-8 md:p-10">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#13a89e]/10 text-[#22b9ac]">
                                <Target size={29} />
                            </div>

                            <h3 className="mt-7 text-2xl font-extrabold text-[#e7edf5]">
                                Our Mission
                            </h3>

                            <p className="mt-4 text-base leading-8 text-[#a7b7c9]">
                                To provide a supportive, engaging and
                                disciplined educational environment that
                                promotes knowledge, creativity, confidence,
                                good character and lifelong learning.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* EDUCATIONAL PHILOSOPHY */}
            <section className="section-padding bg-[#091a2d]">
                <Container>
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div
                            className="min-h-[420px] rounded-[25px] border border-white/10 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1100&q=85')",
                            }}
                        />

                        <div>
                            <span className="section-eyebrow">
                                HOW WE TEACH
                            </span>

                            <h2 className="mt-5 text-4xl font-extrabold leading-tight text-[#e7edf5]">
                                Learning Beyond
                                <span className="text-gradient">
                                    {" "}Books
                                </span>
                            </h2>

                            <p className="mt-6 text-base leading-8 text-[#a7b7c9]">
                                We believe meaningful education develops
                                both knowledge and the ability to use that
                                knowledge. Students should have opportunities
                                to think, question, create, collaborate and
                                learn from experience.
                            </p>

                            <div className="mt-7 space-y-5">
                                <div className="flex gap-4">
                                    <BookOpen className="mt-1 shrink-0 text-[#e5b85c]" />
                                    <div>
                                        <h3 className="font-bold text-[#e7edf5]">
                                            Understanding First
                                        </h3>
                                        <p className="mt-1 text-sm leading-7 text-[#91a6ba]">
                                            Encouraging understanding and application
                                            rather than memorization alone.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Users className="mt-1 shrink-0 text-[#13a89e]" />
                                    <div>
                                        <h3 className="font-bold text-[#e7edf5]">
                                            Learning Together
                                        </h3>
                                        <p className="mt-1 text-sm leading-7 text-[#91a6ba]">
                                            Building communication, teamwork and
                                            mutual respect.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <GraduationCap className="mt-1 shrink-0 text-[#e5b85c]" />
                                    <div>
                                        <h3 className="font-bold text-[#e7edf5]">
                                            Growing Every Day
                                        </h3>
                                        <p className="mt-1 text-sm leading-7 text-[#91a6ba]">
                                            Supporting continuous development and
                                            lifelong learning.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* CORE VALUES */}
            <section className="section-padding bg-[#10243b]">
                <Container>
                    <SectionHeading
                        eyebrow="WHAT WE BELIEVE"
                        title="Our Core Values"
                        description="The values that guide our decisions, relationships and everyday learning experiences."
                    />

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="surface-card p-7 transition hover:-translate-y-2"
                                >
                                    <Icon className="text-[#e5b85c]" size={32} />

                                    <h3 className="mt-6 text-xl font-bold text-[#e7edf5]">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-[#9fb2c5]">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </Container>
            </section>

            {/* FUTURE */}
            <section className="section-padding bg-[#091a2d]">
                <Container>
                    <div className="rounded-[25px] border border-[#13a89e]/20 bg-gradient-to-br from-[#123a50] to-[#0e5b5c] p-8 md:p-14">
                        <span className="section-eyebrow">
                            LOOKING AHEAD
                        </span>

                        <h2 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-[#f0f4f7] md:text-5xl">
                            Building Opportunities for the Next Generation
                        </h2>

                        <p className="mt-6 max-w-3xl text-base leading-8 text-[#c4d9df]">
                            Education continues to evolve. We aim to
                            keep improving our learning environment,
                            strengthen our academic approach and create
                            opportunities that prepare students for
                            the future.
                        </p>
                    </div>
                </Container>
            </section>
        </main>
    );
}
