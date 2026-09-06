"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Globe,
    Award,
    BookOpen,
    Users,
} from "lucide-react";

import { FaLinkedin, FaTwitter } from "react-icons/fa";
const authors = [
    {
        id: 1,
        name: "Muhammad Ahmed",
        role: "AI Engineer",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
        bio: "Writes about Generative AI, LLMs, AI Agents and Machine Learning in production.",
        articles: 46,
        readers: "18K",
        expertise: ["LLMs", "AI", "Python"],
    },
    {
        id: 2,
        name: "Sarah Wilson",
        role: "Senior UI/UX Designer",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
        bio: "Passionate about Design Systems, UX Psychology and Product Design.",
        articles: 31,
        readers: "12K",
        expertise: ["UI", "UX", "Figma"],
    },
    {
        id: 3,
        name: "David Kim",
        role: "Cloud Architect",
        avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
        bio: "Helping startups build scalable cloud infrastructure and DevOps pipelines.",
        articles: 27,
        readers: "10K",
        expertise: ["AWS", "Docker", "Kubernetes"],
    },
];

export default function AuthorSpotlightSection() {
    return (
        <section className="relative overflow-hidden py-24 lg:py-32">
            {/* Background */}

            <div className="absolute inset-0 -z-10">
                <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-blue-500/5 blur-[150px]" />
                <div className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                {/* Heading */}

                <div className="mx-auto mb-20 max-w-3xl text-center">
                    <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                        Meet The Writers
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-slate-900 lg:text-6xl">
                        Author
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Spotlight
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-9 text-slate-600">
                        Industry experts sharing practical knowledge, real-world
                        experience and the latest technology insights.
                    </p>
                </div>

                {/* Featured Author */}

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-xl"
                >
                    <div className="grid lg:grid-cols-[360px_1fr]">
                        {/* Image */}

                        <div className="relative min-h-[420px]">
                            <Image
                                src={authors[0].avatar}
                                alt={authors[0].name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Content */}

                        <div className="flex flex-col justify-center p-10 lg:p-16">
                            <span className="mb-5 inline-flex w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                                Featured Author
                            </span>

                            <h3 className="text-4xl font-black text-slate-900">
                                {authors[0].name}
                            </h3>

                            <p className="mt-2 text-blue-600 font-semibold">
                                {authors[0].role}
                            </p>

                            <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-600">
                                {authors[0].bio}
                            </p>

                            <div className="mt-10 grid gap-6 sm:grid-cols-3">
                                <div>
                                    <BookOpen className="mb-3 text-blue-600" />
                                    <h4 className="text-3xl font-black">
                                        {authors[0].articles}
                                    </h4>
                                    <p className="text-slate-500">
                                        Articles
                                    </p>
                                </div>

                                <div>
                                    <Users className="mb-3 text-blue-600" />
                                    <h4 className="text-3xl font-black">
                                        {authors[0].readers}
                                    </h4>
                                    <p className="text-slate-500">
                                        Readers
                                    </p>
                                </div>

                                <div>
                                    <Award className="mb-3 text-blue-600" />
                                    <h4 className="text-3xl font-black">
                                        5+
                                    </h4>
                                    <p className="text-slate-500">
                                        Years Experience
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-3">
                                {authors[0].expertise.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-10 flex items-center gap-5">
                                <div className="rounded-full bg-slate-100 p-3 text-blue-600">
                                    <FaLinkedin size={18} />
                                </div>

                                <div className="rounded-full bg-slate-100 p-3 text-blue-600">
                                    <FaTwitter size={18} />
                                </div>

                                <div className="rounded-full bg-slate-100 p-3 text-blue-600">
                                    <Globe size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Other Authors */}

                <div className="mt-14 grid gap-8 md:grid-cols-2">
                    {authors.slice(1).map((author, index) => (
                        <motion.div
                            key={author.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.15,
                            }}
                            whileHover={{
                                y: -8,
                            }}
                            className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
                        >
                            <div className="flex items-center gap-5">
                                <Image
                                    src={author.avatar}
                                    alt={author.name}
                                    width={90}
                                    height={90}
                                    className="rounded-full object-cover"
                                />

                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">
                                        {author.name}
                                    </h3>

                                    <p className="text-blue-600 font-medium">
                                        {author.role}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-6 leading-8 text-slate-600">
                                {author.bio}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-2">
                                {author.expertise.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                                <div className="text-sm text-slate-500">
                                    {author.articles} Articles
                                </div>

                                <Link
                                    href="#"
                                    className="group inline-flex items-center font-semibold text-blue-600"
                                >
                                    View Profile

                                    <ArrowRight
                                        size={18}
                                        className="ml-2 transition group-hover:translate-x-1"
                                    />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}