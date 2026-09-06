// src/components/public/services/process-section.tsx

"use client";

import { motion } from "framer-motion";
import {
  Search,
  PenTool,
  Code2,
  Rocket,
  BarChart3,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discovery",
    description:
      "Understanding your business, market, users and technical requirements before writing a single line of code.",
  },
  {
    icon: PenTool,
    title: "Strategy & Design",
    description:
      "Wireframes, UI/UX, architecture planning and project roadmap designed for long-term scalability.",
  },
  {
    icon: Code2,
    title: "Development",
    description:
      "Agile development using modern technologies with continuous testing and transparent communication.",
  },
  {
    icon: Rocket,
    title: "Launch",
    description:
      "Production deployment, performance optimization, SEO, security hardening and monitoring.",
  },
  {
    icon: BarChart3,
    title: "Growth",
    description:
      "Continuous improvements, analytics, AI optimization and feature expansion as your business evolves.",
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
            ADM Methodology
          </span>

          <h2 className="mt-6 text-4xl font-black text-white lg:text-5xl">
            How We Transform
            <span className="block text-blue-400">
              Your Vision Into Reality
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Every successful digital product follows a proven process that
            minimizes risk while maximizing business impact.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 rounded-full bg-slate-800 lg:block" />

          <div className="space-y-14">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const reverse = index % 2 === 1;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  className={`grid items-center gap-10 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                >
                  <div
                    className={`rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/40 hover:shadow-2xl ${reverse ? "lg:text-right" : ""
                      }`}
                  >
                    <div
                      className={`mb-6 flex ${reverse ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div className="rounded-2xl bg-blue-500/10 p-4">
                        <Icon className="h-8 w-8 text-blue-300" />
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-5 leading-8 text-slate-300">
                      {step.description}
                    </p>
                  </div>

                  <div
                    className={`relative flex ${reverse ? "justify-start" : "justify-end"
                      } lg:justify-center`}
                  >
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-8 border-slate-950 bg-blue-600 text-2xl font-black text-white shadow-xl">
                      {index + 1}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}