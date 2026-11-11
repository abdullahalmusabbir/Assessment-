
import Link from "next/link";
import {
    ArrowRight,
    PlayCircle,
    BookOpen,
    GraduationCap,
    Award,
} from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[720px] items-center overflow-hidden bg-[#0b2036] pt-24">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(19,168,158,0.19),transparent_35%),radial-gradient(circle_at_15%_85%,rgba(229,184,92,0.13),transparent_30%)]" />

            <div className="site-container relative grid items-center gap-14 py-20 lg:grid-cols-2">
                {/* LEFT CONTENT */}
                <div>
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e5b85c]/30 bg-[#e5b85c]/10 px-4 py-2 text-xs font-bold tracking-wide text-[#e5c77e]">
                        <Award size={15} />
                        LEARNING TODAY, LEADING TOMORROW
                    </div>

                    <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.12] tracking-tight text-[#e7edf5] md:text-6xl xl:text-7xl">
                        Discover Your
                        <span className="text-gradient"> Potential.</span>
                        <br />
                        Shape Your
                        <span className="text-gradient"> Future.</span>
                    </h1>

                    <p className="mt-7 max-w-xl text-base leading-8 text-[#a7b7c9] md:text-lg">
                        A place where curiosity grows, talents are
                        discovered, and every student gets the
                        opportunity to build a brighter future.
                        Begin your educational journey with us.
                    </p>

                    <div className="mt-9 flex flex-wrap gap-4">
                        <Link
                            href="/admission"
                            className="primary-button"
                        >
                            Explore Admission
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            href="/our-story"
                            className="outline-button"
                        >
                            <PlayCircle size={18} />
                            Discover Our Story
                        </Link>
                    </div>

                    <div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-7">
                        <div>
                            <p className="text-2xl font-extrabold text-[#e5b85c]">
                                Quality
                            </p>
                            <p className="mt-1 text-xs text-[#8da7bd]">
                                Education
                            </p>
                        </div>

                        <div>
                            <p className="text-2xl font-extrabold text-[#e5b85c]">
                                Modern
                            </p>
                            <p className="mt-1 text-xs text-[#8da7bd]">
                                Learning
                            </p>
                        </div>

                        <div>
                            <p className="text-2xl font-extrabold text-[#e5b85c]">
                                Bright
                            </p>
                            <p className="mt-1 text-xs text-[#8da7bd]">
                                Future
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT VISUAL */}
                <div className="relative mx-auto w-full max-w-[520px]">
                    <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full bg-[#13a89e]/20 blur-3xl" />

                    <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-br from-[#1c4961] to-[#10253d] p-3 shadow-2xl shadow-black/30">
                        <div
                            className="relative flex min-h-[470px] items-end overflow-hidden rounded-[20px] bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "linear-gradient(0deg,rgba(5,20,35,.95),rgba(5,20,35,.05) 75%),url('https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85')",
                            }}
                        >
                            <div className="p-8">
                                <span className="rounded-full bg-[#13a89e]/20 px-3 py-2 text-xs font-bold text-[#72ddd0]">
                                    OUR LEARNING COMMUNITY
                                </span>

                                <h2 className="mt-5 text-3xl font-extrabold text-[#f0f3f7]">
                                    Every Student
                                    <br />
                                    Matters.
                                </h2>

                                <p className="mt-3 max-w-sm text-sm leading-7 text-[#c0cede]">
                                    Empowering young minds with knowledge,
                                    confidence and values for life.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -left-8 top-14 hidden rounded-2xl border border-white/10 bg-[#132e48] p-4 shadow-xl md:block">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5b85c]/15 text-[#e5b85c]">
                                <GraduationCap size={24} />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-[#e7edf5]">
                                    Student First
                                </p>
                                <p className="text-xs text-[#91a6ba]">
                                    Learning approach
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-7 -right-5 hidden rounded-2xl border border-white/10 bg-[#132e48] p-4 shadow-xl md:block">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#13a89e]/15 text-[#13a89e]">
                                <BookOpen size={23} />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-[#e7edf5]">
                                    Learn & Grow
                                </p>
                                <p className="text-xs text-[#91a6ba]">
                                    Every single day
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
