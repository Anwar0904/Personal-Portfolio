"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CalendarCheck2,
    FileUp,
    Sparkles,
    ShieldCheck,
    Clock3,
    BrainCircuit,
    CheckCircle2,
} from "lucide-react";

const pipeline = [
    {
        step: "01",
        title: "Submit Request",
        desc: "Share your goals, timeline and files.",
        icon: FileUp,
    },
    {
        step: "02",
        title: "Discovery Call",
        desc: "We review your idea and ask the right questions.",
        icon: BrainCircuit,
    },
    {
        step: "03",
        title: "Proposal",
        desc: "You get a tailored roadmap and engagement plan.",
        icon: ShieldCheck,
    },
    {
        step: "04",
        title: "Project Kickoff",
        desc: "We move into design, planning and delivery.",
        icon: CalendarCheck2,
    },
];

const highlights = [
    "Free initial consultation",
    "Fast response within 24 hours",
    "Secure file sharing for your brief",
    "Custom proposal for every project",
];

export default function ConsultationHeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-36 pb-24 lg:pt-44 lg:pb-32">
            <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,.18),transparent_35%)]" />

            <div className="absolute left-0 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-[180px]" />
            <div className="absolute right-0 bottom-0 -z-10 h-[520px] w-[520px] rounded-full bg-cyan-500/20 blur-[180px]" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />

            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold text-cyan-200 backdrop-blur-xl">
                            <Sparkles size={16} />
                            Consultation Request Pipeline
                        </span>

                        <h1 className="mt-8 text-5xl font-black leading-tight text-white lg:text-7xl">
                            Book A
                            <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent">
                                Strategy Session
                            </span>
                        </h1>

                        <p className="mt-8 max-w-2xl text-xl leading-10 text-slate-300">
                            Tell us about your project and our team will guide you through a
                            clear consultation pipeline—from request to proposal to kickoff.
                        </p>

                        <div className="mt-12 flex flex-col gap-5 sm:flex-row">
                            <Link
                                href="#consultation-form"
                                className="group inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-blue-700"
                            >
                                Start Request
                                <ArrowRight
                                    size={18}
                                    className="ml-3 transition group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20"
                            >
                                Contact Team
                            </Link>
                        </div>

                        <div className="mt-14 grid gap-4 sm:grid-cols-2">
                            {highlights.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-200 backdrop-blur-xl"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                                    <span className="text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 grid grid-cols-2 gap-5 md:grid-cols-4">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                                <h3 className="text-4xl font-black text-white">24h</h3>
                                <p className="mt-2 text-sm text-slate-400">Response</p>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                                <h3 className="text-4xl font-black text-white">100%</h3>
                                <p className="mt-2 text-sm text-slate-400">Free Call</p>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                                <h3 className="text-4xl font-black text-white">4-Step</h3>
                                <p className="mt-2 text-sm text-slate-400">Pipeline</p>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                                <h3 className="text-4xl font-black text-white">Secure</h3>
                                <p className="mt-2 text-sm text-slate-400">Upload</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="rounded-[36px] border border-white/10 bg-white/10 p-6 shadow-[0_40px_100px_rgba(0,0,0,.35)] backdrop-blur-2xl lg:p-8">
                            <div className="rounded-[30px] bg-white p-6 shadow-xl lg:p-8">
                                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                                    <CalendarCheck2 size={30} className="text-blue-600" />
                                </div>

                                <h2 className="text-3xl font-black text-slate-900">
                                    Consultation Pipeline
                                </h2>

                                <p className="mt-4 leading-8 text-slate-600">
                                    A simple, transparent process that helps us understand your
                                    goals and move quickly toward the right solution.
                                </p>

                                <div className="mt-8 space-y-4">
                                    {pipeline.map((item, index) => {
                                        const Icon = item.icon;

                                        return (
                                            <div
                                                key={item.step}
                                                className="group flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white"
                                            >
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                                                    <Icon size={20} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <h3 className="font-bold text-slate-900">
                                                            {item.title}
                                                        </h3>
                                                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                                            {item.step}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white">
                                    <div className="flex items-center gap-3">
                                        <Clock3 size={20} />
                                        <p className="font-semibold">Typical response in less than 24 hours</p>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -left-6 -bottom-6 hidden rounded-3xl border border-white/10 bg-white/10 p-5 text-slate-100 backdrop-blur-2xl lg:block"
                            >
                                <p className="text-sm text-cyan-200">
                                    Trusted by startups, businesses and teams
                                </p>
                                <h3 className="mt-2 text-3xl font-black text-white">Free</h3>
                                <p className="text-sm text-slate-300">Initial Strategy Call</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}