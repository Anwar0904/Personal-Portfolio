"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    ContactFormSchema,
    ContactFormSchemaType,
} from "@/validators/contact-form.validator";
import { motion } from "framer-motion";

import { Send } from "lucide-react";

import { contactServices } from "@/lib/dummy/contact-services";

import { useCreateLead } from "@/hooks/useCreateLead";
import {
    formatLeadAnalytics,
    trackPageView,
} from "@/lib/analytics";

export default function ContactFormSection() {
    useEffect(() => {
        trackPageView("contact_page_view");
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormSchemaType>({
        resolver: zodResolver(
            ContactFormSchema
        ),

        defaultValues: {
            interestedServices: [],
        },
    });

    const createLeadMutation =
        useCreateLead();

    const onSubmit = async (
        data: ContactFormSchemaType
    ) => {
        const budgetMap: Record<
            string,
            { amount: number; currency: "USD"; type: "fixed" | "range" } | undefined
        > = {
            "<5000": {
                amount: 5000,
                currency: "USD",
                type: "fixed",
            },

            "5000-10000": {
                amount: 10000,
                currency: "USD",
                type: "range",
            },

            "10000-25000": {
                amount: 25000,
                currency: "USD",
                type: "range",
            },

            "25000+": {
                amount: 50000,
                currency: "USD",
                type: "range",
            },

            custom: undefined,
        };

        const budgetValue = data.budget
            ? budgetMap[data.budget]
            : undefined;

        createLeadMutation.mutate(
            {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone || undefined,
                company: data.company || undefined,
                website: data.website || undefined,
                interestedServices: data.interestedServices,
                budget: budgetValue,
                message: data.message,
            },
            {
                onSuccess: () => {
                    trackPageView(
                        "lead_created",
                        formatLeadAnalytics({
                            source: "website",
                            interestedServices: data.interestedServices,
                            budget: data.budget ?? null,
                            hasFiles: false,
                        })
                    );
                    reset();
                },
            }
        );
    };

    return (
        <section
            id="contact-form"
            className="bg-slate-950 py-16 lg:py-20"
        >
            <div className="container mx-auto px-4 lg:px-8">

                <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12">
                    {/* Left Side */}

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <span className="inline-flex w-fit rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-200 sm:text-xs">
                            Send Project Inquiry
                        </span>

                        <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                            Let's Build
                            <span className="mt-1 block bg-gradient-to-r from-blue-300 via-cyan-300 to-white bg-clip-text text-transparent">
                                Something Great
                            </span>
                        </h2>

                        <p className="mt-5 text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                            Tell us about your project and our team will contact you
                            within 24 hours with ideas, recommendations and the next
                            steps.
                        </p>

                        <div className="mt-8 space-y-3">
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                                <h4 className="text-sm font-bold text-white">
                                    ✔ Free Consultation
                                </h4>

                                <p className="mt-1 text-sm text-slate-400">
                                    No commitment required.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                                <h4 className="text-sm font-bold text-white">
                                    ✔ Tailored Proposal
                                </h4>

                                <p className="mt-1 text-sm text-slate-400">
                                    Custom roadmap & quotation.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                                <h4 className="text-sm font-bold text-white">
                                    ✔ Fast Response
                                </h4>

                                <p className="mt-1 text-sm text-slate-400">
                                    Usually within one business day.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side */}

                    <motion.form
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30 sm:p-6 lg:p-8"
                    >
                        {/* Row 1 */}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                                    Full Name
                                </label>

                                <input
                                    {...register("fullName")}
                                    placeholder="John Doe"
                                    className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                                />
                                {errors.fullName && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="john@example.com"
                                    className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Row 2 */}

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                                    Phone
                                </label>

                                <input
                                    {...register("phone")}
                                    placeholder="+92..."
                                    className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                                    Company
                                </label>

                                <input
                                    {...register("company")}
                                    placeholder="Company Name"
                                    className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Website */}

                        <div className="mt-4">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                                Website
                            </label>

                            <input
                                {...register("website")}
                                placeholder="https://"
                                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                            />
                        </div>

                        {/* Services */}

                        <div className="mt-5">
                            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                                Interested Services
                            </label>

                            <div className="grid gap-2 sm:grid-cols-2">
                                {contactServices.map((service) => (
                                    <label
                                        key={service.id}
                                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-3 transition hover:border-blue-500"
                                    >
                                        <input
                                            type="checkbox"
                                            value={service.id}
                                            {...register("interestedServices")}
                                            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500"
                                        />

                                        <span className="text-sm font-medium text-slate-200">
                                            {service.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}

                        <div className="mt-5">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                                Estimated Budget
                            </label>

                            <select
                                {...register("budget")}
                                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-blue-500"
                            >
                                <option value="">Select Budget</option>
                                <option value="<5000">Less than $5K</option>
                                <option value="5000-10000">$5K – $10K</option>
                                <option value="10000-25000">$10K – $25K</option>
                                <option value="25000+">$25K+</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        {/* Message */}

                        <div className="mt-5">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                                Project Details
                            </label>

                            <textarea
                                rows={5}
                                {...register("message")}
                                placeholder="Tell us about your project..."
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                            />
                        </div>

                        {/* Button */}

                        <button
                            type="submit"
                            disabled={createLeadMutation.isPending}
                            className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {createLeadMutation.isPending
                                ? "Sending..."
                                : "Send Inquiry"}

                            {!createLeadMutation.isPending && (
                                <Send
                                    size={16}
                                    className="ml-2"
                                />
                            )}
                        </button>
                    </motion.form>
                </div>

            </div>
        </section>
    );
}