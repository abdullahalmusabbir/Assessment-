
import Link from "next/link";
import {
    GraduationCap,
    MapPin,
    Phone,
    Mail,
    ArrowRight,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import CurrentYear from "@/components/layout/CurrentYear";

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "/our-story" },
    { label: "Admission", href: "/admission" },
    { label: "Contact", href: "/contact" },
];

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#061321]">
            <div className="site-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
                {/* BRAND */}
                <div>
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a91a0] to-[#0e5b79] text-[#f4d78f]">
                            <GraduationCap size={26} />
                        </div>

                        <div>
                            <h2 className="text-xl font-extrabold text-[#e7edf5]">
                                Edu<span className="text-[#e5b85c]">Bridge</span>
                            </h2>
                            <p className="text-[9px] tracking-[2px] text-[#8da7bd]">
                                SCHOOL ADMISSION
                            </p>
                        </div>
                    </Link>

                    <p className="mt-5 text-sm leading-7 text-[#91a6ba]">
                        Building a brighter future through quality
                        education, strong values and a commitment
                        to lifelong learning.
                    </p>

                    <div className="mt-6 flex gap-3">
                        {[FaFacebook, FaInstagram, FaYoutube].map(
                            (Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    aria-label={`Social media ${index + 1}`}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#b6c8d8] transition hover:border-[#13a89e] hover:text-[#13a89e]"
                                >
                                    <Icon size={18} />
                                </a>
                            )
                        )}
                    </div>
                </div>

                {/* QUICK LINKS */}
                <div>
                    <h3 className="mb-6 text-lg font-bold text-[#e5b85c]">
                        Quick Links
                    </h3>

                    <div className="flex flex-col gap-4">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 text-sm text-[#a7b7c9] transition hover:translate-x-1 hover:text-[#13a89e]"
                            >
                                <ArrowRight size={14} />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* INFORMATION */}
                <div>
                    <h3 className="mb-6 text-lg font-bold text-[#e5b85c]">
                        Information
                    </h3>

                    <div className="flex flex-col gap-4 text-sm text-[#a7b7c9]">
                        <p>Admission Guidelines</p>
                        <p>Academic Programs</p>
                        <p>Student Life</p>
                        <p>Frequently Asked Questions</p>
                    </div>
                </div>

                {/* CONTACT */}
                <div>
                    <h3 className="mb-6 text-lg font-bold text-[#e5b85c]">
                        Contact Us
                    </h3>

                    <div className="flex flex-col gap-5 text-sm text-[#a7b7c9]">
                        <p className="flex items-start gap-3">
                            <MapPin className="mt-1 shrink-0 text-[#13a89e]" size={18} />
                            School Campus, Dhaka, Bangladesh
                        </p>

                        <p className="flex items-center gap-3">
                            <Phone className="shrink-0 text-[#13a89e]" size={18} />
                            +880 1XXX-XXXXXX
                        </p>

                        <p className="flex items-center gap-3">
                            <Mail className="shrink-0 text-[#13a89e]" size={18} />
                            info@edubridge.edu.bd
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="site-container flex flex-col justify-between gap-3 py-6 text-xs text-[#8196aa] md:flex-row">
                    <p>
                        © <CurrentYear /> EduBridge School.
                        All rights reserved.
                    </p>

                    <p>Designed for a better learning future.</p>
                </div>
            </div>
        </footer>
    );
}
