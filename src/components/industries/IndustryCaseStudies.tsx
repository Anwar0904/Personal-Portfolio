"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Clock3, Users } from "lucide-react";

const caseStudies = [
    {
        title: "AI Hospital Management System",
        industry: "Healthcare",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&q=80",
        description: "Developed a complete hospital ecosystem with patient portal, appointment booking, AI diagnostics and cloud infrastructure.",
        metrics: [
            { icon: TrendingUp, label: "Efficiency", value: "+62%" },
            { icon: Clock3, label: "Processing", value: "-45%" },
            { icon: Users, label: "Patients", value: "500K+" },
        ],
    },
    {
        title: "Enterprise FinTech Platform",
        industry: "Finance",
        image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80",
        description: "Secure financial platform with fraud detection, real-time dashboards and payment automation.",
        metrics: [
            { icon: TrendingUp, label: "Revenue", value: "+180%" },
            { icon: Clock3, label: "Automation", value: "85%" },
            { icon: Users, label: "Transactions", value: "2M+" },
        ],
    },
    {
        title: "Next Generation Learning Platform",
        industry: "Education",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
        description: "Interactive LMS with AI tutor, live classrooms, assessments and performance analytics.",
        metrics: [
            { icon: TrendingUp, label: "Engagement", value: "+71%" },
            { icon: Clock3, label: "Learning", value: "+40%" },
            { icon: Users, label: "Students", value: "120K+" },
        ],
    },
];

export default function IndustryCaseStudies() {
    return (
        <section className="bg-slate-950 py-24">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="mx-auto mb-20 max-w-3xl text-center">
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        Success Stories
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-white lg:text-5xl">
                        Real Projects.
                        <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            Measurable Business Impact.
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-300">
                        We don't just build software. We solve business challenges with technology that delivers measurable ROI.
                    </p>
                </div>

                <div className="space-y-16">
                    {caseStudies.map((study, index) => (
                        <motion.div
                            key={study.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: .6 }}
                            className={`grid items-center gap-12 rounded-[32px] border border-slate-800 bg-slate-900/60 p-4 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
                        >
                            <div className="relative overflow-hidden rounded-[28px] shadow-2xl">
                                <Image src={study.image} alt={study.title} width={900} height={700} className="h-[500px] w-full object-cover transition duration-700 hover:scale-105" />
                                <div className="absolute left-6 top-6 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg">
                                    {study.industry}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-4xl font-black text-white">{study.title}</h3>
                                <p className="mt-6 text-lg leading-8 text-slate-300">{study.description}</p>

                                <div className="mt-10 grid grid-cols-3 gap-4">
                                    {study.metrics.map((metric) => {
                                        const Icon = metric.icon;

                                        return (
                                            <motion.div
                                                whileHover={{ y: -8 }}
                                                key={metric.label}
                                                className="rounded-3xl border border-slate-700 bg-slate-800/80 p-6 text-center transition hover:border-blue-400/50 hover:bg-slate-800 hover:shadow-xl"
                                            >
                                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                                                    <Icon className="h-7 w-7 text-cyan-300" />
                                                </div>
                                                <div className="text-3xl font-black text-blue-300">{metric.value}</div>
                                                <div className="mt-2 text-sm font-medium text-slate-300">{metric.label}</div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <button className="mt-10 inline-flex items-center rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-500">
                                    Read Full Case Study
                                    <ArrowRight className="ml-3 h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}