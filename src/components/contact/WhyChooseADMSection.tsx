"use client";

import { motion } from "framer-motion";
import {
    BrainCircuit,
    ShieldCheck,
    Handshake,
    Rocket,
    ArrowUpRight,
    CheckCircle2,
} from "lucide-react";

const reasons = [
    {
        icon: BrainCircuit,
        title: "Business-First Engineering",
        description:
            "We don't simply build software—we solve business problems with scalable, measurable digital solutions.",
        color: "from-blue-600 to-cyan-500",
    },
    {
        icon: Rocket,
        title: "Modern Technology Stack",
        description:
            "AI, Next.js, Cloud, DevOps, Blockchain and enterprise-grade architectures built for long-term growth.",
        color: "from-violet-600 to-fuchsia-500",
    },
    {
        icon: ShieldCheck,
        title: "Quality & Security",
        description:
            "Every solution follows modern engineering practices, performance optimization and secure development standards.",
        color: "from-emerald-500 to-teal-500",
    },
    {
        icon: Handshake,
        title: "Long-Term Partnership",
        description:
            "From strategy and development to maintenance and future scaling, we stay with your business every step.",
        color: "from-orange-500 to-red-500",
    },
];

const stats = [
    {
        value: "50+",
        label: "Engagements Delivered",
    },
    {
        value: "98%",
        label: "Organization Satisfaction",
    },
    {
        value: "<24h",
        label: "Average Response",
    },
    {
        value: "100%",
        label: "Transparent Process",
    },
];

export default function WhyChooseADMSection() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[170px]" />
                <div className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[170px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid items-center gap-20 lg:grid-cols-[0.95fr_1.25fr]">
                    {/* LEFT */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -40,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                    >
                        <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                            Why ADM
                        </span>

                        <h2 className="mt-6 text-4xl font-black leading-tight text-white lg:text-6xl">
                            More Than
                            <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                                A Development Team
                            </span>
                        </h2>

                        <p className="mt-8 text-lg leading-9 text-slate-300">
                            We combine business strategy, modern technology and exceptional design to create digital products that generate measurable results—not just lines of code.
                        </p>

                        <div className="mt-12 space-y-5">
                            {[
                                "Transparent communication from day one",
                                "Dedicated technical experts",
                                "Scalable architecture",
                                "Post-launch support & optimization",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-4">
                                    <CheckCircle2 size={22} className="text-cyan-300" />
                                    <span className="font-medium text-slate-200">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT */}

                    <div className="grid gap-7 sm:grid-cols-2">
                        {reasons.map((reason, index) => {
                            const Icon = reason.icon;

                            return (
                                <motion.div
                                    key={reason.title}
                                    initial={{
                                        opacity: 0,
                                        y: 40,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    whileHover={{
                                        y: -10,
                                    }}
                                    viewport={{
                                        once: true,
                                    }}
                                    transition={{
                                        delay: index * 0.08,
                                    }}
                                    className="group relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/70 p-8 shadow-sm transition-all hover:shadow-2xl"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-0 transition duration-500 group-hover:opacity-100`} />

                                    <div className="relative z-10">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-700 bg-slate-800 transition group-hover:bg-white">
                                            <Icon size={38} className="text-cyan-300" />
                                        </div>

                                        <h3 className="mt-8 text-2xl font-black text-white transition group-hover:text-white">{reason.title}</h3>
                                        <p className="mt-5 leading-8 text-slate-300 transition group-hover:text-white/90">{reason.description}</p>

                                        <div className="mt-8 inline-flex items-center font-semibold text-blue-300 transition group-hover:text-white">
                                            Learn More
                                            <ArrowUpRight size={18} className="ml-2 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Stats */}

                <motion.div
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
                    className="mt-24 rounded-[36px] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-12 text-white"
                >
                    <div className="grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <h3 className="text-5xl font-black bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                                    {stat.value}
                                </h3>

                                <p className="mt-3 text-slate-300">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}