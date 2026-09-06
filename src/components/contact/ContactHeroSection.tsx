"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CalendarCheck2,
    MessageSquare,
    Sparkles,
} from "lucide-react";

export default function ContactHeroSection() {
    return (
        <section className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
            {/* Background */}

            <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />

            <div className="absolute inset-0 -z-10">
                <div className="absolute left-0 top-0 h-[550px] w-[550px] rounded-full bg-blue-600/20 blur-[170px]" />

                <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[170px]" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid items-center gap-20 lg:grid-cols-2">
                    {/* Left */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 40,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.7,
                        }}
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold text-cyan-200 backdrop-blur-xl">
                            <Sparkles size={16} />
                            Let's Build Something Amazing
                        </span>

                        <h1 className="mt-8 text-5xl font-black leading-tight text-white lg:text-7xl">
                            Start Your
                            <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent">
                                Digital Journey
                            </span>
                        </h1>

                        <p className="mt-8 max-w-2xl text-xl leading-10 text-slate-300">
                            Whether you're building an AI platform,
                            launching a startup, modernizing enterprise
                            software or transforming your digital presence,
                            our experts are ready to help.
                        </p>

                        <div className="mt-12 flex flex-col gap-5 sm:flex-row">
                            <Link
                                href="#contact-form"
                                className="group inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-blue-700"
                            >
                                Start Your Project

                                <ArrowRight
                                    size={18}
                                    className="ml-3 transition group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                href="/services"
                                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20"
                            >
                                Explore Services
                            </Link>
                        </div>

                        {/* Stats */}

                        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
                            <div>
                                <h3 className="text-4xl font-black text-white">
                                    50+
                                </h3>

                                <p className="mt-2 text-slate-400">
                                    Projects
                                </p>
                            </div>

                            <div>
                                <h3 className="text-4xl font-black text-white">
                                    98%
                                </h3>

                                <p className="mt-2 text-slate-400">
                                    Success
                                </p>
                            </div>

                            <div>
                                <h3 className="text-4xl font-black text-white">
                                    24h
                                </h3>

                                <p className="mt-2 text-slate-400">
                                    Response
                                </p>
                            </div>

                            <div>
                                <h3 className="text-4xl font-black text-white">
                                    100%
                                </h3>

                                <p className="mt-2 text-slate-400">
                                    Dedicated
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 40,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.8,
                        }}
                        className="relative"
                    >
                        <div className="rounded-[36px] border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,.35)]">
                            <div className="rounded-3xl border border-slate-700 bg-slate-950 p-8 shadow-xl">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/15">
                                    <CalendarCheck2 size={32} className="text-cyan-300" />
                                </div>

                                <h3 className="mt-6 text-3xl font-black text-white">Free Strategy Call</h3>

                                <p className="mt-4 leading-8 text-slate-300">
                                    Schedule a free consultation with our experts to discuss your business goals,
                                    technical challenges and project vision.
                                </p>

                                <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                                            <MessageSquare size={22} />
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-white">Average Response Time</h4>
                                            <p className="text-sm text-slate-400">Less than 24 hours</p>
                                        </div>
                                    </div>
                                </div>

                                <Link href="#contact-form" className="mt-8 flex w-full items-center justify-center rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-500">
                                    Book Consultation
                                </Link>
                            </div>

                            {/* Floating Card */}

                            <motion.div
                                animate={{
                                    y: [0, -12, 0],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                }}
                                className="absolute -left-8 -bottom-8 hidden rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-2xl lg:block"
                            >
                                <p className="text-sm text-cyan-200">
                                    Trusted by startups,
                                    enterprises & innovators
                                </p>

                                <h3 className="mt-2 text-3xl font-black text-white">
                                    50+
                                </h3>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}