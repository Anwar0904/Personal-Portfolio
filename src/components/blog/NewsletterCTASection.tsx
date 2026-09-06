"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    Mail,
    Sparkles,
    CheckCircle2,
    Bell,
} from "lucide-react";

export default function NewsletterCTASection() {
    return (
        <section className="relative overflow-hidden py-16 lg:py-20">
            {/* Background */}

            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />

                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-500/15 blur-[140px]" />

                <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-[140px]" />
            </div>

            <div className="container relative mx-auto px-4 lg:px-8">
                <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/70 shadow-[0_25px_80px_rgba(0,0,0,.25)] backdrop-blur-sm">

                    <div className="grid items-center gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">

                        {/* Left */}

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-200 sm:text-xs">
                                <Sparkles size={12} />
                                Weekly ADM Digest
                            </span>

                            <h2 className="mt-5 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                                Stay Ahead of
                                <span className="block text-blue-200">
                                    Technology.
                                </span>
                            </h2>

                            <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
                                Join thousands of developers, founders and
                                business leaders receiving carefully curated AI,
                                software engineering and digital transformation
                                insights every week.
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">

                                <div className="flex items-center gap-2 text-sm text-white">
                                    <CheckCircle2
                                        className="text-cyan-300"
                                        size={16}
                                    />
                                    No Spam Ever
                                </div>

                                <div className="flex items-center gap-2 text-sm text-white">
                                    <CheckCircle2
                                        className="text-cyan-300"
                                        size={16}
                                    />
                                    Weekly Insights
                                </div>

                                <div className="flex items-center gap-2 text-sm text-white">
                                    <CheckCircle2
                                        className="text-cyan-300"
                                        size={16}
                                    />
                                    Exclusive Guides
                                </div>

                                <div className="flex items-center gap-2 text-sm text-white">
                                    <CheckCircle2
                                        className="text-cyan-300"
                                        size={16}
                                    />
                                    Unsubscribe Anytime
                                </div>

                            </div>
                        </motion.div>

                        {/* Right */}

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-xl sm:p-6">

                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                                    <Mail
                                        size={24}
                                        className="text-blue-600"
                                    />
                                </div>

                                <h3 className="text-2xl font-black text-slate-900">
                                    Subscribe Free
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Get the latest articles directly in your inbox.
                                </p>

                                <form className="mt-6 space-y-3">

                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-blue-600"
                                    />

                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-blue-600"
                                    />

                                    <button
                                        type="submit"
                                        className="group flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Subscribe Now

                                        <ArrowRight
                                            size={16}
                                            className="ml-2 transition group-hover:translate-x-1"
                                        />
                                    </button>

                                </form>

                                <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-slate-100 p-3">

                                    <Bell
                                        size={18}
                                        className="text-blue-600"
                                    />

                                    <p className="text-xs text-slate-600">
                                        12,000+ professionals already subscribed.
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