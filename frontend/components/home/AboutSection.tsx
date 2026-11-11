
import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    BookOpen,
} from "lucide-react";

export default function AboutSection() {
    const points = [
        "Student-centered learning environment",
        "Experienced and dedicated educators",
        "Academic and personal development",
        "Focus on discipline and moral values",
    ];

    return (
        <section className="section-padding bg-[#0a1b2e]">
            <div className="site-container grid items-center gap-14 lg:grid-cols-2">
                {/* IMAGE */}
                <div className="relative">
                    <div
                        className="min-h-[420px] rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
                        style={{
                            backgroundImage:
                                "linear-gradient(0deg,rgba(5,20,35,.25),rgba(5,20,35,.05)),url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1100&q=85')",
                        }}
                    />

                    <div className="absolute -bottom-6 -right-4 rounded-2xl border border-white/10 bg-[#17334f] p-6 shadow-xl md:right-6">
                        <BookOpen className="mb-3 text-[#e5b85c]" size={30} />
                        <p className="text-2xl font-extrabold text-[#e7edf5]">
                            Learn
                        </p>
                        <p className="text-sm text-[#a7b7c9]">
                            Grow & Succeed
                        </p>
                    </div>
                </div>

                {/* CONTENT */}
                <div>
                    <span className="section-eyebrow">
                        ABOUT OUR SCHOOL
                    </span>

                    <h2 className="mt-5 text-4xl font-extrabold leading-tight text-[#e7edf5] md:text-5xl">
                        Education That
                        <span className="text-gradient">
                            {" "}Inspires
                        </span>
                        <br />
                        Excellence
                    </h2>

                    <p className="mt-6 text-base leading-8 text-[#a7b7c9]">
                        We believe education is more than textbooks
                        and examinations. It is about helping students
                        discover their strengths, develop their
                        character and prepare for the opportunities
                        and challenges of tomorrow.
                    </p>

                    <p className="mt-4 text-base leading-8 text-[#a7b7c9]">
                        Our learning environment encourages curiosity,
                        creativity, responsibility and respect. We work
                        together with families to support every
                        student's educational journey.
                    </p>

                    <div className="mt-7 grid gap-4 sm:grid-cols-2">
                        {points.map((point) => (
                            <div
                                key={point}
                                className="flex items-start gap-3 text-sm text-[#d2dce7]"
                            >
                                <CheckCircle2
                                    size={19}
                                    className="mt-0.5 shrink-0 text-[#13a89e]"
                                />
                                {point}
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/our-story"
                        className="primary-button mt-9"
                    >
                        Read Our Story
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
