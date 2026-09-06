"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Clock3,
    Eye,
    CalendarDays,
    Sparkles,
} from "lucide-react";

import { fetchPublicBlogs } from "@/lib/api/blog";

export default function FeaturedArticlesSection() {
    const [blogPosts, setBlogPosts] = useState<Awaited<ReturnType<typeof fetchPublicBlogs>>>([]);

    useEffect(() => {
        fetchPublicBlogs("limit=100").then(setBlogPosts).catch(() => setBlogPosts([]));
    }, []);

    const featured = blogPosts.filter((post) => post.featured);
    const secondary = blogPosts.filter((post) => !post.featured).slice(0, 3);

    return (
        <section
            id="featured"
            className="relative overflow-hidden bg-slate-950 py-24 lg:py-32"
        >
            <div className="absolute inset-0">
                <div className="absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[140px]" />
            </div>

            <div className="container relative mx-auto px-4 lg:px-8">

                {/* Heading */}

                <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                            <Sparkles size={15} />
                            Editor&apos;s Choice
                        </span>

                        <h2 className="mt-6 text-4xl font-black text-white lg:text-6xl">
                            Featured
                            <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                                Stories
                            </span>
                        </h2>

                        <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-300">
                            Carefully selected articles that showcase the latest technologies,
                            strategies and insights shaping the digital future.
                        </p>
                    </div>

                    <Link
                        href="/blogs"
                        className="group inline-flex items-center font-semibold text-blue-300"
                    >
                        View all articles

                        <ArrowRight
                            size={18}
                            className="ml-2 transition group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* Layout */}

                <div className="grid gap-8 xl:grid-cols-[1.45fr_.75fr]">

                    {/* Main Featured */}

                    <div className="space-y-8">
                        {featured.map((article) => (
                            <motion.article
                                key={article.id}
                                whileHover={{ y: -8 }}
                                className="group overflow-hidden rounded-[34px] border border-slate-800 bg-slate-900/80 shadow-sm transition-all hover:shadow-2xl"
                            >
                                <div className="relative aspect-[16/9] overflow-hidden">

                                    <Image
                                        src={article.coverImage}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />

                                    <span className="absolute left-6 top-6 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                                        Featured
                                    </span>
                                </div>

                                <div className="p-8 lg:p-10">

                                    <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
                                        <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 font-semibold text-blue-200">
                                            {article.category}
                                        </span>

                                        <span className="flex items-center gap-2">
                                            <Clock3 size={15} />
                                            {article.readingTime} min
                                        </span>

                                        <span className="flex items-center gap-2">
                                            <Eye size={15} />
                                            {article.views.toLocaleString()}
                                        </span>

                                        <span className="flex items-center gap-2">
                                            <CalendarDays size={15} />
                                            {new Date(article.publishedAt).toLocaleDateString()}
                                        </span>

                                    </div>

                                    <h3 className="mt-7 text-3xl font-black leading-tight text-white lg:text-5xl">
                                        {article.title}
                                    </h3>

                                    <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
                                        {article.excerpt}
                                    </p>

                                    <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-8">

                                        <div className="flex items-center gap-4">

                                            <Image
                                                src={article.author.avatar}
                                                alt={article.author.name}
                                                width={56}
                                                height={56}
                                                className="rounded-full"
                                            />

                                            <div>
                                                <h4 className="font-bold text-white">{article.author.name}</h4>
                                                <p className="text-sm text-slate-400">{article.author.role}</p>
                                            </div>

                                        </div>

                                        <Link
                                            href={`/blogs/${article.slug}`}
                                            className="group inline-flex items-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            Read Article

                                            <ArrowRight
                                                size={18}
                                                className="ml-2 transition group-hover:translate-x-1"
                                            />
                                        </Link>

                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {/* Side Articles */}

                    <div className="space-y-6">

                        {secondary.map((article) => (
                            <motion.article
                                key={article.id}
                                whileHover={{ x: 8 }}
                                className="group flex gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-xl"
                            >
                                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl">

                                    <Image
                                        src={article.coverImage}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition duration-500 group-hover:scale-110"
                                    />

                                </div>

                                <div className="flex flex-1 flex-col">

                                    <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                                        {article.category}
                                    </span>

                                    <h4 className="line-clamp-2 text-lg font-bold text-slate-900">
                                        {article.title}
                                    </h4>

                                    <div className="mt-auto flex items-center justify-between pt-5 text-sm text-slate-500">

                                        <span>{article.readingTime} min</span>

                                        <Link
                                            href={`/blogs/${article.slug}`}
                                            className="font-semibold text-blue-600"
                                        >
                                            Read →
                                        </Link>

                                    </div>

                                </div>
                            </motion.article>
                        ))}

                    </div>

                </div>
            </div>
        </section>
    );
}