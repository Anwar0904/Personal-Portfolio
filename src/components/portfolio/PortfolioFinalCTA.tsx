"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CalendarDays,
    Sparkles,
    ShieldCheck,
    Rocket,
} from "lucide-react";

export default function PortfolioFinalCTA() {
    return (
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_25%),linear-gradient(135deg,#020b17_0%,#071a2d_35%,#0c2342_100%)] py-28">
            <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-[150px]" />
            <div className="absolute -bottom-44 -right-44 h-[520px] w-[520px] rounded-full bg-cyan-300/20 blur-[150px]" />

            <div className="absolute inset-0 opacity-[0.07]">
                <div className="h-full w-full bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <div className="container relative mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-6xl overflow-hidden rounded-[42px] border border-white/15 bg-white/8 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,.25)]"
                >
                    <div className="grid items-center gap-16 lg:grid-cols-2">
                        <div className="p-10 md:p-16">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white">
                                <Sparkles className="h-4 w-4" />
                                Ready To Build Something Extraordinary?
                            </div>

                            <h2 className="mt-8 text-5xl font-black leading-tight text-white md:text-6xl">
                                Your Next
                                <span className="block text-blue-300">Success Story</span>
                                Starts Here.
                            </h2>

                            <p className="mt-8 max-w-xl text-xl leading-9 text-slate-200">
                                Whether you're launching an AI-powered platform,
                                enterprise application, SaaS product,
                                or complete digital transformation,
                                ADM is ready to turn your vision into
                                a premium digital experience.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-5">
                                <Link
                                    href="/consultation"
                                    className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-5 font-bold text-blue-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                                >
                                    <CalendarDays className="h-5 w-5" />
                                    Book Consultation
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                                </Link>

                                <Link
                                    href="/contact"
                                    className="inline-flex items-center rounded-2xl border border-white/20 bg-slate-900/30 px-8 py-5 font-semibold text-white transition-all duration-300 hover:bg-white/10"
                                >
                                    Start Your Project
                                </Link>
                            </div>
                        </div>

                        <div className="relative flex h-full items-center justify-center p-10">
                            <div className="absolute h-[420px] w-[420px] rounded-full bg-white/10 blur-[120px]" />

                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ repeat: Infinity, duration: 5 }}
                                className="relative w-full max-w-md rounded-[36px] border border-white/20 bg-white/10 p-10 backdrop-blur-xl"
                            >
                                <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-blue-700">
                                    <Rocket size={40} />
                                </div>

                                <h3 className="text-3xl font-black text-white">Why Work With ADM?</h3>

                                <div className="mt-8 space-y-6">
                                    {[
                                        "AI-First Development",
                                        "Modern UX/UI Design",
                                        "Enterprise Architecture",
                                        "Scalable Cloud Solutions",
                                        "Long-Term Partnership",
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-4">
                                            <div className="rounded-xl bg-white p-2">
                                                <ShieldCheck className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <span className="text-lg font-medium text-white">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 rounded-2xl bg-white/10 p-6">
                                    <div className="grid grid-cols-2 gap-6 text-center">
                                        <div>
                                            <h4 className="text-4xl font-black text-white">98%</h4>
                                            <p className="mt-2 text-sm text-blue-100">Organization Satisfaction</p>
                                        </div>

                                        <div>
                                            <h4 className="text-4xl font-black text-white">50+</h4>
                                            <p className="mt-2 text-sm text-blue-100">Engagements Delivered</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}