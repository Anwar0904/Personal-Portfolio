"use client";

import { motion } from "framer-motion";
import {
    BrainCircuit,
    Blocks,
    Cloud,
    Database,
    Server,
    ShieldCheck,
    Smartphone,
    Globe,
} from "lucide-react";

const technologies = [
    {
        title: "Artificial Intelligence",
        description:
            "LLMs, AI Agents, Computer Vision, NLP, Predictive Analytics & Intelligent Automation.",
        icon: BrainCircuit,
        color: "from-blue-500 to-cyan-500",
    },
    {
        title: "Cloud Infrastructure",
        description:
            "AWS, Azure, Google Cloud, Docker, Kubernetes, CI/CD & scalable architecture.",
        icon: Cloud,
        color: "from-sky-500 to-blue-500",
    },
    {
        title: "Web Platforms",
        description:
            "Next.js, React, Node.js, Express, REST APIs, GraphQL & enterprise portals.",
        icon: Globe,
        color: "from-indigo-500 to-blue-600",
    },
    {
        title: "Enterprise Systems",
        description:
            "ERP, CRM, HRM, custom dashboards, workflow automation & analytics.",
        icon: Server,
        color: "from-violet-500 to-indigo-500",
    },
    {
        title: "Blockchain",
        description:
            "Smart Contracts, Web3, Solidity, Hardhat, Tokenization & DApps.",
        icon: Blocks,
        color: "from-cyan-500 to-blue-600",
    },
    {
        title: "Databases",
        description:
            "MongoDB, PostgreSQL, MySQL, Redis, distributed storage & optimization.",
        icon: Database,
        color: "from-blue-600 to-indigo-700",
    },
    {
        title: "Mobile Solutions",
        description:
            "Cross-platform apps, PWAs, API integrations & enterprise mobility.",
        icon: Smartphone,
        color: "from-sky-500 to-cyan-500",
    },
    {
        title: "Cyber Security",
        description:
            "Authentication, Authorization, Encryption, Secure APIs & Infrastructure.",
        icon: ShieldCheck,
        color: "from-indigo-600 to-blue-700",
    },
];

export default function TechnologyExpertise() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-24">

            {/* Background */}

            <div className="absolute inset-0">

                <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[140px]" />

                <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[160px]" />

            </div>

            <div className="relative container mx-auto px-4 lg:px-8">

                <div className="mx-auto max-w-3xl text-center">

                    <span className="rounded-full bg-blue-600/20 px-5 py-2 text-sm font-semibold text-blue-300">
                        Technology Expertise
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-white lg:text-5xl">
                        Engineering with
                        <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            Modern Technologies
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-300">
                        We carefully choose technologies based on business objectives,
                        scalability, performance and long-term maintainability—not trends.
                    </p>

                </div>

                <div className="mt-20 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">

                    {technologies.map((tech, index) => {
                        const Icon = tech.icon;

                        return (
                            <motion.div
                                key={tech.title}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    delay: index * 0.05,
                                }}
                                whileHover={{
                                    y: -10,
                                    scale: 1.02,
                                }}
                                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-blue-400/40"
                            >

                                <div
                                    className={`mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${tech.color} shadow-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}
                                >
                                    <Icon className="h-10 w-10 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-white">
                                    {tech.title}
                                </h3>

                                <p className="mt-5 leading-8 text-slate-300">
                                    {tech.description}
                                </p>

                                <div
                                    className={`absolute bottom-0 left-0 h-1 w-full scale-x-0 bg-gradient-to-r ${tech.color} transition-transform duration-500 group-hover:scale-x-100`}
                                />

                            </motion.div>
                        );
                    })}

                </div>

                {/* Bottom Stack */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="mt-20 rounded-[36px] border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-slate-900 to-cyan-500/10 p-10 backdrop-blur-xl"
                >

                    <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">

                        <div>

                            <h3 className="text-3xl font-black text-white">
                                Technology is only valuable
                                <span className="block text-blue-400">
                                    when it solves real business problems.
                                </span>
                            </h3>

                            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                                Every ADM solution is built using the most appropriate
                                technologies—not simply the newest ones. Our architecture
                                focuses on performance, maintainability, scalability and
                                long-term growth.
                            </p>

                        </div>

                        <div className="grid grid-cols-2 gap-6 text-center">

                            <div>

                                <h4 className="text-5xl font-black text-blue-400">
                                    25+
                                </h4>

                                <p className="mt-2 text-slate-300">
                                    Core Technologies
                                </p>

                            </div>

                            <div>

                                <h4 className="text-5xl font-black text-cyan-400">
                                    100%
                                </h4>

                                <p className="mt-2 text-slate-300">
                                    Scalable Architecture
                                </p>

                            </div>

                        </div>

                    </div>

                </motion.div>

            </div>

        </section>
    );
}