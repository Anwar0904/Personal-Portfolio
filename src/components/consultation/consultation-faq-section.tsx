"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "Is the consultation free?",
        answer:
            "Yes. Your initial consultation with ADM is completely free. We discuss your project goals, challenges, and recommend the best technical approach without any obligation.",
    },
    {
        question: "How long does a consultation usually take?",
        answer:
            "Most consultations take between 30 and 60 minutes depending on the project scope and complexity.",
    },
    {
        question: "What should I prepare before the meeting?",
        answer:
            "It's helpful to have your business goals, project idea, preferred features, examples you like, and any existing documents or designs ready to share.",
    },
    {
        question: "Do you sign NDAs?",
        answer:
            "Absolutely. We respect client confidentiality and are happy to sign a Non-Disclosure Agreement before discussing sensitive ideas.",
    },
    {
        question: "Can ADM handle both design and development?",
        answer:
            "Yes. We provide complete end-to-end capabilities including UI/UX design, digital platforms, mobile applications, branding, AI and intelligent systems, and ongoing support.",
    },
    {
        question: "Will I receive a project estimate?",
        answer:
            "Yes. After understanding your requirements, we prepare a detailed proposal including timeline, milestones, recommended technologies, and estimated budget.",
    },
];

export default function ConsultationFaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        Frequently Asked Questions
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-white lg:text-6xl">
                        Everything You Need To Know
                    </h2>

                    <p className="mt-6 text-lg leading-9 text-slate-300">
                        Answers to common questions before scheduling your consultation.
                    </p>
                </motion.div>

                <div className="mx-auto mt-20 max-w-4xl space-y-5">
                    {faqs.map((faq, index) => {
                        const open = openIndex === index;

                        return (
                            <motion.div
                                key={faq.question}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-sm transition-all duration-300 hover:shadow-xl"
                            >
                                <button
                                    onClick={() =>
                                        setOpenIndex(open ? null : index)
                                    }
                                    className="flex w-full items-center justify-between gap-5 px-8 py-7 text-left"
                                >
                                    <h3 className="text-lg font-bold text-white lg:text-xl">{faq.question}</h3>

                                    <motion.div animate={{ rotate: open ? 180 : 0 }}>
                                        <ChevronDown className="text-blue-300" />
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {open && (
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
                                                duration: 0.25,
                                            }}
                                        >
                                            <div className="border-t border-slate-800 px-8 pb-8 pt-6">
                                                <p className="leading-8 text-slate-300">{faq.answer}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}