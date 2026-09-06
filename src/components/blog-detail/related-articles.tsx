"use client";

import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";

import {
    ArrowRight,
    CalendarDays,
    Clock3,
} from "lucide-react";

import type { BlogPost } from "@/lib/dummy/blog";

interface Props {
    blogs: BlogPost[];
}

export default function RelatedArticles({
    blogs,
}: Props) {
    return (
        <section className="bg-slate-950 py-16 lg:py-20">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mb-8 sm:mb-10">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300 sm:text-xs">Continue Reading</p>
                    <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Related Articles</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {blogs.map(
                        (
                            blog,
                            index
                        ) => (
                            <motion.article
                                key={blog.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group overflow-hidden rounded-[18px] border border-slate-800 bg-slate-900/80 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <Image
                                        src={blog.featuredImage}
                                        alt={blog.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        className="object-cover transition duration-700 group-hover:scale-110"
                                    />
                                </div>

                                <div className="p-4 sm:p-5">
                                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-blue-200 sm:text-[10px]">
                                        {blog.category}
                                    </span>

                                    <h3 className="mt-3 text-lg font-black leading-tight text-white sm:text-xl">{blog.title}</h3>
                                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-300 sm:text-sm">{blog.excerpt}</p>

                                    <div className="mt-4 flex items-center gap-3 text-[10px] text-slate-400 sm:text-xs">
                                        <span className="flex items-center gap-1.5">
                                            <CalendarDays size={12} />
                                            {blog.publishedAt}
                                        </span>

                                        <span className="flex items-center gap-1.5">
                                            <Clock3 size={12} />
                                            {blog.readingTime} min
                                        </span>
                                    </div>

                                    <Link
                                        href={`/blogs/${blog.slug}`}
                                        className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-300 sm:text-sm"
                                    >
                                        Read Article
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </motion.article>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}