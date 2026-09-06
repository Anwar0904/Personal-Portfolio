"use client";

import { motion } from "framer-motion";
import {
    Brain,
    HeartHandshake,
    Rocket,
    Sparkles,
    GraduationCap,
    Globe2,
    Coffee,
    Trophy,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

const values = [
    {
        icon: Brain,
        title: "AI-First Innovation",
        description:
            "We continuously experiment with modern AI technologies to solve real business problems.",
        color: "from-blue-600 to-cyan-500",
    },
    {
        icon: HeartHandshake,
        title: "People Before Products",
        description:
            "Exceptional software begins with exceptional people, collaboration and trust.",
        color: "from-rose-500 to-pink-500",
    },
    {
        icon: Rocket,
        title: "Move Fast. Build Better.",
        description:
            "Rapid iteration, continuous improvement and uncompromising engineering quality.",
        color: "from-violet-600 to-indigo-600",
    },
    {
        icon: Sparkles,
        title: "Craftsmanship",
        description:
            "Every pixel, interaction and line of code is carefully designed with purpose.",
        color: "from-amber-500 to-orange-500",
    },
];

const perks = [
    {
        icon: GraduationCap,
        title: "Continuous Learning",
    },
    {
        icon: Globe2,
        title: "Remote Friendly",
    },
    {
        icon: Coffee,
        title: "Healthy Work Culture",
    },
    {
        icon: Trophy,
        title: "Performance Rewards",
    },
];

export default function TeamCultureSection() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-28">
            <div className="absolute inset-0">
                <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-500/15 blur-[120px]" />
                <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[140px]" />
            </div>

            <div className="container relative mx-auto px-4 lg:px-8">
                {/* Heading */}

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        Life at ADM
                    </span>

                    <h2 className="mt-6 text-4xl font-black leading-tight text-white lg:text-6xl">
                        More Than A Team.
                        <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            A Culture Of Excellence.
                        </span>
                    </h2>

                    <p className="mt-8 text-lg leading-9 text-slate-300">
                        We believe remarkable software comes from empowered people, fearless creativity and a culture where everyone keeps learning.
                    </p>
                </motion.div>

                {/* Main */}

                <div className="grid items-center gap-16 lg:grid-cols-2">
                    {/* Left */}

                    <div className="grid gap-7 sm:grid-cols-2">
                        {values.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{
                                        opacity: 0,
                                        y: 35,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{
                                        y: -12,
                                    }}
                                    className="group rounded-[30px] border border-slate-800 bg-slate-900/80 p-8 shadow-sm transition-all hover:shadow-2xl"
                                >
                                    <div
                                        className={`mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color}`}
                                    >
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-black text-white">{item.title}</h3>
                                    <p className="mt-5 leading-8 text-slate-300">{item.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 40,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{ once: true }}
                        className="rounded-[36px] bg-gradient-to-br from-slate-900 to-blue-900 p-10 text-white shadow-2xl lg:p-14"
                    >
                        <h3 className="text-4xl font-black">
                            Why Engineers Love ADM
                        </h3>

                        <p className="mt-7 text-lg leading-9 text-slate-300">
                            We build products that matter while creating an environment
                            where talented people can grow professionally and personally.
                        </p>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2">
                            {perks.map((perk) => {
                                const Icon = perk.icon;

                                return (
                                    <motion.div
                                        key={perk.title}
                                        whileHover={{
                                            x: 6,
                                        }}
                                        className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                                    >
                                        <div className="rounded-xl bg-blue-600 p-3">
                                            <Icon className="h-6 w-6" />
                                        </div>

                                        <span className="font-semibold">
                                            {perk.title}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Quote */}

                        <div className="mt-14 rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl">
                            <p className="text-xl italic leading-9 text-slate-200">
                                “Our purpose isn't just building software—it's building an environment where extraordinary people can create extraordinary things.”
                            </p>

                            <div className="mt-8 h-px w-full bg-white/10" />

                            <div className="mt-6 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold">ADM Leadership</h4>

                                    <p className="text-sm text-slate-400">
                                        Building the future together.
                                    </p>
                                </div>

                                <Link
                                    href="/careers"
                                    className="group inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
                                >
                                    Join Our Team

                                    <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}