"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    HelpCircle,
    ChevronRight,
    ArrowRight,
} from "lucide-react";

export default function FAQHero() {
    return (
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,.08),transparent_45%)]" />

            <div className="container relative mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40 lg:pb-28">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500"
                >
                    <Link
                        href="/"
                        className="hover:text-blue-600 transition"
                    >
                        Home
                    </Link>

                    <ChevronRight size={16} />

                    <span className="font-medium text-slate-900">
                        Frequently Asked Questions
                    </span>
                </motion.div>

                <div className="mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: .9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                    >
                        <HelpCircle size={42} />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: .1 }}
                        className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
                    >
                        Frequently Asked
                        <span className="block text-blue-600">
                            Questions
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: .2 }}
                        className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 lg:text-xl"
                    >
                        Find answers to the most common questions
                        about ADM, our capabilities, development
                        process, pricing, timelines, and support.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: .3 }}
                        className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Link
                            href="/consultation"
                            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Book Consultation
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
                        >
                            Talk to ADM
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}