"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    CalendarDays,
    Clock3,
    Eye,
    ChevronRight,
    ArrowLeft,
} from "lucide-react";

import type { BlogPost } from "@/lib/dummy/blog";

interface Props {
    blog: BlogPost;
}

export default function BlogHero({
    blog,
}: Props) {
    return (
        <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,.12),transparent_35%)]" />

            <div className="container relative mx-auto max-w-7xl px-4 pb-8 pt-18 sm:px-6 lg:px-8 lg:pb-14 lg:pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex flex-wrap items-center gap-2 text-[10px] text-slate-400 sm:text-xs"
                >
                    <Link href="/" className="transition hover:text-blue-300">Home</Link>
                    <ChevronRight size={12} />
                    <Link href="/blogs" className="transition hover:text-blue-300">Insights</Link>
                    <ChevronRight size={12} />
                    <span className="max-w-[13rem] truncate font-medium text-white">{blog.title}</span>
                </motion.div>

                <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-10">
                    {/* Content */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 35,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: .6,
                        }}
                    >
                        <Link
                            href="/blogs"
                            className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1.5 text-[10px] font-medium text-slate-200 transition hover:border-blue-400 hover:text-blue-200 sm:text-xs"
                        >
                            <ArrowLeft size={13} />
                            Back to Blogs
                        </Link>

                        <div className="mb-4 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-200 sm:text-xs">
                            {blog.category}
                        </div>

                        <h1 className="max-w-4xl text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl xl:text-[2.7rem]">
                            {blog.title}
                        </h1>

                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
                            {blog.excerpt}
                        </p>

                        {/* Meta */}

                        <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-5">
                            <div className="flex items-center gap-3 sm:gap-3">
                                <Image
                                    src={blog.author.avatar}
                                    alt={blog.author.name}
                                    width={38}
                                    height={38}
                                    className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
                                />

                                <div>
                                    <p className="text-xs font-bold text-white sm:text-sm">{blog.author.name}</p>
                                    <p className="text-[10px] text-slate-400 sm:text-xs">{blog.author.role}</p>
                                </div>
                            </div>

                            <div className="hidden h-8 w-px bg-slate-700 lg:block" />

                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 sm:gap-4 sm:text-xs">
                                <div className="flex items-center gap-1.5">
                                    <CalendarDays size={12} />
                                    {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Clock3 size={12} />
                                    {blog.readingTime} min read
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Eye size={12} />
                                    {blog.views.toLocaleString()} views
                                </div>
                            </div>
                        </div>

                        {/* Tags */}

                        <div className="mt-6 flex flex-wrap gap-2 sm:gap-2.5">
                            {blog.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[10px] font-medium text-slate-200 transition hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-200 sm:text-xs"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Featured Image */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: .96,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: .7,
                        }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-blue-500/15 to-cyan-400/15 blur-3xl" />

                        <div className="relative overflow-hidden rounded-[18px] border border-slate-700 bg-slate-900 shadow-xl sm:rounded-[22px]">
                            <Image
                                src={blog.featuredImage}
                                alt={blog.title}
                                width={820}
                                height={620}
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="aspect-[16/11] h-full w-full object-cover transition duration-700 hover:scale-105"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}