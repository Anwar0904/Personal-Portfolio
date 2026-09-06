
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesCTASection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_25%),linear-gradient(135deg,#020b17_0%,#071a2d_35%,#0c2342_100%)] py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_40%)] opacity-10" />

      <motion.div
        initial={{ opacity: 0, scale: .95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-5xl px-6 text-center text-white"
      >
        <span className="rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm font-semibold backdrop-blur">
          Let's Build Together
        </span>

        <h2 className="mt-8 text-4xl font-black lg:text-6xl">
          Ready To Turn
          <span className="block text-blue-300">
            Your Idea Into Reality?
          </span>
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-200">
          Whether you're launching a startup, transforming an enterprise,
          or integrating Artificial Intelligence into your business,
          ADM is ready to help.
        </p>

        <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">
          <Link
            href="/consultation"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 font-bold text-blue-700 transition hover:scale-105"
          >
            Book Free Consultation

            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-slate-900/30 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/10"
          >
            Contact Our Team
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
