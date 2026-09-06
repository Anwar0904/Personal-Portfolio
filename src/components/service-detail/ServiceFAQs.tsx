"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer:
      "Most projects are delivered within 4–16 weeks depending on complexity, integrations, team size, and project scope.",
  },
  {
    question: "Can ADM integrate AI into our existing software?",
    answer:
      "Yes. We specialize in integrating AI capabilities into existing applications including chatbots, workflow automation, document intelligence, recommendation systems and custom LLM solutions.",
  },
  {
    question: "Do you provide post-launch support?",
    answer:
      "Absolutely. Every project includes post-launch support, monitoring, optimization, security updates and optional long-term maintenance plans.",
  },
  {
    question: "Can your team work with our internal developers?",
    answer:
      "Yes. Our engineers regularly collaborate with in-house teams using Agile workflows, Git repositories, code reviews and modern DevOps practices.",
  },
  {
    question: "What industries do you work with?",
    answer:
      "Healthcare, Finance, Education, Government, Logistics, Manufacturing, Retail, SaaS, AI Startups and Enterprise Organizations.",
  },
  {
    question: "Can this service scale as our business grows?",
    answer:
      "Every solution is designed using scalable architecture so your platform can easily handle increasing users, traffic and business requirements.",
  },
];

export default function ServiceFAQs() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-slate-50 py-24">
      <div className="container mx-auto max-w-5xl px-4 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
            Questions We
            <span className="text-blue-600"> Often Receive</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Everything you need to know before starting your project
            with Arazi Digital Media.
          </p>
        </div>

        <div className="mt-20 space-y-5">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              layout
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <button
                onClick={() =>
                  setOpen(open === index ? -1 : index)
                }
                className="flex w-full items-center justify-between px-8 py-7 text-left"
              >
                <h3 className="pr-8 text-lg font-semibold text-slate-900 lg:text-xl">
                  {faq.question}
                </h3>

                <motion.div
                  animate={{
                    rotate: open === index ? 180 : 0,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50"
                >
                  <ChevronDown className="h-5 w-5 text-blue-600" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                  >
                    <div className="border-t border-slate-100 px-8 pb-8 pt-6">
                      <p className="leading-8 text-slate-600">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 rounded-[32px] bg-gradient-to-r from-blue-600 to-cyan-500 p-10 text-center text-white shadow-2xl">
          <h3 className="text-3xl font-bold">
            Still Have Questions?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Speak directly with our experts. We'll help you choose
            the right technology, architecture and engagement model
            for your business.
          </p>

          <a
            href="/consultation"
            className="mt-8 inline-flex rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 transition duration-300 hover:scale-105"
          >
            Schedule Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
}