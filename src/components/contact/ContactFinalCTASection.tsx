"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CalendarDays,
    Sparkles,
    MessageCircle,
    Rocket,
} from "lucide-react";

export default function ContactFinalCTASection() {
    return (
        <section className="relative overflow-hidden py-24 lg:py-32">
            {/* Background */}

            <div className="absolute inset-0 -z-20 bg-slate-950" />

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,.22),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,.20),transparent_35%)]" />

            <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[180px]" />

            <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[180px]" />

            <div className="container mx-auto px-4 lg:px-8">
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
                    className="relative overflow-hidden rounded-[42px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl lg:p-16"
                >
                    {/* Floating Decorations */}

                    <Sparkles className="absolute left-10 top-10 h-8 w-8 text-cyan-300/30" />

                    <Rocket className="absolute bottom-10 right-10 h-10 w-10 text-blue-300/30" />

                    {/* Content */}

                    <div className="mx-auto max-w-4xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300">
                            <Sparkles size={16} />
                            Your Next Big Idea Starts Here
                        </span>

                        <h2 className="mt-8 text-4xl font-black leading-tight text-white lg:text-7xl">
                            Let's Build
                            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                                Something Extraordinary
                            </span>
                        </h2>

                        <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-slate-300">
                            Whether you're launching a startup, transforming an
                            enterprise, or bringing an innovative AI product to
                            life, ADM is ready to become your long-term
                            technology partner.
                        </p>

                        {/* Stats */}

                        <div className="mt-14 grid gap-8 sm:grid-cols-3">
                            {[
                                {
                                    value: "<24 Hours",
                                    label: "Response Time",
                                },
                                {
                                    value: "100%",
                                    label: "Free Consultation",
                                },
                                {
                                    value: "∞",
                                    label: "Long-Term Partnership",
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-3xl border border-white/10 bg-white/5 p-6"
                                >
                                    <h3 className="text-3xl font-black text-white">
                                        {item.value}
                                    </h3>

                                    <p className="mt-3 text-slate-400">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}

                        <div className="mt-16 flex flex-col items-center justify-center gap-5 sm:flex-row">
                            <Link
                                href="#contact-form"
                                className="group inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-9 py-5 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-600/30"
                            >
                                <MessageCircle
                                    size={20}
                                    className="mr-3"
                                />

                                Start Your Project

                                <ArrowRight
                                    size={20}
                                    className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                href="#location"
                                className="inline-flex items-center rounded-2xl border border-white/20 bg-white/5 px-9 py-5 text-lg font-semibold text-white backdrop-blur transition hover:border-cyan-400 hover:bg-white/10"
                            >
                                <CalendarDays
                                    size={20}
                                    className="mr-3"
                                />

                                Schedule Consultation
                            </Link>
                        </div>

                        {/* Bottom Trust Line */}

                        <div className="mt-16 border-t border-white/10 pt-8">
                            <p className="text-sm tracking-wide text-slate-400">
                                Trusted by startups, growing businesses and
                                enterprises • AI • Web • Cloud • Blockchain •
                                Digital Transformation
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}