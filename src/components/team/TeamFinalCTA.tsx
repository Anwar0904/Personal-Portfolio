"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    Sparkles,
} from "lucide-react";

export default function TeamFinalCTA() {
    return (
        <section className="relative overflow-hidden py-28">

            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,.12),transparent_35%)]" />

            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 80,
                    ease: "linear",
                }}
                className="absolute -left-60 -top-60 h-[700px] w-[700px] rounded-full border border-white/10"
            />

            <motion.div
                animate={{ rotate: -360 }}
                transition={{
                    repeat: Infinity,
                    duration: 120,
                    ease: "linear",
                }}
                className="absolute -bottom-72 -right-72 h-[800px] w-[800px] rounded-full border border-white/10"
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

                    <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-xl">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Join The Future Builders
                    </div>

                    <h2 className="mt-8 text-5xl font-black leading-tight text-white lg:text-7xl">
                        Great Products Are Built
                        <span className="block">
                            By Great People.
                        </span>
                    </h2>

                    <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-blue-100">
                        Whether you're looking for an experienced digital partner
                        or you're ready to become part of ADM, we'd love to start
                        a conversation.
                    </p>

                    {/* CTA */}

                    <div className="mt-14 flex flex-col justify-center gap-5 sm:flex-row">

                        <Link
                            href="/consultation"
                            className="group inline-flex items-center justify-center rounded-2xl bg-white px-8 py-5 text-lg font-bold text-blue-700 shadow-2xl transition-all hover:-translate-y-1 hover:scale-105"
                        >
                            <CalendarDays className="mr-3 h-6 w-6" />

                            Book Consultation

                            <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
                        </Link>

                        <Link
                            href="/careers"
                            className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-8 py-5 text-lg font-semibold text-white backdrop-blur-xl transition hover:bg-white/20"
                        >
                            <BriefcaseBusiness className="mr-3 h-6 w-6" />

                            Explore Careers
                        </Link>

                    </div>

                    {/* Bottom Cards */}

                    <div className="mt-20 grid gap-6 md:grid-cols-3">

                        {[
                            {
                                title: "35+ Experts",
                                text: "Designers, Engineers, AI Specialists & Strategists.",
                            },
                            {
                                title: "50+ Projects",
                                text: "Delivering world-class digital products globally.",
                            },
                            {
                                title: "People First",
                                text: "Collaboration, learning and innovation every day.",
                            },
                        ].map((item) => (
                            <motion.div
                                whileHover={{
                                    y: -10,
                                    scale: 1.03,
                                }}
                                key={item.title}
                                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl"
                            >
                                <h3 className="text-3xl font-black text-white">
                                    {item.title}
                                </h3>

                                <p className="mt-4 leading-8 text-blue-100">
                                    {item.text}
                                </p>
                            </motion.div>
                        ))}

                    </div>

                </motion.div>

            </div>

        </section>
    );
}