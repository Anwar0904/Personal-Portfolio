"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    ClipboardCheck,
    FileText,
    Rocket,
    Send,
    Video,
} from "lucide-react";

const steps = [
    {
        id: "01",
        title: "Submit Request",
        description:
            "Complete the consultation request form with your project goals, business requirements and supporting files.",
        icon: Send,
    },
    {
        id: "02",
        title: "Project Review",
        description:
            "Our experts carefully review your request and identify the best technical direction for your project.",
        icon: ClipboardCheck,
    },
    {
        id: "03",
        title: "Strategy Session",
        description:
            "We schedule a consultation to discuss architecture, features, timeline and budget recommendations.",
        icon: Video,
    },
    {
        id: "04",
        title: "Proposal & Roadmap",
        description:
            "Receive a detailed roadmap, implementation plan and transparent project estimate.",
        icon: FileText,
    },
    {
        id: "05",
        title: "Project Kickoff",
        description:
            "Once approved, our development team begins turning your vision into reality.",
        icon: Rocket,
    },
];

export default function ConsultationProcessSection() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,.12),transparent_35%)]" />

            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        Simple & Transparent
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-white lg:text-6xl">
                        What Happens Next?
                    </h2>

                    <p className="mt-6 text-lg leading-9 text-slate-300">
                        From your first request to project kickoff, we keep the process simple, transparent and collaborative.
                    </p>
                </motion.div>

                <div className="relative mx-auto mt-20 max-w-6xl">
                    {/* desktop line */}

                    <div className="absolute left-0 right-0 top-16 hidden h-[2px] bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-200 lg:block" />

                    <div className="grid gap-8 lg:grid-cols-5">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{
                                        opacity: 0,
                                        y: 40,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{
                                        once: true,
                                    }}
                                    transition={{
                                        delay: index * 0.08,
                                    }}
                                    className="relative group"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full border border-blue-400/30 bg-slate-900 shadow-xl transition duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                                            <Icon size={36} className="text-cyan-300" />
                                        </div>

                                        <div className="mt-6 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold tracking-widest text-white">
                                            STEP {step.id}
                                        </div>

                                        <h3 className="mt-5 text-xl font-bold text-white">{step.title}</h3>
                                        <p className="mt-4 text-sm leading-7 text-slate-300">{step.description}</p>

                                        {index !== steps.length - 1 && (
                                            <ArrowRight className="mt-8 hidden text-blue-300 lg:block" />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* mobile timeline */}

                    <div className="mx-auto mt-16 max-w-md space-y-6 lg:hidden">
                        {steps.map((step) => {
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.id}
                                    className="flex gap-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm"
                                >
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                                        <Icon size={22} />
                                    </div>

                                    <div>
                                        <span className="text-xs font-bold tracking-widest text-blue-600">
                                            STEP {step.id}
                                        </span>

                                        <h4 className="mt-2 font-bold text-white">{step.title}</h4>
                                        <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}