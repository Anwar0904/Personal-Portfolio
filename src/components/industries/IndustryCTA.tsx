"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function IndustryCTA() {
    return (
        <section className="relative overflow-hidden py-28">

            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_35%)]" />

            <motion.div
                animate={{
                    rotate: 360,
                }}
                transition={{
                    repeat: Infinity,
                    duration: 60,
                    ease: "linear",
                }}
                className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full border border-white/10"
            />

            <motion.div
                animate={{
                    rotate: -360,
                }}
                transition={{
                    repeat: Infinity,
                    duration: 80,
                    ease: "linear",
                }}
                className="absolute -bottom-56 -right-40 h-[520px] w-[520px] rounded-full border border-white/10"
            />

            <div className="relative container mx-auto px-4 lg:px-8">

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
                    className="mx-auto max-w-5xl text-center"
                >

                    <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
                        Let's Build Something Extraordinary
                    </span>

                    <h2 className="mt-8 text-4xl font-black leading-tight text-white lg:text-6xl">
                        Ready To Transform
                        <span className="block">
                            Your Industry?
                        </span>
                    </h2>

                    <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-blue-100">
                        Whether you're building a next-generation startup,
                        modernizing enterprise software or integrating AI into
                        existing systems, ADM helps businesses create products that
                        stand out and scale confidently.
                    </p>

                    {/* CTA Buttons */}

                    <div className="mt-14 flex flex-col justify-center gap-5 sm:flex-row">

                        <Link
                            href="/consultation"
                            className="group inline-flex items-center justify-center rounded-2xl bg-white px-8 py-5 text-lg font-bold text-blue-700 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                        >
                            <CalendarDays className="mr-3 h-6 w-6" />

                            Book Free Consultation

                            <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-8 py-5 text-lg font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/20"
                        >
                            <MessageCircle className="mr-3 h-6 w-6" />

                            Talk To Our Experts
                        </Link>

                    </div>

                    {/* Metrics */}

                    <div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4">

                        {[
                            {
                                value: "50+",
                                label: "Engagements Delivered",
                            },
                            {
                                value: "98%",
                                label: "Organization Satisfaction",
                            },
                            {
                                value: "10+",
                                label: "Industries Served",
                            },
                            {
                                value: "24/7",
                                label: "Technical Support",
                            },
                        ].map((item) => (
                            <motion.div
                                whileHover={{
                                    y: -8,
                                    scale: 1.03,
                                }}
                                key={item.label}
                                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl"
                            >
                                <h3 className="text-4xl font-black text-white">
                                    {item.value}
                                </h3>

                                <p className="mt-3 text-sm font-medium text-blue-100">
                                    {item.label}
                                </p>
                            </motion.div>
                        ))}

                    </div>

                </motion.div>

            </div>

        </section>
    );
}