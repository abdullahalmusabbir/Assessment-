
import Link from "next/link";
import Container from "@/components/common/Container";
import { ArrowRight, GraduationCap } from "lucide-react";

export default function CTASection() {
    return (
        <section className="bg-[#0a1c30] pb-24">
            <Container>
                <div className="relative overflow-hidden rounded-[28px] border border-[#e5b85c]/20 bg-gradient-to-br from-[#17435a] via-[#126276] to-[#0e756e] px-7 py-16 text-center md:px-16">
                    <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#e5b85c]/10 blur-3xl" />
                    <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#13a89e]/20 blur-3xl" />

                    <div className="relative">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-[#f1d48d]">
                            <GraduationCap size={34} />
                        </div>

                        <h2 className="mx-auto mt-7 max-w-3xl text-3xl font-extrabold leading-tight text-[#f1f5f8] md:text-5xl">
                            Your Child's Journey to a Brighter Future
                            Starts Here
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#d1e2e7]">
                            Explore our admission circulars and take
                            the first step toward a meaningful
                            educational journey.
                        </p>

                        <Link
                            href="/admission"
                            className="mt-8 inline-flex min-h-[52px] items-center gap-3 rounded-lg bg-[#e5b85c] px-7 font-extrabold text-[#10243b] transition hover:-translate-y-1 hover:bg-[#f0ca79]"
                        >
                            Apply for Admission
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
