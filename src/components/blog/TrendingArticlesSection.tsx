"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Eye,
    Clock3,
    TrendingUp,
    Flame,
} from "lucide-react";

import { fetchPublicBlogs } from "@/lib/api/blog";

export default function TrendingArticlesSection() {
    const [blogPosts, setBlogPosts] = useState<Awaited<ReturnType<typeof fetchPublicBlogs>>>([]);

    useEffect(() => {
        fetchPublicBlogs("limit=100").then(setBlogPosts).catch(() => setBlogPosts([]));
    }, []);

    const trendingPosts = [...blogPosts].sort((a, b) => b.views - a.views).slice(0, 3);

    return (
        <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
            <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-[140px]" />

            <div className="container relative mx-auto px-4 lg:px-8">
                {/* Heading */}

                <div className="mb-16 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-5 py-2 text-sm font-semibold text-orange-200">
                            <Flame size={15} />
                            Trending This Week
                        </span>

                        <h2 className="mt-6 text-4xl font-black text-white lg:text-6xl">
                            Most Popular
                            <span className="block bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                                Articles
                            </span>
                        </h2>

                        <p className="mt-6 text-lg leading-9 text-slate-300">
                            The most-read insights from developers, founders, designers and business leaders.
                        </p>
                    </div>

                    <Link
                        href="/blogs"
                        className="group inline-flex items-center font-semibold text-blue-300"
                    >
                        Explore All

                        <ArrowRight
                            size={18}
                            className="ml-2 transition group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* Grid */}

                <div className="grid gap-8 lg:grid-cols-3">
                    {trendingPosts.map((article, index) => (
                        <motion.article
                            key={article.id}
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                delay: index * 0.12,
                            }}
                            whileHover={{
                                y: -10,
                            }}
                            className="group overflow-hidden rounded-[30px] border border-slate-800 bg-slate-900/80 shadow-sm transition-all hover:shadow-2xl"
                        >
                            {/* Image */}

                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Image
                                    src={article.coverImage}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition duration-700 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />

                                <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg font-black text-orange-600 shadow-lg">
                                    #{index + 1}
                                </div>

                                <span className="absolute bottom-5 left-5 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                                    Trending
                                </span>
                            </div>

                            {/* Content */}

                            <div className="space-y-5 p-7">
                                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                                    {article.category}
                                </span>

                                <h3 className="line-clamp-2 text-2xl font-black leading-tight text-white transition group-hover:text-blue-300">
                                    {article.title}
                                </h3>

                                <p className="line-clamp-3 leading-8 text-slate-300">{article.excerpt}</p>

                                {/* Stats */}

                                <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Eye size={15} />

                                            {article.views.toLocaleString()}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Clock3 size={15} />

                                            {article.readingTime} min read
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={article.author.avatar}
                                            alt={article.author.name}
                                            width={44}
                                            height={44}
                                            className="rounded-full"
                                        />

                                        <div>
                                            <h5 className="text-sm font-semibold text-white">{article.author.name}</h5>
                                            <p className="text-xs text-slate-400">{article.author.role}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/blogs/${article.slug}`}
                                    className="group/link inline-flex items-center font-semibold text-blue-600"
                                >
                                    Read Article

                                    <ArrowRight
                                        size={18}
                                        className="ml-2 transition group-hover/link:translate-x-1"
                                    />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Bottom Banner */}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 overflow-hidden rounded-[30px] bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 p-[1px]"
                >
                    <div className="flex flex-col items-center justify-between gap-8 rounded-[29px] bg-slate-950 px-8 py-8 text-center lg:flex-row lg:text-left">
                        <div className="flex items-center gap-5">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                                <TrendingUp
                                    size={30}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white">Stay Ahead of Technology</h3>
                                <p className="mt-2 text-slate-300">Fresh insights published every week by ADM experts.</p>
                            </div>
                        </div>

                        <Link
                            href="/blogs"
                            className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Browse Library
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}