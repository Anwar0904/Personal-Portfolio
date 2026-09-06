"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    Database,
    ShieldCheck,
    Cloud,
    Cpu,
    ArrowRight,
} from "lucide-react";

const industries = [
    {
        id: "healthcare",
        name: "Healthcare",
        image:
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
        title: "Modern Healthcare Ecosystems",
        description:
            "Secure healthcare platforms powered by AI, automation, patient portals and cloud infrastructure.",
        solutions: [
            {
                icon: Brain,
                title: "AI Diagnostics",
                desc: "Machine learning powered medical assistance."
            },
            {
                icon: ShieldCheck,
                title: "HIPAA Security",
                desc: "Enterprise-grade security and compliance."
            },
            {
                icon: Database,
                title: "Patient Management",
                desc: "Centralized healthcare data systems."
            },
            {
                icon: Cloud,
                title: "Cloud Infrastructure",
                desc: "Reliable and scalable hosting."
            },
        ],
    },

    {
        id: "finance",
        name: "Finance",
        image:
            "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=80",
        title: "Secure Financial Platforms",
        description:
            "Enterprise fintech systems built for security, scalability and automation.",
        solutions: [
            {
                icon: ShieldCheck,
                title: "Fraud Detection",
                desc: "AI-powered transaction monitoring."
            },
            {
                icon: Brain,
                title: "Financial AI",
                desc: "Smart customer insights."
            },
            {
                icon: Database,
                title: "Banking APIs",
                desc: "Modern financial integrations."
            },
            {
                icon: Cpu,
                title: "Automation",
                desc: "Reduce operational workload."
            },
        ],
    },

    {
        id: "education",
        name: "Education",
        image:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
        title: "Digital Learning Platforms",
        description:
            "Interactive LMS platforms, AI tutors and cloud-first education systems.",
        solutions: [
            {
                icon: Brain,
                title: "AI Tutor",
                desc: "Personalized learning experience."
            },
            {
                icon: Database,
                title: "Student Portal",
                desc: "Academic management system."
            },
            {
                icon: Cloud,
                title: "Cloud LMS",
                desc: "Available anywhere."
            },
            {
                icon: Cpu,
                title: "Analytics",
                desc: "Track student performance."
            },
        ],
    },
];

export default function IndustrySolutionsShowcase() {
    const [active, setActive] = useState(industries[0]);

    return (
        <section className="bg-slate-50 py-24">
            <div className="container mx-auto px-4 lg:px-8">

                <div className="mx-auto max-w-3xl text-center">

                    <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                        Tailored Solutions
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-slate-900 lg:text-5xl">
                        Industry-Specific
                        <span className="block text-blue-600">
                            Digital Solutions
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Every business sector requires different technologies,
                        workflows and customer experiences.
                        ADM engineers software specifically for your industry.
                    </p>

                </div>

                {/* Tabs */}

                <div className="mt-16 flex flex-wrap justify-center gap-4">

                    {industries.map((item) => (

                        <button
                            key={item.id}
                            onClick={() => setActive(item)}
                            className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${active.id === item.id
                                    ? "bg-blue-600 text-white shadow-xl"
                                    : "bg-white text-slate-700 hover:bg-blue-50"
                                }`}
                        >
                            {item.name}
                        </button>

                    ))}

                </div>

                <AnimatePresence mode="wait">

                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: .45 }}
                        className="mt-16 grid items-center gap-16 lg:grid-cols-2"
                    >

                        <div className="relative overflow-hidden rounded-[32px] shadow-2xl">

                            <Image
                                src={active.image}
                                alt={active.name}
                                width={800}
                                height={700}
                                className="h-[520px] w-full object-cover"
                            />

                        </div>

                        <div>

                            <h3 className="text-4xl font-black text-slate-900">
                                {active.title}
                            </h3>

                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                {active.description}
                            </p>

                            <div className="mt-10 grid gap-6 sm:grid-cols-2">

                                {active.solutions.map((solution) => {
                                    const Icon = solution.icon;

                                    return (
                                        <motion.div
                                            whileHover={{
                                                y: -6,
                                            }}
                                            key={solution.title}
                                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
                                        >
                                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                                                <Icon className="h-7 w-7 text-blue-600" />
                                            </div>

                                            <h4 className="font-bold text-slate-900">
                                                {solution.title}
                                            </h4>

                                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                                {solution.desc}
                                            </p>
                                        </motion.div>
                                    );
                                })}

                            </div>

                            <button className="mt-10 inline-flex items-center rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700">
                                Explore Solutions

                                <ArrowRight className="ml-3 h-5 w-5" />
                            </button>

                        </div>

                    </motion.div>

                </AnimatePresence>

            </div>
        </section>
    );
}