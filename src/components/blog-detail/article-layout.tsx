"use client";

import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import type { BlogPost } from "@/lib/dummy/blog";

interface Props {
    blog: BlogPost;
}

function getRenderableContent(content: string) {
    const trimmedContent = content.trim();
    const fencedContent = trimmedContent.match(
        /^```(?:html)?\s*([\s\S]*?)\s*```$/i
    );

    if (fencedContent) {
        return fencedContent[1];
    }

    if (
        /```/.test(trimmedContent) &&
        /<\s*(article|section|header|h[1-6]|p|ul|ol)\b/i.test(
            trimmedContent
        )
    ) {
        return trimmedContent
            .replace(/```(?:html)?\s*/gi, "")
            .replace(/```/g, "");
    }

    return content;
}

export default function ArticleLayout({
    blog,
}: Props) {
    const [progress, setProgress] =
        useState(0);

    useEffect(() => {
        const calculate = () => {
            const article =
                document.getElementById(
                    "article-content"
                );

            if (!article) return;

            const top =
                article.offsetTop;

            const height =
                article.offsetHeight;

            const scroll =
                window.scrollY;

            const viewport =
                window.innerHeight;

            const total =
                height - viewport;

            const current =
                scroll - top;

            const value =
                Math.min(
                    Math.max(
                        (current /
                            total) *
                        100,
                        0
                    ),
                    100
                );

            setProgress(value);
        };

        calculate();

        window.addEventListener(
            "scroll",
            calculate
        );

        return () =>
            window.removeEventListener(
                "scroll",
                calculate
            );
    }, []);

    const headings = useMemo(() => {
        return blog.tableOfContents;
    }, [blog]);

    return (
        <section className="bg-slate-950 py-12 lg:py-20">
            <div className="container mx-auto max-w-7xl px-4 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
                                <h3 className="text-base font-bold text-white">Table of Contents</h3>

                                <div className="mt-5 space-y-3">
                                    {headings.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className="flex items-center gap-3 text-sm font-medium text-slate-300 transition hover:text-blue-300"
                                        >
                                            <CheckCircle2 size={14} className="text-blue-300" />
                                            {item.title}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Progress</span>
                                    <span className="text-sm font-bold text-blue-300">{Math.round(progress)}%</span>
                                </div>

                                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-800">
                                    <motion.div
                                        animate={{ width: `${progress}%` }}
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Article */}

                    <article
                        id="article-content"
                        className="mx-auto max-w-4xl"
                    >
                        <div
                            className="
                            prose
                            prose-invert
                            prose-sm
                            sm:prose-base
                            max-w-none

                            prose-headings:scroll-mt-28
                            prose-headings:font-black
                            prose-headings:text-white
                            prose-h1:text-xl
                            prose-h2:text-[1.45rem]
                            prose-h3:text-lg

                            prose-p:leading-6
                            prose-p:text-slate-300
                            sm:prose-p:leading-7

                            prose-img:rounded-3xl
                            prose-pre:rounded-2xl

                            prose-code:before:hidden
                            prose-code:after:hidden

                            prose-a:text-blue-300
                            prose-a:no-underline
                            hover:prose-a:text-blue-200

                            prose-blockquote:border-blue-400
                            prose-blockquote:text-slate-200
                        "
                        >
                            <div
                                dangerouslySetInnerHTML={{
                                    __html:
                                        getRenderableContent(
                                            blog.content
                                        ),
                                }}
                            />
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}