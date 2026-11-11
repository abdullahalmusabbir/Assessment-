
"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import Container from "@/components/common/Container";
import PageHeader from "@/components/common/PageHeader";

import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { api } from "@/lib/api";

import {
    CalendarDays,
    GraduationCap,
    Clock,
    CreditCard,
    ShieldCheck,
    AlertCircle,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

export default function ApplyAdmissionPage() {
    const params = useParams<{ circularId: string }>();
    const router = useRouter();

    const circularId = params.circularId;

    const { user, isAuthenticated, isLoading: authLoading } =
        useAuth();

    const {
        circulars,
        classes,
        isLoading: dataLoading,
    } = useData();

    const [selectedShiftId, setSelectedShiftId] = useState("");
    const [agreed, setAgreed] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const circular = circulars.find(
        (item) => item.id === circularId
    );

    const availableShifts = useMemo(() => {
        return classes.flatMap((schoolClass) =>
            (schoolClass.shifts ?? [])
                .filter((shift) => shift.isActive)
                .map((shift) => ({
                    ...shift,
                    className: schoolClass.name,
                }))
        );
    }, [classes]);

    const selectedShift = availableShifts.find(
        (shift) => shift.id === selectedShiftId
    );

    const handleApply = async () => {
        setError("");
        setSuccess("");

        if (!isAuthenticated) {
            router.push(`/login?returnUrl=/admission/${circularId}/apply`);
            return;
        }

        if (!selectedShiftId) {
            setError("Please select a class and shift.");
            return;
        }

        if (!agreed) {
            setError("Please accept the application terms.");
            return;
        }

        try {
            setSubmitting(true);

            /*
             * Backend endpoint assumption:
             * POST /api/student-applications/apply
             *
             * Match this route and request DTO with
             * your actual StudentApplicationsController.
             */

            const result = await api.post<{
                studentId?: string;
                registrationNumber?: string;
                admissionHoldId?: string;
                expiresAt?: string;
            }>("/api/student-applications/apply", {
                admissionCircularId: circularId,
                classShiftId: selectedShiftId,
            });

            setSuccess(
                `Application created successfully. Registration Number: ${result.registrationNumber ?? "Generated"
                }`
            );

            /*
             * After successful application, the next page
             * should show the hold and payment information.
             * Payment integration will be completed in a later part.
             */
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to submit your application."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || dataLoading) {
        return (
            <main className="min-h-screen bg-[#0a1b2e] pt-32">
                <Container>
                    <p className="text-center text-[#a7b7c9]">
                        Loading application details...
                    </p>
                </Container>
            </main>
        );
    }

    if (!circular) {
        return (
            <main className="min-h-screen bg-[#0a1b2e] pt-32">
                <Container>
                    <div className="surface-card mx-auto max-w-xl p-10 text-center">
                        <AlertCircle
                            size={40}
                            className="mx-auto text-[#e5b85c]"
                        />

                        <h1 className="mt-5 text-2xl font-bold text-[#e7edf5]">
                            Circular Not Found
                        </h1>

                        <p className="mt-3 text-sm text-[#a7b7c9]">
                            The admission circular may have expired,
                            been removed or is not available.
                        </p>

                        <Link href="/admission" className="primary-button mt-6">
                            Back to Admission
                        </Link>
                    </div>
                </Container>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-[#0a1b2e] pt-32">
                <Container>
                    <div className="surface-card mx-auto max-w-xl p-10 text-center">
                        <ShieldCheck
                            size={42}
                            className="mx-auto text-[#e5b85c]"
                        />

                        <h1 className="mt-5 text-2xl font-extrabold text-[#e7edf5]">
                            Login Required
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-[#a7b7c9]">
                            Please login with your student account
                            before applying for admission.
                        </p>

                        <Link
                            href={`/login?returnUrl=/admission/${circularId}/apply`}
                            className="primary-button mt-6"
                        >
                            Login to Continue
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                </Container>
            </main>
        );
    }

    if (user?.role !== 1) {
        return (
            <main className="min-h-screen bg-[#0a1b2e] pt-32">
                <Container>
                    <div className="surface-card mx-auto max-w-xl p-10 text-center">
                        <AlertCircle
                            size={42}
                            className="mx-auto text-[#e5b85c]"
                        />

                        <h1 className="mt-5 text-2xl font-bold text-[#e7edf5]">
                            Student Account Required
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-[#a7b7c9]">
                            Only student accounts can submit admission
                            applications.
                        </p>
                    </div>
                </Container>
            </main>
        );
    }

    return (
        <main>
            <PageHeader
                eyebrow="ONLINE APPLICATION"
                title="Apply for Admission"
                description="Review the circular, select your preferred class and shift, and submit your application."
            />

            <section className="section-padding bg-[#0a1b2e]">
                <Container>
                    <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
                        {/* APPLICATION FORM */}
                        <div className="surface-card p-6 md:p-9">
                            <div className="mb-8 border-b border-white/10 pb-6">
                                <span className="section-eyebrow">
                                    APPLICATION FORM
                                </span>

                                <h2 className="mt-3 text-2xl font-extrabold text-[#e7edf5]">
                                    Student Application
                                </h2>

                                <p className="mt-2 text-sm text-[#91a6ba]">
                                    Your account information will be used
                                    to identify your application.
                                </p>
                            </div>

                            {/* STUDENT INFORMATION */}
                            <div>
                                <h3 className="mb-5 flex items-center gap-2 font-bold text-[#e5b85c]">
                                    <GraduationCap size={19} />
                                    Student Account
                                </h3>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="mb-2 text-xs text-[#8197ac]">
                                            Student Name
                                        </p>
                                        <div className="rounded-lg border border-white/10 bg-[#0b1c30] px-4 py-3 text-sm text-[#e7edf5]">
                                            {user?.firstName} {user?.lastName}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs text-[#8197ac]">
                                            Email Address
                                        </p>
                                        <div className="break-all rounded-lg border border-white/10 bg-[#0b1c30] px-4 py-3 text-sm text-[#e7edf5]">
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CLASS SELECTION */}
                            <div className="mt-9 border-t border-white/10 pt-7">
                                <h3 className="mb-5 flex items-center gap-2 font-bold text-[#e5b85c]">
                                    <BookOpenIcon />
                                    Academic Selection
                                </h3>

                                <label className="form-label">
                                    Select Class and Shift *
                                </label>

                                <select
                                    value={selectedShiftId}
                                    onChange={(event) =>
                                        setSelectedShiftId(event.target.value)
                                    }
                                    className="form-control"
                                >
                                    <option value="">
                                        Choose your preferred class and shift
                                    </option>

                                    {availableShifts.map((shift) => (
                                        <option
                                            key={shift.id}
                                            value={shift.id}
                                        >
                                            {shift.className} — {shift.shiftName}
                                        </option>
                                    ))}
                                </select>

                                {availableShifts.length === 0 && (
                                    <p className="mt-2 text-xs text-[#e5b85c]">
                                        No active class shifts are currently available.
                                    </p>
                                )}
                            </div>

                            {/* FEE */}
                            {selectedShift && (
                                <div className="mt-6 rounded-xl border border-[#13a89e]/20 bg-[#13a89e]/5 p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs text-[#91a6ba]">
                                                Selected Class
                                            </p>
                                            <p className="mt-1 font-bold text-[#e7edf5]">
                                                {selectedShift.className}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-[#91a6ba]">
                                                Admission Fee
                                            </p>
                                            <p className="mt-1 text-xl font-extrabold text-[#e5b85c]">
                                                ৳{selectedShift.admissionFee.toLocaleString("en-BD")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TERMS */}
                            <div className="mt-8 border-t border-white/10 pt-7">
                                <label className="flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(event) =>
                                            setAgreed(event.target.checked)
                                        }
                                        className="mt-1 h-4 w-4 accent-[#13a89e]"
                                    />

                                    <span className="text-sm leading-7 text-[#a7b7c9]">
                                        I confirm that the information associated
                                        with my student account is accurate. I
                                        understand that submitting an application
                                        creates a temporary admission hold and
                                        that payment must be completed before
                                        the hold expires.
                                    </span>
                                </label>
                            </div>

                            {error && (
                                <div className="mt-6 rounded-lg border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mt-6 rounded-lg border border-[#13a89e]/30 bg-[#13a89e]/10 p-4 text-sm text-[#72ddd0]">
                                    <div className="flex items-center gap-2 font-bold">
                                        <CheckCircle2 size={18} />
                                        Application Submitted
                                    </div>

                                    <p className="mt-2">{success}</p>
                                </div>
                            )}

                            <button
                                onClick={handleApply}
                                disabled={
                                    submitting ||
                                    !selectedShiftId ||
                                    !agreed ||
                                    availableShifts.length === 0
                                }
                                className="primary-button mt-8 w-full disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? (
                                    "Submitting Application..."
                                ) : (
                                    <>
                                        Submit Application
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* CIRCULAR INFORMATION */}
                        <aside className="space-y-6">
                            <div className="surface-card p-6">
                                <span className="section-eyebrow">
                                    SELECTED CIRCULAR
                                </span>

                                <h3 className="mt-4 text-xl font-extrabold text-[#e7edf5]">
                                    {circular.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-[#9fb2c5]">
                                    {circular.description}
                                </p>

                                <div className="mt-6 space-y-5 border-t border-white/10 pt-6">
                                    <div className="flex gap-3">
                                        <CalendarDays
                                            className="mt-1 shrink-0 text-[#e5b85c]"
                                            size={19}
                                        />

                                        <div>
                                            <p className="text-xs text-[#8197ac]">
                                                Application Deadline
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-[#e7edf5]">
                                                {new Date(
                                                    circular.applicationEndDate
                                                ).toLocaleDateString("en-BD")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Clock
                                            className="mt-1 shrink-0 text-[#13a89e]"
                                            size={19}
                                        />

                                        <div>
                                            <p className="text-xs text-[#8197ac]">
                                                Payment Deadline
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-[#e7edf5]">
                                                {new Date(
                                                    circular.paymentDeadline
                                                ).toLocaleDateString("en-BD")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#e5b85c]/20 bg-[#e5b85c]/5 p-6">
                                <div className="flex items-center gap-3">
                                    <CreditCard
                                        className="text-[#e5b85c]"
                                        size={23}
                                    />
                                    <h3 className="font-bold text-[#e5c77e]">
                                        Payment Information
                                    </h3>
                                </div>

                                <p className="mt-4 text-sm leading-7 text-[#b7c3d0]">
                                    After successful application submission,
                                    the system will create a temporary seat
                                    hold. Complete payment within the
                                    displayed expiry time to confirm your
                                    application.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[#13a89e]/20 bg-[#13a89e]/5 p-6">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck
                                        className="text-[#13a89e]"
                                        size={23}
                                    />

                                    <h3 className="font-bold text-[#72ddd0]">
                                        Important Notice
                                    </h3>
                                </div>

                                <p className="mt-4 text-sm leading-7 text-[#a7b7c9]">
                                    Please review the circular and select
                                    the correct class and shift before
                                    submitting your application.
                                </p>
                            </div>
                        </aside>
                    </div>
                </Container>
            </section>
        </main>
    );
}

function BookOpenIcon() {
    return <GraduationCap size={19} />;
}
