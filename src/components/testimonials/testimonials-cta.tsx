"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import {
    ArrowRight,
    CalendarCheck2,
    MessageCircleMore,
    Sparkles,
} from "lucide-react";

export default function TestimonialsCTA() {
    return (
        <section className="relative overflow-hidden bg-white py-24">
            {/* Background */}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,.08),transparent_40%)]" />

            <div className="container relative mx-auto max-w-7xl px-4 lg:px-8">
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
                    transition={{
                        duration: 0.6,
                    }}
                    className="overflow-hidden rounded-[42px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl"
                >
                    <div className="grid items-center gap-12 p-10 lg:grid-cols-[1fr_340px] lg:p-16">
                        {/* Left */}

                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-5 py-2 text-sm font-semibold text-blue-400">
                                <Sparkles size={16} />

                                Your Success Starts Here
                            </span>

                            <h2 className="mt-8 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Ready To Become
                                <span className="block text-blue-400">
                                    Our Next Success Story?
                                </span>
                            </h2>

                            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                                Join the businesses that trust ADM to
                                build innovative digital products,
                                scalable platforms, and AI-powered
                                solutions that create measurable
                                results.
                            </p>

                            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href="/consultation"
                                    className="inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
                                >
                                    <CalendarCheck2 size={20} />

                                    Book Free Consultation

                                    <ArrowRight size={18} />
                                </Link>

                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-600 bg-transparent px-8 py-4 font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-900"
                                >
                                    <MessageCircleMore size={20} />

                                    Talk To Our Team
                                </Link>
                            </div>
                        </div>

                        {/* Right */}

                        <div className="space-y-6">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                                <h3 className="text-5xl font-black text-white">
                                    98%
                                </h3>

                                <p className="mt-3 text-slate-300">
                                    Organization Satisfaction
                                </p>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                                <h3 className="text-5xl font-black text-white">
                                    100+
                                </h3>

                                <p className="mt-3 text-slate-300">
                                    Successfully Delivered Projects
                                </p>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                                <h3 className="text-5xl font-black text-white">
                                    24h
                                </h3>

                                <p className="mt-3 text-slate-300">
                                    Average Response Time
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}