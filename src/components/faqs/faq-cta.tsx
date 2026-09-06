"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CalendarDays,
    MessageCircle,
} from "lucide-react";

export default function FAQCTA() {
    return (
        <section className="relative overflow-hidden bg-white py-24">
            {/* Background */}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,.08),transparent_45%)]" />

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
                    className="overflow-hidden rounded-[40px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 shadow-2xl lg:p-16"
                >
                    <div className="grid items-center gap-12 lg:grid-cols-[1fr_320px]">
                        {/* Left */}

                        <div>
                            <span className="inline-flex rounded-full bg-blue-500/15 px-5 py-2 text-sm font-semibold text-blue-400">
                                Still Have Questions?
                            </span>

                            <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                                Let's Discuss Your
                                <span className="block text-blue-400">
                                    Project Together
                                </span>
                            </h2>

                            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                                Didn't find the answer you were looking for?
                                Schedule a free consultation with our experts
                                or send us your requirements and we'll respond
                                within one business day.
                            </p>

                            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href="/consultation"
                                    className="inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
                                >
                                    <CalendarDays size={20} />

                                    Book Free Consultation

                                    <ArrowRight size={18} />
                                </Link>

                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-600 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-900"
                                >
                                    <MessageCircle size={20} />

                                    Talk to ADM
                                </Link>
                            </div>
                        </div>

                        {/* Right */}

                        <div className="grid gap-5">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                                <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
                                    Response Time
                                </p>

                                <h3 className="mt-3 text-4xl font-black text-white">
                                    &lt; 24 Hours
                                </h3>

                                <p className="mt-2 text-slate-400">
                                    Average business response.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                                <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
                                    Consultation
                                </p>

                                <h3 className="mt-3 text-4xl font-black text-white">
                                    100% Free
                                </h3>

                                <p className="mt-2 text-slate-400">
                                    No obligations. Just expert advice.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}