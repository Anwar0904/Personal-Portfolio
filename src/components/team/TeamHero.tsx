"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users2, Award, Globe2 } from "lucide-react";

export default function TeamHero() {
    return (
        <section className="relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
                <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
            </div>

            <div className="absolute inset-0 opacity-[0.04]">
                <div className="h-full w-full bg-[linear-gradient(to_right,#2563eb_1px,transparent_1px),linear-gradient(to_bottom,#2563eb_1px,transparent_1px)] bg-[size:70px_70px]" />
            </div>

            <div className="relative container mx-auto px-4 pb-24 pt-36 lg:px-8">
                <div className="grid items-center gap-20 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                            Meet The People Behind ADM
                        </span>

                        <h1 className="mt-8 text-5xl font-black leading-tight text-white md:text-6xl xl:text-7xl">
                            Building
                            <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                                Extraordinary
                            </span>
                            Digital Teams.
                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-300">
                            Designers, engineers, AI specialists, strategists and innovators working together to transform ambitious ideas into exceptional digital products.
                        </p>

                        <div className="mt-10 flex flex-col gap-5 sm:flex-row">
                            <Link
                                href="/consultation"
                                className="group inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
                            >
                                Work With Our People
                                <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="/portfolio"
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/60 px-8 py-4 font-semibold text-slate-100 transition-all hover:border-blue-500 hover:text-blue-300"
                            >
                                View Selected Work
                            </Link>
                        </div>

                        <div className="mt-16 grid grid-cols-3 gap-5">
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm"
                            >
                                <Users2 className="mb-5 h-9 w-9 text-cyan-300" />
                                <h3 className="text-4xl font-black text-white">35+</h3>
                                <p className="mt-2 text-sm text-slate-400">Experts</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -8 }}
                                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm"
                            >
                                <Award className="mb-5 h-9 w-9 text-cyan-300" />
                                <h3 className="text-4xl font-black text-white">50+</h3>
                                <p className="mt-2 text-sm text-slate-400">Engagements</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -8 }}
                                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm"
                            >
                                <Globe2 className="mb-5 h-9 w-9 text-indigo-300" />
                                <h3 className="text-4xl font-black text-white">12</h3>
                                <p className="mt-2 text-sm text-slate-400">Countries</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="overflow-hidden rounded-[36px] border border-slate-700 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-xl">
                            <Image
                                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80"
                                alt="ADM Team"
                                width={900}
                                height={900}
                                className="h-[620px] w-full rounded-[28px] object-cover"
                            />
                        </div>

                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute -bottom-10 left-6 rounded-3xl border border-slate-700 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl"
                        >
                            <div className="flex -space-x-3">
                                {[
                                    "https://randomuser.me/api/portraits/women/44.jpg",
                                    "https://randomuser.me/api/portraits/men/52.jpg",
                                    "https://randomuser.me/api/portraits/women/68.jpg",
                                    "https://randomuser.me/api/portraits/men/33.jpg",
                                ].map((img) => (
                                    <Image
                                        key={img}
                                        src={img}
                                        alt=""
                                        width={56}
                                        height={56}
                                        className="rounded-full border-4 border-white object-cover"
                                    />
                                ))}
                            </div>

                            <h4 className="mt-5 text-xl font-bold text-white">Collaboration First</h4>
                            <p className="mt-2 max-w-xs text-sm leading-7 text-slate-300">
                                Cross-functional teams delivering AI-first software, beautiful experiences and measurable business impact.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
