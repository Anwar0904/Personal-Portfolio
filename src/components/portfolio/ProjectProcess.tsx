"use client";

import { motion } from "framer-motion";
import {
    Search,
    PenTool,
    Code2,
    ShieldCheck,
    Rocket,
    ArrowRight,
} from "lucide-react";

const steps = [
    {
        id: "01",
        title: "Discovery",
        icon: Search,
        color: "from-sky-500 to-blue-600",
        description:
            "Business analysis, stakeholder interviews, competitor research, user journey mapping and technical planning.",
        deliverables: [
            "Requirement Analysis",
            "User Research",
            "Technical Roadmap",
            "Project Scope",
        ],
    },
    {
        id: "02",
        title: "Design",
        icon: PenTool,
        color: "from-indigo-500 to-violet-600",
        description:
            "Wireframes, user experience, design systems, prototypes and interaction design.",
        deliverables: [
            "Wireframes",
            "UI Design",
            "Prototype",
            "Design System",
        ],
    },
    {
        id: "03",
        title: "Development",
        icon: Code2,
        color: "from-emerald-500 to-green-600",
        description:
            "Modern scalable development using clean architecture, CI/CD and performance-first engineering.",
        deliverables: [
            "Frontend",
            "Backend",
            "API Integration",
            "AI Features",
        ],
    },
    {
        id: "04",
        title: "Quality Assurance",
        icon: ShieldCheck,
        color: "from-amber-500 to-orange-500",
        description:
            "Testing every workflow to ensure security, speed, accessibility and reliability.",
        deliverables: [
            "Performance Test",
            "Security Test",
            "Responsive Test",
            "Bug Fixes",
        ],
    },
    {
        id: "05",
        title: "Launch & Growth",
        icon: Rocket,
        color: "from-blue-600 to-cyan-500",
        description:
            "Deployment, monitoring, optimization and continuous product improvements.",
        deliverables: [
            "Deployment",
            "Monitoring",
            "Analytics",
            "Optimization",
        ],
    },
];

export default function ProjectProcess() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
            <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[160px]" />

            <div className="container relative mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
                        Our Workflow
                    </span>

                    <h2 className="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl">
                        Every Successful Product
                        <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            Starts With The Right Process
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-300">
                        We combine strategy, design, engineering and continuous improvement
                        into one streamlined workflow that minimizes risk and maximizes
                        product quality.
                    </p>
                </motion.div>

                <div className="relative">
                    <div className="absolute left-8 top-0 hidden h-full w-[3px] rounded-full bg-gradient-to-b from-blue-600 to-cyan-400 lg:block" />

                    <div className="space-y-12">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    viewport={{ once: true }}
                                    className="group relative"
                                >
                                    <div className="grid items-center gap-8 lg:grid-cols-[110px_1fr]">
                                        <div className="relative hidden justify-center lg:flex">
                                            <div
                                                className={`z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-xl transition-all duration-500 group-hover:scale-110`}
                                            >
                                                <Icon size={28} />
                                            </div>
                                        </div>

                                        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                                            <div className="grid lg:grid-cols-[220px_1fr]">
                                                <div className={`bg-gradient-to-br ${step.color} p-8 text-white`}>
                                                    <p className="text-sm uppercase tracking-[0.3em] opacity-80">Step</p>
                                                    <h3 className="mt-3 text-6xl font-black">{step.id}</h3>
                                                    <h4 className="mt-6 text-2xl font-bold">{step.title}</h4>
                                                </div>

                                                <div className="p-8 lg:p-10">
                                                    <p className="text-lg leading-8 text-slate-300">{step.description}</p>

                                                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                                        {step.deliverables.map((item) => (
                                                            <div
                                                                key={item}
                                                                className="flex items-center gap-3 rounded-xl bg-slate-800/80 px-4 py-3"
                                                            >
                                                                <ArrowRight size={16} className="text-blue-300" />
                                                                <span className="font-medium text-slate-200">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 p-10 text-white lg:p-14"
                >
                    <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
                        <div>
                            <h3 className="text-4xl font-black">
                                No Guesswork.
                                <br />
                                Just Proven Execution.
                            </h3>

                            <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
                                Every ADM project follows the same refined process that has
                                consistently delivered scalable software, exceptional user
                                experiences and measurable business outcomes.
                            </p>
                        </div>

                        <div className="grid gap-5 text-center sm:grid-cols-3 lg:grid-cols-1">
                            <div>
                                <h4 className="text-5xl font-black">5</h4>
                                <p className="mt-2 text-blue-100">Core Phases</p>
                            </div>

                            <div>
                                <h4 className="text-5xl font-black">100%</h4>
                                <p className="mt-2 text-blue-100">Transparent Process</p>
                            </div>

                            <div>
                                <h4 className="text-5xl font-black">∞</h4>
                                <p className="mt-2 text-blue-100">Continuous Improvement</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}