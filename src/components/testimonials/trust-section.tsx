"use client";

import { motion } from "framer-motion";
import {
    Award,
    BriefcaseBusiness,
    Code2,
    Globe2,
    ShieldCheck,
    Users,
} from "lucide-react";

const stats = [
    {
        value: "100+",
        label: "Engagements Delivered",
        icon: BriefcaseBusiness,
    },
    {
        value: "98%",
        label: "Organization Satisfaction",
        icon: Users,
    },
    {
        value: "5+",
        label: "Years Experience",
        icon: Award,
    },
    {
        value: "15+",
        label: "Technologies",
        icon: Code2,
    },
];

const technologies = [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "MySQL",
    "Python",
    "OpenAI",
    "AWS",
    "Docker",
    "WordPress",
    "Solidity",
];

export default function TrustSection() {
    return (
        <section className="relative overflow-hidden bg-slate-50 py-24">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,.05),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,.06),transparent_40%)]" />

            <div className="container relative mx-auto max-w-7xl px-4 lg:px-8">
                {/* Heading */}

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
                    className="mx-auto mb-16 max-w-3xl text-center"
                >
                    <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                        Trusted Worldwide
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-slate-900">
                        Why Organizations
                        Continue Working
                        With ADM
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-slate-600">
                        We focus on long-term partnerships,
                        measurable business value, and
                        delivering reliable digital solutions.
                    </p>
                </motion.div>

                {/* Stats */}

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map(
                        (
                            item,
                            index
                        ) => {
                            const Icon =
                                item.icon;

                            return (
                                <motion.div
                                    key={
                                        item.label
                                    }
                                    initial={{
                                        opacity: 0,
                                        y: 35,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        delay:
                                            index *
                                            0.08,
                                    }}
                                    viewport={{
                                        once: true,
                                    }}
                                    className="rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                                >
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                                        <Icon
                                            size={
                                                28
                                            }
                                        />
                                    </div>

                                    <h3 className="mt-6 text-5xl font-black text-slate-900">
                                        {
                                            item.value
                                        }
                                    </h3>

                                    <p className="mt-3 text-slate-600">
                                        {
                                            item.label
                                        }
                                    </p>
                                </motion.div>
                            );
                        }
                    )}
                </div>

                {/* Technology */}

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
                    className="mt-20 rounded-[36px] border border-slate-200 bg-white p-10 shadow-sm lg:p-14"
                >
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-xl">
                            <div className="mb-5 flex items-center gap-3">
                                <ShieldCheck className="text-blue-600" />

                                <h3 className="text-3xl font-black text-slate-900">
                                    Modern Technology
                                    Stack
                                </h3>
                            </div>

                            <p className="leading-8 text-slate-600">
                                We build scalable,
                                secure, and future-ready
                                products using modern
                                technologies trusted by
                                enterprises around the
                                world.
                            </p>
                        </div>

                        <div className="flex max-w-2xl flex-wrap gap-3">
                            {technologies.map(
                                (
                                    tech
                                ) => (
                                    <span
                                        key={
                                            tech
                                        }
                                        className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                                    >
                                        {
                                            tech
                                        }
                                    </span>
                                )
                            )}
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-10 border-t border-slate-100 pt-10 text-slate-500">
                        <div className="flex items-center gap-3">
                            <Globe2 className="text-blue-600" />

                            <span>
                                Global
                                Collaboration
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-blue-600" />

                            <span>
                                Secure
                                Development
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Award className="text-blue-600" />

                            <span>
                                Quality
                                Assurance
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}