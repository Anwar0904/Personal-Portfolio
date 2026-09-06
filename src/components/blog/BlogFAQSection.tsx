"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    MessageCircleQuestion,
} from "lucide-react";

const faqs = [
    {
        question: "How often do you publish new articles?",
        answer:
            "We publish fresh insights every week covering AI, technology engineering, digital platforms, cloud computing, cybersecurity, blockchain, UI/UX and digital transformation.",
    },
    {
        question: "Can I subscribe to receive new articles?",
        answer:
            "Absolutely. Subscribe to our newsletter and you'll receive our latest articles, tutorials, case studies and industry insights directly in your inbox.",
    },
    {
        question: "Who writes the articles on ADM Blog?",
        answer:
            "Our articles are written by experienced engineers, designers, cloud architects, AI specialists and digital consultants working on real-world projects every day.",
    },
    {
        question: "Can I share or reference your articles?",
        answer:
            "Yes. You're welcome to reference or share our articles with proper attribution. For commercial reuse, please contact our team.",
    },
    {
        question: "Do you accept guest posts?",
        answer:
            "Yes. We occasionally collaborate with industry experts. If you have valuable technical knowledge to share, we'd love to hear from you.",
    },
    {
        question: "Can I request an article on a specific topic?",
        answer:
            "Definitely. We actively collect topic requests from our readers and prioritize subjects that provide the greatest value to our community.",
    },
];

export default function BlogFAQSection() {
    const [open, setOpen] = useState<number>(0);

    return (
        <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[160px]" />
            </div>

            <div className="container mx-auto max-w-5xl px-4 lg:px-8">
                {/* Heading */}

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        <MessageCircleQuestion size={16} />
                        Frequently Asked Questions
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-white lg:text-6xl">
                        Everything You Need
                        <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            To Know
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-slate-300">
                        Answers to the questions we receive most often from our readers and subscribers.
                    </p>
                </motion.div>

                {/* FAQ */}

                <div className="space-y-5">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.question}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.08,
                            }}
                            className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 shadow-sm transition-all hover:shadow-lg"
                        >
                            <button
                                onClick={() =>
                                    setOpen(open === index ? -1 : index)
                                }
                                className="flex w-full items-center justify-between gap-5 p-7 text-left lg:p-8"
                            >
                                <h3 className="text-lg font-bold text-white lg:text-xl">{faq.question}</h3>

                                <motion.div
                                    animate={{ rotate: open === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-300"
                                >
                                    <ChevronDown size={22} />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {open === index && (
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
                                            duration: 0.3,
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-slate-800 px-7 pb-7 pt-6 lg:px-8 lg:pb-8">
                                            <p className="leading-8 text-slate-300">{faq.answer}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Card */}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 rounded-[32px] bg-gradient-to-r from-blue-600 to-cyan-500 p-[1px]"
                >
                    <div className="rounded-[31px] border border-slate-800 bg-slate-950 px-10 py-12 text-center">
                        <h3 className="text-3xl font-black text-white">Still have questions?</h3>
                        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                            Contact the ADM team and we&apos;ll be happy to answer your questions about our articles, technologies or services.
                        </p>

                        <button className="mt-8 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-500">
                            Contact Our Team
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
