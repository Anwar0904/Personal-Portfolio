"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  Landmark,
  Cpu,
  ArrowRight,
} from "lucide-react";

const industries = [
  {
    title: "Healthcare",
    description:
      "AI-powered healthcare platforms, patient management and automation.",
    icon: HeartPulse,
    projects: "12 Projects",
    color: "from-red-500/20 to-pink-500/10",
  },
  {
    title: "Finance",
    description:
      "Secure fintech systems, analytics dashboards and automation.",
    icon: Landmark,
    projects: "18 Projects",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    title: "E-Commerce",
    description:
      "Scalable shopping experiences with intelligent recommendations.",
    icon: ShoppingBag,
    projects: "25 Projects",
    color: "from-violet-500/20 to-fuchsia-500/10",
  },
  {
    title: "Education",
    description:
      "Learning management systems and AI education platforms.",
    icon: GraduationCap,
    projects: "15 Projects",
    color: "from-amber-500/20 to-orange-500/10",
  },
  {
    title: "Enterprise",
    description:
      "Digital transformation for modern businesses and organizations.",
    icon: Building2,
    projects: "21 Projects",
    color: "from-sky-500/20 to-blue-500/10",
  },
  {
    title: "Technology",
    description:
      "SaaS platforms, AI products and next-generation software.",
    icon: Cpu,
    projects: "30 Projects",
    color: "from-cyan-500/20 to-indigo-500/10",
  },
];

export default function IndustriesShowcase() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-200">
            Industries We Empower
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl">
            Solutions Designed Around
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Real Business Domains
            </span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Every industry has unique challenges. We build digital products that
            solve industry-specific problems while maintaining enterprise-grade
            performance and exceptional user experience.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((industry, index) => {
            const Icon = industry.icon;

            return (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-sm transition-all duration-500 hover:border-blue-400/40 hover:shadow-2xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                    <Icon size={30} />
                  </div>

                  <h3 className="mt-8 text-2xl font-bold text-white">{industry.title}</h3>

                  <p className="mt-4 leading-7 text-slate-300">{industry.description}</p>

                  <div className="mt-8 flex items-center justify-between">
                    <span className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200">
                      {industry.projects}
                    </span>

                    <Link
                      href="/industries"
                      className="flex items-center gap-2 font-semibold text-blue-300 transition-all group-hover:gap-3"
                    >
                      Explore
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 rounded-[2rem] bg-gradient-to-r from-blue-600 to-cyan-500 p-10 text-white lg:p-14"
        >
          <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
            <div>
              <h3 className="text-3xl font-black">Need a solution for your industry?</h3>

              <p className="mt-4 max-w-2xl text-blue-100">
                Our team researches your business domain before writing a single
                line of code, ensuring every project solves real operational
                challenges.
              </p>
            </div>

            <Link
              href="/consultation"
              className="rounded-2xl bg-white px-8 py-4 font-bold text-blue-700 transition hover:scale-105"
            >
              Discuss Your Industry
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}