
"use client";

import { useState } from "react";
import Container from "@/components/common/Container";
import PageHeader from "@/components/common/PageHeader";

import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageCircle,
} from "lucide-react";

const contactItems = [
    {
        icon: MapPin,
        title: "Our Address",
        value: "School Campus, Dhaka, Bangladesh",
    },
    {
        icon: Phone,
        title: "Phone Number",
        value: "+880 1XXX-XXXXXX",
    },
    {
        icon: Mail,
        title: "Email Address",
        value: "info@edubridge.edu.bd",
    },
    {
        icon: Clock,
        title: "Office Hours",
        value: "Sunday - Thursday, 9:00 AM - 4:00 PM",
    },
];

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setSubmitting(true);
        setFeedback("");

        try {
            /*
             * Contact endpoint is not part of the backend
             * routes established earlier.
             * Add a ContactController endpoint before enabling
             * this request in production.
             */

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            if (!response.ok) {
                throw new Error("Unable to send your message.");
            }

            setFeedback(
                "Your message has been sent successfully."
            );

            setForm({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            setFeedback(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main>
            <PageHeader
                eyebrow="CONTACT US"
                title="We Would Love to Hear From You"
                description="Have questions about admissions, academic programs or our school? Get in touch with our team."
            />

            <section className="section-padding bg-[#0a1b2e]">
                <Container>
                    <div className="grid gap-8 lg:grid-cols-5">
                        {/* CONTACT INFORMATION */}
                        <div className="space-y-5 lg:col-span-2">
                            <div>
                                <span className="section-eyebrow">
                                    GET IN TOUCH
                                </span>

                                <h2 className="mt-4 text-3xl font-extrabold text-[#e7edf5]">
                                    Contact Information
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-[#9fb2c5]">
                                    Our team is here to help you with
                                    admission questions, general information
                                    and other enquiries.
                                </p>
                            </div>

                            {contactItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.title}
                                        className="surface-card flex gap-4 p-5"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#13a89e]/10 text-[#13a89e]">
                                            <Icon size={22} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-[#e7edf5]">
                                                {item.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-[#9fb2c5]">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CONTACT FORM */}
                        <div className="surface-card p-6 md:p-9 lg:col-span-3">
                            <div className="mb-8">
                                <span className="section-eyebrow">
                                    SEND A MESSAGE
                                </span>

                                <h2 className="mt-3 text-2xl font-extrabold text-[#e7edf5]">
                                    How Can We Help You?
                                </h2>

                                <p className="mt-3 text-sm text-[#91a6ba]">
                                    Fill out the form and our team will
                                    get back to you.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="form-label">
                                            Your Name *
                                        </label>

                                        <input
                                            required
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">
                                            Email Address *
                                        </label>

                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label">
                                        Subject *
                                    </label>

                                    <input
                                        required
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="What is your message about?"
                                    />
                                </div>

                                <div>
                                    <label className="form-label">
                                        Your Message *
                                    </label>

                                    <textarea
                                        required
                                        rows={6}
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        className="form-control resize-none"
                                        placeholder="Write your message here..."
                                    />
                                </div>

                                {feedback && (
                                    <p className="rounded-lg border border-[#13a89e]/20 bg-[#13a89e]/5 p-4 text-sm text-[#72ddd0]">
                                        {feedback}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="primary-button w-full disabled:opacity-50 sm:w-auto"
                                >
                                    {submitting ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            Send Message
                                            <Send size={17} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* LOCATION PLACEHOLDER */}
                    <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#10243b]">
                        <div className="flex min-h-[250px] flex-col items-center justify-center px-6 py-12 text-center">
                            <MapPin size={36} className="text-[#e5b85c]" />

                            <h3 className="mt-5 text-xl font-bold text-[#e7edf5]">
                                Visit Our Campus
                            </h3>

                            <p className="mt-3 max-w-lg text-sm leading-7 text-[#9fb2c5]">
                                Add your school's exact Google Maps
                                embed link here when the campus address
                                is finalized.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
