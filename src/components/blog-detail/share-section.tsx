"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
    Link2,
    Share2
} from "lucide-react";

import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";

import { toast } from "sonner";

import type { BlogPost } from "@/lib/dummy/blog";

interface Props {
    blog: BlogPost;
}

export default function ShareSection({
    blog,
}: Props) {
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setShareUrl(window.location.href);
        }
    }, []);

    const copyLink = async () => {
        const currentUrl =
            shareUrl || `/blogs/${blog.slug}`;

        await navigator.clipboard.writeText(
            currentUrl
        );

        toast.success(
            "Article link copied."
        );
    };

    const encodedTitle =
        encodeURIComponent(blog.title);

    const encodedUrl =
        shareUrl
            ? encodeURIComponent(shareUrl)
            : "";

    return (
        <section className="bg-slate-950 py-16">
            <div className="container mx-auto max-w-4xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-[20px] border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-sm sm:p-5"
                >
                    <div className="flex flex-col items-center justify-between gap-4 lg:flex-row lg:gap-6">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Share2 className="text-blue-300" size={15} />
                                <h3 className="text-lg font-black text-white sm:text-xl">Share this article</h3>
                            </div>

                            <p className="mt-1 text-xs text-slate-300 sm:text-sm">Help others discover this article.</p>
                        </div>

                        <div className="flex flex-wrap gap-2.5 sm:gap-3">
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                                target="_blank"
                                className="rounded-full border border-slate-700 bg-slate-800 p-2.5 text-slate-200 transition hover:border-blue-400 hover:bg-blue-600 hover:text-white"
                            >
                                <FaTwitter size={15} />
                            </a>

                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                                target="_blank"
                                className="rounded-full border border-slate-700 bg-slate-800 p-2.5 text-slate-200 transition hover:border-blue-400 hover:bg-blue-600 hover:text-white"
                            >
                                <FaLinkedin size={15} />
                            </a>

                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                                target="_blank"
                                className="rounded-full border border-slate-700 bg-slate-800 p-2.5 text-slate-200 transition hover:border-blue-400 hover:bg-blue-600 hover:text-white"
                            >
                                <FaFacebook size={15} />
                            </a>

                            <button
                                onClick={copyLink}
                                className="rounded-full border border-slate-700 bg-slate-800 p-2.5 text-slate-200 transition hover:border-blue-400 hover:bg-blue-600 hover:text-white"
                            >
                                <Link2 size={15} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}