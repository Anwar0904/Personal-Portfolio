"use client";

import Image from "next/image";
import { motion } from "framer-motion";



import { FaLinkedin, FaTwitter } from "react-icons/fa";

import type { Author } from "@/lib/dummy/blog";

interface Props {
    author: Author;
}

export default function AuthorCard({
    author,
}: Props) {
    return (
        <section className="bg-slate-950 py-16">
            <div className="container mx-auto max-w-5xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-[22px] border border-slate-800 bg-slate-900/80 p-5 shadow-sm sm:p-6 lg:p-8"
                >
                    <div className="flex flex-col items-center gap-5 text-center lg:flex-row lg:items-start lg:gap-6 lg:text-left">
                        <Image
                            src={author.avatar}
                            alt={author.name}
                            width={92}
                            height={92}
                            className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
                        />

                        <div className="flex-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300 sm:text-xs">Written By</p>
                            <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">{author.name}</h2>
                            <p className="mt-1 text-sm font-medium text-slate-400 sm:text-base">{author.role}</p>
                            <p className="mt-4 text-xs leading-6 text-slate-300 sm:text-sm sm:leading-7">{author.bio}</p>

                            <div className="mt-4 flex justify-center gap-2.5 lg:justify-start">
                                <a
                                    href={author.linkedin}
                                    className="rounded-full border border-slate-700 bg-slate-800 p-2 text-slate-200 transition hover:border-blue-400 hover:bg-blue-600 hover:text-white"
                                >
                                    <FaLinkedin size={15} />
                                </a>

                                <a
                                    href={author.twitter}
                                    className="rounded-full border border-slate-700 bg-slate-800 p-2 text-slate-200 transition hover:border-blue-400 hover:bg-blue-600 hover:text-white"
                                >
                                    <FaTwitter size={15} />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}