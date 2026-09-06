"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    TrendingUp,
} from "lucide-react";

export default function FeaturedSuccessStory() {
    return (
        <section className="bg-slate-50 py-24">
            <div className="container mx-auto max-w-7xl px-4 lg:px-8">
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
                        duration: .6,
                    }}
                    className="overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-xl"
                >
                    <div className="grid lg:grid-cols-2">
                        {/* Image */}

                        <div className="relative min-h-[350px] lg:min-h-[620px]">
                            <Image
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
                                alt="Client Success"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Content */}

                        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                            <span className="inline-flex w-fit rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                                Featured Success Story
                            </span>

                            <h2 className="mt-6 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                                AI Powered Digital
                                Transformation for
                                a Growing Business
                            </h2>

                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                ADM partnered with a fast-growing
                                enterprise to modernize their
                                infrastructure, automate business
                                operations, and develop scalable AI
                                solutions that significantly improved
                                productivity and customer experience.
                            </p>

                            {/* Results */}

                            <div className="mt-10 grid gap-5 sm:grid-cols-2">
                                <div className="rounded-2xl bg-slate-50 p-5">
                                    <TrendingUp className="mb-3 text-blue-600" />

                                    <h3 className="text-3xl font-black text-slate-900">
                                        +220%
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-600">
                                        Increase in
                                        operational
                                        efficiency
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-5">
                                    <CalendarDays className="mb-3 text-blue-600" />

                                    <h3 className="text-3xl font-black text-slate-900">
                                        6 Months
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-600">
                                        Complete
                                        delivery
                                        timeline
                                    </p>
                                </div>
                            </div>

                            {/* Achievements */}

                            <div className="mt-10 space-y-4">
                                {[
                                    "Custom enterprise platform",
                                    "Cloud infrastructure migration",
                                    "AI-powered workflow automation",
                                    "Long-term maintenance & support",
                                ].map(
                                    (
                                        item
                                    ) => (
                                        <div
                                            key={
                                                item
                                            }
                                            className="flex items-center gap-3"
                                        >
                                            <CheckCircle2
                                                size={
                                                    20
                                                }
                                                className="text-blue-600"
                                            />

                                            <span className="font-medium text-slate-700">
                                                {
                                                    item
                                                }
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>

                            <Link
                                href="/portfolio"
                                className="mt-12 inline-flex w-fit items-center gap-3 rounded-full bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
                            >
                                View More Selected Work

                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}