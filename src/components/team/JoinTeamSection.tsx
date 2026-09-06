"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Briefcase,
    HeartHandshake,
    GraduationCap,
    Globe2,
    Laptop,
    Rocket,
    Users,
} from "lucide-react";

const perks = [
    {
        icon: Laptop,
        title: "Remote & Hybrid",
        description: "Work from anywhere while staying connected with the team.",
    },
    {
        icon: GraduationCap,
        title: "Learning Budget",
        description: "Courses, certifications, conferences and continuous growth.",
    },
    {
        icon: Globe2,
        title: "Global Projects",
        description: "Build products used by companies across multiple industries.",
    },
    {
        icon: HeartHandshake,
        title: "Healthy Culture",
        description: "Respect, flexibility and work-life balance come first.",
    },
];

const openings = [
    "Senior Full Stack Developer",
    "AI Engineer",
    "UI/UX Designer",
    "DevOps Engineer",
];

export default function JoinTeamSection() {
    return (
        <section className="relative overflow-hidden bg-white py-28">
            {/* Background */}

            <div className="absolute inset-0">
                <div className="absolute left-1/2 top-0 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[150px]" />
            </div>

            <div className="container relative mx-auto px-4 lg:px-8">
                <div className="overflow-hidden rounded-[42px] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 shadow-[0_40px_100px_rgba(37,99,235,.25)]">

                    <div className="grid items-center gap-16 p-8 lg:grid-cols-2 lg:p-16">

                        {/* LEFT */}

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="rounded-full bg-blue-500/20 px-5 py-2 text-sm font-semibold text-cyan-300">
                                Careers at ADM
                            </span>

                            <h2 className="mt-8 text-4xl font-black leading-tight text-white lg:text-6xl">
                                Build The Future
                                <span className="block text-cyan-300">
                                    With Us
                                </span>
                            </h2>

                            <p className="mt-8 text-lg leading-9 text-slate-300">
                                We're always looking for ambitious designers,
                                engineers and innovators who love solving difficult
                                problems and building products that create impact.
                            </p>

                            {/* Buttons */}

                            <div className="mt-10 flex flex-wrap gap-5">
                                <Link
                                    href="/careers"
                                    className="group inline-flex items-center rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-500"
                                >
                                    View Open Positions

                                    <ArrowRight className="ml-2 transition group-hover:translate-x-1" />
                                </Link>

                                <Link
                                    href="/contact"
                                    className="inline-flex items-center rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
                                >
                                    Contact HR
                                </Link>
                            </div>

                            {/* Stats */}

                            <div className="mt-14 grid grid-cols-3 gap-5">

                                {[
                                    ["25+", "Experts"],
                                    ["12", "Countries"],
                                    ["100%", "Remote Ready"],
                                ].map(([value, label]) => (
                                    <div
                                        key={label}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xl"
                                    >
                                        <div className="text-3xl font-black text-cyan-300">
                                            {value}
                                        </div>

                                        <div className="mt-2 text-sm text-slate-400">
                                            {label}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </motion.div>

                        {/* RIGHT */}

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            {/* Perks */}

                            <div className="grid gap-5 sm:grid-cols-2">

                                {perks.map((perk) => {
                                    const Icon = perk.icon;

                                    return (
                                        <motion.div
                                            key={perk.title}
                                            whileHover={{
                                                y: -8,
                                                scale: 1.02,
                                            }}
                                            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                                        >
                                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500">
                                                <Icon className="text-white" size={28} />
                                            </div>

                                            <h3 className="text-xl font-bold text-white">
                                                {perk.title}
                                            </h3>

                                            <p className="mt-3 leading-7 text-slate-300">
                                                {perk.description}
                                            </p>
                                        </motion.div>
                                    );
                                })}

                            </div>

                            {/* Open Roles */}

                            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

                                <div className="mb-6 flex items-center gap-3">

                                    <Briefcase className="text-cyan-300" />

                                    <h3 className="text-2xl font-black text-white">
                                        Currently Hiring
                                    </h3>

                                </div>

                                <div className="space-y-4">

                                    {openings.map((job) => (
                                        <motion.div
                                            key={job}
                                            whileHover={{ x: 8 }}
                                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/30 px-5 py-4 transition hover:border-cyan-400"
                                        >
                                            <div className="flex items-center gap-4">

                                                <Rocket
                                                    size={18}
                                                    className="text-cyan-300"
                                                />

                                                <span className="font-medium text-white">
                                                    {job}
                                                </span>

                                            </div>

                                            <ArrowRight
                                                className="text-slate-400"
                                                size={18}
                                            />
                                        </motion.div>
                                    ))}

                                </div>

                                <div className="mt-8 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 p-5">

                                    <Users className="text-cyan-300" />

                                    <p className="text-sm leading-7 text-slate-300">
                                        Don't see your role? We're always interested in
                                        exceptional talent. We'd love to hear from you.
                                    </p>

                                </div>

                            </div>

                        </motion.div>

                    </div>

                </div>
            </div>
        </section>
    );
}