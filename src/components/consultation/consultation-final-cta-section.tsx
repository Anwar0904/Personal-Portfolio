"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CalendarDays,
    Sparkles,
} from "lucide-react";

export default function ConsultationFinalCTASection() {
    return (
        <section className="relative overflow-hidden py-24 lg:py-32">
            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.18),transparent_35%)]" />

            <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="container relative z-10 mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-5xl text-center"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-xl">
                        <Sparkles
                            size={16}
                            className="text-yellow-300"
                        />

                        <span className="text-sm font-semibold text-white">
                            Ready When You Are
                        </span>
                    </div>

                    <h2 className="mt-8 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl xl:text-7xl">
                        Let's Turn Your Vision
                        <br />
                        Into Reality.
                    </h2>

                    <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-blue-100 md:text-xl">
                        Whether you're launching a startup,
                        modernizing an existing business,
                        or building a large-scale platform,
                        ADM is here to guide you from strategy
                        to successful delivery.
                    </p>

                    <div className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row">
                        <Link
                            href="#consultation-form"
                            className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-white/30"
                        >
                            <CalendarDays
                                size={22}
                            />

                            Book Free Consultation

                            <ArrowRight
                                size={20}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>

                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/20"
                        >
                            Explore Our Work
                        </Link>
                    </div>

                    {/* Trust Indicators */}

                    <div className="mt-16 grid gap-6 border-t border-white/15 pt-12 sm:grid-cols-3">
                        <div>
                            <h3 className="text-3xl font-black text-white">
                                50+
                            </h3>

                            <p className="mt-2 text-blue-100">
                                Successful Projects
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-black text-white">
                                98%
                            </h3>

                            <p className="mt-2 text-blue-100">
                                Organization Satisfaction
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-black text-white">
                                24h
                            </h3>

                            <p className="mt-2 text-blue-100">
                                Average Response Time
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}