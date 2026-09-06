"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "How long does a typical project take?",
        answer:
            "Project duration depends on scope and complexity. Most business websites are delivered within 4–8 weeks, while enterprise platforms and AI-powered products typically require 8–20 weeks including research, design, development, testing, and deployment.",
    },
    {
        question: "Can you redesign an existing product?",
        answer:
            "Absolutely. We specialize in redesigning existing websites, dashboards, SaaS products, mobile applications, and enterprise systems while improving UX, performance, accessibility, and conversion rates.",
    },
    {
        question: "Do you provide AI integration services?",
        answer:
            "Yes. ADM builds AI-powered applications using LLMs, Retrieval-Augmented Generation (RAG), automation agents, intelligent search, recommendation engines, chatbots, workflow automation, and custom AI solutions.",
    },
    {
        question: "Will my project be responsive?",
        answer:
            "Every interface we build follows a mobile-first strategy and is optimized for desktop, tablet, and mobile devices with smooth animations and excellent performance.",
    },
    {
        question: "Do you provide long-term support?",
        answer:
            "Yes. We provide maintenance, monitoring, security updates, performance optimization, feature enhancements, cloud deployment, and technical support after launch.",
    },
    {
        question: "How do we start working together?",
        answer:
            "Simply book a consultation. We'll discuss your goals, analyze your requirements, propose a roadmap, estimate timelines, and prepare a detailed project proposal.",
    },
];

export default function PortfolioFAQ() {
    const [active, setActive] = useState(0);

    return (
        <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
            <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[130px]" />
            <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-cyan-400/10 blur-[130px]" />

            <div className="container relative mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-16 max-w-3xl text-center"
                >
                    <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
                        Frequently Asked Questions
                    </span>

                    <h2 className="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl">
                        Everything You Need
                        <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            Before Starting
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-300">
                        We believe transparency builds trust. Here are answers to the
                        questions clients ask us most.
                    </p>
                </motion.div>

                <div className="mx-auto max-w-5xl space-y-5">
                    {faqs.map((faq, index) => {
                        const opened = active === index;

                        return (
                            <motion.div
                                key={faq.question}
                                initial={{ opacity: 0, y: 35 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 shadow-sm transition-all hover:shadow-xl"
                            >
                                <button
                                    onClick={() => setActive(opened ? -1 : index)}
                                    className="flex w-full items-center justify-between px-8 py-7 text-left"
                                >
                                    <h3 className="pr-8 text-lg font-bold text-white md:text-xl">
                                        {faq.question}
                                    </h3>

                                    <motion.div
                                        animate={{ rotate: opened ? 180 : 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-300"
                                    >
                                        <ChevronDown />
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {opened && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="border-t border-white/10 px-8 pb-8 pt-6">
                                                <p className="text-lg leading-8 text-slate-300">{faq.answer}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mt-16 max-w-4xl rounded-[32px] bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 p-10 text-center text-white"
                >
                    <h3 className="text-3xl font-black">Still Have Questions?</h3>

                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
                        Our experts are happy to discuss your project, recommend the
                        best solution, and answer every technical or business question.
                    </p>

                    <button className="mt-8 rounded-2xl bg-white px-8 py-4 font-semibold text-blue-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        Talk With Our Experts
                    </button>
                </motion.div>
            </div>
        </section>
    );
}