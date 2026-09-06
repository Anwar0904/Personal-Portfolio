"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    BookOpen,
    TrendingUp,
    Clock3,
    Sparkles,
} from "lucide-react";

import { blogPosts } from "@/lib/dummy/blog";

const featured = blogPosts.find((p) => p.featured) ?? blogPosts[0];

export default function BlogHeroSection() {
    return (
        <section className="relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0">
                <div className="absolute left-0 top-0 h-[550px] w-[550px] rounded-full bg-blue-500/15 blur-[150px]" />
                <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[150px]" />
            </div>

            <div className="container relative mx-auto px-4 pt-36 pb-24 lg:px-8 lg:pt-44 lg:pb-32">
                <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_.9fr]">
                    {/* LEFT */}

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
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                            <Sparkles size={15} />
                            ADM Insights
                        </span>

                        <h1 className="mt-8 text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl xl:text-7xl">
                            Ideas That
                            <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                                Build The Future
                            </span>
                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-300">
                            Explore expert articles on AI, software engineering, cloud computing,
                            design systems, blockchain and digital transformation written by the ADM team.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-5">
                            <Link
                                href="#latest"
                                className="group inline-flex items-center rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 hover:bg-blue-500"
                            >
                                Explore Articles
                                <ArrowRight className="ml-2 transition group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="#featured"
                                className="inline-flex items-center rounded-2xl border border-slate-700 bg-slate-900/60 px-8 py-4 font-semibold text-slate-100 transition hover:border-blue-400 hover:text-blue-200"
                            >
                                Featured Story
                            </Link>
                        </div>

                        {/* Stats */}

                        <div className="mt-16 grid grid-cols-3 gap-5">
                            {[
                                {
                                    icon: BookOpen,
                                    value: "120+",
                                    label: "Articles",
                                },
                                {
                                    icon: TrendingUp,
                                    value: "50K+",
                                    label: "Readers",
                                },
                                {
                                    icon: Clock3,
                                    value: "Weekly",
                                    label: "New Content",
                                },
                            ].map((item) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                        key={item.label}
                                        whileHover={{ y: -6 }}
                                        className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm transition-all hover:shadow-xl"
                                    >
                                        <Icon className="mb-4 text-cyan-300" size={28} />
                                        <h3 className="text-3xl font-black text-white">{item.value}</h3>
                                        <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* RIGHT */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            delay: 0.2,
                            duration: 0.7,
                        }}
                        className="relative"
                    >
                        <div className="group overflow-hidden rounded-[34px] border border-slate-800 bg-slate-900 shadow-[0_35px_90px_rgba(2,6,23,.55)]">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={featured.coverImage}
                                    alt={featured.title}
                                    fill
                                    priority
                                    className="object-cover transition duration-700 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />

                                <span className="absolute left-6 top-6 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                                    Featured
                                </span>
                            </div>

                            <div className="space-y-5 p-8">
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 font-semibold text-blue-200">
                                        {featured.category}
                                    </span>

                                    <span>{featured.readingTime} min read</span>
                                    <span>{featured.views.toLocaleString()} views</span>
                                </div>

                                <h2 className="text-3xl font-black leading-tight text-white">{featured.title}</h2>
                                <p className="leading-8 text-slate-300">{featured.excerpt}</p>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={featured.author.avatar}
                                            alt={featured.author.name}
                                            width={50}
                                            height={50}
                                            className="rounded-full object-cover"
                                        />

                                        <div>
                                            <h4 className="font-semibold text-white">{featured.author.name}</h4>
                                            <p className="text-sm text-slate-400">{featured.author.role}</p>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/blogs/${featured.slug}`}
                                        className="group inline-flex items-center font-semibold text-blue-300"
                                    >
                                        Read Story

                                        <ArrowRight
                                            size={18}
                                            className="ml-2 transition group-hover:translate-x-1"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}

                        <motion.div
                            animate={{
                                y: [0, -12, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 4,
                            }}
                            className="absolute -right-6 -top-6 hidden rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-xl lg:block"
                        >
                            <TrendingUp className="mb-2 text-cyan-300" size={26} />
                            <h3 className="text-xl font-black text-white">Trending</h3>
                            <p className="text-sm text-slate-400">Updated Weekly</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}