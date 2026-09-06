// src/components/public/services/hero-section.tsx

"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  "AI-Powered Solutions",
  "Enterprise Software",
  "Cloud Native",
  "Modern UX/UI",
];

const stats = [
  { value: "50+", label: "Engagements Delivered" },
  { value: "98%", label: "Organization Satisfaction" },
  { value: "24/7", label: "Support" },
];

export default function ServicesHeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_28%),linear-gradient(180deg,#040b15_0%,#071423_38%,#091827_100%)]">
      <div className="absolute inset-0">
        <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute right-0 top-20 h-[360px] w-[360px] rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-indigo-400/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-6 pt-28 pb-20 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
              <Sparkles className="h-4 w-4" />
              Professional Digital Solutions
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build Digital Products
              <span className="block bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                That Scale With Your Business
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              ADM designs and develops high-performance digital products,
              enterprise platforms, AI-powered solutions, and modern web
              applications that help businesses grow faster.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur"
                >
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  <span className="font-medium text-slate-100">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.03]"
              >
                Book Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-slate-900/40 px-8 py-4 font-semibold text-slate-100 transition-all duration-300 hover:border-blue-400 hover:text-blue-300"
              >
                View Portfolio
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/70 shadow-[0_30px_80px_rgba(2,6,23,0.7)] backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
                alt="ADM Services"
                className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[580px]"
              />
            </div>

            <div className="absolute -left-4 top-8 rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl backdrop-blur md:left-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">
                AI Ready
              </p>
              <h3 className="mt-1 text-lg font-bold text-white">
                Enterprise Solutions
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Secure • Scalable • Reliable
              </p>
            </div>

            <div className="absolute -bottom-6 left-1/2 flex w-[95%] -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/85 p-4 shadow-2xl backdrop-blur">
              {stats.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex-1 text-center ${index !== stats.length - 1 ? "border-r border-slate-800" : ""
                    }`}
                >
                  <h4 className="text-2xl font-black text-blue-400">
                    {item.value}
                  </h4>
                  <p className="mt-1 text-sm text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}