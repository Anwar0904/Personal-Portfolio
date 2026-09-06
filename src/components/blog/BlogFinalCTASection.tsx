"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Sparkles,
    BookOpen,
    Mail,
} from "lucide-react";

export default function BlogFinalCTASection() {
    return (
        <section className="relative overflow-hidden py-16 lg:py-20">
            {/* Background */}

            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />

                <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-500/15 blur-[150px]" />

                <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[150px]" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            </div>

            <div className="container relative mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 50,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/70 p-5 shadow-[0_30px_80px_rgba(0,0,0,.25)] backdrop-blur-sm sm:p-8 lg:p-10"
                >
                    {/* Badge */}

                    <div className="flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-200 sm:text-xs">
                            <Sparkles size={12} />
                            Keep Learning With ADM
                        </span>
                    </div>

                    {/* Heading */}

                    <h2 className="mx-auto mt-5 max-w-3xl text-center text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                        Turn Knowledge Into
                        <span className="mt-1 block bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent">
                            Real Innovation.
                        </span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-slate-300 sm:text-base">
                        Discover expert insights, practical tutorials,
                        engineering guides and AI innovations that help you
                        build better products and grow your business faster.
                    </p>

                    {/* Features */}

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
                            <BookOpen
                                className="mx-auto mb-3 text-cyan-300"
                                size={24}
                            />

                            <h3 className="text-base font-bold text-white">
                                300+ Articles
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-slate-300">
                                Practical guides written by industry experts.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
                            <Sparkles
                                className="mx-auto mb-3 text-cyan-300"
                                size={24}
                            />

                            <h3 className="text-base font-bold text-white">
                                Weekly Insights
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-slate-300">
                                Fresh AI, Cloud and Software Engineering content.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
                            <Mail
                                className="mx-auto mb-3 text-cyan-300"
                                size={24}
                            />

                            <h3 className="text-base font-bold text-white">
                                Free Newsletter
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-slate-300">
                                Receive the latest articles directly in your inbox.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/contact"
                            className="group inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Work With ADM

                            <ArrowRight
                                size={16}
                                className="ml-2 transition group-hover:translate-x-1"
                            />
                        </Link>

                        <Link
                            href="/blogs"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                        >
                            Explore More Articles
                        </Link>
                    </div>

                    {/* Bottom */}

                    <div className="mt-8 border-t border-slate-700 pt-5 text-center">
                        <p className="text-xs text-slate-400 sm:text-sm">
                            Trusted by developers, founders and technology
                            leaders worldwide.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
