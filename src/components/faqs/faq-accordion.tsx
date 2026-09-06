"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import {
    faqCategories,
    faqs,
} from "@/lib/dummy/faqs";

export default function FAQAccordion() {
    const [category, setCategory] =
        useState("general");

    const [open, setOpen] =
        useState<string | null>("1");

    const filtered = useMemo(
        () =>
            faqs.filter(
                (faq) =>
                    faq.category ===
                    category
            ),
        [category]
    );

    return (
        <section className="bg-slate-50 py-24">
            <div className="container mx-auto max-w-5xl px-4">
                <div className="mb-12 flex flex-wrap justify-center gap-3">
                    {faqCategories.map(
                        (item) => (
                            <button
                                key={item.id}
                                onClick={() =>
                                    setCategory(
                                        item.id
                                    )
                                }
                                className={`rounded-full px-6 py-3 text-sm font-semibold transition-all ${category ===
                                        item.id
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "border border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600"
                                    }`}
                            >
                                {item.title}
                            </button>
                        )
                    )}
                </div>

                <div className="space-y-5">
                    {filtered.map(
                        (faq) => {
                            const isOpen =
                                open ===
                                faq.id;

                            return (
                                <motion.div
                                    key={
                                        faq.id
                                    }
                                    layout
                                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                                >
                                    <button
                                        onClick={() =>
                                            setOpen(
                                                isOpen
                                                    ? null
                                                    : faq.id
                                            )
                                        }
                                        className="flex w-full items-center justify-between gap-6 px-7 py-6 text-left"
                                    >
                                        <h3 className="text-lg font-bold text-slate-900">
                                            {
                                                faq.question
                                            }
                                        </h3>

                                        <motion.div
                                            animate={{
                                                rotate:
                                                    isOpen
                                                        ? 180
                                                        : 0,
                                            }}
                                        >
                                            <ChevronDown />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                transition={{
                                                    duration: .25,
                                                }}
                                            >
                                                <div className="border-t border-slate-100 px-7 pb-7 pt-5">
                                                    <p className="leading-8 text-slate-600">
                                                        {
                                                            faq.answer
                                                        }
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        }
                    )}
                </div>
            </div>
        </section>
    );
}