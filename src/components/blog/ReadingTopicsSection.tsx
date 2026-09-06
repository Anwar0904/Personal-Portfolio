"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Code2,
    Cpu,
    Brain,
    Cloud,
    Shield,
    Database,
    Palette,
    Blocks,
    Smartphone,
} from "lucide-react";

const topics = [
    {
        title: "Artificial Intelligence",
        articles: 48,
        icon: Brain,
        color:
            "from-violet-500 to-fuchsia-500",
        bg: "bg-violet-50",
    },
    {
        title: "Digital Platforms & Engineering",
        articles: 96,
        icon: Code2,
        color:
            "from-blue-600 to-cyan-500",
        bg: "bg-blue-50",
    },
    {
        title: "Cloud Computing",
        articles: 32,
        icon: Cloud,
        color:
            "from-sky-500 to-blue-500",
        bg: "bg-sky-50",
    },
    {
        title: "Cyber Security",
        articles: 29,
        icon: Shield,
        color:
            "from-red-500 to-orange-500",
        bg: "bg-red-50",
    },
    {
        title: "UI / UX",
        articles: 37,
        icon: Palette,
        color:
            "from-pink-500 to-rose-500",
        bg: "bg-pink-50",
    },
    {
        title: "Blockchain",
        articles: 21,
        icon: Blocks,
        color:
            "from-indigo-500 to-blue-700",
        bg: "bg-indigo-50",
    },
    {
        title: "Databases",
        articles: 26,
        icon: Database,
        color:
            "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50",
    },
    {
        title: "Mobile Apps",
        articles: 41,
        icon: Smartphone,
        color:
            "from-amber-500 to-yellow-500",
        bg: "bg-amber-50",
    },
];

export default function ReadingTopicsSection() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[160px]" />

                <div className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                {/* Heading */}

                <div className="mx-auto mb-20 max-w-3xl text-center">
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        Explore by Category
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-white lg:text-6xl">
                        Reading
                        <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            Topics
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-9 text-slate-300">
                        Discover articles grouped by technologies and industries you&apos;re interested in.
                    </p>
                </div>

                {/* Grid */}

                <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
                    {topics.map((topic, index) => {
                        const Icon = topic.icon;

                        return (
                            <motion.div
                                key={topic.title}
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
                                    y: -10,
                                }}
                            >
                                <Link
                                    href={`/blogs?topic=${topic.title}`}
                                    className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-800 bg-slate-900/80 p-8 shadow-sm transition-all duration-500 hover:border-blue-400/50 hover:shadow-2xl"
                                >
                                    {/* Glow */}

                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 transition duration-500 group-hover:opacity-100`}
                                    />

                                    <div className="relative z-10">
                                        {/* Icon */}

                                        <div
                                            className={`flex h-20 w-20 items-center justify-center rounded-3xl ${topic.bg} transition-all duration-500 group-hover:bg-white`}
                                        >
                                            <Icon
                                                size={38}
                                                className="text-blue-600"
                                            />
                                        </div>

                                        <h3 className="mt-8 text-2xl font-black text-white transition group-hover:text-white">
                                            {topic.title}
                                        </h3>

                                        <p className="mt-3 text-slate-300 transition group-hover:text-white/90">
                                            {topic.articles} Articles
                                        </p>

                                        <div className="mt-10 inline-flex items-center font-semibold text-blue-300 transition group-hover:text-white">
                                            Explore

                                            <ArrowRight
                                                size={18}
                                                className="ml-2 transition group-hover:translate-x-1"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom */}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 rounded-[32px] border border-slate-800 bg-gradient-to-r from-slate-900 to-blue-950 p-10 lg:p-14"
                >
                    <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
                        <div className="flex items-center gap-5">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                                <Cpu size={38} />
                            </div>

                            <div>
                                <h3 className="text-3xl font-black text-white">300+ Expert Articles</h3>
                                <p className="mt-2 text-slate-300">New tutorials, guides and case studies every single week.</p>
                            </div>
                        </div>

                        <Link
                            href="/blogs"
                            className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Browse All Topics
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
