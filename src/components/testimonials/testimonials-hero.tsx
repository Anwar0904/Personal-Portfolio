"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ChevronRight,
    ArrowRight,
    Star,
    Quote,
} from "lucide-react";

export default function TestimonialsHero() {
    return (
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,.08),transparent_45%)]" />

            <div className="container relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
                {/* Breadcrumb */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500"
                >
                    <Link
                        href="/"
                        className="transition hover:text-blue-600"
                    >
                        Home
                    </Link>

                    <ChevronRight size={16} />

                    <span className="font-medium text-slate-900">
                        Testimonials
                    </span>
                </motion.div>

                <div className="mx-auto max-w-5xl text-center">
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: .9,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                    >
                        <Quote size={42} />
                    </motion.div>

                    <motion.h1
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: .1,
                        }}
                        className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl"
                    >
                        Trusted by
                        <span className="block text-blue-600">
                            Businesses Worldwide
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: .2,
                        }}
                        className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 lg:text-xl"
                    >
                        Real partnerships.
                        Real success stories.
                        Discover how ADM helps organizations
                        transform ideas into reliable,
                        scalable digital products.
                    </motion.p>

                    {/* Stats */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: .3,
                        }}
                        className="mt-12 flex flex-wrap items-center justify-center gap-8 rounded-3xl border border-slate-200 bg-slate-50 px-8 py-6"
                    >
                        <div>
                            <div className="flex items-center justify-center gap-1 text-amber-500">
                                {Array.from({
                                    length: 5,
                                }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill="currentColor"
                                    />
                                ))}
                            </div>

                            <p className="mt-2 text-2xl font-black text-slate-900">
                                5.0/5
                            </p>

                            <span className="text-sm text-slate-500">
                                Average Rating
                            </span>
                        </div>

                        <div className="hidden h-12 w-px bg-slate-300 lg:block" />

                        <div>
                            <p className="text-2xl font-black text-slate-900">
                                100+
                            </p>

                            <span className="text-sm text-slate-500">
                                Successful Projects
                            </span>
                        </div>

                        <div className="hidden h-12 w-px bg-slate-300 lg:block" />

                        <div>
                            <p className="text-2xl font-black text-slate-900">
                                98%
                            </p>

                            <span className="text-sm text-slate-500">
                                Organization Satisfaction
                            </span>
                        </div>
                    </motion.div>

                    {/* CTA */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: .4,
                        }}
                        className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Link
                            href="/consultation"
                            className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Start Your Project

                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
                        >
                            View Portfolio
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}