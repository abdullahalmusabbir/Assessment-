"use client";

import Link from "next/link";
import { useApiData } from "@/hooks/useApiData";
import { dashboardEndpoints } from "@/lib/dashboard-api";
import Container from "@/components/common/Container";
import PageHeader from "@/components/common/PageHeader";
import {
    CalendarDays,
    Clock,
    GraduationCap,
    ArrowRight,
    FileText,
    RefreshCw,
} from "lucide-react";

interface Circular {
    id: string;
    title: string;
    description?: string;
    academicYear?: { name?: string };
    applicationStartDate: string;
    applicationEndDate: string;
    paymentDeadline?: string;
    isPublished: boolean;
    isActive: boolean;
    attachmentUrl?: string;
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function AdmissionPage() {
    const { data: circulars, isLoading, error, refetch: fetchCirculars } =
        useApiData<Circular>(dashboardEndpoints.publicAdmissionCirculars, true);

    const publishedCirculars = circulars.filter(
        (item: Circular) => item.isPublished && item.isActive
    );

    return (
        <main>
            <PageHeader
                eyebrow="ADMISSIONS"
                title="Start Your Learning Journey With Us"
                description="Explore current admission opportunities, review the circular details and submit your application online."
            />

            <section className="section-padding bg-[#0a1b2e]">
                <Container>
                    <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <span className="section-eyebrow">
                                CURRENT OPPORTUNITIES
                            </span>

                            <h2 className="mt-3 text-3xl font-extrabold text-[#e7edf5]">
                                Admission Circulars
                            </h2>

                            <p className="mt-3 text-sm text-[#91a6ba]">
                                Find the admission circular that matches
                                your academic year and class.
                            </p>
                        </div>

                        <button
                            onClick={() => fetchCirculars()}
                            className="inline-flex items-center gap-2 self-start rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#c7d5e2] transition hover:border-[#13a89e]/50 hover:text-[#13a89e] md:self-auto"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>

                    {isLoading && (
                        <div className="rounded-2xl border border-white/10 bg-[#10243b] py-20 text-center">
                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#13a89e]/20 border-t-[#13a89e]" />

                            <p className="mt-5 text-sm text-[#a7b7c9]">
                                Loading admission circulars...
                            </p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
                            <p className="font-semibold text-red-300">
                                Unable to load admission circulars.
                            </p>

                            <p className="mt-2 text-sm text-[#a7b7c9]">
                                {error}
                            </p>

                            <button
                                onClick={() => fetchCirculars()}
                                className="primary-button mt-5"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!isLoading &&
                        !error &&
                        publishedCirculars.length === 0 && (
                            <div className="surface-card px-6 py-20 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#13a89e]/10 text-[#13a89e]">
                                    <GraduationCap size={32} />
                                </div>

                                <h3 className="mt-6 text-2xl font-bold text-[#e7edf5]">
                                    No Active Circulars
                                </h3>

                                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#9fb2c5]">
                                    There are currently no published admission
                                    circulars. Please check again later.
                                </p>
                            </div>
                        )}

                    {!isLoading && publishedCirculars.length > 0 && (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {publishedCirculars.map((circular: Circular) => (
                                <article
                                    key={circular.id}
                                    className="surface-card overflow-hidden transition hover:-translate-y-1 hover:border-[#13a89e]/40"
                                >
                                    <div className="border-b border-white/10 bg-gradient-to-r from-[#153b53] to-[#123247] p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e5b85c]/10 text-[#e5b85c]">
                                                <FileText size={25} />
                                            </div>

                                            <span className="rounded-full border border-[#13a89e]/30 bg-[#13a89e]/10 px-3 py-1.5 text-xs font-bold text-[#6ed8cb]">
                                                Published
                                            </span>
                                        </div>

                                        <h3 className="mt-6 text-2xl font-extrabold text-[#e7edf5]">
                                            {circular.title}
                                        </h3>

                                        <p className="mt-2 text-sm text-[#a7b7c9]">
                                            Academic Year:{" "}
                                            {circular.academicYear?.name ??
                                                "See circular details"}
                                        </p>
                                    </div>

                                    <div className="p-6">
                                        <p className="line-clamp-3 text-sm leading-7 text-[#9fb2c5]">
                                            {circular.description}
                                        </p>

                                        <div className="mt-6 space-y-4">
                                            <div className="flex items-start gap-3">
                                                <CalendarDays
                                                    size={18}
                                                    className="mt-0.5 shrink-0 text-[#e5b85c]"
                                                />

                                                <div>
                                                    <p className="text-xs text-[#8197ac]">
                                                        Application Starts
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-[#dce6ef]">
                                                        {formatDate(
                                                            circular.applicationStartDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Clock
                                                    size={18}
                                                    className="mt-0.5 shrink-0 text-[#13a89e]"
                                                />

                                                <div>
                                                    <p className="text-xs text-[#8197ac]">
                                                        Application Deadline
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-[#dce6ef]">
                                                        {formatDate(
                                                            circular.applicationEndDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <CalendarDays
                                                    size={18}
                                                    className="mt-0.5 shrink-0 text-[#e5b85c]"
                                                />

                                                <div>
                                                    <p className="text-xs text-[#8197ac]">
                                                        Payment Deadline
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-[#dce6ef]">
                                                        {circular.paymentDeadline
                                                            ? formatDate(
                                                                  circular.paymentDeadline
                                                                )
                                                            : "Not set"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
                                            <Link
                                                href={`/admission/${circular.id}/apply`}
                                                className="primary-button flex-1"
                                            >
                                                Apply Now
                                                <ArrowRight size={17} />
                                            </Link>

                                            {circular.attachmentUrl && (
                                                <a
                                                    href={circular.attachmentUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="outline-button"
                                                >
                                                    View Circular
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </Container>
            </section>
        </main>
    );
}