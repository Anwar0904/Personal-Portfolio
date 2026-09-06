"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CalendarDays,
    Clock3,
    Eye,
    ChevronRight,
} from "lucide-react";

import { fetchPublicBlogs } from "@/lib/api/blog";

const PAGE_SIZE = 6;

export default function LatestArticlesSection() {
    const [blogPosts, setBlogPosts] = useState<Awaited<ReturnType<typeof fetchPublicBlogs>>>([]);
    const [visible, setVisible] = useState(PAGE_SIZE);

    useEffect(() => {
        fetchPublicBlogs("limit=100").then(setBlogPosts).catch(() => setBlogPosts([]));
    }, []);

    const articles = useMemo(
        () =>
            [...blogPosts].sort(
                (a, b) =>
                    new Date(b.publishedAt).getTime() -
                    new Date(a.publishedAt).getTime()
            ),
        [blogPosts]
    );

    const displayed = articles.slice(0, visible);

    return (
        <section
            id="latest"
            className="relative overflow-hidden bg-slate-950 py-24 lg:py-32"
        >
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-0 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-500/5 blur-[140px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                {/* Heading */}

                <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                            Latest Insights
                        </span>

                        <h2 className="mt-6 text-4xl font-black text-white lg:text-6xl">
                            Fresh Articles &
                            <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                                Industry Insights
                            </span>
                        </h2>

                        <p className="mt-6 text-lg leading-9 text-slate-300">
                            Weekly insights covering Artificial Intelligence, Digital Platforms,
                            Cloud, UI/UX, Blockchain, Business and Digital Transformation.
                        </p>
                    </div>

                    <Link
                        href="/blogs"
                        className="group inline-flex items-center font-semibold text-blue-300"
                    >
                        Browse Archive

                        <ArrowRight
                            size={18}
                            className="ml-2 transition group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* Grid */}

                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {displayed.map((article, index) => (
                        <motion.article
                            key={article.id}
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
                                delay: index * 0.08,
                            }}
                            whileHover={{
                                y: -8,
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

                                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-900 backdrop-blur">
                                    {article.category}
                                </span>
                            </div>

                            {/* Body */}

                            <div className="flex h-full flex-col p-7">
                                <div className="mb-5 flex flex-wrap gap-3">
                                    {article.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="line-clamp-2 text-2xl font-black leading-tight text-white transition group-hover:text-blue-300">
                                    {article.title}
                                </h3>

                                <p className="mt-5 line-clamp-3 leading-8 text-slate-300">
                                    {article.excerpt}
                                </p>

                                {/* Stats */}

                                <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500">
                                    <span className="flex items-center gap-2">
                                        <CalendarDays size={15} />

                                        {new Date(
                                            article.publishedAt
                                        ).toLocaleDateString()}
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <Clock3 size={15} />

                                        {article.readingTime} min
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <Eye size={15} />

                                        {article.views.toLocaleString()}
                                    </span>
                                </div>

                                {/* Footer */}

                                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-7">
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={article.author.avatar}
                                            alt={article.author.name}
                                            width={46}
                                            height={46}
                                            className="rounded-full"
                                        />

                                        <div>
                                            <h5 className="text-sm font-bold text-white">{article.author.name}</h5>
                                            <p className="text-xs text-slate-400">{article.author.role}</p>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/blogs/${article.slug}`}
                                        className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                    >
                                        <ChevronRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Load More */}

                {visible < articles.length && (
                    <div className="mt-20 flex justify-center">
                        <button
                            onClick={() =>
                                setVisible((prev) => prev + PAGE_SIZE)
                            }
                            className="rounded-2xl bg-blue-600 px-10 py-4 font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-700"
                        >
                            Load More Articles
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}