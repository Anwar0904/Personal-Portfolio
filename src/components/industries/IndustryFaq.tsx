"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    { question: "Can ADM build software specifically for my industry?", answer: "Absolutely. Every ADM solution is tailored around your industry's workflows, regulations, users and long-term business goals rather than using generic templates." },
    { question: "Do you provide AI integration for existing businesses?", answer: "Yes. We can integrate AI into your existing systems including chatbots, automation, document processing, recommendation engines and custom AI assistants." },
    { question: "Can you modernize our legacy software?", answer: "Yes. We redesign outdated applications, migrate databases, modernize architecture and improve performance without disrupting your business." },
    { question: "How do you ensure security and scalability?", answer: "Every project follows enterprise security practices including authentication, authorization, encryption, secure APIs, monitoring and cloud-native architecture." },
    { question: "Will ADM continue supporting the project after launch?", answer: "Yes. We provide continuous maintenance, monitoring, optimization, feature development and long-term technical partnership." },
    { question: "Which industries do you specialize in?", answer: "Healthcare, Finance, Education, Retail, Manufacturing, Logistics, Government, Real Estate and Enterprise Digital Transformation." },
];

export default function IndustryFaq() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section className="bg-slate-950 py-24">
            <div className="container mx-auto max-w-5xl px-4 lg:px-8">
                <div className="text-center">
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        FAQ
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-white lg:text-5xl">
                        Frequently Asked
                        <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            Questions
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-300">
                        Everything clients usually ask before starting a project with ADM.
                    </p>
                </div>

                <div className="mt-16 space-y-5">
                    {faqs.map((faq, index) => {
                        const active = open === index;

                        return (
                            <motion.div layout key={faq.question} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-sm">
                                <button onClick={() => setOpen(active ? null : index)} className="flex w-full items-center justify-between p-7 text-left">
                                    <h3 className="pr-6 text-lg font-bold text-white lg:text-xl">{faq.question}</h3>
                                    <motion.div animate={{ rotate: active ? 180 : 0 }}>
                                        <ChevronDown className="h-6 w-6 text-blue-300" />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {active && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }}>
                                            <div className="border-t border-slate-800 px-7 pb-7 pt-6">
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